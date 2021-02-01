/*
 * @Author: 刘爽
 * @Date: 2021-01-14 16:52:08
 * @LastEditTime: 2021-01-21 22:03:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \yuemiao-admin\src\pages\merchant\Review.jsx
 */

/*
 *                        _oo0oo_
 *                       o8888888o
 *                       88" . "88
 *                       (| -_- |)
 *                       0\  =  /0
 *                     ___/`---'\___
 *                   .' \\|     |// '.
 *                  / \\|||  :  |||// \
 *                 / _||||| -:- |||||- \
 *                |   | \\\  - /// |   |
 *                | \_|  ''\---/''  |_/ |
 *                \  .-\__  '-'  ___/-. /
 *              ___'. .'  /--.--\  `. .'___
 *           ."" '<  `.___\_<|>_/___.' >' "".
 *          | | :  `- \`.;`\ _ /`;.`/ - ` : | |
 *          \  \ `_.   \_ __\ /__ _/   .-` /  /
 *      =====`-.____`.___ \_____/___.-`___.-'=====
 *                        `=---='
 *
 *
 *      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 *            佛祖保佑       永不宕机     永无BUG
 *
 *        佛曰:
 *                写字楼里写字间，写字间里程序员；
 *                程序人员写程序，又拿程序换酒钱。
 *                酒醒只在网上坐，酒醉还来网下眠；
 *                酒醉酒醒日复日，网上网下年复年。
 *                但愿老死电脑间，不愿鞠躬老板前；
 *                奔驰宝马贵者趣，公交自行程序员。
 *                别人笑我忒疯癫，我笑自己命太贱；
 *                不见满街漂亮妹，哪个归得程序员？
 */

import React, { useState, useRef, useEffect } from 'react'
import { videoList, shopList } from 'api'
import { useLocalStorageState, useRequest } from 'ahooks'
import useTableForm from 'hooks/useTableForm'
import ExportExcel from 'js-export-excel'
import 'video-react/dist/video-react.css'
import {
  Player,
  BigPlayButton,
  ControlBar,
  ReplayControl,
  ForwardControl,
  CurrentTimeDisplay,
  TimeDivider,
  PlaybackRateMenuButton,
  VolumeMenuButton
} from 'video-react'
import { MerchantSelect, DatePickRange } from 'component'
import { Table, Space, Form, Input, Row, Col, Select, Button, Divider, Popover, notification, Radio, message } from 'antd'
import moment from 'moment'
export default React.memo(function Review(props) {
  // 数据返回成功
  const onSuccess = res => {
    // console.log(9, res)
    if (res.code === 'FAILED') {
      notification.warning({
        message: '操作失败',
        duration: null,
        description: res.msg
      })
    }
  }
  const [form] = Form.useForm()
  const [login] = useLocalStorageState('login')
  const { appId } = login
  const beginDate = day =>
    moment()
      .subtract(day, 'days')
      .format('YYYY-MM-DD hh:mm:ss')
  const endDate = moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
  const allDate = [beginDate(1), endDate, beginDate(7), beginDate(30)]
  const [params, setParams] = useState({ startTime: allDate[2], endTime: endDate })
  const baseTime = { startTime: allDate[2], endTime: endDate }
  // EW_N3252659689  这个有数据
  const { data: merchantData, loading } = useRequest(shopList, { defaultParams: [{ appId }] })
  const merchantCode = merchantData && merchantData.result[0].merchantCode
  const defaultParams = [{ base: { appId, merchantCode, ...params }, pageSize: 10 }, { time: 2 }]
  const options = { form, defaultParams, onSuccess, paginated: true, cacheKey: 'list' }
  const { tableProps, search } = useTableForm(videoList, { ...options, ready: !!merchantData })
  const { submit, reset } = search
  const dateList = ['昨日', '今日', '近7天', '近30天']
  const refs = useRef(null)
  useEffect(() => {
    form.setFieldsValue({ merchantCode })
  }, [merchantData])

  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 }
  }

  const tailLayout = {
    wrapperCol: { offset: 4, span: 14 }
  }

  //视频日期
  const handleDate = data => {
    form.resetFields(['time'])
    if (data?.length && data[0]) {
      const params = {
        startTime: data[0],
        endTime: data[1]
      }
      setParams(params)
      return
    }
    setParams(baseTime)
  }

  //总体筛选
  const handleTime = ({ target }) => {
    const params = {
      startTime: allDate[target.value],
      endTime: endDate
    }
    form.resetFields(['date'])
    setParams(params)
  }

  //重置
  const handleReset = () => {
    setParams(baseTime)
    reset()
    form.setFieldsValue({ time: 2, merchantCode })
  }

  //编辑失去焦点
  const handleVisibleChange = (val, index) => {
    if (!val && refs.current) {
      refs.current.load()
    }
  }

  // 导出
  const handleExport = () => {
    let option = {}

    option.fileName = 'download'

    option.datas = [
      {
        sheetData: tableProps.dataSource,
        sheetFilter: ['store_name', 'device_name', 'mac', 'video_start_time'],
        sheetHeader: ['门店名称', '设备名称', 'MAC', '时间'],
        columnWidths: [20, 20, 20, 20]
      }
    ]

    let toExcel = new ExportExcel(option) //new
    toExcel.saveExcel() //保存
    message.success('导出成功')
  }

  // 表头
  const columns = [
    {
      title: '门店名称',
      dataIndex: 'store_name'
    },
    {
      title: '设备名称',
      dataIndex: 'device_name'
    },
    {
      title: 'MAC',
      dataIndex: 'mac'
    },
    {
      title: '时间',
      dataIndex: 'video_start_time'
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      align: 'center',
      render: (text, record, index) => {
        return (
          <Space split={<Divider type="vertical" />}>
            <Popover
              placement="bottomRight"
              onVisibleChange={val => handleVisibleChange(val, index)}
              content={
                <div style={{ width: 440 }}>
                  <Player
                    ref={player => {
                      refs.current = player
                    }}>
                    <BigPlayButton position="center" />
                    <ControlBar>
                      <ReplayControl seconds={10} order={1.1} />
                      <ForwardControl seconds={30} order={1.2} />
                      <CurrentTimeDisplay order={4.1} />
                      <TimeDivider order={4.2} />
                      <PlaybackRateMenuButton rates={[5, 2, 1, 0.5, 0.1]} order={7.1} />
                      <VolumeMenuButton vertical />
                    </ControlBar>
                    <source src={record?.url} />
                  </Player>
                </div>
              }
              title="视频回看"
              trigger="click">
              <a>视频回看</a>
            </Popover>
          </Space>
        )
      }
    }
  ]

  return (
    <div>
      {/* FORM */}
      <Form style={{ marginBottom: 30 }} form={form} {...formItemLayout}>
        <Row>
          <Col span={12}>
            <Form.Item name="date" label="视频日期">
              <DatePickRange onChange={handleDate} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="merchantCode" label="门店">
              {/* <MerchantSelect style={{ width: '100%' }} onChange={handleOnChange} /> */}
              <Select style={{ width: '100%' }} loading={loading} placeholder="选择门店">
                {merchantData &&
                  merchantData.result.map((item, index) => (
                    <Select.Option key={index} value={item.merchantCode}>
                      {item.merchantName}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
          {/* <Col span={12}>
            <Form.Item name="status" label="状态">
              <Select placeholder="请选择状态">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item, index) => (
                  <Select.Option value={item} key={index}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col> */}
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item name="time" label="总体筛选">
              <Radio.Group onChange={handleTime}>
                {dateList.map((item, index) => (
                  <Radio.Button value={index} key={index}>
                    {item}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="mac" label="MAC">
              <Input placeholder="请输入MAC" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item {...tailLayout}>
              <Space>
                <Button type="primary" onClick={submit}>
                  筛选
                </Button>
                <Button type="default" disabled={!tableProps.dataSource.length} onClick={handleExport}>
                  导出
                </Button>
                <Button type="default" onClick={handleReset}>
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      {/* TABLE */}
      <Table columns={columns} {...tableProps} rowKey="url" />
    </div>
  )
})
