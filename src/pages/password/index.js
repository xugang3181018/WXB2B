import React from 'react'
import { PageHeader } from 'antd'
import { useHistory } from 'react-router-dom'

export default function Password() {
  const history = useHistory()
  return (
    <div>
      <PageHeader className="site-page-header" onBack={() => null} title="设置密码" subTitle="This is a subtitle" />
    </div>
  )
}
