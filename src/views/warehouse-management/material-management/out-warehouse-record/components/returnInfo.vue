<template>
  <!-- 页面主容器 -->
  <div class="page-container">
    <!-- 查询容器 -->
    <div class="filter-container">
      <!-- 左侧box -->
      <div class="filter-left-box">
        <div class="filter-item">
          <el-date-picker
            v-model="months"
            type="monthrange"
            align="right"
            unlink-panels
            :clearable="false"
            range-separator="至"
            start-placeholder="开始月份"
            end-placeholder="结束月份"
            :picker-options="pickerOptions"
            @change="getList"
          />
        </div>
      </div>
      <!-- 右侧box -->
      <div class="filter-right-box" />
    </div>
    <!-- 主要内容容器 -->
    <div class="content-container">
      <el-table v-loading="tableLoading" :data="tableData" max-height="700" style="width: 100%" border stripe>
        <el-table-column label="序号" align="center" type="index" width="100" />
        <el-table-column prop="statisticalDate" align="center" label="日期" width="150" />
        <el-table-column prop="projectName" align="center" label="项目" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" icon="el-icon-view" @click="openDetail(scope.row)">查看</el-button>
            <el-button type="success" :loading="exportLoad[scope.$index]" icon="el-icon-download" size="small" @click="downloadExcel(scope.row,scope.$index)">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 其他模块（例如弹窗等） -->
    <el-drawer
      title="项目入库汇总"
      :visible.sync="drawerVisible"
      direction="rtl"
      size="60%"
    >
      <div slot="title" class="dialog-title">
        <span v-if="queryType == materialMoveType.partyA" style="font-weight:bold;margin-right:10px;">{{ `归还记录：${currentRow.projectName}` }}</span>
        <span v-if="queryType == materialMoveType.scrap" style="font-weight:bold;margin-right:10px;">{{ `废料记录：${currentRow.projectName}` }}</span>
        <el-tag size="mini" type="primary">{{ currentRow.statisticalDate }}</el-tag>
      </div>
      <div class="drawer-container">
        <DetailComponent :visible="drawerVisible" :project-id="currentRow.projectId" :query-date="currentRow.statisticalDate" :query-type="queryType" />
      </div>
    </el-drawer>
  </div>
</template>

<script>
import moment from 'moment'
import DetailComponent from './detailReturn'
import { MATERIAL_MOVE_TYPE, MATERIAL_MOVE_INDEX_TYPE, MONTH_PICKER_OPTION } from '@/utils/conventionalContent'
import { fetchReturnOrScrapMateDateList } from '@/api/warehouse'
import { exportReturnOrScrapExcel } from '@/api/exportFiles'
export default {
  name: 'WareReturnComponent',
  components: { DetailComponent },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    queryType: { // 1：归还，2：废料
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      materialMoveType: MATERIAL_MOVE_TYPE,
      materialMoveIndexType: MATERIAL_MOVE_INDEX_TYPE,
      pickerOptions: MONTH_PICKER_OPTION,
      tableLoading: false,
      exportLoad: [],
      drawerVisible: false,
      currentRow: {},
      tableData: [],
      months: [],
      listQuery: {
        startDate: undefined,
        endDate: undefined
      }
    }
  },
  watch: {
    visible(newVal, oldVal) {
      this.getList()
    }
  },
  created() {
    this.months = [new Date(), new Date()]
    this.getList()
  },
  methods: {
    openDetail: function(row) {
      this.drawerVisible = true
      this.currentRow = row
    },
    downloadExcel: function(row, index) {
      this.$set(this.exportLoad, index, true)
      const query = {
        projectId: row.projectId,
        date: row.statisticalDate,
        type: this.queryType
      }
      exportReturnOrScrapExcel(query).then(() => {
        this.$set(this.exportLoad, index, false)
      }).catch(e => {
        this.$set(this.exportLoad, index, false)
        this.$message({ message: '导出失败', type: 'error' })
      })
    },
    changeDate: function() {
      if (this.months && this.months.length > 0) {
        this.listQuery.startDate = moment(this.months[0]).startOf('month').format('YYYY-MM-DD')
        this.listQuery.endDate = moment(this.months[1]).endOf('month').format('YYYY-MM-DD')
      } else {
        this.listQuery.startDate = undefined
        this.listQuery.endDate = undefined
      }
    },
    getList: function() {
      this.changeDate()
      this.listQuery.type = this.queryType
      this.tableLoading = true
      fetchReturnOrScrapMateDateList(this.listQuery).then(({ data, code, message }) => {
        if (code === 200) {
          this.tableData = []
          if (data && data.length) {
            this.tableData = data
          }
        } else {
          this.$message({ message: message, type: 'error' })
        }
        this.tableLoading = false
      }).catch(e => {
        this.tableLoading = false
        this.$message({ message: '获取常规出库汇总列表失败', type: 'error' })
      })
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
