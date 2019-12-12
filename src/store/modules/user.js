const user = {
  state: {
    userInfo: {}
  },
  mutations: {
    SET_USER: (state, userInfo) => {
      state.userInfo = userInfo
    }
  },
  actions: {
    saveUserInfo({ commit }, userInfo) {
      commit('SET_USER', userInfo)
    }
  }
}

export default user
