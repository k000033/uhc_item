<script>
import { computed, defineAsyncComponent, ref } from "vue-demi";
import { useStore } from "vuex";
import { ElMessageBox } from "element-plus";
import { apiUseUhcItemParams } from "../api/index";
import { apiUseAgGridHandel } from "../componentAPI/index";
// import DetailDialog from "./DialogContent/VerifyDetail.vue"
// import ItemCheck from "./DialogContent/ItemCheck.vue"
// import ItemData from "./DialogContent/ItemData.vue"
// import ApplyDifference from "./DialogContent/ApplyDifference.vue"
export default {
  components: {
    VerifyDetail: defineAsyncComponent(() =>
      import("./DialogContent/VerifyDetail.vue")
    ),
    ItemCheck: defineAsyncComponent(() =>
      import("./DialogContent/ItemCheck.vue")
    ),
    ItemData: defineAsyncComponent(() =>
      import("./DialogContent/ItemData.vue")
    ),
    ApplyDifference: defineAsyncComponent(() =>
      import("./DialogContent/ApplyDifference.vue")
    ),
    GroupSetting: defineAsyncComponent(() =>
      import("./DialogContent/GroupSetting.vue")
    ),
    ElMessageBox,
    // BaseInfo: defineAsyncComponent(() => import("../views/Main/BaseInfo.vue")),
  },
  setup() {
    const isSaveDialog = ref(false);
    const { fetchAgGridData, itemCheckAction, getGroupData,getDetail } =
      apiUseAgGridHandel();
    const ucItemParams = new apiUseUhcItemParams();
    const store = useStore();
    // 取得/設定 是否開啟Dialog
    const getIsOpen = computed({
      get() {
        return store.getters["detailDialog/getIsOpen"];
      },
      set(val) {
        store.commit("detailDialog/setIsOpen", val);
      },
    });

    // 預設目前Dialog裡 Tab的內容
    const currentTab = ref("VerifyDetail");
    // 點擊 Dialog裡的 其他的 Tab
    const handleClick = (tab) => {
      const doc_id  = getAgGridData.value.DOC_ID;
      const gid = getAgGridData.value.GID

      if (tab.index == "0") { // 取得品項的明細資料
        getDetail(doc_id);
      } else if (tab.index == "3") { //單品檢核
        itemCheckAction(doc_id);
      } else if (tab.index == "4") { //取得 群組資料
        getGroupData(gid);
      };

      // let edited = document.getElementsByClassName("editIng").length;
      // if (edited > 0) {
      //    isSaveDialog.value=true;
      //    currentTab.value= currentTab.value
      // }else{
      // }
    };
    // 取得背後AgGrid的資料
    const getAgGridData = computed(() => {
      return store.getters["detailDialog/getAgGridData"];
    });

    //取得載入的狀態
    const loading = computed(() => {
      return store.getters["detailDialog/getDialogIsLoading"];
    });

    /**
     *判斷須不需要重新撈首頁 AgGrid的資料
     */
    const isReLoadGrid = computed(() => {
      return store.getters["getReLoad"];
    });

    /**
     * 關閉編輯Dialog
     */
    const dialogClose = () => {
      currentTab.value = "VerifyDetail";
      if (isReLoadGrid.value) {
        fetchAgGridData();
        store.commit("setAgGridIsReLoad", false);
      }
    };

    const svg = `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `;

    /**
     * 關閉 編輯Dialog時，如果有編輯的話，詢問是否放棄編輯
     */
    const handleClose = () => {
      let edited = document.getElementsByClassName("editIng").length;
      console.log(edited);
      if (edited > 0) {
        ElMessageBox.confirm("要放棄修改嗎?")
          .then(() => {
            getIsOpen.value = false;
          })
          .catch(() => {
            // catch error
          });
      } else {
        getIsOpen.value = false;
      }
    };

    var nextTabStr = "";
    /**
     * 頁籤籤換後，如果有修改欄位的話，詢問是否放棄編輯
     */
    const DialogBeforeLeave = (nextTab, prevTab) => {
      let edited = document.getElementsByClassName("editIng").length;
      if (edited > 0) {
        isSaveDialog.value = true;
        nextTabStr = nextTab;
        return false;
      }
    };

    /**
     * 放棄修改，移除 .editIng
     */
    const btnWran = (boolen) => {
      if (boolen) {
        // document.getElementsByClassName("editIng")
        const boxes = document.querySelectorAll(".editIng");
        boxes.forEach((box) => {
          box.classList.remove("editIng");
        });

        currentTab.value = nextTabStr;
      }
      isSaveDialog.value = false;
    };

    return {
      DialogBeforeLeave,
      getIsOpen,
      currentTab,
      handleClick,
      getAgGridData,
      svg,
      loading,
      dialogClose,
      handleClose,
      isSaveDialog,
      btnWran,
    };
  },
};
</script>

<template>
  <div class="dDialog">
    <el-dialog
      :destroy-on-close="true"
      v-model="getIsOpen"
      :title="getAgGridData.ITEM_NAME"
      width="75%"
      top="5vh"
      :lock-scroll="true"
      @close="dialogClose"
      :before-close="handleClose"
      destroy-on-close="true"
    >
      <div
        v-loading="loading"
        element-loading-text="Loading..."
        :element-loading-spinner="svg"
        element-loading-svg-view-box="-10, -10, 50, 50"
      >
        <div class="dDialog_Tab">
          <el-tabs
            v-model="currentTab"
            @tab-click="handleClick"
            type="card"
            :before-leave="DialogBeforeLeave"
          >
            <el-tab-pane label="審核明細" name="VerifyDetail"></el-tab-pane>
            <el-tab-pane
              label="廠商與採購申請差異"
              name="ApplyDifference"
            ></el-tab-pane>
            <el-tab-pane label="主檔基本資料" name="ItemData"></el-tab-pane>
            <el-tab-pane label="單品檢核" name="ItemCheck"></el-tab-pane>
            <el-tab-pane label="群組設定" name="GroupSetting"></el-tab-pane>
          </el-tabs>
        </div>
        <div class="dContent">
          <component :is="currentTab"></component>
        </div>
      </div>
    </el-dialog>
  </div>
  <div class="dwarningDialog">
    <el-dialog v-model="isSaveDialog" title="" width="20%" top="40vh">
      <div class="dWarring">要放棄修改嗎?</div>
      <div class="dWarnBtn">
        <el-button @click="btnWran(false)">取消</el-button>
        <el-button type="primary" @click="btnWran(true)">確定</el-button>
      </div>
    </el-dialog>
  </div>
  <!-- <el-drawer
    :lock-scroll="false"
    v-model="getIsOpen"
    :title="getAgGridData.ITEM_NAME"
    direction="ltr"
    size="100%"
    :draggable="true"
  >
      <component :is="currentTab"></component>
    <div class="dTab">
      <el-tabs v-model="currentTab" @tab-click="handleClick" type="card">
        <el-tab-pane label="審核明細" name="VerifyDetail"></el-tab-pane>
        <el-tab-pane
          label="廠商與採購申請差異"
          name="ApplyDifference"
        ></el-tab-pane>
        <el-tab-pane label="主檔基本資料" name="ItemData"></el-tab-pane>
        <el-tab-pane label="單品檢核" name="ItemCheck"></el-tab-pane>
      </el-tabs>
    </div>
  </el-drawer> -->
</template>

<style scoped lang="scss">
.dDialog_Tab {
  position: absolute;
  bottom: 0;
  background: #fff;
  width: 100%;
  z-index: 100;
}

.dContent {
  height: 90vh;
  min-height: 650px !important;
}

.dwarningDialog {
  .dWarring {
    padding: 10px 15px;
  }
  .dWarnBtn {
    padding-top: 5px;
    padding-right: 15px !important;
    padding-bottom: 10px;
    text-align: right;
  }
}
</style>
