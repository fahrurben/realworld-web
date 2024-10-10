import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useNavigate } from 'react-router-dom'
import { EDITING, INITIAL, LOADING } from '../../common/constant.js'
import useAuthStore from '../../store/auth_store.js'
import { postData } from '../../common/fetch_helper.js'


const schema = yup
.object({
  email: yup.string().email().required().max(100),
  password: yup.string().required().max(100),
})

const Login = () => {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: {formErrors, isValid, isDirty},
  } = useForm({
    resolver: yupResolver(schema),
  })
  const [status, setStatus] = useState(INITIAL)
  const [errors, setErrors] = useState([])
  const {setAccessToken} = useAuthStore()

  const onSubmit = async (data) => {
    setStatus(LOADING)
    try {
      let responseData = await postData('/users/login', {'user': data})
      await setAccessToken(responseData.user.token)
      navigate('/')
    } catch (e) {
      if (e.status === 400) {
        if (Array.isArray(e.response.data.message)) {
          setErrors(Object.entries(e.response.data.message))
        } else {
          setErrors([['email', [e.response.data.message]]])
        }
      }
    }
    setStatus(EDITING)
  }

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign in</h1>
            <p className="text-xs-center">
              <a href="/register">Need an account?</a>
            </p>

            <ul className="error-messages">
              {
                errors && errors.map(([key, value]) => {
                  return <li key={key}>{value[0]}</li>
                })
              }
            </ul>

            <form onSubmit={handleSubmit(onSubmit)}>
              <fieldset className="form-group">
                <input className="form-control form-control-lg" type="text"
                       placeholder="Email" {...register('email')} />
              </fieldset>
              <fieldset className="form-group">
                <input className="form-control form-control-lg" type="password"
                       placeholder="Password" {...register('password')} />
              </fieldset>
              <button className={`btn btn-lg btn-primary pull-xs-right ${isValid
                ? ''
                : 'disabled'}`}
                      disabled={!isValid}
              >Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login