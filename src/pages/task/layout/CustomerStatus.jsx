import React from 'react'
import { Avatar, Space, Select, message } from 'antd'
const { Option } = Select
import { customerStatus } from 'api'
import { useRequest, useLocalStorageState } from 'ahooks'
export default props => {
  const [login] = useLocalStorageState('login')
  const { operatorId: id, appId, headImgUrl, operatorName } = login
  const onSuccess = res => {
    message.success(res.msg)
  }
  const { run } = useRequest(customerStatus, { manual: true, onSuccess })
  function handleChange(value) {
    const status = value
    run({ id, status, appId })
  }
  return (
    <div className="task-customer">
      <Space className="task-customer-space">
        <Avatar size={50} src={headImgUrl} />
        <div>
          <div style={{ paddingLeft: 11 }}>{operatorName}</div>
          <Select defaultValue="1" bordered={false} style={{ width: 80 }} onChange={handleChange}>
            <Option value="1">在线</Option>
            <Option value="2">离线</Option>
            <Option value="3">暂离</Option>
          </Select>
        </div>
      </Space>
    </div>
  )
}
