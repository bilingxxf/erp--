<template>
  <!-- 页面主容器 -->
  <div class="page-container">
    <!-- 查询容器 -->
    <div class="position-rela">
      <!-- 右侧box -->
      <div class="dowmload"><el-button type="primary" :loading="downLoading" class="el-icon-download" @click.native="dowmLoadHandle">下载 </el-button></div>
    </div>
    <!-- 主要内容容器 -->
    <div class="content-container">
      <el-table v-loading="loading" :data="data" tooltip-effect="dark" stripe style="width: 100%">
        <el-table-column type="index" label="序号" align="center" width="70" />
        <el-table-column prop="materialCode" label="编号" align="center" width="140">
          <template slot-scope="scope">
            <el-tag size="medium">{{ scope.row.materialCode }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="物料类别" align="center" width="120">
          <el-table-column prop="typeName" label="名称" align="center" width="170">
            <template slot-scope="scope">
              <span type="success" size="medium">{{ scope.row.typeName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="className" label="种类" align="center" width="170">
            <template slot-scope="scope">
              <span type="success" size="medium">{{ scope.row.className }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="detailName" label="材质" align="center" width="170">
            <template slot-scope="scope">
              <span type="success" size="medium">{{ scope.row.detailName }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column :label="`T厚 \n (mm)`" width="160" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.thickness | toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="`定额总重 \n(t)`" width="180" align="center">
          <template slot-scope="scope">
            <el-tag>{{ scope.row.quotaWeight | toFixed(DECIMAL_NUMBER.ton) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="`实际采购 \n(t)`" width="180" align="center">
          <template slot-scope="scope">
            <el-tag>{{ scope.row.actualStorageWeight | toFixed(DECIMAL_NUMBER.ton) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="`实际使用 \n(t)`" width="180" align="center">
          <template slot-scope="scope">
            <el-tag>{{ scope.row.actualUseWeight | toFixed(DECIMAL_NUMBER.ton) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="`差值 \n(t)`" align="center">
          <template slot-scope="scope">
            <span :class="scope.row.difference<0?'red': 'green'">{{ scope.row.difference }}</span>
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
    </div>
  </div>
</template>
<script>
import { quotaTrackList, downloadTracking } from '@/api/quotaMmanage'
export default {
  name: 'TechQuotaTrackSteelPlate',
  props: {
    projectId: {
      type: Number,
      default: () => {}
    }
  },
  data() {
    return {
      data: [],
      loading: false,
      totalCount: 0,
      field: {
        projectId: '',
        formType: 0,
        page: 1,
        size: 10
      },
      downLoading: false
    }
  },
  watch: {
    projectId(newVal, oldVal) {
      this.field.projectId = newVal
      this.getList()
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      this.field.projectId = this.projectId
      quotaTrackList(this.field).then(({ data, code, message }) => {
        if (code === 200) {
          this.loading = false
          this.data = data.data
          this.data = this.data.map(v => {
            v.difference = (Number(v.quotaWeight) - Number(v.actualUseWeight)) < 0 ? (Number(v.quotaWeight) - Number(v.actualUseWeight)).toFixed(this.DECIMAL_NUMBER.ton) : '+' + (Number(v.quotaWeight) - Number(v.actualUseWeight)).toFixed(this.DECIMAL_NUMBER.ton)
            return v
          })
          this.totalCount = data.totalCount
        } else {
          this.loading = false
          this.$message.error(message)
        }
      }).catch(e => {
        this.loading = false
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
    dowmLoadHandle() { // 下载
      if (this.data.length) {
        this.downLoading = true
        const paraData = {
          projectId: this.projectId,
          formType: this.field.formType
        }
        downloadTracking(paraData).then(() => {
          this.downLoading = false
        }).catch(e => {
          this.downLoading = false
          this.$message.error('下载失败！')
        })
      } else {
        this.$message.warning('暂没有数据可以下载')
      }
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
.red {
  color: red;
}
.green {
  color: #00B050;
}
</style>
