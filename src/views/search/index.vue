<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <!-- Tips: 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮。 -->
    <!-- show-action显示右边的取消按钮，点击这个按钮可以触发onCancel事件 -->
    <!-- 电脑上在搜索框回车/手机上点击键盘的"搜索"按钮可以触发onSearch事件 -->
    <!-- search事件：确定搜索时触发；value: string (当前输入的值) -->
    <form class="search-form" action="/">
        <van-search
            v-model="searchText"
            show-action
            placeholder="请输入搜索关键词"
            background="#3296fa"
            @search="onSearch"
            @cancel="onCancel"
            @focus="isResultShow = false"
        />
    </form>
    <!-- /搜索栏 -->

    <!-- 搜索结果 -->
        <search-result
        v-if="isResultShow"
        :search-text="searchText"
        />
    <!-- /搜索结果 -->

    <!-- 联想建议 -->
        <search-suggestion
        v-else-if="searchText"
        :search-text="searchText"
        @search="onSearch"
        />
    <!-- /联想建议 -->

    <!-- 搜索历史记录 -->
        <search-history
        v-else
        :search-histories="searchHistories"
        @clear-search-histories="searchHistories = []"
        @search="onSearch"
        />
    <!-- /搜索历史记录 -->
  </div>
</template>

<script>
import SearchHistory from './components/search-history'
import SearchSuggestion from './components/search-suggestion'
import SearchResult from './components/search-result'
import { setItem, getItem } from '@/utils/storage'
export default {
  name: 'SearchIndex',
  data () {
    return {
      searchText: '',
      isResultShow: false, // 控制搜索结果的展示
      searchHistories: getItem('TOUTIAO_SEARCH_HISTORIES') || [] // 搜索的历史记录数据
    }
  },
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult
  },
  watch: {
    searchHistories (value) {
      setItem('TOUTIAO_SEARCH_HISTORIES', value)
    }
    // searchHistories: {
    //   handler () {}
    // }
  },
  methods: {
    onSearch (val) {
      // 将在联想建议点击选中的内容赋值给搜索框
      this.searchText = val
      // console.log(val)

      // 存储搜索历史记录
      // 要求：不要有重复历史记录、最新的排在最前面
      const index = this.searchHistories.indexOf(val)
      if (index !== -1) { // 保证当搜索内容重复时，将原来重复的内容从数组里删掉，再将新内容unshift插在最前面
        this.searchHistories.splice(index, 1)
      }
      // 将最新的历史记录排在最前面
      this.searchHistories.unshift(val)

      // 渲染搜索结果
      this.isResultShow = true
    },
    onCancel () {
      this.$router.back()
    }
  }
}
</script>

<style scoped lang="less">
.search-container{
  padding-top: 55px;
    .van-search__action{
        color: #fff;
    }
  .search-form {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
