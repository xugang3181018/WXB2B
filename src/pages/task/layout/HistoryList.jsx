import React, { Fragment, useState } from 'react'
import { useRequest, useLocalStorageState } from 'ahooks'
import { historyTask } from 'api'
import { List, Space, Drawer, Button, Tag } from 'antd'
import TaskDetail from 'pages/task/TaskDetail'
import Avatar from 'antd/lib/avatar/avatar'

const HistoryList = () => {
  const [login] = useLocalStorageState('login')
  const { appId, operatorId } = login
  const defaultParams = [{ appId, operatorId, pageSize: 50 }]
  const options = { defaultParams }
  const { data, loading, run } = useRequest(historyTask, {
    ...options,
    initialData: { result: [] },
    formatResult: res => {
      const arr = Array.from(data?.result || [])
      let result = arr.concat(res?.result ?? [])
      return { ...res, result }
    }
  })
  const [detail, setDetail] = useState(null)

  const getMore = () => {
    if (data?.totalPage > data?.currentPage) {
      run({ currentPage: data?.currentPage + 1, pageSize: 50, appId, operatorId })
    }
  }

  const loadMore =
    data?.totalPage === data?.currentPage && loading ? null : (
      <div
        style={{
          textAlign: 'center',
          margin: '20px 0',
          height: 32,
          lineHeight: '32px'
        }}>
        <Button onClick={getMore}>加载更多</Button>
      </div>
    )
  const renderItem = (item, index) => {
    const taskMsg = JSON.parse(item.message)
    // const door = ['进入', '离开']
    // const extra = {< Tag > { door[taskMsg?.openType]}</Tag >}
    return (
      <Fragment>
        {taskMsg.type === 2 && (
          <List.Item style={{ padding: 20 }} key={index} onClick={() => setDetail(JSON.parse(item?.message || ''))}>
            <List.Item.Meta
              avatar={<Avatar size={44} src={taskMsg?.headImgUrl} />}
              title={<Space>{taskMsg?.merchantName}</Space>}
              description={
                <div>
                  {taskMsg?.nickName} / {item?.createTime}
                </div>
              }
            />
          </List.Item>
        )}
      </Fragment>
    )
  }
  return (
    <Fragment>
      <List
        dataSource={data?.result}
        size="small"
        locale={{ emptyText: '无历史任务' }}
        loadMore={data?.result.length ? loadMore : null}
        renderItem={renderItem}
      />
      <Drawer onClose={() => setDetail(false)} visible={detail} width={870} title="历史任务详情">
        <TaskDetail {...detail} />
      </Drawer>
    </Fragment>
  )
}

export default HistoryList
