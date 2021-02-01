import * as types from './mutation-types';

export const getCartList = function({commit},data){
    console.log(data)
	commit("getGoodsMutations",data)
}