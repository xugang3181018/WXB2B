import React, { Fragment, useContext, useEffect, Suspense, useRef, useMemo, useLayoutEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import useMessage from 'hooks/useMessage'
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'
import { GlobalContext } from 'context/GlobalState'
import { useLocalStorageState, useRequest } from 'ahooks'
import LayoutHeader from './LayoutHeader'
import BreadcrumbList from './BreadcrumbList'
import SideMenu from './SideMenu'
import routes from 'routes/routes'
import RouteLoop from 'routes/RouteLoop'
import { Layout, Typography, Row, Col, Card } from 'antd'
const { Header, Content, Sider: Side, Footer } = Layout
import { UseRequestProvider } from 'ahooks'
import { PagePlaceholder } from 'component'
import { customerStatus } from 'api'

export default props => {
  const context = useContext(GlobalContext)
  const { collapsed, theme, changeCollapsed, task, cachMessage, taskMessage, merchant, setLocalMessage, setMessageState } = context
  const [localMessage] = useLocalStorageState('message', [])
  const [login] = useLocalStorageState('login')
  const location = useLocation()
  const { pathname } = location
  const { readyState, latestMessage } = useMessage(login?.isCustormer && login?.operatorId)
  const messageHistory = useRef([])
  // const { run } = useRequest(customerStatus, { manual: true })

  messageHistory.current = useMemo(() => {
    let node = latestMessage?.data && JSON.parse(latestMessage?.data)
    return messageHistory.current.concat(node)
  }, [latestMessage])

  // websock 消息缓存
  useLayoutEffect(() => {
    console.log(`latestMessage : time::${new Date().getTime()} ========>`, latestMessage?.data && JSON.parse(latestMessage?.data))
    const data = latestMessage?.data && JSON.parse(latestMessage?.data)
    // console.log(1, data)
    const node = data || null
    if (node) {
      // let msg = Array.from(taskMessage)
      // console.log('taskMessage===============Message', taskMessage)
      // let arr = []
      // const filterTask = item => item.inOutRecordId != node.inOutRecordId && item.memberId != node.memberId
      // const filterStream = item => item.merchantCode != node.merchantCode
      // if (node.type === 1) {
      //   arr = msg.filter(filterTask)
      // } else if (node.type === 6) {
      //   arr = msg.filter(filterStream)
      // } else {
      //   arr = msg
      // }
      // console.log('arr===============ARRRR', arr)
      // let message = [node, ...arr]
      // window.localStorage.setItem('message', JSON.stringify(message))
      cachMessage(node)
    }
  }, [latestMessage])

  useEffect(() => {
    // console.log('res')
    setLocalMessage(localMessage)
  }, [])

  useEffect(() => {
    setMessageState(readyState)
  }, [readyState])

  // useEffect(() => {
  //   const listener = ev => {
  //     ev.preventDefault()
  //     ev.returnValue = ''
  //     console.log(123123213)
  //     run({ appId: login?.appId, id: login?.operatorId, status: 2 })
  //   }
  //   window.addEventListener('beforeunload', listener)
  //   return () => {
  //     window.removeEventListener('beforeunload', listener)
  //   }
  // }, [])

  // useEffect(() => {
  //   console.log('taskMessage ---- SETITEM')
  //   window.localStorage.setItem('message', JSON.stringify(taskMessage))
  // }, [taskMessage])
  // console.log(77, merchant)
  return (
    <UseRequestProvider value={{ ...merchant }}>
      <Layout className="page-container">
        <Side className="page-menu" theme={theme} trigger={null} collapsible collapsed={collapsed}>
          <h1 className="page-logo">
            <Link className="ico-logo" to="/" />
          </h1>
          <SideMenu />
        </Side>
        <Suspense fallback={<PagePlaceholder />}>
          <Content style={{ paddingTop: 64, overflowX: 'hidden' }}>
            {pathname === '/task' ? (
              <RouteLoop routes={routes} />
            ) : (
              <Fragment>
                <Header className="page-header" theme={theme} style={{ position: 'fixed', top: 0, zIndex: 1, width: '100%' }}>
                  <a onClick={changeCollapsed}>{collapsed ? <MenuUnfoldOutlined theme={theme} /> : <MenuFoldOutlined theme={theme} />}</a>
                  <LayoutHeader />
                </Header>
                <Row justify="center">
                  {pathname === '/' ? (
                    <RouteLoop routes={routes} />
                  ) : (
                    <Col span={21}>
                      <BreadcrumbList />
                      <Card>
                        <RouteLoop routes={routes} />
                      </Card>
                    </Col>
                  )}
                </Row>
                <Footer style={{ textAlign: 'center', fontSize: 12, marginBottom: 30 }}>
                  <Typography.Text type="secondary">悦喵无人便利店©2020</Typography.Text>
                </Footer>
              </Fragment>
            )}
          </Content>
        </Suspense>
      </Layout>
    </UseRequestProvider>
  )
}
