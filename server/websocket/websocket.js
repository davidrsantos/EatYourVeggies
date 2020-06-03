'use strict'

var LoggedUsers = require('./loggedusers.js')

let loggedUsers = new LoggedUsers()

function start (io) {
  io.on('connection', function (socket) {
    console.log('client has connected (socket ID = ' + socket.id + ')')
    socket.on('user_enter', function (user) {
      if (user !== undefined && user !== null) {
        socket.join('type_' + user.type)
        loggedUsers.addUserInfo(user, socket.id)
        let userInfo = loggedUsers.userInfoByPublicKey(user.publicKey)
        console.log('Entrou  user : ' + userInfo.user.name)

      }
    })
    socket.on('user_exit', function (user) {
      if (user !== undefined && user !== null) {
        socket.leave('type_' + user.type)
        loggedUsers.removeUserInfoByPublicKey(user.publicKey)
      }
    })

    socket.on('mostra', function () {

      console.log(loggedUsers.users)
    })
  })
}

module.exports = {
  start
}