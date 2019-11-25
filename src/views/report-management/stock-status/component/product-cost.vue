<template>
  <!-- 页面主容器 -->
  <div class="myEcharts">
    <!-- 查询容器 -->
    <div class="filter-container">
      <!-- 左侧box -->
      <div class="filter-left-box">
        <div class="filter-item">
          <el-date-picker
            v-model="queryParams.year"
            type="year"
            placeholder="选择年份筛选"
            value-format="yyyy"
            @change="queryHandle"
          />
        </div>
        <div class="filter-item">
          <el-select v-model="queryParams.typeIdList" filterable multiple placeholder="请选择物料类型" style="width: 750px">
            <el-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.typeName"
              :value="item.id"
            />
          </el-select>
        </div>
        <div class="filter-item">
          <el-button type="primary" @click="queryHandle">查询</el-button>
        </div>
      </div>

      <!-- 右侧box -->
      <div class="filter-right-box"><span class="unit" /></div>
    </div>
    <!-- 主要内容容器 -->
    <div class="content-container">
      <el-table
        v-loading="loading"
        :data="data"
        border
        stripe
        show-summary
        :summary-method="getSummaries"
        style="width:100%"
      >
        <el-table-column prop="month" label="月份" width="120" align="center" />
        <el-table-column prop="output" :label="`产量 \n (t)`" width="150" align="center" />
        <el-table-column :label="`消耗明细(不含主材和油漆) \n 单位：元`" align="center">
          <template>
            <!--
              :prop="item.details.totalMoney"
              -->
            <el-table-column
              v-for="(item, index) in dataHead"
              :key="index"
              :label="item.typeName"
              align="center"
              min-width="100"
            >
              <template slot-scope="scope">
                <span>{{ item.newDetails[scope.row.value - 1].totalMoney }}</span>
              </template>
            </el-table-column>
          </template>

          <el-table-column prop="sumMoney" label="总额" align="center" />
          <el-table-column prop="average" label="平均成本" align="center" />
        </el-table-column>
      </el-table>
    </div>
    <!-- 其他模块（例如弹窗等） -->
  </div>
</template>

<script>
import moment from 'moment'
import { productCost } from '@/api/report'
import { fetchTypeList } from '@/api/material'
import { dataMonth, monthData } from '@/utils/product-cost'
export default {
  name: 'ReportManagementProduct',
  data() {
    return {
      typeList: [],
      formType: { formType: 4 },
      data: dataMonth,
      dataHead: [],
      queryParams: {
        typeIdList: [],
        year: moment(new Date()).format('YYYY')
      },
      loading: false
    }
  },
  mounted() {
    this.getList()
    this.data = JSON.parse(JSON.stringify(dataMonth))
  },
  methods: {
    getList() {
      this.loading = true
      this.dataHead = []
      this.data = JSON.parse(JSON.stringify(dataMonth))
      productCost(this.queryParams).then(({ data, code, message }) => {
        if (code === 200) {
          if (data && data.length) {
            data.forEach(v => {
              if (v && v.details) {
                const _tempData = JSON.parse(JSON.stringify(monthData))
                v.details.forEach(child => {
                  const _index = Number(child.month) - 1
                  _tempData[_index].totalMoney = Number((child.totalMoney).toFixed(0)) || 0
                  // 计算总额
                  if (v.typeName !== '产量(t)') {
                    this.data[_index].sumMoney += _tempData[_index].totalMoney
                  } else {
                    this.data[_index]['output'] = _tempData[_index].totalMoney
                  }
                })
                v.newDetails = _tempData
              }
              // if (v && v.typeName === '产量(t)') {
              //   v.newDetails.forEach(c => {
              //     this.data[c.month - 1]['output'] = c.totalMoney
              //   })
              // }
            })
            console.log(this.data, 'this.data----')
            this.dataHead = data.filter(v => v.typeName !== '产量(t)')
            this.data.forEach(v => {
              v.average = v.sumMoney && v.output ? ((v.sumMoney || 0) / (v.output || 0)).toFixed(0) : '0'
            })
          }
        } else {
          this.$message.error(message)
        }
        this.loading = false
      }).catch(e => {
        this.loading = false
        this.$message.error(e)
      })
      fetchTypeList(this.formType).then(({ data, code, message }) => {
        if (code === 200) {
          this.typeList = data
        } else {
          this.$message.error(message)
        }
      }).catch(e => {
        this.$message.error(e)
      })
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      // index 下标
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if (index === 1 || index === columns.length - 1 || index === columns.length - 2) {
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            if (index === 1) {
              sums[index] += ' t'
            } else {
              sums[index] += ' 元'
            }
          } else {
            sums[index] = '0 元'
          }
          return
        }
        sums[index] = this.dataHead[index - 2].newDetails.reduce((prev, curr) => {
          const value = Number(curr.totalMoney)
          if (!isNaN(value)) {
            return prev + curr.totalMoney
          } else {
            return prev
          }
        }, 0)
        sums[index] += ' 元'
      })
      return sums
    },
    queryHandle() {
      this.getList()
    }
  }
}
</script>

<style scoped>
.filter-right-box .unit {
  font-size: 20px;
}
</style>
