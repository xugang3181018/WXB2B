import React, { useState, useEffect, useCallback } from 'react'
import { Form, Input, Button, Row, Col, PageHeader, Space, Image, Select, notification } from 'antd'
const { Option } = Select
import { formLayout } from 'layout/formLayout'
const { formItemLayout, tailFormItemLayout } = formLayout
import { Link, useParams } from 'react-router-dom'
import { getCustomerDetails, createCustomer, getCustomerLevel, getCustomerType, updateYmCustomer } from 'api'
import { useRequest, useLocalStorageState } from 'ahooks'
import { UploadImage } from 'component'

function SelectValue({ range, keys, value, label, onChange, style }) {
  return (
    <Select onChange={val => onChange(val)} style={style} placeholder="请选择" value={value}>
      {range &&
        range.map((item, index) => {
          return (
            <Option key={index} value={keys ? item[keys] : index}>
              {label ? item[label] : item}
            </Option>
          )
        })}
    </Select>
  )
}
/* 客服编辑 */
export default function ServiceCreate(props) {
  const [form] = Form.useForm()
  const { id } = useParams()
  const [login] = useLocalStorageState('login')
  const { appId, merchantCode } = login
  const params = { appId, merchantCode }
  const [sure, setSure] = useState('')

  const setForm = useCallback(value => {
    form.setFieldsValue(value)
    setSure(form.getFieldValue('password'))
  }, [])

  //配置项处理
  const option = {
    manual: true,
    defaultParams: [params],
    formatResult: res => {
      return res.result
    }
  }

  // 结果处理
  const results = {
    ...option,
    onSuccess: res => {
      notification[res.code === 'SUCCESS' ? 'success' : 'warning']({
        description: res.msg
      })
    },
    formatResult: res => {
      return res
    }
  }

  // 客服等级
  const customerLevel = useRequest(getCustomerLevel, { ...option, manual: false, initialData: [] })
  // 客服类型
  const customerType = useRequest(getCustomerType, { ...option, manual: false, initialData: [] })
  // 创建客服
  const customerCreate = useRequest(createCustomer, results)
  // 修改客服信息
  const customerUpdate = useRequest(updateYmCustomer, results)
  // 客服详情
  const customerDetail = useRequest(getCustomerDetails, { ...option })

  useEffect(() => {
    id && customerDetail.run({ ...params, id })
  }, [id])

  useEffect(() => {
    setForm(customerDetail.data)
  }, [customerDetail])

  // 添加或者修改客服
  const createOrUpdate = (type, params) =>
    type.run({ ...params }).then(res => {
      props.history.replace('/staff/list')
    })

  const onFinish = value => {
    id === 'new' ? createOrUpdate(customerCreate, { ...value, status: 1 }) : createOrUpdate(customerUpdate, { ...value, id, status: 1 })
  }

  const isDisabled = () => (id === 'new' ? false : true)

  return (
    <div>
      <PageHeader
        onBack={() => props.history.goBack()}
        title={id === 'new' ? '创建客服' : '编辑客服资料'}
        subTitle="填写客服基本信息"
        style={{ marginBottom: 30 }}
      />
      <Row gutter={24}>
        <Col span={24}>
          <Form form={form} name="control-hooks" onFinish={onFinish} {...formItemLayout}>
            <Row>
              <Col span={12}>
                <Form.Item label="头像" name="headImgUrl">
                  <UploadImage text="点击上传" />
                </Form.Item>
                <Form.Item label="姓名" name="employeeName">
                  <Input placeholder="输入客服姓名" />
                </Form.Item>
                <Form.Item label="性别" name="gender">
                  <SelectValue style={{ width: 100 }} range={['男', '女']} />
                </Form.Item>
                <Form.Item label="手机号" name="mobile">
                  <Input placeholder="输入手机号" />
                </Form.Item>
                <Form.Item label="客服类型" name="employeeType">
                  <SelectValue style={{ width: 180 }} range={customerType.data} label="typeName" keys="id" />
                </Form.Item>
                <Form.Item label="邮箱" name="email">
                  <Input placeholder="输入邮箱" />
                </Form.Item>
                <Form.Item label="客服等级" name="employeeLevelId">
                  <SelectValue style={{ width: 180 }} range={customerLevel.data} label="levelName" keys="id" />
                </Form.Item>
                <Form.Item extra="输入登录名" label="登录名" name="loginName">
                  <Input placeholder="请输入登录名" disabled={isDisabled()} />
                </Form.Item>
                <Form.Item label="登录密码" extra="请输入长度大于5位数的密码." name="password">
                  <Input.Password disabled={isDisabled()} autoComplete="new-password" placeholder="输入密码" />
                </Form.Item>
                <Form.Item label="确认密码" extra="再次输入确认密码一致正确.">
                  <Input.Password value={sure} disabled={isDisabled()} autoComplete="new-password" placeholder="输入确认密码" />
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                  <Space size="middle">
                    <Button type="primary" htmlType="submit">
                      {id === 'new' ? '创建客服' : '保存'}
                    </Button>
                    <Button>
                      <Link to="/service/list">取消</Link>
                    </Button>
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </div>
  )
}
