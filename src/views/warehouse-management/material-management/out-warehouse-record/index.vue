<template>
  <!-- 页面主容器 -->
  <div class="page-container">
    <!-- 主要内容容器 -->
    <div class="content-container">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="常规出库汇总" name="0">
          <NormalRecord :visible="activeName == 0" />
        </el-tab-pane>
        <el-tab-pane label="项目出库汇总" name="1">
          <ProjectRecord :visible="activeName == 1" />
        </el-tab-pane>
        <el-tab-pane label="归还清单" name="2">
          <ReturnRecord :query-type="materialMoveType.partyA" :visible="activeName == 2" />
        </el-tab-pane>
        <el-tab-pane label="废料清单" name="3">
          <ReturnRecord :query-type="materialMoveType.scrap" :visible="activeName == 3" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 其他模块（例如弹窗等） -->
  </div>
</template>

<script>
import NormalRecord from './components/normalInfo'
import ProjectRecord from './components/projectInfo'
import ReturnRecord from './components/returnInfo'
import { MATERIAL_MOVE_TYPE } from '@/utils/conventionalContent'
export default {
  name: 'WareOutWarehouseRecord',
  components: { NormalRecord, ProjectRecord, ReturnRecord },
  data() {
    return {
      materialMoveType: MATERIAL_MOVE_TYPE,
      activeName: '0'
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style scoped>

</style>
