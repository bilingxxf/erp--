<template>
  <!-- 页面主容器 -->
  <div class="page-container">
    <div class="content-container">
      <el-card :body-style="{ padding: '20px' ,aligment:'center'}">
        <img src="../../assets/images/bim_logo.png" class="image">
        <div style="padding: 1px;">
          <h1>尊敬的客户</h1>
          <p>感谢您对CM-WMS（初鸣智建）物料管理系统的信赖和支持</p>
          <p>如果您在使用过程中发现问题或提出改进意见</p>
          <p>请联系服务电话：0571-86962260</p>
          <p>服务邮箱：hzchum@163.com</p>
          <p>诚挚问候</p>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style>
  .image {
    width: 20%;
    display: block;
  }
</style>

<script>
export default {
  name: 'SupportManagement',
  data() {
    return {}
  }
}
</script>
