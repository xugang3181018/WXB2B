import React, { useContext, useState, useEffect, Fragment } from 'react'
import { Badge } from 'antd'
import { GlobalContext } from 'context/GlobalState'
import { PageEmpty } from 'component'
import TaskContainer from './TaskContainer'
import TaskTab from './Tabs'
import MemberDetail from '../../member/MemberDetail'
import WarningList from './WarningList'

export default React.memo(props => {
  const { task, taskMessage, login } = useContext(GlobalContext)
  const filterMessage = item => item && item?.type === 4
  const warningTitle = (
    <Badge offset={[10, 0]} count={taskMessage.filter(filterMessage).length}>
      告警提醒
    </Badge>
  )
  const [current, setCurrent] = useState(1)
  const emptyState = [<PageEmpty description="未选择会员" image={'member'} />, <PageEmpty description="无警告异常" image={'warning'} />]
  useEffect(() => {
    setCurrent(0)
  }, [task])
  // console.log('task', task)
  return (
    <TaskContainer style={{ width: 550 }} head={<TaskTab data={['会员信息', warningTitle]} onChange={setCurrent} current={current} />}>
      <div style={{ padding: 15 }}>
        {task && current === 0 && <Fragment>{task?.memberId && task?.merchantCode ? <MemberDetail {...task} /> : emptyState[current]}</Fragment>}
        {current === 1 && <Fragment>{taskMessage.filter(filterMessage).length ? <WarningList /> : emptyState[current]}</Fragment>}
      </div>
    </TaskContainer>
  )
})
