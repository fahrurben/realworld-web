import React from 'react'
import moment from 'moment'
import _ from 'lodash'
import useAuthStore from '../../store/auth_store.js'

const ArticleFeed = ({feedType, articles, currentPage, totalPage, changeFeedType, setPage, toggleFavorited}) => {
  const {accessTokenData, accessToken} = useAuthStore()
  let pages = _.range(1, totalPage+1)

  return (
    <>
      {
        articles && Array.isArray(articles) && articles.map((article) => {
          let dateFormatted = moment(article.createdAt).format('MMM Do, YYYY')

          return (
            <div key={article.id} className="article-preview">
              <div className="article-meta">
                <a href={`/profile/${article.author.username}`}><img
                  src=""/></a>
                <div className="info">
                  <a href={`/profile/${article.author.username}`} className="author">{article.author.username}</a>
                  <span className="date">{dateFormatted}</span>
                </div>
                <button
                  className={`btn btn-outline-primary btn-sm pull-xs-right ${article.favorited ? 'active' : ''}`}
                  onClick={() => toggleFavorited(article.slug)}
                >
                  <i className="ion-heart"></i> {article.favoritesCount}
                </button>
              </div>
              <a href={`/article/${article.slug}`}
                 className="preview-link">
                <h1>{article.title}</h1>
                <p>{article.description}</p>
                <span>Read more...</span>
                <ul className="tag-list">
                  {
                    article.tagList && Array.isArray(article.tagList) && article.tagList.map((tag) => {
                      return (
                        <li
                          key={tag}
                          className="tag-default tag-pill tag-outline">{tag}
                        </li>
                      )
                    })
                  }
                </ul>
              </a>
            </div>
          )
        })
      }

      <ul className="pagination">
        {
          totalPage > 1 && pages && pages.map((page) => {
            return (
              <li key={page } className={`page-item ${page === currentPage ? 'active' : ''}`}>
                <a className="page-link" onClick={(e) => setPage(page)}>{page}</a>
              </li>
            )
          })
        }
      </ul>
    </>
  )
}

export default ArticleFeed