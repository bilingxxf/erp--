<template>
  <!-- 页面主容器 -->
  <div class="page-container">
    <!-- 查询容器 -->
    <div class="filter-container">
      <!-- 左侧box -->
      <div class="filter-left-box">
        <div class="filter-item">
          <div style="margin-top: 25px">年份筛选：</div>
          <div class="block">
            <el-date-picker
              v-model="filed.year"
              type="year"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="selectDateHandle"
            />
          </div>
          <!-- <el-input v-model="searchInp" class="search" clearable filterable placeholder="请输入您要搜索的内容" /> -->
        </div>
      </div>
    </div>
    <!-- 主要内容容器 -->
    <div class="content-container">
      <el-table
        v-loading="loading"
        :data="data"
        tooltip-effect="dark"
        style="width: 100%"
        stripe
        border
        :header-cell-style="headerBg"
      >
        <el-table-column
          type="index"
          label="序号"
          width="130"
          align="center"
        />
        <el-table-column
          label="供应商"
          align="center"
        >
          <template slot-scope="scope">{{ scope.row.supplierName }}</template>
        </el-table-column>
        <el-table-column
          prop="formTypeName"
          label="采购物料"
          align="center"
        />
        <el-table-column
          prop="address"
          label="交易时间"
          align="center"
          show-overflow-tooltip
        ><template slot-scope="scope">{{ scope.row.storageTime }}</template></el-table-column>
        <el-table-column
          prop="totalMoney"
          label="交易金额(元)"
          align="center"
        />
      </el-table>
      <div class="block">
        <el-pagination
          :current-page="filed.page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="filed.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <el-button style="float: right" type="primary" @click="goBack">返回</el-button>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { getRecord } from '@/api/supplier'
import { supplierType } from '@/utils/commonType'
export default {
  name: 'SupplierManagementTranRecord',
  data() {
    return {
      headerBg: { 'background': '#fafafa' },
      date: '',
      searchInp: '',
      data: [],
      multipleSelection: [],
      filed: {
        supplierId: '',
        year: moment(new Date()).format('YYYY'),
        page: 1,
        size: 10
      },
      totalCount: 0,
      loading: false
    }
  },
  mounted() {
    this.getList()
    this.filed.supplierId = this.$route.query.id
  },
  methods: {
    getList() { // 记录导出
      this.loading = true
      getRecord(this.filed).then(({ data, message, code }) => {
        if (code === 200) {
          this.loading = false
          this.data = data.data
          this.totalCount = data.totalCount
          this.data = this.data.map((v, index) => {
            supplierType.forEach(item => {
              if (Number(item.value) === Number(v.formType)) {
                v.formTypeName = item.label
              }
            })
            return v
          })
        } else {
          this.loading = false
          this.$message.error(message)
        }
      }).catch(e => {
        this.loading = false
        this.$message.error('获取交易记录数据')
      })
    },
    handleSizeChange(val) {
      this.filed.size = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.filed.page = val
      this.getList()
    },
    selectDateHandle(val) {
      this.filed.year = moment(val).format('YYYY')
      this.getList()
    },
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.filter-item {
  display: -webkit-box;
  align-items: center;
}
.filter-container {
  justify-content: start;
  align-items: baseline;
}
.search {
  margin-left: 15px;
}
.filter-right-box {
  margin-left: 35px;
}
.export {
  margin-bottom: 20px;
}
.block {
  text-align: center;
  margin-top: 30px;
}
</style>
