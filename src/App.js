import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import { GlobalProvider } from 'context/GlobalState'
import { NotFound, PagePlaceholder } from 'component'
import PrivateRoute from 'routes/PrivateRoute'
const PageLayout = lazy(() => import('layout/PageLayout'))
const Login = lazy(() => import('layout/Login'))
export default function App() {
  return (
    <ConfigProvider>
      <GlobalProvider>
        <BrowserRouter basename="/">
          <Suspense fallback={<PagePlaceholder />}>
            <Switch>
              <Route path="/login" render={routeProps => <Login {...routeProps} />} />
              <PrivateRoute path="/" component={PageLayout} />
              <Route render={routeProps => <NotFound {...routeProps} />} />
            </Switch>
          </Suspense>
        </BrowserRouter>
      </GlobalProvider>
    </ConfigProvider>
  )
}
