<script>
import { computed, ref } from "vue-demi";
import { useStore } from "vuex";
import AddAgGridVue from "./AddAgGrid.vue";
import { apiUseAddItemParams } from "../../api/index";
import { ElMessage } from "element-plus";
import {apiUseAgGridHandel} from '../../componentAPI/index';
export default {
  components: {
    AddAgGridVue,
    ElMessage,
  },
  setup() {
    //關閉時，是否要更新首頁的Grid 的資料
    let closeLoadingGrid = false;
    const store = useStore();
    const addItemParams = new apiUseAddItemParams();
    const {fetchAgGridData} = apiUseAgGridHandel();
    const isOpen = computed({
      get() {
        return store.getters["addNewItem/getIsOpen"];
      },
      set(val) {
        store.commit("addNewItem/setIsOpen", val);
      },
    });

    const currentTabs = computed({
      get() {
        return store.getters["addNewItem/getTabType"];
      },
      set(val) {
        store.commit("addNewItem/setTabType", val);
        console.log(val);
      },
    });

    const getCurrnetPromoID = computed(() => {
      return store.getters["getCurrentPromoID"];
    });
    const getCruuentLineID = computed(() => {
      return store.getters["getCurrentLineID"];
    });

    /**
     * 更換頁籤事件
     */
    const handleClick = () => {
      window.addgridApi.setRowData([]);
      
      fetchAddItemAxiosData();
    };
    /**
     * 開啟Dialog，預設第一個頁籤，撈取AgGrid資料
     */
    const addDlogOepnEvent = () => {
      currentTabs.value = "0";
      window.addgridApi.setRowData([]);
      fetchAddItemAxiosData();
    };
    
    /**
    * 取得自建Grid的資料
    */
    const fetchAddItemAxiosData = () => {
      addItemParams.initial();
      addItemParams.ACTION_TYPE = currentTabs.value;
      addItemParams.PROMO_ID = getCurrnetPromoID.value;
      addItemParams.LINE_ID = getCruuentLineID.value;
      store.dispatch("addNewItem/fetchAddItemAxiosData", addItemParams);
    };
    
    /**
     * 新增品項事件
     */
    const btnAddItem = () => {
      // 取得被勾選的ROW
      const selectedRows = window.addgridApi.getSelectedRows();
      // const result = selectedRows.filter(x=>x.NO_OMO==0);
      // console.log(result)
      // 如果沒有一個被勾選，返回
      if (selectedRows.lenth == 0) {
        return;
      };
      // 如果有自建品項，則關閉Dialog時，更新首頁Grid資料
      closeLoadingGrid=true;
      // 紀錄自建品項，乎API的次數
      let count=0;
      let errCount = 0;
      // 紀錄成功的次數
      let successQty = 0;
      for (let [key, item] of selectedRows.entries()) {
        addItemParams.initial();
        addItemParams.ACTION_TYPE = 9;
        addItemParams.TYPE = item.TYPE;
        addItemParams.PROMO_ID = getCurrnetPromoID.value;
        addItemParams.DOC_ID = item.DOC_ID;
        store
          .dispatch("addNewItem/fetchAddItemAxiosData", {...addItemParams})
          .then((res) => {
            count++;
            //成功時，成功次數+1
            if (res.data[0].RTN_CODE == "0") {
              successQty++;
              //  success( item.ITEM_NAME+" "+ res.data[0].RTN_MSG);
            //失敗時，秀出錯誤訊息
            } else {      
              errCount++;      
              error(item.ITEM_NAME + " " + res.data[0].RTN_MSG);
            }
           // 當呼叫API回來的次數，等於
            if (count == selectedRows.length) {
               success(`自建成功 ${successQty} 筆`,errCount);
              //   // 重新整理自建AgGrid 資料
                fetchAddItemAxiosData();
            }
          });
      }
    };
    
    /**
     * 關閉時，如果有自建成功，則會更新首頁AgGrid
     */
    const dialogClose = ()=>{
       if(closeLoadingGrid){
          fetchAgGridData();
          closeLoadingGrid=false;
       };
    };

    // 上方顯示訊息
    // 成功訊息
    const success = (msg,conut) => {
      ElMessage({
        message: msg,
        type: "success",
        duration: 2000,
        offset : conut*20+20
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
    //續賣 ，特賣計畫書，全部商品
    //特賣計畫書 有檔期
    return {
      isOpen,
      handleClick,
      currentTabs,
      AddAgGridVue,
      addDlogOepnEvent,
      btnAddItem,
      dialogClose
    };
  },
};
</script>

<template>
  <div>
    <el-dialog
      v-model="isOpen"
      title="新增"
      width='900px'
      :draggable="true"
      :destroy-on-close="true"
       @close="dialogClose"
      @opened="addDlogOepnEvent"
    >
      <el-tabs v-model="currentTabs" type="card" @tab-click="handleClick">
        <el-tab-pane label="續賣" name="0"></el-tab-pane>
        <el-tab-pane label="特賣計畫書" name="1"></el-tab-pane>
        <el-tab-pane label="全部商品" name="2"></el-tab-pane>
      </el-tabs>
      <div class="btn">
        <button @click="btnAddItem">
          <el-icon><Plus /></el-icon><span>新增品項</span>
        </button>
      </div>
      <div class="dContent">
        <AddAgGridVue />
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.btn {
  background: #aaa;
  padding: 2px 8px;

  display: flex;
  button {
    padding: 2px 4px;
    margin-right: 5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    span {
      margin-left: 2px;
    }
  }
}
.dContent {
  height: 500px;
}
</style>
