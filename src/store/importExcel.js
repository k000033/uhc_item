import {
  ApiUseImportExcelAxios,
  apiUseB2bEcItemAxios,
  apiUseExcelMultiplePageAxios
} from '../api/index'
import {
  apiGetNowTime
} from '../componentAPI/index'
export default {
  namespaced: true,
  state: {

  },
  actions: {
    importExcel({
      commit
    }, params) {
      ApiUseImportExcelAxios(params).then((res) => {
        console.log('------------------------------------------------');
        console.log('-- importExcel() start ::: ' + apiGetNowTime());
        console.log(res);
        console.log('-- Table length ::: ' + res.data.data.length);
        console.log('-- data error ::: ' + res.data.msg);
        console.log('-- importExcel() end ::: ' + apiGetNowTime());
        console.log('------------------------------------------------');
      }).catch((error) => {

      })
    },
    b2bEcItemAction({
      commit
    }, params) {
      return apiUseB2bEcItemAxios(params).then((res) => {
        console.log('------------------------------------------------');
        console.log('-- b2bEcItemAction() start ::: ' + apiGetNowTime());
        console.log('-- Table length ::: ' + res.data.data.length);
        console.log('-- data error ::: ' + res.data.msg);
        console.log('-- b2bEcItemAction() end ::: ' + apiGetNowTime());
        console.log('------------------------------------------------');
        return res.data;
      })
    },
    importExcelMultiplePage({commit},params){
      return apiUseExcelMultiplePageAxios(params).then((res)=>{
        console.log('------------------------------------------------');
        console.log('-- importExcelMultiplePage() start ::: ' + apiGetNowTime());
        console.log(res);
        console.log('-- Table length ::: ' + res.data.data.length);
        console.log('-- data error ::: ' + res.data.msg);
        console.log('-- importExcelMultiplePage() end ::: ' + apiGetNowTime());
        console.log('------------------------------------------------');
      })
    }
  },
  mutations: {

  },
  getters: {

  },
}