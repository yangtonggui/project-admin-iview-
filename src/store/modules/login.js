const login = {
  state: {
    sessionId: sessionStorage.getItem('sessionId'),
    token: sessionStorage.getItem('token'),
    appId:sessionStorage.getItem('appId'),
    name:sessionStorage.getItem('name'),
  },
  mutations: {
    SET_SESSONID: (state, sessionId) => {
      state.sessionId = sessionId
      sessionStorage.setItem('sessionId',sessionId)
    },
    SET_TOKEN: (state, token) => {
      state.token = token
      sessionStorage.setItem('token',token)
    },
    SET_APPID: (state, appId) => {
      state.appId = appId
      sessionStorage.setItem('appId',appId)
    },
    SET_NAME: (state, name) => {
      state.name = name
      sessionStorage.setItem('name',name)
    },
  },
  actions: {
    saveSessionId({ commit }, sessionId) {
      commit('SET_SESSONID', sessionId)
    },
    saveToken({ commit }, token) {
      commit('SET_TOKEN', token)
    },
    saveAppId({ commit }, appId) {
      commit('SET_APPID', appId)
    },
    saveName({ commit }, name) {
      commit('SET_NAME', name)
    },

  }
}

export default login
