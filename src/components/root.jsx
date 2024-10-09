import React from 'react'
import {Outlet} from 'react-router-dom'
import Header from './header.jsx'
import Footer from './footer.jsx'

const Root = () => {
  return (
    <div>
      <Header />
      <Outlet/>
      <Footer />
    </div>
  )
}

export default Root