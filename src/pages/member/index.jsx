import React, { Fragment, useState } from 'react'
import { Table, Space, Form, Input, Row, Col, Select, Button, DatePicker, Image, List, Drawer } from 'antd'
const { RangePicker } = DatePicker
const { Option } = Select
import { memberList } from 'api'
import useTableForm from 'hooks/useTableForm'
import { GlobalContext } from 'context/GlobalState'
import { formLayout } from 'layout/formLayout'
const { formItemLayout, tailFormItemLayout } = formLayout
import MemberDetail from './MemberDetail'
import { MerchantSelect } from 'component'

const sex = ['未知 ', '男 ', '女']

export default props => {
  const { login } = React.useContext(GlobalContext)
  const { appId } = login
  const [form] = Form.useForm()
  const base = { appId }
  const defaultParams = [{ base }]
  const options = {
    form,
    paginated: true,
    defaultParams
  }
  const { tableProps, search, run } = useTableForm(memberList, options)
  const { type, changeType, submit, reset } = search

  const advanceSearchForm = (
    <Row className="ant-advanced-search-form">
      <Col span={12}>
        <Form form={form} layout="horizontal" {...formItemLayout}>
          <Form.Item label="注册时间">
            <RangePicker showTime />
          </Form.Item>
          <Form.Item label="昵称" name="nickName">
            <Input placeholder="name" />
          </Form.Item>
          <Form.Item label="手机号" name="mobile">
            <Input placeholder="手机号" />
          </Form.Item>
          <Form.Item name="gender" label="选择性别">
            <Select placeholder="选择性别" onChange={gender => run({ gender })}>
              <Option value="0">未知</Option>
              <Option value="1">男</Option>
              <Option value="2">女</Option>
            </Select>
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
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
              收起
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  )
  const searchForm = (
    <div>
      <Form form={form} style={{ display: 'flex' }}>
        <Space>
          <Form.Item name="merchantCode">
            <MerchantSelect placeholder="选择门店" onChange={submit} />
          </Form.Item>
          <Form.Item name="mobile">
            <Input.Search
              placeholder="输入手机号/姓名/昵称"
              style={{
                width: 240
              }}
              onSearch={submit}
            />
          </Form.Item>
        </Space>
        {/* <Button type="link" onClick={changeType}>
          高级搜索
        </Button> */}
      </Form>
    </div>
  )
  const [member, setMember] = useState(false)

  const columns = [
    {
      dataIndex: 'nickName',
      title: '会员信息',
      width: 200,
      render: (value, arg) => {
        return <List.Item.Meta avatar={<Image width={44} src={arg.headImgUrl} />} title={value} description={arg.mobile} />
      }
    },
    {
      dataIndex: 'sex',
      title: '性别',
      width: 90,
      render: value => <span>{sex[value]}</span>
    },
    {
      dataIndex: 'createDate',
      title: '注册时间'
    },
    {
      dataIndex: 'merchantName',
      title: '门店名称'
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (text, arg) => (
        <Space size="middle">
          <a onClick={() => setMember(arg)}>详情</a>
        </Space>
      )
    }
  ]

  const rowChange = record => {
    return {
      onClick: ev => {
        setMember(record)
      }
    }
  }
  return (
    <Fragment>
      <div>
        {/* <Row justify="space-between">
          <Col>{searchForm}</Col>
          <Col>
            <Button type="primary" onClick={run}>
              刷新
            </Button>
          </Col>
        </Row> */}
        {type === 'simple' ? searchForm : advanceSearchForm}
        <Table onRow={rowChange} columns={columns} rowKey="id" {...tableProps} size="large" />
      </div>
      <Drawer width={900} title="会员详情" placement="right" closable={true} onClose={() => setMember(false)} visible={member} destroyOnClose={true}>
        <MemberDetail {...member} />
      </Drawer>
    </Fragment>
  )
}
