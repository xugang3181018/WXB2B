import React from 'react'
import 'moment/locale/zh-cn'
import locale from 'antd/es/date-picker/locale/zh_CN'
import { DatePicker } from 'antd'
const { RangePicker } = DatePicker
import moment from 'moment'

// 选择当前时间以前的时间范围
export default React.forwardRef((props, ref) => {
  const disabledDate = current => current && current > moment().endOf('day')
  return (
    <RangePicker
      locale={locale}
      disabledDate={disabledDate}
      ref={ref}
      ranges={{
        今天: [moment(), moment()],
        本月: [moment().startOf('month'), moment().endOf('month')]
      }}
      defaultValue={props?.value && moment(props?.value)}
      showTime={props?.showTime ?? true}
      format={props?.format || 'YYYY-MM-DD HH:mm:ss'}
      onChange={(i, dateString) => props.onChange(dateString)}
    />
  )
})
