import React, { createContext, useReducer, useEffect } from 'react'
import { useLocalStorageState } from 'ahooks'
import AppReducer from './AppReducer'
import initState from './initState'

export const GlobalContext = createContext(initState)
export const GlobalProvider = ({ children }) => {
  const [login] = useLocalStorageState('login')
  const [state, dispatch] = useReducer(AppReducer, initState)

  useEffect(() => {
    action.changeLogin(login || {})
  }, [])

  const action = {
    changeCurrent(current) {
      dispatch({
        type: 'CHANGE_CURRENT',
        payload: current
      })
    },
    changeLogin(login) {
      dispatch({
        type: 'CHANGE_LOGIN',
        payload: login
      })
    },
    changeCollapsed() {
      dispatch({
        type: 'CHANGE_COLLAPSED'
      })
    },
    // 面包屑
    changeBread(bread) {
      dispatch({
        type: 'CHANGE_BREAD',
        payload: bread
      })
    },
    // 选择任务
    taskChange(payload) {
      dispatch({
        type: 'TASK_CHANGE',
        payload
      })
    },
    // 任务列表
    cachMessage(message) {
      dispatch({
        type: 'CACH_MESSAGE',
        payload: message
      })
    },
    // 任务列表
    setLocalMessage(payload) {
      dispatch({
        type: 'SET_LOCAL_MESSAGE',
        payload
      })
    },
    // 任务列表
    clearMessage(payload) {
      dispatch({
        type: 'CLEAR_MESSAGE',
        payload
      })
    },
    // message 连接状态
    setMessageState(payload) {
      dispatch({
        type: 'SET_MESSAGE_STATE',
        payload
      })
    }
  }
  return <GlobalContext.Provider value={{ ...state, ...action, dispatch }}>{children}</GlobalContext.Provider>
}
