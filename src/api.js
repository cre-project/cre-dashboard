import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.VUE_APP_BASE_API_URL,
  timeout: 5000
})

instance.interceptors.request.use(
  (config) => {
    const savedToken = window.localStorage.getItem('creAuthToken')

    if (savedToken) {
      config.headers['Authorization'] = `Bearer ${savedToken}`
    }

    return config
  },

  (error) => {
    return Promise.reject(error)
  }
)

export default instance
