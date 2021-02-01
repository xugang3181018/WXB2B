import React, { Fragment, useEffect } from 'react'
import { Row, Col, Divider, Spin, List, Tag, Avatar, Space, Button, Descriptions } from 'antd'
const { Item } = Descriptions
import { getCustomerDetails } from 'api'
import { useRequest, useLocalStorageState } from 'ahooks'
import { Link } from 'react-router-dom'

const sex = ['未知', '男', '女']
export default React.memo(({ id }) => {
  const [login] = useLocalStorageState('login')
  const { appId, merchantCode } = login
  const params = { appId, merchantCode }
  const option = {
    defaultParams: [params],
    initialData: [],
    ready: id,
    manual: true,
    formatResult: res => {
      return res.result
    },
    refreshDeps: [id]
  }
  const { data, run, loading } = useRequest(getCustomerDetails, { ...option, initialData: {} })

  useEffect(() => {
    run({ id, ...params })
  }, [id])

  const sex = ['男', '女']

  return (
    <Spin spinning={loading}>
      <Fragment>
        <Row>
          <List.Item.Meta
            avatar={<Avatar size={68} alt={data?.employeeName} src={data?.headImgUrl} />}
            title={
              <Space>
                <h2>
                  {data?.employeeName}
                  <Tag color="blue">{data?.levelName}</Tag>
                </h2>
              </Space>
            }
            description={data?.mobile}
          />
          <Button type="link">
            <Link to={`/staff/modify/${data?.id}`}>编辑</Link>
          </Button>
        </Row>
        <Divider />
        <Descriptions title="基础信息" column={2}>
          <Item label="部门id">{data?.departmentId} </Item>
          <Item label="员工姓名">{data?.employeeName} </Item>
          <Item label="职位id">{data?.positionId} </Item>
          <Item label="工号（code）">{data?.jobNumber} </Item>
          <Item label="性别">{sex[data?.gender]} </Item>
          <Item label="手机号">{data?.mobile} </Item>
          <Item label="邮件">{data?.email} </Item>
          <Item label="创建时间">{data?.createTime} </Item>
          <Item label="客服类型">{data?.typeName} </Item>
          <Item label="客服等级">{data?.levelName} </Item>
        </Descriptions>
      </Fragment>
    </Spin>
  )
})
