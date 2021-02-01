import React from 'react'
import RouteLoop from 'routes/RouteLoop'

export default function Staff(props) {
  return <div>{props.routes && <RouteLoop routes={props.routes} />}</div>
}
