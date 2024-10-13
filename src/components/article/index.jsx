import React, { useEffect, useState } from 'react'
import useAuthStore from '../../store/auth_store.js'
import moment from 'moment'
import { useNavigate, useParams } from 'react-router-dom'
import { deleteData, getData, postData } from '../../common/fetch_helper.js'
const ArticleView = () => {
  let {slug} = useParams()
  const navigate = useNavigate()
  const {accessToken, accessTokenData} = useAuthStore()
  const [article, setArticle] = useState(null)

  useEffect(() => {
    const fetchArticle = async () => {
      const responseData = await getData(`/articles/${slug}`, accessToken)
      setArticle(responseData.article)
    }

    fetchArticle().then(() => {})
  }, [])

  const dateFormatted = moment(article?.createdAt).format('MMM Do, YYYY')
  const isOwnArticle = article?.author?.username === accessTokenData?.username

  const followAuthor = async (author_username) => {
    const responseData = await postData(`/profiles/${author_username}/follow`, {}, accessToken)
    const articleUpdated = {...article}
    articleUpdated.author.following = true
    setArticle(articleUpdated)
  }

  const unfollowAuthor = async (author_username) => {
    const responseData = await deleteData(`/profiles/${author_username}/follow`, accessToken)
    const articleUpdated = {...article}
    articleUpdated.author.following = false
    setArticle(articleUpdated)
  }

  const favoriteArticle = async (slug) => {
    const responseData = await postData(`/articles/${slug}/favorite`, {}, accessToken)
    const articleUpdated = {...article}
    articleUpdated.favorited = true
    articleUpdated.favoritesCount += 1
    setArticle(articleUpdated)
  }

  const unfavoriteArticle = async (slug) => {
    const responseData = await deleteData(`/articles/${slug}/favorite`, accessToken)
    const articleUpdated = {...article}
    articleUpdated.favorited = false
    articleUpdated.favoritesCount -= 1
    setArticle(articleUpdated)
  }

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{article?.title}</h1>

          <div className="article-meta">
            <a href={`/profile/${article?.author?.username}`}><img
              src={article?.image}/></a>
            <div className="info">
              <a href={`/profile/${article?.author?.username}`} className="author">{article?.author?.username}</a>
              <span className="date">{dateFormatted}</span>
            </div>
            {
               isOwnArticle ?
                 (
                   <>
                     <button className="btn btn-sm btn-outline-secondary" onClick={() => navigate(`/editor/${article?.slug}`)}>
                       <i className="ion-edit"></i> Edit Article
                     </button>
                     <button className="btn btn-sm btn-outline-danger">
                       <i className="ion-trash-a"></i> Delete Article
                     </button>
                   </>
                 ) :
                 (
                   <>
                     <button className={`btn btn-sm btn-outline-secondary ${article?.author?.following ? 'active': ''}`}
                             onClick={() => article?.author?.following ? unfollowAuthor(article?.author?.username) : followAuthor(article?.author?.username)}
                     >
                       <i className="ion-plus-round"></i>
                       &nbsp; Follow {article?.author?.username} <span
                       className="counter"></span>
                     </button>
                     &nbsp;&nbsp;
                     <button className={`btn btn-sm btn-outline-primary ${article?.favorited ? 'active' : ''}`}
                             onClick={() => article?.favorited ? unfavoriteArticle(article?.slug) : favoriteArticle(article?.slug)}
                     >
                       <i className="ion-heart"></i>
                       &nbsp; Favorite Post <span
                       className="counter">({article?.favoritesCount})</span>
                     </button>
                   </>
                 )
            }

          </div>
        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <p>{article?.description}</p>
            <div>
              {article?.body}
            </div>
            <ul className="tag-list">
              {
                article && article.tagList.map((tag) => {
                  return <li key={tag} className="tag-default tag-pill tag-outline">{tag}</li>
                })
              }
            </ul>
          </div>
        </div>

        <hr/>

        <div className="article-actions">
          <div className="article-meta">
            <a href={`/profile/${article?.author?.username}`}><img
              src={article?.image}/></a>
            <div className="info">
              <a href="" className="author">{article?.author?.username}</a>
              <span className="date">{dateFormatted}</span>
            </div>

            <button className="btn btn-sm btn-outline-secondary">
              <i className="ion-plus-round"></i>
              &nbsp; Follow Eric Simons
            </button>
            &nbsp;
            <button className="btn btn-sm btn-outline-primary">
              <i className="ion-heart"></i>
              &nbsp; Favorite Article <span className="counter">(29)</span>
            </button>
            <button className="btn btn-sm btn-outline-secondary">
              <i className="ion-edit"></i> Edit Article
            </button>
            <button className="btn btn-sm btn-outline-danger">
              <i className="ion-trash-a"></i> Delete Article
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-xs-12 col-md-8 offset-md-2">
            <form className="card comment-form">
              <div className="card-block">
                <textarea className="form-control"
                          placeholder="Write a comment..." rows="3"></textarea>
              </div>
              <div className="card-footer">
                <img src="http://i.imgur.com/Qr71crq.jpg"
                     className="comment-author-img"/>
                <button className="btn btn-sm btn-primary">Post Comment</button>
              </div>
            </form>

            <div className="card">
              <div className="card-block">
                <p className="card-text">
                  With supporting text below as a natural lead-in to additional
                  content.
                </p>
              </div>
              <div className="card-footer">
                <a href="/profile/author" className="comment-author">
                  <img src="http://i.imgur.com/Qr71crq.jpg"
                       className="comment-author-img"/>
                </a>
                &nbsp;
                <a href="/profile/jacob-schmidt" className="comment-author">Jacob
                  Schmidt</a>
                <span className="date-posted">Dec 29th</span>
              </div>
            </div>

            <div className="card">
              <div className="card-block">
                <p className="card-text">
                  With supporting text below as a natural lead-in to additional
                  content.
                </p>
              </div>
              <div className="card-footer">
                <a href="/profile/author" className="comment-author">
                  <img src="http://i.imgur.com/Qr71crq.jpg"
                       className="comment-author-img"/>
                </a>
                &nbsp;
                <a href="/profile/jacob-schmidt" className="comment-author">Jacob
                  Schmidt</a>
                <span className="date-posted">Dec 29th</span>
                <span className="mod-options">
              <i className="ion-trash-a"></i>
            </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArticleView