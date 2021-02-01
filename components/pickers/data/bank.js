const bank = {
  "7": ['102100099996|中国工商银行总行清算中心', '103100000026|中国农业银行资金清算中心', '104100000004|中国银行总行', '105100000017|中国建设银行总行', '301290000007|交通银行', '302100011000|中信银行总行管理部', '303100000006|中国光大银行', '304100040000|华夏银行股份有限公司总行', '305100000013|中国民生银行总行', '306581000003|广发银行股份有限公司', '307584007998|平安银行', '308584000013|招商银行', '309391000011|兴业银行总行', '310290000013|上海浦东发展银行', '313100000013|北京银行', '313110000017|天津银行', '313121006888|河北银行股份有限公司', '313127000013|邯郸银行股份有限公司', '313131000016|邢台银行股份有限公司', '313138000019|张家口银行股份有限公司', '313141052422|承德银行股份有限公司', '313143005157|沧州银行股份有限公司', '313146000019|廊坊银行', '313148053964|衡水银行股份有限公司', '313161000017|晋商银行股份有限公司', '313168000003|晋城银行', '313175000011|晋中银行', '313191000011|内蒙古银行股份有限公司', '313192000013|包商银行股份有限公司', '313193057846|乌海银行股份有限公司', '313205057830|鄂尔多斯银行股份有限公司', '313221030008|盛京银行清算中心', '313222080002|大连银行股份有限公司(不对外办理业务）', '313223007007|鞍山银行股份有限公司', '313227000012|锦州银行（不对外办理业务）', '313227600018|葫芦岛银行股份有限公司', '313228000276|营口银行股份有限公司资金清算中心', '313229000008|阜新银行结算中心', '313241066661|吉林银行', '313261000018|哈尔滨银行股份有限公司结算中心', '313261099913|龙江银行股份有限公司', '313301008887|南京银行股份有限公司', '313301099999|江苏银行股份有限公司', '313305066661|苏州银行股份有限公司', '313312300018|江苏长江商业银行', '313331000014|杭州银行股份有限公司', '313332082914|宁波银行股份有限公司', '313332090019|宁波通商银行股份有限公司', '313333007331|温州银行股份有限公司营业部', '313335081005|嘉兴银行股份有限公司清算中心', '313336071575|湖州银行股份有限公司清算中心', '313337009004|绍兴银行股份有限公司营业部', '313338009688|金华银行股份有限公司', '313338707013|浙江稠州商业银行', '313345001665|台州银行股份有限公司', '313345010019|浙江泰隆商业银行清算中心', '313345400010|浙江民泰商业银行股份有限公司', '313391080007|福建海峡银行股份有限公司', '313393080005|厦门银行股份有限公司', '313397075189|泉州银行股份有限公司', '313421087506|江西银行股份有限公司', '313424076706|九江银行股份有限公司', '313428076517|赣州银行股份有限公司', '313433076801|上饶银行清算中心', '313451000019|齐鲁银行', '313452060150|青岛银行', '313453001017|齐商银行', '313454000016|枣庄银行股份有限公司', '313455000018|东营银行股份有限公司', '313456000108|烟台银行股份有限公司', '313458000013|潍坊银行', '313461000012|济宁银行股份有限公司', '313463000993|泰安银行股份有限公司', '313463400019|莱商银行', '313465000010|威海市商业银行', '313468000015|德州银行股份有限公司', '313473070018|临商银行股份有限公司', '313473200011|日照银行股份有限公司', '313491000232|郑州银行', '313491099996|中原银行股份有限公司', '313493080539|洛阳银行', '313495081900|平顶山银行股份有限公司', '313501080608|焦作中旅银行股份有限公司', '313521000011|汉口银行资金清算中心', '313521006000|湖北银行股份有限公司', '313551070008|华融湘江银行股份有限公司', '313551088886|长沙银行股份有限公司', '313581003284|广州银行股份有限公司清算中心', '313585000990|珠海华润银行股份有限公司清算中心', '313586000006|广东华兴银行股份有限公司', '313591001001|广东南粤银行股份有限公司', '313602088017|东莞银行股份有限公司', '313611001018|广西北部湾银行股份有限公司', '313614000012|柳州银行股份有限公司清算中心', '313617000018|桂林银行股份有限公司', '313651099999|成都银行', '313653000013|重庆银行', '313655091983|自贡市商业银行清算中心', '313656000019|攀枝花市商业银行', '313658000014|长城华西银行股份有限公司', '313659000016|绵阳市商业银行', '313673093259|南充市商业银行股份有限公司', '313701098010|贵阳银行股份有限公司', '313731010015|富滇银行股份有限公司运营管理部', '313736000019|曲靖市商业银行', '313741095715|云南红塔银行股份有限公司', '313791000015|西安银行股份有限公司', '313791030003|长安银行股份有限公司', '313821001016|兰州银行股份有限公司', '313851000018|青海银行股份有限公司', '313871000007|宁夏银行总行清算中心', '313881000002|乌鲁木齐银行清算中心', '313882000012|昆仑银行股份有限公司', '314110000011|天津滨海农村商业银行股份有限公司', '314302066666|无锡农村商业银行股份有限公司', '314302200018|江苏江阴农村商业银行股份有限公司', '314305106644|太仓农村商业银行', '314305206650|昆山农村商业银行', '314305400015|吴江农村商业银行清算中心', '314305506621|江苏常熟农村商业银行股份有限公司清算中心', '314305670002|张家港农村商业银行', '314581000011|广州农村商业银行股份有限公司', '314588000016|广东顺德农村商业银行股份有限公司', '314641000014|海口联合农村商业银行股份有限公司', '314651000000|成都农商银行', '314653000011|重庆农村商业银行股份有限公司(不对外办理业务)', '315456000105|恒丰银行', '316331000018|浙商银行', '317110010019|天津农村商业银行股份有限公司', '318110000014|渤海银行股份有限公司', '319361000013|徽商银行股份有限公司', '320100010011|北京顺义银座村镇银行股份有限公司', '320343800019|浙江景宁银座村镇银行股份有限公司', '320345790018|浙江三门银座村镇银行股份有限公司', '320428090311|江西赣州银座村镇银行股份有限公司', '320455000019|东营莱商村镇银行股份有限公司', '320584002002|深圳福田银座村镇银行股份有限公司', '320653000104|重庆渝北银座村镇银行股份有限公司', '320687000016|重庆黔江银座村镇银行股份有限公司', '321667090019|重庆三峡银行股份有限公司', '322290000011|上海农商银行', '323584000888|深圳前海微众银行股份有限公司', '325290000012|上海银行', '402100000018|北京农村商业银行股份有限公司', '402241000015|吉林省农村信用社联合社（不办理转汇业务）', '402301099998|江苏省农村信用社联合社(不对外)', '402331000007|浙江省农村信用社联合社', '402332010004|宁波鄞州农村商业银行股份有限公司(鄞州银行)', '402361018886|安徽省农村信用社联合社资金清算中心（不转汇）', '402391000068|福建省农村信用社联合社（不办转汇业务）', '402451000010|山东省农村信用社联合社', '402521090019|武汉农村商业银行股份有限公司', '402581090008|广东省农村信用社联合社', '402584009991|深圳农村商业银行股份有限公司', '402602000018|东莞农村商业银行股份有限公司', '402611099974|广西壮族自治区农村信用社联合社', '402641000014|海南省农村信用社联合社资金清算中心', '402651020006|四川省农村信用社联合社', '402701002999|贵州省农村信用社联合社', '402731057238|云南省农村信用社联合社', '402791000010|陕西省农村信用社联合社资金清算中心', '402871099996|宁夏黄河农村商业银行股份有限公司', '403100000004|中国邮政储蓄银行总行', '502290000006|东亚银行（中国）有限公司', '593100000020|友利银行(中国)有限公司', '595100000007|新韩银行(中国)有限公司', '596110000013|企业银行（中国）有限公司', '597100000014|韩亚银行(中国)有限公司', '781393010011|厦门国际银行股份有限公司', '787290000019|富邦华一银行有限公司', '402221010013|辽宁省农村信用社联合社运营管理部', '402452000011|青岛农村商业银行', '314585070516|珠海农村商业银行股份有限公司', '402221010030|辽宁省农村信用社联合社资金营运中心', '402551080008|湖南省农村信用社联合社', '402121000009|河北省农村信用社联合社(不办理转汇）', '402161002352|山西省农村信用社联合社(不对外办理业务)', '402491000026|河南省农村信用社联合社资金清算中心(不转汇)', '402821000015|甘肃省农村合作金融结算服务中心', '402851000016|青海省农村信用社资金清算中心', '402261000004|黑龙江省农村信用社清算中心(不对外办理业务)', '313701099012|贵州银行股份有限公司', '402521000032|湖北省农村信用社联合社结算中心(不对外办理业务)', '313126007051|秦皇岛银行股份有限公司总行营业部', '402175700339|山西太谷农村商业银行股份有限公司', '402421099990|江西省农村信用社联合社', '313881088887|新疆银行股份有限公司', '314249000011|延边农村商业银行股份有限公司营业部'],
  "8": ['102100099996|工商银行', '103100000026|农业银行', '104100000004|中国银行', '105100000017|建设银行', '301290000007|交通银行', '302100011000|中信银行', '303100000006|光大银行', '304100040000|华夏银行', '305100000013|民生银行', '306581000003|广发银行', '307584007998|平安银行', '308584000013|招商银行', '309391000011|兴业银行', '313100000013|北京银行', '313110000017|天津银行', '313121006888|河北银行', '313146000019|廊坊银行', '313161000017|晋商银行', '313221030008|盛京银行', '313222080002|大连银行', '313223007007|鞍山银行', '313224000015|抚顺银行', '313226009000|丹东银行', '313227000012|锦州银行', '313227600227|葫芦岛银行', '313228000276|营口银行', '313229000008|阜新银行', '313231000013|辽阳银行', '313241066661|吉林银行', '313261000018|哈尔滨银行', '313261099913|龙江银行', '313301008887|南京银行', '313301099999|江苏银行', '313305066661|苏州市商业银行', '313331000014|杭州银行', '313332082914|宁波银行', '313333007331|温州银行', '313335081005|嘉兴银行', '313337009004|绍兴银行', '313338009688|金华银行', '313345001665|台州银行', '313391080007|海峡银行', '313393080005|厦门银行', '313397000017|泉州银行', '313421087506|江西银行', '313424076706|九江银行', '313451000019|齐鲁银行', '313452060150|青岛银行', '313453001017|齐商银行', '313456000108|烟台银行', '313458000013|潍坊银行', '313473070018|临商银行', '313473200011|日照银行', '313491000232|郑州银行', '313493080539|洛阳银行', '313501080608|中旅银行', '313521000011|汉口银行', '313551088886|长沙银行', '313581000013|广州银行', '313585000061|华润银行', '313602088017|东莞市商业银行', '313651099999|成都商业银行', '313653000013|重庆银行', '313701098010|贵阳银行', '313791000015|西安银行', '313821001016|兰州银行', '313126001022|秦皇岛银行', '313851000018|青海银行', '313871001000|宁夏银行', '313881000002|乌鲁木齐银行', '314227600016|葫芦岛市商业银行', '314302066666|无锡市商业银行', '314306047012|南通商业银行', '314311000018|盐城商行', '314314003006|镇江市商业银行', '315456000105|恒丰银行', '316331000018|浙商银行', '318110000014|渤海银行', '319361000013|徽商银行', '320428090311|赣州银行', '323110000008|金城银行', '323290000016|华瑞银行', '323333000013|民商银行', '323584000888|微众银行', '325290000012|上海银行', '403100000004|邮政储蓄银行', '502290000006|东亚银行', '513584000007|大新银行', '531290088881|花旗银行', '593100000020|友利银行', '595100000007|新韩银行', '596110000013|企业银行', '597100000014|韩亚银行', '717110000010|中德住房储蓄银行', '785584000025|华商银行', '787290000019|富邦华一银行', '989584000304|渣打银行', '989584000407|汇丰银行', '989584001602|星展银行', '989584002409|恒生银行', '989584003508|华侨永亨银行', '989584004308|南洋商业银行', '989584007103|大华银行', '323596001013|客商银行', '402100000018|北京农村商业银行', '402821000015|甘肃省农村合作金融结算服务中心', '402851000016|青海省农村信用社资金清算中心', '402261000004|黑龙江省农村信用社清算中心(不对外办理业务)', '402361018886|安徽省农村信用社联合社', '402391000068|福建省农村信用社联合社', '402581090008|广东省农村信用社联合社', '402701002999|贵州省农村信用社联合社', '402641000014|海南省农村信用社联合社', '402121000009|河北省农村信用社联合社', '402491000026|河南省农村信用社联合社', '402521000032|湖北省农村信用社联合社', '402551080008|湖南省农村信用社联合社', '402241000015|吉林省农村信用社联合社', '402301099998|江苏省农村信用社联合社', '402421099990|江西省农村信用社联合社', '402221010030|辽宁省农村信用社联合社', '402451000010|山东省农村信用社联合社', '402161002352|山西省农村信用社联合社', '402791000010|陕西省农村信用社联合社', '402651020006|四川省农村信用社联合社', '402731057238|云南省农村信用社联合社', '402331000007|浙江省农村信用社联合社', '317110010019|天津农村商业银行', '402881061690|新疆维吾尔自治区农村信用社联合社', '322290000011|上海农商银行', '313521006018|湖北银行股份有限公司', '310290000013|浦东发展银行', '402611099974 |广西壮族自治区农村信用社联合社', '313611001018|广西北部湾银行', '313614000012|柳州银行', '313617000018|桂林银行', '323391060018|福建华通银行股份有限公司', '323241000016|吉林亿联银行股份有限公司', '313821050016|甘肃银行', '313656000019|攀枝花市商业银行'],
  "9": ["中国银行", "中国工商银行", "中国建设银行", "招商银行", "中国农业银行", "上海浦东发展银行", "其它银行", "中国农业发展银行", "中国交通银行", "中信实业银行", "中国光大银行", "华夏银行", "中国民生银行", "广东发展银行", "平安银行", "中国邮政储蓄银行", "兴业银行", "城市商业银行", "北京银行", "杭州银行", "村镇银行", "哈尔滨银行", "广州银行", "农村商业银行", "农村信用联社", "恒丰银行", "浙商银行", "农村合作银行", "渤海银行", "徽商银行", "重庆三峡银行", "上海农村商业银行", "城市信用社", "深圳农村商业银行", "华商银行", "华一银行","长沙银行"],
  "11": ['302100011000|中信银行', '403100000004|中国邮政储蓄银行', '104100000004|中国银行', '103100000018|中国农业银行', '305100000013|中国民生银行', '105100000017|中国建设银行', '303100000006|中国光大银行', '102100099996|中国工商银行', '308584000013|招商银行', '309391000011|兴业银行', '310290000013|上海浦东发展银行', '307584007998|平安银行', '301290000007|交通银行', '304100040000|华夏银行', '306581000003|广发银行', '203100000019|中国农业发展银行', '313100000013|北京银行', '313331000014|杭州银行', '313331000018|哈尔滨银行', '313581000013|广州银行', '315456000105|恒丰银行', '316331000018|浙商银行', '318110000014|渤海银行', '319361000013|徽商银行', '321667090019|重庆三峡银行', '314667700011|重庆农村商业银行股份有限公司', '322290000011|上海农村商业银行', '402584009991|深圳农村商业银行', '785584000009|华商银行', '787290000019|富邦华一银行有限公司', '313301008887|南京银行', '313491000232|郑州银行', '313551088886|长沙银行', '313651099999|成都银行', '313701098010|贵阳银行', '313791000015|西安银行', '313821001016|兰州银行', '313881000002|乌鲁木齐商业银行', '402851020017|西宁农商银行', '402521090019|武汉农商', '402361010011|合肥科技农村商业银行股份有限公司', '314221000018|沈阳农村商业银行股份有限公司', '314241088889|长春农村商业银行股份有限公司', '314391011040|福建福州农村商业银行股份有限公司', '313421087506|江西银行股份有限公司', '402451001004|济南农村商业银行股份有限公司', '314641003004|海口农村商业银行股份有限公司', '314651000000|成都农商银行', '402888000011|新疆库尔勒农村商业银行股份有限公司', '402431400016|江西高安农村商业银行股份有限公司', '402173200016|文水县农村信用合作联社', '402100000018|北京农村商业银行', '313611001018|广西北部湾银行股份有限公司', '313888000013|库尔勒银行股份有限公司', '402145300018|海兴县农村信用联社股份有限公司']
}
module.exports = bank