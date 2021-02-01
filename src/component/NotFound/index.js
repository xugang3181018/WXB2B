import React from 'react'
import { Button } from 'antd'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="page-404">
      <h2>
        没有找到该页面 <p>Pages not found</p>
      </h2>
      <Button type="primary" size="large">
        <Link to="/">返回首页</Link>
      </Button>
      <div className="page-404-img">
        <img src={require('../../assets/images/notFound.png')} />
      </div>
    </div>
  )
}
