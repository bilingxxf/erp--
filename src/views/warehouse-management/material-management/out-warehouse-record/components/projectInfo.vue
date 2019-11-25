<template>
  <!-- 页面主容器 -->
  <div class="page-container">
    <!-- 查询容器 -->
    <div class="filter-container">
      <!-- 左侧box -->
      <div class="filter-left-box">
        <div class="filter-item">
          <el-cascader
            v-model="currentProjectId"
            placeholder="试试搜索：项目名称"
            :options="projectCascadeList"
            :props="{ value: 'id', label: 'name', children: 'children', expandTrigger: 'hover' }"
            :show-all-levels="false"
            filterable
            style="width:250px"
            @change="projectChange"
          />
        </div>
      </div>
      <!-- 右侧box -->
      <div class="filter-right-box">
        <div class="filter-item">
          <el-button :loading="exportLoad" type="success" icon="el-icon-download" size="medium" @click="downloadExcel()">下载项目出库记录</el-button>
          <el-button type="primary" size="medium" icon="el-icon-view" @click="drawerVisible = true">查看所有项目出库总额</el-button>
        </div>
      </div>
    </div>
    <!-- 主要内容容器 -->
    <div class="content-container">
      <DetailComponent :visible="visible" :query-type="1" :project-id="projectId" />
    </div>
    <!-- 其他模块（例如弹窗等） -->
    <el-drawer
      title="项目出库汇总"
      :visible.sync="drawerVisible"
      direction="rtl"
      size="50%"
    >
      <div slot="title" class="dialog-title">
        <span style="font-weight:bold;">项目出库汇总</span>
      </div>
      <OutboundSummary :visible="drawerVisible" />
    </el-drawer>
  </div>
</template>

<script>
import OutboundSummary from '@/views/component/outbound/outboundSummary'
import DetailComponent from './detail'
import { changeProjectToCascadeByYear } from '@/utils/other'
import { fetchProjectGroupByYear } from '@/api/project'
import { exportOutboundExcelByProject } from '@/api/exportFiles'
export default {
  name: 'WareProjectComponent',
  components: { DetailComponent, OutboundSummary },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      exportLoad: false,
      drawerVisible: false,
      projectId: undefined,
      currentProjectId: [], // 当前项目id：[年份,项目id]
      projectCascadeList: [] // 项目级联列表
    }
  },
  created() {
    this.getProjectYearCascade()
  },
  methods: {
    downloadExcel: function() {
      this.exportLoad = true
      exportOutboundExcelByProject({ projectId: this.projectId }).then(() => {
        this.exportLoad = false
      }).catch(e => {
        this.exportLoad = false
        this.$message({ message: '导出失败', type: 'error' })
      })
    },
    projectChange: function() {
      this.projectId = this.currentProjectId[1]
    },
    /**
     * 获取项目年份级联列表
     */
    getProjectYearCascade: function() {
      fetchProjectGroupByYear().then(({ data, code, message }) => {
        if (code === 200) {
          // this.projectCascadeList = changeProjectToCascadeByYear(data, '入库总额(万元)', 'totalPrice')
          this.projectCascadeList = changeProjectToCascadeByYear(data)
          this.selectDefaultProject()
        } else {
          this.$message.error(message)
        }
      }).catch(e => {
        this.$message.error('获取项目级联列表失败')
      })
    },
    selectDefaultProject: function() {
      if (this.projectCascadeList[0] && this.projectCascadeList[0].children[0] && this.projectCascadeList[0].children[0].id) {
        this.currentProjectId = [this.projectCascadeList[0].id, this.projectCascadeList[0].children[0].id]
        this.projectId = this.currentProjectId[1]
      } else {
        this.currentProjectId = []
        this.projectId = undefined
      }
    }
  }
}
</script>

<style scoped>

</style>
