<template>
  <!-- 页面主容器 -->
  <div class="page-container steelPlate">
    <!-- 查询容器 -->
    <div class="position-rela">
      <!-- 右侧box -->
      <div class="dowmload"><el-button type="primary" :loading="downLoading" class="el-icon-download" @click.native="dowmLoadHandle">下载 </el-button></div>
    </div>
    <!-- 主要内容容器 -->
    <div class="content-container">
      <el-table ref="data" v-loading="dataLoading" max-height="600" :data="data" tooltip-effect="dark" stripe style="width: 100%">
        <el-table-column type="index" label="序号" align="center" width="50" />
        <el-table-column label="日期" align="center" width="100">
          <template slot-scope="scope">{{ scope.row.createTime | parseTime('{y}-{m}-{d}') }}</template>
        </el-table-column>
        <el-table-column prop="materialCode" label="编号" align="center" width="90">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.materialCode" size="medium">{{ scope.row.materialCode }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="物料类别" align="center" width="230">
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
                @change="() =>{materialHandle(scope.row);scope.row.rules.detailId = false;calWeightHandle(scope.$index, scope.row)}"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="规格" align="center">
          <el-table-column prop="length" label="长(m)" align="center" width="120">
            <template slot-scope="scope">
              <div class="mask-td">
                <div :class="{'mask-red': scope.row.rules.length}" />
                <span v-if="!scope.row.isHistory">{{ scope.row.length |toFixed(2) }}</span>
                <el-input v-else v-model="scope.row.length" placeholder @change="() => {scope.row.rules.length = false;calWeightHandle(scope.$index, scope.row)}" />
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="width" label="宽(m)" align="center" width="120">
            <template slot-scope="scope">
              <div class="mask-td">
                <div :class="{'mask-red': scope.row.rules.width}" />
                <span v-if="!scope.row.isHistory">{{ scope.row.width | toFixed(2) }}</span>
                <el-input v-else v-model="scope.row.width" placeholder @change="() => {scope.row.rules.width = false;calWeightHandle(scope.$index, scope.row)}" />
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="thickness" label="厚(mm)" align="center" width="120">
            <template slot-scope="scope">
              <div class="mask-td">
                <div :class="{'mask-red': scope.row.rules.thickness}" />
                <span v-if="!scope.row.isHistory">{{ scope.row.thickness | toFixed(3) }}</span>
                <el-input v-else v-model="scope.row.thickness" placeholder @change="() => {scope.row.rules.thickness = false;calWeightHandle(scope.$index, scope.row)}" />
              </div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="颜色" width="120" align="center">
          <template slot-scope="scope">
            <div class="mask-td">
              <div :class="{'mask-red': scope.row.rules.color}" />
              <el-tag v-if="!scope.row.isHistory" type="success">{{ scope.row.color }}</el-tag>
              <el-input v-else v-model="scope.row.color" placeholder @change="() => {scope.row.rules.color = false;}" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="总重(t)" width="140" align="center">
          <template slot-scope="scope">
            <el-tag v-if="!scope.row.isHistory">{{ scope.row.weight | toFixed(DECIMAL_NUMBER.ton) }}</el-tag>
            <el-tag
              v-else
            >{{ scope.row.weight?scope.row.weight:0 }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="库存查询" width="100" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-view"
              @click="queryInventory(scope.$index, scope.row)"
            >查询</el-button>
          </template>
        </el-table-column>
        <el-table-column label="备注" width="260" align="center">
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
              <el-button
                v-if="!scope.row.isHistory"
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="delHandle(scope.row.id)"
              >删除</el-button>
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
      <div v-permission="['50_206_1']" class="formulate-btn">
        <el-button type="warning" icon="el-icon-circle-plus-outline" @click="addDefaultHandle">继续添加</el-button>
        <el-button type="primary" :loading="submitLoading" icon="el-icon-success" @click="confirmHandle">确定添加</el-button>
      </div>
    </div>
    <!-- 查询库存 -->
    <div>
      <el-dialog title="彩卷/带钢物料" :visible.sync="invenQueryVisible" width="55%">
        <el-table v-loading="invenLoading" :data="inventoryData" height="500">
          <el-table-column type="index" label="序号" align="center" width="60" />
          <el-table-column property="materialCode" label="编号" align="center" width="100" />
          <el-table-column label="物料类别" align="center">
            <el-table-column property="typeName" label="名称" width="110" align="center">
              <template slot-scope="scope"><div class="mask-td">{{ scope.row.typeName }}</div></template>
            </el-table-column>
            <el-table-column property="className" label="种类" width="110" align="center">
              <template slot-scope="scope">{{ scope.row.className }}</template>
            </el-table-column>
            <el-table-column property="detailName" label="材质" width="110" align="center">
              <template slot-scope="scope">{{ scope.row.detailName }}</template>
            </el-table-column>
          </el-table-column>
          <el-table-column property="color" label="颜色" align="center" />
          <el-table-column label="规格" align="center">
            <el-table-column property="length" label="长(m)" width="100" align="center" />
            <el-table-column property="width" label="宽(m)" width="100" align="center" />
            <el-table-column property="thickness" label="厚(mm)" width="100" align="center" />
          </el-table-column>
          <el-table-column property="weight" :label="`总重 \n(t)`" align="center" />
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
import { removeTreeEmptyFiled, getNodeInfoByIds, getCascaderNameByIds } from '@/utils'
import { calcWeightByMateName } from '@/utils/other'
import { fetchMaterialTree } from '@/api/material'
import { MATERIAL_BASE_TYPE } from '@/utils/conventionalContent'
import { qutoList, saveQuto, updateQuto, delQuto, queryInventory, exportFormulate } from '@/api/quotaMmanage'
export default {
  name: 'TechQuotaFormuColorStrip',
  props: {
    projectId: {
      type: Number,
      default: () => {}
    }
  },
  data() {
    return {
      props: {
        value: 'id',
        label: 'name',
        children: 'childrenList',
        expandTrigger: 'hover'
      },
      currnetBaseType: MATERIAL_BASE_TYPE.stripSteel,
      searchInp: '',
      totalCount: 0,
      invenTotal: 0,
      data: [],
      mateOption: [],
      multipleSelection: [],
      field: {
        projectId: '',
        formType: MATERIAL_BASE_TYPE.stripSteel.index,
        page: 1,
        size: 10
      },
      defaultObj: {
        isHistory: 2,
        rules: {
          detailId: false,
          length: false,
          width: false,
          thickness: false,
          color: false
        }
      },
      rules: {
        detailId: false,
        length: false,
        width: false,
        thickness: false,
        color: false
      },
      needValid: {
        detailId: true,
        length: true,
        width: true,
        thickness: true,
        color: true
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
    calWeightHandle(index, item) {
      const length = item.length || 0
      const width = item.width || 0
      const thickness = item.thickness || 0
      const number = item.number || 1
      const name = getCascaderNameByIds(this.mateOption, item.materialClassIds, 'id', 'childrenList')
      if (length && width && thickness) {
        item.weight = (calcWeightByMateName(length, width, thickness, number, name) / 1000).toFixed(this.DECIMAL_NUMBER.ton)
        this.$set(this.data, index, Object.assign({}, this.data[index]))
      } else {
        item.weight = undefined
      }
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
              // setInfoOfTree(this.mateOption, 'childrenList', 'name', 'otherInfo', 2)
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
        this.$message.error('库存获取失败' + e)
        this.invenLoading = false
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
      this.calWeightHandle(index, item)
      // this.data[index] = Object.assign({}, this.data[index])
      this.$set(this.data, index, Object.assign({}, this.data[index]))
      // this.data = JSON.parse(JSON.stringify(this.data))
    },
    editConfirm(index, item) {
      item.remark = this.data[index].remark
      item.detailId = item.materialClassIds[2]
      const params = {
        id: item.id,
        color: item.color,
        thickness: item.thickness,
        weight: item.weight,
        length: item.length,
        width: item.width,
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
        .catch(e => {
          this.$message.error('更新失败!')
        })
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
            v.formType = MATERIAL_BASE_TYPE.stripSteel.index
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
            this.$message.error('添加失败!')
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
.steelPlate .el-table .cell {
  padding: 0;
}
.steelPlate .el-table .el-table--border th:first-child .cell,
.el-table--border td:first-child .cell {
  padding: 0;
}
.steelPlate .el-table--border th:first-child .cell,
.el-table--border td:first-child .cell {
  padding: 0;
}
.steelPlate .el-table--medium td {
  padding: 0;
}
</style>
