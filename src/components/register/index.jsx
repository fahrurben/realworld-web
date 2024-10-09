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
    username: yup.string().required().max(100),
    email: yup.string().email().required().max(100),
    password: yup.string().required().max(100),
  })

const Register = () => {
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
      let responseData = await postData('/users', {'user': data})
      await setAccessToken(responseData.user.token)
      navigate('/')
    } catch (e) {
      if (e.status === 400) {
        setErrors(Object.entries(e.response.data.message))
      }
    }
    setStatus(EDITING)
  }

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign up</h1>
            <p className="text-xs-center">
              <a href="/login">Have an account?</a>
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
                       placeholder="Username" {...register('username')} />
              </fieldset>
              <fieldset className="form-group">
                <input className="form-control form-control-lg" type="text"
                       placeholder="Email" {...register('email')} />
              </fieldset>
              <fieldset className="form-group">
                <input className="form-control form-control-lg" type="password"
                       placeholder="Password" {...register('password')} />
              </fieldset>
              <button className={`btn btn-lg btn-primary pull-xs-right ${isValid ? '': 'disabled'}`}>Sign up</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register