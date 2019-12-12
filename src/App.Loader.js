/*
 * @Author: Caven
 * @Date: 2019-09-05 20:37:22
 * @Last Modified by: Caven
 * @Last Modified time: 2019-11-08 11:41:49
 */
import Vue from 'vue'
import 'iview/dist/styles/iview.css'
import iView from 'iview'

Vue.use(iView)

const hub = new Vue()

class AppLoader {
  constructor() {
    Vue.config.productionTip = false
    Vue.use({
      install(Vue, options) {
        Vue.prototype.$hub = hub
      }
    })
  }

  install() {
    return Promise.all([import('@/components'), import('@/loader/HttpLoader')])
  }
}

const loader = new AppLoader()
export default loader
