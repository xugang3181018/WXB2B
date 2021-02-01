import React, { Fragment, useEffect, useCallback } from 'react'
import { Row, Col, Divider, Spin, List, Tag, Avatar, Tabs, Descriptions, notification } from 'antd'
const { Item } = Descriptions
const { TabPane } = Tabs
import { memberDetail, memberTags, tagList } from 'api'
import { useRequest, useLocalStorageState } from 'ahooks'
import MemberOrder from './MemberOrder'
import './style.less'

export default React.memo(props => {
  const sex = ['未知', '男', '女']
  const { memberId, merchatCode, merchantCode: code, inOutRecordId } = props
  const merchantCode = merchatCode || code
  const [login] = useLocalStorageState('login')
  const { appId, operatorId } = login
  const params = { appId, memberId, merchantCode, operatorId }
  if (inOutRecordId) params.inOutRecordId = inOutRecordId
  const option = {
    formatResult: res => {
      return res.result
    },
    manual: true
  }
  const onSuccess = res => {
    allTag.run({ appId, merchantCode })
  }

  const handleSuccess = res => {
    if (!res) {
      notification.warning({
        message: '操作失败',
        duration: 3,
        description: '详情数据系统异常'
      })
    }
  }

  // 会员详情
  const detail = useRequest(memberDetail, { ...option, initialData: {}, onSuccess: handleSuccess })
  // 会员标签
  const memberTag = useRequest(memberTags, { ...option, initialData: [], onSuccess })
  const { data: tag } = memberTag
  const allSuccess = res => {
    if (res.code === 'FAILED') return
    let arr = []
    res.result.forEach(item => {
      memberTag.data.every(itm => item.id != itm.crowdId) && arr.push(item)
    })
    return arr
  }
  // 所有标签
  const allTag = useRequest(tagList, { manual: true, initialData: [], formatResult: allSuccess })

  const { data, loading } = detail
  const { data: tagArray } = allTag
  const addTag = crowdId => memberTag.run({ ...params, type: 1, crowdId })

  useEffect(() => {
    memberId && detail.run({ merchantCode, memberId, appId })
    memberId && memberTag.run({ memberId, merchantCode, type: 3 })
  }, [memberId])

  return (
    <Spin spinning={loading}>
      <Fragment>
        <Row>
          <List.Item.Meta
            avatar={<Avatar size={46} alt={data?.nickName} src={data?.headImgUrl} />}
            title={data?.nickName}
            description={data?.mobile}
          />
        </Row>
        <Tabs style={{ marginTop: 18 }}>
          <TabPane tab="基础信息" key="1">
            <Descriptions column={2}>
              <Item label="手机号码">{data?.mobile}</Item>
              <Item label="所属门店">{data?.merchantName || data?.merchatCode}</Item>
              <Item label="所在国家">{data?.country}</Item>
              <Item label="会员等级">{data?.levelName}</Item>
              <Item label="会员性别">{sex[data?.sex]}</Item>
              <Item label="会员生日">{data?.birthday || '--'}</Item>
              <Item label="注册日期">{data?.createDate && data?.createDate.split('T')[0]}</Item>
            </Descriptions>
            <Divider />
            <Descriptions
              title={
                <p className="site-description-item-profile-p">
                  会员标签
                  <b className="ts blue">会员标签</b>
                  <b className="ts magenta">系统标签</b>
                </p>
              }>
              <Row>
                <Col span={24}>
                  {tag &&
                    tag.map((item, index) => {
                      return (
                        <Tag
                          className="member-tag"
                          closeIcon={<i className="ico-close" />}
                          key={index}
                          closable
                          color={'blue'}
                          onClose={() => memberTag.run({ ...params, type: 2, crowdId: item.crowdId })}>
                          {item.crowdName}
                        </Tag>
                      )
                    })}
                  {tagArray &&
                    tagArray.map((item, index) => {
                      return (
                        <Tag
                          className="member-tag"
                          closeIcon={<i className="ico-cart-adds" />}
                          closable
                          key={index}
                          color={'magenta'}
                          onClose={() => addTag(item.id)}>
                          {item.crowdName}
                        </Tag>
                      )
                    })}
                </Col>
              </Row>
            </Descriptions>
            <Divider />
            <Descriptions title="消费统计" column={2}>
              <Item label="消费次数">{data?.consumTimes || '--'} </Item>
              <Item label="充值次数">{data?.rechargeTimes || '--'}</Item>
              <Item label="累计充值金额">{data?.accumulationRecharge || '--'}</Item>
              <Item label="最后一次消费金额">{data?.accumulationConsume || '--'}</Item>
              <Item label="最后一次消费时间">{data?.lastConsumDate || '--'}</Item>
            </Descriptions>
          </TabPane>
          <TabPane tab="消费记录" key="2">
            <MemberOrder {...props} />
          </TabPane>
        </Tabs>
      </Fragment>
    </Spin>
  )
})
