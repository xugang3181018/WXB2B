import React, { Fragment, useState } from 'react'
import { useLocalStorageState } from 'ahooks'
import { historyTask } from 'api'
import { List, Space, Table, Tag, Form, Select, Input, Button, Row, Col, Avatar, Drawer } from 'antd'
import { DatePickRange } from 'component'
const { Option } = Select
import useTableForm from 'hooks/useTableForm'
import { formLayout } from 'layout/formLayout'
import TaskDetail from 'pages/task/TaskDetail'
const { formItemLayout, tailFormItemLayout } = formLayout

export default () => {
  const [login] = useLocalStorageState('login')
  const { appId, operatorId } = login
  const [form] = Form.useForm()
  const defaultParams = [{ base: { appId, operatorId } }]
  const options = { defaultParams, form }
  const { tableProps, search } = useTableForm(historyTask, { ...options, initialData: [] })
  const { type, changeType, submit, reset } = search
  const door = ['进入', '离开']
  const columns = [
    {
      title: '门店Id',
      width: 220,
      render: (v, arg) => {
        const msg = JSON.parse(arg.message)
        return (
          <div>
            <div>{msg.merchantName}</div>
            <div>{msg.merchantCode}</div>
          </div>
        )
      }
    },
    {
      title: '客服',
      dataIndex: 'customerName',
      width: 120
    },
    {
      title: '顾客信息',
      render: (v, arg) => {
        const msg = JSON.parse(arg.message)
        return (
          <List.Item.Meta
            avatar={<Avatar src={msg.headImgUrl} />}
            description={msg.mobile}
            title={
              <div>
                <Tag color={msg.oldMember > 0 ? 'orange' : 'red'}>{msg.oldMember > 0 ? '老' : '新'}</Tag>
                {msg.nickName}
              </div>
            }
          />
        )
      }
    },
    {
      dataIndex: 'createTime',
      title: '分发时间'
    },
    {
      title: '详情',
      width: 80,
      render: (val, arg) => {
        return <a onClick={() => setDetail(JSON.parse(arg?.message || {}))}>详情</a>
      }
    }
  ]
  const advanceSearchForm = (
    <Row className="ant-advanced-search-form">
      <Col span={12}>
        <Form form={form} layout="horizontal" {...formItemLayout}>
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
      <Form form={form} onFinish={submit}>
        <Space>
          <Form.Item name="dateRange">
            <DatePickRange />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary">
              搜索
            </Button>
          </Form.Item>
        </Space>
        {/* <Button type="link" onClick={changeType}>
          高级搜索
        </Button> */}
      </Form>
    </div>
  )

  const [detail, setDetail] = useState(null)

  return (
    <Fragment>
      {type === 'simple' ? searchForm : advanceSearchForm}
      <Table columns={columns} rowKey="id" {...tableProps} />
      <Drawer width={820} title="出入详情" placement="right" closable={true} onClose={() => setDetail(false)} visible={detail} destroyOnClose={true}>
        <TaskDetail {...detail} />
      </Drawer>
    </Fragment>
  )
}
