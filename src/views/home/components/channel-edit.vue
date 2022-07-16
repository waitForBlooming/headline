<template>
  <div class="channel-edit">
    <!-- 频道编辑 -->
    <van-cell :border="false">
        <div slot="title" class="title-text">我的频道</div>
        <van-button
            class="edit-btn"
            type="danger"
            plain
            round
            size="mini"
            @click="isEdit = !isEdit"
        >{{ isEdit ? '完成' : '编辑' }}</van-button>
    </van-cell>
    <van-grid class="my-grid" :gutter="10">
        <van-grid-item
            class="grid-item"
            v-for="(channel, index) in myChannels"
            :key="index"
            @click="onMyChannelClick(channel, index)"
        >
    <van-icon
        v-show="isEdit && !fiexdChannels.includes(channel.id)"
        slot="icon"
        name="clear"
    ></van-icon>
        <!--
          v-bind:class 语法
          一个对象，对象中的 key 表示要作用的 CSS 类名
                    对象中的 value 要计算出布尔值
                      true，则作用该类名
                      false，不作用类名
         -->
            <span
                slot="text"
                :class="{ active: index === active }"
            >{{channel.name}}</span>
        </van-grid-item>
    </van-grid>
    <!-- /频道编辑 -->

    <!-- 频道推荐 -->
    <van-cell :border="false">
        <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid :gutter="10" direction="horizontal">
        <van-grid-item
            class="grid-item"
            v-for="(channel, index) in recommendChannels"
            :key="index"
            icon="plus"
            :text="channel.name"
            @click="onAddChannel(channel)"
             />
    </van-grid>
    <!-- /频道推荐 -->
  </div>
</template>

<script>
import { getAllChannels, addUserChannel, deleteUserChannel } from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
export default {
  name: 'ChannelEdit',
  data () {
    return {
      allChannels: [], // 所有频道
      myChannelss: this.myChannels,
      isEdit: false, // 控制编辑状态的显示
      fiexdChannels: [0] // 固定频道，不允许删除
    }
  },
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  created () {
    this.loadAllChannels()
  },
  methods: {
    async loadAllChannels () {
      try {
        const { data } = await getAllChannels()
        // console.log(data)
        this.allChannels = data.data.channels
      } catch {
        this.$toast('数据获取失败')
      }
    },
    async onAddChannel (channel) {
      // 计算属性会观测内部依赖数据的变化
      // 如果依赖的数据发生变化，则计算属性会重新执行
      this.myChannelss.push(channel)

      // 数据持久化处理
      if (this.user) {
        try {
          // 已登录，把数据请求接口放到线上
          await addUserChannel({
            id: channel.id, // 频道ID
            seq: this.myChannelss.length // 序号（数组的长度）
          })
        } catch (err) {
          this.$toast('保存失败，请稍后重试')
        }
      } else {
        // 未登录，把数据存储到本地
        setItem('TOUTIAO_CHANNELS', this.myChannelss)// setItem之前在utils/storage.js封装过方法
      }
    },
    onMyChannelClick (channel, index) {
      if (this.isEdit) {
        // 1. 如果是固定频道，则不删除
        if (this.fiexdChannels.includes(channel.id)) {
          return
        }
        // 2.删除频道项
        this.myChannelss.splice(index, 1)
        // 3.如果删除的激活频道之前的频道，则更新激活的频道项
        // 参数1：要删除的元素的开始索引（包括）
        // 参数2：删除的个数，如果不指定，则从参数1开始一直删除到最后
        if (index <= this.active) {
          // 让激活频道的索引 - 1
          // true表示不关闭弹出层，也可以不传这个值，因为父组件内给这个函数定义了默认值为true
          this.$emit('update-active', this.active - 1, true)
        }
        // 4. 处理持久化
        this.deleteChannel(channel)
      } else {
        // 非编辑状态，执行切换频道
        this.$emit('update-active', index, false)
      }
    },
    async deleteChannel (channel) {
      try {
        if (this.user) {
          // 已登录，则将数据更新到线上
          await deleteUserChannel(channel.id)
        } else {
          // 未登录，将数据更新到本地
          setItem('TOUTIAO_CHANNELS', this.myChannels)
        }
      } catch (err) {
        this.$toast('操作失败，请稍后重试')
      }
    }
  },
  computed: {
    ...mapState(['user']),
    // 一种更简化的实现方式
    // 计算属性会观测内部依赖数据的变化
    // 如果依赖的数据发生变化，则计算属性会重新执行
    recommendChannels () {
      // 数组的 filter 方法：遍历数组，把符合条件的元素存储到新数组中并返回
      return this.allChannels.filter(channel => {
        // const channels = []//伪代码

        // 数组的 find 方法：遍历数组，把符合条件的第1个元素返回
        // 如果return出来的条件为true，当前遍历对象会被存进filter数组，否则不存进去
        return !this.myChannels.find(myChannel => {
          return myChannel.id === channel.id
        })

        // return channels//伪代码
      })
    }

    // recommendChannels () {
    //   const channels = []
    //   this.allChannels.forEach(channel => {
    //     // find 遍历数组，找到满足条件的元素项
    //     const ret = this.myChannels.find(myChannel => {
    //       return myChannel.id === channel.id
    //     })

    //     // 如果我的频道中不包括该频道项，则收集到推荐频道中
    //     if (!ret) {
    //       channels.push(channel)
    //     }
    //   })

    //   // 把计算结果返回
    //   return channels
    // }
  }
}
</script>

<style scoped lang="less">
.channel-edit{
    padding: 43px 0;
    .title-text{
        font-size: 16px;
        color: #333333;
    }
    .edit-btn{
        width: 52px;
        height: 24px;
        font-size: 13px;
        color: #f97878;
        border: 1px solid #f97878;
    }
    /deep/.grid-item{
        width: 80px;
        height: 43px;
        .van-grid-item__content{//非根节点，样式想生效，父元素需用/deep/
            white-space: nowrap;
            background-color: #f4f5f6;
            .van-grid-item__text,span{
                font-size: 14px;
                color: #222;
                margin-top: 0;
            }
            .van-icon-plus{
                font-size: 14px;
            }
        }
    }
    /deep/ .my-grid {
    .grid-item {
        .van-grid-item__icon-wrapper{
            position: unset;
        }
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 15px;
        color: #cacaca;
        z-index: 2;
        }
        .active{
        color: #f00;
        }
    }
  }
}

</style>
