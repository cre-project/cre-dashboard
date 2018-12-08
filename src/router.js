import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import NotFound from './views/NotFound.vue'

Vue.use(Router)

export const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/NotFound.vue')
    },
    // default
    {
      path: '*',
      component: NotFound
    }
  ]
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/']
  const authRequired = !publicPages.includes(to.path)
  const loggedIn = localStorage.getItem('cre-user')

  if (authRequired && !loggedIn) {
    return next('/login')
  }

  next()
})
