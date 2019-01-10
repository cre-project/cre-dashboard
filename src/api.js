import axios from 'axios'

let config = {
  baseURL: 'https://cre-backend-testing.herokuapp.com/api',
  timeout: 5000
}
const savedToken = window.localStorage.getItem('creAuthToken')
if (savedToken) {
  config.headers = { 'Authorization': `bearer ${savedToken}` }
}

const instance = axios.create(config)

export default instance
