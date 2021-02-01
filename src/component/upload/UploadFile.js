import React, { useState, Fragment, useContext, Children, useEffect } from 'react'
import { Form, Modal, Row, Col, Pagination, Button, Input, message, Select, Spin } from 'antd'
import { mediaList, mediaCategoryList, mediaCategoryDelete, mediaCategorySave, mediaUpload } from 'api'
import { Scrollbars } from 'react-custom-scrollbars'
import { GlobalContext } from '../context/GlobalState'
import ImageEmpty from '../preview/ImageEmpty'
import UploadImage from './UploadImage'

// 选择媒体组件
export default function UploadFile({ visible, onChange, max = 30 }) {
  const { params } = useContext(GlobalContext)
  const [media, setMedia] = useState({ list: [] })
  const [category, setCategory] = useState([{ id: -1, name: '全部分组' }])
  const [categoryId, setCategoryId] = useState()
  const [imageLoading, setImageLoading] = useState(false)
  // 选择图片列表
  const [image, setImage] = useState(null)
  const [upLoad, setUpload] = useState(false)

  // modal init
  useEffect(() => {
    if (visible) {
      initMedia()
      setUpload(false)
    }
  }, [visible])

  async function initMedia() {
    const res = await getMediaCategoryList()
    setCategoryId(res.list[0].id)
    getMediaList({ categoryId: res.list[0].id })
  }

  // 媒体列表
  async function getMediaList(data = {}) {
    setImageLoading(true)
    if (data.categoryId) setCategoryId(data.categoryId)
    const query = {
      categoryId,
      pageSize: 18,
      type: 0,
      ...params,
      ...data
    }
    let res = await mediaList(query)
    setMedia(res)
    setImageLoading(false)
  }

  // 获取媒体分类
  async function getMediaCategoryList() {
    // type 0 图片 1 视频
    let res = await mediaCategoryList({ ...params, pageSize: 200 })
    setCategory(res.list)
    return res
  }

  // 选择图片
  function selectImage(item, index) {
    let list = Array.from(media.list)
    list.splice(index, 1, { ...item, current: !list[index].current })
    setMedia({ ...media, list })
    let image = []
    list.forEach((itm, idx) => {
      if (itm.current) {
        image.push(itm.url)
      }
    })
    setImage(image)
    setUpload(false)
  }

  // 新增分类
  async function addFormSubmit({ name }) {
    const res = name ? await mediaCategorySave({ ...params, name }) : message.warning('输入分类名称')
    if (res.code == -1) message.warning(res.message)
    setTimeout(async () => {
      let list = await getMediaCategoryList()
      setCategoryId(res.result)
      console.log(categoryId)
    }, 300)
  }

  const addForm = (
    <Form onFinish={addFormSubmit} layout="inline" style={{ padding: 10, display: 'flex', borderTop: '1px solid #f0f0f0' }}>
      <Form.Item name="name" style={{ flex: 1 }}>
        <Input placeholder="新增分类" />
      </Form.Item>
      <Form.Item wrapperCol={{ span: 18 }}>
        <Button type="primary" htmlType="submit">
          新增分类
        </Button>
      </Form.Item>
    </Form>
  )

  const uploadForm = (
    <Form labelCol={{ span: 4 }} wrapperCol={{ span: 17 }} style={{ width: '100%', padding: '30px 0' }}>
      <Form.Item label="图片分组">
        <Select
          onChange={setCategoryId}
          value={categoryId}
          placeholder="选择图片媒体分类"
          dropdownRender={menu => (
            <Fragment>
              {menu}
              <Row gutter={[12]}>
                <Col span={24}>{addForm}</Col>
              </Row>
            </Fragment>
          )}>
          {category &&
            category.map((item, index) => (
              <Select.Option key={index} value={item.id}>
                {item.name}
              </Select.Option>
            ))}
        </Select>
      </Form.Item>
      <Form.Item label="本地图片" extra={<p style={{ fontSize: 12, marginTop: 10 }}>仅支持 gif、 jpg、 png、jpeg 4种格式, 大小不超过2.0 MB</p>}>
        <UploadImage categoryId={categoryId} onChange={setImage} max={max} />
      </Form.Item>
    </Form>
  )

  const imageList = (
    <Fragment>
      <Col span={4} className="c-media-siderbar" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 10 }}>
          <Button onClick={() => setUpload(true)} type="primary" block>
            上传图片
          </Button>
        </div>
        <Scrollbars flex="1">
          {category &&
            category.map((item, index) => {
              return (
                <div
                  className={item.id === categoryId ? 'c-item active' : 'c-item'}
                  key={index}
                  onClick={() => getMediaList({ categoryId: item.id })}>
                  {item.name}
                </div>
              )
            })}
        </Scrollbars>
      </Col>
      <Col span={20} style={{ height: '100%', padding: 20 }}>
        <Spin spinning={imageLoading} wrapperClassName="c-media-loading">
          {media.list.length > 0 ? (
            <Row gutter={[20, 20]}>
              {media.list.map((item, index) => {
                return (
                  <Col span={4} className="c-media-item" key={index} onClick={() => selectImage(item, index)}>
                    <div className={`c-media-content ${item.current && 'active'}`}>
                      {item.current && <i className="ico c-media-check i-image-check" />}
                      <div className="c-media-img" style={{ backgroundImage: `url(${item.url})` }} />
                      <div className="c-media-size">{item.size}</div>
                    </div>
                  </Col>
                )
              })}
            </Row>
          ) : (
            <div className="f-c-c" style={{ height: '100%' }}>
              <ImageEmpty txt="该分类无图片" />
            </div>
          )}
        </Spin>
      </Col>
    </Fragment>
  )

  const footer = (
    <Row justify="space-between">
      <Col>
        {!upLoad && (
          <Pagination
            defaultPageSize={18}
            current={media.currentPage}
            defaultCurrent={1}
            pageSizeOptions={[]}
            hideOnSinglePage={true}
            total={media.totalCount}
            onChange={currentPage => getMediaList({ currentPage })}
          />
        )}
      </Col>
      <Col>
        {upLoad && <Button onClick={() => setUpload(false)}>选择图片</Button>}
        <Button onClick={() => onChange(image)} type="primary">
          确定
        </Button>
      </Col>
    </Row>
  )

  return (
    <Fragment>
      <Modal title="媒体图片" width={900} onCancel={() => onChange(null)} visible={visible} footer={footer} bodyStyle={{ padding: 0 }}>
        <Row style={{ height: 396 }}>{upLoad ? uploadForm : imageList}</Row>
      </Modal>
    </Fragment>
  )
}
