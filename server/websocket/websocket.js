'use strict'

var LoggedUsers = require('./loggedusers.js')

let loggedUsers = new LoggedUsers()

function start (io) {
  io.on('connection', function (socket) {
    console.log('client has connected (socket ID = ' + socket.id + ')')
    socket.on('user_enter', function (user) {
      if (user !== undefined && user !== null) {
        socket.join('role_' + user.role)
        loggedUsers.addUserInfo(user, socket.id)
        let userInfo = loggedUsers.userInfoByPublicKey(user.publicKey)
        console.log('Entrou  user : ' + userInfo.user.name)
        socket.to(userInfo.socketID).emit('newUser')
      }
    })
    socket.on('user_exit', function (user) {
      if (user !== undefined && user !== null) {
        socket.leave('role_' + user.role)
        loggedUsers.removeUserInfoByPublicKey(user.publicKey)
      }
    })

    socket.on('newUser', function (user) {

      console.log('vou dizer ao admin!!')
      socket.to('role_admin').emit('newUser',user)
    })

    socket.on('newProposal', function (proposal) {


      let userInfo = loggedUsers.userInfoByPublicKey(proposal.toPublicKey)
      if(userInfo){
        socket.to(userInfo.socketID).emit('newProposal',proposal)
      }
    })
  })
}

module.exports = {
  start
}