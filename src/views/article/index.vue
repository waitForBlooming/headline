<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      title="文章详情"
      @click-left="$router.back()"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div v-if="loading" class="loading-wrap">
        <van-loading
          color="#3296fa"
          vertical
        >加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <!-- 如果成功加载到数据，article.title就为非空即为真 -->
      <div v-else-if="article.title" class="article-detail">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->
        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <!-- 这里使用之前在utils的dayjs.js里面定义的全局过滤器relativeTime -->
          <div slot="label" class="publish-date">{{ article.pubdate | relativeTime }}</div>
          <!-- 关注/取消关注 -->
          <!-- <follow-user class="follow-btn"
          :isFollowed="article.is_followed"
          :userId="article.aut_id"
          @update-is_followed="article.is_followed=$event"/> -->

          <!-- 当我们传递给子组件的数据既要使用还要修改,可以使用组件的v-model属性
          :isFollowed="article.is_followed"
          @update-is_followed="article.is_followed=$event"
          上面2句等价于下面两句代码
          value="article.is_followed"
          @input="article.is_followed = $event"
          即子组件通过value拿到父组件传过来的值，通过触发@input
           -->
          <follow-user class="follow-btn"
          v-model="article.is_followed"
          :userId="article.aut_id"/>
        </van-cell>
        <!-- /用户信息 -->
        <!-- 文章内容 -->
        <div
        class="article-content markdown-body"
        v-html="article.content"
        ref="article-content"
        ></div>
        <van-divider>正文结束</van-divider>

        <!-- 文章评论列表 -->
        <comment-list
          :source="article.art_id"
          :list="commentList"
          @onload-success="totalCommentCount = $event.total_count"
          @reply-click="onReplyClick"
        />
        <!-- /文章评论列表 -->

      <!-- 底部区域 -->
      <div class="article-bottom">
        <!-- 写评论 -->
        <van-button
          class="comment-btn"
          type="default"
          round
          size="small"
          @click="isPostShow = true"
        >写评论</van-button>
        <!-- 写评论弹出层 -->
        <van-popup
          v-model="isPostShow"
          position="bottom"
        >
          <comment-post
            :target="article.art_id"
            @updateCommentCount="++totalCommentCount"
            @post-success="onPostSuccess"
          />
        </van-popup>

        <!-- 自己增加的点击评论图标弹出评论列表的功能 -->
        <!-- 评论图标 -->
        <van-button
          class="comment-count"
          @click="isCommentlistShow=true"
        >
          <van-icon
            class="comment-icon"
            name="comment-o"
            :badge="totalCommentCount"
          />
        </van-button>
        <!-- 评论列表弹出层 -->
        <van-popup
          class="comment-pop"
          v-model="isCommentlistShow"
          position="bottom"
          :style="{ height: '70%' }"
        >
          <van-nav-bar
            class="popup-fixed"
            :title="'全部评论总共 '+totalCommentCount+' 条'"
          />
          <!-- 文章评论列表 -->
          <comment-list
            class="popup-content"
            :source="article.art_id"
            @onload-success="totalCommentCount = $event.total_count"
            @reply-click="onReplyClick"
            :list="commentList"
          />
          <!-- /文章评论列表 -->
        </van-popup>
        <!-- /评论列表弹出层 -->
        <!-- /自己增加的点击评论图标弹出评论列表的功能 -->

        <!-- <van-icon
          color="#777"
          name="star-o"
        /> -->
        <!-- 收藏图标 -->
        <collectArticle
          class="btn-item"
          v-model="article.is_collected"
          :article-id="article.art_id"
        />
        <!-- 点赞图标 -->
        <like-article
          class="btn-item"
          v-model="article.attitude"
          :article-id="article.art_id"
        />
        <!-- 分享图标 -->
        <van-icon name="share" color="#777777"></van-icon>
      </div>
      <!-- /底部区域 -->

      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div v-else-if="errStatus === 404" class="error-wrap">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div v-else class="error-wrap">
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button
        class="retry-btn"
        @click="loadArticle"
        >点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
    <!--
      弹出层是懒渲染的：只有在第一次展示的时候才会渲染里面的内容，之后它的关闭和显示都是在切换内容的显示和隐藏
     -->
    <!-- 评论回复弹出层 -->
    <van-popup
      class="reply-comment"
      v-model="isReplyShow"
      position="bottom"
      style="height: 100%;"
    >
      <comment-reply
        v-if="isReplyShow"
        :comment="currentComment"
        @close="isReplyShow = false"
      />
    </van-popup>
    <!-- /评论回复弹出层 -->

  </div>
</template>

<script>
import { getArticleById } from '@/api/article'
import { ImagePreview } from 'vant'
import FollowUser from '@/components/follow-user'
import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/like-article'
import CommentList from './components/comment-list'
import CommentPost from './components/comment-post'
import CommentReply from './components/comment-reply'
export default {
  name: 'ArticleIndex',
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle,
    CommentList,
    CommentPost,
    CommentReply
  },
  props: {
    articleId: {
      // 从首页列表点击过来时，是数字类型；通过在地址栏粘贴url回车访问过来时，是字符串类型
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      article: {}, // 文章详情
      loading: true, // 加载中的 loading 状态
      errStatus: 0, // 失败的状态码（为了给出不同的失败提示（404与非404））
      followLoading: false,
      totalCommentCount: 0,
      isPostShow: false, // 控制发布评论弹出层的显示状态
      commentList: [], // 评论列表
      isCommentlistShow: false, // 控制评论列表弹出层的显示状态
      isReplyShow: false,
      currentComment: {} // 当前点击回复的评论项
    }
  },
  // 给所有的后代组件提供数据
  // 注意：不要滥用
  provide: function () {
    return {
      articleId: this.articleId
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticle()
  },
  mounted () {},
  methods: {
    async loadArticle () {
      // 重新加载时，展示 loading 加载中
      this.loading = true
      try {
        const { data } = await getArticleById(this.articleId)
        // console.log(data)

        // // 模拟/制造错误，出现非404的错误
        // if (Math.random() > 0.2) {
        //   JSON.parse('dsankljdnskaljndlkjsa')
        // }

        // 数据驱动视图这件事儿不是立即的
        this.article = data.data
        // console.log(this.article)
        // 初始化图片点击预览
        // console.log(this.$refs['article-content'])// undefined
        setTimeout(() => {
          this.previewImage()
        }, 0)
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.errStatus = 404
        }
      }
      // 无论成功还是失败，都需要关闭 loading
      this.loading = false
    },
    previewImage () {
      // 得到所有的 img 节点
      const articleContent = this.$refs['article-content']
      const imgs = articleContent.querySelectorAll('img')
      //   console.log(imgs)

      // 获取所有 img 地址
      const images = []
      imgs.forEach((img, index) => {
        images.push(img.src)
        // 给每个 img 注册点击事件，在处理函数中调用预览
        img.onclick = () => {
          ImagePreview({
            // 预览的图片地址数组
            images,
            // 起始位置，从 0 开始
            startPosition: index
          })
        }
      })
    //   console.log(images)
    },
    onPostSuccess (data) {
      // 关闭弹出层
      this.isPostShow = false
      // 将发布内容显示到列表顶部
      this.commentList.unshift(data.new_obj)
    },
    onReplyClick (comment) {
      // comment是从comment-item.vue传出来的（中间通过了comment-list.vue）
      // console.log(comment)
      this.currentComment = comment// 把数据存储起来，给comment-reply.vue使用

      // 显示评论回复弹出层
      this.isReplyShow = true
    }
  }
}
</script>

<style scoped lang="less">
@import "./github-markdown.css";
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 46px;
    bottom: 44px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 20px;
      padding: 25px 16px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 16px;
      .avatar {
        width: 35px;
        height: 35px;
        margin-right: 8.5px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 12px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 11.5px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 85px;
        height: 29px;
      }
    }

    .article-content {
      padding: 27.5px 16px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 100px 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 100px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 61px;
      color: #b4b4b4;
    }
    .text {
      font-size: 15px;
      color: #666666;
      margin: 16.5px 0 23px;
    }
    .retry-btn {
      width: 140px;
      height: 35px;
      line-height: 35px;
      border: 0.5px solid #c3c3c3;
      font-size: 15px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 44px;
    border-top: 0.5px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 141px;
      height: 23px;
      border: 1px solid #eeeeee;
      font-size: 15px;
      line-height: 23px;
      color: #a7a7a7;
    }
    .comment-count{
      border: none;
      padding: 0;
    }
    .popup-fixed{
      position: fixed;
      left: 0;
      right: 0;
    }
    .popup-content{
      padding-top: 50px;
    }
    /deep/ .van-icon {
      font-size: 20px;
      .van-info {
        font-size: 8px;
        background-color: #e22829;
      }
    }
    .btn-item {
      border: none;
      padding: 0;
      height: 20px;
      line-height: 20px;
      color: #777777
    }
  }
}
</style>
