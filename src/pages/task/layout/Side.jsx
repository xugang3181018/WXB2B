import React, { useContext, useState, useRef, useMemo } from 'react'
import { Badge } from 'antd'
import { GlobalContext } from 'context/GlobalState'
import HistoryList from './HistoryList'
import TaskCard from './TaskCard'
import TaskTab from './Tabs'
import TaskContainer from './TaskContainer'
import CustomerStatus from './CustomerStatus'

export default function TaskSide(props) {
  const { taskMessage } = useContext(GlobalContext)
  const [current, setCurrent] = useState(0)
  const taskList = taskMessage.filter(item => item && item?.type === 1)
  // console.log('slid', taskList)
  const tabTitle = (
    <Badge offset={[10, 0]} count={taskList.length}>
      系统分发
    </Badge>
  )
  return (
    <TaskContainer
      style={{ width: 300 }}
      topHeader={<CustomerStatus />}
      head={<TaskTab data={[tabTitle, '历史任务']} onChange={setCurrent} current={current} />}>
      {current === 0 && <TaskCard />}
      {current === 1 && <HistoryList />}
    </TaskContainer>
  )
}
