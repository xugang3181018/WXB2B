import React, { useEffect } from 'react'
import { Form, Input, Button, Layout, Checkbox, message, Carousel } from 'antd'
import { login as loginYuemiao, customerStatus } from 'api'
import { useHistory, useLocation } from 'react-router-dom'
import { GlobalContext } from 'context/GlobalState'
import { useLocalStorageState, useRequest } from 'ahooks'
import side from 'images/siders.jpg'
import open from 'images/open.jpg'
import mall from 'images/mall.jpg'

const banner = [side, mall, open]

export default React.memo(props => {
  const [form] = Form.useForm()
  const { changeLogin } = React.useContext(GlobalContext)
  const [login, setLogin] = useLocalStorageState('login')
  const history = useHistory()
  const location = useHistory()
  const onSuccess = async res => {
    const { code } = res
    code == 'FAILED' && message.warning(res.subMsg)
    if (code === 'SUCCESS') {
      setLogin(data)
      changeLogin(data)
      // CusRun({ id: data?.operatorId, status: 1, appId: data?.appId })
    }
  }

  const onError = async res => {
    console.log(res)
  }

  // 登录跳转
  const loginRedirect = async () => {
    const redirectUrl = location.from ? location.from : { pathname: '/' }
    return login?.appId && history.replace(redirectUrl)
  }

  const { data, loading, run } = useRequest(loginYuemiao, {
    manual: true,
    onSuccess,
    onError
  })
  // 登录之后更新在线状态
  // const { run: CusRun } = useRequest(customerStatus, {
  //   manual: true
  // })

  // 回车键登录
  useEffect(() => {
    document.addEventListener('keydown', onKeyDown)
    loginRedirect()
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [login])

  // 登录悦喵
  const handleSubmit = async () => !loading && run(form.getFieldsValue())

  // 按回车登录
  const onKeyDown = e => (e.keyCode === 13 ? handleSubmit() : null)

  return (
    <Layout className="login-page">
      <div className="login">
        <div className="login-container">
          <h1 className="login-logo">悦喵</h1>
          <Form layout="vertical" name="normal_login" form={form} className="login-form" initialValues={{ remember: true }} onFinish={handleSubmit}>
            <Form.Item name="userName" className="item">
              <Input size="large" prefix={<i className="ico-user" />} autoComplete="off" placeholder="输入用户名" />
            </Form.Item>
            <Form.Item name="passWord" className="item">
              <Input size="large" prefix={<i className="ico-lock" />} autoComplete="off" type="password" placeholder="输入密码" />
            </Form.Item>
            <Form.Item>
              <Form.Item valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <a className="login-form-forgot" href="">
                Forgot password
              </a>
            </Form.Item>
            <Form.Item>
              <Button block type="primary" size="large" htmlType="submit" className="login-form-button" loading={loading}>
                {loading ? '登录中' : '登录'}
              </Button>
            </Form.Item>
          </Form>
          <div className="login-reserved">Copyright © 2020 yuemiao All rights reserved.</div>
        </div>
        <div className="login-side">
          <div className="login-side-inner">
            <Carousel autoplay adaptiveHeight={true}>
              {banner.map((item, index) => {
                return (
                  <div key={index}>
                    <div className="login-image" style={{ backgroundImage: `url(${item})` }} />
                  </div>
                )
              })}
            </Carousel>
          </div>
        </div>
      </div>
    </Layout>
  )
})
