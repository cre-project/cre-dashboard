import Vue from 'vue'
import Router from 'vue-router'
import store from './store'

/** Routing */

Vue.use(Router)

export const routes = [
  {
    path: '/login',
    name: 'Login',
    meta: { layout: 'full-page' },
    component: () => import('@/views/Login')
  },
  {
    path: '/password-reset/:token',
    name: 'Password Reset',
    meta: { layout: 'full-page' },
    component: () => import('@/views/PasswordReset')
  },
  {
    path: '/password-reset',
    name: 'Request Password Reset',
    meta: { layout: 'full-page' },
    component: () => import('@/views/PasswordReset')
  },
  {
    path: '/activate/:customer_id',
    name: 'Account Setup',
    meta: { layout: 'full-page' },
    component: () => import('@/views/AccountActivation')
  },
  {
    path: '/',
    name: 'Valuations',
    meta: { layout: 'dashboard', requiresAuth: true },
    component: () => import('@/views/Dashboard')
  },
  {
    path: '/package/:id/property-info',
    name: 'Property Info',
    meta: { layout: 'default', requiresAuth: true, isNav: true },
    component: () => import('@/views/PropertyInfo')
  },
  {
    path: '/package/:id/unit-mix',
    name: 'Unit Mix',
    meta: { layout: 'default', requiresAuth: true, isNav: true },
    component: () => import('@/views/PropertyUnits')
  },
  {
    path: '/package/:id/operating-statement',
    name: 'Operating Statement',
    meta: { layout: 'default', requiresAuth: true, isNav: true },
    component: () => import('@/views/OperatingStatement')
  },
  {
    path: '/package/:id/sales-comparables',
    name: 'Sales Comparables',
    meta: { layout: 'default', requiresAuth: true, isNav: true },
    component: () => import('@/views/SoldProperties')
  },
  {
    path: '/package/:id/rent-comparables',
    name: 'Rent Comparables',
    meta: { layout: 'default', requiresAuth: true, isNav: true },
    component: () => import('@/views/RentedUnits')
  },
  {
    path: '/package/:id/preview',
    name: 'Preview',
    meta: { layout: 'default', requiresAuth: true, isNav: true },
    component: () => import('@/views/Preview')
  },
  {
    path: '/user-settings',
    name: 'User Settings',
    meta: { layout: 'settings', requiresAuth: true },
    component: () => import('@/views/UserSettings')
  },
  {
    path: '/company-settings',
    name: 'Company Settings',
    meta: { layout: 'settings', requiresAuth: true },
    component: () => import('@/views/CompanySettings')
  },
  {
    path: '/billing',
    name: 'Billing and Subscription',
    meta: { layout: 'settings', requiresAuth: true },
    component: () => import('@/views/BillingSettings')
  },
  {
    path: '*',
    meta: { layout: 'full-page', requiresAuth: false },
    component: () => import('@/views/NotFound')
  }
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  // component: () => import(/* webpackChunkName: "about" */ './views/Dashboard.vue')
]

const publicPages = routes.filter(route => !route.meta || !route.meta.requiresAuth).map(r => r.path)
publicPages.push('/activate')

function authRequired (path) {
  let res = true
  publicPages.forEach(p => {
    if (path.startsWith(p)) {
      res = false
    }
  })
  return res
}

export const router = new Router({ routes })

router.beforeEach((to, from, next) => {
  const isPublicPage = publicPages.includes(to.path) || !authRequired(to.path)
  const loggedIn = localStorage.creAuthToken

  if (loggedIn) {
    store.dispatch('user/init')
  }

  if (!isPublicPage && !loggedIn) {
    return next('/login')
  } else if (loggedIn && to.path === '/login') {
    return next('/')
  }

  next()
})
