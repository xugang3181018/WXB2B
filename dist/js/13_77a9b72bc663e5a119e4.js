(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{"7Btv":function(e,t,n){"use strict";n.r(t);var a=n("lSNA"),r=n.n(a),c=(a=n("J4zp"),n.n(a)),l=n("q1tI"),o=n.n(l),i=n("Ty5D"),u=n("55Ip"),m=n("TeRw"),s=n("P1/o");function b(e,t){var n,a=Object.keys(e);return Object.getOwnPropertySymbols&&(n=Object.getOwnPropertySymbols(e),t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)),a}var p=function(e){var t=["\u8bbe\u5907\u8b66\u544a","\u9ed1\u540d\u5355\u8b66\u544a","\u672a\u7ed3\u8d26\u79bb\u5f00\u8b66\u544a"],n=Object(s.a)("".concat("wss://ymht.liantuofu.com","/ymWebSocket/").concat(e),{onMessage:function(e){var n,a=(null==e?void 0:e.data)&&JSON.parse(null==e?void 0:e.data);4===a.type&&(n=a.msg,e=a.alarmType,a=a.merchantName,m.a.warning({message:a,style:{width:450},description:o.a.createElement("div",null,o.a.createElement("p",null,n),o.a.createElement("p",null,t[e]))}))}});e=n.latestMessage;return Object(l.useEffect)((function(){}),[e]),function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?b(Object(n),!0).forEach((function(t){r()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):b(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}({},n)},d=n("dxGJ"),h=n("wJku"),f=n("B0Bl"),y=n("5psM"),E=n("BvKs"),O=n("bx4M"),g=n("zeV3"),j=n("jsC+"),v=n("KrTs"),w=n("0iz5"),z=n("6kHf"),k=n("33sC"),N=(a=n("mhS7"),n.n(a)),S=n("k82f"),P=n("Nlzp");function I(e){var t=Object(l.useContext)(f.a).taskMessage,n=Object(y.a)("login"),a=c()(n,1)[0],r=a.operatorName,u=a.operatorId,m=a.appId,s=Object(l.useState)(!1),b=(D=c()(s,2))[0],p=D[1],d=Object(i.g)(),h=Object(w.b)(P.e,{manual:!0}).run,I=o.a.createElement(E.a,{className:"header-menu-container",size:"large",style:{width:200}},o.a.createElement(E.a.Item,{key:"0",className:"header-menu-item",icon:o.a.createElement("i",{className:"ico ico-lock"})},"\u4fee\u6539\u5bc6\u7801"),o.a.createElement(E.a.Item,{icon:o.a.createElement("i",{className:"ico ico-setting"}),key:"1"},"\u8d26\u53f7\u8bbe\u7f6e"),o.a.createElement(E.a.Divider,null),o.a.createElement(E.a.Item,{icon:o.a.createElement("i",{className:"ico ico-exit"}),key:"2",onClick:function(e){window.localStorage.removeItem("login"),h({appId:m,id:u,status:2}),d.replace({pathname:"/login"})}},"\u9000\u51fa\u767b\u5f55")),x=(n=Object(l.useState)(!1),(s=c()(n,2))[0]),C=s[1],D=[{key:"0",tab:o.a.createElement(o.a.Fragment,null,"\u544a\u8b66\u6d88\u606f(",t.filter((function(e){return 4===e.type})).length,")")},{key:"1",tab:o.a.createElement(o.a.Fragment,null,"\u4efb\u52a1(",t.filter((function(e){return 1===e.type})).length,")")}],M=(n=Object(l.useState)(0),n=(s=c()(n,2))[0],s[1]);s=[o.a.createElement(z.a,{showTitle:!1}),o.a.createElement(k.a,null)],n=o.a.createElement("div",{style:{width:400,height:450}},o.a.createElement(O.a,{size:"small",tabList:D,onTabChange:function(e){return M(e)},tabProps:{size:"small",centered:!0},bodyStyle:{padding:0}},o.a.createElement(S.Scrollbars,{style:{height:400}},o.a.createElement("div",{style:{padding:20}},s[n]))));return o.a.createElement("div",{className:"header-menu"},o.a.createElement(g.b,{className:"header-menu"},o.a.createElement(j.a,{overlay:n,onVisibleChange:function(){return C(!x)},visible:x},o.a.createElement("a",{className:"header-drop"},o.a.createElement(v.a,{count:t.filter((function(e){return e&&4===(null==e?void 0:e.type)})).length,showZero:!0,offset:[12,0],size:"middle"},o.a.createElement("div",{className:"ico ico-bell"})))),o.a.createElement(j.a,{overlay:I,onVisibleChange:function(){return p(!b)},visible:b,arrow:!0},o.a.createElement("a",{className:"header-drop"},o.a.createElement(g.b,{onClick:function(e){return e.preventDefault()}},o.a.createElement(N.a,{src:null==a?void 0:a.headImgUrl,size:22}),"\u6b22\u8fce\u60a8\uff01 ".concat(r)," ",o.a.createElement("i",{className:"ico-arr-down"}))))))}function x(e){var t=Object(D.a)(M,{disableDefaults:!0});return o.a.createElement(C.a,{style:{padding:"20px 0"}},t.map((function(e,t){var n=e.breadcrumb;e=e.match;return o.a.createElement(C.a.Item,{key:e.url},o.a.createElement(u.b,{to:e.url||""},n))})))}var C=n("bE4q"),D=n("3Gel"),M=[{path:"/",exact:!0,component:Object(l.lazy)((function(){return Promise.all([n.e(3),n.e(16)]).then(n.bind(null,"47MB"))})),breadcrumb:"\u9996\u9875",icon:"apps"},{path:"/task",component:Object(l.lazy)((function(){return Promise.resolve().then(n.bind(null,"jVtH"))})),breadcrumb:"\u4efb\u52a1\u4e2d\u5fc3",icon:"task"},{path:"/merchant",icon:"mall",component:Object(l.lazy)((function(){return n.e(20).then(n.bind(null,"wECu"))})),breadcrumb:"\u95e8\u5e97\u7ba1\u7406",routes:[{path:"/merchant/goods/list",pathname:"/merchant/goods/:id",component:Object(l.lazy)((function(){return n.e(19).then(n.bind(null,"lUT4"))})),breadcrumb:"\u5546\u54c1\u7ba1\u7406",routes:[{path:"/merchant/goods/list",component:Object(l.lazy)((function(){return n.e(18).then(n.bind(null,"QzTp"))})),breadcrumb:"\u5546\u54c1\u5217\u8868"},{path:"/merchant/goods/modify/new",pathname:"/merchant/goods/modify/:id",component:Object(l.lazy)((function(){return n.e(6).then(n.bind(null,"dYr5"))})),breadcrumb:"\u521b\u5efa\u5546\u54c1"}]},{path:"/merchant/store/list",pathname:"/merchant/store/:id",component:Object(l.lazy)((function(){return n.e(21).then(n.bind(null,"5Ijw"))})),breadcrumb:"\u95e8\u5e97\u5217\u8868",routes:[{path:"/merchant/store/modify",pathname:"/merchant/store/modify/:id",component:Object(l.lazy)((function(){return Promise.all([n.e(4),n.e(11)]).then(n.bind(null,"6Ej3"))})),name:"\u95e8\u5e97\u7f16\u8f91"},{path:"/merchant/store/list",component:Object(l.lazy)((function(){return n.e(9).then(n.bind(null,"BBgx"))})),breadcrumb:"\u95e8\u5e97\u5217\u8868"}]},{path:"/merchant/device",component:Object(l.lazy)((function(){return n.e(12).then(n.bind(null,"dzlc"))})),breadcrumb:"\u8bbe\u5907\u7ba1\u7406"},{path:"/merchant/review",component:Object(l.lazy)((function(){return Promise.all([n.e(1),n.e(2),n.e(17)]).then(n.bind(null,"FGav"))})),breadcrumb:"\u89c6\u9891\u56de\u770b"}]},{path:"/trusteeship",icon:"exchange",component:Object(l.lazy)((function(){return n.e(27).then(n.bind(null,"sNiQ"))})),breadcrumb:"\u6258\u7ba1\u7ba1\u7406",routes:[{path:"/trusteeship/door-history",component:Object(l.lazy)((function(){return n.e(25).then(n.bind(null,"2jbv"))})),breadcrumb:"\u51fa\u5165\u8bb0\u5f55"},{path:"/trusteeship/merchant-visitor",component:Object(l.lazy)((function(){return n.e(26).then(n.bind(null,"81oz"))})),breadcrumb:"\u8bbf\u5ba2\u8bb0\u5f55"}]},{path:"/member",icon:"vips",component:Object(l.lazy)((function(){return n.e(14).then(n.bind(null,"cwhJ"))})),breadcrumb:"\u4f1a\u5458\u7ba1\u7406"},{path:"/staff",icon:"service",component:Object(l.lazy)((function(){return n.e(24).then(n.bind(null,"jGnb"))})),breadcrumb:"\u5ba2\u670d\u7ba1\u7406",routes:[{path:"/staff/list",component:Object(l.lazy)((function(){return n.e(23).then(n.bind(null,"B3DS"))})),breadcrumb:"\u5ba2\u670d\u5217\u8868"},{path:"/staff/modify/new",pathname:"/staff/modify/:id",component:Object(l.lazy)((function(){return n.e(7).then(n.bind(null,"ii1l"))})),breadcrumb:"\u521b\u5efa\u5ba2\u670d"},{path:"/staff/records",component:Object(l.lazy)((function(){return n.e(15).then(n.bind(null,"JKZm"))})),breadcrumb:"\u5206\u53d1\u8bb0\u5f55"}]},{path:"/report",icon:"orders",component:Object(l.lazy)((function(){return n.e(22).then(n.bind(null,"KsIK"))})),breadcrumb:"\u6570\u636e\u62a5\u8868"}];function T(e){var t=Object(l.useContext)(f.a).theme;return o.a.createElement(E.a,{theme:t,mode:"inline",defaultSelectedKeys:["/"],selectedKeys:[Object(i.h)().pathname]},M.map((function(e,t){var n=o.a.createElement("span",{role:"img","aria-label":"menu-unfold",className:"anticon",key:t},o.a.createElement("i",{className:"ico ico-".concat(e.icon)}));return o.a.createElement(l.Fragment,{key:t},e.routes?o.a.createElement(E.a.SubMenu,{icon:n,title:e.breadcrumb,key:e.path},e.routes.map((function(e,t){return o.a.createElement(E.a.Item,{key:e.path},o.a.createElement(u.b,{to:e.path},e.breadcrumb))}))):o.a.createElement(E.a.Item,{icon:n,key:e.path},o.a.createElement(u.b,{to:e.pathname||e.path},e.breadcrumb)))})))}var B=n("oSW2"),J=n("Ol7k"),F=n("BMrR"),K=n("kPKH"),V=n("wFql"),q=n("Qcty");function G(e,t){var n,a=Object.keys(e);return Object.getOwnPropertySymbols&&(n=Object.getOwnPropertySymbols(e),t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)),a}var H=J.a.Header,L=J.a.Content,Q=J.a.Sider,R=J.a.Footer;t.default=function(e){var t=(v=Object(l.useContext)(f.a)).collapsed,n=v.theme,a=v.changeCollapsed,m=(v.task,v.cachMessage),s=(v.taskMessage,v.merchant),b=v.setLocalMessage,E=v.setMessageState,g=Object(y.a)("message",[]),j=c()(g,1)[0],v=Object(y.a)("login"),z=(g=c()(v,1)[0],v=Object(i.h)().pathname,(g=p((null==g?void 0:g.isCustormer)&&(null==g?void 0:g.operatorId))).readyState),k=g.latestMessage,N=Object(l.useRef)([]);return N.current=Object(l.useMemo)((function(){var e=(null==k?void 0:k.data)&&JSON.parse(null==k?void 0:k.data);return N.current.concat(e)}),[k]),Object(l.useLayoutEffect)((function(){var e=(null==k?void 0:k.data)&&JSON.parse(null==k?void 0:k.data)||null;e&&m(e)}),[k]),Object(l.useEffect)((function(){b(j)}),[]),Object(l.useEffect)((function(){E(z)}),[z]),o.a.createElement(w.a,{value:function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?G(Object(n),!0).forEach((function(t){r()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):G(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}({},s)},o.a.createElement(J.a,{className:"page-container"},o.a.createElement(Q,{className:"page-menu",theme:n,trigger:null,collapsible:!0,collapsed:t},o.a.createElement("h1",{className:"page-logo"},o.a.createElement(u.b,{className:"ico-logo",to:"/"})),o.a.createElement(T,null)),o.a.createElement(l.Suspense,{fallback:o.a.createElement(q.e,null)},o.a.createElement(L,{style:{paddingTop:64,overflowX:"hidden"}},"/task"===v?o.a.createElement(B.a,{routes:M}):o.a.createElement(l.Fragment,null,o.a.createElement(H,{className:"page-header",theme:n,style:{position:"fixed",top:0,zIndex:1,width:"100%"}},o.a.createElement("a",{onClick:a},t?o.a.createElement(d.a,{theme:n}):o.a.createElement(h.a,{theme:n})),o.a.createElement(I,null)),o.a.createElement(F.a,{justify:"center"},"/"===v?o.a.createElement(B.a,{routes:M}):o.a.createElement(K.a,{span:21},o.a.createElement(x,null),o.a.createElement(O.a,null,o.a.createElement(B.a,{routes:M})))),o.a.createElement(R,{style:{textAlign:"center",fontSize:12,marginBottom:30}},o.a.createElement(V.a.Text,{type:"secondary"},"\u60a6\u55b5\u65e0\u4eba\u4fbf\u5229\u5e97\xa92020")))))))}},oSW2:function(e,t,n){"use strict";var a=n("pVnL"),r=n.n(a),c=n("q1tI"),l=n.n(c),o=n("Ty5D"),i=Object(c.lazy)((function(){return Promise.resolve().then(n.bind(null,"nNI6"))}));t.a=l.a.memo((function(e){return l.a.createElement(c.Fragment,null,e.routes&&l.a.createElement(o.d,null,e.routes.map((function(e,t){var n=e.routes,a=e.exact,c=e.component,i=e.path,u=e.pathname,m=e.name;return e.strict,l.a.createElement(o.b,{key:t,exact:a,path:u||i,render:function(e){return l.a.createElement(c,r()({routes:n,parent:{path:i,name:m,pathname:u},path:i},e))}})})),l.a.createElement(o.b,{render:function(e){return l.a.createElement(i,e)}})))}))}}]);