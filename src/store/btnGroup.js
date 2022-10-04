  import {
    ApiUseImportExcelAxios,
    apiUseB2bEcItemAxios,
    apiUseDefineAxios
  } from '../api/index'
  import {
    apiGetNowTime
  } from '../componentAPI/index'
  export default {
    namespaced: true,
    state: {
      btnGroupRes: [],
      btnGroupMsg: [],
      OpenCreateGroup: false,
      groupList:[],
    },
    actions: {
      btnGroupAction({
        commit
      }, params) {
        return apiUseDefineAxios(params).then((res) => {
          console.log('------------------------------------------------');
          console.log('-- btnGroupAction() start ::: ' + apiGetNowTime());
          commit('setBtnGroupRes', res.data);
          console.log('-- Table length ::: ' + res.data.data.length);
          console.log('-- data error ::: ' + res.data.msg);
          console.log('-- btnGroupAction() end ::: ' + apiGetNowTime());
          console.log('------------------------------------------------');
          return res.data;
        })
      },
      btnCRUDGroup({
        commit
      }, params) {
        return apiUseDefineAxios(params).then((res) => {
          console.log('------------------------------------------------');
          console.log('-- btnCRUDGroup() start ::: ' + apiGetNowTime());
          if (params.DOC_ID != '') {
            commit('setBtnGroupMsg', res.data);
          } else {
            commit('setGroupList', res.data);
          };
          console.log('-- Table length ::: ' + res.data.data.length);
          console.log('-- data error ::: ' + res.data.msg);
          console.log('-- btnCRUDGroup() end ::: ' + apiGetNowTime());
          console.log('------------------------------------------------');
          return res.data
        });
      }
    },
    mutations: {
      setBtnGroupRes(state, data) {
        state.btnGroupRes = data;
      },
      setBtnGroupMsg(state, data) {
        state.btnCreateGroup = data;
      },
      setOpenCreateGroup(state, boolean) {
        state.OpenCreateGroup = boolean
      },
      setGroupList(state,data){
        state.groupList = data;
      }
    },
    getters: {
      getBtnGroupRes(state) {
        return state.getBtnGroupRes;
      },
      getOpenCreateGroup(state) {
        return state.OpenCreateGroup;
      },
      getGroupList(state){
        return state.groupList;
      }
    },
  }