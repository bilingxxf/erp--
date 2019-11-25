<template>
  <!-- 页面主容器 -->
  <div class="page-container inbound-table">
    <div :class="{'mask-container':submitLoading}" />
    <!-- 查询容器 -->
    <div class="filter-container">
      <!-- 左侧box -->
      <div class="filter-left-box">
        <div class="filter-item">
          <div class="list-info-item">
            <span>项目：</span>
            <el-cascader
              v-model="currentProjectId"
              placeholder="试试搜索：项目名称"
              :options="projectCascadeList"
              :props="{ value: 'id', label: 'name', children: 'children', expandTrigger: 'hover' }"
              :disabled="dailyMateCheck"
              :show-all-levels="false"
              clearable
              filterable
              style="width:250px"
              @change="projectChange"
            />
          </div>
        </div>
        <div class="filter-item">
          <div class="list-info-item">
            <span>入库时间：</span>
            <el-date-picker
              v-model="inboundList.storageTime"
              align="right"
              type="date"
              placeholder="选择日期"
              value-format="timestamp"
              :picker-options="pickerOptions"
            />
          </div>
        </div>
        <div class="filter-item">
          <div class="list-info-item">
            <span>入库人：</span>
            {{ name }}
          </div>
        </div>
      </div>
      <!-- 右侧box -->
      <div class="filter-right-box">
        <div class="filter-item">
          <el-tooltip class="item" effect="dark" content="甲供材料：必须选择项目(采购单价、品牌、供应商无需填写)" placement="top">
            <el-checkbox v-model="provideMateCheck" :disabled="dailyMateCheck" @change="changeProvide">甲供材料</el-checkbox>
          </el-tooltip>
        </div>
        <div class="filter-item">
          <el-tooltip class="item" effect="dark" content="日常备料：常规入库(无需项目信息)" placement="top">
            <el-checkbox v-model="dailyMateCheck" :disabled="provideMateCheck" @change="inboundTypeChange">日常备料</el-checkbox>
          </el-tooltip>
        </div>
      </div>
    </div>
    <!-- 主要内容容器 -->
    <div class="content-container">
      <el-table :data="tableData" max-height="600" style="width: 100%" border stripe>
        <el-table-column label="序号" align="center" type="index" min-width="80" />
        <el-table-column prop="province" align="center" label="编号" min-width="100">
          <template slot-scope="scope">
            <div class="mask-td">
              <el-tag v-if="scope.row.materialCode" size="medium">{{ scope.row.materialCode }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="物料类别 | 名称/种类/材质" align="center" min-width="300">
          <template slot-scope="scope">
            <div class="mask-td">
              <div :class="{'mask-red': scope.row.rules.detailId}" />
              <el-cascader
                v-model="scope.row.materialClassIds"
                placeholder="试试搜索：名称、种类或材质"
                :options="mateOption"
                :props="props"
                filterable
                style="width:275px"
                @change="() =>{materialChange(scope.row);scope.row.rules.detailId = false}"
              />
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="province" label="颜色" align="center" min-width="110">
          <template slot-scope="scope">
            <div class="mask-td">
              <div :class="{'mask-red': scope.row.rules.color}" />
              <el-input v-model="scope.row.color" size="small" placeholder="颜色" />
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="province" label="数量" align="center" min-width="150">
          <template slot-scope="scope">
            <div class="mask-td">
              <div :class="{'mask-red': scope.row.rules.number}" />
              <el-input-number v-model="scope.row.number" :min="1" :step="5" :precision="0" size="small" @change="() => {scope.row.rules.number = false;calcTotal()}" />
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="province" label="采购单价(元)" align="center" min-width="160">
          <template slot-scope="scope">
            <div class="mask-td">
              <div :class="{'mask-red': scope.row.rules.purchasePrice}" />
              <el-input-number v-model="scope.row.purchasePrice" :min="0" :step="100" :precision="2" size="small" style="width:160px" @change="() => {scope.row.rules.purchasePrice = false;calcTotal()}" />
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="province" label="总额(元)" align="center" min-width="130">
          <template slot-scope="scope">
            <div class="mask-td">
              <el-tag v-if="scope.row.taxIncludedAmount !== null && scope.row.taxIncludedAmount !== undefined && scope.row.taxIncludedAmount !== ''" type="success" size="medium">{{ scope.row.taxIncludedAmount }}</el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="province" label="品牌" align="center" min-width="200">
          <template slot-scope="scope">
            <div class="mask-td">
              <div :class="{'mask-red': scope.row.rules.brand}" />
              <el-input v-model="scope.row.brand" size="small" placeholder="品牌" @change="scope.row.rules.brand = false" />
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="province" label="供应商" align="center" min-width="200">
          <template slot-scope="scope">
            <div class="mask-td">
              <div :class="{'mask-red': scope.row.rules.supplierId}" />
              <el-select v-model="scope.row.supplierId" size="small" filterable clearable placeholder="供应商" @change="scope.row.rules.supplierId = false">
                <el-option
                  v-for="item in supplierList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="province" label="备注" align="center" width="200">
          <template slot-scope="scope">
            <div class="mask-td">
              <el-input v-model="scope.row.tip" size="small" placeholder="备注" />
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div class="mask-td" style="justify-content:left">
              <el-button size="small" class="el-icon-delete" type="danger" @click="deleteRow(scope.$index)" />
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="footer-drawer">
        <el-button class="cancel-btn" size="small" icon="el-icon-circle-plus-outline" type="warning" style="margin-right:15px" @click="addRow()">继续添加</el-button>

      </div>
    </div>
    <div class="footer-toolbar">
      <div class="footer-toolbar-drawer">
        <div class="price-drawer">
          <div class="price-total-tip">
            <span>合计</span>
          </div>
          <div class="price-total-num">
            <span>{{ totalAmount }}元</span>
          </div>
          <div class="price-total-tip">
            <span>大写</span>
          </div>
          <div class="price-total-num" style="width:60%">
            <span>{{ totalAmount | digitUppercase }}</span>
          </div>
        </div>
        <el-button type="primary" icon="el-icon-arrow-left" size="small" @click="closeDlg">返回</el-button>
        <el-popover v-model="successVisible" placement="top" width="160" trigger="click">
          <p>确认提交？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="successVisible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="()=> {successVisible = false;submitScrap()}">确定</el-button>
          </div>
          <el-button slot="reference" :loading="submitLoading" type="primary" size="small" icon="el-icon-s-promotion" style="margin-left:10px;">提交入库清单</el-button>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { setInfoOfTree, removeTreeEmptyFiled, getNodeInfoByIds } from '@/utils'
import { MATERIAL_BASE_TYPE } from '@/utils/conventionalContent'
import { changeProjectToCascadeByYear } from '@/utils/other'
import { fetchMaterialTree } from '@/api/material'
import { fetchListByBaseType } from '@/api/supplier'
import { fetchProjectGroupByYear } from '@/api/project'
import { createInboundList } from '@/api/warehouse'
export default {
  name: 'GeneralMateComponent',
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      successVisible: false,
      provideMateCheck: false,
      dailyMateCheck: false,
      props: { value: 'id', label: 'name', children: 'childrenList', expandTrigger: 'hover' }, // 级联列表格式
      mateOption: [], // 物料级联列表
      supplierList: [], // 供应商列表
      currentBaseType: MATERIAL_BASE_TYPE.material, // 一般物料类型
      submitLoading: false, // 提交load
      inboundList: {
        storageTime: undefined,
        type: 0,
        formType: undefined,
        projectId: undefined
      }, // 入库清单
      tableData: [], // 列表数据
      rules: {
        supplierId: false,
        brand: false,
        purchasePrice: false,
        number: false,
        color: false,
        detailId: false
      },
      needValid: {
        supplierId: true,
        brand: true,
        purchasePrice: true,
        number: true,
        color: false,
        detailId: true
      },
      provideMateValid: {
        number: true,
        detailId: true
      },
      totalAmount: 0, // 总金额
      currentProjectId: [], // 需要入库的项目
      projectCascadeList: [] // 项目级联列表
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.getMaterialClassTree(this.currentBaseType.index)
    this.getSupplierList(this.currentBaseType.index)
    this.getProjectYearCascade()
    this.tableData.push({ rules: { ...this.rules }})
    this.inboundList.storageTime = new Date().getTime()
    this.inboundList.formType = this.currentBaseType.index
  },
  methods: {
    submitScrap() {
      this.submitLoading = true
      this.validSubmit().then(({ data }) => {
        console.log(data)
        createInboundList(data).then(({ code, message }) => {
          if (code === 200) {
            this.$message({ message: '保存成功', type: 'success' })
            // this.$emit('closeEvent')
            this.tableData = [{ rules: { ...this.rules }}]
          } else {
            this.$message({ message: message, type: 'error' })
          }
          this.submitLoading = false
        }).catch(e => {
          this.submitLoading = false
          this.$message({ message: '保存失败', type: 'error' })
        })
        this.submitLoading = false
      }).catch(e => {
        this.submitLoading = false
      })
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
    /**
     * 获取物料列表
     */
    getMaterialClassTree: function(baseType) {
      fetchMaterialTree(baseType).then(({ data, code, message }) => {
        if (code === 200) {
          if (data && data.length) {
            this.mateOption = data
            setInfoOfTree(this.mateOption, 'childrenList', 'name', 'otherInfo', 2)
            this.mateOption = removeTreeEmptyFiled(this.mateOption, 'childrenList')
          }
        } else {
          this.$message({
            message: message,
            type: 'error'
          })
        }
      }).catch(e => {
        this.$message({
          message: '获取物料失败',
          type: 'error'
        })
        console.log(e)
      })
    },
    materialChange: function(item) {
      if (item.materialClassIds && item.materialClassIds.length === 3) {
        const _materialNode = getNodeInfoByIds(this.mateOption, item.materialClassIds, 'id', 'childrenList')
        item.materialCode = _materialNode.otherInfo
        item.detailId = item.materialClassIds[2]
      }
    },
    projectChange: function() {
      this.inboundList.projectId = this.currentProjectId[1]
    },
    inboundTypeChange: function(check) {
      if (check) {
        this.currentProjectId = []
        this.inboundList.projectId = undefined
      }
    },
    getSupplierList: function(baseType) {
      fetchListByBaseType(baseType).then(({ data, code, message }) => {
        if (code === 200) {
          if (data) {
            this.supplierList = data
          }
        } else {
          this.$message({
            message: `拉取供应商信息失败,${message}`,
            type: 'error'
          })
        }
      }).catch(e => {
        this.$message({
          message: '拉取供应商信息失败',
          type: 'error'
        })
        console.log(e)
      })
    },
    calcTotal: function() {
      let totalAmount = 0
      this.tableData.forEach(v => {
        if (v.purchasePrice === undefined || v.number === undefined) {
          v.taxIncludedAmount = undefined
        } else {
          v.taxIncludedAmount = ((v.purchasePrice || 0) * (v.number || 0)).toFixed(2)
        }
        totalAmount += Number(v.taxIncludedAmount)
      })
      this.totalAmount = totalAmount
    },
    validSubmit() {
      return new Promise((resolve, reject) => {
        if (this.provideMateCheck) {
          if (!this.inboundList.projectId) {
            this.notifyFun({ title: `${this.currentBaseType.name}入库`, message: '甲供材料必须选择入库项目', type: 'warning' })
            reject()
          }
        }
        if (!this.inboundList.storageTime) {
          this.notifyFun({ title: `${this.currentBaseType.name}入库`, message: '请选择入库时间', type: 'warning' })
          reject()
        }
        this.clearAllValid()
        const _tableData = JSON.parse(JSON.stringify(this.tableData))
        if (!_tableData || _tableData.length < 1) {
          this.notifyFun({ title: `${this.currentBaseType.name}入库`, message: '请添加入库记录', type: 'warning' })
          reject()
        }
        let errorFlag = false
        _tableData.forEach(v => {
          const _valid = this.provideMateCheck ? this.provideMateValid : this.needValid
          for (const r in _valid) {
            if (_valid[r] && (v[r] === undefined || v[r] === null)) {
              v.rules[r] = true
              errorFlag = true
            }
          }
        })
        this.tableData = JSON.parse(JSON.stringify(_tableData))
        if (errorFlag) {
          this.notifyFun({ title: `${this.currentBaseType.name}入库`, message: '请修正表格中标红的信息', type: 'warning' })
          reject()
        }
        _tableData.forEach(v => {
          delete v.materialClassIds
          delete v.rules
        })
        const _inboundList = JSON.parse(JSON.stringify(this.inboundList))
        _inboundList.detailList = _tableData
        _inboundList.totalPrice = this.totalAmount
        resolve({ data: _inboundList })
      })
    },
    clearAllValid: function() {
      this.tableData.forEach(v => {
        for (const r in this.rules) {
          v.rules[r] = false
        }
      })
    },
    // 添加行
    addRow: function() {
      this.tableData.push({ rules: { ...this.rules }})
    },
    // 删除行
    deleteRow: function(index) {
      this.tableData.splice(index, 1)
      this.calcTotal()
    },
    notifyFun: function({ message, type, title }) {
      setTimeout(() => {
        this.$notify({ title: title, message: message, type: type })
      }, 50)
    },
    changeProvide: function(check) {
      this.inboundList.type = check ? 1 : 0
    },
    closeDlg() {
      this.$emit('closeEvent')
    }
  }
}
</script>

<style scoped>
.content-container {
  margin-bottom: 60px;
}
.filter-item {
  margin-right: 20px;
}
.page-container {
  position: relative;
  padding: 0;
}
.footer-drawer {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
.list-info-item {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.list-info-item >span {
  font-weight: bold;
  font-size: 15px;
  margin-right: 10px;
}

.list-info-item >span:nth-child(2) {
  font-weight: 300
}

.footer-toolbar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  position: fixed;
  width: 100%;
  bottom: 0;
  right: 0;
  height: 45px;
  box-shadow: 0 -1px 2px rgba(0,0,0,.03);
  background: #ffffff;
  /* border-top: 1px solid #e9e9e9; */
  padding: 0 25px 0 0;
  transition: .3s;
  z-index: 14;
}
.footer-toolbar-drawer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
}
.price-drawer {
  font-weight: bold;
  font-size: 16px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  width: 100%;
}
.price-total-tip {
  width: 60px;
  height: 100%;
  background-color: #606266;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  box-shadow: 0 -2px 2px rgba(0, 0, 0, 0.08);
}
.price-total-num {
  width: 200px;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  /* color: #ffffff; */
  align-items: center;
  box-sizing: border-box;
  padding: 0 20px;
}
</style>
<style>
.inbound-table .el-table .cell {
  padding: 0;
}
.inbound-table .el-table .el-table--border th:first-child .cell, .el-table--border td:first-child .cell {
  padding:  0
}
.inbound-table .el-table--border th:first-child .cell, .el-table--border td:first-child .cell {
  padding:  0
}
.inbound-table .el-table--medium td {
  padding: 0;
}
</style>
