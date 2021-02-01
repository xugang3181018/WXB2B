// 客服列表
import React, { Fragment, useState, useEffect } from 'react'
import { Table, Space, Form, Input, Row, Col, Select, Button, Image, List, Drawer, Tag, Divider, Popover, message } from 'antd'
const { Option } = Select
import { ymCustomerList, insertShopCustomerEmpRelation, shopSelect } from 'api'
import { GlobalContext } from 'context/GlobalState'
import { Link } from 'react-router-dom'
import StaffDetail from './Detail'
import useTableForm from 'hooks/useTableForm'
import { useRequest } from 'ahooks'
const sex = ['男 ', '女']

export default props => {
  const { login } = React.useContext(GlobalContext)
  const { merchantCode, appId } = login
  const [form] = Form.useForm()
  const base = { appId }
  const defaultParams = [{ base }]
  const { tableProps, search, mutate, refresh } = useTableForm(ymCustomerList, {
    form,
    paginated: true,
    defaultParams
  })
  const { type, changeType, submit, reset } = search
  // 门店
  const merchant = useRequest(shopSelect, { formatResult: res => res.result, defaultParams: [{ ...base }] })
  // 客服绑定门店
  const pin = useRequest(insertShopCustomerEmpRelation, {
    manual: true,
    formatResult: res => {
      message.info(res.msg)
      return res
    },
    defaultParams: [base]
  })
  // 绑定门店
  // const selectMerchant = (merchantCode, arg, index) => {
  //   let arr = arg.merchantCodes ? arg.merchantCodes.split('/') : []
  //   const bindingStatus = arr.some(item => item === merchantCode) ? 0 : 1
  //   // let merchantCodes = arr.some(item => item === merchantCode) ? arr.splice(index, 1).join(',') : [...arr, merchantCode].join(',')
  //   pin.run({ appId, merchantCodes: merchantCode, operatorId: arg.id, bindingStatus }).then(res => {
  //     refresh()
  //   })
  //   // mutate(res => {
  //   //   let arr = res.list[index].merchantCodes ? res.list[index].merchantCodes.split('/') : []
  //   //   res.list[index].merchantCodes = arr.some(item => item === merchantCode) ? arr.splice(index, 1).join('/') : [...arr, merchantCode].join('/')
  //   //   return res
  //   // })
  // }
  const [merchantVisible, setMerchantVisible] = useState(false)

  useEffect(() => {
    merchantVisible.merchantCodes && merchant.run({ appId })
  }, [merchantVisible])

  const columns = [
    {
      title: '客服',
      width: 230,
      render: (value, arg) => {
        return <List.Item.Meta avatar={<Image width={50} src={arg.headImgUrl} />} title={arg.employeeName} description={arg.mobile} />
      }
    },
    {
      dataIndex: 'typeName',
      title: '员工类型'
    },
    {
      dataIndex: 'levelName',
      title: '客服等级',
      render: value => <Tag color="red">{value}</Tag>
    },
    {
      dataIndex: 'gender',
      title: '性别',
      render: value => <span>{sex[value]}</span>
    },
    {
      dataIndex: 'createTime',
      title: '创建时间1',
      width: 300
    },
    // {
    //   dataIndex: 'merchants',
    //   title: '管理门店',
    //   render: (val, arg, index) => {
    //     return <Fragment>{val ? val : '未绑定门店'}</Fragment>
    //   }
    // },
    {
      title: '操作',
      align: 'center',
      // width: 300,
      render: (val, arg, index) => {
        // let current = arg.merchantCodes ? arg.merchantCodes.split('/') : []
        // const merchantItem = item => {
        //   const arr = current.some(itm => itm === item.merchantCode) ? <a className="ico-checks" style={{ fontSize: 18 }} /> : null
        //   return (
        //     <List.Item onClick={() => selectMerchant(item.merchantCode, arg, index)} actions={[arr]}>
        //       {item.merchantName}
        //     </List.Item>
        //   )
        // }
        // const content = (
        //   <List style={{ width: 400 }} dataSource={merchant?.data} locale={{ emptyText: '所有门店已绑定客服' }} renderItem={merchantItem} />
        // )
        return (
          <Space split={<Divider type="vertical" />}>
            <Link to={`/staff/modify/${arg.id}`}>编辑</Link>
            {/* <Popover trigger="click" placement="bottom" title="管理门店" content={content} style={{ width: 400 }}>
              <Button type="link">绑定门店</Button>
            </Popover> */}
            <a onClick={() => setDetail(arg.id)}>详情</a>
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
        <Form.Item name="mobile">
          <Input.Search
            placeholder="输入手机号查询"
            style={{
              width: 240
            }}
            onSearch={submit}
          />
        </Form.Item>
        {/* <Button type="link" onClick={changeType}>
          高级搜索
        </Button> */}
      </Form>
    </div>
  )

  const [detail, setDetail] = useState(false)
  return (
    <Fragment>
      <div>
        <Row justify="space-between">
          {type === 'simple' ? searchForm : advanceSearchForm}
          <Col>
            <Space>
              <Button onClick={submit}>刷新</Button>
              <Button type="primary">
                <Link to="/staff/modify/new">创建客服</Link>
              </Button>
            </Space>
          </Col>
        </Row>
        <Table columns={columns} rowKey="id" {...tableProps} />
      </div>
      <Drawer width={900} title="客服详情" placement="right" closable={true} onClose={() => setDetail(false)} visible={detail}>
        <StaffDetail id={detail} />
      </Drawer>
    </Fragment>
  )
}
