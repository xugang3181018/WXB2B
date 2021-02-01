import React, { Fragment, useEffect, useState } from 'react'
import { getInOutRecordDetails } from 'api'
import { useRequest, useLocalStorageState } from 'ahooks'
import { Descriptions, Tag, List, Typography, Collapse, Spin, Steps, Row, Avatar, Badge, Empty } from 'antd'
const { Item } = Descriptions
const { Step } = Steps
const { Panel } = Collapse
import moment from 'moment'

// 任务详情
export default function TaskDetail(props) {
  // console.log(props)
  const [login] = useLocalStorageState('login')
  const { id, inOutRecordId } = props
  const { appId } = login
  const detail = useRequest(getInOutRecordDetails, { manual: true, formatResult: res => res.result, initialData: {} })
  const { data } = detail
  const { inOutRecord, orderDetails, operationRecords } = data || {}
  const [activeKeys, setActiveKeys] = useState([0])
  // console.log(123, inOutRecord)
  // console.log(456, orderDetails)
  // console.log(789, operationRecords)

  useEffect(() => {
    ;(id || inOutRecordId) && detail.run({ appId, id: inOutRecordId || id })
    setActiveKeys([0])
  }, [id, inOutRecordId])

  const handleChange = index => {
    setActiveKeys(index)
  }

  const operationItem = item => (
    <List.Item>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <div>
          <Typography.Text mark>[{item.operationId > 0 ? '客服' : '系统'}]</Typography.Text> {item.operationContent}
        </div>
        <a>{item.createTime}</a>
      </div>
    </List.Item>
  )

  const operation = (
    <div style={{ marginBottom: 20 }}>
      <Descriptions title={'操作记录'} />
      {operationRecords && <List dataSource={operationRecords} renderItem={operationItem} />}
    </div>
  )

  const goodsItem = (items, index) => (
    <List.Item key={index} extra={<a>{Number(items.price * items.quantity).toFixed(2)}元</a>}>
      <List.Item.Meta
        title={items?.goodsName}
        description={
          <span>
            {Number(items.price).toFixed(2)} × {items.quantity}
          </span>
        }
      />
    </List.Item>
  )

  const order = (
    <Fragment>
      <Descriptions title={'订单记录'} />
      {orderDetails && orderDetails.length ? (
        <Collapse size="small" expandIconPosition="right" activeKey={activeKeys} onChange={handleChange}>
          {orderDetails.map((item, index) => {
            return (
              <Panel
                header={`订单号：${item.outTradeNo}`}
                key={index}
                extra={moment(item.createTime, 'YYYYMMDDhhmmss').format('YYYY-MM-DD hh:mm:ss')}>
                {JSON.parse(item?.goodsDetail).map(goodsItem)}
              </Panel>
            )
          })}
        </Collapse>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="未购物" />
      )}
    </Fragment>
  )

  const customDot = <div>1</div>
  // const sell = ['未购物', '已支付购买']
  const status = ['未结束', '已结束']

  // recordStatus===0
  const stepZero = (
    <Steps progressDot={customDot} size="small" current={0} style={{ padding: 40 }}>
      <Step title="扫码开门" description={inOutRecord?.inTime} />
    </Steps>
  )

  // recordStatus===1
  const stepOne = (
    <Steps progressDot={customDot} size="small" current={1} style={{ padding: 40 }}>
      <Step title="扫码开门" description={inOutRecord?.inTime} />
      <Step title="开门离开" description={inOutRecord?.outTime} />
    </Steps>
  )

  // recordStatus===2
  const stepTwo = (
    <Steps progressDot={customDot} size="small" current={3} style={{ padding: 40 }}>
      <Step title="扫码开门" description={inOutRecord?.inTime} />
      <Step title="结账" />
      <Step title="开门离开" description={inOutRecord?.outTime} />
    </Steps>
  )

  // recordStatus===3
  const stepThree = (
    <Steps progressDot={customDot} size="small" current={1} style={{ padding: 40 }}>
      <Step title="扫码开门" description={inOutRecord?.inTime} />
      <Step title="结账" />
    </Steps>
  )

  const stepLine = (
    <Fragment>
      {inOutRecord?.recordStatus === 0 && stepZero}
      {inOutRecord?.recordStatus === 1 && stepOne}
      {inOutRecord?.recordStatus === 2 && stepTwo}
      {inOutRecord?.recordStatus === 3 && stepThree}
    </Fragment>
    // <Steps progressDot={customDot} size="small" current={inOutRecord?.outTime ? 2 : 1} style={{ padding: 40 }}>
    //   <Step title="扫码开门" description={inOutRecord?.inTime} />
    //   <Step title="结账" description={sell[inOutRecord?.isSell]} />
    //   {/* 有无第三步 */}
    //   {!inOutRecord?.outTime && <Step title="开门离开" description={inOutRecord?.outTime} />}
    // </Steps>
  )
  const processingStatus = ['未处理', '已处理']

  const head = (
    <div style={{ marginBottom: 30 }}>
      <Descriptions
        bordered
        title={status[inOutRecord?.status]}
        column={2}
        size="small"
        extra={<Badge color={inOutRecord?.isCheck ? 'red' : 'green'} dot={true} text={inOutRecord?.isCheck ? '已核查' : '未核查'} />}>
        <Item label="会员昵称" labelStyle={{ width: 70 }}>
          <List.Item.Meta
            avatar={<Avatar size={44} src={inOutRecord?.headImgUrl} />}
            description={inOutRecord?.mobile}
            title={inOutRecord?.nickName}
          />
        </Item>
        <Item label="门店" labelStyle={{ width: 110 }}>
          <List.Item.Meta description={inOutRecord?.merchantCode} title={inOutRecord?.merchantName} />
        </Item>
        <Item label="会员姓名">{inOutRecord?.memberName || '--'}</Item>
        <Item label="会员手机号">{inOutRecord?.mobile || '--'}</Item>
        <Item label="交易笔数">{inOutRecord?.tradeNumber || '--'}</Item>
        <Item label="商品数">{inOutRecord?.tradeNumber || '--'}</Item>
        <Item label="交易总额">{<a>{Number(inOutRecord?.tradeTotalAmt).toFixed(2)}</a>}</Item>
        <Item label="客服">{inOutRecord?.customerName || '--'}</Item>
        <Item label="会员标签" span={2}>
          {inOutRecord?.memberTag.split(',').map((item, index) => (
            <Tag color="#108ee9" key={index}>
              {item}
            </Tag>
          ))}
        </Item>
        <Item label="处理状态" span={2}>
          <Badge text={processingStatus[inOutRecord?.processingStatus]} color={inOutRecord?.processingStatus ? 'green' : 'red'} />
        </Item>
        <Item label="核查原因" span={2}>
          <a>{inOutRecord?.reason || '--'}</a>
        </Item>
      </Descriptions>
    </div>
  )

  return (
    <Spin spinning={detail.loading}>
      {stepLine}
      {head}
      {operation}
      {order}
    </Spin>
  )
}
