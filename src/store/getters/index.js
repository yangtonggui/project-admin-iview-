const getters = {
  userInfo: state => state.user.userInfo,
  menuList: state => state.menu.menuList,
  sessionId: state => state.login.sessionId,
  token: state => state.login.token,
  appId: state => state.login.appId
}

export default getters
