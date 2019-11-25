<template>
  <!-- 页面主容器 -->
  <div class="page-container">
    <!-- 查询容器 -->
    <div class="filter-container">
      <!-- 左侧box -->
      <div class="filter-left-box">
        <div class="filter-item">
          <el-date-picker
            v-model="listQuery.year"
            type="year"
            placeholder="请选择项目所属年份"
            value-format="yyyy"
            @change="handleFilter"
          />
        </div>
        <div class="filter-item">
          <el-input v-model="listQuery.projectName" placeholder="请输入项目名称" class="input-with-select" @keyup.enter.native="handleFilter">
            <el-button slot="append" type="primary" icon="el-icon-search" @click="handleFilter" />
          </el-input>
        </div>
      </div>
      <!-- 右侧box -->
      <div class="filter-right-box" />
    </div>
    <!-- 主要内容容器 -->
    <div class="content-container">
      <el-table v-loading="tableLoading" :data="tableData" max-height="700" style="width: 100%" border stripe>
        <el-table-column label="序号" align="center" type="index" min-width="80" />
        <el-table-column prop="projectName" align="center" label="项目" min-width="100" />
        <el-table-column prop="price" label="出库总额(万元)" align="center" min-width="100">
          <template slot-scope="scope">
            <el-tag type="success" size="medium">{{ scope.row.price }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="100">
          <template slot-scope="scope">
            <el-button :loading="exportLoad" type="success" icon="el-icon-download" size="small" @click="downloadExcel(scope.row)">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination v-show="total > 0" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.size" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </div>
    <!-- 其他模块（例如弹窗等） -->
  </div>
</template>

<script>
import { fetchProjectOutbound } from '@/api/project'
import { exportOutboundExcelByProject } from '@/api/exportFiles'
export default {
  name: 'InboundSummaryComponent',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      exportLoad: false,
      tableLoading: false,
      listQuery: {
        projectName: undefined,
        year: undefined,
        page: 1,
        size: 10
      },
      total: 0,
      tableData: []
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
    this.getList()
    this.listQuery.year = new Date().getFullYear().toString()
  },
  methods: {
    downloadExcel: function(row) {
      this.exportLoad = true
      exportOutboundExcelByProject({ projectId: row.projectId }).then(() => {
        this.exportLoad = false
      }).catch(e => {
        this.exportLoad = false
        this.$message({ message: '导出失败', type: 'error' })
      })
    },
    getList: function() {
      this.tableLoading = true
      this.tableData = []
      fetchProjectOutbound(this.listQuery).then(({ data, code, message }) => {
        if (code === 200) {
          if (data && data.data && data.data.length) {
            this.tableData = data.data.map(v => {
              v.price = (v.taxIncludedAmount / 10000).toFixed(2)
              return v
            })
            this.total = data.totalCount
          }
        } else {
          this.$message({ message: message, type: 'error' })
        }
        this.tableLoading = false
      }).catch(e => {
        this.tableLoading = false
        this.$message({ message: '获取项目入库汇总列表失败', type: 'error' })
      })
    },
    // 搜索界面
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // page组件相关
    handleSizeChange(val) {
      this.listQuery.size = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    }
  }
}
</script>

<style scoped>

</style>
