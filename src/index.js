import React from 'react'
import { render } from 'react-dom'
import 'antd/dist/antd.css'
import 'style/icon.less'
import 'style/app.less'
import App from './App'

const rootElement = document.getElementById('root')
render(<App />, rootElement)
