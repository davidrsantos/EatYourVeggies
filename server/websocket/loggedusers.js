/*jshint esversion: 6 */

class LoggedUsers {

  constructor () {
    this._users = new Map()
  }

  userInfoByPublicKey (userPublicKey) {
    return this._users.get(userPublicKey)
  }

  userInfoBySocketID (socketID) {
    for (var [userPublicKey, userInfo] of this._users) {
      if (userInfo.socketID == socketID) {
        return userInfo
      }
    }
    return null
  }

  addUserInfo (user, socketID) {
    let userInfo = { user: user, socketID: socketID }
    this._users.set(user.publicKey, userInfo)
    return userInfo
  }

  removeUserInfoByPublicKey (userPublicKey) {
    let userInfo = this.userInfoByPublicKey(userPublicKey)
    if (userInfo === null) {
      return null
    }
    let cloneUserInfo = Object.assign({}, userInfo)
    this._users.delete(userPublicKey)
    return cloneUserInfo
  }

  removeUserInfoBySocketID (socketID) {
    let userInfo = this.userInfoBySocketID(socketID)
    if (userInfo === null) {
      return null
    }
    let cloneUserInfo = Object.assign({}, userInfo)
    this._users.delete(userInfo.user.publicKey)
    return cloneUserInfo
  }
}

module.exports = LoggedUsers
