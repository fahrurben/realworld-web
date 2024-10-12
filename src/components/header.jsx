import React from 'react'
import { Link } from 'react-router-dom'
import useAuthStore from '../store/auth_store.js'

const Header = () => {
  const {accessTokenData, accessToken, logout} = useAuthStore()

  const unauthenticatedLinks =
    <>
      <li className="nav-item">
        <Link to="/login" className="nav-link active">Sign in</Link>
      </li>
      <li className="nav-item">
        <Link to="/register" className="nav-link active">Sign up</Link>
      </li>
    </>

  const authenticatedLinks =
    <>
      <li className="nav-item">
        <a className="nav-link" href="/editor"> <i
          className="ion-compose"></i>&nbsp;New Article </a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="/settings"> <i
          className="ion-gear-a"></i>&nbsp;Settings </a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href={`/profile/${accessTokenData?.username}`}>
          <img src="" className="user-pic"/>
          {accessTokenData?.username}
        </a>
      </li>
    </>

  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <a className="navbar-brand" href="/">conduit</a>
        <ul className="nav navbar-nav pull-xs-right">
          <li className="nav-item">
            <Link to="/" className="nav-link active">Home</Link>
          </li>
          { accessTokenData ? authenticatedLinks : unauthenticatedLinks }
        </ul>
      </div>
    </nav>
  )
}

export default Header