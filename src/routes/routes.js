import { lazy } from 'react'

const routes = [
  {
    path: '/',
    exact: true,
    component: lazy(() => import('pages/dashboard/index')),
    breadcrumb: '首页',
    icon: 'apps'
  },
  {
    path: '/task',
    component: lazy(() => import('pages/task/index')),
    breadcrumb: '任务中心',
    icon: 'task'
  },
  {
    path: '/merchant',
    icon: 'mall',
    component: lazy(() => import('pages/merchant/index')),
    breadcrumb: '门店管理',
    routes: [
      {
        path: '/merchant/goods/list',
        pathname: '/merchant/goods/:id',
        component: lazy(() => import('pages/merchant/goods/index')),
        breadcrumb: '商品管理',
        routes: [
          {
            path: '/merchant/goods/list',
            component: lazy(() => import('pages/merchant/goods/List')),
            breadcrumb: '商品列表'
          },
          {
            path: '/merchant/goods/modify/new',
            pathname: '/merchant/goods/modify/:id',
            component: lazy(() => import('pages/merchant/goods/Modify')),
            breadcrumb: '创建商品'
          }
        ]
      },
      {
        path: '/merchant/store/list',
        pathname: '/merchant/store/:id',
        component: lazy(() => import('pages/merchant/store/index')),
        breadcrumb: '门店列表',
        routes: [
          {
            path: '/merchant/store/modify',
            pathname: '/merchant/store/modify/:id',
            component: lazy(() => import('pages/merchant/store/Modify')),
            name: '门店编辑'
          },
          {
            path: '/merchant/store/list',
            component: lazy(() => import('pages/merchant/store/List')),
            breadcrumb: '门店列表'
          }
        ]
      },
      {
        path: '/merchant/device',
        component: lazy(() => import('pages/merchant/Device')),
        breadcrumb: '设备管理'
      },
      {
        path: '/merchant/review',
        component: lazy(() => import('pages/merchant/Review')),
        breadcrumb: '视频回看'
      }
    ]
  },
  {
    path: '/trusteeship',
    icon: 'exchange',
    component: lazy(() => import('pages/trusteeship/index')),
    breadcrumb: '托管管理',
    routes: [
      {
        path: '/trusteeship/door-history',
        component: lazy(() => import('pages/trusteeship/DoorHistory')),
        breadcrumb: '出入记录'
      },
      {
        path: '/trusteeship/merchant-visitor',
        component: lazy(() => import('pages/trusteeship/Visitor')),
        breadcrumb: '访客记录'
      }
    ]
  },
  {
    path: '/member',
    icon: 'vips',
    component: lazy(() => import('pages/member/index')),
    breadcrumb: '会员管理'
  },
  {
    path: '/staff',
    icon: 'service',
    component: lazy(() => import('pages/staff/index')),
    breadcrumb: '客服管理',
    routes: [
      {
        path: '/staff/list',
        component: lazy(() => import('pages/staff/List')),
        breadcrumb: '客服列表'
      },
      {
        path: '/staff/modify/new',
        pathname: '/staff/modify/:id',
        component: lazy(() => import('pages/staff/Modify')),
        breadcrumb: '创建客服'
      },
      {
        path: '/staff/records',
        component: lazy(() => import('pages/staff/Records')),
        breadcrumb: '分发记录'
      }
    ]
  },
  {
    path: '/report',
    icon: 'orders',
    component: lazy(() => import('pages/report/index')),
    breadcrumb: '数据报表'
    // routes: [
    //   { path: '/report/detail', component: './report/detail', name: '明细明显' },
    //   { path: '/report/card', component: './report/card', name: '银行卡信息' },
    //   { path: '/report/drawn', component: './report/drawn', name: '提款明细' }
    // ]
  }
]

export default routes
