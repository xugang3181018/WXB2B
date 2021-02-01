import React, { useContext } from 'react'
import { Avatar, Space, Tag } from 'antd'
import { GlobalContext } from 'context/GlobalState'

export default function TaskHead(props) {
  const { task, taskMessage } = useContext(GlobalContext)
  return (
    <div className="task-head">
      <Space className="task-member">
        <Avatar src={task?.headImgUrl} size={40} />
        <div>
          <div>{task?.nickName}</div>
          <div style={{ fontSize: 12, color: '#888' }}>{task?.mobile}</div>
        </div>
      </Space>
      <Space>
        <span style={{ fontSize: 12, color: '#999' }}>任务ID:{task?.inOutRecordId}</span>
        <Tag size="large" color="#108ee9">
          {taskMessage.filter(item => item && task?.merchantCode === item?.merchantCode && item?.type === 6)[0]?.count || 0}人
        </Tag>
      </Space>
    </div>
  )
}
