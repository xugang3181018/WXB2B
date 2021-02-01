import React, { Fragment, useContext } from 'react'
import TaskContainer from './TaskContainer'
import TaskBar from './TaskBar'
import TaskMeassage from './TaskMeassage'
import TaskHead from './TaskHead'
import { GlobalContext } from 'context/GlobalState'
import { PageEmpty } from 'component'

export default function Center(props) {
  const { task } = useContext(GlobalContext)
  const empty = (
    <div style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <PageEmpty style={{ padding: 0 }} description="无任务" image="task" />
    </div>
  )
  const container = (
    <TaskContainer style={{ width: '100%' }} bar={<TaskBar />} head={<TaskHead />}>
      <TaskMeassage />
    </TaskContainer>
  )
  return <div className="task-center">{task?.memberId ? container : empty}</div>
}
