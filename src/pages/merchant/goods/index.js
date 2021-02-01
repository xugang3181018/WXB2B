import React from 'react'
import { useParams, useRouteMatch } from 'react-router-dom'
import RouteLoop from 'routes/RouteLoop'

export default function Goods(props) {
  const params = useParams()
  let math = useRouteMatch()
  return (
    <div>
      <div>{props.routes && <RouteLoop routes={props.routes} />}</div>
    </div>
  )
}
