import React, { useState, useEffect, useCallback, Fragment } from 'react'
import { Form, Input, Button, Row, Col, PageHeader, Space, Image, AutoComplete, Select, Result, message, Divider } from 'antd'
import { formLayout } from 'layout/formLayout'
const { Option } = Select
const { formItemLayout, tailFormItemLayout } = formLayout
import { Link, useParams } from 'react-router-dom'
import { getDeepcamShop, insertShop, shopDetails } from 'api'
import Area from './Area'
import Address from './Address'
import { useRequest, useLocalStorageState } from 'ahooks'
import useMerchant from 'hooks/useMerchant'
import Map from './Map'

const status = ['未托管', '已托管', '禁用', '删除']

export default function StoreModify(props) {
  const [form] = Form.useForm()
  const { id } = useParams()
  const [login] = useLocalStorageState('login')
  const [success, setSuccess] = useState(false)
  const { appId, username: operationLoginName, operatorId, operatorName } = login
  const { update } = useMerchant()

  const [area, setArea] = useState([])

  // 神目门店列表request
  const deepMerchant = useRequest(getDeepcamShop, { defaultParams: [{ appId }] })

  // 创建门店SUCCESS
  const createSuccess = res => {
    res.code === 'FAILED' && message.info(res.msg)
    res.code === 'SUCCESS' && setSuccess(res.result)
  }

  // 创建门店request
  const create = useRequest(insertShop, { manual: true, onSuccess: createSuccess })
  const onSuccess = res => {
    const { province, city, region } = res.result
    setArea([province, city, region])
    form.setFieldsValue(res.result)
  }

  // 门店详情
  const merchantDetail = useRequest(shopDetails, {
    refreshDeps: [id],
    onSuccess,
    manual: true
  })

  // 创建门店
  const createMerchant = val => {
    delete val.confirm
    create.run({ ...val, appId, operationLoginName, operationName: operatorName })
  }

  // 选择省市区
  const areaChange = val => {
    const [province, city, region] = val
    setArea(val)
    form.setFieldsValue({ province, city, region })
  }

  // 选择详细地址
  const addressChange = val => {
    const { title, address, location } = val
    form.setFieldsValue({ location: Object.values(location[0] || {}).join() })
  }

  // 门店编辑查找详情
  useEffect(() => {
    id != 'new' && merchantDetail.run({ appId, merchantCode: id })
  }, [id])

  const successPage = (
    <Result
      status="success"
      title="Successfully Purchased Cloud Server ECS!"
      subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
      extra={[
        <Button type="primary" key="console">
          返回
        </Button>,
        <Button key="buy">继续添加</Button>
      ]}
    />
  )

  const updateMerchant = val => {
    update.run({ ...val, appId, merchantCode: id }).then(_ => {
      props.history.goBack()
    })
  }

  const modify = (
    <Fragment>
      <PageHeader
        onBack={() => props.history.goBack()}
        title={id === 'new' ? '新增门店' : '编辑门店'}
        subTitle="悦喵门店基本信息"
        style={{ marginBottom: 30 }}
      />
      <Row>
        <Form name="store-modify" {...formItemLayout} form={form} onFinish={id === 'new' ? createMerchant : updateMerchant}>
          <Form.Item rules={[{ required: true, message: '请输入门店名称!' }]} label="门店名称" name="merchantName" extra="请输入中文门店名称">
            <Input placeholder="输入门店名称" />
          </Form.Item>
          {id != 'new' && (
            <Form.Item label="状态" name="status">
              <Select placeholder="选择状态">
                {status.map((item, index) => {
                  return (
                    <Option key={index} value={index}>
                      {item}
                    </Option>
                  )
                })}
              </Select>
            </Form.Item>
          )}
          <Form.Item rules={[{ required: true, message: '请选择神目门店!' }]} label="神目门店id" name="deepCamShopId">
            <Select placeholder="选择神目门店">
              {deepMerchant.data?.result.map(item => {
                return (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                )
              })}
            </Select>
          </Form.Item>
          <Form.Item rules={[{ required: true, message: '请选择门店所在省市区!' }]} label="门店省市区">
            <Area change={areaChange} value={area} />
          </Form.Item>
          <Form.Item noStyle name="province" hidden>
            <Input />
          </Form.Item>
          <Form.Item noStyle name="city" hidden>
            <Input />
          </Form.Item>
          <Form.Item noStyle name="region" hidden>
            <Input />
          </Form.Item>
          <Form.Item noStyle name="location" hidden>
            <Input />
          </Form.Item>
          <Form.Item rules={[{ required: true, message: '请输入门店地址!' }]} label="门店地址" name="address">
            <Address change={addressChange} region={form.getFieldValue('region')} />
          </Form.Item>
          <Form.Item label="门店位置" shouldUpdate={(prevValues, curValues) => prevValues.location !== curValues.location}>
            {() => {
              return <Map value={form.getFieldValue('location')} />
            }}
          </Form.Item>
          <Form.Item rules={[{ required: true, message: '请输入门店联系人!' }]} label="联系人" name="contactName">
            <Input placeholder="输入联系人姓名" />
          </Form.Item>
          <Form.Item rules={[{ required: true, message: '请输入门店联系人电话!' }]} label="联系电话" name="contactMobile">
            <Input placeholder="输入联系电话" maxLength="11" />
          </Form.Item>
          {id === 'new' && (
            <Fragment>
              <Form.Item
                rules={[{ required: true, message: '请输入门店登录名!' }]}
                extra="输入登录名,登录名长度为6-12位"
                label="登录名"
                name="loginName">
                <Input />
              </Form.Item>
              <Form.Item
                rules={[{ required: true, message: '请输入登录密码!' }]}
                label="登录密码"
                extra="请输入长度大于6位数包含字母数字的密码"
                name="password">
                <Input.Password autoComplete="new-password" placeholder="输入密码" />
              </Form.Item>
              <Form.Item
                name="confirm"
                label="确认密码"
                extra="再次输入密码，确保密码密码正确"
                rules={[
                  {
                    required: true,
                    message: '请再次输入密码确认!'
                  },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve()
                      }
                      return Promise.reject('两次输入密码不一致!')
                    }
                  })
                ]}>
                <Input.Password autoComplete="new-password" placeholder="再次确认密码" />
              </Form.Item>
            </Fragment>
          )}
          <Form.Item {...tailFormItemLayout}>
            <Space>
              <Button type="primary" htmlType="submit" loading={create.loading}>
                {id == 'new' ? '确定创建' : '保存门店'}
              </Button>
              <Button onClick={() => props.history.goBack()}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Row>
    </Fragment>
  )
  return <Fragment>{success ? successPage : modify}</Fragment>
}
