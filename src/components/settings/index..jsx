import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useNavigate } from 'react-router-dom'
import { EDITING, INITIAL, LOADING } from '../../common/constant.js'
import useAuthStore from '../../store/auth_store.js'
import { getData, postData, putData } from '../../common/fetch_helper.js'

const schema = yup
.object({
  image: yup.string().required().max(255),
  username: yup.string().required().max(100),
  bio: yup.string(),
  email: yup.string().email().required().max(100),
  new_password: yup.string(),
})


const Settings = () => {
  const {accessToken, accessTokenData, logout} = useAuthStore()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: {formErrors, isValid, isDirty},
  } = useForm({
    resolver: yupResolver(schema),
  })
  const [status, setStatus] = useState(INITIAL)
  const [errors, setErrors] = useState([])

  const btnLogoutClicked = () => {
    logout()
    navigate('/')
  }

  useEffect(() => {
    getData('/users', accessToken).then((responseData) => {
      const user = responseData.user
      reset({
        image: user.image,
        username: user.username,
        bio: user.bio || '',
        email: user.email,
        new_password: '',
      });
    })
  }, [])

  const onSubmit = async (data) => {
    setStatus(LOADING)
    try {
      if (data['new_password']) {
        data['password'] = data['new_password']
      }
      let responseData = await putData('/users', {'user': data}, accessToken)
      navigate(`/profile/${accessTokenData.username}`)
    } catch (e) {
      if (e.status === 400) {
        setErrors(Object.entries(e.response.data.message))
      }
    }
    setStatus(EDITING)
  }

  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Your Settings</h1>

            <ul className="error-messages">
              {
                errors && errors.map(([key, value]) => {
                  return <li key={key}>{value[0]}</li>
                })
              }
            </ul>

            <form onSubmit={handleSubmit(onSubmit)}>
              <fieldset>
                <fieldset className="form-group">
                  <input className="form-control" type="text"
                         placeholder="URL of profile picture"
                         {...register('image')}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input className="form-control form-control-lg" type="text"
                         {...register('username')}
                         placeholder="Your Name"/>
                </fieldset>
                <fieldset className="form-group">
              <textarea
                className="form-control form-control-lg"
                rows="8"
                placeholder="Short bio about you"
              ></textarea>
                </fieldset>
                <fieldset className="form-group">
                  <input className="form-control form-control-lg" type="text"
                         {...register('email')}
                         placeholder="Email"/>
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="password"
                    {...register('new_password')}
                    placeholder="New Password"
                  />
                </fieldset>
                <button
                  className={`btn btn-lg btn-primary pull-xs-right ${isValid
                    ? ''
                    : 'disabled'}`}
                  disabled={!isValid}
                >Update Settings
                </button>
              </fieldset>
            </form>
            <hr/>
            <button className="btn btn-outline-danger"
                    onClick={btnLogoutClicked}>Or click here to
              logout.
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings