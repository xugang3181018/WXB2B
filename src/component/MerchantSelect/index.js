import React from 'react'
import { useLocalStorageState, useRequest } from 'ahooks'
import { shopList } from 'api'
import { Select } from 'antd'
const { Option } = Select

export default React.forwardRef(({ value = null, onChange, style = { width: 200 }, ...rest }, ref) => {
  const [login] = useLocalStorageState('login')
  const { appId } = login
  const { data, loading } = useRequest(shopList, { initialData: { result: [] }, defaultParams: [{ appId }] })
  return (
    <Select style={style} ref={ref} placeholder="选择门店" {...rest} onChange={onChange} loading={loading} value={value}>
      {data &&
        data?.result.map((item, index) => (
          <Option key={index} value={item.merchantCode}>
            {item.merchantName}
          </Option>
        ))}
    </Select>
  )
})
