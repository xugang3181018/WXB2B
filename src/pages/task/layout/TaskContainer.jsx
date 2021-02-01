import React from 'react'
import { Scrollbars } from 'react-custom-scrollbars'

export default props => {
  return (
    <div className={`task-card {props?.className}`} style={{ ...props?.style }}>
      {props.topHeader && <div className="task-card-top">{props.topHeader}</div>}
      {props.head && <div className="task-card-head">{props.head}</div>}
      <div className="task-card-container" style={props?.containerStyle}>
        <Scrollbars>{props.children}</Scrollbars>
      </div>
      {props.bar && <div className="task-card-bar">{props.bar}</div>}
    </div>
  )
}
