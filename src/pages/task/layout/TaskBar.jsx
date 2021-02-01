import React, { Fragment, useContext, useState } from 'react'
import { Form, Button, Input, Popover, Space, notification, Divider, Spin, Modal, Alert } from 'antd'
import { useRequest, useLocalStorageState } from 'ahooks'
import { door, doorLock, doorState, checkInOutRecord, endInOutRecord } from 'api'
import { GlobalContext } from 'context/GlobalState'

export default function TaskBar(props) {
  const { task, clearMessage } = useContext(GlobalContext)

  const onSuccess = res => {
    if (res && res.code === 'SUCCESS') {
      notification.success({
        message: '操作成功',
        description: res.msg,
        duration: null
      })
    }
    if (res && res.code === 'FAILED') {
      notification.warning({
        message: '操作失败',
        duration: null,
        description: res.msg
      })
    }
  }
  const [login] = useLocalStorageState('login')
  const { appId, operatorId } = login
  const { merchantCode, memberId, inOutRecordId } = task
  const params = { appId, merchantCode }
  const defaultParams = [params]
  const options = { defaultParams, onSuccess, manual: true }
  const open = useRequest(door, options)
  const lock = useRequest(doorLock, options)
  const check = useRequest(checkInOutRecord, { ...options, manual: true })
  const end = useRequest(endInOutRecord, { ...options, manual: true })
  const { data, run: lockRun } = useRequest(doorState, { ...options, manual: false, initialData: { result: {} }, formatResult: res => res.result })

  //deviceStatus	门锁状态 0未锁 1锁定
  const handleLock = async () => {
    await lock.run({ ...params, deviceStatus: data?.deviceStatus === 1 ? 0 : 1 })
    lockRun(params)
  }
  // 核查
  const onCheck = value => {
    check.run({ isCheck: 1, id: inOutRecordId, operatorId, ...value })
    setCheckVisible(false)
  }
  const [endVisible, setEndVisible] = useState(false)

  // 结束任务
  const endTask = () => {
    Modal.success({
      cancelText: '取消',
      okText: '结束',
      title: '结束任务',
      content: '确定结束当前任务？',
      maskClosable: true,
      // icon: <i className="ico-close"></i>,
      closable: true,
      onOk: () => {
        end.run({ operatorId, status: 1, id: task?.inOutRecordId })
        clearMessage(task?.inOutRecordId)
      },
      onCancel: () => setEndVisible(false)
    })
  }
  const checkForm = (
    <Form onFinish={onCheck} style={{ width: 400 }} layout="vertical">
      <Form.Item name="reason" label="核查结果" style={{ marginBottom: 0 }}>
        <Input.TextArea placeholder="输入核查内容" showCount maxLength={100} rows={4} />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            完成
          </Button>
          <Button onClick={() => setCheckVisible(false)}>取消</Button>
        </Space>
      </Form.Item>
    </Form>
  )
  const [checkVisible, setCheckVisible] = useState(false)
  const popCheck = (
    <Popover title="核查" content={checkForm} trigger="click" visible={checkVisible} onVisibleChange={setCheckVisible}>
      <Button type="link" icon={<i className="ico ico-checks" />} danger>
        核查
      </Button>
    </Popover>
  )

  return (
    <Fragment>
      <Space className="task-bar-button" split={<Divider type="vertical" />}>
        <Spin spinning={open.loading}>
          <Button
            disabled={data?.deviceStatus === 1}
            type="link"
            icon={<i className="ico ico-doors" />}
            onClick={() => open.run({ ...params, type: 3, operatorId, memberId })}>
            开门
          </Button>
        </Spin>
        <Spin spinning={lock.loading}>
          <Button type="link" icon={<i className={`ico ico-lock-${data?.deviceStatus}`} />} onClick={handleLock}>
            {data?.deviceStatus === 0 ? '门锁定' : '门解锁'}
          </Button>
        </Spin>
        {/* <Button type="primary">开灯</Button>
      <Button type="primary">关灯</Button> */}
        {popCheck}
        <Spin spinning={end.loading}>
          <Button icon={<i className="ico ico-exit" />} type="link" onClick={endTask} danger>
            结束
          </Button>
        </Spin>
      </Space>
    </Fragment>
  )
}
