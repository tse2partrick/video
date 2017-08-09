var express = require('express')
var config = require('./config/index')

var app = express()
var port = process.env.PORT || config.build.port

app.use(express.static('./dist'))

module.exports = app.listen(port, function(err) {
  if (err) {
    console.log(err)
    return
  }

  console.log('video server listening on port ' + port)
})

