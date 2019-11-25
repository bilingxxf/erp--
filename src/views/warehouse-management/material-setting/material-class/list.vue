<template>
  <!-- 页面主容器 -->
  <div class="page-container">
    <!-- 查询容器 -->
    <div class="filter-container">
      <!-- 左侧box -->
      <div class="filter-left-box">
        <div class="filter-item">
          <el-radio-group v-model="listQuery.formType" size="medium" @change="getTypeList">
            <el-radio-button :label="4">一般物料</el-radio-button>
            <el-radio-button :label="0">钢板</el-radio-button>
            <el-radio-button :label="1">型钢</el-radio-button>
            <el-radio-button :label="2">彩卷/带钢</el-radio-button>
            <el-radio-button :label="3">成品围护</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <!-- 右侧box -->
      <div class="filter-right-box">
        <div v-permission="['50_201_1']" class="filter-item">
          <UploadBtn :action="action" :btn-name="'物料分类导入'" />
        </div>
      </div>
    </div>
    <!-- 主要内容容器 -->
    <div class="content-container">
      <div id="typeBox" class="type-box">
        <div v-for="(item, i) in typeList" :id="`type${item.id}`" :key="i" class="type-item" @click="openDetail(item)">
          <span v-text="item.typeName" />
          <span v-text="item.typeCode" />
          <el-tooltip v-permission="['50_201_1']" class="item" effect="dark" content="删除" placement="top-start">
            <div id="delItem" class="del-img-item" @click.stop="deleteType(item.id, `type${item.id}`)">
              <img class="del-img" src="@/assets/images/delete.png">
            </div>
          </el-tooltip>
        </div>
        <el-tooltip v-permission="['50_201_1']" class="item" effect="dark" content="添加" placement="right">
          <div class="type-item" @click="dialogFormVisible = true">
            <div class="add-img-item">
              <img class="add-img" src="@/assets/images/add.png">
            </div>
          </div>
        </el-tooltip>
      </div>
    </div>
    <!-- 其他模块（例如弹窗等） -->
    <el-dialog title="添加物料大类" :visible.sync="dialogFormVisible" width="500px" @close="handleClose">
      <el-form ref="createTypeForm" :model="typeForm" :rules="typeRule">
        <el-form-item label="名称" :label-width="'80px'" prop="typeName">
          <el-input v-model="typeForm.typeName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="代码" :label-width="'80px'" prop="typeCode">
          <el-input v-model="typeForm.typeCode" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button :loading="saveLoadingBtn" type="primary" @click="saveType">保 存</el-button>
      </div>
    </el-dialog>

    <el-drawer
      :title="`${currentType && currentType.typeName}-${currentType && currentType.typeCode}`"
      :visible.sync="drawerVisible"
      direction="rtl"
      size="80%"
    >
      <div slot="title" class="dialog-title">
        <span style="font-weight:bold;margin-right:10px;color:#606266">{{ `${currentType && currentType.typeName} - ${currentType && currentType.typeCode}` }}</span>
      </div>
      <ClassDetail :visible="drawerVisible" :type-id="currentType && currentType.id" :base-type="listQuery.formType" />
      <!-- <InboundSummary :visible="topDrawerVisible" /> -->
    </el-drawer>
  </div>
</template>

<script>
import UploadBtn from '@/components/UploadSingleFileBtn'
import ClassDetail from './components/detail'
import { validatorCN, validatorEn } from '@/utils/validatePattern'
import { fetchTypeList, delType, createType } from '@/api/material'

export default {
  name: 'WareMaterialClassList',
  components: { UploadBtn, ClassDetail },
  data() {
    return {
      listQuery: { // 大类查询条件
        formType: 4
      },
      typeForm: { // 大类表单

      },
      typeRule: { // 验证规则
        typeName: [
          { required: true, message: '请输入大类名称', trigger: 'blur' },
          { min: 1, max: 4, message: '请输入1-4个字', trigger: 'blur' },
          { pattern: validatorCN.pattern, message: validatorCN.message, trigger: 'blur' }
        ],
        typeCode: [
          { required: true, message: '请输入大类代码', trigger: 'blur' },
          { min: 1, max: 2, message: '请输入2个英文字符', trigger: 'blur' },
          { pattern: validatorEn.pattern, message: validatorEn.message, trigger: 'blur' }
        ]
      },
      drawerVisible: false,
      dialogFormVisible: false,
      saveLoadingBtn: false,
      currentType: undefined,
      typeList: [],
      action: process.env.VUE_APP_BASE_API + '/material-detail/actions/import'
    }
  },
  created() {
    this.getTypeList()
  },
  methods: {
    openDetail: function(item) {
      this.drawerVisible = true
      this.currentType = item
      // this.$router.push({ name: 'WareMaterialClassDetail', query: { id, backRouterName: this.$options.name, baseType: this.listQuery.formType }})
    },
    /**
     * 删除物料类型
     * @param id {number} 物料类型id
     */
    deleteType: function(id, target) {
      const loading = this.$loading({
        target: `#${target}`,
        lock: true,
        spinner: 'el-icon-loading',
        text: '正在删除',
        background: 'rgba(255, 255, 255, 0.75)',
        fullscreen: false
      })
      delType(id).then(({ data, code, message }) => {
        if (code === 200) {
          this.getTypeList()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: message,
            type: 'error'
          })
        }
        loading.close()
      }).catch(e => {
        loading.close()
        this.$message({
          message: '删除失败',
          type: 'error'
        })
      })
    },
    handleClose(done) {
      this.$refs['createTypeForm'].clearValidate()
      this.dialogFormVisible = false
    },
    saveType: function() {
      this.$refs['createTypeForm'].validate((valid) => {
        if (valid) {
          this.saveLoadingBtn = true
          this.typeForm.formType = this.listQuery.formType
          createType(this.typeForm).then(({ data, code, message }) => {
            if (code === 200) {
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.dialogFormVisible = false
              this.$refs['createTypeForm'].resetFields()
              this.getTypeList()
            } else {
              this.$message({
                message: message,
                type: 'error'
              })
            }
            this.saveLoadingBtn = false
          }).catch(e => {
            this.saveLoadingBtn = false
            this.$message({
              message: '添加失败',
              type: 'error'
            })
            console.log(e)
          })
        } else {
          return false
        }
      })
    },
    /**
     * 获取物料类型
     * 0-钢板，1-型材，2-彩卷，3-围护，4-一般物料
     */
    getTypeList: function() {
      const loading = this.$loading({
        target: '#typeBox',
        lock: true,
        text: '正在加载',
        fullscreen: false
        // spinner: 'el-icon-loading',
        // background: 'rgba(0, 0, 0, 0.7)'
      })
      fetchTypeList(this.listQuery).then(({ data, code, message }) => {
        if (+code === 200) {
          this.typeList = data
        } else {
          this.$message({
            message: message,
            type: 'error'
          })
        }
        loading.close()
      }).catch(e => {
        this.$message({
          message: '获取列表失败',
          type: 'error'
        })
        loading.close()
        console.log(e)
      })
    },
    delTip(id, target) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteType(id, target)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style scoped>
.el-input {
  width: 300px;
}
.type-box {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  align-content: flex-start;
  flex-wrap: wrap;
  min-height: 300px;
}
.type-item {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #1682e6;
  border-radius: 4px;
  min-width: 150px;
  width: 200px;
  height: 70px;
  margin: 0 20px 20px 0;
  color: #FFFFFF;
  font-weight: bold;
}
.del-img-item {
  position: absolute;
  top: 4px;
  right: 4px;
  cursor: pointer;
}
.del-img-item >img {
  width: 20px;
  height: 20px;
}
.add-img-item {
  width: 40px;
  height: 40px;
}
.add-img-item >img {
  width: 40px;
  height: 40px;
}
</style>
