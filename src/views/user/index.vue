<template>
  <div class="user-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      :title="userinfo.name"
      @click-left="$router.back()"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="user-info">
      <div class="base-info">
        <van-image
          class="avatar"
          round
          fit="cover"
          :src="userinfo.photo"
        />
        <div class="right-area">
          <div class="stats-wrap">
            <div class="stats-item">
              <span class="count">{{userinfo.art_count}}</span>
              <span class="text">发布</span>
            </div>
            <div class="stats-item">
              <span class="count">{{userinfo.follow_count}}</span>
              <span class="text">关注</span>
            </div>
            <div class="stats-item">
              <span class="count">{{userinfo.fans_count}}</span>
              <span class="text">粉丝</span>
            </div>
            <div class="stats-item">
              <span class="count">{{userinfo.like_count}}</span>
              <span class="text">获赞</span>
            </div>
          </div>
          <van-button class="follow-btn">关注</van-button>
        </div>
      </div>
      <div class="label-info">
        <div class="bio-wrap">
          <span class="label">简介：</span>
          <span class="text">{{userinfo.intro}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserInfo } from '@/api/user'
export default {
  name: 'UserIndex',
  components: {},
  props: {
    userId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      userinfo: {}
    }
  },
  computed: {},
  watch: {},
  created () {
    // 初始化的时候，如果用户登录了，我才请求获取当前登录用户的信息
    if (this.$store.state.user) {
      this.loadUser()
    }
  },
  mounted () {},
  methods: {
    async loadUser () {
      try {
        const { data } = await getUserInfo()
        this.userinfo = data.data
        // console.log(this.userinfo)
      } catch (err) {
        // console.log(err)
        this.$toast('获取数据失败，可尝试重新登录')
      }
    }
  }
}
</script>

<style scoped lang="less">
.user-container {
  .user-info {
    background-color: #fff;
    padding: 12.5px 16px;
    .base-info {
      display: flex;
      margin-bottom: 12.5px;
      .avatar {
        width: 77px;
        height: 77px;
        margin-right: 31px;
      }
    }
    .label-info {
      font-size: 12.5px;
      .bio-wrap {
        .label {
          color: #646263;
        }
        .text {
          color: #212121;
        }
      }
    }
  }
  .right-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    .stats-wrap {
      display: flex;
      justify-content: space-between;
      .stats-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .count {
          font-size: 13px;
          color: #0d0a10;
        }
        .text {
          font-size: 10.5px;
          color: #9c9b9d;
        }
      }
    }
    .follow-btn {
      width: 140px;
      height: 27.5px;
      line-height: 27.5px;
      background-color: #6bb5ff;
      color: #fff;
      border: none;
    }
  }
}
</style>
