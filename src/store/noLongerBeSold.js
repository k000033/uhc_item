import { apiUseDefineAxios } from "../api/index";
import { apiGetNowTime } from "../componentAPI/index";
export default {
  namespaced: true,
  state: {
    openDialog:false
  },
  actions: {
    noSoldAction({ commit }, params) {
      return apiUseDefineAxios(params).then((res) => {
        console.log("------------------------------------------------");
        console.log("-- btnGroupAction() start ::: " + apiGetNowTime());
        console.log("-- Table length ::: " + res.data.data.length);
        console.log("-- data error ::: " + res.data.msg);
        console.log("-- btnGroupAction() end ::: " + apiGetNowTime());
        console.log("------------------------------------------------");
        return res.data;
      });
    },
    setOpenDialogAction({commit},boolean){
      commit('setOpenDialog',boolean);
    }
  },
  mutations: {
    setOpenDialog(state,boolean){
        state.openDialog = boolean;
    }
  },
  getters: {
    getOpenDialog(state){
        return state.openDialog;
    }
  },
};
