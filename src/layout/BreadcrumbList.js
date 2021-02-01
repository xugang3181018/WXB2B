import React from 'react'
import { Breadcrumb } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import useBreadcrumbs from 'use-react-router-breadcrumbs'
import routes from 'routes/routes'

const PureBreadcrumbs = props => {
  const breadcrumbs = useBreadcrumbs(routes, { disableDefaults: true })
  return (
    <Breadcrumb style={{ padding: '20px 0' }}>
      {breadcrumbs.map(({ breadcrumb, match }, index) => (
        <Breadcrumb.Item key={match.url}>
          <Link to={match.url || ''}>{breadcrumb}</Link>
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  )
}

export default PureBreadcrumbs
