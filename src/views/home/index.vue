<template>
  <div class="home-container" >
    <span></span>
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        class="search-btn"
        slot="title"
        type="info"
        size="small"
        round
        icon="search"
        to='/search'
      >搜索</van-button>
    </van-nav-bar>
    <!-- /导航栏 -->
    <!-- 频道列表 -->
    <van-tabs class="channel-tabs" v-model="active" animated swipeable>
      <van-tab
      v-for="channel in channels"
      :key="channel.id"
      :title="channel.name">
        <!-- 文章列表 -->
        <article-list :channel="channel"/>
        <!-- /文章列表 -->
      </van-tab>
      <!-- placeholder当做占位符，免得最后一个标签页文字被汉堡按钮覆盖看不到 -->
      <div slot="nav-right" class="placeholder"></div>
      <div
        slot="nav-right"
        class="hamburger-btn"
        @click="isChennelEditShow = true"
      >
        <i class="iconfont iconfont-gengduo"></i>
      </div>
    </van-tabs>
    <!-- /频道列表 -->
    <!-- 频道编辑弹出层 -->
    <van-popup
      v-model="isChennelEditShow"
      closeable
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <channel-edit
      :my-channels="channels"
      :active="active"
      @update-active="onUpdateActive"/>
    </van-popup>
    <!-- /频道编辑弹出层 -->
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './components/article-list'
import ChannelEdit from './components/channel-edit'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'
export default {
  name: 'HomeIndex',
  data () {
    return {
      active: 0,
      channels: [], // 频道列表
      isChennelEditShow: false // 控制编辑频道弹出层的显示状态
    }
  },
  components: {
    ArticleList,
    ChannelEdit
  },
  created () {
    this.loadChannels()
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    async loadChannels () {
      try {
        // const { data } = await getUserChannels()
        // // console.log(data)
        // this.channels = data.data.channels
        // 不能向上面几行代码一样直接获取线上的频道数据，应当判断用户是否登录（未登录，使用本地localStorage的数据；已登录，发请求使用线上接口数据）
        let channels = []

        if (this.user) {
          // 已登录，请求获取用户频道列表
          const { data } = await getUserChannels()
          channels = data.data.channels
        } else {
          // 未登录，判断是否有本地的频道列表数据
          const localChannels = getItem('TOUTIAO_CHANNELS')
          //    有，拿来使用
          if (localChannels) {
            channels = localChannels
          } else {
            //    没有，请求获取默认频道列表
            const { data } = await getUserChannels()
            channels = data.data.channels
          }
        }

        this.channels = channels
      } catch (err) {
        this.$toast('获取频道数据失败')
      }
    },
    onUpdateActive (index, isChennelEditShow = true) {
      // 更新激活的频道项
      this.active = index

      // 关闭编辑频道弹层
      this.isChennelEditShow = isChennelEditShow
    }
  }
}
</script>

<style scoped lang="less">
.home-container{
  padding-top: 87px;
  padding-bottom: 50px;
  /deep/.van-nav-bar__title {
    max-width: unset;
  }
  .search-btn{
    width: 277px;
    height: 32px;
    background-color: #5babfb;
    border:none;
    font-size: 14px;
    .van-icon{
      font-size: 16px;
    }
  }

  /deep/.channel-tabs{
    .van-tabs__wrap{
      height: 41px;
      position: fixed;
      top: 46px;
      z-index: 1;
      left: 0;
      right: 0;
      }
    .van-tab{
      min-width: 100px;
      border-right: 1px solid #edeff3;
      font-size: 15px;
      color: #777777;
    }
    .van-tab--active{
      color: #333333;
    }
    .van-tabs__nav{
      padding-bottom: 0;
    }
    .van-tabs__line{
      width: 15.5px;
      height: 3px;
      background-color: #3296fa;
      bottom: 4px;
    }
  }
  .placeholder {
  flex-shrink: 0;//不让此盒子参与flex布局的空间计算
  width: 33px;
  height: 41px;
  }
  .hamburger-btn{
    position: fixed;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 33px;
    height: 41px;
    background-color: #fff;
    opacity: 0.902;
    i.iconfont{
      font-size: 17px;
    }
    &:before {
        content: "";
        position: absolute;
        left: 0;
        width: 0.5px;
        height: 29px;
        background-image: url(~@/assets/gradient-gray-line.png);
        background-size: contain;
      }
  }
}

</style>
