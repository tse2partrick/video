import Vue from 'vue'
import Router from 'vue-router'
import Movie from 'components/movie/movie'
import Tv from 'components/tv/tv'
import Variety from 'components/variety/variety'
import Cartoon from 'components/cartoon/cartoon'
import Game from 'components/game/game'
import Music from 'components/music/music'
import Doc from 'components/doc/doc'
import TabSetting from 'components/tab-setting/tab-setting'
import News from 'components/news/news'
import Edu from 'components/edu/edu'
import Player from 'components/player/player'
import Personal from 'components/personal/personal'
import SearchResult from 'components/search-result/search-result'
import {localConfig} from 'common/js/config'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: JSON.parse(localStorage.getItem(localConfig.channel)) ? JSON.parse(localStorage.getItem(localConfig.channel))[0].eName : '/movie'
    },
    {
      path: '/movie',
      component: Movie
    },
    {
      path: '/tv',
      component: Tv
    },
    {
      path: '/variety',
      component: Variety
    },
    {
      path: '/cartoon',
      component: Cartoon
    },
    {
      path: '/tab-setting',
      component: TabSetting
    },
    {
      path: '/game',
      component: Game
    },
    {
      path: '/music',
      component: Music
    },
    {
      path: '/doc',
      component: Doc
    },
    {
      path: '/news',
      component: News
    },
    {
      path: '/edu',
      component: Edu
    },
    {
      path: '/player',
      component: Player
    },
    {
      path: '/personal',
      component: Personal
    },
    {
      path: '/search-result',
      component: SearchResult
    }
  ]
})
