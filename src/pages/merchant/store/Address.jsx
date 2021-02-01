import React, { useState } from 'react'
import { AutoComplete, Space, Input } from 'antd'
import { suggestion } from 'api'
import { useRequest } from 'ahooks'

// 地址模糊查询
export default function Address({ onChange, value = '', region, change }) {
  const [address, title] = value.split(',')
  const [addressOption, setAddressOption] = useState([{ address, title }])
  const { loading, run } = useRequest(suggestion, {
    manual: true,
    initialData: [],
    formatResult: res => {
      return res.result
    },
    onSuccess: res => {
      const options =
        res &&
        res.map(item => {
          return {
            value: item.address,
            item,
            label: (
              <Space justify="space-between">
                <div>
                  <div>{item.title}</div>
                  <div style={{ fontSize: 12 }}>{item.address}</div>
                </div>
              </Space>
            )
          }
        })
      setAddressOption(options)
    },
    debounceInterval: 500
  })

  const onSearch = async keyword => {
    const params = {
      region,
      keyword
    }
    run(params)
  }

  const onSelect = (val, i) => {
    // console.log(val, i)
    change(i.item)
    const { title, address, location } = i.item
    onChange(`${address},${title}`)
  }

  const handleAddress = value => {
    onChange(value)
  }

  return (
    <AutoComplete
      options={addressOption}
      allowClear={true}
      notFoundContent={<span>没有搜索到该地址</span>}
      onSelect={onSelect}
      onSearch={onSearch}
      onChange={handleAddress}
      value={address}
      disabled={!region}>
      <Input placeholder="输入门店地址" className="custom" />
    </AutoComplete>
  )
}
