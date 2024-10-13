import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useNavigate, useParams } from 'react-router-dom'
import { EDITING, INITIAL, LOADING } from '../../common/constant.js'
import useAuthStore from '../../store/auth_store.js'
import {
  getData,
  patchData,
  postData,
  putData,
} from '../../common/fetch_helper.js'

const schema = yup
.object({
  title: yup.string().required().max(100),
  description: yup.string().required().max(255),
  body: yup.string().required(),
  tags: yup.array().of(yup.string()),
})

const Editor = () => {
  let {slug} = useParams()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: {formErrors, isValid, isDirty,},
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      body: '',
    },
    resolver: yupResolver(schema),
  })
  const [status, setStatus] = useState(INITIAL)
  const [errors, setErrors] = useState([])
  const [tags, setTags] = useState([])
  const [tagOptions, setTagOptions] = useState([])
  const {accessToken} = useAuthStore()

  useEffect(() => {
    const getInitialData = async () => {
      const responseData = await getData('/tags')
      setTagOptions(responseData.tags)

      if (slug) {
        const { article } = await getData(`/articles/${slug}`)
        reset({
          title: article.title,
          description: article.description,
          body: article.body,
        })
        setTags(article.tagList)
      }
    }
    getInitialData().then(() => {})
  }, [])

  const onTagChange = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      setTags([...tags, event.target.value])
      event.target.value = ''
    }
  }

  const removeTag = (tag) => {
    let newTags = tags.filter((val) => val !== tag)
    setTags([...newTags])
  }
  const onSubmit = async (data) => {
    setStatus(LOADING)
    try {
      data['tagList'] = tags
      if (slug) {
        await patchData(`/articles/${slug}`, {'article': data}, accessToken)
      } else {
        await postData('/articles', {'article': data}, accessToken)
      }
      navigate('/')
    } catch (e) {
      if (e.status === 400) {
        setErrors(Object.entries(e.response.data.message))
      }
    }
    setStatus(EDITING)
  }


  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
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
                  <input type="text" className="form-control form-control-lg"
                         placeholder="Article Title"
                         {...register('title')} />
                </fieldset>
                <fieldset className="form-group">
                  <input type="text" className="form-control"
                         placeholder="What's this article about?"
                         {...register('description')} />
                </fieldset>
                <fieldset className="form-group">
              <textarea
                className="form-control"
                rows="8"
                placeholder="Write your article (in markdown)"
                {...register('body')}
              ></textarea>
                </fieldset>
                <fieldset className="form-group">
                  <input type="text" className="form-control"
                         list="tags"
                         placeholder="Enter tags" onKeyDown={onTagChange}/>

                  <datalist id="tags">
                    {
                      tagOptions && tagOptions.map((tagOption) => (<option key={tagOption} value={tagOption}/>))
                    }
                  </datalist>
                  <div className="tag-list">
                    {
                      tags && tags.map((tag) => {
                        return (
                          <span key={tag} className="tag-default tag-pill"> <i
                            className="ion-close-round"
                            onClick={() => removeTag(tag)}></i> {tag} </span>
                        )
                      })
                    }
                  </div>
                </fieldset>
                <button
                  className={`btn btn-lg btn-primary pull-xs-right ${isValid
                    ? ''
                    : 'disabled'}`}
                  disabled={!isValid}
                >
                  Publish Article
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Editor