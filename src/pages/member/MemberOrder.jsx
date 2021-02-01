import React, { Fragment, useEffect, useCallback } from 'react'
import { Avatar, List, Table } from 'antd'
import { memberOrderDetail } from 'api'
import { useLocalStorageState } from 'ahooks'
import useTableForm from 'hooks/useTableForm'
import moment from 'moment'
const columns = [
  {
    dataIndex: 'merchantCode',
    title: '消费门店',
    reunder: (value, arg) => (
      <div>
        <div>{arg.merchantName}</div>
        <div>{value}</div>
      </div>
    )
  },
  {
    dataIndex: 'createTime',
    title: '订单日期'
  },
  {
    dataIndex: 'totalAmount',
    title: '消费金额',
    reunder: value => <a>¥{Number(value).toFixed(2)}元</a>
  }
]

export default function OrderList(props) {
  const [login] = useLocalStorageState('login')
  const { memberId } = props
  const { appId } = login
  const base = { memberId, appId }
  const defaultParams = [{ base }]
  const { tableProps } = useTableForm(memberOrderDetail, { defaultParams })

  const expandedRowRender = record => {
    const col = [
      { title: '商品名称', dataIndex: 'goodsName' },
      { title: '价格', dataIndex: 'price' },
      { title: '数量', dataIndex: 'quantity' },
      { title: '合计', dataIndex: 'totalAmount' }
    ]
    return (
      <List
        dataSource={record.orderGoods}
        pagination={false}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              title={item.goodsName}
              description={
                <div>
                  {Number(item.price).toFixed(2)} × {item.quantity}
                </div>
              }
            />
            <a>¥{Number(item.quantity * item.price).toFixed(2)}</a>
          </List.Item>
        )}
      />
    )
  }

  return (
    <Table
      {...tableProps}
      indentSize={0}
      columns={columns}
      expandable={{ expandedRowRender, rowExpandable: record => record.orderGoods !== 'Not Expandable' }}
      size="small"
      rowKey="outTradeNo"
    />
  )
}
