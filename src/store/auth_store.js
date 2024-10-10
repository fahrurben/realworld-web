import {create} from 'zustand'
import {persist} from 'zustand/middleware';
import {baseUrl} from '../common/constant.js'
import axios from 'axios'

const useAuthStore = create(persist((set) =>({
  accessToken: undefined,
  accessTokenData: undefined,
  refreshToken: undefined,
  setAccessToken: async (accessToken) => {
    set({accessToken})
    const response = await axios.get(baseUrl + '/users', {
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    })
    set({accessTokenData: response.data.user})
  },
  setRefreshToken: (refreshToken) => { set(refreshToken) },
  logout: () => {
    set({
      accessToken: undefined,
      accessTokenData: undefined,
      refreshToken: undefined,
    })
  }
}),
  {
    name: 'auth-storage'
  })
)

export default useAuthStore