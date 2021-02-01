import React, { useEffect } from 'react'
import { useRequest, useLocalStorageState } from 'ahooks'
import { tradeStatistics } from 'api'

const useStatistics = (params = {}) => {
  let order, history, shop
  const [login] = useLocalStorageState('login')
  const { appId } = login
  const defaultParams = { appId, ...params, beginDate: '20201112', endDate: '20201214' }
  const options = {
    defaultParams,
    formatResult: res => {
      return res.result.map(item => {
        return { dates: item.date, ...item.statistics }
      })
    }
  }
  const trad = useRequest(tradeStatistics, options)

  const getTrad = (params = {}) => {
    trad.run({ ...prams })
  }

  return { order, history, shop, ...trad, getTrad }
}

export default useStatistics
