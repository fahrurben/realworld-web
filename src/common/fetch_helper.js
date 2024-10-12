import axios from 'axios'
import { baseUrl } from './constant.js'

export async function postData(url, data, token) {

  let config = {}
  if (token) {
    config['headers'] = {
      'Authorization': 'Bearer ' + token
    }
  }

  const {data: responseData} = await axios.post(baseUrl + url, data, config)
  return responseData
}

export async function getData(url, token) {
  let config = {}
  if (token) {
    config['headers'] = {
      'Authorization': 'Bearer ' + token
    }
  }

  const {data: responseData} = await axios.get(baseUrl + url, config)
  return responseData
}

export async function putData(url, data, token) {

  let config = {}
  if (token) {
    config['headers'] = {
      'Authorization': 'Bearer ' + token
    }
  }

  const {data: responseData} = await axios.put(baseUrl + url, data, config)
  return responseData
}