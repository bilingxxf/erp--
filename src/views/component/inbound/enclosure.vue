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
            <span>入库单提交时间：</span>
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
      <el-table v-loading="tableLoading" :data="listDetail.detailList" max-height="600" style="width: 100%" border stripe>
        <el-table-column label="序号" align="center" type="index" min-width="80" />
        <el-table-column prop="materialCode" align="center" label="编号" min-width="120">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.materialCode" size="medium">{{ scope.row.materialCode }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="物料类别" align="center">
          <el-table-column prop="typeName" label="名称" align="center" min-width="90" />
          <el-table-column prop="className" label="种类" align="center" min-width="90" />
          <el-table-column prop="detailName" label="材质" align="center" min-width="90" />
        </el-table-column>
        <el-table-column prop="color" label="颜色" align="center" min-width="110" />
        <el-table-column label="规格" align="center">
          <el-table-column prop="specification" label="型号" align="center" min-width="100" />
          <el-table-column prop="length" label="长(m)" align="center" min-width="70">
            <template slot-scope="scope">
              <span>{{ scope.row.length | toFixed(3) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="thickness" label="厚(mm)" align="center" min-width="80">
            <template slot-scope="scope">
              <span>{{ scope.row.thickness | toFixed(3) }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="number" :label="`数量 \n (张)`" align="center" min-width="70" />

        <el-table-column prop="totalLength" :label="`总长度 \n (m)`" align="center" min-width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.totalLength | toFixed(3) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="purchasePrice" :label="`采购单价 \n (m/元)`" align="center" min-width="90">
          <template slot-scope="scope">
            <span>{{ scope.row.purchasePrice | toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="taxIncludedAmount" :label="`总额 \n (元)`" align="center" min-width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.taxIncludedAmount !== null" type="success" size="medium">{{ scope.row.taxIncludedAmount | toFixed(2) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="brand" label="品牌" align="center" min-width="140" />
        <el-table-column prop="supplierName" label="供应商" align="center" min-width="140" />
        <el-table-column prop="warehouse" label="仓库位置" align="center" min-width="140">
          <template slot-scope="scope">
            <el-input v-if="isVerify && listDetail.status === inboundVerify.unfinished" v-model="scope.row.warehouse" size="small" placeholder="仓库位置" />
            <span v-else>{{ scope.row.warehouse }}</span>
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
          <el-button type="primary" icon="el-icon-arrow-left" @click="closeDlg">返回</el-button>
          <template v-if="isVerify && listDetail.status === inboundVerify.unfinished">
            <el-popover v-model="retrunVisible" placement="top" width="160" trigger="click">
              <p>确认退回？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="retrunVisible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="()=> {retrunVisible = false;submitVerifyResult(inboundVerify.return)}">确定</el-button>
              </div>
              <el-button slot="reference" v-permission="['50_203_1']" :loading="submitLoading" type="danger" icon="el-icon-circle-close">退回</el-button>
            </el-popover>
            <el-popover v-model="successVisible" placement="top" width="160" trigger="click">
              <p>确认通过？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="successVisible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="()=> {successVisible = false;submitVerifyResult(inboundVerify.success)}">确定</el-button>
              </div>
              <el-button slot="reference" v-permission="['50_203_1']" :loading="submitLoading" type="success" icon="el-icon-circle-check">通过</el-button>
            </el-popover>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { MATERIAL_BASE_TYPE, INBOUND_VERIFY, INBOUND_VERIFY_STATUS } from '@/utils/conventionalContent'
import { fetchDetailList, verifyInboundList } from '@/api/warehouse'
export default {
  name: 'InboundStripSteelComponent',
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
      inboundVerify: INBOUND_VERIFY,
      inboundVerifyStatus: INBOUND_VERIFY_STATUS,
      currentBaseType: MATERIAL_BASE_TYPE.enclosure, // 围护
      retrunVisible: false,
      successVisible: false,
      provideMateCheck: false,
      dailyMateCheck: false,
      submitLoading: false, // 提交load
      tableLoading: false, // 列表加载
      tableData: [], // 列表数据
      listDetail: {}, // 入库清单
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
            this.listDetail.detailList = this.listDetail.detailList || []
            this.listDetail.provideMateCheck = this.listDetail.type === 1
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
    submitVerifyResult(status) {
      const submitData = {
        id: this.detailId,
        status: status
      }
      if (this.inboundVerify.success === status) {
        submitData.details = this.getPosition()
      }
      this.submitLoading = true
      verifyInboundList(submitData).then(({ data, code, message }) => {
        if (code === 200) {
          const _message = `当前入库单${this.inboundVerifyStatus[status]}`
          this.$message({ message: _message, type: 'success' })
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
    getPosition() {
      if (!this.listDetail.detailList) {
        return []
      }
      const arr = this.listDetail.detailList.map(v => {
        return {
          id: v.id,
          warehouse: v.warehouse
        }
      })
      return arr || []
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
