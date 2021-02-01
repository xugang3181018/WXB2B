import React, { useState, useContext } from 'react'
import { Menu, Dropdown, Badge, Space, Popover, Divider, Card, Tabs } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { useRequest, useLocalStorageState } from 'ahooks'
import { useHistory } from 'react-router-dom'
import WarningList from 'pages/task/layout/WarningList'
import TaskCard from 'pages/task/layout/TaskCard'
import { GlobalContext } from 'context/GlobalState'
import Avatar from 'antd/lib/avatar/avatar'
import { Scrollbars } from 'react-custom-scrollbars'
import { customerStatus } from 'api'

export default function LayoutHeader(props) {
  const context = useContext(GlobalContext)
  const { taskMessage } = context
  const filterMessage = item => item && item?.type === 4
  const [login] = useLocalStorageState('login')
  const { operatorName, operatorId: id, appId } = login
  const [visible, setVisible] = useState(false)
  const history = useHistory()
  // 退出登录之后更新在线状态
  const { run } = useRequest(customerStatus, {
    manual: true
  })

  // 退出登录
  const loginOut = e => {
    window.localStorage.removeItem('login')
    run({ appId, id, status: 2 })
    history.replace({
      pathname: '/login'
    })
  }

  const menu = (
    <Menu className="header-menu-container" size="large" style={{ width: 200 }}>
      <Menu.Item key="0" className="header-menu-item" icon={<i className="ico ico-lock" />}>
        修改密码
      </Menu.Item>
      <Menu.Item icon={<i className="ico ico-setting" />} key="1">
        账号设置
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item icon={<i className="ico ico-exit" />} key="2" onClick={loginOut}>
        退出登录
      </Menu.Item>
    </Menu>
  )
  const [msgVisible, setMsgVisible] = useState(false)

  const tabList = [
    { key: '0', tab: <>告警消息({taskMessage.filter(item => item.type === 4).length})</> },
    { key: '1', tab: <>任务({taskMessage.filter(item => item.type === 1).length})</> }
  ]

  const [current, setCurrent] = useState(0)

  const cardContent = [<WarningList showTitle={false} />, <TaskCard />]
  const tabProps = { size: 'small', centered: true }
  const messageCard = (
    <div style={{ width: 400, height: 450 }}>
      <Card size="small" tabList={tabList} onTabChange={val => setCurrent(val)} tabProps={tabProps} bodyStyle={{ padding: 0 }}>
        <Scrollbars style={{ height: 400 }}>
          <div style={{ padding: 20 }}>{cardContent[current]}</div>
        </Scrollbars>
      </Card>
    </div>
  )

  return (
    <div className="header-menu">
      <Space className="header-menu">
        <Dropdown overlay={messageCard} onVisibleChange={() => setMsgVisible(!msgVisible)} visible={msgVisible}>
          <a className="header-drop">
            <Badge count={taskMessage.filter(filterMessage).length} showZero offset={[12, 0]} size="middle">
              <div className="ico ico-bell" />
            </Badge>
          </a>
        </Dropdown>
        <Dropdown overlay={menu} onVisibleChange={() => setVisible(!visible)} visible={visible} arrow>
          <a className="header-drop">
            <Space onClick={e => e.preventDefault()}>
              <Avatar src={login?.headImgUrl} size={22} />
              {`欢迎您！ ${operatorName}`} <i className="ico-arr-down" />
            </Space>
          </a>
        </Dropdown>
      </Space>
    </div>
  )
}
