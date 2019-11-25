<template>
  <!-- 页面主容器 -->
  <div class="page-container material-pool-component">
    <div :class="{'mask-container':submitLoading}" />
    <!-- 查询容器 -->
    <div class="filter-container">
      <!-- 左侧box -->
      <div class="filter-left-box" />
      <!-- 右侧box -->
      <div class="filter-right-box" />
    </div>
    <!-- 主要内容容器 -->
    <div class="content-container" style="margin-bottom:80px">
      <el-table ref="poolTable" v-loading="tableLoading" :data="tableData" style="width: 100%" border stripe @select-all="selectAllChange" @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" min-width="55" :selectable="(row,index) =>{return !materialMoveMode || moveType != materialMoveType.partyA || row.storageListType == materialInboundType.partyA}" @select="selectChange" />
        <el-table-column label="序号" align="center" type="index" min-width="80">
          <template slot-scope="scope">
            <div v-if="scope.row.storageListType == materialInboundType.partyA" class="party-tip">甲供</div>
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="materialCode" align="center" label="编号" min-width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.materialCode" size="medium">{{ scope.row.materialCode }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="物料类别" align="center">
          <el-table-column prop="typeName" label="名称" align="center" min-width="90" />
          <el-table-column prop="className" label="种类" align="center" min-width="90" />
          <el-table-column prop="detailName" label="材质" align="center" min-width="90" />
        </el-table-column>
        <el-table-column label="规格" align="center">
          <el-table-column prop="length" label="长(m)" align="center" min-width="70">
            <template slot-scope="scope">
              <span>{{ scope.row.length | toFixed(3) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="width" label="宽(m)" align="center" min-width="70">
            <template slot-scope="scope">
              <span>{{ scope.row.width | toFixed(3) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="thickness" label="厚(mm)" align="center" min-width="70">
            <template slot-scope="scope">
              <span>{{ scope.row.thickness | toFixed(2) }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="theoryThickness" :label="`理论 \n 厚度 \n (mm)`" align="center" min-width="70">
          <template slot-scope="scope">
            <span>{{ scope.row.theoryThickness }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="number" :label="`数量 \n (张)`" align="center" min-width="70" />
        <el-table-column prop="weight" :label="`总重 \n (t)`" align="center" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.weight | toFixed(DECIMAL_NUMBER.ton) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="purchasePrice" :label="`采购单价 \n (t/元)`" align="center" min-width="90">
          <template slot-scope="scope">
            <div class="mask-td number-input">
              <div :class="{'mask-red': scope.row.priceError}" />
              <span v-if="!materialMoveMode || moveType || !scope.row.isProvideMate">{{ scope.row.purchasePrice | toFixed(2) }}</span>
              <el-input-number v-else v-model="scope.row.purchasePrice" controls-position="right" :min="0" :step="100" :precision="2" size="mini" style="width:160px" @change="() => {scope.row.priceError = false;}" />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="brand" label="品牌" align="center" min-width="110" />
        <el-table-column prop="furnaceLotNumber" label="炉批号" align="center" min-width="170" />
        <el-table-column prop="taxIncludedAmount" label="仓库位置" align="center" min-width="140">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="`${scope.row.warehouse || '无'}`" placement="left" :disabled="!scope.row.warehouse">
              <span>{{ scope.row.warehouse }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column v-if="materialMoveMode" prop="purchasePrice" :label="`总额 \n (元)`" align="center" min-width="90">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.purchasePrice != undefined" type="success" size="medium">{{ (scope.row.weight || 0 ) * (scope.row.purchasePrice || 0) | toFixed(2) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column v-if="!materialMoveMode" label="操作" align="center" min-width="200">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="`入库单号：${scope.row.storageListNo || '无'}`" placement="left" :disabled="poolType == materialPoolType.remainder || !scope.row.storageListNo">
              <el-button v-permission="['50_203_1']" type="primary" size="small" @click="handlingOut(scope.row)">办理出库</el-button>
            </el-tooltip>
            <el-button type="success" size="small" @click="printLabel(scope.row)">打印标签</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination v-show="total > 0" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.size" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </div>
    <el-dialog
      title="出库办理"
      :visible.sync="handingOutVisible"
      width="450px"
      @closed="formClose"
    >
      <el-form ref="handingOutForm" :label-position="'right'" label-width="80px" :model="handingOutForm" :rules="rules">
        <el-form-item label="出库方式" prop="outboundType">
          <el-radio-group v-model="handingOutForm.outboundType">
            <el-radio :label="0">整出</el-radio>
            <el-radio :label="1">半出</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="projectId" label="项目">
          <span>{{ `${currentMaterial.projectName}` }}</span>
        </el-form-item>
        <el-form-item v-else label="项目" prop="currentProjectId">
          <el-cascader
            v-model="handingOutForm.currentProjectId"
            placeholder="试试搜索：项目名称"
            :options="projectCascadeList"
            :props="{ value: 'id', label: 'name', children: 'children', expandTrigger: 'hover' }"
            :show-all-levels="false"
            filterable
            @change="projectChange"
          />
        </el-form-item>
        <el-form-item label="物料名称">
          <span>{{ `${currentMaterial.typeName} - ${currentMaterial.className} - ${currentMaterial.detailName}` }}</span>
          <el-tag v-if="currentMaterial.materialCode" size="small" style="margin-left:5px">{{ currentMaterial.materialCode }}</el-tag>
        </el-form-item>
        <el-form-item label="物料尺寸">
          <span>{{ `${currentMaterial.length} * ${currentMaterial.width} * ${currentMaterial.thickness}` }}</span>
          <el-tag size="small" style="margin-left:5px">{{ `长(m) * 宽(m) * 厚(mm)` }}</el-tag>
        </el-form-item>
        <el-form-item label="库存">
          <span>{{ `${currentMaterial.number}` }}</span>
        </el-form-item>
        <el-form-item v-if="handingOutForm.outboundType === 1" label="截取方式" prop="cutOffType">
          <el-radio-group v-model="handingOutForm.cutOffType" @change="handingOutForm.cutOffLength = undefined">
            <el-radio :label="0">取长(m)</el-radio>
            <el-radio :label="1">取宽(m)</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="handingOutForm.outboundType === 1" label="截取长度" prop="cutOffLength">
          <el-input-number v-model="handingOutForm.cutOffLength" :precision="3" :step="0.5" :min="0" :max="handingOutForm.cutOffType === 0 ? currentMaterial.length : currentMaterial.width" />
        </el-form-item>
        <el-form-item label="出库数量" prop="number">
          <el-input-number v-model="handingOutForm.number" :precision="0" :step="1" :min="1" :max="currentMaterial.number" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="formClose">取 消</el-button>
        <el-button type="primary" @click="submitOutBoundResult()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { MATERIAL_BASE_TYPE, INBOUND_VERIFY, INBOUND_VERIFY_STATUS, MATERIAL_POOL_TYPE, MATERIAL_MOVE_TYPE, MATERIAL_INBOUND_TYPE } from '@/utils/conventionalContent'
import { printSteelPlateLabel } from '@/utils/print'
import { changeProjectToCascadeByYear } from '@/utils/other'
import { fetchMaterialPool, createOutbound, materialMove } from '@/api/warehouse'
import { fetchProjectGroupByYear } from '@/api/project'
export default {
  name: 'PoolSteelPlateComponent',
  props: {
    baseType: {
      type: Number,
      default: 0
    },
    typeId: {
      type: Number,
      default: 0
    },
    classId: {
      type: Number,
      default: 0
    },
    detailId: {
      type: Number,
      default: 0
    },
    projectId: {
      type: Number,
      default: 0
    },
    poolType: {
      type: Number,
      default: 0
    },
    visible: {
      type: Boolean,
      default: true
    },
    materialMoveMode: {
      type: Boolean,
      default: false
    },
    moveType: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      inboundVerify: INBOUND_VERIFY,
      inboundVerifyStatus: INBOUND_VERIFY_STATUS,
      materialPoolType: MATERIAL_POOL_TYPE,
      materialMoveType: MATERIAL_MOVE_TYPE,
      materialInboundType: MATERIAL_INBOUND_TYPE,
      currentBaseType: MATERIAL_BASE_TYPE.steelPlate, // 钢板
      handingOutVisible: false,
      submitLoading: false, // 提交load
      tableLoading: false, // 列表加载
      handingOutForm: {
        outboundType: 0,
        cutOffType: 0,
        number: 1,
        currentProjectId: [] // 需要入库的项目
      },
      listQuery: {
        page: 1,
        size: 10
      },
      total: 0,
      currentMaterial: {}, // 当前物料
      multipleSelection: [], // 选中列表
      tableData: [], // 列表数据

      projectCascadeList: [], // 项目级联列表
      rules: { // 物料种类表单验证
        number: [
          { required: true, message: '请输入数量', trigger: 'blur' }
        ],
        outboundType: [
          { required: true, message: '请选择出库方式', trigger: 'blur' }
        ],
        cutOffType: [
          { required: true, message: '请选择截取方式', trigger: 'blur' }
        ],
        cutOffLength: [
          { required: true, message: '请输入截取长度', trigger: 'blur' }
        ],
        currentProjectId: [
          { required: true, message: '请选择项目', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    baseType(newVal, oldVal) {
      this.handleFilter()
    },
    typeId(newVal, oldVal) {
      this.handleFilter()
    },
    classId(newVal, oldVal) {
      this.handleFilter()
    },
    detailId(newVal, oldVal) {
      this.handleFilter()
    },
    projectId(newVal, oldVal) {
      this.handleFilter()
    },
    poolType(newVal, oldVal) {
      this.handleFilter()
    },
    materialMoveMode(newVal, oldVal) {
      this.toggleSelection()
    }
  },
  mounted() {
    this.getList()
    this.getProjectYearCascade()
  },
  methods: {
    handlingOut: function(item) {
      this.handingOutVisible = true
      this.currentMaterial = item
      // this.selectDefaultProject()
    },
    async materialMove() {
      if (!(this.multipleSelection && this.multipleSelection.length)) {
        this.$message({ message: '请选择需要搬家物料', type: 'warning' })
        return
      }
      let moveData

      if (this.moveType === this.materialMoveType.common) {
        const result = await this.validSubmit()
        if (!result) {
          return
        }
        moveData = this.multipleSelection.map(v => {
          return {
            id: v.id,
            purchasePrice: v.purchasePrice
          }
        })
      } else {
        moveData = this.multipleSelection.map(v => {
          return {
            id: v.id
          }
        })
      }
      this.submitMaterialMove(moveData)
    },
    submitMaterialMove: function(data) {
      materialMove({ type: this.moveType, details: data }).then(({ data, code, message }) => {
        if (code === 200) {
          this.$message({ message: '搬家成功', type: 'success' })
          this.getList()
        } else {
          this.$message({ message: message, type: 'error' })
        }
      }).catch(() => {
        this.$message({ message: '搬家失败', type: 'error' })
        this.tableLoading = false
      })
    },
    batchPrintLabel: function() {
      if (!(this.multipleSelection && this.multipleSelection.length)) {
        this.$message({ message: '请选择需要打印的数据', type: 'warning' })
        return
      }
      this.multipleSelection.forEach(v => {
        this.printLabel(v)
      })
      this.toggleSelection()
    },
    printLabel: function(item) {
      if (!item) {
        return
      }
      printSteelPlateLabel({
        length: item.length.toFixed(3),
        width: item.width.toFixed(3),
        thickness: item.thickness.toFixed(2),
        material: item.detailName,
        projectName: item.projectName,
        qrCode: JSON.stringify({
          id: item.id
        })
      })
    },
    getList: function() {
      this.listQuery = {
        formType: this.baseType,
        typeId: this.typeId || undefined,
        classId: this.classId || undefined,
        detailId: this.detailId || undefined,
        projectId: this.projectId || undefined,
        materialPoolType: this.poolType,
        page: this.listQuery.page,
        size: this.listQuery.size
      }
      if (this.listQuery.projectId === -1) {
        this.tableData = []
        return
      }
      this.tableLoading = true
      fetchMaterialPool(this.listQuery).then(({ data, code, message }) => {
        if (code === 200) {
          this.tableData = []
          if (data && data.data) {
            this.tableData = data.data.map(v => {
              // v.isProvideMate = Number(v.storageListType) === this.materialInboundType.partyA && !v.purchasePrice
              if (Number(v.storageListType) === this.materialInboundType.partyA && !v.purchasePrice) {
                v.purchasePrice = undefined
                v.isProvideMate = true
              } else {
                v.isProvideMate = false
              }
              v.priceError = false
              return v
            })
          }
          this.total = data.totalCount
        } else {
          this.$message({ message: message, type: 'error' })
        }

        this.tableLoading = false
      }).catch(() => {
        this.$message({ message: '获取清单详情失败', type: 'error' })
        this.tableLoading = false
      })
    },
    submitOutBoundResult: function(status) {
      this.submitLoading = true
      this.$refs['handingOutForm'].validate((valid) => {
        if (valid) {
          this.handingOutForm.materialPoolId = this.currentMaterial.id
          this.handingOutForm.projectId = this.projectId ? this.projectId : this.handingOutForm.projectId
          createOutbound(this.handingOutForm).then(({ data, code, message }) => {
            if (code === 200) {
              this.$message({
                message: '加入出库单成功',
                type: 'success'
              })
              this.handingOutVisible = false
              this.$refs['handingOutForm'].resetFields()
              this.getList()
            } else {
              this.$message({ message: message, type: 'error' })
            }
            this.submitLoading = false
          }).catch(e => {
            this.submitLoading = false
            this.$message({ message: '加入出库单失败', type: 'error' })
            console.log(e)
          })
        } else {
          this.submitLoading = false
          return false
        }
      })
    },
    formClose: function() {
      this.handingOutVisible = false
      this.$refs['handingOutForm'].resetFields()
    },
    /**
     * 获取项目年份级联列表
     */
    getProjectYearCascade: function() {
      fetchProjectGroupByYear().then(({ data, code, message }) => {
        if (code === 200) {
          this.projectCascadeList = changeProjectToCascadeByYear(data)
        } else {
          this.$message.error(message)
        }
      }).catch(e => {
        this.$message.error('获取项目级联列表失败')
      })
    },
    selectDefaultProject: function() {
      if (this.projectCascadeList[0] && this.projectCascadeList[0].children[0] && this.projectCascadeList[0].children[0].id) {
        this.handingOutForm.currentProjectId = [this.projectCascadeList[0].id, this.projectCascadeList[0].children[0].id]
        this.handingOutForm.projectId = this.handingOutForm.currentProjectId[1]
      } else {
        this.handingOutForm.currentProjectId = []
        this.handingOutForm.projectId = undefined
      }
    },
    projectChange: function() {
      this.handingOutForm.projectId = this.handingOutForm.currentProjectId[1]
    },
    validSubmit() {
      return new Promise((resolve, reject) => {
        this.clearAllValid()
        let errorFlag = false
        this.multipleSelection.forEach(v => {
          if (v['purchasePrice'] === undefined || v['purchasePrice'] === null) {
            v['priceError'] = true
            errorFlag = true
          }
        })
        if (errorFlag) {
          this.$notify({ title: '物料搬家', message: '请修正表格中标红的信息(填写采购单价)', type: 'warning' })
          reject(false)
          return
        }
        resolve(true)
      })
    },
    clearAllValid: function() {
      this.tableData.forEach(v => {
        v.priceError = false
      })
    },
    toggleSelection: function(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.poolTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.poolTable.clearSelection()
      }
    },
    handleSelectionChange: function(val) {
      this.multipleSelection = val
    },
    // 搜索界面
    handleFilter: function() {
      this.listQuery.page = 1
      this.getList()
    },
    // page组件相关
    handleSizeChange: function(val) {
      this.listQuery.size = val
      this.getList()
    },
    handleCurrentChange: function(val) {
      this.listQuery.page = val
      this.getList()
    },
    selectChange: function(selection, row) {
      if (!selection || selection.length === 0) {
        row.priceError = false
      }
    },
    selectAllChange: function(selection) {
      if (!selection || selection.length === 0) {
        this.clearAllValid()
      }
    }
  }
}
</script>

<style scoped>
.content-container {
  margin-bottom: 80px;
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
  height: 50px;
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
  width: 80px;
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
.submit-item {
  width: 220px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.submit-item :nth-child(n) {
  margin-left: 5px;
}
</style>
<style>
.material-pool-component .el-table .cell {
  padding: 0;
}
.material-pool-component .el-table .el-table--border th:first-child .cell, .el-table--border td:first-child .cell {
  padding:  0
}
.material-pool-component .el-table--border th:first-child .cell, .el-table--border td:first-child .cell {
  padding:  0
}
.material-pool-component .el-table--medium td {
  padding: 0;
  overflow: hidden!important;

}
.material-pool-component .number-input .el-input-number.is-controls-right .el-input__inner {
  padding-left: 0;
  padding-right: 25px;
}
.material-pool-component .party-tip {
    background: #e64242;
    transform:  rotate(-45deg);
    color: white;
    font-weight: 100;
    position: absolute;
    top: 5px;
    left: -20px;
    right: 0;
    width: 70px;
    height: 20px;
    font-size: 11px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
