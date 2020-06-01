'use strict'

function start (io) {
  io.on('connection', function (socket) {
    console.log('client has connected (socket ID = ' + socket.id + ')')
    socket.on('user_enter', function (user) {
      console.log('user entrou')
    })
  })
}
module.exports  = {
  start
}