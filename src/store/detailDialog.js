import {
    apiUseDefineAxios
} from '../api/index'
import {
    apiGetNowTime
} from '../componentAPI/index'
export default {
    namespaced: true,
    state: {
        isOpen: false,
        agGridData: {},
        detailPage: 1,
        detailData: {},
        currSale_B_Date: '',
        resSaveData: [], //儲存後回傳的訊息
        //下拉選單
        saleAttributeArray: [],//銷售店群
        takeAttributeArray: [],//提貨店群
        activityNameArray: [], //銷售活動別
        takeTypeArray: [], //提貨別
        promoTextArray:[], //促銷話術
        TID:[], //活動主題
        priceTypeArray: [{ //秤重/定額
            CODE: 0,
            CAPTION: '秤重'
        }, {
            CODE: 1,
            CAPTION: "定額"
        }],
        dialogIsLoading:false, //讀取狀態
        itemCheckData:[] // Dialog 單品檢核 頁籤
    },
    actions: {
        //下拉選單
        fetchDropDownData({
            commit
        }, params) {
            console.log('------------------------------------------------');
            console.log('-- fetchDropDownData() start ::: ' + apiGetNowTime());
            apiUseDefineAxios(params).then((res) => {
                switch (params.CODE_TYPE) {
                    case 0:
                        commit('setActivityNameArray', res.data);
                        break;
                    case 4:
                        commit('setSaleAttributeArray', res.data);
                        break;
                    case 3:
                        commit('setTakeAttributeArray', res.data);
                        break;
                    case 2:
                        commit('setTakeTypeArray', res.data);
                        break;
                    case 5:
                        commit('setPromoTextArray',res.data);
                        break;
                    case 6:
                        commit('setTID',res.data);
                    default: {
                        break;
                    }
                }
                console.log('-- Table length ::: ' + res.data.data.length);
                console.log('-- data error ::: ' + res.data.msg);
                console.log('-- fetchDropDownData() end ::: ' + apiGetNowTime());
                console.log('------------------------------------------------');
            });
        },
        fetchDetailData({
            commit,
            state
        }, params) {
            // params.DETAIL_PAGE = state.detailPage;
            state.dialogIsLoading =true;
            console.log('fetchDetail'+state.dialogIsLoading)
            console.log('------------------------------------------------');
            apiUseDefineAxios(params).then((res) => {
                state.dialogIsLoading =false;
                console.log('-- fetchDetailData() start ::: ' + apiGetNowTime());
                 commit('setDetailData', res.data);
                console.log('-- Table length ::: ' + res.data.data.length);
                console.log('-- data error ::: ' + res.data.msg);
                console.log('-- fetchDetailData() end ::: ' + apiGetNowTime());
                console.log('------------------------------------------------');
            });
        },
        saveDetailData({
            commit
        }, params) {
            console.log('------------------------------------------------');
            console.log('-- saveDetailData() start ::: ' + apiGetNowTime());
          return apiUseDefineAxios(params).then((res) => {
                commit('setResSaveData', res.data);
                console.log('-- Table length ::: ' + res.data.data.length);
                console.log('-- data error ::: ' + res.data.msg);
                console.log('-- saveDetailData() end ::: ' + apiGetNowTime());
                console.log('------------------------------------------------');
                return res.data;
            })
        },
        fetchItemCheckData({commit},params){
            console.log('------------------------------------------------');
            console.log('-- saveDetailData() start ::: ' + apiGetNowTime());
            return apiUseDefineAxios(params).then((res) => {
                commit('setItemCheckData', res.data);
                console.log('-- Table length ::: ' + res.data.data.length);
                console.log('-- data error ::: ' + res.data.msg);
                console.log('-- saveDetailData() end ::: ' + apiGetNowTime());
                console.log('------------------------------------------------');
                return res.data;
            }) 
        }
    },
    mutations: {
        setIsOpen(state, boolen) {
            state.isOpen = boolen;
        },
        setAgGridData(state, data) {
            state.agGridData = data;
        },
        setDetailData(state, data) {
            state.detailData = data;
        },
        //下拉選單
        setActivityNameArray(state, data) {
            state.activityNameArray = data;
        },
        setSaleAttributeArray(state, data) {
            state.saleAttributeArray = data;
        },
        setTakeAttributeArray(state, data) {
            state.takeAttributeArray = data;
        },
        setTakeTypeArray(state, data) {
            state.takeTypeArray = data;
        },
        setResSaveData(state, data) {
            state.resSaveData = data;
        },
        setItemCheckData(state,data){
            state.itemCheckData = data;
        },
        setPromoTextArray(state,data){
            state.promoTextArray = data;
        },
        setTID(state,data){
            state.TID = data;
        }
    },
    getters: {
        getIsOpen(state) {
            return state.isOpen;
        },
        getAgGridData(state) {
            return state.agGridData;
        },
        getDetailData(state) {
            return state.detailData;
        },
        //下拉選單
        getActivityNameArray(state) {
            return state.activityNameArray;
        },
        getSaleAttributeArray(state) {
            return state.saleAttributeArray;
        },
        getTakeAttributeArray(state) {
            return state.takeAttributeArray;
        },
        getTakeTypeArray(state) {
            return state.takeTypeArray;
        },
        getPriceTypeArray(state) {
            return state.priceTypeArray;
        },
        getResSaveData(state) {
            return state.resSaveData;
        },
        getDialogIsLoading(state){
           return state.dialogIsLoading;
        },
        getItemCheckData(state){
           return state.itemCheckData;
        },
        getPromoTextArray(state){
            return state.promoTextArray;
        },
        getTID(state){
            return state.TID;
        }

    },
}