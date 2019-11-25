<template>
  <!-- 页面主容器 -->
  <div class="page-container">
    <!-- 查询容器 -->
    <div class="filter-container">
      <!-- 左侧box -->
      <div class="filter-left-box">
        <div class="filter-item">
          <el-cascader
            v-model="currentClassId"
            placeholder="试试搜索：物料名称/种类"
            :options="mateOption"
            :props="props"
            filterable
            @change="getMateList"
          />
        </div>
      </div>
      <!-- 右侧box -->
      <div class="filter-right-box" />
    </div>
    <!-- 主要内容容器 -->
    <div class="content-container">
      <el-table
        v-loading="mateLoading"
        :data="mateList"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column label="序号" align="center" type="index" width="150" />
        <el-table-column prop="typeName" label="物料名称" align="center" width="180" />
        <el-table-column prop="className" label="物料种类" align="center" width="180" />
        <el-table-column prop="detailName" label="材质/型号/品种" align="center" width="220" />
        <el-table-column prop="materialCode" label="代码" align="center" width="180" />
        <el-table-column prop="unit" label="单位" align="center" width="180" />
        <el-table-column prop="minimumInventory" label="最低库存要求" align="center" width="250">
          <template slot-scope="scope">
            <template v-if="scope.row.edit">
              <div class="edit-item">
                <el-input-number v-model="scope.row.minimumInventory" :min="0" :precision="0" label="描述文字" size="small" />
                <el-button class="cancel-btn" size="small" icon="el-icon-refresh" type="warning" @click="cancelEdit(scope.row)">取消</el-button>
              </div>
            </template>
            <span v-else>{{ scope.row.minimumInventory }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div v-permission="['50_201_1']">
              <el-button v-if="scope.row.edit" type="success" size="small" icon="el-icon-circle-plus-outline" @click="confirmEdit(scope.row)">保存</el-button>
              <el-button v-else type="primary" size="small" icon="el-icon-edit" @click="scope.row.edit=!scope.row.edit">修改最低库存</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination v-show="total > 0" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.size" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </div>
    <!-- 其他模块（例如弹窗等） -->
  </div>
</template>

<script>
import { removeTreeEmptyFiled, setInfoOfTree } from '@/utils'
import { MATERIAL_BASE_TYPE } from '@/utils/conventionalContent'
import { fetchMaterialList, updateMinimumInventory, fetchMaterialClassTree } from '@/api/material'

export default {
  name: 'WareInventoryWarning',
  data() {
    return {
      props: { value: 'id', label: 'name', children: 'childrenList', expandTrigger: 'hover' },
      listQuery: { // 大类查询条件
        page: 1,
        size: 10,
        classId: undefined
      },
      currentBaseType: MATERIAL_BASE_TYPE.material,
      currentClassId: [],
      total: 0,
      mateLoading: false,
      mateList: [], // 物料列表
      mateOption: []
    }
  },
  created() {
    this.getMaterialClassTree()
  },
  methods: {
    getMaterialClassTree: function() {
      fetchMaterialClassTree(this.currentBaseType.index).then(({ data, code, message }) => {
        if (code === 200) {
          if (data && data.length) {
            this.mateOption[0] = {
              name: '一般物料',
              id: -1
            }
            this.mateOption[0].childrenList = data

            setInfoOfTree(this.mateOption, 'childrenList', 'name', 'otherInfo', 3)
            this.mateOption = removeTreeEmptyFiled(this.mateOption, 'childrenList')
            if (this.mateOption[0] && this.mateOption[0].childrenList[0] && this.mateOption[0].childrenList[0].childrenList[0] && this.mateOption[0].childrenList[0].childrenList[0].id) {
              this.currentClassId.push(this.mateOption[0].id)
              this.currentClassId.push(this.mateOption[0].childrenList[0].id)
              this.currentClassId.push(this.mateOption[0].childrenList[0].childrenList[0].id)
            }
            this.getMateList()
          }
        } else {
          this.$message({
            message: message,
            type: 'error'
          })
        }
      }).catch(e => {
        this.$message({
          message: '获取物料类型失败',
          type: 'error'
        })
        console.log(e)
      })
    },
    /**
     * 获取物料列表-根据大类id
     */
    getMateList: function() {
      this.listQuery.classId = this.currentClassId[this.currentClassId.length - 1]
      if (!this.listQuery.classId) {
        this.$message({
          message: '请选择材料',
          type: 'warning'
        })
        return
      }
      this.mateLoading = true
      this.mateList = []
      fetchMaterialList(this.listQuery).then(({ data, code, message }) => {
        if (code === 200) {
          if (data && data.data && data.data.length) {
            this.mateList = data.data.map(v => {
              this.$set(v, 'edit', false)
              v.originalNum = v.minimumInventory
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
        this.mateLoading = false
      }).catch(e => {
        this.$message({
          message: '获取列表失败',
          type: 'error'
        })
        this.mateLoading = false
        console.log(e)
      })
    },
    // 退出修改
    cancelEdit(row) {
      row.minimumInventory = row.originalNum
      row.edit = false
      this.$message({
        message: '已退出修改',
        type: 'warning'
      })
    },
    // 确认修改
    confirmEdit(row) {
      const updateFrom = {
        id: row.id,
        minimumInventory: row.minimumInventory
      }
      updateMinimumInventory(updateFrom).then(({ data, code, message }) => {
        if (code === 200) {
          row.edit = false
          row.originalNum = row.minimumInventory
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
    }
  }
}
</script>

<style scoped>
.edit-item {
  width:100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.edit-input {
  width: 120px;
  margin-right: 10px;
}
.el-input-number {
  width: 160px;
  margin-right: 10px;
}
.el-cascader{
  width: 300px;
}
</style>
