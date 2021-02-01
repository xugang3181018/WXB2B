import React from 'react'
import { Row, Col, Skeleton } from 'antd'
const Placeholder = () => {
  return (
    <Row gutter={[20, 20]} justify="center" className="placeholder" style={{ width: '100%' }}>
      <Col span={24}>
        <div className="placeholder-block head">
          <Row justify="center">
            <Col span={22}>
              <Skeleton className="skeleto" paragraph={{ rows: 1 }} avatar={true} />
            </Col>
          </Row>
        </div>
      </Col>
      <Col span={24}>
        <Row gutter={[20, 20]} justify="center">
          <Col span={22}>
            <Row gutter={20}>
              <Col span={6}>
                <div className="placeholder-block val">
                  <Skeleton paragraph={{ rows: 1 }} className="skeleto" />
                </div>
              </Col>
              <Col span={6}>
                <div className="placeholder-block val">
                  <Skeleton paragraph={{ rows: 1 }} className="skeleto" />
                </div>
              </Col>
              <Col span={6}>
                <div className="placeholder-block val">
                  <Skeleton paragraph={{ rows: 1 }} className="skeleto" />
                </div>
              </Col>
              <Col span={6}>
                <div className="placeholder-block val">
                  <Skeleton paragraph={{ rows: 1 }} className="skeleto" />
                </div>
              </Col>
            </Row>
          </Col>
          <Col span={22}>
            <div className="placeholder-block cell">
              <Skeleton className="skeleto" />
            </div>
          </Col>
          <Col span={22}>
            <div className="placeholder-block cell">
              <Skeleton className="skeleto" />
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default Placeholder
