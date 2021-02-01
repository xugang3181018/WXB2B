import React, { Fragment, useContext } from 'react'
import routes from 'routes/routes'
import { GlobalContext } from 'context/GlobalState'
import { Menu } from 'antd'
import { Link, useLocation } from 'react-router-dom'

export default function SideMenu(props) {
  const { theme } = useContext(GlobalContext)
  return (
    <Menu theme={theme} mode="inline" defaultSelectedKeys={['/']} selectedKeys={[useLocation().pathname]}>
      {routes.map((item, index) => {
        const icon = (
          <span role="img" aria-label="menu-unfold" className="anticon" key={index}>
            <i className={`ico ico-${item.icon}`} />
          </span>
        )
        return (
          <Fragment key={index}>
            {item.routes ? (
              <Menu.SubMenu icon={icon} title={item.breadcrumb} key={item.path}>
                {item.routes.map((itm, idx) => {
                  return (
                    <Menu.Item key={itm.path}>
                      <Link to={itm.path}>{itm.breadcrumb}</Link>
                    </Menu.Item>
                  )
                })}
              </Menu.SubMenu>
            ) : (
              <Menu.Item icon={icon} key={item.path}>
                <Link to={item.pathname || item.path}>{item.breadcrumb}</Link>
              </Menu.Item>
            )}
          </Fragment>
        )
      })}
    </Menu>
  )
}
