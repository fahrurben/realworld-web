import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { EDITING, INITIAL, LOADING } from '../../common/constant.js'
import useAuthStore from '../../store/auth_store.js'
import { postData } from '../../common/fetch_helper.js'

const Home = () => {
  const {accessTokenData} = useAuthStore()

  return (
    <div>
      {
        accessTokenData ?
          <h1>{accessTokenData.username}</h1> :
          <p>Home</p>
      }
    </div>
  )
}

export default Home