import React, { Fragment, useState, useEffect, useCallback } from 'react'
import OrderLineChart from './chart/OrderLineChart'
import PersonChart from './chart/PersonChart'
import { DatePickRange, MerchantSelect } from 'component'
import {
  Card,
  Space,
  Row,
  Col,
  Descriptions,
  List,
  Statistic,
  Tag,
  Typography,
  Radio,
  PageHeader,
  Divider,
  Spin,
  Tooltip as Tips,
  Button
} from 'antd'
import { Scrollbars } from 'react-custom-scrollbars'
import { Chart, Interval, Tooltip, Line, Axis, Coordinate, Point, Legend, Area, LineAdvance, Geom } from 'bizcharts'
import { shopList, tradeStatistics, passengerFlow, goodsSaleStatistics, merchantSaleRank, dashBoardStatistics } from 'api'
import { useLocalStorageState, useRequest } from 'ahooks'
import moment from 'moment'
import Placeholder from './Placeholder'
import './style.less'
// const scale = {
//   sales: {
//     min: 2
//   }
// }

function SalesChart(props) {
  const { data, position } = props
  return (
    <Chart height={44} pure autoFit data={data} appendPadding={[0, 0, 0, 0]}>
      <Line position={position} shape="smooth" />
      <Tooltip />
      <Geom
        position={position}
        shape="smooth"
        type="area"
        tooltip={[
          position,
          (text, num) => {
            return {
              name: '销售额',
              value: num
            }
          }
        ]}
      />
    </Chart>
  )
}

function CustomerLiner(props) {
  const { data, position } = props
  return (
    <Chart pure height={44} data={data} autoFit>
      <Line position={position} shape="smooth" />
      <Tooltip />
      <Geom
        type="area"
        position={position}
        shape="smooth"
        tooltip={[
          position,
          (text, num) => {
            return {
              name: '客流量',
              value: num
            }
          }
        ]}
      />
    </Chart>
  )
}

function PayAmount(props) {
  const { data, position } = props
  return (
    <Chart pure height={44} data={data} autoFit>
      <Tooltip shared />
      <Interval
        position={position}
        tooltip={[
          position,
          (text, num) => {
            return {
              name: '支付笔数',
              value: num
            }
          }
        ]}
      />
    </Chart>
  )
}

function PersonAmount(props) {
  const { data, position } = props
  const scale = {
    passengerFlowCount: {
      min: 2
    }
  }
  return (
    <Chart pure height={44} data={data} autoFit color="ff3355">
      <Line position={position} shape="smooth" size={2} />
      <Tooltip />
      <Geom
        type="area"
        position={position}
        shape="smooth"
        visible={false}
        tooltip={[
          position,
          (text, num) => {
            return {
              name: '客单价',
              value: num
            }
          }
        ]}
      />
    </Chart>
  )
}

let getTimeState = () => {
  let timeNow = new Date()
  let hours = timeNow.getHours()
  let text = ``
  if (hours >= 0 && hours <= 10) {
    text = `早上好!`
  } else if (hours > 10 && hours <= 14) {
    text = `中午好!`
  } else if (hours > 14 && hours <= 18) {
    text = `下午好!`
  } else if (hours > 18 && hours <= 24) {
    text = `晚上好!`
  }
  return text
}

const CardHead = props => {
  return (
    <Row justify="space-between">
      <span>{props.title}</span>
      <Tips title={props.tip}>
        <i className="sale-info-icon ico-info" />
      </Tips>
    </Row>
  )
}

const ScrollList = ({ children }) => (
  <div style={{ height: 400 }}>
    <Scrollbars>{children}</Scrollbars>
  </div>
)
export default React.memo(props => {
  const [login] = useLocalStorageState('login')
  const { appId, operatorName, headImgUrl, merchantName } = login
  const endDate = moment(new Date()).format('YYYYMMDD')

  const beginDate = day =>
    moment()
      .subtract(day, 'days')
      .format('YYYYMMDD')

  const allDate = [endDate, beginDate(7), beginDate(30)]
  const formatDate = str => moment(str, 'YYYYMMDD').format('YYYY-MM-DD')
  // const options = {
  //   formatResult: res => {
  //     return res.result.map(item => {
  //       return { date: formatDate(item.date), ...item.statistics }
  //     })
  //   },
  //   manual: true,
  //   refreshDeps: [],
  //   initialData: [],
  //   cacheKey: 'tradStatistics'
  // }

  // // 经营统计
  // const trad = useRequest(tradeStatistics, options)
  // // 商品销售统计
  // const sale = useRequest(goodsSaleStatistics, { ...options, formatResult: res => res.result || {} })
  // // 门店销售排行统计
  // const rank = useRequest(merchantSaleRank, { ...options, formatResult: res => res.result || {} })
  // 客流量
  // const flow = useRequest(passengerFlow, {
  //   ...options,
  //   formatResult: res => {
  //     return res.result.map(item => {
  //       item.date = formatDate(item.date)
  //       return item
  //     })
  //   }
  // })

  // 刘爽 start
  const defaultParams = [{ appId, beginDate: allDate[2], endDate }]
  // 分页版本
  // const { data: flowData, run, loading: flowLoading } = useRequest(goodsSaleStatistics, {
  //   defaultParams,
  //   manual: true,
  //   formatResult: res => {
  //     let arr = []
  //     if (!loading) {
  //       arr = Array.from(flowData?.items || [])
  //     }
  //     let items = arr.concat(res?.result?.items ?? [])
  //     return { ...res.result, items }
  //   }
  // })

  // const getMore = () => {
  //   if (flowData?.pageCount > flowData?.currentPage) {
  //     run({ currentPage: flowData?.currentPage + 1, pageSize: 10, appId, beginDate: allDate[2], endDate })
  //   }
  // }

  // const loadMore =
  //   flowData?.pageCount === flowData?.currentPage && flowLoading ? null : (
  //     <div
  //       style={{
  //         textAlign: 'center',
  //         margin: '20px 0',
  //         height: 32,
  //         lineHeight: '32px'
  //       }}>
  //       <Button onClick={getMore}>加载更多</Button>
  //     </div>
  //   )
  const { data: flowData, run, loading: flowLoading } = useRequest(goodsSaleStatistics, {
    defaultParams,
    manual: true,
    formatResult: res => {
      return res.result
    }
  })
  // console.log(55, flowData, flowLoading)

  //刘爽 end

  // const tradList = useRequest(allRequest, { ...options, formatResult: res => res.result || {} })
  const [params, setParams] = useState({ appId, beginDate: allDate[2], endDate })
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({})
  const { data: count } = useRequest(dashBoardStatistics, { formatResult: res => res.result, initialData: {} })
  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      run(params)
      const res = await Promise.all([tradeStatistics(params), merchantSaleRank(params), goodsSaleStatistics(params), passengerFlow(params)])
      const data = res.map(res => res.result || {})
      let [_trad, rank, sales, flow] = data
      let sale = { items: [], data: {}, ...sales }
      let trad = _trad.map(item => {
        return { date: formatDate(item.date), ...item.statistics }
      })
      setData({ trad, rank, sale, flow })
    } finally {
      setLoading(false)
    }
  }, [params])

  useEffect(() => {
    fetchData()
  }, [params])

  const dateChange = res => {
    const [beginDate, endDate] = res
    setParams({ ...params, beginDate, endDate })
  }
  // console.log(123, data)

  let prev = 0
  const sumNum = (arr, key) => arr.reduce((prev, curr) => prev + curr[key], 0)
  return (
    <Fragment>
      {loading ? (
        <Placeholder />
      ) : (
        <Fragment>
          {data.trad && data.flow && data.rank && data.sale && (
            <Fragment>
              <Col span={24}>
                <Card>
                  <Row justify="center">
                    <Col span={22}>
                      <PageHeader
                        style={{ padding: 0, margin: '0 -24px' }}
                        avatar={{ src: headImgUrl, size: 56 }}
                        title={
                          <div>
                            <h4 style={{ margin: 0 }}>{`${operatorName},${getTimeState()}`}</h4>
                            <div style={{ fontSize: 14, fontWeight: 'normal' }}>{merchantName}</div>
                          </div>
                        }
                        extra={[
                          <Space key="1" size="large" split={<Divider type="vertical" />}>
                            <Statistic title="门店数" value={count?.merchantCount} />
                            <Statistic title="当前人流量" value={count?.passengerFlowCount} />
                            <Statistic title="任务数" value={count?.inOutRecordCount} />
                          </Space>
                        ]}
                      />
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Row gutter={[20, 20]} justify="center" style={{ marginTop: 10 }}>
                <Col span={22}>
                  <Row gutter={15}>
                    <Col span={6}>
                      <Card>
                        <Statistic title={<CardHead title="销售额(元)" tip="总销售额" />} precision={2} value={data.sale?.data?.totalAmt} />
                        <SalesChart data={data?.trad} position="date*totalTradeAmt" />
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card>
                        <Statistic title={<CardHead title="客流量(人)" tip="门店访客流量" />} value={sumNum(data?.flow, 'passengerFlowCount')} />
                        <CustomerLiner data={data?.flow} position="date*passengerFlowCount" />
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card footer={<>商品总销售数量：{data.sale?.data.totalGoodsCnt}</>}>
                        <Statistic title={<CardHead title="支付笔数(笔)" tip="支付成功的订单量" />} value={data.sale?.data?.tradeOrderCnt} />
                        <PayAmount data={data?.trad} position="date*totalTradeCnt" />
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card>
                        <Statistic
                          precision={2}
                          title={<CardHead title="客单价(元)" tip="客单价=销售额/订单数量" />}
                          value={data.sale?.data.totalAmt / data.sale?.data?.tradeOrderCnt || '0.00'}
                        />
                        <PersonAmount data={data?.trad} position="date*totalTradeAmt" />
                      </Card>
                    </Col>
                  </Row>
                </Col>
                <Col span={22}>
                  <Card
                    extra={[
                      <Space key="2" justify="space-between">
                        <Radio.Group defaultValue={2} onChange={({ target }) => setParams({ appId, beginDate: allDate[target.value], endDate })}>
                          {['今天', '近一周', '近30日'].map((item, index) => (
                            <Radio.Button key={index} value={index}>
                              {item}
                            </Radio.Button>
                          ))}
                        </Radio.Group>
                        <DatePickRange format="YYYYMMDD" showTime={false} onChange={dateChange} />
                      </Space>
                    ]}
                    title={
                      <MerchantSelect
                        value={params?.merchantCode}
                        onChange={merchantCode => setParams({ ...params, merchantCode })}
                        placeholder="所有门店"
                      />
                    }>
                    <Row gutter={15}>
                      <Col span={18}>
                        <OrderLineChart data={data?.trad} flow={data?.flow} />
                      </Col>
                      <Col span={6} style={{ height: 400 }}>
                        <Descriptions title="门店销售排行" style={{ margin: 0 }} />
                        <ScrollList>
                          <List
                            dataSource={data?.rank}
                            renderItem={(item, index) => (
                              <List.Item key={index} extra={<Typography.Text type="secondary">销量:{item.value}</Typography.Text>}>
                                <List.Item.Meta
                                  avatar={
                                    <Row className="sale-avatar">
                                      <Tag className="sale-tag" color="#f50">
                                        {index + 1}
                                      </Tag>
                                    </Row>
                                  }
                                  title={item.name}
                                  description={item.merchantCode}
                                />
                              </List.Item>
                            )}
                          />
                        </ScrollList>
                      </Col>
                    </Row>
                  </Card>
                </Col>
                <Col span={22}>
                  <Card>
                    <Row gutter="20">
                      <Col span={18} setyle={{ height: 300 }}>
                        <Descriptions title="客服分发量" style={{ margin: 0 }} />
                        <PersonChart data={data?.flow} />
                      </Col>
                      <Col span={6}>
                        <Descriptions title="商品销量排行" />
                        <ScrollList>
                          <List
                            // dataSource={flowData?.items}
                            dataSource={flowData}
                            style={{ height: 300 }}
                            // loadMore={flowData?.items.length ? loadMore : null}
                            renderItem={(item, index) => (
                              <List.Item key={index} extra={<Typography.Text type="secondary">销量:{item.goodsCnt}</Typography.Text>}>
                                <List.Item.Meta
                                  avatar={
                                    <Row justify="center" className="sale-avatar">
                                      <Tag className="sale-tag" color="red">
                                        {index + 1}
                                      </Tag>
                                    </Row>
                                  }
                                  title={<Space>{item.goodsName}</Space>}
                                  description={item.merchantName}
                                />
                              </List.Item>
                            )}
                          />
                        </ScrollList>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
            </Fragment>
          )}
        </Fragment>
      )}
    </Fragment>
  )
})
