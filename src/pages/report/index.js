import React, { useState, Fragment } from 'react'
import { goodsList, goodsUpdate, billAll } from 'api'
import { Table, Row, Col, Form, Input, Space, Button, Select, Divider, Image, List, Tag, message, Avatar, Radio, Drawer } from 'antd'
const { Option } = Select
import { useLocalStorageState, useRequest } from 'ahooks'
import useTableForm from 'hooks/useTableForm'
import { MerchantSelect, DatePickRange } from 'component'
const payType = { WXPAY: '微信支付', ALIPAY: '支付宝支付', MPAY: '会员支付', CASH: '现金支付', BANK: 'pos支付', UNIONPAY: '云闪付' }
import moment from 'moment'
import Detail from './Detail'

// 商品列表
export default React.memo(props => {
  const [login] = useLocalStorageState('login')
  const { appId } = login
  const [form] = Form.useForm()

  // 商品列表
  const defaultParams = [{ base: { appId, billBeginTime: '20201211000000', billEndTime: '20201214235959', orderSource: 11, orderStatus: 'SUCCESS' } }]
  const options = { form, defaultParams, paginated: true, cacheKey: 'billAll' }
  // 格式化
  const formatResult = res => {
    return {
      list: res.orderDetails,
      total: res.totalCount
    }
  }
  const { tableProps, search, run, params: args, mutate } = useTableForm(billAll, { ...options, formatResult })
  const { type, changeType, submit, reset } = search

  const columns = [
    {
      title: '会员信息',
      dataIndex: 'memberName',
      width: 300,
      render: (value, arg) => {
        return <List.Item.Meta title={value} description={arg.mobile} />
      }
    },
    {
      title: '门店',
      dataIndex: 'merchantName',
      width: 300,
      render: (value, arg) => {
        return <List.Item.Meta title={value} description={arg.merchantCode} />
      }
    },
    {
      title: '支付方式',
      dataIndex: 'payType',
      render: val => <Tag>{payType[val]}</Tag>
    },
    {
      title: '支付金额',
      dataIndex: 'totalAmount',
      render: val => <a>¥{val}</a>
    },
    {
      title: '创建时间',
      dataIndex: 'payTime',
      render: val => moment(val, 'YYYYMMDDhhmmss').format('YYYY-MM-DD hh:mm:ss')
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      align: 'center',
      render: (text, arg, index) => {
        return <a onClick={() => setVisible(arg)}>详情</a>
      }
    }
  ]

  const advanceSearchForm = (
    <div>
      <Form form={form}>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="商品品牌" name="brand">
              <Input placeholder="name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="所属机构" name="goodsInfo">
              <Input placeholder="商品名称/商品条形码码/商品Id" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="商品状态" name="size">
              <Input placeholder="name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="商品筛选" name="barcode">
              <Input placeholder="商品名称/商品条形码码/商品Id" />
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
              搜索
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

  const dateString = 'YYYYMMDDhhmmss'
  const dateSee = 'YYYY-MM-DD hh-mm-ss'
  const billEndTime = moment(new Date()).format(dateString)
  const formatTime = str => moment(str, dateSee).format(dateString)
  const formatView = str => moment(str, dateString).format(dateSee)

  const beginDate = day =>
    moment()
      .subtract(day, 'days')
      .format(dateString)

  const allDate = [billEndTime, beginDate(7), beginDate(30)]
  const [dateStr, setDateStr] = useState([formatView(billEndTime), formatView(billEndTime)])
  const dateChange = val => {
    const [billBeginTime, billEndTime] = val
    billBeginTime && form.setFieldsValue({ billBeginTime: formatTime(billBeginTime), billEndTime: formatTime(billEndTime) })
  }
  const dateGroupChange = val => {
    const billBeginTime = allDate[val]
    form.setFieldsValue({ billBeginTime, billEndTime })
  }

  const searchForm = (
    <div>
      <Form form={form} onFinish={submit}>
        <Space>
          <Form.Item name="merchantCode">
            <MerchantSelect />
          </Form.Item>
          <Form.Item name="billBeginTime" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="billEndTime" hidden>
            <Input />
          </Form.Item>
          {/* <Form.Item>
            <Radio.Group defaultValue={0} onChange={dateGroupChange}>
              {['今天', '近一周', '近30日'].map((item, index) => (
                <Radio.Button key={index} value={index}>
                  {item}
                </Radio.Button>
              ))}
            </Radio.Group>
          </Form.Item> */}
          <Form.Item>
            <DatePickRange value={dateStr} onChange={dateChange} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              筛选
            </Button>
          </Form.Item>
        </Space>
        {/* <Button type="link" onClick={changeType}>
          高级搜索
        </Button> */}
      </Form>
    </div>
  )
  const [visible, setVisible] = useState(false)
  return (
    <Fragment>
      <div>
        <Row style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          {type === 'simple' ? searchForm : advanceSearchForm}
        </Row>
        <Table columns={columns} {...tableProps} rowKey="outTradeNo" />
      </div>
      <Drawer visible={visible} onClose={() => setVisible(false)} width="550" title="订单详情">
        <Detail {...visible} />
      </Drawer>
    </Fragment>
  )
})
