import React, { useEffect } from 'react'
import { notification } from 'antd'
import { useWebSocket } from 'ahooks'
const websockHost = 'wss://ymht.liantuofu.com'
// const websockHost = 'wss://ymht.liantuobank.com'

const useMessage = id => {
  // message缓存
  const alarmType = ['设备警告', '黑名单警告', '未结账离开警告']
  const message = useWebSocket(`${websockHost}/ymWebSocket/${id}`, {
    onMessage: res => {
      const data = res?.data && JSON.parse(res?.data)
      const { type } = data
      if (type === 4) {
        const { msg, alarmType: type, merchantName } = data
        notification.warning({
          message: merchantName,
          style: { width: 450 },
          description: (
            <div>
              <p>{msg}</p>
              <p>{alarmType[type]}</p>
            </div>
          )
        })
      }
    }
  })
  // console.log(2, message)
  const { latestMessage } = message

  useEffect(() => {}, [latestMessage])
  return { ...message }
}
export default useMessage
