import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Drawer, Spin } from 'antd'
import { useLocalStorageState } from 'ahooks'
import { GlobalContext } from 'context/GlobalState'
import Side from './layout/Side'
import Right from './layout/Right'
import Center from './layout/Center'
import { PageEmpty } from 'component'
import './style.less'

export default React.memo(props => {
  const context = useContext(GlobalContext)
  const { messageState } = context
  const [login] = useLocalStorageState('login')

  const state = ['Connecting', 'Open', 'Closing', 'Closed']
  console.log('======== websocket message readystate ======', state[messageState])
  const taskCenter = (
    <Spin spinning={messageState != 1} tip={<a>{state[messageState]}</a>}>
      <div className="task-wrap" style={{ marginTop: '-64px' }}>
        <div className="task">
          <Side />
          <Center />
          <Right />
        </div>
      </div>
    </Spin>
  )
  const taskError = <PageEmpty image="task" description="您不是客服，无法查看任务中心" />
  return <Fragment>{login?.isCustormer ? taskCenter : taskError}</Fragment>
})
