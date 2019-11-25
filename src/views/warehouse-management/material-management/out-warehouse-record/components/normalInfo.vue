<template>
  <!-- 页面主容器 -->
  <div class="page-container">
    <!-- 查询容器 -->
    <div class="filter-container">
      <!-- 左侧box -->
      <div class="filter-left-box">
        <div class="filter-item">
          <el-radio-group v-model="listQuery.type" size="medium" @change="changeDateType">
            <el-radio-button :label="dateType.year">年</el-radio-button>
            <el-radio-button :label="dateType.month">月</el-radio-button>
          </el-radio-group>
        </div>
        <div class="filter-item">
          <template v-if="listQuery.type == dateType.month">
            <el-date-picker
              v-model="listQuery.yearAndMonthDate"
              type="month"
              placeholder="选择月"
              value-format="yyyy-MM"
              @change="getList"
            />
          </template>
          <template v-if="listQuery.type == dateType.year">
            <el-date-picker
              v-model="listQuery.yearAndMonthDate"
              type="year"
              placeholder="选择年"
              value-format="yyyy"
              @change="getList"
            />
          </template>
        </div>
      </div>
      <!-- 右侧box -->
      <div class="filter-right-box" />
    </div>
    <!-- 主要内容容器 -->
    <div class="content-container">
      <el-table v-loading="tableLoading" :data="tableData" max-height="700" style="width: 100%" border stripe>
        <el-table-column label="序号" align="center" type="index" width="100" />
        <el-table-column prop="date" align="center" label="日期" width="150" />
        <el-table-column prop="price" label="金额(元)" align="center" width="150">
          <template slot-scope="scope">
            <el-tag type="success" size="medium">{{ scope.row.price }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" icon="el-icon-view" @click="openDetail(scope.row)">查看</el-button>
            <el-button type="success" :loading="exportLoad[scope.$index]" icon="el-icon-download" size="small" @click="downloadExcel(scope.row.dateTime, scope.$index)">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 其他模块（例如弹窗等） -->
    <el-drawer
      title="出库记录"
      :visible.sync="drawerVisible"
      direction="rtl"
      size="70%"
    >
      <div slot="title" class="dialog-title">
        <span v-if="listQuery.type == dateType.year" style="font-weight:bold;margin-right:10px;">出库日期：{{ currentTime | parseTime('{y}-{m}') }}</span>
        <span v-else style="font-weight:bold;margin-right:10px;">出库日期：{{ currentTime | parseTime('{y}-{m}-{d}') }}</span>
      </div>
      <div class="drawer-container">
        <DetailComponent :visible="drawerVisible" :query-type="0" :date-type="listQuery.type" :date-time="currentTime" />
      </div>
    </el-drawer>
  </div>
</template>

<script>
import DetailComponent from './detail'
import moment from 'moment'
import { fetchOutboundRecordByNormal } from '@/api/warehouse'
import { exportOutboundExcelByNormal } from '@/api/exportFiles'

export default {
  name: 'WareNormalComponent',
  components: { DetailComponent },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dateType: {
        month: 1,
        year: 2
      },
      drawerVisible: false,
      tableLoading: false,
      tableData: [],
      listQuery: {
        type: undefined,
        yearAndMonthDate: undefined
      },
      exportLoad: [],
      currentTime: undefined
    }
  },
  watch: {
    visible(newVal, oldVal) {
      if (newVal) {
        this.getList()
      }
    }
  },
  created() {
    this.listQuery.type = this.dateType.year
    this.listQuery.yearAndMonthDate = moment(new Date()).format('YYYY')
    this.getList()
  },
  methods: {
    downloadExcel: function(time, index) {
      const queryData = {}
      queryData.type = this.listQuery.type
      if (this.listQuery.type === this.dateType.year) {
        queryData.startDate = moment(time).startOf('month').format('YYYY-MM-DD')
        queryData.endDate = moment(time).endOf('month').format('YYYY-MM-DD')
      } else {
        queryData.startDate = moment(time).startOf('date').format('YYYY-MM-DD')
        queryData.endDate = moment(time).endOf('date').format('YYYY-MM-DD')
      }
      this.$set(this.exportLoad, index, true)
      exportOutboundExcelByNormal(queryData).then(() => {
        this.$set(this.exportLoad, index, false)
      }).catch(e => {
        this.$set(this.exportLoad, index, false)
        this.$message({ message: '导出失败', type: 'error' })
      })
    },
    openDetail: function(row) {
      this.drawerVisible = true
      this.currentTime = row.dateTime
    },
    changeDateType: function() {
      const format = this.listQuery.type === this.dateType.year ? 'YYYY' : 'YYYY-MM'
      this.listQuery.yearAndMonthDate = moment(new Date()).format(format)
      this.getList()
    },
    getList: function() {
      this.tableLoading = true
      this.tableData = []
      fetchOutboundRecordByNormal(this.listQuery).then(({ data, code, message }) => {
        if (code === 200) {
          console.log(data)
          this.tableData = this.listQuery.type === this.dateType.year ? this.handleYearData(data) : this.handleMonthData(data)
        } else {
          this.$message({ message: message, type: 'error' })
        }
        this.tableLoading = false
      }).catch(e => {
        this.tableLoading = false
        this.$message({ message: '获取常规出库汇总列表失败', type: 'error' })
      })
    },
    handleYearData(data) {
      const _dateByMonth = []
      for (let i = 1; i <= 12; i++) {
        let temp = i
        if (i < 10) {
          temp = `0${i}`
        }
        _dateByMonth.push({ date: `${i}月`, price: 0, dateTime: moment(`${this.listQuery.yearAndMonthDate}-${temp}`).valueOf() })
      }
      data.forEach(v => {
        const month = moment(v.statisticalDate).month()
        _dateByMonth[month].price = v.taxIncludedAmount
      })
      return _dateByMonth
    },
    handleMonthData(data) {
      const _dateByDay = []
      const maxDay = Number(moment(this.listQuery.yearAndMonthDate).endOf('month').format('DD'))
      const _month = Number(moment(this.listQuery.yearAndMonthDate).endOf('month').format('MM'))
      for (let i = 1; i <= maxDay; i++) {
        let temp = i
        if (i < 10) {
          temp = `0${i}`
        }
        _dateByDay.push({ date: `${_month}月${i}日`, price: 0, dateTime: moment(`${this.listQuery.yearAndMonthDate}-${temp}`).valueOf() })
      }
      data.forEach(v => {
        const day = moment(v.statisticalDate).date()
        _dateByDay[day - 1].price = v.taxIncludedAmount
      })
      return _dateByDay
    }
  }
}
</script>

<style scoped>
.drawer-container {
  padding: 20px;
  box-sizing: border-box;
}
</style>
