import originJsonp from 'jsonp'

export function jsonp(url, data, options) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)

  return new Promise((resolve, reject) => {
    originJsonp(url, options, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

function param(data) {
  let ret = ''

  for (let key in data) {
    let value = data[key]
    if (value === undefined || value === '') {
      continue
    }

    ret += '&' + key + '=' + encodeURIComponent(value)
  }

  return ret ? ret.substring(1) : ''
}