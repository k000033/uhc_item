import {
  createStore
} from 'vuex'
import {
  apiUseDefineAxios
} from '../api/index'
import {
  apiGetNowTime
} from '../componentAPI/index'
import importExcel from './importExcel';
import detailDialog from './detailDialog';
import btnGroup from './btnGroup';
import addNewItem from './addNewItem';
import exportExcel from './exportExcel.js';
import noLongerBeSold from './noLongerBeSold';;
export default createStore({
  state: {
    PromoLoading: false,
    promoList: [],
    promSubList: [],
    currentPromo: '',
    currentPromoID: '',
    lineList: '',
    currentLineID: '',
    currentLineName: '',
    currentPromoIDX: 0,
    currentPage: 10,
    agGridType2Data: '',
    aqGridIsLoading: false,
    doc_id_Array: [],
    currDoc_id: '',
    Reload: false
  },
  actions: {
    fetchPromoList({
      commit, state
    }, params) {
      state.PromoLoading = true;
      apiUseDefineAxios(params).then((res) => {
        state.PromoLoading = false;
        console.log('------------------------------------------------');
        console.log('-- fetchPromoList() start ::: ' + apiGetNowTime());
        console.log(res.data);
        if (params.PROMO_ID == "?") {
          commit('setPromoList', res.data);
        } else {
          commit('setPromoSubList', res.data);
        };
        console.log('-- Table length ::: ' + res.data.data.length);
        console.log('-- data error ::: ' + res.data.msg);
        console.log('-- fetchPromoList() end ::: ' + apiGetNowTime());
        console.log('------------------------------------------------');
      }).catch((err) => {

      });
    },
    fetchLineID({
      commit
    }, params) {
      console.log('------------------------------------------------');
      console.log('-- fetchLineID() start ::: ' + apiGetNowTime());
      return apiUseDefineAxios(params).then((res) => {
        console.log(res.data);
        commit('setLineList', res.data);
        console.log('-- Table length ::: ' + res.data.data.length);
        console.log('-- data error ::: ' + res.data.msg);
        console.log('-- fetchLineID() end ::: ' + apiGetNowTime());
        console.log('------------------------------------------------');
        return res.data;
      }).catch((err) => {

      });
    },
    fetchAgGridTpe2({
      commit,
      state
    }, params) {
      state.aqGridIsLoading = true;
      params.PROMO_ID = state.currentPromoID
      params.PROMO_IDX = state.currentPromoIDX;
      params.LINE_ID = state.currentLineID;
      params.PAGE = state.currentPage;
      return apiUseDefineAxios(params).then((res) => {
        console.log('------------------------------------------------');
        console.log('-- fetchAgGridTpe2() start ::: ' + apiGetNowTime());
        commit('setAgGridType2Data', res.data);
        state.aqGridIsLoading = false;
        commit('set_doc_Id_Array', res.data);

        console.log('-- Table length ::: ' + res.data.data.length);
        console.log('-- data error ::: ' + res.data.msg);
        console.log('-- fetchAgGridTpe2() end ::: ' + apiGetNowTime());
        console.log('------------------------------------------------');
        return res.data;
      }).catch((error) => {

      })
    }
  },
  mutations: {
    setPromoList(state, data) {
      state.promoList = data;
    },
    setCurrentPromoID(state, id) {
      state.currentPromoID = id
    },
    setLineList(state, data) {
      state.lineList = data;
      if (data.data.length > 0) {
        state.currentLineID = data.data[0].ID;
      };

    },
    setCurrentLineID(state, id) {
      state.currentLineID = id;
    },
    setCurrentPromoIDX(state, idx) {
      state.currentPromoIDX = idx;
    },
    setCurrentPage(state, page) {
      state.currentPage = page;
    },
    setAgGridType2Data(state, data) {
      state.agGridType2Data = data;
    },
    setCurrentLineName(state, name) {
      state.currentLineName = name;
    },
    set_doc_Id_Array(state, data) {
      state.doc_id_Array = data.data.map(item => {
        // console.log(item.DOC_ID)
        return item.DOC_ID;
      })
    },
    setCurrDoc_id(state, id) {
      state.currDoc_id = id;
    },
    //AgGrid Loading 圖案是否顯式
    setAqGridIsLoading(state, bool) {
      state.aqGridIsLoading = bool;
    },
    // 在Dialog中，判斷明細資料有沒有修改，有修改時關閉Dialog，首頁的AgGrid會更新
    setAgGridIsReLoad(state, bool) {
      state.Reload = bool;
    },
    setPromoSubList(state,data){
      state.promSubList = data;
    }
  },
  getters: {
    getPromoLoading(state) {
      return state.PromoLoading;
    },
    getPromoList(state) {
      return state.promoList;
    },
    getCurrentPromoID(state) {
      return state.currentPromoID;
    },
    getLineList(state) {
      return state.lineList;
    },
    getCurrentLineID(state) {
      return state.currentLineID;
    },
    getCurrentPromoIDX(state) {
      return state.currentPromoIDX;
    },
    getCurrentPage(state) {
      return state.currentPage;
    },
    getAgGridType2Data(state) {
      return state.agGridType2Data;
    },
    getAqGridIsLoading(state) {
      return state.aqGridIsLoading;
    },
    getCurrentLineName(state) {
      return state.currentLineName;
    },
    get_doc_Id_Array(state) {
      return state.doc_id_Array;
    },
    getCurrDoc_id(state) {
      return state.DOC_ID;
    },
    getReLoad(state) {
      return state.Reload;
    },
    getPromoSubList(state){
      return state.promSubList;
    },
    getSubject(state){
      return state.getSubject;
    }
  },
  modules: {
    importExcel,
    detailDialog,
    btnGroup,
    addNewItem,
    exportExcel,
    noLongerBeSold
  }
})