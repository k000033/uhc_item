import {
    apiUseEmportExcelAxios
  } from '../api/index'
  import {
    apiGetNowTime
  } from '../componentAPI/index'
  export default {
    namespaced: true,
    state: {
      excelDatalist:[]
    },
    actions: {
      exportExcelAction({commit},params){
       return apiUseEmportExcelAxios(params).then((res)=>{
            console.log('------------------------------------------------');
            console.log('-- insertTempExcel() start ::: ' + apiGetNowTime());
            console.log('-- Table length ::: ' + res.data.data.length);
            commit('setExcelDataAry',res.data);
            console.log('-- data error ::: ' + res.data.msg);
            console.log('-- insertTempExcel() end ::: ' + apiGetNowTime());
            console.log('------------------------------------------------');
            return res.data
        })
      },

    },
    mutations: {
        setExcelDataAry(state,data){
            state.excelDatalist =data;
        }
    },
    getters: {
       getExcelDataAry(state){
          return state.excelDatalist;
       }
    },
  }