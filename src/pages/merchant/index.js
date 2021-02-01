import React, { Suspense } from 'react'
import { useParams, useRouteMatch, Switch } from 'react-router-dom'
import RouteLoop from '../../routes/RouteLoop'
import { Spin, Breadcrumb } from 'antd'

export default function Merchant(props) {
  const params = useParams()
  let math = useRouteMatch()
  return <div>{props.routes && <RouteLoop routes={props.routes} />}</div>
}
