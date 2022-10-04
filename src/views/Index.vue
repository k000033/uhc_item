<script>
import { computed, onMounted, reactive, ref, watch } from "@vue/runtime-core";
import { useStore } from "vuex";
import { apiUseUhcItemParams } from "../api/index";
import AgGridType2 from "../components/AgGridType2.vue";
// import Apply_view from "./Page/Apply.vue";
// import Check_view from "./Page/Check.vue";
// import Ensure_view from "./Page/Ensure.vue";
// import Make_view from "./Page/Make.vue";
// import OnSelf_view from "./Page/OnSelf.vue";
import btnGroup from "../components/BtnGroup.vue";
import { apiUseAgGridHandel } from "../componentAPI/index";
export default {
  components: {
    // Apply_view,
    // Check_view,
    // Ensure_view,
    // Make_view,
    // OnSelf_view,
    btnGroup,
    AgGridType2,
  },
  setup() {
    const store = useStore();
    const params = new apiUseUhcItemParams();
    const { fetchAgGridData } = apiUseAgGridHandel();
    const promo_type = ref(0);
    const promo_id = ref("");
    const promoSub_id = ref("");
    // const currentPromoIDX = ref(0);
    let selectRow = reactive({});

    // 取得次要檔期下拉清單
    const getPromoSubList = computed(() => {
      const result = store.getters["getPromoSubList"];
      //defPromoID(result);

      //有取到檔期時
      // if (result.length != 0) {
      //   //尋找下拉選單預設選取項目
      //    let res = result.data.filter((x) => x.DEFAULT_TYPE != 0);
      //    if(promoSub_id.value!=res[0].ID)
      //    {
      //              promoSub_id.value = res.length == 0 ? "" : res[0].ID;
      //    };
 
      //   // 當有預設項目時，給予currentPromoID、currentPromoIDX值，並撈取AgGrid資料
      //   if (res.length != 0) {
      //     currentPromoID.value = res[0].ID;
      //     currentPromoIDX.value = res[0].IDX;
      //     fetchAgGridData();
      //   } else {
      //     window.gridApi.setRowData([]);
      //   }
      // }
      console.log(result);
      return result;
    });

    //有取到檔期時
    watch(()=>getPromoSubList.value,(value)=>{
       promoSub_id.value="";
       //有取到檔期時
       if (getPromoSubList.value.data.length != 0) {
        //尋找下拉選單預設選取項目
         let res = getPromoSubList.value.data.filter((x) => x.DEFAULT_TYPE != 0);
                   promoSub_id.value = res.length == 0 ? "" : res[0].NUM;
     
 
        // 當有預設項目時，給予currentPromoID、currentPromoIDX值，並撈取AgGrid資料
        if (res.length != 0) {
          currentPromoID.value = res[0].ID;
          currentPromoIDX.value = res[0].IDX;
          fetchAgGridData();
        } else {
          window.gridApi.setRowData([]);
        }
      }
    })


    //取得/設定 當前的promoIDX
    const currentPromoIDX = computed({
      get() {
        return store.getters["getCurrentPromoIDX"];
      },
      set(val) {
        store.commit("setCurrentPromoIDX", val);
      },
    });
    //取得/設定 當前的promoID
    const currentPromoID = computed({
      get() {
        return store.getters["getCurrentPromoID"];
      },
      set(val) {
        store.commit("setCurrentPromoID", val);
      },
    });
    // 當前promo名稱
    const currentPromoName = ref("");
    // 當前promo區間
    const currentPerido = ref("");
    // promo list Dialog 是否開啟
    const openDialog = ref(false);
    // 類別側邊攔，是否開啟
    const openDrawer = ref(false);

    //取得 promo list 資料
    const getPromoList = computed(() => {
      return store.getters["getPromoList"];
    });
    // 判斷 Promo資料 是否在 讀取中
    const getPromoLoading = computed(() => {
      return store.getters["getPromoLoading"];
    });

    //取得 類別 list 資料
    const getLineList = computed(() => {
      return store.getters["getLineList"];
    });

    // 取得/設定 當前類別的ID
    const currentLineID = computed({
      get() {
        return store.getters["getCurrentLineID"];
      },
      set(val) {
        store.commit("setCurrentLineID", val);
      },
    });
    // 取得/設定 當前的頁籤
    const currentPage = computed({
      get() {
        return store.getters["getCurrentPage"];
      },
      set(val) {
        store.commit("setCurrentPage", val);
      },
    });

    // const currentLineName = ref("");

    // 取得/設定 當前類別的名稱
    const currentLineName = computed({
      get() {
        return store.getters["getCurrentLineName"];
      },
      set(val) {
        store.commit("setCurrentLineName", val);
      },
    });

    //判斷 AgGrid 是否在Loading
    const loading = computed(() => {
      return store.getters["getAqGridIsLoading"];
    });

    onMounted(() => {
      openPromoDialog();
      fnGetLineList();
    });

    // 開啟 promo list Dialog，並打API取得promo list 資料
    const openPromoDialog = () => {
      params.initial();
      params.PROMO_ID = "?";
      params.PROMO_TYPE = promo_type.value;
      store.dispatch("fetchPromoList", { ...params });
      openDialog.value = true;
    };
    // 在 promo list Dialog中，切歡檔期和非檔期，並重撈資料
    function btnIdx_click(idx) {
      promo_type.value = idx;
      openPromoDialog();
    }

    // 在promo list 的Dialog中,點擊其他 promo 觸發事件
    function currentChange(e, s) {
      selectRow = e;
      console.log(e);
    }
    // 在promo list 的Dialog中，按下確定，更換當前promo
    function ensure_click() {
      // currentPromoID.value = selectRow.ID;
      promo_id.value = selectRow.ID;
      currentPromoName.value = selectRow.NAME;
      // currentPerido.value = selectRow.PERIOD;
      // currentPromoIDX.value = selectRow.IDX;
      // console.log(currentPromoIDX.value);
      // //關掉 Dialog
      params.initial();
      params.PROMO_ID = promo_id.value;
      store.dispatch("fetchPromoList", { ...params });

      openDialog.value = false;
      // fetchAgGridData();
    }

    //打API 取得 類別 list
    const fnGetLineList = () => {
      params.initial();
      params.LINE_ID = "?";
      store.dispatch("fetchLineID", params).then((res) => {
        if (res.data.length > 0) {
          // 預設第一個 類別
          currentLineName.value = res.data[0].ALIAS;
        }
      });
    };
    // 點擊 類別名稱，開起類別側邊攔
    const selectLine_click = () => {
      openDrawer.value = true;
    };
    // 點擊 promo名稱，開啟 promo list Dialog
    const selectPromo_click = () => {
      openDialog.value = true;
    };

    // 更換 類別
    const liLineItem_click = (item, event) => {
      currentLineName.value = item.ALIAS;
      currentLineID.value = item.ID;
      // console.log(item);
      openDrawer.value = false;

      //更換類別後，打API，取得當前類別資料
      // params.initial();
      // store.dispatch("fetchAgGridTpe2", params);
      fetchAgGridData();
    };

    // 預設第一個頁籤
    const currentTab = ref("Apply_view");
    // 更換頁籤
    const handleClick = (tab) => {
      currentPage.value = tab.instance.attrs["data-page"];
      currentTab.value = tab.props.name;
      console.log(currentPage.value);

      // params.initial();
      // store.dispatch("fetchAgGridTpe2", params);
      fetchAgGridData();
    };

    const btnCancel_click = () => {
      openDialog.value = false;
    };

    // 改變檔期下拉選單項目
    const promoSubChange = (val) => {
      promoSub_id.value = val;
      const res = getPromoSubList.value.data.filter((x) => x.NUM == val);
     
      currentPromoID.value = res[0].ID;
      currentPromoIDX.value = res[0].IDX;
      fetchAgGridData();
    };

    return {
      getPromoLoading,
      openDialog,
      getPromoList,
      promo_type,
      btnIdx_click,
      currentChange,
      currentPerido,
      currentPromoName,
      ensure_click,
      currentLineName,
      openDrawer,
      selectLine_click,
      selectPromo_click,
      getLineList,
      liLineItem_click,
      currentLineID,
      // uploadExcel,
      handleClick,
      currentTab,
      currentPage,
      btnCancel_click,
      loading,
      getPromoSubList,
      promoSub_id,
      promoSubChange,
    };
  },
};
</script>
<template>
  <div>
    <div class="Header">
      <div class="fs-22 dMark"><span>電商活動提品</span></div>
      <!-- <div dUploadExcel>
      <uploadExcel />
    </div> -->
      <div class="topic">
        <div class="fs-22 dTitleLink">
          <a
            class="PromoNameLink"
            href="javascript:;"
            @click="selectPromo_click"
            ><el-icon class="mgRight_5" :size="20"><edit /></el-icon
            >{{ currentPromoName }} {{ currentPerido }}</a
          >
        </div>
        <div class="dLine"><span> __ </span></div>
        <div class="fs-22 dTitleLink">
          <a class="PromoNameLink" href="javascript:;" @click="selectLine_click"
            ><el-icon class="mgRight_5" :size="20"><edit /></el-icon
            >{{ currentLineName }}</a
          >
        </div>
      </div>
    </div>

    <div class="dContent">
      <div class="dTab">
        <el-tabs v-model="currentTab" @tab-click="handleClick" type="card">
          <el-tab-pane
            label="申請"
            name="Apply_view"
            data-page="10"
            :disabled="loading"
          ></el-tab-pane>
          <el-tab-pane
            label="製作"
            name="Make_view"
            data-page="20"
            :disabled="loading"
          ></el-tab-pane>
          <el-tab-pane
            label="檢核"
            name="Check_view"
            data-page="30"
            :disabled="loading"
          ></el-tab-pane>
          <el-tab-pane
            label="確認"
            name="Ensure_view"
            data-page="40"
            :disabled="loading"
          ></el-tab-pane>
          <el-tab-pane
            label="上架"
            name="OnSelf_view"
            data-page="50"
            :disabled="loading"
          ></el-tab-pane>
        </el-tabs>
        <div class="dSltSub">
          <el-select
            v-model="promoSub_id"
            placeholder="請選擇檔期"
            size="small"
            @change="promoSubChange"
          >
            <el-option
              v-for="item in getPromoSubList.data"
              :key="item.NUM"
              :label="
                item.ID +
                '&nbsp&nbsp&nbsp&nbsp' +
                item.NAME +
                '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp' +
                item.PERIOD
              "
              :value="item.NUM"
            >
              <div class="sltSubOptionStyle">
                <span class="subId">{{ item.ID }}</span>
                <span class="subName">{{ item.NAME }}</span>
                <span class="subPeriod">{{ item.PERIOD }}</span>
              </div>
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="dTabContent" v-show="!currentPromoName == ''">
        <btnGroup />
      </div>
    </div>
    <div
      :class="['dGrid', { test: currentTab == 'Apply_view' }]"
      v-show="!currentPromoName == ''"
    >
      <AgGridType2 />
    </div>
    <div class="warning" v-show="currentPromoName == ''">請選擇檔期</div>

    <el-dialog
      v-model="openDialog"
      title="選擇檔期"
      :width="650"
      :lock-scroll="false"
      :close-on-click-modal="false"
      :draggable="true"
    >
      <el-scrollbar height="300px">
        <el-table
          :data="getPromoList.data"
          :highlight-current-row="true"
          :height="300"
          @current-change="currentChange"
        >
          <el-table-column property="ID" label="編號" width="100" />
          <el-table-column property="NAME" label="批次名稱" width="380" />
          <el-table-column property="PERIOD" label="期間" width="170" />
        </el-table>
      </el-scrollbar>
      <div class="dBtnGroup">
        <el-button @click="ensure_click">確認</el-button>
        <el-button @click="btnCancel_click">取消</el-button>
      </div>
    </el-dialog>

    <el-drawer v-model="openDrawer" title="選擇分類" size="12%">
      <el-scrollbar height="95%">
        <ul class="ulLineList">
          <li
            v-for="item in getLineList.data"
            :key="item.ID"
            :class="['liLineItem', { currentLine: item.ID == currentLineID }]"
            @click="liLineItem_click(item, $event)"
          >
            <a :class="['aLineItem']" href="javascript:;" :data-id="item.ID">{{
              item.ID + "." + item.ALIAS
            }}</a>
          </li>
        </ul>
      </el-scrollbar>
    </el-drawer>
  </div>
</template>

<style lang="scss" scoped>
.Header {
  display: flex;
  //   justify-content: space-between;
  white-space: nowrap;
  //   border-bottom: 1px solid #dcdfe6;
  height: 50px;
  padding: 8px;
  .dMark {
    // width: 30%;
  }

  .dUploadExcel {
  }

  a {
    text-decoration: none;
  }
  .topic {
    display: flex;
    margin-right: 50px;
    margin-left: auto;
    position: relative;
    .dTitleLink {
      display: flex;
      align-items: center;
    }
    .PromoNameLink {
      display: flex;
      align-items: center;
    }
  }

  .dLine {
    margin: 0 5px;
  }

  .mgRight_5 {
    margin-right: 5px;
    font-weight: bold;
  }
}

.dPromoBtn {
  padding-left: 7px;
  padding-top: 10px;
  padding-bottom: 10px;
  .active {
    background: #fff;
    color: #000;
  }
}

.dBtnGroup {
  padding: 10px 0;
  text-align: center;
}

.ulLineList {
  li {
    padding: 2px 20px;
    &.liLineItem:hover {
      background: #bdd4ef3d;
      cursor: pointer;
      .aLineItem {
        color: #237cd8;
      }
    }
    &.currentLine {
      background: #c1daf6;
    }

    .aLineItem {
      text-decoration: none;
      color: #606266;
      font-size: 12px;
    }
  }
}

.dContent {
  // padding: 8px;
  .dTab {
    display: flex;

    .dSltSub {
      width: 420px;
      margin-left: auto;
      margin-right: 60px;
      position: relative;

    }
  }
  .dTabContent {
    padding: 0 0px;
    // height: calc(100vh - 50px - 56px - 16px);
  }
}

.sltSubOptionStyle {
  display: flex;

  .subId {
    display: inline-block;
    width: 50px;
  }
  .subName {
    display: inline-block;
    width: 200px;
  }
  .subPeriod {
    display: inline-block;
    width: 50px;
  }
  span {
    margin-right: 10px;
  }
}

.dGrid {
  padding: 8px;
  height: calc(100vh - 50px - 56px - 16px - 5px);
  &.test {
    height: calc(100vh - 50px - 56px - 16px - 5px);
  }
}

.fs-22 {
  font-size: 22px;
}

.test {
  font-size: 14px;
}

.warning {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 93px);
  color: #bbb;
  font-size: 45px;
}
</style>
