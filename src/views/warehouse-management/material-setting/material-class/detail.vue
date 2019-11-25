<template>
  <!-- 页面主容器 -->
  <div class="page-container">
    <!-- 查询容器 -->
    <div class="filter-container">
      <!-- 左侧box -->
      <div class="filter-left-box">
        <div class="filter-item">
          <el-button type="primary" size="medium" icon="el-icon-circle-plus-outline" @click="openClassDlg('create')">添加种类1</el-button>
        </div>
      </div>
      <!-- 右侧box -->
      <div class="filter-right-box" />
    </div>
    <!-- 主要内容容器 -->
    <div class="content-container">
      <el-tabs id="classTabs" v-model="currentTabId" class="el-tabs-box" :tab-position="'left'" style="min-height: 200px;" @tab-click="changeTab">
        <el-tab-pane v-for="(item,i) in classList" :key="i" :label="`${item.className}[${item.unit}] | ${item.classCode}`" :name="`${item.id}`">
          <div class="filter-container">
            <!-- 左侧box -->
            <div class="filter-left-box">
              <div class="filter-item">
                <el-button type="primary" size="medium" icon="el-icon-edit" @click="openClassDlg('update', item)">修改种类信息</el-button>
                <el-button type="danger" :loading="delLoadBtn" size="small" icon="el-icon-delete" @click="deleteTip('class', item)">删除当前种类</el-button>
              </div>
            </div>
            <!-- 右侧box -->
            <div class="filter-right-box">
              <el-button type="primary" size="medium" icon="el-icon-circle-plus-outline" @click="materialDlgVisible = true">添加材质</el-button>
            </div>
          </div>
          <div class="content-container">
            <template v-if="item.id == currentTabId">
              <el-table
                v-loading="matelistLoading"
                :data="materialList"
                border
                stripe
                style="width: 100%"
              >
                <el-table-column type="index" label="序号" align="center" width="100" />
                <el-table-column prop="typeName" label="物料名称" align="center" width="180" />
                <el-table-column prop="className" label="物料种类" align="center" width="180" />
                <el-table-column prop="detailName" label="材质/型号/品种" align="center" width="220">
                  <template slot-scope="scope">
                    <template v-if="scope.row.edit">
                      <div class="edit-item">
                        <el-input v-model="scope.row.detailName" class="edit-input" size="small" />
                        <el-button class="cancel-btn" size="small" icon="el-icon-refresh" type="warning" @click="cancelEdit(scope.row)">取消</el-button>
                      </div>
                    </template>
                    <span v-else>{{ scope.row.detailName }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="materialCode" label="代码" align="center" width="180" />
                <el-table-column label="时间" align="center" width="180">
                  <template slot-scope="scope">
                    {{ scope.row.createTime | parseTime }}
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button v-if="scope.row.edit" type="success" size="small" icon="el-icon-circle-plus-outline" @click="confirmEdit(scope.row)">保存</el-button>
                    <el-button v-else type="primary" size="small" icon="el-icon-edit" @click="scope.row.edit=!scope.row.edit">编辑</el-button>
                    <el-button type="danger" size="small" @click="deleteTip('material', scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pagination-container">
                <el-pagination v-show="total > 0" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.size" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
              </div>
            </template>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 其他模块（例如弹窗等） -->
    <el-dialog :title="operateMap[operateDlgStatus]" :visible.sync="classDlgVisible" width="500px" @closed="handleClose('classForm')">
      <el-form ref="classForm" :model="classForm" :rules="classRule">
        <el-form-item label="名称" :label-width="'80px'" prop="className">
          <el-input v-model="classForm.className" autocomplete="off" />
        </el-form-item>
        <el-form-item label="单位" :label-width="'80px'" prop="unitId">
          <el-select v-model="classForm.unitId" filterable placeholder="请选择" :disabled="unitDisabled">
            <el-option
              v-for="item in unitList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose('classForm')">取 消</el-button>
        <el-button :loading="submitClassLoadBtn" type="primary" @click="submitClass">保 存</el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加物料材质" :visible.sync="materialDlgVisible" width="500px" @closed="handleClose('materialForm')">
      <el-form ref="materialForm" :model="materialForm" :rules="materialRule">
        <el-form-item label="名称" :label-width="'80px'" prop="detailName">
          <el-input v-model="materialForm.detailName" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose('materialForm')">取 消</el-button>
        <el-button :loading="submitMaterialBtn" type="primary" @click="submitMaterial">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { validatorCNENNUM } from '@/utils/validatePattern'
import { MATERIAL_BASE_TYPE, MATERIAL_BASE_NUM } from '@/utils/conventionalContent'
import { fetchUnitList } from '@/api/dictionary'
import { fetchClassList, createClass, updateClass, delClass, fetchMaterialList, createMaterial, updateMaterial, delMaterial } from '@/api/material'

export default {
  name: 'WareMaterialClassDetail',
  data() {
    return {
      materialBaseType: MATERIAL_BASE_TYPE,
      materialBaseNum: MATERIAL_BASE_NUM,
      classDlgVisible: false,
      classEditDlgVisible: false,
      materialDlgVisible: false,
      delLoadBtn: false,
      submitClassLoadBtn: false,
      submitMaterialBtn: false,
      matelistLoading: false,
      operateMap: {
        create: '添加种类信息',
        update: '修改种类信息'
      },
      baseType: 0, // 基础类型
      unitDisabled: false, // 单位可选
      currentBaseType: {}, // 当前类型
      baseUnitId: 0,
      total: 0,
      operateDlgStatus: 'create',
      currentTabId: undefined,
      classList: [], // 种类列表
      materialList: [],
      unitList: [
        { name: '元', id: '1' }
      ], // 单位列表
      listQuery: {
        id: undefined,
        page: 1,
        size: 10
      },
      materialForm: {}, // 物料材质表单
      classForm: {}, // 物料种类表单
      classRule: { // 物料种类表单验证
        className: [
          { required: true, message: '请输入种类名称', trigger: 'blur' },
          { min: 1, max: 7, message: '请输入1-7个字', trigger: 'blur' },
          { pattern: validatorCNENNUM.pattern, message: validatorCNENNUM.message, trigger: 'blur' }
        ],
        unitId: [
          { required: true, message: '请选择单位', trigger: 'blur' }
        ]
      },
      materialRule: { // 物料种类表单验证
        detailName: [
          { required: true, message: '请输入材质名称', trigger: 'blur' },
          { min: 1, max: 12, message: '请输入1-12个字符', trigger: 'blur' }
          // { pattern: validatorCN.pattern, message: validatorCN.message, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUnitList()
  },
  mounted() {
    this.backRouterName = this.$route.query && this.$route.query.backRouterName
    this.typeId = this.$route.query && this.$route.query.id
    this.baseType = this.$route.query && this.$route.query.baseType
    this.unitDisabled = this.materialBaseType.material !== this.baseType
    this.getClassList()
    this.currentBaseType = this.materialBaseNum[this.baseType]
  },
  methods: {
    openClassDlg: function(status, item) {
      this.operateDlgStatus = status
      if (item && item.id) {
        this.classForm = Object.assign({ typeId: this.typeId, unitId: this.baseUnitId }, item)
        console.log(this.classForm)
      } else {
        this.classForm = { typeId: this.typeId, unitId: this.baseUnitId }
      }
      this.classDlgVisible = true
    },
    editMaterial: function() {
      this.$refs['materialEditForm'].validate((valid) => {
        console.log(valid)
        if (valid) {
          this.submitMaterialBtn = true
          updateMaterial(this.materialForm).then(() => {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.submitMaterialBtn = false
            this.materialDlgVisible = false
            this.$refs['materialForm'].resetFields()
            this.getMaterialList()
          }).catch(e => {
            this.submitMaterialBtn = false
            this.$message({
              message: '添加失败',
              type: 'error'
            })
          })
        } else {
          return false
        }
      })
    },
    deleteMaterial: function(id) {
      delMaterial(id).then(res => {
        this.getMaterialList()
        this.$message({
          message: '删除成功',
          type: 'success'
        })
      }).catch(e => {
        this.$message({
          message: '删除失败',
          type: 'error'
        })
      })
    },
    // 获取物料材质列表
    getMaterialList: function() {
      this.matelistLoading = true
      this.materialList = []
      this.listQuery.classId = this.currentTabId
      fetchMaterialList(this.listQuery).then(({ data, code, message }) => {
        if (code === 200) {
          if (data && data.data && data.data.length) {
            this.materialList = data.data.map(v => {
              this.$set(v, 'edit', false)
              v.originalName = v.detailName
              return v
            })
          }
          this.total = data.totalCount || 0
        } else {
          this.$message({
            message: message,
            type: 'error'
          })
        }
        this.matelistLoading = false
      }).catch(e => {
        this.$message({
          message: '获取列表失败',
          type: 'error'
        })
        this.matelistLoading = false
        console.log(e)
      })
    },
    // 搜索界面
    handleFilter() {
      this.listQuery.page = 1
      this.getMaterialList()
    },
    // page组件相关
    handleSizeChange(val) {
      this.listQuery.size = val
      this.getMaterialList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getMaterialList()
    },
    submitMaterial: function() {
      this.$refs['materialForm'].validate((valid) => {
        if (valid) {
          this.submitMaterialBtn = true
          this.materialForm.classId = Number(this.currentTabId)
          createMaterial(this.materialForm).then(({ data, code, message }) => {
            if (code === 200) {
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.materialDlgVisible = false
              this.$refs['materialForm'].resetFields()
              this.getMaterialList()
            } else {
              this.$message({
                message: message,
                type: 'error'
              })
            }
            this.submitMaterialBtn = false
          }).catch(e => {
            this.submitMaterialBtn = false
            this.$message({
              message: '添加失败',
              type: 'error'
            })
          })
        } else {
          return false
        }
      })
    },
    // 退出修改
    cancelEdit(row) {
      row.name = row.originalName
      row.edit = false
      this.$message({
        message: '已退出修改',
        type: 'warning'
      })
    },
    confirmEdit(row) {
      updateMaterial({ id: row.id, detailName: row.detailName }).then(({ data, code, message }) => {
        if (code === 200) {
          row.edit = false
          row.originalName = row.name
          this.$message({
            message: '修改成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: message,
            type: 'error'
          })
        }
      }).catch(e => {
        console.log(e)
        this.$message({
          message: '保存失败',
          type: 'error'
        })
      })
    },
    changeTab: function(e) {
      this.currentTabId = e.name
      this.getMaterialList()
    },
    getClassList: function() {
      const loading = this.$loading({
        target: '#classTabs',
        lock: true,
        text: '正在加载',
        fullscreen: false
      })
      fetchClassList({ typeId: this.typeId }).then(({ data, code, message }) => {
        if (code === 200) {
          this.classList = data
          if (this.classList && this.classList.length) {
            this.currentTabId = this.classList[0].id + ''
            this.getMaterialList()
          }
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
    submitClass: function() {
      if (this.loading) {
        this.$message({
          message: '正在提交，请勿重复点击',
          type: 'info'
        })
        return
      }
      if (this.operateDlgStatus === 'create') {
        this.saveClass()
      } else {
        this.editClass()
      }
    },
    // 保存种类信息
    saveClass: function() {
      this.$refs['classForm'].validate((valid) => {
        if (valid) {
          this.submitClassLoadBtn = true
          this.classForm.unit = this.searchUnitName(this.classForm.unitId)
          createClass(this.classForm).then(({ data, code, message }) => {
            if (code === 200) {
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.$refs['classForm'].resetFields()
              this.classDlgVisible = false
              this.getClassList()
            } else {
              this.$message({
                message: message,
                type: 'error'
              })
            }
            this.submitClassLoadBtn = false
          }).catch(e => {
            this.submitClassLoadBtn = false
            this.$message({
              message: '添加失败',
              type: 'error'
            })
          })
        } else {
          return false
        }
      })
    },
    // 修改种类信息
    editClass: function() {
      this.$refs['classForm'].validate((valid) => {
        if (valid) {
          this.submitClassLoadBtn = true
          this.classForm.unit = this.searchUnitName(this.classForm.unitId)
          updateClass(this.classForm).then(({ data, code, message }) => {
            if (code === 200) {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.classDlgVisible = false
              this.$refs['classForm'].resetFields()
              this.getClassList()
            } else {
              this.$message({
                message: message,
                type: 'error'
              })
            }
            this.submitClassLoadBtn = false
          }).catch(e => {
            this.submitClassLoadBtn = false
            this.$message({
              message: '修改失败',
              type: 'error'
            })
          })
        } else {
          return false
        }
      })
    },
    // 删除种类
    deleteClass: function(id) {
      this.delLoadBtn = true
      delClass(id).then(({ data, code, message }) => {
        if (code === 200) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getClassList()
        } else {
          this.$message({
            message: message,
            type: 'error'
          })
        }
        this.delLoadBtn = false
      }).catch(e => {
        this.delLoadBtn = false
        this.$message({
          message: '删除失败',
          type: 'error'
        })
      })
    },
    deleteTip(status, item) {
      const tipName = status === 'class' ? item.className : `材质${item.detailName}`
      this.$confirm(`确认删除 “${tipName}”，一经删除不可恢复?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (status === 'class') {
          this.deleteClass(item.id)
        } else {
          this.deleteMaterial(item.id)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 获取单位类型
    getUnitList: function() {
      fetchUnitList().then(({ data, code, message }) => {
        if (code === 200) {
          if (data && data.length) {
            this.unitList = data.map(v => {
              const _new = {
                id: v.id,
                name: v.name
              }
              const tempFlag = this.unitDisabled && _new.name && this.currentBaseType && this.currentBaseType.unit === _new.name
              if (tempFlag) {
                this.baseUnitId = _new.id
              }
              return _new
            })
          }
        } else {
          this.$message({
            type: 'error',
            message: message
          })
        }
      })
    },
    openAddClassDlg: function() {
      this.classDlgVisible = true
    },
    handleClose: function(fromName) {
      this.$refs[fromName].resetFields()
      this.classDlgVisible = false
      this.materialDlgVisible = false
    },
    searchUnitName(unitId) {
      if (!unitId) return
      let unitName
      for (let i = 0; i < this.unitList.length; i++) {
        if (this.unitList[i].id === unitId) {
          unitName = this.unitList[i].name
          break
        }
      }
      return unitName
    }
  }
}
</script>

<style scoped>
.el-tabs-box {
  height: calc(100vh - 200px);
}
.el-input {
  width: 300px;
}
.el-select {
  width: 300px;
}
.edit-item {
  width:100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.edit-input {
  width: 120px;
  margin-right: 10px;
}
</style>
