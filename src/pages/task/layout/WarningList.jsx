import React, { useContext, useEffect } from 'react'
import { GlobalContext } from 'context/GlobalState'
import { List, Button, Avatar, Space, message, Typography } from 'antd'
import { useRequest } from 'ahooks'
import { warningMessage } from 'api'
import w0 from 'images/w0.jpg'
import w1 from 'images/w1.jpg'
import w2 from 'images/w2.jpg'
const warningImage = [w0, w1, w2]
const warningType = ['设备警告', '黑名单警告', '未结账离开警告']

export default function WarningList({ showTitle = true }) {
  const context = useContext(GlobalContext)
  const { taskMessage, login } = context
  const { appId } = login
  const filterMessage = item => item && item?.type === 4
  const onSuccess = res => message.info(res?.msg)
  const options = { manual: true, onSuccess }
  const warningSend = useRequest(warningMessage, options)

  return (
    <List
      dataSource={taskMessage.filter(filterMessage)}
      renderItem={item => {
        const button = (
          <Button type="link" size="small" onClick={() => warningSend.run({ appId, merchantCode: item?.merchantCode, msg: item?.msg })}>
            查看
          </Button>
        )
        return (
          <List.Item extra={button} size="small">
            <List.Item.Meta
              avatar={<Avatar size={32} src={warningImage[item?.alarmType]} />}
              title={warningType[item?.alarmType]}
              description={item?.msg}
            />
          </List.Item>
        )
      }}
    />
  )
}
