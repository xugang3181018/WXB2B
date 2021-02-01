import Vue from 'vue'
import Router from 'vue-router'

import store from '@/store';

import Mall from '@/pages/client/Mall';
import MallShow from '@/pages/client/MallShow';
import MallIndex from '@/pages/client/MallIndex';
import MallLogin from '@/pages/client/MallLogin';
import GoodsDetail from '@/pages/client/GoodsDetail';
import GoodsList from '@/pages/client/GoodsList';
import Personal from '@/pages/client/Personal';
import MyOrder from '@/pages/client/MyOrder';
import MyData from '@/pages/client/MyData';
import TakeSite from '@/pages/client/TakeSite';
import Cart from '@/pages/client/Cart';
import OrderDetail from '@/pages/client/OrderDetail';
import ErrorPage from '@/pages/ErrorPage';

Vue.use(Router);

let router = new Router({
  routes: [
    {
      path:"/",
      redirect:"/login"
    },{
      path: '/login',
      name: 'MallLogin',
      component: MallLogin
    },{
      path: '/mall',
      name: 'Mall',
      component: Mall,
      redirect:'/mall/show',
      children:[
        {
          path: 'show',
          name: 'MallShow',
          component: MallShow,
          redirect:'/mall/show/goodsList',
          children:[
            // {
            //   path: 'index',
            //   name: 'MallIndex',
            //   component: MallIndex,
            //   meta: {
            //     requireLogin:true,
            //   },
            // },
            {
              path: 'goodsList/:typeId/:text',
              name: 'GoodsList',
              component: GoodsList,
              meta: {
                requireLogin:true,
              },
            },
            {
              path: 'goods/:id/:code',
              name: 'GoodsDetail',
              component: GoodsDetail,
              meta: {
                requireLogin:true,
              },
            },
          ]
        },{
          path: 'personal',
          name: 'Personal',
          component: Personal,
          redirect:'/mall/personal/cart',
          children:[
            {
              path: 'cart',
              name: 'Cart',
              component: Cart,
              meta: {
                requireLogin:true,
              },
            },
            {
              path: 'myData',
              name: 'MyData',
              component: MyData,
              meta: {
                requireLogin:true,
              },
            },
            {
              path: 'myOrder/:value',
              name: 'MyOrder',
              component: MyOrder,
              meta: {
                requireLogin:true,
              },
            },
            {
              path: 'TakeSite',
              name: 'TakeSite',
              component: TakeSite,
              meta: {
                requireLogin:true,
              },
            },
            {
              path: 'OrderDetail/:value/:status/:name/:code',
              name: 'OrderDetail',
              component: OrderDetail,
              meta: {
                requireLogin:true,
              },
            },
          ]
        }
      ]
    },{
  	  path:'*',
  	  name:'ErrorPage',
  	  component: ErrorPage
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
});

//登录拦截
router.beforeEach((to,from,next) => {
  if(to.meta.requireLogin){
    if(store.state.clientId){
      next()
    }else{
      next({
        path: '/login',
        query:{redirect: to.fullPath}
      })
    }
  }else{
    next();
  }
});

export default router;