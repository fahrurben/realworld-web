import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { EDITING, INITIAL, LOADING, pageSize } from '../../common/constant.js'
import useAuthStore from '../../store/auth_store.js'
import { deleteData, getData, postData } from '../../common/fetch_helper.js'

import Banner from './banner.jsx'
import ArticleFeed from './article-feed.jsx'


const Home = () => {
  const {accessTokenData, accessToken} = useAuthStore()
  const [feedType, setFeedType] = useState('GLOBAL')
  const [articles, setArticles] = useState([])
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(0)
  const [tagList, setTagList] = useState([])
  const [tagSelected, setTagSelected] = useState(null)
  const changeFeedType = (feedType) => setFeedType(feedType)

  useEffect(() => {
    const fetchArticles = async () => {
      let offset = (page - 1) * pageSize
      let limit = offset + Number(pageSize)
      const params = {
        offset,
        limit,
      }
      if (feedType === 'TAG') {
        params.tag = tagSelected
      }

      const searchParams = new URLSearchParams(params);
      let responseData
      if (feedType === 'GLOBAL' || feedType === 'TAG') {
        responseData = await getData('/articles?' + searchParams, accessToken)
      } else if (feedType === 'YOURS') {
        responseData = await getData('/articles/feed?' + searchParams, accessToken)
      }
      setArticles(responseData.articles)
      let articlesCount = responseData.articlesCount
      let totalPage = articlesCount / 10
      totalPage += articlesCount % 10 == 0 ? 1 : 0
      setTotalPage(totalPage)
    }

    fetchArticles().then(() => {})
  }, [page, feedType, tagSelected])

  useEffect(() => {
    const fetchTags = async () => {
      let responseData = await getData('/tags')
      setTagList(responseData.tags)
    }
    fetchTags().then(() => {})
  }, [])

  const changeTab = (feedType) => {
    setPage(1)
    setFeedType(feedType)
  }

  const onTagClicked = (tag) => {
    setTagSelected(tag)
    changeTab('TAG')
  }

  const toggleFavorited = async (slug) => {
    const index = articles.findIndex((article) => article.slug === slug)
    const article = articles[index]
    if (article.favorited) {
      await deleteData(`/articles/${article.slug}/favorite`, accessToken)
      article.favorited = false
      article.favoritesCount -= 1
    } else {
      await postData(`/articles/${article.slug}/favorite`, {}, accessToken)
      article.favorited = true
      article.favoritesCount += 1
    }
    let articlesUpdated = [...articles]
    articlesUpdated.splice(index, 1, article)
    setArticles(articlesUpdated)
  }

  return (
    <div className="home-page">
      <Banner />

      <div className="container page">
        <div className="row">
          <div className="col-md-9">
            <div className="feed-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <a className={`nav-link ${feedType === 'YOURS' ? 'active' : ''}`}
                     href="#"
                     onClick={() => changeTab('YOURS')}
                  >Your Feed</a>
                </li>
                <li className="nav-item">
                  <a className={`nav-link ${feedType === 'GLOBAL' ? 'active' : ''}`}
                     href="#"
                     onClick={() => changeTab('GLOBAL')}
                  >Global Feed</a>
                </li>
                {
                  tagSelected &&
                  <li className="nav-item">
                    <a className={`nav-link ${feedType === 'TAG'
                      ? 'active'
                      : ''}`}
                       href="#"
                       onClick={() => changeTab('TAG')}
                    >{tagSelected}</a>
                  </li>
                }
              </ul>
            </div>
            <ArticleFeed
              feedType={feedType}
              articles={articles}
              currentPage={page}
              totalPage={totalPage}
              changeFeedType={changeFeedType}
              setPage={setPage}
              toggleFavorited={toggleFavorited}
            />
          </div>

          <div className="col-md-3">
            <div className="sidebar">
              <p>Popular Tags</p>

              <div className="tag-list">
                {
                  tagList && tagList.map((tag) => {
                    return (
                      <a key={tag} href="#" onClick={() => onTagClicked(tag)} className="tag-pill tag-default">{tag}</a>
                    )
                  })
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home