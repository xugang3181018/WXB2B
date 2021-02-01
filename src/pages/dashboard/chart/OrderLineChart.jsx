import React, { Fragment, useEffect, useState } from 'react'
import {
  G2,
  Chart,
  Slider,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util,
  LineAdvance,
  Interval,
  getTheme
} from 'bizcharts'
const { Line } = Guide

const theme = getTheme()
const colors = theme.colors10
export default React.memo(props => {
  // console.log(props)
  const scale = {
    date: {
      type: 'timeCat',
      range: [0, 1],
      mask: 'YYYY-MM-DD'
    },
    totalTradeAmt: { min: 0 },
    totalTradeCnt: { min: 0 }
  }
  const [data, setData] = useState([])
  useEffect(() => {
    if (props.flow.length && props.data.length) {
      // console.log(props.flow, props.data)
      const all = props.data.map((item, index) => {
        const filterDate = i => i.date === item.date
        item.passengerFlowCount = props.flow.some(filterDate) ? props.flow.filter(filterDate).passengerFlowCount : 0
        return item
      })
      // console.log(all)
      setData(all)
    }
  }, [props.flow, props.data])
  let flag = false
  return (
    <Fragment>
      {data.length && (
        <Chart scale={scale} height={400} data={data} padding={[50, 40, 70, 40]} autoFit>
          <Legend
            layout="horizontal"
            custom={true}
            position="left-top"
            items={[
              {
                value: 'totalTradeAmt',
                name: '销售额'
              },
              {
                value: 'passengerFlowCount',
                name: '客流量'
              },
              {
                value: 'totalTradeCnt',
                name: '订单数'
              }
            ]}
          />
          <Axis name="date" />
          <Axis position="date*totalTradeCnt" />
          <Axis position="date*passengerFlowCount" />
          <Axis position="date*totalTradeAmt" />
          <LineAdvance
            point
            area
            shape="smooth"
            position="date*totalTradeAmt"
            color={colors[0]}
            tooltip={[
              'date*totalTradeAmt',
              (text, num) => {
                return {
                  name: '销售额',
                  value: num
                }
              }
            ]}
          />
          <LineAdvance
            point
            area
            shape="smooth"
            position="date*totalTradeCnt"
            color={colors[1]}
            tooltip={[
              'date*totalTradeCnt',
              (text, num) => {
                return {
                  name: '客流量',
                  value: num
                }
              }
            ]}
          />
          <LineAdvance
            point
            area
            shape="smooth"
            position="date*passengerFlowCount"
            color={colors[2]}
            tooltip={[
              'date*passengerFlowCount',
              (text, num) => {
                return {
                  name: '订单数',
                  value: num
                }
              }
            ]}
          />
          <Tooltip shared showCrosshairs />
          <Slider
            start={0}
            formatter={(v, d, i) => {
              flag = !flag
              return `${v}${flag ? '开始' : '结束'}`
            }}
          />
        </Chart>
      )}
    </Fragment>
  )
})
