import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import moment from 'moment'
import { EDITING, INITIAL, LOADING } from '../../common/constant.js'
import useAuthStore from '../../store/auth_store.js'
import {
  deleteData,
  getData,
  postData,
} from '../../common/fetch_helper.js'

const schema = yup
.object({
  body: yup.string().required(),
})

const Comments = ({article}) => {
  const slug = article?.slug

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: {formErrors, isValid, isDirty,},
  } = useForm({
    defaultValues: {
      body: '',
    },
    resolver: yupResolver(schema),
  })
  const [status, setStatus] = useState(INITIAL)
  const {accessToken, accessTokenData} = useAuthStore()
  const [comments, setComments] = useState([])

  useEffect(() => {
    const fetchComments = async () => {
      const responseData = await getData(`/articles/${slug}/comments`, accessToken)
      setComments(responseData.comments)
    }
    if (slug) {
      fetchComments().then(() => {})
    }
  }, [article])

  const onSubmit = async (data) => {
    const responseData = await postData(`/articles/${slug}/comments`, {'comment': data}, accessToken)
    setComments([...comments, responseData.comment])
  }

  const deleteComment = async (id, index) => {
    const responseData = await deleteData(`/articles/${slug}/comments/${id}`, accessToken)
    let newComments = [...comments]
    newComments.splice(index, 1)
    setComments(newComments)
  }

  return (
    <div className="row">
      <div className="col-xs-12 col-md-8 offset-md-2">
        <form className="card comment-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="card-block">
                <textarea className="form-control"
                          placeholder="Write a comment..." rows="3" {...register('body')}>
                </textarea>
          </div>
          <div className="card-footer">
            <img src={article?.author?.image}
                 className="comment-author-img"/>
            <button className={`btn btn-sm btn-primary ${isValid} ? 'disabled' : ''`}
              disabled={!isValid}>Post Comment</button>
          </div>
        </form>

        {
          comments && comments.length > 0 && comments.map((comment, index) => {
            const dateFormatted = moment(comment?.createdAt).format('MMM Do, YYYY')

            return (
              <div key={comment.id} className="card">
                <div className="card-block">
                  <p className="card-text">
                    {comment.body}
                  </p>
                </div>
                <div className="card-footer">
                  <a href={`/profile/${comment?.author?.username}`}
                     className="comment-author">
                    <img src={`/profile/${comment?.author?.image}`}
                         className="comment-author-img"/>
                  </a>
                  &nbsp;
                  <a href={`/profile/${comment?.author?.username}`}
                     className="comment-author">{comment?.author?.username}
                  </a>
                  <span className="date-posted">{dateFormatted}</span>
                  {
                    comment.author.username === accessTokenData.username &&
                    (
                      <span className="mod-options" onClick={() => deleteComment(comment.id, index)}>
                        <i className="ion-trash-a"></i>
                      </span>
                    )
                  }
                </div>
              </div>
            )
          })
        }

      </div>
    </div>
  )
}

export default Comments