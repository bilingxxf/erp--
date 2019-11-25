<template>
  <!-- 页面主容器 -->
  <div class="page-container">
    <!-- 查询容器 -->
    <div class="filter-container">
      <!-- 左侧box -->
      <div class="filter-left-box">
        <!-- <div class="filter-item">
          <el-radio-group v-model="listQuery.materialPoolType" size="medium" @change="getList">
            <el-radio-button :label="materialPoolType.entire">整料库存</el-radio-button>
            <el-radio-button :label="materialPoolType.remainder" :disabled="currentClassId[0] == materialBaseType.material.index">余料库存</el-radio-button>
          </el-radio-group>
        </div> -->
        <div class="filter-item">
          <el-radio-group v-model="checkHasProject" size="medium" @change="inboundTypeChange">
            <el-radio-button :label="false" :disabled="materialMoveMode && (listQuery.moveType != materialMoveType.scrap)">常规出库</el-radio-button>
            <el-radio-button :label="true">项目出库</el-radio-button>
          </el-radio-group>
        </div>
        <div class="filter-item">
          <el-cascader
            v-model="currentProjectId"
            placeholder="请选择项目"
            :options="projectCascadeList"
            :props="{ value: 'id', label: 'name', children: 'children', expandTrigger: 'hover' }"
            :disabled="!checkHasProject"
            :show-all-levels="false"
            filterable
            style="width:250px"
            @change="projectChange"
          />
        </div>
        <div class="filter-item">
          <el-cascader
            v-model="currentClassId"
            placeholder="试试搜索：物料名称/种类/材质/编号"
            :options="mateOption"
            :props="props"
            filterable
            style="width:300px"
            @change="getList"
          />
        </div>
      </div>
      <!-- 右侧box -->
      <div class="filter-right-box">
        <div v-show="!materialMoveMode" class="filter-item">
          <el-button icon="el-icon-box" type="primary" size="medium" @click="drawerVisible = true">查看出库单</el-button>
        </div>
        <div v-show="!materialMoveMode" class="filter-item">
          <el-button type="success" size="medium" icon="el-icon-printer" @click="batchPrintLabel">标签打印</el-button>
        </div>
      </div>
    </div>
    <div class="filter-container">
      <!-- 左侧box -->
      <div class="filter-left-box">
        <div class="filter-item">
          <el-radio-group v-model="listQuery.materialPoolType" size="medium" @change="getList">
            <el-radio-button :label="materialPoolType.entire">整料库存</el-radio-button>
            <el-radio-button :label="materialPoolType.remainder" :disabled="currentClassId[0] == materialBaseType.material.index">余料库存</el-radio-button>
          </el-radio-group>
        </div>
      </div>
    </div>
    <!-- 主要内容容器 -->
    <div class="content-container">
      <template v-if="currentClassId[0] == materialBaseType.steelPlate.index">
        <SteelPlate
          ref="pool"
          :project-id="listQuery.projectId"
          :pool-type="listQuery.materialPoolType"
          :base-type="currentClassId[0]"
          :type-id="currentClassId[1]"
          :class-id="currentClassId[2]"
          :detail-id="currentClassId[3]"
          :material-move-mode="materialMoveMode"
          :move-type="listQuery.moveType"
        />
      </template>
      <template v-if="currentClassId[0] == materialBaseType.steel.index">
        <Steel
          ref="pool"
          :project-id="listQuery.projectId"
          :pool-type="listQuery.materialPoolType"
          :base-type="currentClassId[0]"
          :type-id="currentClassId[1]"
          :class-id="currentClassId[2]"
          :detail-id="currentClassId[3]"
          :material-move-mode="materialMoveMode"
          :move-type="listQuery.moveType"
        />
      </template>
      <template v-if="currentClassId[0] == materialBaseType.stripSteel.index">
        <StripSteel
          ref="pool"
          :project-id="listQuery.projectId"
          :pool-type="listQuery.materialPoolType"
          :base-type="currentClassId[0]"
          :type-id="currentClassId[1]"
          :class-id="currentClassId[2]"
          :detail-id="currentClassId[3]"
          :material-move-mode="materialMoveMode"
          :move-type="listQuery.moveType"
        />
      </template>
      <template v-if="currentClassId[0] == materialBaseType.enclosure.index">
        <Enclosure
          ref="pool"
          :project-id="listQuery.projectId"
          :pool-type="listQuery.materialPoolType"
          :base-type="currentClassId[0]"
          :type-id="currentClassId[1]"
          :class-id="currentClassId[2]"
          :detail-id="currentClassId[3]"
          :material-move-mode="materialMoveMode"
          :move-type="listQuery.moveType"
        />
      </template>
      <template v-if="currentClassId[0] == materialBaseType.material.index">
        <GeneralMate
          ref="pool"
          :project-id="listQuery.projectId"
          :pool-type="listQuery.materialPoolType"
          :base-type="currentClassId[0]"
          :type-id="currentClassId[1]"
          :class-id="currentClassId[2]"
          :detail-id="currentClassId[3]"
          :material-move-mode="materialMoveMode"
          :move-type="listQuery.moveType"
        />
      </template>
    </div>

    <!-- 其他模块（例如弹窗等） -->
    <div v-permission="['50_203_1']" class="footer-toolbar">
      <div class="footer-toolbar-drawer">
        <el-popover v-model="moveVisible" trigger="click" placement="top" width="150">
          <div style="display:flex;flex-direction:column;justify-content:space-between;align-items:center;height:100px;">
            <el-radio-group v-model="listQuery.moveType" style="height:300px;">
              <el-radio v-show="listQuery.projectId" :label="materialMoveType.common">常规物料仓</el-radio>
              <el-radio v-show="listQuery.projectId" :label="materialMoveType.partyA">归还甲方</el-radio>
              <el-radio :label="materialMoveType.scrap">设为废料</el-radio>
            </el-radio-group>
          </div>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="moveVisible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="()=> {moveVisible = false;setMaterialMove()}">确定</el-button>
          </div>
          <el-button v-show="!materialMoveMode" slot="reference" type="primary" size="medium" icon="el-icon-truck">物料搬家</el-button>
        </el-popover>
        <el-button v-show="materialMoveMode" icon="el-icon-arrow-left" type="primary" size="medium" @click="exitMaterialMoveMode">退出</el-button>
        <el-popover v-model="confirmMoveVisible" placement="top" width="160" trigger="click">
          <p>确认搬家？一经搬家无法修改</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="confirmMoveVisible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="()=> {confirmMoveVisible = false;materialMove()}">确定</el-button>
          </div>
          <el-button v-show="materialMoveMode" slot="reference" icon="el-icon-box" type="success" size="medium" style="margin-left:10px">{{ `确认搬家[${materialMoveIndexType[listQuery.moveType]}]` }}</el-button>
        </el-popover>
      </div>
    </div>

    <el-drawer
      title="出库单"
      :visible.sync="drawerVisible"
      direction="rtl"
      size="60%"
    >
      <div slot="title" class="dialog-title">
        <span style="font-weight:bold;margin-right:10px;">{{ `出库单` }}</span>
        <el-tag type="success" size="small">出库日期：{{ new Date() | parseTime('{y}-{m}-{d} {h}:{i}') }}</el-tag>
      </div>
      <OrderList :visible="drawerVisible" @inboundEvent="inboundResult" />
    </el-drawer>
  </div>
</template>

<script>
import GeneralMate from '@/views/component/materialPool/generalMate'
import SteelPlate from '@/views/component/materialPool/steelPlate'
import Enclosure from '@/views/component/materialPool/enclosure'
import StripSteel from '@/views/component/materialPool/stripSteel'
import Steel from '@/views/component/materialPool/steel'
import OrderList from '@/views/component/materialPool/orderList'
import { removeTreeEmptyFiled, setInfoOfTree } from '@/utils'
import { changeProjectToCascadeByYear } from '@/utils/other'
import { MATERIAL_BASE_TYPE, MATERIAL_BASE_NUM, MATERIAL_POOL_TYPE, MATERIAL_MOVE_TYPE, MATERIAL_MOVE_INDEX_TYPE } from '@/utils/conventionalContent'
import { fetchAllMaterialTree } from '@/api/material'
import { fetchProjectGroupByYear } from '@/api/project'

export default {
  name: 'WareMaterialWarehouse',
  components: { SteelPlate, Steel, OrderList, StripSteel, Enclosure, GeneralMate },
  data() {
    return {
      materialBaseType: MATERIAL_BASE_TYPE,
      materialBaseNum: MATERIAL_BASE_NUM,
      materialPoolType: MATERIAL_POOL_TYPE,
      materialMoveType: MATERIAL_MOVE_TYPE,
      materialMoveIndexType: MATERIAL_MOVE_INDEX_TYPE,
      props: { value: 'id', label: 'name', children: 'childrenList', expandTrigger: 'hover', checkStrictly: true },
      listQuery: { // 大类查询条件
        materialPoolType: 0,
        page: 1,
        size: 10,
        classId: undefined,
        moveType: undefined
      },
      confirmMoveVisible: false, // 确认搬家
      materialMoveMode: false, // 进入物料搬家模式
      moveVisible: false, // 物料搬家
      drawerVisible: false, // 出库单
      checkHasProject: false, // 常规入库/项目入库
      currentProjectId: [], // 需要入库的项目
      projectCascadeList: [], // 项目级联列表
      currentClassId: [],
      total: 0,
      mateLoading: false,
      mateList: [], // 物料列表
      mateOption: []
    }
  },
  created() {
    this.getMaterialClassTree()
    this.getProjectYearCascade()
    this.listQuery.moveType = this.materialMoveType.scrap
  },
  methods: {
    inboundResult: function(data) {
      if (data) {
        this.$refs['pool'].getList()
      }
    },
    /**
     * 获取物料列表-根据大类id
     */
    getList: function() {
      console.log(this.currentClassId)
    },
    materialMove: function() {
      this.$refs['pool'].materialMove()
    },
    setMaterialMove: function() {
      this.materialMoveMode = true
      this.$notify({ title: '物料仓-物料搬家', message: '进入物料搬家模式, 常规物料仓和归还甲方情况下，无法切换至常规入库信息', type: 'success' })
    },
    exitMaterialMoveMode: function() {
      this.materialMoveMode = false
      this.$notify({ title: '物料仓-物料搬家', message: '退出物料搬家模式', type: 'warning' })
    },
    getMaterialClassTree: function() {
      fetchAllMaterialTree().then(({ data, code, message }) => {
        if (code === 200) {
          // console.log(data)
          if (data) {
            for (const baseType in data) {
              if (this.materialBaseNum[baseType]) {
                const _baseType = Number(baseType)
                this.mateOption[_baseType] = {
                  name: this.materialBaseNum[_baseType].name,
                  id: _baseType
                }
                this.mateOption[_baseType].childrenList = data[_baseType]
              }
            }
            setInfoOfTree(this.mateOption, 'childrenList', 'name', 'otherInfo', 4)
            this.mateOption = removeTreeEmptyFiled(this.mateOption, 'childrenList')
            if (this.mateOption[0] && this.mateOption[0].id !== undefined) {
              this.currentClassId.push(this.mateOption[0].id)
            }
          }
        } else {
          this.$message({ message: message, type: 'error' })
        }
      }).catch(e => {
        this.$message({ message: '获取物料类型失败', type: 'error' })
        console.log(e)
      })
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
    inboundTypeChange: function(check) {
      if (check) {
        // if (!this.listQuery.projectId && this.projectCascadeList[0] && this.projectCascadeList[0].children[0] && this.projectCascadeList[0].children[0].id) {
        //   this.currentProjectId.push(this.projectCascadeList[0].id)
        //   this.currentProjectId.push(this.projectCascadeList[0].children[0].id)
        //   this.listQuery.projectId = this.currentProjectId[1]
        this.listQuery.projectId = -1
        if (!this.materialMoveMode) {
          this.listQuery.moveType = this.materialMoveType.common
        }
        // }
      } else {
        this.currentProjectId = []
        this.listQuery.projectId = undefined
        if (!this.materialMoveMode) {
          this.listQuery.moveType = this.materialMoveType.scrap
        }
      }
    },
    projectChange: function() {
      this.listQuery.projectId = this.currentProjectId[1]
    },
    batchPrintLabel: function() {
      this.$refs['pool'].batchPrintLabel()
    }
  }
}
</script>

<style scoped>
.page-container {
  height: 100%;
}
.el-radio {
  line-height: 2;
}
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
.footer-toolbar {
  width: calc(100% - 210px)
}
.footer-toolbar-drawer{
  justify-content: center;
}
</style>
