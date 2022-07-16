<template>
  <div class="layout-container">
     <!-- 子路由出口 -->
    <router-view />
    <!-- /子路由出口 -->

    <!-- 标签导航栏 -->
    <!-- route: 开启路由模式-->
    <van-tabbar class="layout-tabbar" route v-model="active">
      <van-tabbar-item to='/layout/home'>
        <i slot="icon" class="iconfont iconfont-shouye"></i>
        <span class="text">首页</span>
      </van-tabbar-item>
      <van-tabbar-item to="/layout/qa">
        <i slot="icon" class="iconfont iconfont-wenda"></i>
        <span class="text">问答</span>
      </van-tabbar-item>
      <van-tabbar-item to="/layout/video">
        <i slot="icon" class="iconfont iconfont-shipin"></i>
        <span class="text">视频</span>
      </van-tabbar-item>
      <van-tabbar-item to="/layout/my">
        <i slot="icon" class="iconfont iconfont-wode"></i>
        <span class="text">{{$store.state.user?'我的':'未登录'}}</span>
      </van-tabbar-item>
    </van-tabbar>
    <!-- /标签导航栏 -->

  </div>
</template>

<script>
export default {
  name: 'LayoutIndex',
  data () {
    return {
      active: 0
    }
  }
}
</script>

<style scoped lang="less">
.layout-container{
    .layout-tabbar{
        i.iconfont {
            font-size: 20px;
        }
        span.text {
        font-size: 10px;
        }
    }
}

</style>
