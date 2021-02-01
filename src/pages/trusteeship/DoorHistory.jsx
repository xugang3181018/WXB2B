import React, { Fragment, useState } from 'react'
import { Table, Tag, Form, Input, Row, Col, Select, Button, List, Image, Drawer } from 'antd'
const { Option } = Select
import { inOutList } from 'api'
import useTableForm from 'hooks/useTableForm'
import { GlobalContext } from 'context/GlobalState'
import TaskDetail from 'pages/task/TaskDetail'
import { MerchantSelect } from 'component'

const sex = ['未知 ', '男 ', '女']

export default props => {
  const { login } = React.useContext(GlobalContext)
  const { appId } = login
  const [form] = Form.useForm()
  const { tableProps, search, run, refresh } = useTableForm(inOutList, {
    form,
    paginated: true,
    defaultParams: [{ base: { appId } }]
  })
  const { type, changeType, submit, reset } = search

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
  const merchantChange = merchantCode => {
    run({ merchantCode, appId })
  }

  const [detail, setDetail] = useState(null)
  const columns = [
    {
      dataIndex: 'nickName',
      title: '会员昵称',
      width: 200,
      render: (val, arg) => {
        return <List.Item.Meta avatar={<Image width={44} src={arg.headImgUrl} />} title={val} description={arg.mobile} />
      }
    },
    {
      dataIndex: 'inTime',
      title: '进出时间',
      render: (val, arg) => {
        return (
          <div>
            <div>{arg.inTime}</div>
            <div>{arg.outTime}</div>
          </div>
        )
      }
    },
    {
      dataIndex: 'merchantName',
      title: '门店名称',
      render: (val, arg) => {
        return (
          <div>
            <div>{val}</div>
            <div>{arg.merchantCode}</div>
          </div>
        )
      }
    },
    {
      dataIndex: 'tradeNumber',
      title: '交易笔数'
    },
    {
      dataIndex: 'commodityNumber',
      title: '件数'
    },
    {
      dataIndex: 'tradeTotalAmt',
      title: '交易总额'
    },
    {
      dataIndex: 'employeeName',
      title: '客服姓名'
    },
    {
      dataIndex: 'isCheck',
      title: '是否核查',
      render: val => <Tag>{val ? '已核查' : '未核查'}</Tag>
    },
    {
      title: '详情',
      render: (val, arg) => {
        return <a onClick={() => setDetail(arg)}>详情</a>
      }
    }
  ]

  const searchForm = (
    <div>
      <Form form={form} style={{ display: 'flex' }}>
        <Form.Item name="merchantCode">
          <MerchantSelect onChange={submit} />
        </Form.Item>
        {/* <Form.Item name="memberId">
          <Input.Search
            placeholder="输入手机号/姓名/昵称"
            style={{
              width: 240
            }}
            onSearch={mobile => run({ mobile })}
          />
        </Form.Item>
        <Button type="link" onClick={changeType}>
          高级搜索
        </Button> */}
      </Form>
    </div>
  )
  return (
    <Fragment>
      <Row justify="space-between">
        {type === 'simple' ? searchForm : advanceSearchForm}
        <Col>
          <Button type="primary" onClick={refresh}>
            刷新
          </Button>
        </Col>
      </Row>
      <Table columns={columns} rowKey="id" {...tableProps} />
      <Drawer width={820} title="出入详情" placement="right" closable={true} onClose={() => setDetail(false)} visible={detail} destroyOnClose={true}>
        <TaskDetail {...detail} />
      </Drawer>
    </Fragment>
  )
}
