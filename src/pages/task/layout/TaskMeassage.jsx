import React, { Fragment, useContext } from 'react'
import { Typography, Tag, Space, List, Image } from 'antd'
import { GlobalContext } from 'context/GlobalState'
import Avatar from 'antd/lib/avatar/avatar'
const { Text } = Typography
import normalImage from 'images/normal.png'

const door = ['进入', '离开', '测试开门', '客服开门']
const color = ['#87d068', '#f50', '#2db7f5', '#108ee9']

//  会员开门 type === 2
const Member = props => {
  return (
    <Fragment>
      <Text type="secondary">
        {props?.merchantName} <Tag clolor={color[props?.openType]}>{door[props?.openType]}</Tag>
        <div>{props?.outTime || props?.inTime}</div>
      </Text>
      <div className="task-message-pop">
        <List.Item.Meta avatar={<Avatar size={44} src={props?.headImgUrl} />} title={props?.nickName} description={props?.mobile} />
      </div>
    </Fragment>
  )
}

//  访客  type === =3
const Customer = props => {
  const sex = ['男', '女']
  return (
    <Fragment>
      <Text type="secondary">访客</Text>
      <div className="task-message-pop">
        <List.Item.Meta
          avatar={<Image width={44} height={44} src={props?.facesImage} fallback={normalImage} />}
          title={`年龄:${props?.age} / ${sex[props?.gender]}`}
          description={props?.snapTime}
        />
      </div>
    </Fragment>
  )
}
//  标签 type === 5
const Tags = props => {
  return (
    <Fragment>
      <Text type="secondary">{props.operatorName}</Text>
      <div className="task-message-pop">
        <span>
          {props?.nickName} {props?.msg}
        </span>
      </div>
    </Fragment>
  )
}

// 购物车推送 type===8
const ShopProps = props => {
  return (
    <Fragment>
      <Text type="secondary">购物车推送</Text>
      {props.goodsInfo.map((item, index) => {
        return (
          <Fragment key={index}>
            <div className="task-message-pop">
              <List.Item.Meta avatar={<Image width={44} height={44} src={item?.goodsImg} fallback={normalImage} />} title={item?.msg} />
            </div>
          </Fragment>
        )
      })}
    </Fragment>
  )
}

//拉起支付或者支付完成推送 type==9，10
const Pullup = props => {
  const payType = {
    9: '拉起支付',
    10: '支付完成',
    11: '支付取消'
  }
  const payTypeMoney = {
    9: `拉起支付金额:${props?.payAmount}元`,
    10: `支付完成金额:${props?.payAmount}元`,
    11: '支付取消'
  }
  return (
    <Fragment>
      <Text type="secondary">{payType[props?.type]}</Text>
      <div className="task-message-pop">
        <div>{props?.msg}</div>
        <div>{payTypeMoney[props?.type]}</div>
      </div>
    </Fragment>
  )
}

export default React.memo(props => {
  const { task, taskMessage } = useContext(GlobalContext)
  const filterMsg = item => {
    const isType =
      item && (item.type == 3 || item.type == 2 || item.type == 5 || item.type == 8 || item.type == 9 || item.type == 10 || item.type == 11)
    return isType && item?.memberId === task.memberId && item?.inOutRecordId === task.inOutRecordId
  }
  const list = taskMessage.filter(filterMsg)
  return (
    <div className="task-message">
      {list.reverse().map((item, index) => {
        return (
          <div className={`task-message-item ${item.type === 5 && 'reverse'}`} key={index}>
            <i className="ico ico-logo" />
            <div className="task-message-block">
              {item.type == 2 && <Member {...item} />}
              {item.type == 3 && <Customer {...item} />}
              {item.type == 5 && <Tags {...item} />}
              {item.type == 8 && <ShopProps {...item} />}
              {item.type == 9 && <Pullup {...item} />}
              {item.type == 10 && <Pullup {...item} />}
              {item.type == 11 && <Pullup {...item} />}
            </div>
          </div>
        )
      })}
    </div>
  )
})
