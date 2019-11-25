<template>
  <!-- 页面主容器 -->
  <div class="page-container inbound-verify-table">
    <div :class="{'mask-container':submitLoading}" />
    <!-- 查询容器 -->
    <div class="filter-container">
      <!-- 左侧box -->
      <div class="filter-left-box">
        <div v-if="listDetail.projectName" class="filter-item">
          <div class="list-info-item">
            <span>项目：</span>
            <span>{{ listDetail.projectName }}</span>
          </div>
        </div>
        <div class="filter-item">
          <div class="list-info-item">
            <span>入库时间：</span>
            <span>{{ listDetail.storageTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </div>
        </div>
        <div class="filter-item">
          <div class="list-info-item">
            <span>入库人：</span>
            <span>{{ listDetail.createUserName }}</span>
          </div>
        </div>
        <div class="filter-item">
          <el-tag v-if="listDetail.provideMateCheck" type="success" size="mini">甲供材料</el-tag>
          <el-tag v-if="!listDetail.projectId" size="mini">日常备料</el-tag>
        </div>
      </div>
      <!-- 右侧box -->
      <div class="filter-right-box" />
    </div>
    <!-- 主要内容容器 -->
    <div class="content-container">
      <el-table v-loading="tableLoading" :data="listDetail.detailList" max-height="600" style="width: 100%" border stripe @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="55" :selectable="(row,index) =>{return row.checkAble}" />
        <el-table-column label="序号" align="center" type="index" width="50" />
        <el-table-column prop="materialCode" align="center" label="编号" min-width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.materialCode" size="medium">{{ scope.row.materialCode }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="className" label="状态" align="center" min-width="100">
          <template slot-scope="scope"><el-tag :type="materialReturnIndexStatus[scope.row.currentStatus].tip" size="medium">{{ materialReturnIndexStatus[scope.row.currentStatus].name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="物料类别" align="center">
          <el-table-column prop="typeName" label="名称" align="center" min-width="90" />
          <el-table-column prop="className" label="种类" align="center" min-width="90" />
          <el-table-column prop="detailName" label="材质" align="center" min-width="90" />
        </el-table-column>
        <el-table-column label="规格" align="center">
          <el-table-column prop="specification" label="规格" align="center" min-width="120" />
          <el-table-column prop="width" label="定尺长度(m)" align="center" min-width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.length | toFixed(3) }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="number" :label="`数量 \n (根)`" align="center" min-width="70" />
        <el-table-column prop="weight" :label="`总重 \n (t)`" align="center" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.weight | toFixed(DECIMAL_NUMBER.ton) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="purchasePrice" :label="`采购单价 \n (元)`" align="center" min-width="90">
          <template slot-scope="scope">
            <span>{{ scope.row.purchasePrice | toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="taxIncludedAmount" :label="`总额 \n (元)`" align="center" min-width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.taxIncludedAmount !== null" type="success" size="medium">{{ scope.row.taxIncludedAmount | toFixed(2) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="province" :label="`单位净重 \n (kg/㎡)`" align="center" min-width="90">
          <template slot-scope="scope">
            <el-tag type="warning" size="medium">{{ scope.row.unitNetWeight | toFixed(2) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="brand" label="品牌" align="center" min-width="140" />
        <el-table-column prop="supplierName" label="供应商" align="center" min-width="140" />
        <el-table-column prop="furnaceLotNumber" label="炉批号" align="center" min-width="140" />
        <el-table-column prop="taxIncludedAmount" label="仓库位置" align="center" min-width="140">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="`${scope.row.warehouse || '无'}`" placement="left" :disabled="!scope.row.warehouse">
              <span>{{ scope.row.warehouse }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="footer-toolbar">
      <div class="footer-toolbar-drawer">
        <div class="price-drawer">
          <div class="price-total-tip">
            <span>合计</span>
          </div>
          <div class="price-total-num">
            <span>{{ listDetail.totalPrice }}元</span>
          </div>
          <div class="price-total-tip">
            <span>大写</span>
          </div>
          <div class="price-total-num" style="width:60%">
            <span>{{ listDetail.totalPrice | digitUppercase }}</span>
          </div>
        </div>
        <div class="submit-item">
          <template v-if="isVerify">
            <el-button type="primary" icon="el-icon-arrow-left" @click="closeDlg">返回</el-button>
            <el-popover v-model="successVisible" placement="top" width="160" trigger="click">
              <p>确认退库？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="successVisible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="()=> {successVisible = false;submitResult()}">确定</el-button>
              </div>
              <el-button slot="reference" :loading="submitLoading" type="danger" icon="el-icon-circle-check">确认退库</el-button>
            </el-popover>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { MATERIAL_BASE_TYPE, MATERIAL_RETURN_STATUS, MATERIAL_RETURN_INDEX_STATUS_2, MATERIAL_RETURN_STATUS_2, INBOUND_VERIFY } from '@/utils/conventionalContent'
import { fetchDetailList, createReturnList } from '@/api/warehouse'
export default {
  name: 'InboundSteelComponent',
  props: {
    detailId: {
      type: Number,
      default: 0
    },
    isVerify: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      materialReturnStatus: MATERIAL_RETURN_STATUS,
      materialReturnStatus2: MATERIAL_RETURN_STATUS_2,
      materialReturnIndexStatus: MATERIAL_RETURN_INDEX_STATUS_2,
      inboundStatus: INBOUND_VERIFY,
      currentBaseType: MATERIAL_BASE_TYPE.steel, // 型钢
      retrunVisible: false,
      successVisible: false,
      provideMateCheck: false,
      dailyMateCheck: false,
      submitLoading: false, // 提交load
      tableLoading: false, // 列表加载
      tableData: [], // 列表数据
      multipleSelection: [], // 选中的数据
      listDetail: {}, // 入库清单
      submitData: {},
      totalAmount: 0 // 总金额
    }
  },
  watch: {
    detailId(newVal, oldVal) {
      this.getList()
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.tableLoading = true
      this.tableData = []
      fetchDetailList({ id: this.detailId }).then(({ data, code, message }) => {
        if (code === 200) {
          if (data) {
            this.listDetail = data
            this.listDetail.detailList = data.detailList.map(v => {
              v.checkAble = false
              if (v.status === this.inboundStatus.quit) {
                v.currentStatus = this.materialReturnStatus2.return
              } else if (v.status !== this.inboundStatus.quit && v.returnStatus !== this.materialReturnStatus.verify.index) {
                v.currentStatus = this.materialReturnStatus2.processing
              } else {
                v.currentStatus = this.materialReturnStatus2.normal
                v.checkAble = true
              }
              return v
            })
            this.listDetail.provideMateCheck = this.listDetail.type === 1
            this.submitData.projectId = this.listDetail.projectId || undefined
            this.submitData.formType = this.listDetail.formType
          }
        } else {
          this.$message({ message: message, type: 'error' })
        }

        this.tableLoading = false
      }).catch(() => {
        this.$message({ message: '获取清单详情失败', type: 'error' })
        this.tableLoading = false
      })
    },
    submitResult(status) {
      if (!this.multipleSelection || !this.multipleSelection.length) {
        this.$message({ message: '请选择要退库的物料', type: 'warning' })
        return
      }
      this.submitData.outWarehouseTime = new Date().getTime()
      this.submitData.detailList = this.multipleSelection.map(v => {
        return {
          storageListDetailId: v.id
        }
      })
      this.submitLoading = true
      createReturnList(this.submitData).then(({ data, code, message }) => {
        if (code === 200) {
          this.$message({ message: '操作成功', type: 'success' })
          this.getList()
          this.updateListInfo(status)
        } else {
          this.$message({ message: message, type: 'error' })
        }
        this.submitLoading = false
      }).catch(e => {
        console.log(e)
        this.$message({ message: '操作失败', type: 'error' })
        this.submitLoading = false
      })
    },
    updateListInfo(status) {
      this.$emit('refreshEvent', status)
    },
    closeDlg() {
      this.$emit('closeEvent')
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
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
