import React from 'react'

export default props => {
  return (
    <div className="task-tabs">
      {props.data.map((item, index) => {
        return (
          <div className={`task-tabs-item ${props.current === index && 'active'}`} key={index} onClick={() => props.onChange(index)}>
            {item}
          </div>
        )
      })}
    </div>
  )
}
