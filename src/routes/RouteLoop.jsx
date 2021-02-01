import React, { Suspense, lazy, Fragment } from 'react'
import { Switch, Route, useLocation } from 'react-router-dom'
import { Spin, Layout } from 'antd'
const NotFound = lazy(() => import('component/NotFound'))

export default React.memo(props => {
  return (
    <Fragment>
      {props.routes && (
        <Switch>
          {props.routes.map((item, index) => {
            const { routes: subRoute, exact, component: Component, path, pathname, name, strict } = item
            return (
              <Route
                key={index}
                exact={exact}
                path={pathname || path}
                render={routeProps => <Component routes={subRoute} parent={{ path, name, pathname }} path={path} {...routeProps} />}
              />
            )
          })}
          <Route render={routeProps => <NotFound {...routeProps} />} />
        </Switch>
      )}
    </Fragment>
  )
})
