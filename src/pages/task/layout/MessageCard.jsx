import React from 'react'
import { Tag } from 'antd'

const MessageCard = props => {
  const { message } = props
  return (
    <div>
      <h4></h4>
      <Tag>{message}</Tag>
    </div>
  )
}

export default MessageCard
