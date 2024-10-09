import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <a className="navbar-brand" href="/">conduit</a>
        <ul className="nav navbar-nav pull-xs-right">
          <li className="nav-item">
            <Link to="/" className="nav-link active">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/login" className="nav-link active">Sign in</Link>
          </li>
          <li className="nav-item">
            <Link to="/register" className="nav-link active">Sign up</Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Header