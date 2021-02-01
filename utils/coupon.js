// 适用规则
export const rules = (item) => {
  // 0代金券 1折扣券 2兑换券 5单品代金券 6会员卡 7单品折扣 8单品特价券 9全场满减券
  let leastCost = item.leastCost != 0 ? `消费满${item.leastCost}可用，` : ''
  switch (item.type) {
    case 0:
      return `价值${item.reduceCost}元代金券一张，${leastCost}适用于全场消费，不与单品优惠券叠加使用。`
      break
    case 1:
      return `凭此券消费享受${item.discount}折优惠，${leastCost}适用于全场消费，不与单品优惠券叠加使用。`
      break
    case 2:
      return `兑换${item.gift}使用`
      break
    case 5:
      return `价值${item.reduceCost}元代金券一张，适用于购买${item.goodItem.itemName}使用。`
      break
    case 7:
      return `凭此券消费打${item.discount}折，${leastCost}适用于购买${item.goodItem.itemName}使用。`
      break
    case 8:
      return `本券${leastCost}特价${item.specialPrice}元，购买${item.goodItem.itemName}使用。`
      break
    case 9:
      let leastCosts = item.leastCost != 0 ? `全场消费满${item.leastCost}元减${item.reduceCost}元，` : ''
      return `凭此消费券，${leastCosts}不可与其他优惠共享。`
      break
  }
}

export const couponDate = item =>{
  switch (item.dateType){
    case 1:
      return `${ item.beginTime } 至 ${ item.endTime }`
    break;
    case 0:
      return `不限日期`
      break;
    case 2:
      return `领取后${coupon.fixedTerm}天有效`
      break;
  }
}