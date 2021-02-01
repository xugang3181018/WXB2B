import React from 'react'
import { Empty } from 'antd'

export default props => {
  const imgStyle = { width: 150, height: 112, margin: '0 auto' }
  return (
    <div style={{ paddingTop: '15vh', ...props?.style }}>
      <Empty imageStyle={imgStyle} image={require(`../../assets/images/${props.image}.png`)} description={props?.description} />
    </div>
  )
}
