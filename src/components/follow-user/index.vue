<template>
    <van-button
    v-if="isFollowed"
    round
    size="small"
    :loading="followLoading"
    @click="onFollow"
    >已关注</van-button>
    <van-button
    v-else
    type="info"
    color="#3296fa"
    round
    size="small"
    icon="plus"
    :loading="followLoading"
    @click="onFollow"
    >关注</van-button>
</template>

<script>
import { addFollow, deleteFollow } from '@/api/user'
export default {
  name: 'FollowUser',
  data () {
    return {
      followLoading: false
    }
  },
  // 自定义 v-model 的数据名称
  model: {
    prop: 'isFollowed', // 默认是 isFollowed
    event: 'update-is_followed' // 默认是 input
  },
  props: {
    isFollowed: {
      type: Boolean,
      required: true
    },
    userId: {
      type: [Number, String, Object],
      required: true
    }
  },
  methods: {
    async onFollow () {
      // 开启按钮的 loading 状态
      this.followLoading = true
      try {
        // 如果已关注，则取消关注
        const authorId = this.userId
        if (this.isFollowed) {
          await deleteFollow(authorId)
        } else {
          // 否则添加关注
          await addFollow(authorId)
        }

        // 更新视图
        this.$emit('update-is_followed', !this.isFollowed)
      } catch (err) {
        console.log(err)
        this.$toast.fail('操作失败')
      }

      // 关闭按钮的 loading 状态
      this.followLoading = false
    }
  }
}
</script>

<style>

</style>
