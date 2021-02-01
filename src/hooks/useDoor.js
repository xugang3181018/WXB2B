import { door, doorLock } from 'api'
import { useRequest, useLocalStorageState } from 'ahooks'
import { notification } from 'antd'

const useDoor = () => {
  const [login] = useLocalStorageState('login')
  const { appId, operatorId } = login
  const params = { appId, merchantCode }
  const defaultParams = [params]

  const onSuccess = res => {
    if (res.code === 'SUCCESS') {
      notification.success({
        message: '操作成功',
        description: res.msg,
        duration: null
      })
    }
    if (res.code === 'FAILED') {
      notification.warning({
        message: '操作失败',
        duration: null,
        description: res.msg
      })
    }
  }

  const options = { defaultParams, onSuccess, manual: true }
  const open = useRequest(door, options)
  const lock = useRequest(doorLock, options)
  return { open, lock }
}

export default useDoor
