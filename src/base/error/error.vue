<template>
  <div class="error">
    <span class="title">{{errorTitle}}</span>
  </div>
</template>

<script type="text/javascript">
  export default {
    props: {
      errorTitle: {
        type: String,
        default: '好像出现了一些问题，请等待2 - 3分钟试试。。。'
      }
    }
  }
</script>

<style type="text/css" lang="stylus">
  .error
    position: absolute
    display: flex
    top: 0
    left: 0
    bottom: 0
    right: 0
    width: 100%
    height: 100%
    z-index: -10
    .title
      margin: auto
</style>