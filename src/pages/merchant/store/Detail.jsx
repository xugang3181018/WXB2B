import React, { useEffect, Fragment } from 'react'
import { Spin, Descriptions, List, Divider, Image, Space, Tag, PageHeader, Button, Switch, Skeleton } from 'antd'
const { Item } = Descriptions
import { shopDetails, updateShop } from 'api'
import { useRequest, useLocalStorageState } from 'ahooks'
import useMerchant from 'hooks/useMerchant'

// 门店详情
export default function MerchantDetail(props) {
  const { merchantCode } = props
  const { update, door, lock } = useMerchant()
  const [login] = useLocalStorageState('login')
  const { appId, operatorId } = login

  const options = {
    manual: false,
    formatResult: res => res.result,
    defaultParams: [{ merchantCode, appId }],
    refreshDeps: [update.data, door.data, lock.data]
  }
  // 门店详情
  const detail = useRequest(shopDetails, options)
  const { data } = detail

  useEffect(() => {
    detail.run({ merchantCode, appId })
  }, [merchantCode])

  const status = ['未托管', '已托管 ', '禁用 ', '删除']
  const size = { width: 44, height: 44 }
  return (
    <Skeleton loading={detail.loading} active={true}>
      <Descriptions
        column={1}
        bordered
        size="small"
        title={
          <Fragment>
            <List.Item.Meta
              title={<h2 style={{ marginBottom: 0 }}>{data?.merchantName}</h2>}
              description={<span style={{ fontSize: 12, fontWeight: 'normal' }}>{data?.merchantCode}</span>}
            />
            <Button
              loading={door.loading}
              style={{ marginTop: 15 }}
              type="primary"
              disabled={data?.doorLock === 1 || data?.status === 0}
              onClick={() => door.run({ appId, merchantCode, type: 2, operatorId })}>
              开门
            </Button>
          </Fragment>
        }>
        <Item label="核心机构编码" labelStyle={{ width: 120, textAlign: 'right' }}>
          {data?.superMerchantCode}
        </Item>
        <Item label="门店编码">{data?.merchantCode}</Item>
        <Item label="门店名称">{data?.merchantName || '--'}</Item>
        <Item label="状态">
          <Tag size="small" color="#ff3939">
            {status[data?.status]}
          </Tag>
        </Item>
        <Item label="托管">
          <Switch
            checkedChildren="开"
            unCheckedChildren="关"
            onClick={() => update.run({ merchantCode, status: data?.status ? 0 : 1, appId }).then(res => props.refresh())}
            checked={data?.status}
          />
        </Item>
        <Item label="门锁">
          <Switch
            checkedChildren="开"
            unCheckedChildren="关"
            onClick={() => lock.run({ merchantCode, deviceStatus: data?.doorLock ? 0 : 1, appId }).then(res => props.refresh())}
            checked={!data?.doorLock}
          />
        </Item>
        <Item label="神目门店id">{data?.deepCamShopId || '--'}</Item>
        <Item label="门店地址">
          {data?.province} / {data?.city} / {data?.region}
        </Item>
        <Item label="详细地址">{<List.Item.Meta title={data?.address.split(',')[0]} description={data?.address.split(',')[1]} />}</Item>
        <Item label="联系人电话">{data?.contactMobile || '--'}</Item>
        <Item label="联系人姓名">{data?.contactName || '--'}</Item>
        <Item label="创建时间">{data?.createTime || '--'}</Item>
        <Item label="修改时间">{data?.updateTime || '--'}</Item>
        <Item label="门店二维码">
          <a href={data?.doorQrCode} download="门店二维码">
            <Image {...size} src={data?.doorQrCode} />
            下载
          </a>
        </Item>
        <Item label="桌台二维码">
          <a href={data?.tableQrCode} download="桌台二维码">
            <Image {...size} src={data?.tableQrCode} />
            下载
          </a>
        </Item>
      </Descriptions>
    </Skeleton>
  )
}
