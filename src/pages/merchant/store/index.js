import React from 'react'
import { useParams, useRouteMatch } from 'react-router-dom'
import RouteLoop from 'routes/RouteLoop'

export default function Store(props) {
  const params = useParams()
  return <div>{props.routes && <RouteLoop routes={props.routes} />}</div>
}
