<template>
  <div class="my-container">
    <!-- 已登录头部 -->
    <div v-if="user" class="header user-info">
      <div class="base-info">
        <div class="left">
          <van-image
          class="avatar"
          round
          fit="cover"
          :src="userinfo.photo"
          @click="touser"
          />
          <span class="name">{{userinfo.name}}</span>
        </div>
        <div class="right">
          <van-button
          size="mini"
          round
          to="/user/profile"
          >编辑资料</van-button>
        </div>
      </div>
      <div class="data-stats">
        <div class="data-item">
          <span class="count">{{userinfo.art_count}}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <span class="count">{{userinfo.follow_count}}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <span class="count">{{userinfo.fans_count}}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
          <span class="count">{{userinfo.like_count}}</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>
    <!-- /已登录头部 -->

    <!-- 未登录头部 -->
    <div v-else class="header no-login">
      <div class="login-btn" @click="$router.push('/login')">
        <img class="mobile-img" src="~@/assets/mobile.png" alt="">
        <span class="text">登录/注册</span>
      </div>
    </div>
    <!-- /未登录头部 -->

    <!-- 宫格导航 -->
    <van-grid :column-num="2" class="grid-nav mb-9" clickable>
      <van-grid-item text="收藏" class="grid-item">
        <i slot="icon" class="iconfont iconfont-shoucang"></i>
      </van-grid-item>
      <van-grid-item text="历史" class="grid-item">
        <i slot="icon" class="iconfont iconfont-lishi"></i>
      </van-grid-item>
    </van-grid>
    <!-- /宫格导航 -->

    <!-- 页面导航 -->
    <van-cell title="消息通知" is-link />
    <van-cell title="小智同学" class="mb-9" is-link />
    <!-- 退出登录 -->
    <van-cell
    v-if="user"
    title="退出登录"
    class="logout-cell"
    clickable
    @click="onLogout"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserInfo } from '@/api/user'
export default {
  name: 'MyIndex',
  data () {
    return {
      // 用户信息
      userinfo: {}
    }
  },
  created () {
    // 初始化的时候，如果用户登录了，我才请求获取当前登录用户的信息
    if (this.$store.state.user) {
      this.loadUser()
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    onLogout () {
      // 退出提示
      // 确认退出：清除登录状态*（容器中的user和本地存储中的user）
      this.$dialog.confirm({
        title: '确认退出吗？'
      })
        .then(() => {
          // on confirm
          // console.log('确认执行这里')
          this.$store.commit('setUser', null)
        })
        .catch(() => {
          // on cancel
          // console.log('取消执行这里')
        })
    },
    async loadUser () {
      try {
        const { data } = await getUserInfo()
        this.userinfo = data.data
        // console.log(this.userinfo)
      } catch (err) {
        // console.log(err)
        this.$toast('获取数据失败，可尝试重新登录')
      }
    },
    touser () {
      this.$router.push({
        name: 'user',
        params: {
          userId: this.userinfo.id
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.my-container{
  .header{
    height: 180px;
    background: url('~@/assets/banner.png');
    background-size: cover;
  }
  .no-login{
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn{
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      .mobile-img{
        width: 66px;
        height: 66px;
        margin-bottom: 8px;
      }
      .text{
        font-size: 14px;
        color: #fff;
      }
    }
  }
  .user-info{
    .base-info{
    height: 115px;
    padding: 38px 16px 11px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left{
      display: flex;
      align-items: center;
      .avatar{
        width: 66px;
        height: 66px;
        margin-right: 11px;
        border: 2px solid #fff;
      }
      .name{
        font-size: 15px;
        color: #fff;
      }
    }
    }
    .data-stats{
      height: 65px;
      display: flex;
      justify-content: space-around;
      .data-item{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
        .count{
          font-size: 18px;
        }
        .text{
          font-size: 12px;
        }
      }
    }
  }
  .grid-nav{
    .grid-item{
      height: 70px;
      i.iconfont{
        font-size: 22px;
      }
      .iconfont-shoucang{
        color: #ec5859;
      }
      .iconfont-lishi{
        color: #ff9f21;
      }
      .van-grid-item__text{
        font-size: 14px;
      }
    }
  }
  .mb-9 {
    margin-bottom: 9px;
  }
  .logout-cell {
  text-align: center;
  color: #d86262;
  }
}
</style>
