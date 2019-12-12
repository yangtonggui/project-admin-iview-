/*
 * @Author: Caven
 * @Date: 2019-11-08 11:01:31
 * @Last Modified by: Caven
 * @Last Modified time: 2019-11-08 11:09:21
 */
import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import login from './modules/login'
import user from './modules/user'
import menu from './modules/menu'

Vue.use(Vuex)

export default new Vuex.Store({
  getters,
  modules: {
    login,
    user,
    menu
  }
})
