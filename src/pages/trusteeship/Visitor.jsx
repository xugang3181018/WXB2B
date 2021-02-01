import React, { Fragment } from 'react'
import { Table, Space, Form, Input, Row, Col, Select, Button, Image } from 'antd'
const { Option } = Select
import { getVisitors } from 'api'
import { GlobalContext } from 'context/GlobalState'
import useTableForm from 'hooks/useTableForm'
import normalImage from 'images/normal.png'
import { MerchantSelect } from 'component'

const sex = ['未知', '男', '女']
const columns = [
  // {
  //   dataIndex: 'facesImage',
  //   title: '人脸图片',
  //   width: 90,
  //   render: value => <Image fallback={normalImage} src={value} width={50} />
  // },
  {
    title: '门店',
    render: (value, arg) => {
      return (
        <div>
          <h5>{arg.merchantName}</h5>
          <div>{arg.merchantCode}</div>
        </div>
      )
    }
  },
  {
    dataIndex: 'age',
    title: '年龄区间'
  },
  {
    dataIndex: 'gender',
    render: value => <span>{value >= 0 ? sex[value] : '未知'}</span>,
    title: '性别'
  },
  {
    dataIndex: 'createTime',
    title: '时间',
    width: 200
  }
]
export default props => {
  const { login } = React.useContext(GlobalContext)
  const { merchantCode, appId } = login
  const [form] = Form.useForm()

  const defaultParams = [
    {
      base: {
        appId
      }
    }
  ]

  const { tableProps, search, run, params, refresh } = useTableForm(getVisitors, {
    form,
    paginated: true,
    defaultParams
  })
  // console.log(params)
  const { type, changeType, submit, reset } = search
  const advanceSearchForm = (
    <Fragment>
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
    </Fragment>
  )

  const searchForm = (
    <div>
      <Form form={form} style={{ display: 'flex' }}>
        <Space>
          <Form.Item name="merchantCode">
            <MerchantSelect onChange={submit} />
          </Form.Item>
          <Form.Item name="gender">
            <Select placeholder="选择性别" style={{ width: 120 }} onChange={submit}>
              <Option value="0">未知</Option>
              <Option value="1">男</Option>
              <Option value="2">女</Option>
            </Select>
          </Form.Item>
          {(params[1]?.gender || params[1]?.merchantCode) && (
            <Form.Item>
              <Button type="link" onClick={reset}>
                清空筛选
              </Button>
            </Form.Item>
          )}
        </Space>
        {/* <Form.Item name="memberId">
          <Input.Search
            placeholder="输入手机号/姓名/昵称"
            style={{
              width: 240
            }}
            onSearch={mobile => run({ mobile })}
          />
        </Form.Item> */}
        {/* <Button type="link" onClick={changeType}>
          高级搜索
        </Button> */}
      </Form>
    </div>
  )
  return (
    <div>
      <Row justify="space-between">
        {type === 'simple' ? searchForm : advanceSearchForm}
        <Col>
          <Button type="primary" onClick={refresh}>
            刷新
          </Button>
        </Col>
      </Row>
      <Table columns={columns} rowKey="id" {...tableProps} />
    </div>
  )
}
