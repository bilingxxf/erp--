<template>
  <!-- 页面主容器 -->
  <div class="myEcharts">
    <!-- 查询容器 -->
    <div class="filter-container">
      <!-- 左侧box -->
      <div class="filter-left-box">
        <div class="filter-item">
          <el-date-picker
            v-model="year"
            type="year"
            value-format="yyyy"
            placeholder="选择年份筛选"
            @change="getPurchaseSumByYear"
          />
        </div>
      </div>
      <!-- 右侧box -->
      <!-- <div class="filter-right-box">右</div> -->
    </div>
    <!-- 主要内容容器 -->
    <div class="content-container">
      <div class="purchase-top">
        <div class="title-flex">
          <div>物料分析使用</div>
          <div class="unit">单位: 万元</div>
        </div>
        <div id="columnarEchart" />
      </div>
      <div class="purchase-bottom">
        <el-date-picker
          v-model="month"
          value-format="yyyy-MM"
          type="month"
          placeholder="选择月份筛选"
          @change="getPurchaseSumDetail"
        />
        <div class="purchase-bottom-flex">
          <el-table
            v-loading="tableLoading"
            class="purchase-table"
            :header-cell-style="headerBg"
            :data="pieData"
            max-height="397"
            stripe
            border
            style="width: 200px"
          >
            <el-table-column prop="name" label="物料名称" align="center" />
            <el-table-column prop="value" label="金额(元)" align="center" />
            <el-table-column prop="proportion" label="占比(%)" align="center" />
          </el-table>
          <div id="pieEcharts" />
        </div>
      </div>
    </div>
    <!-- 其他模块（例如弹窗等） -->
  </div>
</template>

<script>
import moment from 'moment'
import { fetchOutboundSumByYear, fetchMonthOutboundDetail } from '@/api/report'
const yData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
const xData = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
export default {
  name: 'ReportManagementPurchase',
  data() {
    return {
      headerBg: { 'background': '#F5F7FA' },
      year: moment(new Date()).format('YYYY'),
      month: moment(new Date()).format('YYYY-MM'),
      pieData: [],
      tableLoading: false
    }
  },
  mounted() {
    this.getCharts(yData, xData)
    this.getPieChart()
    this.getPurchaseSumByYear()
    this.getPurchaseSumDetail()
  },
  methods: {
    getPurchaseSumByYear() {
      const loading = this.$loading({
        target: '.myEcharts',
        lock: true,
        text: '正在加载',
        background: 'rgba(255, 255, 255, 0.75)'
      })
      fetchOutboundSumByYear({ year: this.year }).then(({ data, code, message }) => {
        if (code === 200) {
          const _data = this.handleYearData(data)
          this.getCharts(_data.x, _data.y)
        } else {
          this.$message({ message: message, type: 'error' })
        }
        loading.close()
      }).catch(e => {
        loading.close()
        console.log(e)
        this.$message({ message: '获取采购数据失败', type: 'error' })
      })
    },
    getPurchaseSumDetail() {
      this.tableLoading = true
      fetchMonthOutboundDetail({ yearAndMonth: this.month }).then(({ data, code, message }) => {
        if (code === 200) {
          if (data) {
            const _data = this.handleDetailData(data)
            this.pieData = _data
            this.getPieChart()
          }
        } else {
          this.$message({ message: message, type: 'error' })
        }
        this.tableLoading = false
      }).catch(e => {
        this.tableLoading = false
        console.log(e)
        this.$message({ message: '获取采购数据失败', type: 'error' })
      })
    },
    handleDetailData(data) {
      const _data = []
      let _totalCount = 0
      data.forEach(v => {
        _data.push({ name: v.typeName, value: v.totalInventoryAmount })
        _totalCount += v.totalInventoryAmount
      })
      _data.map(v => {
        v.proportion = (v.value * 100 / _totalCount).toFixed(2)
        return v
      })
      return _data
    },
    handleYearData(data) {
      const _yData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      const _xData = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
      data && data.length && data.forEach(v => {
        const month = moment(v.statisticalDate).month()
        _yData[month] = v.totalInventoryAmount ? (v.totalInventoryAmount / 10000).toFixed(2) : 0
      })
      return { y: _yData, x: _xData }
    },
    getPieChart() {
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
          orient: 'horizontal',
          left: 'left',
          top: '5%'
        },
        series: [
          {
            name: '详细数据',
            type: 'pie',
            radius: '55%',
            center: ['40%', '50%'],
            data: this.pieData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
    },
    getCharts(xData, yData) {
      const columnarEchart = this.$echarts.init(document.getElementById('columnarEchart'))
      columnarEchart.setOption({ // 柱状图
        title: { text: '' },
        color: '#4472C4',
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '5%',
          right: '4%',
          bottom: '5%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: xData,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '出库额',
            type: 'bar',
            barWidth: '60%',
            data: yData
          }
        ]
      })
    }

  }
}
</script>

<style scoped>
#columnarEchart {
  height: 500px;
}
#pieEcharts {
  width: 55%;
  height: 500px;
}
.purchase-top {
  margin: 20px 0 50px 0;
}
.purchase-bottom-flex {
  display: flex;
}
.purchase-table {
  margin: 30px 80px 0 0;
}
</style>
