/*
 * @Author: Caven
 * @Date: 2019-11-08 10:55:31
 * @Last Modified by: Caven
 * @Last Modified time: 2019-11-08 14:06:57
 */
import Vue from 'vue'
import appLoader from './App.Loader'
;(async () => {
  let loaders = await appLoader.install()
  for (let i = 0; i < loaders.length; i++) {
    let loader = loaders[i].default
    if (!loader || !loader.load) continue
    await loader.load()
  }
  global.Http.get('config/config.json')
    .then(response => {
      global.config = response.data
      global.Http.defaults['baseURL'] = global.config.url.base
      Promise.all([import('./App.vue'), import('./router'), import('./store')]).then(
        ([{ default: App }, { default: router }, { default: store }]) => {
          router.beforeEach((to, from, next) => {
       
            if (to.path === '/login') {
              next()
            }
            if (store.getters.sessionId && store.getters.token) {
              next()
            } else {
              next('/login')
            }
          })
          new Vue({
            router,
            store,
            render: h => h(App)
          }).$mount('#app')
        }
      )
    })
    .catch(e => {})
})()
