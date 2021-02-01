import React, { Fragment } from 'react'
import { G2, Chart, Geom, Axis, Tooltip, Coord, Label, Legend, View, Guide, Shape, Facet, Util, LineAdvance } from 'bizcharts'
const { Line } = Guide
/**
1. 这里使用的是原始数据, 所以是 dates * first, 而格式化后的应该是 dates * value 把所有的 first 换成 value
2. colors: 自己可定义, 看是否可以使用对象(以方便日后指定关键词的颜色对应)
3. 上边数据中注释掉的是超出了 keywordTrend最小值和最大值范围之外的数据, 导致线太长出去了
*/

const colors = ['#1890ff', '#2fc25b']

const axisConfig = {
  label: {
    style: {
      textAlign: 'center'
    } // 设置坐标轴文本样式
  },
  line: {
    style: {
      stroke: '#eeeeee'
    } // 设置坐标轴线样式
  },
  grid: {
    line: {
      style: {
        stroke: '#eeeeee'
      }
    } // 设置坐标系栅格样式
  }
}

export default React.memo(function PersonChart(props) {
  // console.log(props)
  const cols = {
    dates: {
      range: [0, 1],
      type: 'timeCat'
    },
    first: {
      min: 0 // 这里要设置一个最小值, 否则可能图表中按照了 keywordTrend 中的最小值设置Y轴最小值
    }
  }

  return (
    <Fragment>
      {props?.data && (
        <Chart height={400} data={props?.data} scale={cols} padding={[40, 40, 40, 40]} autoFit>
          <Legend
            position="left-top"
            name="totalTradeAmt"
            title={{
              spacing: 10, // 标题同图例项的间距
              style: {
                textAlign: 'center', // 文本对齐方向，可取值为： start middle end
                fill: '#404040', // 文本的颜色
                fontSize: '12', // 文本大小
                fontWeight: 'bold', // 文本粗细
                textBaseline: 'top' // 文本基准线，可取 top middle bottom，默认为middle
              }
            }}
          />
          <Tooltip />
          <Axis name="date" {...axisConfig} />
          <Axis name="passengerFlowCount" {...axisConfig} label={{ offset: 10 }} />
          <LineAdvance
            point={{ size: 4 }}
            area
            shape="smooth"
            position="date*passengerFlowCount"
            size={2}
            tooltip={[
              'date*passengerFlowCount',
              (text, num) => {
                return {
                  name: '客服分发量',
                  value: num
                }
              }
            ]}
          />
          <Line
            top
            // start={{ dates: item.startDate, first: item.value }}
            // end={{ dates: item.endDate, first: item.value }}
            lineStyle={{
              lineWidth: 2
            }}
          />
        </Chart>
      )}
    </Fragment>
  )
})
