<template>
  <div id="app">
    <v-header></v-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import VHeader from 'components/v-header/v-header'
  import Tab from 'components/tab/tab'
  export default {
    computed: {
      ...mapGetters([
        'needResetPage'
      ])
    },
    created() {
      this._getSize()
    },
    methods: {
      _getSize() {
        let pageWidth = document.body.clientWidth
        let srcFontSize = 100
        let srcPageWidth = 375
        let fontSize = srcFontSize / srcPageWidth * pageWidth
        document.getElementsByTagName('html')[0].style.fontSize = fontSize + 'px'
      }
    },
    watch: {
      needResetPage() {
        this._getSize()
      }
    },
    components: {
      VHeader,
      Tab
    }
  }
</script>

<style lang="stylus">
</style>
