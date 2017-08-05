<template>
  <div class="base-header">
    <div class="back-wrapper" @click="goBack" v-show="backFlag">
      <span class="iBack">返</span>
    </div>
    <p class="title" v-html="title"></p>
    <div class="self-methods">
      <span class="iMethod" @click="selfMethod || nullSelfMethod" v-html="selfMethodTitle">方</span>
    </div>
  </div>
</template>

<script type="text/javascript">
  export default {
    props: {
      title: {
        type: String,
        default: '标题'
      },
      selfMethod: {
        type: Function,
        default: null
      },
      selfMethodTitle: {
        type: String,
        default: '方'
      }
    },
    data() {
      return {
        backFlag: true
      }
    },
    methods: {
      goBack() {
        this.$router.go(-1)
      },
      hideBack() {
        this.backFlag = false
      },
      showBack() {
        this.backFlag = true
      },
      nullSelfMethod() {
        return
      }
    }
  }
</script>

<style type="text/css" lang="stylus">
  @import "~common/stylus/variable"
  .base-header
    position: relative
    top: 0
    left: 0
    width: 100%
    height: $base-header-height
    background: blue
    font-size: 15px
    .back-wrapper
      position: absolute
      left: 0
      display: flex
      width: 60px
      height: 100%
      .iBack
        margin: auto
    .title
      display: inline-block
      width: 100%
      height: 50px
      line-height: 50px
      text-align: center
    .self-methods
      position: absolute
      top: 0
      right: 0
      display: flex
      width: 60px
      height: 100%
      float: right
      .iMethod
        margin: auto
</style>