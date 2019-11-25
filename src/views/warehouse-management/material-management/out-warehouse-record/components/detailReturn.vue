<template>
  <!-- 主要内容容器 -->
  <div class="content-container">
    <el-table ref="poolTable" v-loading="tableLoading" :data="tableData" style="width: 100%" border stripe>
      <el-table-column label="序号" align="center" type="index" min-width="80" />
      <el-table-column prop="materialCode" align="center" label="编号" min-width="100">
        <template slot-scope="scope">
          <el-tag size="medium">{{ scope.row.materialCode }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="物料类别" align="center">
        <el-table-column prop="typeName" label="名称" align="center" min-width="90" />
        <el-table-column prop="className" label="种类" align="center" min-width="90" />
        <el-table-column prop="detailName" label="材质" align="center" min-width="90" />
        <el-table-column prop="unit" label="单位" align="center" min-width="90" />
      </el-table-column>
      <el-table-column label="规格" align="center" min-width="125">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.newSpecification" type="success" size="medium">{{ scope.row.newSpecification }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="number" :label="`数量 \n (张)`" align="center" min-width="90" />
      <el-table-column prop="weight" :label="`重量 \n (kg)`" align="center" min-width="120">
        <template slot-scope="scope">
          <el-tag type="warning" size="medium">{{ scope.row.weight }}</el-tag>
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
import { fetchReturnOrScrapMateDetail } from '@/api/warehouse'
import { MATERIAL_BASE_TYPE } from '@/utils/conventionalContent'
import { setMaterialSpecification } from '@/utils/other'

export default {
  name: 'WareOutboundReturnDetailComponent',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    queryType: { // 0:常规 1：项目
      type: Number,
      default: 0
    },
    queryDate: {
      type: String,
      default: ''
    },
    projectId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      materialBaseType: MATERIAL_BASE_TYPE,
      tableLoading: false,
      tableData: [],
      listQuery: {
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
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList: function() {
      this.listQuery.type = this.queryType
      this.listQuery.date = this.queryDate
      this.listQuery.projectId = this.projectId
      this.tableLoading = true
      fetchReturnOrScrapMateDetail(this.listQuery).then(({ data, code, message }) => {
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

<style scoped>

</style>
