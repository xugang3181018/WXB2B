import React from 'react'
import { Route, Redirect, useParams, useRouteMatch } from 'react-router-dom'
import { useLocalStorageState } from 'ahooks'

export default function PrivateRoute(props) {
  const { component: Component, path, routes = null, pathname, exact = false, ...rest } = props
  const [login] = useLocalStorageState('login')
  return (
    <Route
      {...rest}
      path={pathname || path}
      exact={exact}
      render={routeProps => {
        // console.log(111, routeProps)
        const redirectProps = {
          pathname: '/login',
          from: routeProps.location
        }
        return login ? <Component routes={routes} {...routeProps} /> : <Redirect to={redirectProps} />
      }}
    />
  )
}
