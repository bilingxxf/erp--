<template>
  <!-- 页面主容器 -->
  <div class="page-container">
    <!-- 查询容器 -->
    <div class="filter-container">
      <!-- 左侧box -->
      <div class="filter-left-box">
        <div class="filter-item" />
      </div>
      <!-- 右侧box -->
      <div class="filter-right-box" />
    </div>
    <!-- 主要内容容器 -->
    <div class="content-container">
      <el-card class="box-card" style="width:80%">
        <div class="scrap-card">
          <span class="scrap-title">废料定义</span>
          <span class="scrap-tip">注意事项：小于限定的尺寸，必须全部出库</span>
        </div>
      </el-card>
      <div class="card-box">
        <el-card class="box-card">
          <div slot="header" class="card-header">
            <span>钢板</span>
            <el-button v-permission="['50_204_1']" :loading="steelPlateLoading" type="primary" size="small" @click="submitScrap(MATERIAL_BASE_TYPE.steelPlate)">保存</el-button>
          </div>
          <div>
            <el-form ref="materialForm" :model="formObj[MATERIAL_BASE_TYPE.steelPlate.index]">
              <el-form-item label="长（mm）" :label-width="'100px'" prop="length">
                <el-input-number v-model="formObj[MATERIAL_BASE_TYPE.steelPlate.index].length" :min="0" :precision="0" :step="10" label="长度" />
              </el-form-item>
              <el-form-item label="宽（mm）" :label-width="'100px'" prop="width">
                <el-input-number v-model="formObj[MATERIAL_BASE_TYPE.steelPlate.index].width" :min="0" :precision="0" :step="10" label="宽度" />
              </el-form-item>
            </el-form>
          </div>
        </el-card>

        <el-card class="box-card">
          <div slot="header" class="card-header">
            <span>型钢</span>
            <el-button v-permission="['50_204_1']" :loading="steelLoading" type="primary" size="small" @click="submitScrap(MATERIAL_BASE_TYPE.steel)">保存</el-button>
          </div>
          <div style="height:116px;">
            <el-form ref="materialForm" :model="formObj[MATERIAL_BASE_TYPE.steel.index]">
              <el-form-item label="长（mm）" :label-width="'100px'" prop="length">
                <el-input-number v-model="formObj[MATERIAL_BASE_TYPE.steel.index].length" :min="0" :precision="0" :step="10" label="长度" />
              </el-form-item>
            </el-form>
          </div>
        </el-card>

        <el-card class="box-card">
          <div slot="header" class="card-header">
            <span>彩卷/带钢</span>
            <el-button v-permission="['50_204_1']" :loading="stripSteelLoading" type="primary" size="small" @click="submitScrap(MATERIAL_BASE_TYPE.stripSteel)">保存</el-button>
          </div>
          <div>
            <el-form ref="materialForm" :model="formObj[MATERIAL_BASE_TYPE.stripSteel.index]">
              <el-form-item label="长（mm）" :label-width="'100px'" prop="length">
                <el-input-number v-model="formObj[MATERIAL_BASE_TYPE.stripSteel.index].length" :min="0" :precision="0" :step="10" label="长度" />
              </el-form-item>
            </el-form>
          </div>
        </el-card>

        <el-card class="box-card">
          <div slot="header" class="card-header">
            <span>成品围护</span>
            <el-button v-permission="['50_204_1']" :loading="enclosureLoading" type="primary" size="small" @click="submitScrap(MATERIAL_BASE_TYPE.enclosure)">保存</el-button>
          </div>
          <div>
            <el-form ref="materialForm" :model="formObj[MATERIAL_BASE_TYPE.enclosure.index]">
              <el-form-item label="长（mm）" :label-width="'100px'" prop="length">
                <el-input-number v-model="formObj[MATERIAL_BASE_TYPE.enclosure.index].length" :min="0" :precision="0" :step="10" label="长度" />
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </div>
    </div>
    <!-- 其他模块（例如弹窗等） -->
  </div>
</template>

<script>
import { MATERIAL_BASE_TYPE } from '@/utils/conventionalContent'
import { updateScrap, fetchScrapList } from '@/api/material'

export default {
  name: 'ConfigResidualMaterial',
  data() {
    return {
      formObj: {},
      steelPlateLoading: false,
      steelLoading: false,
      stripSteelLoading: false,
      enclosureLoading: false,
      MATERIAL_BASE_TYPE,
      steelPlateFrom: {},
      materialForm: {},
      materialRule: {}
    }
  },
  created() {
    this.formObj[MATERIAL_BASE_TYPE.steelPlate.index] = { formType: MATERIAL_BASE_TYPE.steelPlate.index }
    this.formObj[MATERIAL_BASE_TYPE.steel.index] = { formType: MATERIAL_BASE_TYPE.steel.index }
    this.formObj[MATERIAL_BASE_TYPE.stripSteel.index] = { formType: MATERIAL_BASE_TYPE.stripSteel.index }
    this.formObj[MATERIAL_BASE_TYPE.enclosure.index] = { formType: MATERIAL_BASE_TYPE.enclosure.index }
    this.getScrap()
  },
  methods: {
    getScrap: function() {
      const loading = this.$loading({
        lock: true,
        text: '正在加载',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      fetchScrapList().then(({ data, code, message }) => {
        if (code === 200) {
          if (data && data.length) {
            data.forEach(v => {
              this.formObj[v.formType].length = v.length || undefined
              this.formObj[v.formType].width = v.width || undefined
            })
            this.formObj = Object.assign({}, this.formObj)
          }
        } else {
          this.$message({
            message: `${message}。查询失败，请刷新页面`,
            type: 'error'
          })
        }
        loading.close()
      }).catch(e => {
        this.$message({
          message: '查询失败，请刷新页面',
          type: 'error'
        })
        loading.close()
        console.log(e)
      })
    },
    submitScrap: function(item) {
      this.loadingBtnOperate(item.index, true)
      updateScrap(this.formObj[item.index]).then(({ data, code, message }) => {
        if (code === 200) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: message,
            type: 'error'
          })
        }
        this.loadingBtnOperate(item.index, false)
      }).catch(e => {
        this.$message({
          message: '保存失败',
          type: 'error'
        })
        this.loadingBtnOperate(item.index, false)
        console.log(e)
      })
    },
    /**
     * :loading object.x 监听不到
     * @param loading {boolean}
     */
    loadingBtnOperate: function(index, loading) {
      if (index === MATERIAL_BASE_TYPE.steelPlate.index) {
        this.steelPlateLoading = loading
      }
      if (index === MATERIAL_BASE_TYPE.steel.index) {
        this.steelLoading = loading
      }
      if (index === MATERIAL_BASE_TYPE.stripSteel.index) {
        this.stripSteelLoading = loading
      }
      if (index === MATERIAL_BASE_TYPE.enclosure.index) {
        this.enclosureLoading = loading
      }
    }
  }
}
</script>

<style scoped>
.box-card {
  width: 480px;
  margin: 0 20px 20px 0;
}
.scrap-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  height: 60px;
}
.scrap-title {
  font-size: 30px;
}
.scrap-tip {
  color: red;
}
.card-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.card-box {
  width: 80%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
}
.el-input-number {
  width: 200px;
}
</style>
