(window.webpackJsonp=window.webpackJsonp||[]).push([[14],{OMq5:function(e,a,t){"use strict";t.d(a,"a",(function(){return n}));var n={formItemLayout:{labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:16}}},tailFormItemLayout:{wrapperCol:{xs:{span:24,offset:0},sm:{span:16,offset:5}}}}},cwhJ:function(e,a,t){"use strict";t.r(a);var n=t("pVnL"),l=t.n(n),r=t("J4zp"),m=t.n(r),c=t("q1tI"),o=t.n(c),i=(n=t("+eQT"),t("2fM7")),s=t("Vl3Y"),u=t("BMrR"),d=t("kPKH"),p=t("5rEg"),E=t("2/Rp"),f=t("zeV3"),h=t("VXEj"),b=t("1GRj"),w=t("wCAj"),I=t("/wGt"),y=t("Nlzp"),C=t("EUoS"),g=t("B0Bl"),k=(r=t("OMq5"),t("WH8p")),v=t("Qcty"),x=n.a.RangePicker,z=i.a.Option,L=r.a.formItemLayout,O=r.a.tailFormItemLayout,j=["\u672a\u77e5 ","\u7537 ","\u5973"];a.default=function(e){var a=o.a.useContext(g.a).login.appId,t=s.a.useForm(),n={form:R=m()(t,1)[0],paginated:!0,defaultParams:[{base:{appId:a}}]},r=(N=Object(C.a)(y.D,n)).tableProps,M=(t=N.search,N.run),N=(a=t.type,n=t.changeType,t.submit),R=(t=t.reset,t=o.a.createElement(u.a,{className:"ant-advanced-search-form"},o.a.createElement(d.a,{span:12},o.a.createElement(s.a,l()({form:R,layout:"horizontal"},L),o.a.createElement(s.a.Item,{label:"\u6ce8\u518c\u65f6\u95f4"},o.a.createElement(x,{showTime:!0})),o.a.createElement(s.a.Item,{label:"\u6635\u79f0",name:"nickName"},o.a.createElement(p.a,{placeholder:"name"})),o.a.createElement(s.a.Item,{label:"\u624b\u673a\u53f7",name:"mobile"},o.a.createElement(p.a,{placeholder:"\u624b\u673a\u53f7"})),o.a.createElement(s.a.Item,{name:"gender",label:"\u9009\u62e9\u6027\u522b"},o.a.createElement(i.a,{placeholder:"\u9009\u62e9\u6027\u522b",onChange:function(e){return M({gender:e})}},o.a.createElement(z,{value:"0"},"\u672a\u77e5"),o.a.createElement(z,{value:"1"},"\u7537"),o.a.createElement(z,{value:"2"},"\u5973"))),o.a.createElement(s.a.Item,O,o.a.createElement(E.a,{type:"primary",onClick:N},"\u641c\u7d22\u4f1a\u5458"),o.a.createElement(E.a,{onClick:t,style:{marginLeft:16}},"\u91cd\u7f6e"),o.a.createElement(E.a,{type:"link",onClick:n},"\u6536\u8d77"))))),n=o.a.createElement("div",null,o.a.createElement(s.a,{form:R,style:{display:"flex"}},o.a.createElement(f.b,null,o.a.createElement(s.a.Item,{name:"merchantCode"},o.a.createElement(v.b,{placeholder:"\u9009\u62e9\u95e8\u5e97",onChange:N})),o.a.createElement(s.a.Item,{name:"mobile"},o.a.createElement(p.a.Search,{placeholder:"\u8f93\u5165\u624b\u673a\u53f7/\u59d3\u540d/\u6635\u79f0",style:{width:240},onSearch:N}))))),Object(c.useState)(!1)),F=(R=(N=m()(R,2))[0],N[1]);N=[{dataIndex:"nickName",title:"\u4f1a\u5458\u4fe1\u606f",width:200,render:function(e,a){return o.a.createElement(h.b.Item.Meta,{avatar:o.a.createElement(b.a,{width:44,src:a.headImgUrl}),title:e,description:a.mobile})}},{dataIndex:"sex",title:"\u6027\u522b",width:90,render:function(e){return o.a.createElement("span",null,j[e])}},{dataIndex:"createDate",title:"\u6ce8\u518c\u65f6\u95f4"},{dataIndex:"merchantName",title:"\u95e8\u5e97\u540d\u79f0"},{title:"\u64cd\u4f5c",key:"action",width:80,render:function(e,a){return o.a.createElement(f.b,{size:"middle"},o.a.createElement("a",{onClick:function(){return F(a)}},"\u8be6\u60c5"))}}];return o.a.createElement(c.Fragment,null,o.a.createElement("div",null,"simple"===a?n:t,o.a.createElement(w.a,l()({onRow:function(e){return{onClick:function(a){F(e)}}},columns:N,rowKey:"id"},r,{size:"large"}))),o.a.createElement(I.a,{width:900,title:"\u4f1a\u5458\u8be6\u60c5",placement:"right",closable:!0,onClose:function(){return F(!1)},visible:R,destroyOnClose:!0},o.a.createElement(k.a,R)))}}}]);