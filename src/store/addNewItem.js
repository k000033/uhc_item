import {
  apiUseAddItemAxios
} from '../api/index'
import {
  apiGetNowTime
} from '../componentAPI/index'
export default {
  namespaced: true,
  state: {
    isOpen: false,
    addItemAsioxData: [],
    tabType: 0,
    isLoading: false,
  },
  actions: {
    fetchAddItemAxiosData({ commit, state }, params) {
      state.isLoading = true

      //DOC_ID 等於 "" 時，代表查詢AgGrid資料
      //DOC_ID 有值，代表新增
      return apiUseAddItemAxios(params).then((res) => {
         state.isLoading = false
        console.log('------------------------------------------------');
        console.log('-- fetchAddItemAxiosData() start ::: ' + apiGetNowTime());
        console.log('-- Table length ::: ' + res.data.data.length);
        console.log('-- data error ::: ' + res.data.msg);
        console.log('-- fetchAddItemAxiosData() end ::: ' + apiGetNowTime());
        console.log('------------------------------------------------');
        if (params.DOC_ID == "") {
          commit('setAddItemAxiosData', res.data);
        } else {       
          return res.data
        };
      });
    }
  },
  mutations: {
    setIsOpen(state, boolean) {
      state.isOpen = boolean;
    },
    setAddItemAxiosData(state, data) {
      state.addItemAsioxData = data;
    },
    setTabType(state, type) {
      state.tabType = type;
    }
  },
  getters: {
    getIsOpen(state) {
      return state.isOpen;
    },
    getAddItemAxiosData(state) {
      return state.addItemAsioxData;
    },
    getTabType(state) {
      return state.tabType;
    },
    getIsLoading(state) {
      return state.isLoading;
    }
  },
}