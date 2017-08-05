<template>
  <div class="loading">
    <div class="wrapper">
      <div class="image">
        <img width="36" height="36" src="./loading.gif">
      </div>
      <div class="title">{{title}}</div>
    </div>
  </div>
</template>

<script type="text/javascript">
  export default {
    props: {
      title: {
        type: String,
        default: 'Loading...'
      }
    }
  }
</script>

<style type="text/css" lang="stylus">
  .loading
    position: absolute
    display: flex
    top: 0
    left: 0
    width: 100%
    height: 100%
    color: #000
    .wrapper
      margin: auto
</style>