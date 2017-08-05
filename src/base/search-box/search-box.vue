<template>
  <div class="search-box">
    <input class="box" @click="onFocus" ref="searchBox" />
    <span class='title'>搜索</span>
  </div>
</template>

<script type="text/javascript">
  export default {
    methods: {
      onFocus() {
        this.$refs.searchBox.focus()
      }
    }
  }
</script>

<style type="text/css" lang="stylus" scoped>
  @import "~common/stylus/variable.styl"
  .search-box
    position: relative
    display: inline-block
    font-size: 150px
    .box
      border: none
      border-radius: 5px
      padding: 100px
      outline: red
      color: red
    .title
      display: inline-block
      width: 300px
      text-align: center
      border: 1px solid #eee
      padding: 5px
      border-radius: 5px
</style>