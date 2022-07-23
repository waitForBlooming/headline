<template>
  <van-cell class="comment-item">
    <van-image
      slot="icon"
      class="avatar"
      round
      fit="cover"
      :src="comment.aut_photo"
    />
    <div slot="title" class="title-wrap">
      <div class="user-name">{{ comment.aut_name }}</div>
        <van-button
        class="like-btn"
        :class="{
            liked: comment.is_liking
        }"
        :icon="comment.is_liking ? 'good-job' : 'good-job-o'"
        :loading="commentLoading"
        @click="onCommentLike"
        >{{ comment.like_count || '赞' }}</van-button>
    </div>

    <div slot="label">
      <p class="comment-content">{{ comment.content }}</p>
      <div class="bottom-info">
        <span class="comment-pubdate">{{ comment.pubdate | relativeTime }}</span>
        <van-button
          v-if="hiddenreply"
          class="reply-btn"
          round
          @click="$emit('reply-click', comment)"
        >回复{{ comment.reply_count }}</van-button>
      </div>
    </div>
  </van-cell>
</template>

<script>
import { addCommentLike, deleteCommentLike } from '@/api/comment'
export default {
  name: 'CommentItem',
  components: {},
  props: {
    comment: {
      type: Object,
      required: true
    },
    hiddenreply: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      commentLoading: false,
      commentt: this.comment // 供处理函数修改引用型的数据，否则直接修改comment代码会报语法错误
    }
  },
  methods: {
    async onCommentLike () {
      this.commentLoading = true
      try {
        if (this.comment.is_liking) {
          // 已赞，取消点赞
          await deleteCommentLike(this.comment.com_id)
          //   更新点赞数量视图（如果不更新，用户需要刷新页面之后才能看到点赞图标及数量的变化，因为数据更新不是及时的，需要我们自己手动更新）
          this.commentt.like_count--
        } else {
          // 没有点赞，添加点赞
          await addCommentLike(this.comment.com_id)
          //   更新点赞数量视图
          this.commentt.like_count++
        }
        //   更新点赞颜色视图
        this.commentt.is_liking = !this.commentt.is_liking
      } catch (err) {
        this.$toast('操作失败，请重试')
      }
      this.commentLoading = false
    }
  }
}
</script>

<style scoped lang="less">
.comment-item {
  .avatar {
    width: 36px;
    height: 36px;
    margin-right: 12.5px;
  }
  .title-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .user-name {
      color: #406599;
      font-size: 13px;
    }
  }
  .comment-content {
    font-size: 16px;
    color: #222222;
    word-break: break-all;
    text-align: justify;
  }
  .comment-pubdate {
    font-size: 9.5px;
    color: #222;
    margin-right: 12.5px;
  }
  .bottom-info {
    display: flex;
    align-items: center;
  }
  .reply-btn {
    // width: 67.5px;
    height: 24px;
    line-height: 24px;
    font-size: 11.5px;
    color: #222;
  }
  .like-btn {
    height: 15px;
    padding: 0;
    border: none;
    font-size: 9.5px;
    line-height: 15px;
    margin-right: 7px;
    .van-icon {
      font-size: 15px;
    }
    &.liked {
    color: #e5645f;
  }
  }
}
</style>
