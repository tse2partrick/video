let style = document.createElement('div').style
let vendor = (function() {
  let el = {
    webkit: 'webkitTransform',
    moz: 'MozTransform',
    o: 'OTransform',
    ms: 'MsTransform',
    standard: 'transform'
  }

  for (let i in el) {
    if (style[el[i]] !== undefined) {
      return i
    }
  }

  return false
})()

export function prefixStyle(el) {
  if (!vendor) {
    return false
  }

  if (vendor === 'standard') {
    return el
  }

  return vendor + el.charAt(0).toUpperCase() + el.slice(1)
}

export function isMobile() {
  if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
    return true
  }

  return false
}

export function scrollX(outerTab, insideBox) {
  let tab = outerTab
  let box = insideBox
  let tabWidth = tab.clientWidth

  // 初始化insideBox的长度 = 其下子元素的长度之和
  let boxWidth = 0
  for (let i = 0; i < box.children.length; i++) {
    boxWidth += box.children[i].clientWidth
  }
  box.style.width = boxWidth + 'px'

  // 判断是否需要移动
  if (tabWidth >= boxWidth) {
    return
  }

  let touch = {}
  let startOffsetLeft
  let maxLeft = 0
  let maxRight = -(boxWidth - tabWidth)
  let speed = 5
  let isMouseDown

  // PC端移动
  box.addEventListener('mousedown', (e) => {
    isMouseDown = true
    box.style.transition = ''
    touch.x1 = e.pageX
    startOffsetLeft = box.getBoundingClientRect().left
  })
  box.addEventListener('mousemove', (e) => {
    if (!isMouseDown) {
      return
    }
    e.preventDefault()
    // 得到移动距离
    touch.x2 = e.pageX
    touch.deltaX = touch.x2 - touch.x1 + startOffsetLeft - tab.getBoundingClientRect().left

    // 如果超过起始 0 的情况
    if (touch.deltaX > maxLeft) {
      touch.deltaX /= speed
    }

    // 如果超过末尾长度的情况
    if (touch.deltaX < maxRight) {
      touch.deltaX = (touch.deltaX - maxRight) / speed + maxRight
    }
    box.style.transform = 'translate3d(' + touch.deltaX + 'px, 0, 0)'
  })
  window.addEventListener('mouseup', (e) => {
    var move
    box.style.transition = '0.2s ease-in-out'
    if (touch.deltaX > maxLeft) {
      move = maxLeft
    }
    if (touch.deltaX < maxRight) {
      move = maxRight
    }
    box.style.transform = 'translate3d(' + move + 'px, 0, 0)'
    isMouseDown = false
  })

  // 移动端移动
  box.addEventListener('touchstart', function(e) {
    box.style.transition = ''
    touch.x1 = e.touches[0].pageX
    startOffsetLeft = box.getBoundingClientRect().left
  })
  box.addEventListener('touchmove', function(e) {
    e.preventDefault()
    // 得到移动距离
    touch.x2 = e.touches[0].pageX
    touch.deltaX = touch.x2 - touch.x1 + startOffsetLeft - tab.getBoundingClientRect().left

    // 如果超过起始 0 的情况
    if (touch.deltaX > maxLeft) {
      touch.deltaX /= speed
    }

    // 如果超过末尾长度的情况
    if (touch.deltaX < maxRight) {
      touch.deltaX = (touch.deltaX - maxRight) / speed + maxRight
    }
    box.style.transform = 'translate3d(' + touch.deltaX + 'px, 0, 0)'
  })

  window.addEventListener('touchend', function(e) {
    var move
    box.style.transition = '0.2s ease-in-out'
    if (touch.deltaX > maxLeft) {
      move = maxLeft
    }
    if (touch.deltaX < maxRight) {
      move = maxRight
    }
    box.style.transform = 'translate3d(' + move + 'px, 0, 0)'
  })
}

export function sequence(arr, oldIndex, newIndex) {
  let _arr = arr.slice()

  if (oldIndex < newIndex) {
    _arr.splice(newIndex + 1, 0, _arr[oldIndex])
    _arr.splice(oldIndex, 1)
  }
  if (oldIndex > newIndex) {
    _arr.splice(newIndex, 0, _arr[oldIndex])
    _arr.splice(oldIndex + 1, 1)
  }

  return _arr
}

export function addClass(el, cls) {
  if (hasClass(el, cls)) {
    return
  }
  let classArr = el.className.split(' ')
  classArr.push(cls)

  el.className = classArr.join(' ')
}

export function hasClass(el, cls) {
  let classArr = el.className.split(' ')
  let index = classArr.findIndex((i) => {
    return i === cls
  })

  if (index !== -1) {
    return true
  } else {
    return false
  }
}

export function removeClass(el, cls) {
  if (!hasClass(el, cls)) {
    return
  }

  let classArr = el.className.split(' ')
  let index = classArr.findIndex((i) => {
    return i === cls
  })

  classArr.splice(index, 1)

  el.className = classArr.join(' ')
}

export function initBanner(bannerWrapper, banner, dot, options = {
  dotActiveStyle: 'dot-item-active',
  autoPlay: true,
  autoplayTime: 2000,
  transitionTime: 300
}) {
  if (!bannerWrapper || !banner || !dot) {
    return
  }
  // 初始化options
  let dotActiveStyle = options.dotActiveStyle || 'dot-item-active'
  let autoPlay = options.autoPlay || true
  let autoPlayTime = options.autoPlayTime || 2000
  let transitionTime = options.transitionTime || 300
  // 初始化dot监听点击事件
  let currentDotIndex = 0
  let dotItems = Array.from(dot.children)
  dotItems.forEach((i, index) => {
    i.addEventListener('click', () => {
      clickTo(index)
      activeDot(index)
      currentDotIndex = index
    })
  })

  // 初始active dot
  addClass(dotItems[currentDotIndex], dotActiveStyle)
  function activeDot(index) {
    dotItems.forEach((i) => {
      removeClass(i, dotActiveStyle)
    })

    addClass(dotItems[index], dotActiveStyle)
  }

  // 判断是否是移动设备，移动设备不监听mouse事件
  let isMobile = (function() {
    if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
      return true
    }

    return false
  })()

  // 初始化banner长度
  let bannerWidth = 0

  // 克隆第一个和最后一个banner元素
  let copyFirstEl = banner.children[0].cloneNode(true)
  let copyEndEl = banner.children[banner.children.length - 1].cloneNode(true)
  banner.appendChild(copyFirstEl)
  banner.insertBefore(copyEndEl, banner.children[0])

  // 得到所有子元素，开始计算区间、子元素长度 = wrapper长度，banner的总长度
  let bannerItems = Array.from(banner.children)
  let picSection = [0]
  bannerItems.forEach((i) => {
    i.style.width = bannerWrapper.clientWidth + 'px'
    i.style.height = bannerWrapper.clientHeight + 'px'
    bannerWidth += i.clientWidth
    picSection.push(bannerWidth)
  })
  banner.style.width = bannerWidth + 'px'

  // 开始初始化监听和触摸事件
  let touch = {}

  // 移动了多少给在down的时候记录一下
  let startOffsetLeft

  // 防止mousemove没down下就监听事件
  let initMove = false

  // 滑动距离，超过就滑动
  let scrollPercent = bannerWrapper.clientWidth * 0.3

  // 加了2个元素，从1开始计算
  let currentPage = 1

  // 滑动到第一张和最后一张要轮滑的时候要禁止监听事件
  let resetDone = true

  // 是否自动轮播
  let timer

  // 初始在第二个元素，因为首部加了一个克隆元素，其实是第一个元素
  banner.style.transform = `translate3d(${-picSection[currentPage]}px, 0, 0)`

  // 自动播放开始
  if (autoPlay) {
    startAutoPlay()
  }
  function startAutoPlay() {
    if (!autoPlay) {
      return
    }
    if (!timer) {
      timer = setInterval(() => {
        autoPlayFunc()
      }, autoPlayTime)
    }
  }
  function stopAutoPlay() {
    if (!timer) {
      return
    }
    clearInterval(timer)
    timer = null
  }

  // 自动播放函数
  function autoPlayFunc() {
    banner.style.transition = `all ${transitionTime / 1000}s`
    currentDotIndex += 1
    currentPage += 1
    if (currentPage < 0) {
      currentPage = bannerItems.length - 1
    }
    if (currentPage > bannerItems.length - 1) {
      currentPage = 0
    }
    if (currentDotIndex < 0) {
      currentDotIndex = dotItems.length - 1
    }
    if (currentDotIndex > dotItems.length - 1) {
      currentDotIndex = 0
    }
    firstEndMixin()
  }
  function clickTo(pageNum) {
    // 如果自动轮播，等结束后再恢复
    if (autoPlay) {
      stopAutoPlay()
    }
    banner.style.transition = `all ${transitionTime / 1000}s`
    currentPage = parseInt(pageNum + 1)
    if (currentPage < 0) {
      currentPage = bannerItems.length - 1
    }
    if (currentPage > bannerItems.length - 1) {
      currentPage = 0
    }
    firstEndMixin()
  }

  function addClass(el, cls) {
    if (hasClass(el, cls)) {
      return
    }
    let classArr = el.className.split(' ')
    classArr.push(cls)

    el.className = classArr.join(' ')
  }

  function hasClass(el, cls) {
    let classArr = el.className.split(' ')
    let index = classArr.findIndex((i) => {
      return i === cls
    })

    if (index !== -1) {
      return true
    } else {
      return false
    }
  }

  function removeClass(el, cls) {
    if (!hasClass(el, cls)) {
      return
    }

    let classArr = el.className.split(' ')
    let index = classArr.findIndex((i) => {
      return i === cls
    })

    classArr.splice(index, 1)

    el.className = classArr.join(' ')
  }

  // 鼠标滑动事件
  banner.addEventListener('mousedown', (e) => {
    if (isMobile) {
      return
    }
    // 在轮播到克隆元素的时候，如果克隆元素没回复完，禁止滑动
    if (!resetDone) {
      return
    }

    // 滑动开始，禁止自动轮播
    if (autoPlay) {
      stopAutoPlay()
    }
    initMove = true
    touch.x1 = e.pageX
    startOffsetLeft = banner.getBoundingClientRect().left
  })

  banner.addEventListener('mousemove', (e) => {
    if (isMobile) {
      return
    }
    if (!initMove) {
      return
    }
    banner.style.transition = ''
    e.preventDefault()
    touch.x2 = e.pageX

    // 加上内部banner的getBoundingClientRect().left，减去外部bannerWrapper父元素离document的left
    touch.deltaX = touch.x2 - touch.x1 + startOffsetLeft - bannerWrapper.getBoundingClientRect().left
    banner.style.transform = `translate3d(${touch.deltaX}px, 0, 0)`
  })

  window.addEventListener('mouseup', (e) => {
    if (isMobile) {
      return
    }
    if (!touch.x2) {
      initMove = false
      if (autoPlay) {
        startAutoPlay()
      }
      return
    }

    banner.style.transition = `all ${transitionTime / 1000}s`
    initMove = false
    let deltaX = touch.x2 - touch.x1
    if (Math.abs(deltaX) < scrollPercent) {
      banner.style.transform = `translate3d(${-picSection[currentPage]}px, 0, 0)`
      if (autoPlay) {
        startAutoPlay()
      }
      touch.x2 = null
      return
    }
    if (scrollPercent < deltaX) {
      currentDotIndex -= 1
      currentPage -= 1
      if (currentPage < 0) {
        currentPage = bannerItems.length - 1
      }
      if (currentDotIndex < 0) {
        currentDotIndex = dotItems.length - 1
      }
    } else {
      currentDotIndex += 1
      currentPage += 1
      if (currentPage > bannerItems.length - 1) {
        currentPage = 0
      }
      if (currentDotIndex > dotItems.length - 1) {
        currentDotIndex = 0
      }
    }

    touch.x2 = null
    firstEndMixin()
  })

  // 手机触摸事件
  banner.addEventListener('touchstart', (e) => {
    // 在轮播到克隆元素的时候，如果克隆元素没回复完，禁止滑动
    if (!resetDone) {
      return
    }

    // 滑动开始，禁止自动轮播
    if (autoPlay) {
      stopAutoPlay()
    }
    initMove = true
    touch.x1 = e.touches[0].pageX
    startOffsetLeft = banner.getBoundingClientRect().left
  })

  banner.addEventListener('touchmove', (e) => {
    if (!initMove) {
      return
    }
    banner.style.transition = ''
    e.preventDefault()
    touch.x2 = e.touches[0].pageX

    // 加上内部banner的getBoundingClientRect().left，减去外部bannerWrapper父元素离document的left
    touch.deltaX = touch.x2 - touch.x1 + startOffsetLeft - bannerWrapper.getBoundingClientRect().left
    banner.style.transform = `translate3d(${touch.deltaX}px, 0, 0)`
  })

  window.addEventListener('touchend', (e) => {
    if (!touch.x2) {
      initMove = false
      if (autoPlay) {
        startAutoPlay()
      }
      return
    }
    banner.style.transition = `all ${transitionTime / 1000}s`
    initMove = false
    let deltaX = touch.x2 - touch.x1
    if (Math.abs(deltaX) < scrollPercent) {
      banner.style.transform = `translate3d(${-picSection[currentPage]}px, 0, 0)`
      if (autoPlay) {
        startAutoPlay()
      }
      touch.x2 = null
      return
    }
    if (scrollPercent < deltaX) {
      currentDotIndex -= 1
      currentPage -= 1
      if (currentPage < 0) {
        currentPage = bannerItems.length - 1
      }
      if (currentDotIndex < 0) {
        currentDotIndex = dotItems.length - 1
      }
    } else {
      currentDotIndex += 1
      currentPage += 1
      if (currentPage > bannerItems.length - 1) {
        currentPage = 0
      }
      if (currentDotIndex > dotItems.length - 1) {
        currentDotIndex = 0
      }
    }

    touch.x2 = null
    firstEndMixin()
  })

  function firstEndMixin() {
    if (currentPage === 0) {
      resetDone = false
      setTimeout(() => {
        currentPage = bannerItems.length - 2
        banner.style.transition = ''
        banner.style.transform = `translate3d(${-picSection[currentPage]}px, 0, 0)`
        resetDone = true
      }, transitionTime)
    }
    if (currentPage === bannerItems.length - 1) {
      resetDone = false
      setTimeout(() => {
        currentPage = 1
        banner.style.transition = ''
        banner.style.transform = `translate3d(${-picSection[currentPage]}px, 0, 0)`
        resetDone = true
      }, transitionTime)
    }
    banner.style.transform = `translate3d(${-picSection[currentPage]}px, 0, 0)`

    activeDot(currentDotIndex)

    // 结束后回复自动轮播
    if (autoPlay) {
      startAutoPlay()
    }
  }
}

export function scrollY(outerTab, insideBox) {
  var tab = outerTab
  var box = insideBox
  var tabWidth = tab.clientHeight

  // 初始化insideBox的长度 = 其下子元素的长度之和
  var boxWidth = 0
  for (var i = 0; i < box.children.length; i++) {
    boxWidth += box.children[i].clientHeight
  }
  box.style.height = boxWidth + 'px'

  // 判断是否需要移动
  if (tabWidth >= boxWidth) {
    return
  }

  var touch = {}
  var startOffsetLeft
  var maxLeft = 0
  var maxRight = -(boxWidth - tabWidth)
  var speed = 5
  var isMouseDown

  // PC端移动
  box.addEventListener('mousedown', (e) => {
    isMouseDown = true
    box.style.transition = ''
    touch.x1 = e.pageY
    startOffsetLeft = box.getBoundingClientRect().top
  })
  box.addEventListener('mousemove', (e) => {
    if (!isMouseDown) {
      return
    }
    e.preventDefault()
    // 得到移动距离
    touch.x2 = e.pageY
    touch.deltaX = touch.x2 - touch.x1 + startOffsetLeft - tab.getBoundingClientRect().top

    // 如果超过起始 0 的情况
    if (touch.deltaX > maxLeft) {
      touch.deltaX /= speed
    }

    // 如果超过末尾长度的情况
    if (touch.deltaX < maxRight) {
      touch.deltaX = (touch.deltaX - maxRight) / speed + maxRight
    }
    box.style.transform = 'translate3d(0, ' + touch.deltaX + 'px, 0)'
  })
  window.addEventListener('mouseup', (e) => {
    var move
    box.style.transition = '0.2s ease-in-out'
    if (touch.deltaX > maxLeft) {
      move = maxLeft
    }
    if (touch.deltaX < maxRight) {
      move = maxRight
    }
    box.style.transform = 'translate3d(0, ' + move + 'px, 0)'
    isMouseDown = false
  })

  // 移动端移动
  box.addEventListener('touchstart', function(e) {
    box.style.transition = ''
    touch.x1 = e.touches[0].pageY
    startOffsetLeft = box.getBoundingClientRect().top
  })
  box.addEventListener('touchmove', function(e) {
    e.preventDefault()
    // 得到移动距离
    touch.x2 = e.touches[0].pageY
    touch.deltaX = touch.x2 - touch.x1 + startOffsetLeft - tab.getBoundingClientRect().top

    // 如果超过起始 0 的情况
    if (touch.deltaX > maxLeft) {
      touch.deltaX /= speed
    }

    // 如果超过末尾长度的情况
    if (touch.deltaX < maxRight) {
      touch.deltaX = (touch.deltaX - maxRight) / speed + maxRight
    }
    box.style.transform = 'translate3d(0, ' + touch.deltaX + 'px, 0)'
  })

  window.addEventListener('touchend', function(e) {
    var move
    box.style.transition = '0.2s ease-in-out'
    if (touch.deltaX > maxLeft) {
      move = maxLeft
    }
    if (touch.deltaX < maxRight) {
      move = maxRight
    }
    box.style.transform = 'translate3d(0, ' + move + 'px, 0)'
  })
}