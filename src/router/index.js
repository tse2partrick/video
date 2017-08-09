import Vue from 'vue'
import Router from 'vue-router'
import {localConfig} from 'common/js/config'

const Movie = (resolve) => {
  import('components/movie/movie').then((module) => {
    resolve(module)
  })
}

const Tv = (resolve) => {
  import('components/tv/tv').then((module) => {
    resolve(module)
  })
}

const Variety = (resolve) => {
  import('components/variety/variety').then((module) => {
    resolve(module)
  })
}

const Cartoon = (resolve) => {
  import('components/cartoon/cartoon').then((module) => {
    resolve(module)
  })
}

const Game = (resolve) => {
  import('components/game/game').then((module) => {
    resolve(module)
  })
}

const Music = (resolve) => {
  import('components/music/music').then((module) => {
    resolve(module)
  })
}

const Doc = (resolve) => {
  import('components/doc/doc').then((module) => {
    resolve(module)
  })
}

const News = (resolve) => {
  import('components/news/news').then((module) => {
    resolve(module)
  })
}

const Edu = (resolve) => {
  import('components/edu/edu').then((module) => {
    resolve(module)
  })
}

const Player = (resolve) => {
  import('components/player/player').then((module) => {
    resolve(module)
  })
}
const TabSetting = (resolve) => {
  import('components/tab-setting/tab-setting').then((module) => {
    resolve(module)
  })
}
const Personal = (resolve) => {
  import('components/personal/personal').then((module) => {
    resolve(module)
  })
}

const SearchResult = (resolve) => {
  import('components/search-result/search-result').then((module) => {
    resolve(module)
  })
}

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
