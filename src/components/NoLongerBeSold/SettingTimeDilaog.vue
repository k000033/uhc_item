<script>
import { computed, ref } from "vue-demi";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import { apiUseUhcItemParams } from "../../api/index";
import { apiUseAgGridHandel } from "../../componentAPI/index";
export default {
  components: {
    ElMessage,
  },
  setup() {
    const store = useStore();
    const dateTime = ref("");
    const uhcItemParams = new apiUseUhcItemParams();
    const { fetchAgGridData } = apiUseAgGridHandel();
    const getDocId = computed(() => {
      return store.getters["getCurrDoc_id"];
    });
    const getOpenDialog = computed({
      get() {
        return store.getters["noLongerBeSold/getOpenDialog"];
      },
      set(value) {
        store.dispatch("noLongerBeSold/setOpenDialogAction", value);
      },
    });
    //  return store.getters['noLongerBeSold/getOpenDialog'];
    /**
     * 開啟Dialog，預設第一個頁籤，撈取AgGrid資料
     */
    const dialogOpen = () => {
      var newDate = new Date();
      const year = newDate.getFullYear();
      let month = newDate.getMonth() + 1;
      let date = newDate.getDate() + 1;
      month = `${month}`.length == 1 ? "0" + month : month;
      date = `${date}`.length == 1 ? "0" + date : date;

      console.log(`${year}-${month}-${date} 00:00`);
      dateTime.value = `${year}-${month}-${date} 00:00`;
    };

    /**
     * 關閉時
     */
    const dialogClose = () => {};

    /**
     * 確定
     */
    const submit_click = () => {
      const selectedRows = window.gridApi.getSelectedRows();
      const doc_id = selectedRows[0].DOC_ID;
      uhcItemParams.ACTION_TYPE = 10;
      uhcItemParams.DOC_ID = doc_id;
      uhcItemParams.D_DATE = dateTime.value;
      store
        .dispatch("noLongerBeSold/noSoldAction", uhcItemParams)
        .then((res) => {
          if (res.data[0].RTN_CODE == 0) {
            store.dispatch("noLongerBeSold/setOpenDialogAction", false);
            fetchAgGridData();
          } else {
            error(res.data[0].RTN_MSG);
          }
        });
    };
    /**
     * 取消
     */
    const cancel_click = () => {
      getOpenDialog.value = false;
    };

    // 上方顯示訊息
    // 成功訊息
    const success = (msg, conut) => {
      ElMessage({
        message: msg,
        type: "success",
        duration: 2000,
        offset: conut * 20 + 20,
      });
    };

    // 失敗訊息
    const error = (msg) => {
      ElMessage({
        message: msg,
        type: "error",
        duration: 3000,
        showClose: true,
      });
    };

    const defaultTime1 = new Date(2000, 1, 1, 12, 0, 0); // '12:00:00'

    return {
      dateTime,
      getOpenDialog,
      dialogOpen,
      dialogClose,
      cancel_click,
      submit_click,
      defaultTime1,
    };
  },
};
</script>

<template>
  <div>
    <el-dialog
      v-model="getOpenDialog"
      title="下架"
      width="360px"
      :draggable="true"
      :destroy-on-close="true"
      @close="dialogClose"
      @opened="dialogOpen"
    >
      <div class="settimtDateWrap">
        <div class="block">
          <span class="demonstration">輸入下架時間</span>
          <el-date-picker
            v-model="dateTime"
                    
  
            type="datetime"
            placeholder="Select date and time"
            value-format="YYYY-MM-DD HH:mm"
          />
        </div>
      </div>
      <div class="btn">
        <el-button type="primary" @click="submit_click">確定</el-button>
        <el-button type="primary" @click="cancel_click">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.settimtDateWrap {
  display: flex;
  justify-content: center;
  padding: 16px 0;
  .block {
    width: 200px;
    text-align: center;
    span {
      margin-bottom: 16px;
      display: block;
    }
  }
}
.btn {
  display: flex;
  justify-content: center;
  padding-bottom: 16px;
}
</style>
