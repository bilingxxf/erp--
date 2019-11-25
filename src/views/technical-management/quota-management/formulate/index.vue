<template>
  <!-- 页面主容器 -->
  <div class="page-container">
    <!-- 查询容器 -->
    <div class="filter-container">
      <!-- 左侧box -->
      <div class="filter-left-box">
        <div class="filter-item">
          <el-radio-group v-model="materialBaseType" size="medium">
            <el-radio-button :label="4">一般物料</el-radio-button>
            <el-radio-button :label="0">钢板</el-radio-button>
            <el-radio-button :label="1">型钢</el-radio-button>
            <el-radio-button :label="2">彩卷/带钢</el-radio-button>
            <el-radio-button :label="3">成品围护</el-radio-button>
          </el-radio-group>
        </div>
        <div class="filter-item">
          <el-cascader
            v-model="currentProjectId"
            placeholder="试试搜索：项目名称"
            :options="projectCascadeList"
            :props="props"
            :show-all-levels="false"
            filterable
            @change="projectHandle"
          />
        </div>
      </div>
      <!-- 右侧box -->
      <div class="filter-right-box" />
    </div>
    <!-- 主要内容容器 -->
    <div class="content-container">
      <generalMaterial v-if="materialBaseType == 4" :project-id="projectId" />
      <SteelPlate v-else-if="materialBaseType == 0" :project-id="projectId" />
      <Steel v-else-if="materialBaseType == 1" :project-id="projectId" />
      <ColorStrip v-else-if="materialBaseType == 2" :project-id="projectId" />
      <FinishedProduct v-else :project-id="projectId" />
    </div>

  </div>
</template>

<script>
import generalMaterial from './component/generalMaterial'
import SteelPlate from './component/steelPlate'
import Steel from './component/steel'
import ColorStrip from './component/colorStrip'
import FinishedProduct from './component/finishedProduct'
import { changeProjectToCascadeByYear } from '@/utils/other'
import { fetchProjectGroupByYear } from '@/api/project'

export default {
  name: 'TechQuotaFormulate',
  components: {
    generalMaterial,
    SteelPlate,
    Steel,
    ColorStrip,
    FinishedProduct
  },
  data() {
    return {
      props: { value: 'id', label: 'name', children: 'children', expandTrigger: 'hover' },
      year: new Date(),
      project: '',
      materialBaseType: 4,
      currentProjectId: [],
      projectCascadeList: [],
      projectId: null
    }
  },
  watch: {
    materialBaseType(newVal, oldVal) {
      if (newVal || newVal === 0) {
        this.projectId = this.currentProjectId[1]
      }
    }
  },
  created() {
    this.getProjectYearCascade()
  },
  mounted() {

  },
  methods: {
    projectHandle(val) {
      this.projectId = val[1]
    },
    /**
   * 获取项目年份级联列表
   */
    getProjectYearCascade: function() {
      fetchProjectGroupByYear().then(({ data, code, message }) => {
        if (code === 200) {
          // this.projectCascadeList = changeProjectToCascadeByYear(data, '入库总额(万元)', 'totalPrice')
          this.projectCascadeList = changeProjectToCascadeByYear(data)
          if (this.projectCascadeList[0] && this.projectCascadeList[0].children[0] && this.projectCascadeList[0].children[0].id) {
            this.currentProjectId.push(this.projectCascadeList[0].id)
            this.currentProjectId.push(this.projectCascadeList[0].children[0].id)
            this.projectId = this.currentProjectId[1]
          }
        } else {
          this.$message.error(message)
        }
      }).catch(e => {
        this.$message.error('获取项目级联列表失败')
      })
    }
  }

}
</script>

<style scoped>
.filter-item {
  margin: 0 10px;
}
.el-cascader {
  width: 300px;
}
</style>
