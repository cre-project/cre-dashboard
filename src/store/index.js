import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
import packages from './packages'
import properties from './properties'
import propertyUnits from './propertyUnits'
import soldProperties from './soldProperties'
import os from './os'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    properties,
    packages,
    os,
    propertyUnits,
    soldProperties
  }
})
