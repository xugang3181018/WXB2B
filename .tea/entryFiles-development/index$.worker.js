if(!self.__appxInited) {
self.__appxInited = 1;


require('./config$');


  var AFAppX = self.AFAppX.getAppContext
    ? self.AFAppX.getAppContext().AFAppX
    : self.AFAppX;
  self.getCurrentPages = AFAppX.getCurrentPages;
  self.getApp = AFAppX.getApp;
  self.Page = AFAppX.Page;
  self.App = AFAppX.App;
  self.my = AFAppX.bridge || AFAppX.abridge;
  self.abridge = self.my;
  self.Component = AFAppX.WorkerComponent || function(){};
  self.$global = AFAppX.$global;
  self.requirePlugin = AFAppX.requirePlugin;
          

if(AFAppX.registerApp) {
  AFAppX.registerApp({
    appJSON: appXAppJson,
  });
}



function success() {
require('../../app');
require('../../node_modules/mini-antui/es/badge/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../node_modules/mini-antui/es/tabs/index?hash=b998354db5b64281090d8969355b2b3db41cda49');
require('../../node_modules/mini-antui/es/tabs/tab-content/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../node_modules/mini-antui/es/modal/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../node_modules/mini-antui/es/calendar/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../components/calender/calender?hash=edfdc08849ee96dbad157c1d4620561f97202991');
require('../../components/paymentDetails/paymentDetails?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../node_modules/mini-antui/es/popup/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../components/payTotal/payTotal?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../components/content/content?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../pages/login/login?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/home/home?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/paysuccess/paysuccess?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/linkagemoney/linkagemoney?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/membersPay/membersPay?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/payproceed/payproceed?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/orderFlow/orderFlow?hash=d6793712b3a02497cb89974ea884d2ea723df6b9');
require('../../pages/connectClass/connectClass?hash=a7b20c0bbaf67531f1157f01de561152b1fec858');
require('../../pages/setting/setting?hash=01525438685c87440e7641caaa629d71119f5949');
require('../../pages/recore/recore?hash=744caa284d1f925a945287d2fc2f3ae8103f04e9');
require('../../pages/groupQuery/groupQuery?hash=744caa284d1f925a945287d2fc2f3ae8103f04e9');
require('../../pages/groupDetails/groupDetails?hash=d7872f7dc38fb4bf97cd11eec58516dfa08801fb');
require('../../pages/orderDetail/orderDetail?hash=f8df2bbfbe92a35a58027fa9c74f8dd9c63df2c9');
require('../../pages/accountDetails/accountDetails?hash=d7872f7dc38fb4bf97cd11eec58516dfa08801fb');
require('../../pages/order_refund/order_refund?hash=dc097e95bee5cd7c6aad4989963d6d8251d4abfd');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
}