<template>
  <!-- 主要内容容器 -->
  <div class="content-container ware-outbound-detail-component">
    <el-table v-loading="tableLoading" :data="tableData" style="width: 100%" border stripe>
      <el-table-column label="序号" align="center" type="index" width="50">
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
        <el-table-column prop="unit" label="单位" align="center" min-width="90" />
      </el-table-column>
      <el-table-column v-if="queryType" prop="outboundMode" :label="`出库方式`" align="center" min-width="95">
        <template slot-scope="scope">
          <el-tag :type="outboundMode[scope.row.outboundType] ? outboundMode[scope.row.outboundType].type : 'danger'" size="medium">{{ scope.row.outboundMode }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="规格" align="center" min-width="125">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.newSpecification" type="info" size="medium">{{ scope.row.newSpecification }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="number" :label="`数量 \n (张)`" align="center" min-width="70" />
      <el-table-column v-if="queryType" prop="weight" :label="`重量 \n (kg)`" align="center" min-width="120">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.weight != null || scope.row.weight != undefined " type="info" size="medium">{{ scope.row.weight }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="purchasePrice" :label="`单价 \n (元)`" align="center" min-width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.purchasePrice | toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="purchasePrice" :label="`总价 \n (元)`" align="center" min-width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.taxIncludedAmount !== null" type="success" size="medium">{{ scope.row.taxIncludedAmount | toFixed(2) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="purchasePrice" :label="`出库凭证`" align="center" min-width="120">
        <template slot-scope="scope">
          <el-tag type="danger" size="medium">{{ scope.row.outboundNo }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination v-show="total > 0" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.size" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
  <!-- 其他模块（例如弹窗等） -->
</template>

<script>
import moment from 'moment'
import { MATERIAL_BASE_TYPE, OUTBOUND_MODE, MATERIAL_INBOUND_TYPE } from '@/utils/conventionalContent'
import { setMaterialSpecification } from '@/utils/other'
import { fetchOutboundRecordDetailByNormal, fetchOutboundRecordDetailByProject } from '@/api/warehouse'

export default {
  name: 'WareOutboundDetailComponent',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    queryType: { // 0:常规 1：项目
      type: Number,
      default: 0
    },
    dateType: {
      type: Number,
      default: 1
    },
    dateTime: {
      type: Number,
      default: 0
    },
    projectId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      materialBaseType: MATERIAL_BASE_TYPE,
      materialInboundType: MATERIAL_INBOUND_TYPE,
      outboundMode: OUTBOUND_MODE,
      listDateType: {
        month: 1,
        year: 2
      },
      tableLoading: false,
      tableData: [],
      listQuery: {
        startDate: undefined,
        endDate: undefined,
        page: 1,
        size: 10
      },
      total: 0
    }
  },
  watch: {
    visible(newVal, oldVal) {
      if (newVal) {
        this.handleFilter()
      }
    },
    queryType(newVal, oldVal) {
      this.handleFilter()
    },
    dateType(newVal, oldVal) {
      this.handleFilter()
    },
    dateTime(newVal, oldVal) {
      this.handleFilter()
    },
    projectId(newVal, oldVal) {
      this.handleFilter()
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList: function() {
      if (this.queryType === 0) {
        this.getDataByNormal()
      } else {
        this.getDataByProject()
      }
    },
    getDataByProject: function() {
      const _listQuery = {
        page: this.listQuery.page,
        size: this.listQuery.size,
        projectId: this.projectId
      }
      this.tableLoading = true
      fetchOutboundRecordDetailByProject(_listQuery).then(({ data, code, message }) => {
        if (code === 200) {
          this.tableData = []
          if (data && data.data && data.data.length) {
            this.tableData = data.data.map(v => {
              v.outboundMode = this.outboundMode[v.outboundType] ? (this.outboundMode[v.outboundType].name || '') : ''
              v.newSpecification = setMaterialSpecification(v.formType, v)
              return v
            })
          }
          this.total = data.totalCount
        } else {
          this.$message({ message: message, type: 'error' })
        }
        this.tableLoading = false
      }).catch(e => {
        this.tableLoading = false
        console.log(e)
        this.$message({ message: '获取详情失败', type: 'error' })
      })
    },
    getDataByNormal: function() {
      if (this.dateType === this.listDateType.year) {
        this.listQuery.startDate = moment(this.dateTime).startOf('month').format('YYYY-MM-DD')
        this.listQuery.endDate = moment(this.dateTime).endOf('month').format('YYYY-MM-DD')
      } else {
        this.listQuery.startDate = moment(this.dateTime).startOf('date').format('YYYY-MM-DD')
        this.listQuery.endDate = moment(this.dateTime).endOf('date').format('YYYY-MM-DD')
      }
      this.tableLoading = true
      fetchOutboundRecordDetailByNormal(this.listQuery).then(({ data, code, message }) => {
        if (code === 200) {
          this.tableData = []
          if (data && data.data && data.data.length) {
            this.tableData = data.data.map(v => {
              v.newSpecification = setMaterialSpecification(v.formType, v)
              return v
            })
          }
          this.total = data.totalCount
        } else {
          this.$message({ message: message, type: 'error' })
        }
        this.tableLoading = false
      }).catch(e => {
        this.tableLoading = false
        this.$message({ message: '获取详情失败', type: 'error' })
      })
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
    }
  }
}
</script>

<style>
.ware-outbound-detail-component .el-table__body td {
  overflow: hidden!important;
}
</style>
