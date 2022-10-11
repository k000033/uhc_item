<script>
import { useStore } from "vuex";
import { computed, ref } from "vue";
import { ElMessage } from "element-plus";
import { apiUseUhcItemParams } from "../../api/index";
import {apiUseAgGridHandel} from '../../componentAPI/index'
export default {
  components: {
    ElMessage,
  },
  setup() {
    const store = useStore();
    const ucItemParams = new apiUseUhcItemParams();
    const {fetchAgGridData,getGroupData,itemCheckAction,getDetail}  =apiUseAgGridHandel()
    const getAgGridDataList = computed(() => {
      return store.getters["getAgGridType2Data"];
    });
    const getAgGridData = computed(() => {
      return store.getters["detailDialog/getAgGridData"];
    });
    const get_doc_Id_Array = computed(() => {
      return store.getters["get_doc_Id_Array"];
    });
    const isSaveDialog = ref(false);
    const prevOrNext = ref("");
    /**
     * 回傳，目前AgGrid上面顯示的資料
     * 如果有，Filter，則回傳Filter，過後的資料
     * return array
     */
    const agGridDisplayDataDOC_ID = computed(() => {
      let rowDocIDArray = [];
      const rows =
        window.gridApi.rowModel.nodeManager.rootNode.childrenAfterSort;
      for (let item of rows) {
        rowDocIDArray.push(item.data.DOC_ID);
      }
      return rowDocIDArray;
    });

    // let agGridDisplayDataDOC_ID = [];
    //上一筆
    const btnPrevious = () => {
      //取得目前doc_id
      const doc_id = getAgGridData.value.DOC_ID;
      //判斷目前doc_id 在陣列中的位置
      var idx = agGridDisplayDataDOC_ID.value.indexOf(doc_id);
      //如果在第0，代表是第一筆資料
      if (idx == 0) {
        error("已經是第一筆資料");
        return;
      }
      openLeaveDialog("prev");
    };
    
    /**
     * 尋找上一筆AgGrid資料，並且撈上一筆Dialog資料
     */
    const getPrevItemDetail = () => {
      //取得目前doc_id
      const doc_id = getAgGridData.value.DOC_ID;
      //判斷目前doc_id 在陣列中的位置
      var idx = agGridDisplayDataDOC_ID.value.indexOf(doc_id);
      //取得上一筆 doc_id;
      const preDoc_id = agGridDisplayDataDOC_ID.value[idx - 1];
      //將上一筆 doc_id設成目前的doc_id
      store.commit("setCurrDoc_id", preDoc_id);

      //從AgGridx尋找上一筆的資料，儲存起來，並撈SP取得明細
      getAgGridDataList.value.data.forEach((item) => {
        if (item.DOC_ID == preDoc_id) {
          //將目前AgGridData資料設定 上一筆 AgGridData資料
          store.commit("detailDialog/setAgGridData", item);
                    getDetail(preDoc_id);
          itemCheckAction(preDoc_id);
          // ucItemParams.initial();
          // ucItemParams.DOC_ID = preDoc_id;
          // ucItemParams.DETAIL_PAGE = 1;
          // //撈上一筆資料明細
          // store.dispatch("detailDialog/fetchDetailData", ucItemParams);
        }
      });
    };

    // 下一筆
    const btnNext = () => {
      //取得目前doc_id
      const doc_id = getAgGridData.value.DOC_ID;
      //判斷目前doc_id 在陣列中的位置
      var idx = agGridDisplayDataDOC_ID.value.indexOf(doc_id);
      //如果在最後，代表是最後一筆資料
      if (idx == agGridDisplayDataDOC_ID.value.length - 1) {
        error("已經是最後一筆資料");
        return;
      }
      
      openLeaveDialog("next");
    };
    /**
     * 尋找下一筆AgGrid資料，並且撈下一筆Dialog資料
     */
    const getNextItemDetail = () => {
      //取得目前doc_id
      const doc_id = getAgGridData.value.DOC_ID;
      //判斷目前doc_id 在陣列中的位置
      var idx = agGridDisplayDataDOC_ID.value.indexOf(doc_id);
      //取得下一筆 doc_id;
      const nextDoc_id = agGridDisplayDataDOC_ID.value[idx + 1];
      //將下一筆 doc_id設成目前的doc_id
      store.commit("setCurrDoc_id", nextDoc_id);
       //從AgGridx尋找下一筆的資料，儲存起來，並撈SP取得明細
      getAgGridDataList.value.data.forEach((item) => {
        if (item.DOC_ID == nextDoc_id) {
          //將目前AgGridData資料設定 下一筆 AgGridData資料
          store.commit("detailDialog/setAgGridData", item);
          getDetail(nextDoc_id);
          itemCheckAction(nextDoc_id);
          // ucItemParams.initial();
          // ucItemParams.DOC_ID = nextDoc_id;
          // ucItemParams.DETAIL_PAGE = 1;
          // //撈下一筆資料明細
          // store.dispatch("detailDialog/fetchDetailData", ucItemParams);
        }
      });
    };

    /**
     * 判斷是否有編輯過的欄位，如果有，則開啟詢問是否要離開的的Dialog
     * 如果沒有，則執行 上一筆/下一筆的動作
     */
    const openLeaveDialog = (type) => {
      // 取得有編輯過的欄位數量
      let edited = document.getElementsByClassName("editIng").length;
      if (edited > 0) {
        //紀錄是案上一筆還是下一筆 prev 上一頁，next 下一頁
        prevOrNext.value = type;
        //開啟Dialog
        isSaveDialog.value = true;
        return false;
      } else {
        type == "prev" ? getPrevItemDetail() : getNextItemDetail();
      }
    };
   /**
     * 放棄修改，移除 .editIng.
     * @param {Boolean} boolean true 放棄編輯 false 取消
     */
    const btnWran = (boolean) => {
      if (boolean) {//放棄編輯
        // document.getElementsByClassName("editIng")
        const boxes = document.querySelectorAll(".editIng");
        boxes.forEach((box) => {
          box.classList.remove("editIng");
        });

        if (prevOrNext.value == "prev") {
          getPrevItemDetail();
        } else {
          getNextItemDetail();
        }
      }
      isSaveDialog.value = false;
    };

    // 錯誤訊息
    const error = (msg) => {
      ElMessage({
        message: msg,
        type: "error",
        duration: 800,
      });
    };

    return {
      btnNext,
      btnPrevious,
      btnWran,
      isSaveDialog,
    };
  },
};
</script>

<template>
  <div>
    <button class="btnStyle" @click="btnPrevious">
      <el-icon><caret-left /></el-icon>上一筆
    </button>
    <button class="btnStyle" @click="btnNext">
      <el-icon><caret-right /></el-icon>下一筆
    </button>
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
</template>

<style lang="scss" scoped>
.btnStyle {
  padding: 2px 4px;
  margin-right: 5px;
  cursor: pointer;
  .el-icon {
    top: 2px;
    margin-right: 2px;
  }
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
