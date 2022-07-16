<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="加载失败，请点击重试"
      @load="onLoad"
    >
      <van-cell
        v-for="(article, index) in list"
        :key="index"
        :title="article.title"
        @click="JumpToArticleDetail(index)"
      />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search'
export default {
  name: 'SearchResult',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      perPage: 20,
      error: false
    }
  },
  methods: {
    async onLoad () {
      try {
        // 1. 请求获取数据
        const { data } = await getSearchResult({
          page: this.page, // 页码
          per_page: this.perPage, // 每页大小
          q: this.searchText // 查询关键词
        })
        // console.log(data)

        // 2. 将数据添加到数组列表中
        const { results } = data.data
        this.list.push(...results)

        // // 模拟随机失败的情况（用于测试错误提示是否配置成功）
        // if (Math.random() > 0.5) {
        //   JSON.parse('dsnajndjsa')// 作用：把一个JSON格式的字符串转成对象，如果JSON字符串不是标准的JSON格式，代码就会报错
        // }

        // 3. 将本次加载中的 loading 关闭
        this.loading = false

        // 4. 判断是否还有数据
        if (results.length) {
          // 如果有，则更新获取下一个数据的页码
          this.page++
        } else {
          // 如果没有，则将加载状态 finished 设置为结束
          this.finished = true
        }
      } catch (err) {
        // 展示加载失败的提示状态
        this.error = true

        // 加载失败了 loading 也要关闭
        this.loading = false
      }
    },
    JumpToArticleDetail (index) {
      const articleId = this.list[index].art_id
      // console.log(articleId)
      this.$router.push('/article/' + articleId)
    }
  }
}
</script>

<style scoped lang="less"></style>
