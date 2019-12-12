/*
 * @Author: Caven
 * @Date: 2019-11-08 11:09:17
 * @Last Modified by: Caven
 * @Last Modified time: 2019-11-08 11:49:56
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views'
import Login from '../views/login'
import Users from '../views/users'
import Departments from '../views/departments'
import Roles from '../views/roles'
import Applications from '../views/applications'
import Resources from '../views/resources'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    children: []
  },
  {
    path: '/',
    name: 'home',
    component: Index,
    children: [
      {
        path: '/user',
        name: 'user',
        component: Users
      },

      {
        path: '/department',
        name: 'department',
        component: Departments
      },
      {
        path: '/role',
        name: 'role',
        component: Roles
      },
      {
        path: '/app',
        name: 'app',
        component: Applications
      },
      {
        path: '/permission',
        name: 'resources',
        component: Resources
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
