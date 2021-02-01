import React, { Suspense } from 'react'
import RouteLoop from '../../routes/RouteLoop'

export default function Trusteeship(props) {
  return <div>{props.routes && <RouteLoop routes={props.routes} />}</div>
}
