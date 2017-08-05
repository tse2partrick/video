<template>
  <div class="sure-box-wrapper" @click="clickBlank">
    <div class="sure-box">
      <div class="title">{{title}}</div>
      <div class="btn-group">
        <div class="btn-sure" @click.stop="goSure">确定</div>
        <div class="btn-cancel" @click.stop="goCancel">取消</div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
  export default {
    props: {
      title: {
        type: String,
        default: '您确定要删除么？'
      }
    },
    methods: {
      goSure() {
        this.$emit('sure')
      },
      goCancel() {
        this.$emit('cancel')
      },
      clickBlank() {
        this.$emit('clickBlank')
      }
    }
  }
</script>

<style type="text/css" lang="stylus">
  @import "~common/stylus/variable"
  .sure-box-wrapper
    position: fixed
    display: flex
    top: 0
    bottom: 0
    left: 0
    right: 0
    .sure-box
      position: relative
      margin: auto
      width: 80%
      border: 1px solid #fff
      border-radius: 5px
      padding: 10px
      box-sizing: border-box
      color: #FFF
      background: $color-sub-theme
      .title
        text-align: center
        font-size: 18px
      .btn-group
        text-align: center
        font-size: 15px
        box-sizing: border-box
        padding: 20px 0 10px 0
        .btn-sure, .btn-cancel
          display: inline-block
          border: 1px solid #fff
          border-radius: 5px
          padding: 10px
          margin: 0 10px
</style>