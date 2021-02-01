import React, { useState } from 'react'
import { goodsList, goodsUpdate } from 'api'
import { Table, Row, Col, Form, Input, Space, Button, Select, Divider, Image, List, Popover, message } from 'antd'
const { Option } = Select
import { Link } from 'react-router-dom'
import { useLocalStorageState, useRequest } from 'ahooks'
import { MerchantSelect } from 'component'
import useTableForm from 'hooks/useTableForm'
import normalImg from 'images/normal.png'

// 商品列表
export default React.memo(props => {
  const [login] = useLocalStorageState('login')
  const { appId } = login
  const [form] = Form.useForm()
  const status = ['在售', '售罄', '预淘汰', '淘汰']

  // 商品列表
  const defaultParams = [{ base: { appId } }]
  const options = { form, defaultParams, paginated: true, cacheKey: 'goodsList' }
  // 格式化
  const formatResult = res => {
    const list = res?.result?.map(item => {
      item.visible = false
      return item
    })
    return {
      list,
      total: res.totalCount
    }
  }
  const { tableProps, search, run, params: args, mutate, refresh } = useTableForm(goodsList, { ...options, formatResult })
  const { type, changeType, submit, reset } = search

  // 商品修改成功
  const onSuccess = res => {
    res.code === 'FAILED' && message.warn(res.msg)
    if (res.code === 'SUCCESS') {
      message.success(res.msg)
    }
  }

  // 商品修改
  const update = useRequest(goodsUpdate, { manual: true, onSuccess })
  const goodsRes = params => {
    update.run({ ...params, appId }).then(res => {
      refresh()
    })
  }

  const handleVisibleChange = (visible, index) => {
    mutate(data => {
      data.list[index].visible = visible
      return data
    })
  }
  const columns = [
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      width: 300,
      render: (value, arg) => {
        return (
          <List.Item.Meta avatar={<Image fallback={normalImg} src={arg.goodsImg} width={44} height={44} />} title={value} description={arg.goodsId} />
        )
      }
    },
    {
      title: '品牌',
      dataIndex: 'goodsBrand'
    },
    {
      title: '进货价',
      dataIndex: 'goodsCostPrice',
      render: val => <a>¥{val}</a>
    },
    {
      title: '零售价',
      dataIndex: 'goodsPrice',
      render: val => <a>¥{val}</a>
    },
    {
      title: '创建时间',
      dataIndex: 'createTime'
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      align: 'center',
      render: (text, arg, index) => {
        return (
          <Space split={<Divider type="vertical" />}>
            <Popover
              placement="bottomRight"
              visible={arg.visible}
              onVisibleChange={val => handleVisibleChange(val, index)}
              content={
                <div style={{ padding: '15px 15px 0' }}>
                  <Form initialValues={arg} style={{ width: 440 }} onFinish={goodsRes} labelCol={{ span: 4 }}>
                    <Form.Item name="goodsName" label="商品名称" rules={[{ required: true, message: '必填商品名称!' }]}>
                      <Input />
                    </Form.Item>
                    <Form.Item name="goodsPrice" label="商品价格" rules={[{ required: true, message: '必填商品价格!' }]}>
                      <Input />
                    </Form.Item>
                    <Form.Item name="categoryId" hidden />
                    <Form.Item name="goodsUnitId" hidden />
                    <Form.Item name="goodsBrandId" hidden />
                    <Form.Item name="goodsCostPrice" label="成本价格">
                      <Input />
                    </Form.Item>
                    <Form.Item name="goodsBarcode" hidden />
                    <Form.Item name="goodsId" hidden>
                      <Input />
                    </Form.Item>
                    <Form.Item name="merchantCode" hidden />
                    <Form.Item name="goodsStatus" label="商品状态" rules={[{ required: true }]}>
                      <Select>
                        {status.map((item, index) => {
                          return (
                            <Option value={index} key={index}>
                              {item}
                            </Option>
                          )
                        })}
                      </Select>
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit" loading={update.loading}>
                        保存
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              }
              title="商品编辑"
              trigger="click">
              <a>编辑</a>
            </Popover>
          </Space>
        )
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
  const searchForm = (
    <div>
      <Form style={{ display: 'flex' }} form={form}>
        <Space>
          <Form.Item name="merchantCode">
            <MerchantSelect placeholder="选择门店" onChange={submit} />
          </Form.Item>
          <Form.Item name="goodsInfo">
            <Input.Search
              placeholder="商品名/条形码/商品Id"
              style={{
                width: 240
              }}
              allowClear
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

  return (
    <div>
      <Row style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        {type === 'simple' ? searchForm : advanceSearchForm}
        <Space>
          <Button type="primary">
            <Link to="/merchant/goods/modify/new">创建商品</Link>
          </Button>
          <Button>导入商品</Button>
        </Space>
      </Row>
      <Table columns={columns} {...tableProps} rowKey="goodsId" />
    </div>
  )
})
