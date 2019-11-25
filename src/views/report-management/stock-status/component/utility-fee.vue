<template>
  <!-- 页面主容器 -->
  <div class="myEcharts">
    <!-- 查询容器 -->
    <div class="filter-container">
      <!-- 左侧box -->
      <div class="filter-left-box">
        <div class="filter-item">
          <el-date-picker
            v-model="year"
            type="year"
            :clearable="false"
            placeholder="选择年份筛选"
            value-format="yyyy"
            @change="changeDate"
          />
        </div>
      </div>
      <!-- 右侧box -->
      <div class="filter-right-box" />
    </div>
    <!-- 主要内容容器 -->
    <div class="content-container">
      <el-table
        v-loading="tableLoading"
        :data="tableData"
        border
        :summary-method="getSummaries"
        show-summary
        style="width: 100%;"
      >
        <el-table-column label="序号" align="center" type="index" width="100" />
        <el-table-column prop="monthValue" label="月份" align="center" min-width="80" />
        <el-table-column prop="base" label="底数(kwh)" align="center" min-width="160">
          <template slot-scope="scope">
            <span v-if="scope.row.isOld && !scope.row.edit">{{ scope.row.base }}</span>
            <el-input-number v-else v-model="scope.row.base" size="small" :step="50" :min="0" :max="scope.row.meterReadings" @change="changeData(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column prop="meterReadings" label="抄表数(kwh)" align="center" min-width="160">
          <template slot-scope="scope">
            <span v-if="scope.row.isOld && !scope.row.edit">{{ scope.row.meterReadings }}</span>
            <el-input-number v-else v-model="scope.row.meterReadings" size="small" :step="50" :min="scope.row.base" @change="changeData(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column prop="realNum" label="实用数(kwh)" align="center" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.realNum }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="totalMoney" label="电费总额(元)" align="center" min-width="200">
          <template slot-scope="scope">
            <span v-if="scope.row.isOld && !scope.row.edit">{{ scope.row.totalMoney }}</span>
            <el-input-number v-else v-model="scope.row.totalMoney" size="small" :step="50" :min="0" :precision="2" style="width:180px" @change="changeData(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column prop="average" label="平均电价(kwh/元)" align="center" min-width="140">
          <template slot-scope="scope">
            <el-tag type="success"> {{ scope.row.average }}  </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <div v-permission="['50_207_1']">
              <template v-if="scope.row.isOld">
                <el-button v-if="!scope.row.edit" type="primary" size="small" icon="el-icon-edit" @click="scope.row.edit=!scope.row.edit">编辑</el-button>
                <el-button v-if="scope.row.edit" type="success" size="small" icon="el-icon-circle-plus-outline" @click="confirmRow(scope.row)">保存</el-button>
                <el-button v-if="scope.row.edit" class="cancel-btn" size="small" icon="el-icon-refresh" type="warning" @click="cancelEdit(scope.row)">取消</el-button>
              </template>
              <template v-else>
                <el-button type="success" size="small" icon="el-icon-circle-plus-outline" @click="confirmRow(scope.row)">保存</el-button>
              </template>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 其他模块（例如弹窗等） -->
  </div>
</template>

<script>
import moment from 'moment'
import { fetchUtilityFee, updateUtilityFee } from '@/api/report'
const monthData = [
  { monthValue: '1月', month: '01', base: 0, meterReadings: 0, totalMoney: 0, realNum: 0, average: '0.00', isOld: false, edit: false },
  { monthValue: '2月', month: '02', base: 0, meterReadings: 0, totalMoney: 0, realNum: 0, average: '0.00', isOld: false, edit: false },
  { monthValue: '3月', month: '03', base: 0, meterReadings: 0, totalMoney: 0, realNum: 0, average: '0.00', isOld: false, edit: false },
  { monthValue: '4月', month: '04', base: 0, meterReadings: 0, totalMoney: 0, realNum: 0, average: '0.00', isOld: false, edit: false },
  { monthValue: '5月', month: '05', base: 0, meterReadings: 0, totalMoney: 0, realNum: 0, average: '0.00', isOld: false, edit: false },
  { monthValue: '6月', month: '06', base: 0, meterReadings: 0, totalMoney: 0, realNum: 0, average: '0.00', isOld: false, edit: false },
  { monthValue: '7月', month: '07', base: 0, meterReadings: 0, totalMoney: 0, realNum: 0, average: '0.00', isOld: false, edit: false },
  { monthValue: '8月', month: '08', base: 0, meterReadings: 0, totalMoney: 0, realNum: 0, average: '0.00', isOld: false, edit: false },
  { monthValue: '9月', month: '09', base: 0, meterReadings: 0, totalMoney: 0, realNum: 0, average: '0.00', isOld: false, edit: false },
  { monthValue: '10月', month: '10', base: 0, meterReadings: 0, totalMoney: 0, realNum: 0, average: '0.00', isOld: false, edit: false },
  { monthValue: '11月', month: '11', base: 0, meterReadings: 0, totalMoney: 0, realNum: 0, average: '0.00', isOld: false, edit: false },
  { monthValue: '12月', month: '12', base: 0, meterReadings: 0, totalMoney: 0, realNum: 0, average: '0.00', isOld: false, edit: false }
]
export default {
  name: 'ReportManagementUtility',
  data() {
    return {
      year: moment(new Date()).format('YYYY'),
      tableData: [],
      tableLoading: false
    }
  },
  mounted() {
    this.tableData = JSON.parse(JSON.stringify(monthData))
    this.getUtilityFee()
  },
  methods: {
    // 退出修改
    cancelEdit: function(row) {
      row.number = row.originalNum
      row.base = row.orginBase
      row.meterReadings = row.orginMeterReadings
      row.totalMoney = row.orginTotalMoney
      row.edit = false
      this.$message({ message: '已退出修改', type: 'warning' })
    },
    changeData: function(row) {
      row.realNum = (row.meterReadings || 0) - (row.base || 0)
      row.average = (row.totalMoney || 0) && row.realNum ? (row.totalMoney / row.realNum).toFixed(2) : '0.00'
    },
    changeDate: function() {
      this.tableData = JSON.parse(JSON.stringify(monthData))
      this.getUtilityFee()
    },
    getUtilityFee: function() {
      this.tableLoading = true
      fetchUtilityFee({ year: this.year }).then(({ data, code, message }) => {
        if (code === 200) {
          if (data && data.length) {
            // this.tableData
            data.forEach(v => {
              const index = Number(v.month) - 1
              this.tableData[index].base = v.base
              this.tableData[index].meterReadings = v.meterReadings
              this.tableData[index].totalMoney = v.totalMoney
              this.tableData[index].realNum = (v.meterReadings || 0) - (v.base || 0)
              this.tableData[index].average = (this.tableData[index].totalMoney || 0) && this.tableData[index].realNum ? (this.tableData[index].totalMoney / this.tableData[index].realNum).toFixed(2) : '0.00'
              this.tableData[index].edit = false
              this.tableData[index].isOld = true
              this.tableData[index].orginBase = v.base
              this.tableData[index].orginMeterReadings = v.meterReadings
              this.tableData[index].orginTotalMoney = v.totalMoney
            })
          }
        } else {
          this.$message({ message: message, type: 'error' })
        }
        this.tableLoading = false
      }).catch(e => {
        this.tableLoading = false
        console.log(e)
        this.$message({ message: '获取水电费失败', type: 'error' })
      })
    },
    confirmRow: function(row) {
      if (this.year === undefined) {
        this.$message({ message: '选择年份', type: 'warning' })
        return
      }
      if (row.base === undefined) {
        this.$message({ message: '请填写底数', type: 'warning' })
        return
      }
      if (row.meterReadings === undefined) {
        this.$message({ message: '请填写抄表数', type: 'warning' })
        return
      }
      if (row.totalMoney === undefined) {
        this.$message({ message: '请填写总费用', type: 'warning' })
        return
      }
      const _data = Object.assign({ year: this.year }, row)
      updateUtilityFee(_data).then(({ data, code, message }) => {
        if (code === 200) {
          row.originalNum = row.number
          row.orginBase = row.base
          row.orginMeterReadings = row.meterReadings
          row.orginTotalMoney = row.totalMoney
          row.isOld = true
          row.edit = false
          this.$message({ message: '保存成功', type: 'success' })
        } else {
          this.$message({ message: message, type: 'error' })
        }
      }).catch(e => {
        console.log(e)
        this.$message({ message: '保存失败', type: 'error' })
      })
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if (index === 1) {
          sums[index] = `${this.year}年`
          return
        }
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
          if (index === 6) sums[index] = sums[index].toFixed(2)
        } else {
          sums[index] = 0
        }
        if (index === 2) {
          sums[index] += ' kwh'
        }
        if (index === 3) {
          sums[index] += ' kwh'
        }
        if (index === 4) {
          sums[index] += ' kwh'
        }
        if (index === 5) {
          sums[index] += ' 元'
        }
        if (index === 6) {
          sums[index] += ' 元'
        }
        if (index === 7) {
          sums[index] = ''
        }
      })
      return sums
    }
  }
}
</script>

<style scoped>

</style>
