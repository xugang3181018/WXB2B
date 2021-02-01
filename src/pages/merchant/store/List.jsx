import React, { Fragment, useState } from 'react'
import { Table, Space, Form, Input, Row, Col, Select, Button, Image, Tag, List, Divider, Drawer, Spin, message, Switch } from 'antd'
const { Option } = Select
import { shopList, distribute, doorOpen, doorLockOperation } from 'api'
import { useLocalStorageState, useRequest } from 'ahooks'
import { Link } from 'react-router-dom'
import useTableForm from 'hooks/useTableForm'
import useMerchant from 'hooks/useMerchant'
import Detail from './Detail'

const doorLock = ['已开启', '已锁定']
const status = ['未托管', '已托管', '禁用', '删除']

// 门店列表
export default React.memo(props => {
  const [visible, setVisible] = useState(false)
  const [login] = useLocalStorageState('login')
  const { appId, operatorId } = login
  const [form] = Form.useForm()
  const { update, lock } = useMerchant()

  const onSuccess = res => {
    message.info(res.msg)
  }
  // 开门
  const door = useRequest(doorOpen, { manual: true, onSuccess })

  // 门店列表
  let base = { appId, pageSize: 20 }
  const defaultParams = [{ base }]
  const options = { form, paginated: true, defaultParams, cacheKey: 'merchantList' }

  const { tableProps, search, run, refresh } = useTableForm(shopList, { ...options, refreshDeps: [lock.data, update.data] })
  const { type, changeType, submit, reset } = search

  const columns = [
    {
      dataIndex: 'superMerchantCode',
      title: '门店信息',
      width: 170,
      render: (value, arg) => <List.Item.Meta title={arg.merchantName} description={value} />
    },
    {
      dataIndex: 'address',
      title: '地区',
      width: 400,
      render: val => {
        const address = val.split(',')
        return <List.Item.Meta title={address[0]} description={address[1]} />
      }
    },
    {
      dataIndex: 'status',
      title: '托管',
      width: 70,
      render: (val, arg) => (
        <Switch
          checkedChildren="开"
          unCheckedChildren="关"
          onClick={() => update.run({ merchantCode: arg.merchantCode, status: val ? 0 : 1, appId })}
          checked={val}
        />
      )
    },
    {
      dataIndex: 'doorLock',
      width: 70,
      title: '门锁状态',
      render: (val, arg) => {
        const lockParams = { appId, merchantCode: arg.merchantCode, deviceStatus: val === 0 ? 1 : 0 }
        return <Switch checkedChildren="开" unCheckedChildren="关" onClick={() => lock.run(lockParams)} checked={!val} />
      }
    },
    {
      dataIndex: 'doorQrCode',
      width: 80,
      title: '门二维码',
      align: 'center',
      render: (value, arg) => <Image width={30} src={value} />
    },
    {
      dataIndex: 'tableQrCode',
      width: 80,
      align: 'center',
      title: '桌二维码',
      render: (value, arg) => <Image width={30} src={value} />
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 160,
      render: (text, arg) => {
        const { merchantCode } = arg
        return (
          <Space split={<Divider type="vertical" />}>
            <Link to={`/merchant/store/modify/${arg.merchantCode}`}>编辑</Link>
            {status === 1 && doorLock === 0 && (
              <Spin spinning={door.loading} key={arg.merchantCode}>
                <a onClick={() => door.run({ appId, merchantCode, type: 2, operatorId })}>开门</a>
              </Spin>
            )}
            <a onClick={() => setVisible(arg)}>详情</a>
          </Space>
        )
      }
    }
  ]

  const advanceSearchForm = (
    <div>
      <Form form={form}>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="name">
              <Input placeholder="name" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="email" name="mobile">
              <Input placeholder="手机号" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Form.Item
            style={{
              display: 'flex',
              justifyContent: 'flex-end'
            }}>
            <Button type="primary" onClick={submit}>
              搜索会员
            </Button>
            <Button
              onClick={reset}
              style={{
                marginLeft: 16
              }}>
              重置
            </Button>
            <Button type="link" onClick={changeType}>
              返回
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </div>
  )
  const searchForm = (
    <div>
      <Form form={form} style={{ display: 'flex' }}>
        <Form.Item name="merchantCode">
          <Input.Search placeholder="输入名称/核心编号" onSearch={submit} />
        </Form.Item>
        {/* <Button type="link" onClick={changeType}>
          高级搜索
        </Button> */}
      </Form>
    </div>
  )
  return (
    <Fragment>
      <Row justify="space-between">
        {type === 'simple' ? searchForm : advanceSearchForm}
        <Button type="primary">
          <Link to="/merchant/store/modify/new">创建门店</Link>
        </Button>
      </Row>
      <Table columns={columns} rowKey="id" {...tableProps} />
      <Drawer visible={visible} onClose={() => setVisible(false)} width="550" title="门店详情">
        <Detail refresh={refresh} {...visible} />
      </Drawer>
    </Fragment>
  )
})
