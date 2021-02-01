import React, { useEffect, useCallback, useState, useContext, Fragment } from 'react'
import { deviceList, shopList } from 'api'
import { GlobalContext } from 'context/GlobalState'
import { Table, Select, Space, Form, Tag, Row, Card, Switch, List, Button, Input } from 'antd'
const { Option } = Select
import { useRequest } from 'ahooks'

const type = ['灯', '摄像头', '门', '拾音器', '扩音器']
const deviceStatus = ['未锁', '锁定']
const status = ['正常', '删除']
const columns = [
  {
    title: '核心商户编码',
    dataIndex: 'superMerchantCode'
  },
  {
    title: '机构编码',
    dataIndex: 'merchantCode'
  },
  {
    title: '设备名称',
    dataIndex: 'deviceName'
  },
  {
    title: '设备编码',
    dataIndex: 'deviceCode'
  },
  {
    title: '设备状态',
    dataIndex: 'deviceStatus',
    render: value => <Tag style={{ width: 80 }}>{deviceStatus[value]}</Tag>
  },
  {
    title: '状态',
    dataIndex: 'status',
    render: value => <Tag style={{ width: 80 }}>{status[value]}</Tag>
  },
  {
    title: '设备状态',
    dataIndex: 'hardwareStatus'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime'
  }
]
export default function Device(props) {
  const [form] = Form.useForm()
  const [other, setOther] = useState({ deviceStatus: 0, deviceStatusCount: 0 })
  const { login } = useContext(GlobalContext)
  const { merchantCode, appId } = login
  const defaultParams = [
    {
      currentPage: 1,
      appId,
      merchantCode,
      pageSize: 20
    }
  ]
  const tableOption = {
    refreshDeps: [merchantCode],
    defaultParams,
    form,
    onSuccess: res => {
      setOther(res.result.other)
    }
  }
  const { data, run } = useRequest(deviceList, tableOption)
  const { data: merchantData, loading } = useRequest(shopList, { initialData: { result: [] }, defaultParams: [{ appId }] })
  return (
    <div>
      <Row justify="space-between" style={{ marginBottom: 30 }}>
        <Select style={{ width: 200 }} loading={loading} onChange={merchantCode => run({ appId, merchantCode })} placeholder="选择门店">
          {merchantData &&
            merchantData.result.map((item, index) => (
              <Option key={index} value={item.merchantCode}>
                {item.merchantName}
              </Option>
            ))}
        </Select>
        <Space>
          <Button type="link">设备状态:{other?.deviceStatus || 0} </Button>
          <Button type="link">设备数量:{other?.deviceStatusCount || 0} </Button>
        </Space>
      </Row>
      <List
        dataSource={data?.result}
        locale={{ emptyText: '没有绑定任何设备' }}
        renderItem={item => {
          return (
            <Card
              title={
                <Fragment>
                  <Tag color="orange">{status[item.status]}</Tag>
                  <span>{item.deviceName || 'Device Name'}</span>
                </Fragment>
              }
              style={{ marginBottom: 20 }}
              extra={<Switch checkedChildren="锁定" unCheckedChildren="未锁" defaultChecked checked={item.deviceStatus} />}>
              <Card.Meta
                avatar={<i className="ico-door" style={{ fontSize: 54 }} />}
                title={item.merchantCode}
                description={
                  <p style={{ fontSize: 12 }}>
                    <div>创建日期：{item.createTime}</div>
                    <div>设备编号：{item.deviceCode}</div>
                    <div>机构编号：{item.merchantCode}</div>
                  </p>
                }
              />
            </Card>
          )
        }}
      />
      {/* {data?.result.map((item, index) => {
          return (
            <Col span={8} key={index}>
              
            </Col>
          )
        })} */}
      {/* <Table columns={columns} {...tableProps} rowKey="id" /> */}
    </div>
  )
}
