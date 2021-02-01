import task from '../pages/task'

export default (state, action) => {
  const { payload, type } = action
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        login: { ...state.login, ...action.payload }
      }
      break
    case 'CHANGE_COLLAPSED':
      return {
        ...state,
        collapsed: !state.collapsed
      }
      break
    case 'CHANGE_LOGIN':
      return {
        ...state,
        login: payload
      }
      break
    case 'CHANGE_BREAD':
      return {
        ...state,
        bread: { ...state.bread, ...action.payload }
      }
      break
    case 'TASK_CHANGE':
      return {
        ...state,
        task: payload
      }
      break
    case 'SET_LOCAL_MESSAGE':
      return {
        ...state,
        taskMessage: payload
      }
      break
    case 'CACH_MESSAGE':
      let msg = Array.from(state.taskMessage)
      let list = []
      const node = action.payload
      if (node?.type === 1) {
        let index = msg.findIndex(item => item.inOutRecordId === node.inOutRecordId && item.type === 1)
        index != -1 && msg.splice(index, 1)
        list = msg
      } else if (node?.type === 6) {
        let index = msg.findIndex(item => item.merchantCode === node.merchantCode && item.type === 6)
        index != -1 && msg.splice(index, 1)
        list = msg
      } else {
        list = msg
      }
      // 缓存设置
      window.localStorage.setItem('message', JSON.stringify([node, ...list]))
      return {
        ...state,
        taskMessage: [node, ...msg],
        merchant: {}
        // merchant: { pollingInterval: Math.ceil(Math.random() * 10000) }
      }
      break
    case 'CLEAR_MESSAGE':
      const filterMessage = state.taskMessage.filter(item => item.inOutRecordId != action.payload)
      // 重新设置缓存
      window.localStorage.setItem('message', JSON.stringify(filterMessage))
      return {
        ...state,
        taskMessage: filterMessage,
        task: null
      }
      break
    case 'SET_MERCHANT':
      return {
        ...state,
        merchant: action.payload
      }
      break
    case 'SET_MESSAGE_STATE':
      return {
        ...state,
        messageState: action.payload
      }
      break
    default:
      return state
  }
}
