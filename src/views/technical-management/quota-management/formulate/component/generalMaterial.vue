<template>
  <!-- 页面主容器 -->
  <div class="page-container generalPlate">
    <!-- 查询容器 -->
    <div class="position-rela">
      <!-- 右侧box -->
      <div class="dowmload"><el-button type="primary" :loading="downLoading" class="el-icon-download" @click.native="dowmLoadHandle">下载 </el-button></div>
    </div>
    <!-- 主要内容容器 -->
    <div class="content-container">
      <el-table ref="data" v-loading="dataLoading" max-height="600" :data="data" tooltip-effect="dark" stripe border :header-cell-style="headerBg" style="width: 100%">
        <el-table-column type="index" label="序号" align="center" width="70" />
        <el-table-column label="日期" align="center" width="100">
          <template slot-scope="scope">{{ scope.row.createTime | parseTime('{y}-{m}-{d}') }}</template>
        </el-table-column>
        <el-table-column prop="materialCode" label="编号" align="center" width="120">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.materialCode" size="medium">{{ scope.row.materialCode }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="物料类别" align="center" width="320">
          <template slot-scope="scope">
            <div class="mask-td">
              <div :class="{'mask-red': scope.row.rules.detailId}" />
              <span
                v-if="!scope.row.isHistory || scope.row.isHistory == 1"
              >{{ scope.row.materialName }}</span>
              <el-cascader
                v-else
                v-model="scope.row.materialClassIds"
                placeholder="试试搜索：焊接材料"
                :options="mateOption"
                :props="props"
                filterable
                style="width:300px;"
                @change="() =>{materialHandle(scope.row);scope.row.rules.detailId = false}"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="颜色" width="130" align="center">
          <template slot-scope="scope">
            <div class="mask-td">
              <div :class="{'mask-red': scope.row.rules.color}" />
              <el-tag v-if="!scope.row.isHistory" type="success">{{ scope.row.color }}</el-tag>
              <el-input
                v-else
                v-model="scope.row.color"
                @change="scope.row.rules.color = false"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="数量(张)" width="140" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="`${scope.row.number || 0}`" placement="top">
              <div class="mask-td">
                <div :class="{'mask-red': scope.row.rules.number}" />
                <el-tag v-if="!scope.row.isHistory" type="info">{{ scope.row.number }}</el-tag>
                <el-input-number
                  v-else
                  v-model="scope.row.number"
                  :min="0"
                  :step="5"
                  :precision="0"
                  size="small"
                  @change="scope.row.rules.number = false"
                />
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="库存查询" width="120" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-view"
              @click="queryInventory(scope.$index, scope.row)"
            >查询</el-button>
          </template>
        </el-table-column>
        <el-table-column label="备注" width="330" align="center">
          <template slot-scope="scope">
            <div class="mask-td">
              <el-tooltip
                v-if="!scope.row.isHistory"
                class="item"
                effect="dark"
                :content="`${scope.row.remark || '暂无数据'}`"
                placement="top"
              >
                <span>{{ scope.row.remark }}</span>
              </el-tooltip>
              <el-tooltip
                v-else
                effect="dark"
                :content="`${scope.row.remark || '暂无数据'}`"
                placement="top"
              >
                <el-input v-model="scope.row.remark" style="200px" />
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div v-permission="['50_206_1']" class="mask-td" style="justify-content:left">
              <el-button
                v-if="!scope.row.isHistory"
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="editHandle(scope.$index, scope.row)"
              >修改</el-button>
              <!-- <el-button
                v-if="!scope.row.isHistory"
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="delHandle(scope.row.id)"
              >删除</el-button> -->
              <el-button
                v-if="scope.row.isHistory == 1"
                size="mini"
                type="success"
                icon="el-icon-success"
                @click="editConfirm(scope.$index, scope.row)"
              >确定</el-button>
              <el-button
                v-if="scope.row.isHistory == 1"
                size="mini"
                type="warning"
                icon="el-icon-refresh"
                @click="cancelHandle(scope.$index, scope.row)"
              >取消</el-button>
              <el-button
                v-if="scope.row.isHistory == 2"
                type="danger"
                icon="el-icon-delete"
                @click="removeHandle(scope.$index)"
              />
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-nation">
        <el-pagination
          v-if="totalCount>0"
          :current-page="field.page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="field.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
          @size-change="sizeChange"
          @current-change="pageChange"
        />
      </div>
      <div class="formulate-btn">
        <el-button type="warning" icon="el-icon-circle-plus-outline" @click="addDefaultHandle">继续添加</el-button>
        <!-- <el-popover v-model="successVisible" placement="top" width="160" trigger="click">
          <p>确认添加？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="successVisible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="()=> {successVisible = false;confirmHandle()}">确定</el-button>
          </div> -->
        <el-button slot="reference" :loading="submitLoading" type="primary" icon="el-icon-success" style="margin-left:10px;" @click="confirmHandle">确认新增</el-button>
        <!-- </el-popover> -->
      </div>
    </div>
    <!-- 查询库存 -->
    <div>
      <el-dialog title="一般物料" :visible.sync="invenQueryVisible" width="50%">
        <el-table v-loading="invenLoading" :data="inventoryData" height="400">
          <el-table-column type="index" label="序号" align="center" width="70" />
          <el-table-column property="materialCode" label="编号" align="center" width="100" />
          <el-table-column label="物料类别" align="center">
            <el-table-column property="typeName" label="名称" width="120" align="center">
              <template slot-scope="scope"><div class="mask-td">{{ scope.row.typeName }}</div></template>
            </el-table-column>
            <el-table-column property="className" label="种类" width="120" align="center">
              <template slot-scope="scope">{{ scope.row.className }}</template>
            </el-table-column>
            <el-table-column property="detailName" label="材质" width="120" align="center">
              <template slot-scope="scope">{{ scope.row.detailName }}</template>
            </el-table-column>
            <el-table-column property="unit" label="单位" width="120" align="center">
              <template slot-scope="scope">{{ scope.row.unit }}</template>
            </el-table-column>
          </el-table-column>
          <el-table-column property="color" label="颜色" width="120" align="center" />
          <el-table-column property="number" label="数量" align="center" />
        </el-table>
        <div class="page-nation">
          <el-pagination
            v-if="invenTotal>0"
            :current-page="invenParams.page"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="invenParams.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="invenTotal"
            @size-change="invenSizeChange"
            @current-change="invenPageChange"
          />
        </div>
      </el-dialog>
    </div>
  </div>

</template>

<script>
import { setInfoOfTree, removeTreeEmptyFiled, getNodeInfoByIds } from '@/utils'
import { fetchMaterialTree } from '@/api/material'
import { MATERIAL_BASE_TYPE } from '@/utils/conventionalContent'
import { qutoList, saveQuto, updateQuto, delQuto, queryInventory, exportFormulate } from '@/api/quotaMmanage'
export default {
  name: 'TechQuotaFormuGeneral',
  props: {
    projectId: {
      type: Number,
      default: () => {}
    }
  },
  data() {
    return {
      headerBg: { 'background': '#F5F7FA' },
      props: {
        value: 'id',
        label: 'name',
        children: 'childrenList',
        expandTrigger: 'hover'
      },
      currnetBaseType: MATERIAL_BASE_TYPE.material,
      searchInp: '',
      totalCount: 0,
      invenTotal: 0,
      data: [],
      mateOption: [],
      multipleSelection: [],
      field: {
        projectId: '',
        formType: MATERIAL_BASE_TYPE.material.index,
        page: 1,
        size: 10
      },
      defaultObj: {
        isHistory: 2,
        rules: {
          detailId: false,
          color: false,
          number: false
        }
      },
      rules: {
        detailId: false,
        color: false,
        number: false
      },
      needValid: {
        detailId: true,
        color: true,
        number: true
      },
      dataLoading: false,
      downLoading: false,
      invenParams: {
        page: 1,
        size: 10,
        detailId: '',
        condition: ''
      },
      invenQueryVisible: false,
      inventoryData: [],
      invenLoading: false,
      successVisible: false,
      submitLoading: false
    }
  },
  watch: {
    projectId(newVal, oldVal) {
      if (newVal) {
        this.field.projectId = this.projectId
        this.getList()
      }
    }
  },
  mounted() {
    this.getMaterialClassTree(this.currnetBaseType.index)
    this.getList()
  },
  methods: {
    getList() {
      this.data = []
      this.dataLoading = true
      this.field.projectId = this.projectId
      qutoList(this.field).then(({ data, code, message }) => {
        if (code === 200) {
          this.dataLoading = false
          if (data && data.length) {
            this.data = data
            this.data = this.data.map(v => {
              v.rules = { ...this.rules }
              v.materialName = (v.typeName && v.className && v.detailName) ? `${v.typeName + ' / ' + v.className + ' / ' + v.detailName}` : ''
              return v
            })
          } else {
            this.data.push({ ...this.defaultObj })
          }
        } else {
          this.dataLoading = false
        }
      }).catch(e => {
        this.dataLoading = false
      })
    },
    sizeChange(val) {
      this.field.size = val
      this.getList()
    },
    pageChange(val) {
      this.field.page = val
      this.getList()
    },
    getMaterialClassTree: function(baseType) { // 获取物料类别
      fetchMaterialTree(baseType)
        .then(({ data, code, message }) => {
          if (code === 200) {
            if (data && data.length) {
              this.mateOption = data
              setInfoOfTree(
                this.mateOption,
                'childrenList',
                'name',
                'otherInfo',
                2
              )
              this.mateOption = removeTreeEmptyFiled(
                this.mateOption,
                'childrenList'
              )
            }
          } else {
            this.$message(message)
          }
        })
        .catch(e => {
          this.$message.error('获取物料失败')
          console.log(e)
        })
    },
    materialHandle(item) {
      if (item.materialClassIds && item.materialClassIds.length === 3) {
        const _node = getNodeInfoByIds(
          this.mateOption,
          item.materialClassIds,
          'id',
          'childrenList'
        )
        item.materialCode = _node.otherInfo
        item.detailId = item.materialClassIds[2]
      }
    },
    queryInventory(index, item) { // 库存查询
      this.invenQueryVisible = true
      this.invenParams.detailId = item.detailId
      this.invenParams.condition = item.color
      this.inventoryList()
    },
    inventoryList() { // 查询库存信息
      this.invenLoading = true
      queryInventory(this.invenParams).then(({ data, code, message }) => {
        if (code === 200) {
          this.invenLoading = false
          this.inventoryData = data.data
          this.invenTotal = data.totalCount
        } else {
          this.invenLoading = false
          this.$message.error(message)
        }
      }).catch(e => {
        this.invenLoading = false
        this.$message.error('库存查询失败!')
      })
    },
    invenPageChange(val) {
      this.invenParams.page = val
      this.inventoryList()
    },
    invenSizeChange(val) {
      this.invenParams.size = val
      this.inventoryList()
    },
    dowmLoadHandle() { // 下载
      this.downLoading = true
      const paraData = {
        projectId: this.projectId,
        formType: this.currnetBaseType.index
      }
      exportFormulate(paraData).then(() => {
        this.downLoading = false
      }).catch(e => {
        this.downLoading = false
        this.$message.error('下载失败！')
      })
    },
    addDefaultHandle() { // 继续添加
      this.data.push({ ...this.defaultObj })
    },
    editHandle(index, item) {
      item.isHistory = 1
      this.data[index].materialClassIds = [
        item.typeId,
        item.classId,
        item.detailId
      ]
      // this.data[index] = Object.assign({}, this.data[index])
      this.$set(this.data, index, Object.assign({}, this.data[index]))
      // this.data = JSON.parse(JSON.stringify(this.data))
    },
    editConfirm(index, item) {
      item.remark = this.data[index].remark
      item.detailId = item.materialClassIds[2]
      const params = {
        id: item.id,
        number: item.number,
        color: item.color,
        unit: item.unit,
        remark: item.remark
      }
      updateQuto(params)
        .then(({ code, message }) => {
          if (code === 200) {
            this.$message.success('更新成功！')
            this.getList()
          } else {
            this.$message.error(message)
          }
        })
        .catch(e => { this.$message.error('更新失败!') })
    },
    cancelHandle(index, item) {
      item.isHistory = 0
    },
    removeHandle(index) {
      this.data.splice(index, 1)
    },
    confirmHandle() { // 确定新增
      let paramsArr = []
      paramsArr = this.data.filter(v => {
        return v.isHistory
      })
      console.log(paramsArr, 'ddd')
      if (paramsArr.length) {
        let errorFlag = false
        this.data.forEach(v => {
          const _valid = this.needValid
          for (const r in _valid) {
            if (_valid[r] && (v[r] === undefined || v[r] === null)) {
              v.rules[r] = true
              errorFlag = true
            }
          }
        })
        if (errorFlag) {
          this.notifyFun({ message: '请新增钢板', type: 'warning' })
          return
        } else {
          this.submitLoading = true
          paramsArr.forEach(v => {
            delete v.isHistory
            v.formType = MATERIAL_BASE_TYPE.material.index
            v.detailId = v.materialClassIds[2]
            v.projectId = this.projectId
          })

          saveQuto(paramsArr).then(({ code, message }) => {
            if (code === 200) {
              this.submitLoading = false
              this.$message.success('添加成功!')
              this.getList()
            } else {
              this.submitLoading = false
              this.$message.error(message)
            }
          }).catch(e => {
            this.submitLoading = false
          })
        }
      } else {
        this.notifyFun({ message: '无新增数据添加', type: 'warning' })
      }
    },
    delHandle(id) {
      delQuto({ id: id }).then(({ code, message }) => {
        if (code) {
          this.$message.success('删除成功!')
          this.getList()
        } else {
          this.$message.error(message)
        }
      }).catch(e => { this.$message.error('删除失败!') })
    },
    notifyFun: function({ message, type, title }) {
      setTimeout(() => {
        this.$notify({ message: message, type: type })
      }, 50)
    }
  }
}
</script>

<style scoped>
.btn {
  margin: 20px 0 0 0;
  text-align: right;
}
.page-nation {
  margin: 30px 0 0 0;
  text-align: center;
}
</style>
<style>
.generalPlate .el-table .cell {
  padding: 0;
}
.generalPlate .el-table .el-table--border th:first-child .cell,
.el-table--border td:first-child .cell {
  padding: 0;
}
.generalPlate .el-table--border th:first-child .cell,
.el-table--border td:first-child .cell {
  padding: 0;
}
.generalPlate .el-table--medium td {
  padding: 0;
}
</style>
