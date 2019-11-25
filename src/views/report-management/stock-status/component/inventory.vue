<template>
  <div id="content">
    <el-row :gutter="40" class="panel-group">
      <el-col v-for="(item, index) in listData" :key="index" :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper" :class="item.class">
            <svg-icon :icon-class="item.icon" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              {{ item.name }}(万元)
            </div>
            <count-to :start-val="0" :end-val="item.value" :decimals="2" :duration="2600" class="card-panel-num" />
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
import { REPORT_ICON, REPORT_ICON_BY_TEXT } from '@/utils/conventionalContent'
import { fetchInventorySum } from '@/api/report'
export default {
  name: 'ReportManagementInventory',
  components: {
    CountTo
  },
  data() {
    return {
      reportIcon: REPORT_ICON,
      reportIconByText: REPORT_ICON_BY_TEXT,
      listData: [],
      itemClass: [
        { 'icon-red': true },
        { 'icon-blueGreen': true },
        { 'icon-blue': true },
        { 'icon-green': true }
      ],
      defaultClass: { 'icon-green': true }
    }
  },
  mounted() {
    this.getInventorySum()
  },
  methods: {
    getInventorySum: function() {
      const loading = this.$loading({
        target: '#content',
        lock: true,
        text: '正在加载',
        background: 'rgba(255, 255, 255, 0.75)'
      })
      fetchInventorySum().then(({ data, code, message }) => {
        if (code === 200) {
          this.listData = data.map((v, index) => {
            let icon
            const iconArr = this.reportIconByText.filter(r => {
              // console.log(r.name)
              return v.name.indexOf(r.name) > -1
            })
            if (iconArr && iconArr.length) {
              icon = iconArr[0].icon
            }
            return {
              name: v.name,
              value: Number((v.amount / 10000).toFixed(2)),
              type: v.type,
              icon: icon || this.reportIcon[v.type],
              class: this.itemClass[this.calcType(index)]
            }
          })
        } else {
          this.$message({ message: message, type: 'error' })
        }
        loading.close()
      }).catch(e => {
        loading.close()
        console.log(e)
        this.$message({ message: '获取库存数据失败', type: 'error' })
      })
    },
    calcType(num) {
      num = Math.floor(num / 4)
      if (num < 4) {
        return num
      } else {
        // num -= 4
        return this.calcType(num)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    // &:hover {
    //   .card-panel-icon-wrapper {
    //     color: #fff;
    //   }

    //   .icon-people {
    //     background: #40c9c6;
    //   }

    //   .icon-message {
    //     background: #36a3f7;
    //   }

    //   .icon-money {
    //     background: #f4516c;
    //   }

    //   .icon-shopping {
    //     background: #34bfa3
    //   }
    // }
    .card-panel-icon-wrapper {
        color: #fff;
      }

    .icon-blueGreen {
      // color: #40c9c6;
      background: #40c9c6;
    }

    .icon-blue {
      background: #36a3f7;
    }

    .icon-red {
      background: #f4516c;
    }

    .icon-green {
      background: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-end;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
