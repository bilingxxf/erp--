<template>
  <!-- 页面主容器 -->
  <div class="myEcharts">
    <!-- 查询容器 -->
    <div class="filter-container">
      <!-- 左侧box -->
      <div class="filter-left-box">
        <div class="filter-item">
          <el-cascader
            v-model="currentProjectId"
            placeholder="试试搜索：项目名称"
            :options="projectCascadeList"
            :props="{ value: 'id', label: 'name', children: 'children', expandTrigger: 'hover' }"
            :show-all-levels="false"
            filterable
            style="width:250px"
            @change="projectChange"
          />
        </div>
      </div>
      <!-- 右侧box -->
      <div class="filter-right-box" />
    </div>
    <!-- 主要内容容器 -->
    <div class="content-container">
      <div class="project-top">
        <div id="pieEcharts" />
        <div class="chart-right">
          <div v-for="item in projectWeight" :key="item.id" class="project-weight">
            <div class="top">
              <span class="weight">{{ item.value }}</span>
              <span>{{ item.unit }}</span>
            </div>
            <div class="bottom">{{ item.status }}</div>
          </div>
        </div>
      </div>
      <div class="project-bottom">
        <el-table
          :header-cell-style="headerBg"
          :data="listData"
          stripe
          border
        >
          <el-table-column v-for="(item) in materialBaseType" :key="item.index" :prop="item.value" :label="item.name" align="center" />
        </el-table>
      </div>
    </div>
    <!-- 其他模块（例如弹窗等） -->
  </div>
</template>

<script>
import { changeProjectToCascadeByYear } from '@/utils/other'
import { MATERIAL_BASE_TYPE, MATERIAL_BASE_NUM } from '@/utils/conventionalContent'
import { fetchProjectGroupByYear } from '@/api/project'
import { fetchProjectAnalysis } from '@/api/report'
export default {
  name: 'ReportManagementProject',
  data() {
    return {
      materialBaseType: MATERIAL_BASE_TYPE, // 物料基础类型
      materialBaseNum: MATERIAL_BASE_NUM,
      currentProjectId: [], // 需要入库的项目
      projectCascadeList: [], // 项目级联列表
      listQuery: {
        projectId: undefined
      },
      headerBg: { 'background': '#F5F7FA' },
      project: '',
      projectList: [],
      projectWeight: [{
        value: 0,
        unit: '吨',
        status: '已生产量',
        id: 1
      }, {
        value: 0,
        unit: '万元',
        status: '累计成本',
        id: 2
      }],
      listData: []
    }
  },
  mounted() {
    this.getProjectYearCascade()
    this.getCharts([])
  },
  methods: {
    getProjectAnalysis: function() {
      const loading = this.$loading({
        target: '.myEcharts',
        lock: true,
        text: '正在加载',
        background: 'rgba(255, 255, 255, 0.75)'
      })
      fetchProjectAnalysis(this.listQuery).then(({ data, code, message }) => {
        if (code === 200) {
          if (data && data.details) {
            const _data = this.getPieChartData(data.details)
            this.getCharts(_data)
            this.setListData(data.details)
          }
          this.projectWeight[0].value = data.totalWeight ? (data.totalWeight / 1000).toFixed(2) : '0.00'
          this.projectWeight[1].value = data.totalMoney ? (data.totalMoney / 10000).toFixed(2) : '0.00'
        } else {
          this.$message({ message: message, type: 'error' })
        }
        loading.close()
      }).catch(e => {
        loading.close()
        console.log(e)
        this.$message({ message: '获取项目报表失败', type: 'error' })
      })
    },
    setListData: function(data) {
      const _data1 = {}
      const _data2 = {}
      this.listData = []
      let amount = 0
      for (const v in this.materialBaseType) {
        let value = 0
        for (let i = 0; i < data.length; i++) {
          if (+data[i].formType === this.materialBaseType[v].index) {
            value = data[i].money
            break
          }
        }
        _data1[v] = value
        amount += value
      }
      for (const v in this.materialBaseType) {
        _data2[v] = _data1[v] && amount ? (_data1[v] * 100 / amount).toFixed(2) + '%' : '0.00%'
        _data1[v] = `${_data1[v]}元`
      }
      this.listData.push(_data1)
      this.listData.push(_data2)
    },
    getPieChartData: function(data) {
      const _data = []
      for (const v in this.materialBaseType) {
        let value = 0
        for (let i = 0; i < data.length; i++) {
          if (+data[i].formType === this.materialBaseType[v].index) {
            value = data[i].money
            break
          }
        }
        const item = {
          name: this.materialBaseType[v].name,
          value: value
        }
        _data.push(item)
      }
      return _data
    },
    /**
     * 获取项目年份级联列表
     */
    getProjectYearCascade: function() {
      fetchProjectGroupByYear().then(({ data, code, message }) => {
        if (code === 200) {
          this.projectCascadeList = changeProjectToCascadeByYear(data)
          this.selectDefaultProject()
          this.getProjectAnalysis()
        } else {
          this.$message({ message: message, type: 'error' })
        }
      }).catch(e => {
        this.$message({ message: '获取项目级联列表失败', type: 'error' })
      })
    },
    projectChange: function() {
      this.listQuery.projectId = this.currentProjectId[1]
      this.getProjectAnalysis()
    },
    selectDefaultProject: function() {
      if (this.projectCascadeList[0] && this.projectCascadeList[0].children[0] && this.projectCascadeList[0].children[0].id) {
        this.currentProjectId = [this.projectCascadeList[0].id, this.projectCascadeList[0].children[0].id]
        this.listQuery.projectId = this.currentProjectId[1]
      } else {
        this.currentProjectId = []
        this.listQuery.projectId = undefined
      }
    },
    getCharts: function(data) {
      const pieEcharts = this.$echarts.init(document.getElementById('pieEcharts'))
      pieEcharts.setOption({ // 饼图
        title: {
          text: '', // 主标题
          subtext: '', // 副标题
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          top: '40%'
        },
        grid: {

          bottom: '40%',
          containLabel: true
        },
        series: [
          {
            name: '详细数据',
            type: 'pie',
            radius: '75%',
            center: ['50%', '60%'],
            data: data,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
              normal: {
                color: function(params) {
                  var colorList = [
                    '#ED7D31', '#4472C4', '#FFC000', '#FE8463'
                  ]
                  return colorList[params.dataIndex]
                }
              }
            }
          }
        ]
      })
    }
  }

}
</script>

<style scoped>
.project-top {
  display: flex;
  margin: 20px 0 35px 0;
  justify-content: space-between;
}
#pieEcharts {
  width: 50%;
  border: 1px solid #eeeeee;
  padding: 10px 20px;
}
.project-top .el-row {
  display: flex;
  flex-direction: column;
  margin-left: 30px;
}
.chart-right {
  width: 43%;
  margin-top: 55px;
  text-align: center;
}
.chart-right .project-weight {
  width: 450px;
  margin-bottom: 20px;
  border: 1px solid #d9d9d9;
}
.project-weight .weight {
  color: rgb(52, 180, 109);
}
.chart-right .top {
  line-height: 100px;
  border-bottom: 1px solid #eeeeee;
}
.chart-right .bottom {
  line-height: 55px;
  background: rgb(124, 189, 104);
  color: #ffffff;
}
.chart-right .weight {
  font-size: 40px;
}
</style>
