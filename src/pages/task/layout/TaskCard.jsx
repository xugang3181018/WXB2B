import React, { useContext, useEffect } from 'react'
import { List, Tag } from 'antd'
import { GlobalContext } from 'context/GlobalState'

export default props => {
  // console.log('props', props)
  const { taskChange, task, clearMessage } = useContext(GlobalContext)
  const door = ['进入', '离开', '测试开门', '客服开门']
  const color = ['#87d068', '#f50', '#2db7f5', '#108ee9']
  const { taskMessage } = useContext(GlobalContext)
  // console.log(3, taskMessage)
  const taskList = taskMessage.filter(item => item && item?.type === 1)
  const leave = taskMessage.filter(item => item && item?.type === 7)
  useEffect(() => {
    if (leave.length) {
      leave.forEach(item => {
        clearMessage(item?.inOutRecordId)
      })
    }
  }, [leave])

  const renderItem = item => (
    <List.Item onClick={() => taskChange(item)} className={`task-item ${item?.inOutRecordId === task?.inOutRecordId && 'active'}`}>
      <List.Item.Meta
        title={
          <div className="task-item-info">
            {item?.merchantName}
            <Tag size="small" className="task-item-state" color={color[item?.openType]}>
              {door[item?.openType]}
            </Tag>
          </div>
        }
        description={
          <div>
            <div className="task-item-date">{item?.outTime || item?.inTime}</div>
            <div className="task-member">
              <Tag size="small" color={item?.oldMember > 0 ? 'red' : 'orange'} className="task-old">
                {item.oldMember > 0 ? '老' : '新'}
              </Tag>
              <span className="task-item-date">
                {item?.nickName} / {item?.mobile}
              </span>
            </div>
          </div>
        }
      />
    </List.Item>
  )
  return <List size="small" dataSource={taskList} renderItem={renderItem} />
}
