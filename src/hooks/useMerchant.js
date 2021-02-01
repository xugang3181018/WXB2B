// 门店操作
import { door as doorState, shopDetails, insertShop, getDeepcamShop, updateShop, doorLockOperation } from 'api'
import { useRequest, useLocalStorageState } from 'ahooks'
import { notification } from 'antd'

const useMerchant = arg => {
  const [login] = useLocalStorageState('login')
  const { appId } = login
  const params = { appId }
  const defaultParams = [params]

  const onSuccess = res => {
    if (res.code === 'SUCCESS') {
      notification.success({
        message: res.msg
      })
    }
    if (res.code === 'FAILED') {
      notification.warning({
        message: res.msg
      })
    }
  }

  const options = { defaultParams, onSuccess, manual: true }
  const insert = useRequest(insertShop, options)
  const deepShop = useRequest(getDeepcamShop, options)
  const detail = useRequest(shopDetails, options)
  const door = useRequest(doorState, options)
  const update = useRequest(updateShop, options)
  const lock = useRequest(doorLockOperation, options)
  return { insert, deepShop, detail, door, update, lock }
}

export default useMerchant
