import React, { Fragment } from 'react'
import { Form, Input, Button, Space, Row, Col, PageHeader } from 'antd'
import { formLayout } from 'layout/formLayout'
const { formItemLayout, tailFormItemLayout } = formLayout
import { Link, useParams, useLocation, useHistory } from 'react-router-dom'
import { goodsSave } from 'api'
import { useRequest, useLocalStorageState } from 'ahooks'

export default function GoodsModify(props) {
  const [form] = Form.useForm()
  const { id } = useParams()
  const save = useRequest(goodsSave, { manual: true })
  const [login] = useLocalStorageState('login')
  const { appId, merchantCode } = login

  const normalParams = {
    categoryId: 0,
    goodsUnitId: 0,
    goodsBrandId: 0,
    goodsCostPrice: 0,
    goodsStatus: 0
  }

  const goodsUpdate = val => {
    save.run({ ...val, appId, merchantCode, ...normalParams })
  }
  return (
    <div>
      <PageHeader
        onBack={() => props.history.goBack()}
        title={id === 'new' ? '新建商品' : '编辑商品'}
        subTitle="商品基本信息"
        style={{ marginBottom: 20 }}
      />
      <Row>
        <Col span={14}>
          <Form form={form} {...formItemLayout} onFinish={goodsUpdate}>
            <Form.Item label="商品编码" required name="goodsBarcode" extra="用于商家内部管理所使用的自定义简易编码。">
              <Input />
            </Form.Item>
            {/* <Form.Item label="国际条码" required name="goodsName" extra="用于快速识别商品所标记的唯一编码，比如：69开头的13位标准码。">
              <Input />
            </Form.Item> */}
            <Form.Item label="商品名称" required name="goodsName">
              <Input />
            </Form.Item>
            {/* <Form.Item label="商品分类" required name="goodsName">
              <Input />
            </Form.Item>
            <Form.Item label="商品品牌" required name="goodsName">
              <Input />
            </Form.Item>
            <Form.Item label="商品状态" required name="goodsName">
              <Input />
            </Form.Item> */}
            {/* <Form.Item label="成本价" required name="goodsPrice">
              <Input addonAfter="元" />
            </Form.Item> */}
            <Form.Item label="商品售价" required name="goodsPrice">
              <Input addonAfter="元" />
            </Form.Item>
            {/* <Form.Item label="会员价" required name="goodsPrice">
              <Input addonAfter="元" />
            </Form.Item> */}
            <Form.Item {...tailFormItemLayout}>
              <Space>
                <Button type="primary" htmlType="submit">
                  保存
                </Button>
                <Button htmlType="button" onClick={() => props.history.goBack()}>
                  取消
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  )
}
