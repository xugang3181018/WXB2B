import React, { Fragment } from 'react'
import { Cascader } from 'antd'
import { useRequest } from 'ahooks'

import provinces from 'china-division/dist/provinces.json'
import cities from 'china-division/dist/cities.json'
import areas from 'china-division/dist/areas.json'

// console.log(provinces, cities, areas)
areas.forEach(area => {
  const matchCity = cities.filter(city => city.code === area.cityCode)[0]
  if (matchCity) {
    matchCity.children = matchCity.children || []
    matchCity.children.push({
      label: area.name,
      value: area.code
    })
  }
})

cities.forEach(city => {
  const matchProvince = provinces.filter(province => province.code === city.provinceCode)[0]
  if (matchProvince) {
    matchProvince.children = matchProvince.children || []
    matchProvince.children.push({
      label: city.name,
      value: city.code,
      children: city.children
    })
  }
})

const options = provinces.map(province => ({
  label: province.name,
  value: province.code,
  children: province.children
}))

export default function Area({ value = [], change, onChange }) {
  const casChange = (e, s) => {
    change(s.map(item => item.label))
  }
  return <Cascader options={options} value={value} showSearch onChange={casChange} placeholder="请选择地址" style={{ width: 400 }} />
}
