(window.webpackJsonp=window.webpackJsonp||[]).push([[22],{KsIK:function(e,t,a){"use strict";a.r(t);var n=a("pVnL"),l=a.n(n),r=a("lSNA"),m=a.n(r),c=(n=a("J4zp"),a.n(n)),o=a("q1tI"),i=a.n(o),u=a("Nlzp"),d=(r=a("2fM7"),a("Vl3Y")),s=a("VXEj"),p=a("mr32"),E=a("BMrR"),b=a("kPKH"),f=a("5rEg"),y=a("2/Rp"),h=a("zeV3"),I=a("wCAj"),v=a("/wGt"),O=a("5psM"),g=a("EUoS"),Y=a("Qcty"),w=(n=a("wd/R"),a.n(n)),j=a("0iz5"),A=a("gFTJ"),C=a("W9HT"),N=A.a.Item,P={WXPAY:"\u5fae\u4fe1\u652f\u4ed8",ALIPAY:"\u652f\u4ed8\u5b9d\u652f\u4ed8",MPAY:"\u4f1a\u5458\u652f\u4ed8",CASH:"\u73b0\u91d1\u652f\u4ed8",BANK:"pos\u652f\u4ed8",UNIONPAY:"\u4e91\u95ea\u4ed8"},T={NOTPAY:"\u672a\u652f\u4ed8",SUCCESS:"\u652f\u4ed8\u6210\u529f",REFUND:"\u8f6c\u5165\u9000\u6b3e",CLOSED:"\u5df2\u5173\u95ed",REVOKED:"\u5df2\u64a4\u9500"};function S(e){var t=e.outTradeNo,a=e.merchantCode,n=(r=Object(j.b)(u.b,{manual:!0})).data,l=(e=r.loading,r.run),r=Object(O.a)("login"),m=c()(r,1)[0].appId;return Object(o.useEffect)((function(){l({showType:1,outTradeNo:t,merchantCode:a,appId:m})}),[t]),i.a.createElement(C.a,{spinning:e},i.a.createElement(A.a,{title:i.a.createElement(s.b.Item.Meta,{title:"\u8ba2\u5355\u8be6\u60c5",description:null==n?void 0:n.outTradeNo}),column:2},i.a.createElement(N,{label:"\u652f\u4ed8\u65b9\u5f0f"},P[null==n?void 0:n.payType]),i.a.createElement(N,{label:"\u5b9e\u6536\u91d1\u989d"},P[null==n?void 0:n.receiptAmount]),i.a.createElement(N,{label:"\u4ea4\u6613\u91d1\u989d"},P[null==n?void 0:n.totalAmount]),i.a.createElement(N,{label:"\u652f\u4ed8\u65b9\u5f0f"},P[null==n?void 0:n.payType]),i.a.createElement(N,{label:"\u4ea4\u6613\u72b6\u6001"},T[null==n?void 0:n.orderStatus]),i.a.createElement(N,{label:"\u4f1a\u5458\u7b49\u7ea7"},null==n?void 0:n.memberLevel),i.a.createElement(N,{label:"\u4f1a\u5458\u540d"},null==n?void 0:n.memberName),i.a.createElement(N,{label:"\u624b\u673a\u53f7"},T[null==n?void 0:n.mobile])),i.a.createElement(s.b,{header:i.a.createElement("h3",null,"\u5546\u54c1\u8ba2\u5355")},(null==n?void 0:n.orderGoods)&&(null==n?void 0:n.orderGoods.map((function(e,t){return i.a.createElement(s.b.Item,{key:t,actions:[i.a.createElement("span",null,Number((null==e?void 0:e.price)*(null==e?void 0:e.quantity)).toFixed(2),"\u5143")]},i.a.createElement(s.b.Item.Meta,{title:null==e?void 0:e.goodsName,description:i.a.createElement("div",null,i.a.createElement("span",null,Number(null==e?void 0:e.price).toFixed(2),"\u5143")," \xd7 ",i.a.createElement("span",null,null==e?void 0:e.quantity))}))})))))}function D(e,t){var a,n=Object.keys(e);return Object.getOwnPropertySymbols&&(a=Object.getOwnPropertySymbols(e),t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)),n}function M(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?D(Object(a),!0).forEach((function(t){m()(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):D(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}r.a.Option;var k={WXPAY:"\u5fae\u4fe1\u652f\u4ed8",ALIPAY:"\u652f\u4ed8\u5b9d\u652f\u4ed8",MPAY:"\u4f1a\u5458\u652f\u4ed8",CASH:"\u73b0\u91d1\u652f\u4ed8",BANK:"pos\u652f\u4ed8",UNIONPAY:"\u4e91\u95ea\u4ed8"};t.default=i.a.memo((function(e){function t(e){return w()(e,T).format(P)}var a=Object(O.a)("login"),n=c()(a,1)[0].appId,r=d.a.useForm(),m=c()(r,1)[0],j={form:m,defaultParams:[{base:{appId:n,billBeginTime:"20201211000000",billEndTime:"20201214235959",orderSource:11,orderStatus:"SUCCESS"}}],paginated:!0,cacheKey:"billAll"},A=(N=Object(g.a)(u.a,M(M({},j),{},{formatResult:function(e){return{list:e.orderDetails,total:e.totalCount}}}))).tableProps,C=N.search,N=(a=(N.run,N.params,N.mutate,C.type),r=C.changeType,n=C.submit,j=C.reset,[{title:"\u4f1a\u5458\u4fe1\u606f",dataIndex:"memberName",width:300,render:function(e,t){return i.a.createElement(s.b.Item.Meta,{title:e,description:t.mobile})}},{title:"\u95e8\u5e97",dataIndex:"merchantName",width:300,render:function(e,t){return i.a.createElement(s.b.Item.Meta,{title:e,description:t.merchantCode})}},{title:"\u652f\u4ed8\u65b9\u5f0f",dataIndex:"payType",render:function(e){return i.a.createElement(p.a,null,k[e])}},{title:"\u652f\u4ed8\u91d1\u989d",dataIndex:"totalAmount",render:function(e){return i.a.createElement("a",null,"\xa5",e)}},{title:"\u521b\u5efa\u65f6\u95f4",dataIndex:"payTime",render:function(e){return w()(e,"YYYYMMDDhhmmss").format("YYYY-MM-DD hh:mm:ss")}},{title:"\u64cd\u4f5c",key:"action",width:150,align:"center",render:function(e,t,a){return i.a.createElement("a",{onClick:function(){return x(t)}},"\u8be6\u60c5")}}]),P=(C=i.a.createElement("div",null,i.a.createElement(d.a,{form:m},i.a.createElement(E.a,{gutter:24},i.a.createElement(b.a,{span:12},i.a.createElement(d.a.Item,{label:"\u5546\u54c1\u54c1\u724c",name:"brand"},i.a.createElement(f.a,{placeholder:"name"}))),i.a.createElement(b.a,{span:12},i.a.createElement(d.a.Item,{label:"\u6240\u5c5e\u673a\u6784",name:"goodsInfo"},i.a.createElement(f.a,{placeholder:"\u5546\u54c1\u540d\u79f0/\u5546\u54c1\u6761\u5f62\u7801\u7801/\u5546\u54c1Id"}))),i.a.createElement(b.a,{span:12},i.a.createElement(d.a.Item,{label:"\u5546\u54c1\u72b6\u6001",name:"size"},i.a.createElement(f.a,{placeholder:"name"}))),i.a.createElement(b.a,{span:12},i.a.createElement(d.a.Item,{label:"\u5546\u54c1\u7b5b\u9009",name:"barcode"},i.a.createElement(f.a,{placeholder:"\u5546\u54c1\u540d\u79f0/\u5546\u54c1\u6761\u5f62\u7801\u7801/\u5546\u54c1Id"})))),i.a.createElement(E.a,null,i.a.createElement(d.a.Item,{style:{display:"flex",justifyContent:"flex-end"}},i.a.createElement(y.a,{type:"primary",onClick:n},"\u641c\u7d22"),i.a.createElement(y.a,{onClick:j,style:{marginLeft:16}},"\u91cd\u7f6e"),i.a.createElement(y.a,{type:"link",onClick:r},"\u8fd4\u56de"))))),"YYYYMMDDhhmmss"),T="YYYY-MM-DD hh-mm-ss",D=w()(new Date).format(P),x=(j=function(e){return w()(e,P).format(T)},r=((r=function(e){return w()().subtract(e,"days").format(P)})(7),r(30),Object(o.useState)([j(D),j(D)])),r=(j=c()(r,2))[0],j=(j[1],i.a.createElement("div",null,i.a.createElement(d.a,{form:m,onFinish:n},i.a.createElement(h.b,null,i.a.createElement(d.a.Item,{name:"merchantCode"},i.a.createElement(Y.b,null)),i.a.createElement(d.a.Item,{name:"billBeginTime",hidden:!0},i.a.createElement(f.a,null)),i.a.createElement(d.a.Item,{name:"billEndTime",hidden:!0},i.a.createElement(f.a,null)),i.a.createElement(d.a.Item,null,i.a.createElement(Y.a,{value:r,onChange:function(e){e=(a=c()(e,2))[0];var a=a[1];e&&m.setFieldsValue({billBeginTime:t(e),billEndTime:t(a)})}})),i.a.createElement(d.a.Item,null,i.a.createElement(y.a,{type:"primary",htmlType:"submit"},"\u7b5b\u9009")))))),n=Object(o.useState)(!1),n=(r=c()(n,2))[0],r[1]);return i.a.createElement(o.Fragment,null,i.a.createElement("div",null,i.a.createElement(E.a,{style:{display:"flex",alignItems:"flex-start",justifyContent:"space-between"}},"simple"===a?j:C),i.a.createElement(I.a,l()({columns:N},A,{rowKey:"outTradeNo"}))),i.a.createElement(v.a,{visible:n,onClose:function(){return x(!1)},width:"550",title:"\u8ba2\u5355\u8be6\u60c5"},i.a.createElement(S,n)))}))}}]);