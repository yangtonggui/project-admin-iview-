const menu = {
  state: {
    menuList: sessionStorage.getItem('menuList') ? JSON.parse(sessionStorage.getItem('menuList')) : []
  },
  mutations: {
    SET_MENU: (state, menuList) => {
      state.menuList = menuList
      sessionStorage.setItem('menuList', JSON.stringify(menuList))
    }
  },
  actions: {
    saveMenu({ commit }, menuList) {
      commit('SET_MENU', menuList)
    }
  }
}

export default menu

