<template>
  <div class="notify-component">
    <el-popover
      trigger="click"
      placement="right"
      width="400"
    >
      <div v-infinite-scroll="getList" :infinite-scroll-disabled="!hasNextPage" class="infinite-list" style="overflow:auto;min-height:100px;max-height:600px;">
        <div v-for="(item,index) in listData" :key="index" class="inventory-item">
          <div>
            <span>物料名称：{{ `${item.typeName}-${item.className}-${item.detailName}` }}</span>
            <el-tag size="mini">{{ item.materialCode }}</el-tag>
          </div>
          <div class="inventory-num-box">
            <span>剩余数量：<span style="color:red">{{ item.currentInventory }}</span></span>
            <span>预警数量：{{ item.minimumInventory }}</span>
          </div>
        </div>
      </div>
      <el-badge slot="reference" :value="total" :max="99" :hidden="total < 1" class="item">
        <svg-icon icon-class="notify" @click="changeVisible" />
      </el-badge>
    </el-popover>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import { getToken } from '@/utils/auth'
import { fetchInventoryWarningList } from '@/api/material'
export default {
  name: 'NotifyComponent',
  data() {
    return {
      stompClient: '',
      timer: '',
      visible: false,
      total: 0,
      listQuery: {
        page: 0,
        size: 10
      },
      hasNextPage: true,
      listData: []
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  // mounted() {
  // this.polling()
  // },
  mounted() {
    this.initWebSocket()
  },
  beforeDestroy() {
    // 页面离开时断开连接,清除定时器
    this.disconnect()
    clearInterval(this.timer)
  },
  methods: {
    changeVisible() {
      this.visible = !this.visible
      if (this.visible) {
        this.listData = []
        this.listQuery.page = 0
        this.hasNextPage = true
        this.getList()
      }
    },
    getList() {
      this.listQuery.page++
      fetchInventoryWarningList(this.listQuery).then(({ data, code, message }) => {
        if (code === 200) {
          if (this.listQuery.page === 1) {
            this.listData = []
          }
          if (data && data.data && data.data.length) {
            this.listData = this.listData.concat(data.data)
          }
          this.total = data ? data.totalCount : 0
          this.hasNextPage = data ? data.hasNextPage : true
        } else {
          this.$message({ message: message, type: 'error' })
        }
      }).catch(e => {
        this.$message({ message: '获取库存预警列表失败', type: 'error' })
      })
    },
    polling() {
      // 30秒
      setInterval(() => {
        fetchInventoryWarningList({ page: 1, size: 1 }).then(({ data, code, message }) => {
          if (code === 200) {
            this.total = data ? data.totalCount : 0
          }
        })
      }, 30000)
    },
    initWebSocket() {
      this.connection()
      const self = this
      // 断开重连机制,尝试发送消息,捕获异常发生时重连
      this.timer = setInterval(() => {
        try {
          self.stompClient.send('test')
        } catch (err) {
          console.log('断线了: ' + err)
          self.connection()
        }
      }, 10000)
    },
    connection() {
      const token = getToken()
      if (!token) return
      // 连接服务端提供的通信接口，连接以后才可以订阅广播消息和个人消息
      const sock = new SockJS(`${process.env.VUE_APP_BASE_SOCKET}?Authorization=${token}`)
      // 获取STOMP子协议的客户端对象
      this.stompClient = Stomp.over(sock)
      // 下面的写法，Authorization并不直接出现在requestheader中，而是在cookie里
      const headers = { Authorization: `` }
      // 向服务器发起websocket连接
      this.stompClient.connect(headers, (message) => {
        this.subscribe(headers)
        // this.sendMessage(headers)
      }, (err) => {
        // 连接发生错误时的处理函数
        console.log('连接失败')
        console.log(err)
      })
    },
    sendMessage(headers) { // 发送消息
      this.stompClient.send('/bim/ws/topics/receive', headers, JSON.stringify({ 'type': 'pong', 'name': `${this.name}` }))
    },
    subscribe(headers) { // 订阅公告
      this.stompClient.subscribe('/bim/ws/topics/inventory/reminder', ({ body }) => { // 订阅服务端提供的某个topic
        const _data = JSON.parse(body)
        if (_data && _data.type === 'notice') {
          // TODO: 此处通知有问题，只有当数量发生变化时，才会通知，影响不大（暂时这样实现）
          const _total = _data.message ? Number(_data.message) : 0
          if (_total !== this.total) {
            this.total = _total
            this.$notify({ title: '库存预警', message: `当前低于预警数量的物料为${this.total}种`, type: 'warning' })
          }
        }
      }, headers)
    },
    // 断开连接
    disconnect() {
      if (this.stompClient != null) {
        this.stompClient.disconnect()
        console.log('Disconnected')
      }
    }
  }
}
</script>
<style scoped>
.inventory-item {
    width: 100%;
    height: 68px;
    background: #fff6f6;
    border-radius: 4px;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content:space-between;
    align-items: flex-start;
    margin-bottom: 10px;
}
.inventory-num-box {
    width: 100%;
}
.inventory-num-box >span {
    display: inline-block;
    width: 40%;
}
</style>
<style>
.notify-component .el-badge__content.is-fixed {
    top:10px;
}
</style>
