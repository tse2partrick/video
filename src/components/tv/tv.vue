<template>
  <div class="tv">
    <v-menu :menu="menu" :v-data="vData" @needFilter="onNeedFilter"></v-menu>
  </div>
</template>

<script type="text/javascript">
  import {getTvMenu, getTv} from 'api/tv'
  import {RES_OK} from 'common/js/config'
  import {menuMixin} from 'common/js/mixins'
  import VMenu from 'components/v-menu/v-menu'
  export default {
    mixins: [menuMixin],
    data() {
      return {
        menu: [],
        vData: [],
        kindId: '',
        areaId: '',
        chargeId: ''
      }
    },
    created() {
      this._getTvMenu()
    },
    methods: {
      onNeedFilter(id, type) {
        switch (type) {
          case 'kind':
            this.kindId = id
            break
          case 'area':
            this.areaId = id
            break
          case 'charge':
            this.chargeId = id
            break
          default:
            break
        }

        this._getTv(this.kindId, this.areaId, this.chargeId)
      },
      _getTv(kindId, areaId, chargeId) {
        getTv(kindId, areaId, chargeId).then((res) => {
          if (res.code === RES_OK) {
            this.vData = res.data
          }
        })
      },
      _getTvMenu() {
        getTvMenu().then((res) => {
          if (res.code === RES_OK) {
            this.menu = this._simplizeMenu(res.data.filterItems)
            this.kindId = this.menu[0][0].id
          }
        })
      }
    },
    watch: {
      menu() {
        this.$nextTick(() => {
          this._getTv(this.kindId, this.areaId, this.chargeId)
        })
      }
    },
    components: {
      VMenu
    }
  }
</script>

<style type="text/css" lang="stylus"></style>