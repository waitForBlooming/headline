<template>
    <!-- value ? 'star' : 'star-o'
    如果value为true,即is_collected为真，则显示实心黄色收藏图标，否则显示空心图标
     -->
    <van-button
    :icon="value ? 'star' : 'star-o'"
    :class="{
      collected: value
    }"
    :loading="loading"
    @click="onCollect"
    />
</template>

<script>
import { addCollect, deleteCollect } from '@/api/article'
export default {
  name: 'CollectArticle',
  props: {
    value: {
      type: Boolean,
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async onCollect () {
    // 这里 loading 不仅仅是为了交互提示，更重要的是请求期间禁用背景点击功能，防止用户不断的操作界面发出请求
      this.loading = true
      try {
        if (this.value) {
        // 已收藏，取消收藏
          await deleteCollect(this.articleId)
        } else {
        // 没有收藏，添加收藏
          await addCollect(this.articleId)
        }

        // 更新视图
        // 自定义事件修改数据并不是立即的
        this.$emit('input', !this.value)

        this.$toast.success(!this.value ? '收藏成功' : '取消收藏')
      } catch (err) {
        this.$toast.fail('操作失败，请重试！')
      }
      this.loading = false
    }
  }
}
</script>

<style scoped lang="less">
.collected {
  .van-icon {
    color: #ffa500;
  }
}
</style>
