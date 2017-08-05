<template>
  <div class="music">
    <sec-menu :v-banner="vBanner" :v-data="vData" @goSubChannel='onGoSubChannel'></sec-menu>
  </div>
</template>

<script type="text/javascript">
  import {getMusicData, getSubMusicData} from 'api/music'
  import {RES_OK} from 'common/js/config'
  import {secMenuMixin} from 'common/js/mixins'
  import SecMenu from 'components/sec-menu/sec-menu'
  export default {
    mixins: [secMenuMixin],
    data() {
      return {
        vData: [],
        vBanner: []
      }
    },
    created() {
      this._getMusicData()
    },
    methods: {
      onGoSubChannel(jumpId) {
        getSubMusicData(jumpId).then((res) => {
          if (res.code === RES_OK) {
            let {banner, ret} = this._simplizeData(res.data)
            this.vData = ret
            this.vBanner = banner
          }
        })
      },
      _getMusicData() {
        getMusicData().then((res) => {
          if (res.code === RES_OK) {
            let {banner, ret} = this._simplizeData(res.data)
            this.vBanner = banner
            this.vData = ret
          }
        })
      }
    },
    components: {
      SecMenu
    }
  }
</script>

<style type="text/css"></style>