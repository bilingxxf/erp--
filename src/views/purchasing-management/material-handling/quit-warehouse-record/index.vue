<template>
  <!-- 页面主容器 -->
  <div class="page-container in-warehouse-verify-index">
    <!-- 查询容器 -->
    <div class="filter-container">
      <!-- 左侧box -->
      <div class="filter-left-box">
        <div class="filter-item">
          <el-radio-group v-model="listQuery.formType" size="medium" @change="handleFilter">
            <el-radio-button :label="undefined">全部</el-radio-button>
            <el-radio-button :label="4">一般物料</el-radio-button>
            <el-radio-button :label="0">钢板</el-radio-button>
            <el-radio-button :label="1">型钢</el-radio-button>
            <el-radio-button :label="2">彩卷/带钢</el-radio-button>
            <el-radio-button :label="3">成品围护</el-radio-button>
          </el-radio-group>
        </div>
        <!-- <div class="filter-item">
          <el-radio-group v-model="checkHasProject" size="medium" @change="inboundTypeChange">
            <el-radio-button :label="false">常规入库</el-radio-button>
            <el-radio-button :label="true">项目入库</el-radio-button>
          </el-radio-group>
        </div> -->
        <!-- <div class="filter-item">
          <el-cascader
            v-model="currentProjectId"
            placeholder="试试搜索：项目名称"
            :options="projectCascadeList"
            :props="{ value: 'id', label: 'name', children: 'children', expandTrigger: 'hover' }"
            :disabled="!checkHasProject"
            :show-all-levels="false"
            filterable
            style="width:250px"
            @change="projectChange"
          />
        </div> -->
      </div>
      <!-- 右侧box -->
      <div class="filter-right-box" />
    </div>
    <div class="filter-container">
      <!-- 左侧box -->
      <div class="filter-left-box">
        <div class="filter-item">
          <el-radio-group v-model="listQuery.status" size="medium" @change="handleFilter">
            <el-radio-button :label="undefined">全部</el-radio-button>
            <el-radio-button :label="0">未审核</el-radio-button>
            <el-radio-button :label="1">已通过</el-radio-button>
            <el-radio-button :label="2">已退回</el-radio-button>
          </el-radio-group>
        </div>
        <div class="filter-item">
          <el-date-picker
            v-model="listQuery.month"
            type="month"
            value-format="timestamp"
            placeholder="选择月"
            @change="dataChange"
          />
        </div>
        <div class="filter-item">
          <el-input v-model="listQuery.className" placeholder="请输入物料种类名称" class="input-with-select" @keyup.enter.native="handleFilter">
            <el-button slot="append" type="primary" icon="el-icon-search" @click="handleFilter" />
          </el-input>
        </div>
      </div>
      <!-- 右侧box -->
      <div class="filter-right-box" />
    </div>
    <!-- 主要内容容器 -->
    <div class="content-container">
      <el-table
        v-loading="listLoading"
        :data="listData"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" align="center" width="100" />
        <el-table-column prop="formType" label="物料类型" align="center">
          <template slot-scope="scope">
            <span>{{ materialBaseNum[scope.row.formType] ? materialBaseNum[scope.row.formType].name : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="storageTime" label="退库申请日期" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.outWarehouseTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="outWarehouseListNo" label="退库凭证号" align="center" />
        <el-table-column prop="totalPrice" label="退库额(元)" align="center" />
        <el-table-column prop="className" label="状态" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status == 1 ? 'success' : scope.row.status == 2 ? 'danger' : 'warning'" size="medium">{{ materialReturnIndexStatus[scope.row.status].name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" icon="el-icon-view" @click="openDetail(scope.row)">查看</el-button>
            <el-button type="success" :loading="exportLoad[scope.$index]" icon="el-icon-download" size="small" @click="downloadExcel(scope.row,scope.$index)">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination v-show="total > 0" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.size" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </div>
    <!-- 其他模块（例如弹窗等） -->
    <el-dialog
      :title="`退库详情${materialReturnIndexStatus[currentRow.status]}`"
      :visible.sync="detailVisible"
      :fullscreen="true"
    >
      <div v-if="materialReturnIndexStatus[currentRow.status]" slot="title" class="dialog-title">
        <span>{{ `${ materialBaseNum[currentRow.formType] ? materialBaseNum[currentRow.formType].name : ''}退库详情：${currentRow.outWarehouseListNo}` }}</span>
        <el-tag effect="dark" :type="materialReturnIndexStatus[currentRow.status].tip" size="small">{{ materialReturnIndexStatus[currentRow.status].name }}</el-tag>
      </div>
      <VerifyComponent :detail-id="currentRow.id" @closeEvent="detailVisible = false" @refreshEvent="refreshInfo" />
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import VerifyComponent from '@/views/component/quit/verify'
import { changeProjectToCascadeByYear } from '@/utils/other'
import { MATERIAL_BASE_TYPE, MATERIAL_BASE_NUM, MATERIAL_RETURN_STATUS, MATERIAL_RETURN_INDEX_STATUS } from '@/utils/conventionalContent'
import { fetchProjectGroupByYear } from '@/api/project'
import { fetchReturnList } from '@/api/warehouse'
import { exportReturnWarehouseExcel } from '@/api/exportFiles'
export default {
  name: 'MatQuitWarehouseRecord',
  components: { VerifyComponent },
  data() {
    return {
      MATERIAL_BASE_TYPE,
      materialBaseNum: MATERIAL_BASE_NUM,
      materialReturnStatus: MATERIAL_RETURN_STATUS,
      materialReturnIndexStatus: MATERIAL_RETURN_INDEX_STATUS,
      exportLoad: [],
      checkHasProject: false,
      detailVisible: false,
      currentRow: {},
      currentProjectId: [], // 当前项目id：[年份,项目id]
      projectCascadeList: [], // 项目级联列表
      listLoading: false, // 列表load
      listData: [], // 列表数据
      total: 0,
      listQuery: {
        className: undefined,
        startDate: undefined,
        endDate: undefined,
        projectId: undefined,
        formType: undefined,
        status: undefined,
        page: 1,
        size: 10,
        month: undefined
      }
    }
  },
  created() {
    this.getProjectYearCascade()
    this.listQuery.month = new Date()
    this.dataChange()
  },
  methods: {
    downloadExcel: function(row, index) {
      this.$set(this.exportLoad, index, true)
      exportReturnWarehouseExcel({ id: row.id }).then(() => {
        this.$set(this.exportLoad, index, false)
      }).catch(e => {
        this.$set(this.exportLoad, index, false)
        this.$message({ message: '导出失败', type: 'error' })
      })
    },
    getList: function() {
      this.listLoading = true
      fetchReturnList(this.listQuery).then(({ data, code, message }) => {
        if (code === 200) {
          this.listData = []
          if (data && data.data && data.data.length) {
            this.listData = data.data
            this.total = data.totalCount
          }
        } else {
          this.$message({ message: message, type: 'error' })
        }
        this.listLoading = false
      }).catch(e => {
        console.log(e)
        this.listLoading = false
        this.$message({ message: '获取入库清单失败', type: 'error' })
      })
    },
    refreshInfo: function(data) {
      this.currentRow.status = data ? this.materialReturnStatus.success.index : this.materialReturnStatus.error.index
    },
    openDetail(item) {
      this.currentRow = item
      this.detailVisible = true
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
    },
    /**
     * 获取项目年份级联列表
     */
    getProjectYearCascade: function() {
      fetchProjectGroupByYear().then(({ data, code, message }) => {
        if (code === 200) {
          // this.projectCascadeList = changeProjectToCascadeByYear(data, '入库总额(万元)', 'totalPrice')
          this.projectCascadeList = changeProjectToCascadeByYear(data)
        } else {
          this.$message.error(message)
        }
      }).catch(e => {
        this.$message.error('获取项目级联列表失败')
      })
    },
    projectChange: function() {
      this.listQuery.projectId = this.currentProjectId[1]
      this.handleFilter()
    },
    inboundTypeChange: function(check) {
      if (check) {
        if (!this.listQuery.projectId && this.projectCascadeList[0] && this.projectCascadeList[0].children[0] && this.projectCascadeList[0].children[0].id) {
          this.currentProjectId.push(this.projectCascadeList[0].id)
          this.currentProjectId.push(this.projectCascadeList[0].children[0].id)
          this.listQuery.projectId = this.currentProjectId[1]
        }
      } else {
        this.currentProjectId = []
        this.listQuery.projectId = undefined
      }
      this.handleFilter()
    },
    dataChange: function() {
      this.listQuery.startDate = this.listQuery.month ? moment(this.listQuery.month).startOf('month').format('YYYY-MM-DD') : ''
      this.listQuery.endDate = this.listQuery.month ? moment(this.listQuery.month).endOf('month').format('YYYY-MM-DD') : ''
      this.handleFilter()
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    }
  }
}
</script>

<style scoped>

</style>
<style>
.in-warehouse-verify-index .filter-item .el-input-group__append, .el-input-group__prepend {
  background-color: #1890ff;
  color: #ffffff;
  border: none;
}
.dialog-title {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.dialog-title >span {
  margin-right: 10px;
}
.dialog-title >span:nth-child(1)  {
  font-weight: bold;
  font-size: 18px;
}
</style>
