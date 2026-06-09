import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <>
       <nav className="p-4 bg-gray-800 text-white flex gap-4 justify-around">
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
      </nav>
    </>
  )
}

export default Header
