<template>
  <div id='app'>
    <h1>黑马头条</h1>
    <i class='iconfont iconfont-ku'></i>
    <i class='iconfont iconfont-sousuo'></i>
    <van-button type="info">信息按钮</van-button>
    <!-- 路由的出口 -->
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'App'
}
</script>

<style lang='less'></style>
