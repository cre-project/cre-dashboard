import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://cre-backend-testing.herokuapp.com',
  timeout: 1000
})

export default instance
