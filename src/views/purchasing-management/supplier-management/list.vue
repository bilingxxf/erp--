<template>
  <!-- 页面主容器 -->
  <div class="page-container">
    <!-- 查询容器 -->
    <div class="filter-container">
      <div class="filter-left-box">
        <div class="filter-item">
          <el-input v-model="dataParam.shortName" placeholder="请输入供应商名称" class="input-with-select" @keyup.enter.native="serachHandle">
            <el-button slot="append" type="warning" icon="el-icon-search" @click="serachHandle" />
          </el-input>
        </div>
      </div>
      <div class="filter-right-box"><el-button v-permission="['50_200_1']" class="el-icon-circle-plus-outline" type="primary" @click="goCreate"> 添加供应商</el-button></div>
    </div>
    <!-- 主要内容容器 -->
    <div class="content-container">
      <template>
        <el-table
          v-loading="loading"
          :data="data"
          border
          :header-cell-style="{background:'#eef1f6'}"
          style="width: 100%"
        >
          <el-table-column
            type="index"
            label="序号"
            width="70"
            align="center"
          />
          <el-table-column
            label="录入时间"
            width="150"
            align="center"
          >
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.createTime | parseTime('{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="编号"
            width="180"
            align="center"
          >
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.supplierCode }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="供应商简称"
            width="190"
            align="center"
          >
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.shortName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="地区"
            align="center"
          >
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="`${scope.row.address ? scope.row.address: '暂无数据'}`" placement="top-start">
                <span style="margin-left: 10px">{{ scope.row.address }}</span>
              </el-tooltip>

            </template>
          </el-table-column>
          <el-table-column
            label="供应商分类"
            width="280"
            align="center"
          >
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.supplierClassType }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                class="el-icon-info"
                @click="checkDetail(scope.row.id)"
              > 详情
              </el-button>
              <el-button
                v-permission="['50_200_1']"
                size="mini"
                class="el-icon-edit-outline"
                type="warning"
                @click="handleEdit(scope.row.id)"
              > 修改
              </el-button>
              <el-button
                v-permission="['50_200_1']"
                size="mini"
                class="el-icon-delete"
                type="danger"
                @click="handleDelete(scope.row.id)"
              > 删除
              </el-button>
              <el-button
                size="mini"
                class="el-icon-document"
                type="success"
                @click="goRecord(scope.row.id)"
              > 交易记录
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <div class="pagination">
        <el-pagination
          :current-page="dataParam.page"
          :page-sizes="[10, 20, 30, 40, 50]"
          :total="totalCount"
          :page-size="dataParam.size"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <!-- 详情页弹窗 -->
    <bullet-box :id="id" :del-id="delId" :show="detailShow" :del-show="delShow" @getList="getList" @closeBox="closeBox" /></div>
</template>

<script>
import bulletBox from './bullet-box'
import { list } from '@/api/supplier'
import { supplierType } from '@/utils/commonType'
export default {
  name: 'SupplierManagementList',
  components: {
    bulletBox
  },
  data() {
    return {
      data: [],
      id: null,
      delId: null,
      detailShow: false,
      delShow: false,
      dataParam: {
        page: 1,
        size: 10,
        shortName: ''
      },
      totalCount: 0,
      loading: false,
      supplierClassType: ''
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true

      list(this.dataParam).then(res => {
        if (res.code === 200) {
          this.loading = false
          this.data = res.data.data
          this.data.forEach((v, index) => {
            this.supplierClassType = ''
            v.supplierClassification = v.supplierClassification.substring(1, v.supplierClassification.length - 1)
            v.supplierClassification = v.supplierClassification.split(',')
            v.supplierClassification.forEach(item => {
              item = item.replace(/\"/g, '')
              supplierType.filter(typeItem => {
                if (Number(typeItem.value) === Number(item)) {
                  this.supplierClassType += typeItem.label + '  '
                }
              })
            })
            v.supplierClassType = this.supplierClassType
          })
          this.totalCount = res.data.totalCount
        } else {
          this.loading = false
        }
      }).catch(e => {
        this.loading = false
      })
    },
    goCreate() {
      this.$router.push({ path: '/purchasing-management/supplier-management/create' })
    },
    handleEdit(item) {
      this.$router.push({
        name: 'SupplierManagementEdit',
        params: { id: item }
      })
    },
    handleDelete(id) { // 删除数据
      this.delId = id
      this.delShow = true
    },
    goRecord(id) {
      this.$router.push({ path: '/purchasing-management/supplier-management/transaction-record', query: { id: id }})
    },
    checkDetail(item) { // 查看详情
      this.detailShow = true
      this.id = item
    },
    closeBox() {
      this.detailShow = false
      this.delShow = false
    },
    handleSizeChange(val) {
      this.dataParam.size = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.dataParam.page = val
      this.getList()
    },
    serachHandle() { // 搜索
      this.dataParam.page = 1
      this.getList()
    }
  }
}
</script>

<style scoped>
.pagination {
  text-align: center;
  margin-top: 30px;
}
</style>
