<template>
  <!-- 页面主容器 -->
  <div class="page-container statistics-report">
    <!-- 查询容器 -->
    <div class="filter-container">
      <!-- 左侧box -->
      <div class="filter-left-box">
        <div class="filter-item">
          <el-radio-group v-model="activeName">
            <el-radio-button v-for="(item, index) in statisticList" :key="index" :label="item.value" :value="item.value">
              <svg-icon :icon-class="item.icon" /> {{ item.label }}
            </el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <!-- 右侧box -->
      <div class="filter-right-box" />
    </div>
    <!-- 主要内容容器 -->
    <div class="content-container">
      <!-- 其他模块（例如弹窗等） -->

      <inventory v-if="activeName === 'inventory'" />
      <purchase v-else-if="activeName === 'purchase'" />
      <materials v-else-if="activeName === 'materials'" />
      <project v-else-if="activeName === 'project'" />
      <product v-else-if="activeName === 'product'" />
      <utilityFee v-else />
    </div>

  </div>
</template>

<script>
import inventory from './stock-status/component/inventory'
import purchase from './stock-status/component/purchase'
import materials from './stock-status/component/materials'
import project from './stock-status/component/project-cost'
import product from './stock-status/component/product-cost'
import utilityFee from './stock-status/component/utility-fee'
import { STATISTIC_LIST } from '@/utils/reportTabList'
export default {
  name: 'ReportManagement',
  components: {
    inventory,
    purchase,
    materials,
    project,
    product,
    utilityFee
  },
  data() {
    return {
      activeName: 'inventory',
      statisticList: STATISTIC_LIST
    }
  },
  methods: {
  }
}
</script>

<style scoped>
.statistics-report .svg-icon{
  width: 2.3rem;
  font-size: 18px;
}
</style>
