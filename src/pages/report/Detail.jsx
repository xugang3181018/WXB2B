import React, { useEffect } from 'react'
import { billDetail } from 'api'
import { useRequest, useLocalStorageState } from 'ahooks'
import { Descriptions, List, Spin } from 'antd'
const { Item } = Descriptions
const payType = { WXPAY: '微信支付', ALIPAY: '支付宝支付', MPAY: '会员支付', CASH: '现金支付', BANK: 'pos支付', UNIONPAY: '云闪付' }
const orderStatus = { NOTPAY: '未支付', SUCCESS: '支付成功', REFUND: '转入退款', CLOSED: '已关闭', REVOKED: '已撤销' }
export default function Detail({ outTradeNo, merchantCode }) {
  const { data, loading, run } = useRequest(billDetail, { manual: true })
  const [login] = useLocalStorageState('login')
  const { appId } = login
  useEffect(() => {
    run({ showType: 1, outTradeNo, merchantCode, appId })
  }, [outTradeNo])
  return (
    <Spin spinning={loading}>
      <Descriptions title={<List.Item.Meta title="订单详情" description={data?.outTradeNo} />} column={2}>
        <Item label="支付方式">{payType[data?.payType]}</Item>
        <Item label="实收金额">{payType[data?.receiptAmount]}</Item>
        <Item label="交易金额">{payType[data?.totalAmount]}</Item>
        <Item label="支付方式">{payType[data?.payType]}</Item>
        <Item label="交易状态">{orderStatus[data?.orderStatus]}</Item>
        <Item label="会员等级">{data?.memberLevel}</Item>
        <Item label="会员名">{data?.memberName}</Item>
        <Item label="手机号">{orderStatus[data?.mobile]}</Item>
      </Descriptions>
      <List header={<h3>商品订单</h3>}>
        {data?.orderGoods &&
          data?.orderGoods.map((item, index) => (
            <List.Item key={index} actions={[<span>{Number(item?.price * item?.quantity).toFixed(2)}元</span>]}>
              <List.Item.Meta
                title={item?.goodsName}
                description={
                  <div>
                    <span>{Number(item?.price).toFixed(2)}元</span> × <span>{item?.quantity}</span>
                  </div>
                }
              />
            </List.Item>
          ))}
      </List>
    </Spin>
  )
}
