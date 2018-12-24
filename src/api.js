import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://cre-backend-testing.herokuapp.com/api',
  timeout: 1000
})

export default instance
