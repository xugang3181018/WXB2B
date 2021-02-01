import React, { useState, useContext, useRef, Fragment } from 'react'
import { message, Spin } from 'antd'
import { upImg } from 'api'
import { generate as uuid } from 'shortid'
import { GlobalContext } from 'context/GlobalState'
import './style.less'
// 图片上传
export default function UploadImage({ onChange, value, max = 1, text = '', multiple = false }) {
  const { login } = useContext(GlobalContext)
  const { merchantCode, appId } = login
  const params = { merchantCode, appId }
  // const [img, setImg] = useState([])
  const [loading, setLoading] = useState(false)
  const fileRef = uuid()

  // 图片上传队列
  async function upAction(e) {
    let upfiles = e.target ? e.target.files : e.dataTransfer.files
    if (upfiles.length > max) {
      message.warn(`最多上传 ${max}张图片`)
      return
    }
    if (upfiles.length > 0) {
      const patter = /(\.*.jpg$)|(\.*.png$)||(\.*.PNG$)|(\.*.gif$)|(\.*.jpeg$)/
      const file = Array.from(upfiles)

      if (file.some(item => !patter.test(item.name))) {
        message.warn('您选择的文件格式正确')
        return
      }

      if (
        file.some(item => {
          const fileSize = item.size / 1024
          return fileSize > 2000
        })
      ) {
        message.warn('文件不能大于2M', 1)
        return
      }

      let baseList = []
      for (var i = 0; i < upfiles.length; i++) {
        baseList.push(
          upImg({
            ...params,
            type: 0,
            upfiles: upfiles[i]
          })
        )
      }
      try {
        setLoading(true)
        const allPic = await Promise.all(baseList)
        const imgs = [...allPic.map(item => item.result[0])]
        onChange(multiple ? imgs : imgs[0])
      } catch (error) {
        console.log(error)
        message.warn('图片上传失败')
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div>
      <input type="file" id={fileRef} onChange={upAction} multiple={multiple} className="upload-input" />
      <div className="upload-list">
        <Spin spinning={loading} delay={500}>
          <label htmlFor={fileRef} className={`upload-button ${value && 'none-border'}`}>
            {value ? (
              <div className="upload-image-item" style={{ width: 120, height: 120 }} style={{ backgroundImage: `url(${value})` }} />
            ) : (
              <Fragment>
                <i className="ico ico-cart-adds" />
                <div>{text}</div>
              </Fragment>
            )}
          </label>
        </Spin>
      </div>
    </div>
  )
}
