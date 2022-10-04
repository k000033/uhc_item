<script>
import { computed, h, reactive, ref, watch } from "vue-demi";
import { useStore } from "vuex";
import uploadExcel from "../components/uploadExcel.vue";
import { apiUseUhcItemParams, apiUseExportExcelParams } from "../api/index";
import { ElNotification, ElMessage } from "element-plus";
import uploadExcelMultiplePage from "./uploadExcelMultiplePage.vue";
import { apiUseGuid } from "../componentAPI/index";
import ExcelJs from "exceljs";
import { apiToDecimal } from "../componentAPI/index";
import { apiUseAddItemParams } from "../api/index";
export default {
  components: {
    uploadExcel,
    ElNotification,
    ElMessage,
    uploadExcelMultiplePage,
  },
  setup() {
    const store = useStore();
    // 子頁籤
    const tabPosition = ref("10");
    const exportExcelLoading = ref(false);
    const ucItemParams = new apiUseUhcItemParams();
    const exportExcel = new apiUseExportExcelParams();
    const addItemParams = new apiUseAddItemParams();
    const excelDataList = reactive({ data: [] });
    const getCurrLineID = computed(() => {
      return store.getters["getCurrentLineID"];
    });

    // 取得目前 Promo ID
    const getCurrentPromoID = computed(() => {
      return store.getters["getCurrentPromoID"];
    });
    const getCurrPromoIDX = computed(() => {
      return store.getters["getCurrentPromoIDX"];
    });
    // 取得目前頁籤代號
    const currPage = computed({
      get() {
        tabPosition.value = `${store.getters["getCurrentPage"]}`;
        return store.getters["getCurrentPage"];
      },
      set(val) {
        store.commit("setCurrentPage", val);
      },
    });

    const reFreshAgGridData = () => {
      ucItemParams.initial();
      store.dispatch("fetchAgGridTpe2", ucItemParams);
    };

    // 子頁籤切換
    const tabClick = (page) => {
      currPage.value = page;
      // ucItemParams.initial();
      // store.dispatch("fetchAgGridTpe2", ucItemParams);
      reFreshAgGridData();
    };

    //所有按鈕功能
    const btnGroupAction = (action_type) => {
      // 取得被勾選的ROW
      const selectedRows = window.gridApi.getSelectedRows();
      if (selectedRows.length == 0) {
        return;
      }
      // console.log(selectedRows);
      // 一筆一筆去呼SP
      let sucess_count = 0;
      let msgCount = 0;
      store.commit("setAqGridIsLoading", true);
      selectedRows.forEach((rows, key) => {
        ucItemParams.initial();
        ucItemParams.ACTION_TYPE = action_type;
        ucItemParams.DOC_ID = rows.DOC_ID;
        store
          .dispatch("btnGroup/btnGroupAction", { ...ucItemParams })
          .then((res) => {
            //成功
            if (res.data[0].RTN_CODE == 0) {
              sucess_count++;
              console.log(sucess_count);
              //  openSuccess(action_type, rows.ITEM_NAME,key);
            } else {
              //失敗
              msgCount++;
              openError(rows.ITEM_NAME, res.data[0].RTN_MSG, msgCount);
            }
            // 當最後一筆時，重撈AgGrid資料
            if (sucess_count + msgCount == selectedRows.length) {
              store.commit("setAqGridIsLoading", false);
              msgCount++;
              openSuccess(action_type, `共${sucess_count}筆`, msgCount);
              // ucItemParams.initial();
              // store.dispatch("fetchAgGridTpe2", ucItemParams);
              reFreshAgGridData();
            }
          });
      });
    };
    // 判斷是否顯示子頁籤
    const applyCondition = computed(() => {
      return [10, 11, 12, 13, 14].includes(parseInt(currPage.value));
    });

    //建立群組
    const btnAddGroup = () => {
      const selectedRows = window.gridApi.getSelectedRows();
      let valid = true;
      if (selectedRows.length < 2) {
        error("至少要勾選2個品項");
        return;
      }

      selectedRows.forEach((item) => {
        if (item.GID_TYPE != 0) {
          valid = false;
        }
      });

      if (!valid) {
        error("有品項已經有群組");
        return;
      }
      // store.commit("btnGroup/setOpenCreateGroup", true);
      selectedRows.forEach((item, index) => {
        ucItemParams.initial();
        ucItemParams.DOC_ID = item.DOC_ID;
        ucItemParams.GID = selectedRows[0].DOC_ID;
        store
          .dispatch("btnGroup/btnCRUDGroup", { ...ucItemParams })
          .then((res) => {
            // store.commit("btnGroup/setOpenCreateGroup", true);

            ucItemParams.initial();
            ucItemParams.GID = selectedRows[0].DOC_ID;
            store.dispatch("btnGroup/btnCRUDGroup", ucItemParams);
            // store.commit("btnGroup/setOpenCreateGroup", true);

            if (selectedRows.length - 1 == index) {
              setTimeout(() => {
                reFreshAgGridData();
              }, 300);
            }
          });
      });
    };

    //群組設定
    // const btnSetGroup = () => {
    //   const selectedRows = window.gridApi.getSelectedRows();
    //   if (selectedRows.length < 1) {
    //     error("至少要勾選1個品項");
    //     return;
    //   }
    //   let valid = true;

    //   selectedRows.forEach((item) => {
    //     if (selectedRows[0].GID != item.GID) {
    //       error("只能勾選一個群組");
    //       valid = false;
    //       return false;
    //     }
    //   });

    //   if (!valid) {
    //     return;
    //   }

    //   ucItemParams.initial();
    //   ucItemParams.GID = selectedRows[0].GID;
    //   store
    //     .dispatch("btnGroup/btnCRUDGroup", { ...ucItemParams })
    //     .then((res) => {
    //       store.commit("btnGroup/setOpenCreateGroup", true);
    //     });
    // };

    //解除群組
    // const btnDelGroup = () => {
    //   const selectedRows = window.gridApi.getSelectedRows();
    //   let valid = true;
    //   if (selectedRows.length < 1) {
    //     error("至少要勾選1個品項");
    //     return;
    //   }

    //   selectedRows.forEach((item) => {
    //     if (selectedRows[0].GID != item.GID) {
    //       error("只能勾選一個群組");
    //       valid = false;
    //       return false;
    //     }
    //   });

    //   if (!valid) {
    //     return;
    //   }

    //   selectedRows.forEach((item, index) => {
    //     ucItemParams.initial();
    //     ucItemParams.DOC_ID = item.DOC_ID;
    //     ucItemParams.GID = item.DOC_ID;
    //     store
    //       .dispatch("btnGroup/btnCRUDGroup", { ...ucItemParams })
    //       .then((res) => {
    //         if (selectedRows.length - 1 == index) {
    //           setTimeout(() => {
    //             reFreshAgGridData();
    //           }, 300);
    //         }
    //       });
    //   });
    // };

    const btnRefresh_click = () => {
      ucItemParams.initial();
      store.dispatch("fetchAgGridTpe2", ucItemParams);
    };

    // 成功訊息
    const openSuccess = (action_type, msg, key) => {
      let strType = "";

      switch (action_type) {
        case 1:
          strType = "揀選成功";
          break;
        case 2:
          strType = "退回申請成功";
          break;
        case 6:
          strType = "同意成功";
          break;
        case 7:
          strType = "刪除";
          break;
        case 8:
          strType = "返回製作成功";
          break;
      }
      ElNotification({
        title: strType,
        message: h("B", { style: "color: teal;font-weight:100" }, msg),
        offset: key * 120+120,
      });
    };

    //錯誤訊息
    const openError = (itemName, msg, key) => {
      ElNotification({
        title: itemName,
        type: "error",
        message: h("B", { style: "color: red" }, msg),
        offset: key * 120 + 100,
      });
    };

    // 上方顯示訊息
    // 成功訊息
    const success = (msg) => {
      ElMessage({
        message: msg,
        type: "success",
        duration: 4000,
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

    /**
     *  自建功能
     */
    const btnAddNewItem = () => {
      if (getCurrLineID.value == "AL") {
        error("類別在全部的形況下，不能自建。");
        return;
      }
      if (getCurrPromoIDX.value == "99") {
        error("在顯示全部檔期時，不能自建。");
        return;
      }

      store.commit("addNewItem/setIsOpen", true);
    };

    /**
     * 複製新增
     */
    const btnCopyAdd = () => {
      const selectedRows = window.gridApi.getSelectedRows();
      if(selectedRows.length>1)
      {
        error('複製新增只能勾選一個品項');
        return;
      };
      addItemParams.initial();
      addItemParams.ACTION_TYPE = 9;
      addItemParams.TYPE = 7;
      addItemParams.PROMO_ID = getCurrentPromoID.value;
      addItemParams.DOC_ID = selectedRows[0].DOC_ID;
      store
          .dispatch("addNewItem/fetchAddItemAxiosData", {...addItemParams}).then((res)=>{
             if(res.data[0].RTN_CODE==0){
              success(res.data[0].RTN_MSG);
             }else{
               error(res.data[0].RTN_MSG)
             };
             reFreshAgGridData();
          });
    };

    let columnList = [
      { TYPE: "品類" },
      { SALE_B_DATE: "活動起日" },
      { SALE_E_DATE: "活動迄日" },
      { ACTIVITY_TYPE: "電商販賣屬性" },
      { SUP_ID: "廠編" },
      { SUP_NAME: "廠商簡稱" },
      { LINE_ID: "大類碼" },
      { ALIAS: "大類名稱" },
      { ITEM_ID: "單品貨號" },
      { BARCODE: "單品條碼" },
      { ITEM_NAME: "品名規格" },
      { UNIT: "單位" },
      { SALE_QTY: "成立組入數" },
      { DELIVERY_TEMP: "溫層" },
      { TAKE_TYPE: "提貨別" },
      { SPRICE: "原價(單售價*成立組數)" },
      { CNT_COST: "單進價" },
      { CNT_DIPRICE: "單折讓" },
      { CNT_PRICE: "單售價" },
      { CNT_GROSS: "單毛利" },
      { COST: "促銷進價" },
      { PRICE: "促銷售價" },
      { DISCOUNT: "促銷折讓" },
      { _GROSS: "促銷毛利" },

      { ADD_PRICE: "後補金額" },
      { _ADD_GROSS: "補足毛利" },
      { ADD_TYPE: "後補別" },
      { ADD_MEMO: "後補說明" },


      { USE_BONUS: "贈扣點" },
      { TAX_TYPE: "稅別" },
      { MEMO: "備註" },
      { TAKE_E_DAY: "取貨期限" },
      { SALE_STOCK: "當期限量(幾組/箱)" },
      { STOCK_QTY: "物流加拋數量(分批填無)" },
      { _CONTRACT: "廠商聯絡人資料" },
      { ACTIVITY_NAME: "活動品名" },
      { SUBJECT: "電商活動主題" },
      { DM_TITLE: "本檔DM活動" },
      { STATUS: "狀態" },
    ];

    /**
     * 匯出EXCEL
     */
    const btnExportExcel = () => {
      exportExcelLoading.value = true;
      //產生GRID
      const guid = apiUseGuid();
      //取得AgGrid被過濾後的資料
      const rows =
        window.gridApi.rowModel.nodeManager.rootNode.childrenAfterFilter;
      //紀錄存進去的筆數
      let count = 0;
      for (let [key, item] of rows.entries()) {
        // 將每一筆資料存入Table
        exportExcel.inital();
        exportExcel.ID = guid;
        exportExcel.DOC_ID = item.data.DOC_ID;
        store
          .dispatch("exportExcel/exportExcelAction", exportExcel)
          .then((res) => {
            //每存一筆++
            count++;
            // 當存完最後一筆後，透過GUID，取得要匯出EXCEL的資料
            if (count == rows.length) {
              exportExcel.inital();
              exportExcel.ID = guid;
              store
                .dispatch("exportExcel/exportExcelAction", exportExcel)
                .then((res) => {
                  // excelDataList.data = res.data;
                  //匯出EXCEL總資料
                  let excelRows = [];
                  //匯出EXCEL每一筆資料
                  let ValueAry = [];
                  //EXCEL欄位名稱
                  let columnAry = [];

                  for (let [index, item] of res.data.entries()) {
                    ValueAry = [];
                    for (let key of columnList) {
                      // console.log(key)
                      if (index == 0) {
                        // 欄位
                        columnAry.push({ name: Object.values(key)[0] });
                      }
                      // 塞值
                      if (
                        Object.keys(key) == "CNT_GROSS" ||
                        Object.keys(key) == "_GROSS"
                      ) {
                        ValueAry.push(
                          apiToDecimal(item[Object.keys(key)]) + "%"
                        );
                      } else {
                        ValueAry.push(item[Object.keys(key)]);
                      }
                    }
                    excelRows.push(ValueAry);
                    if (index == res.data.length - 1) {
                      makeExcel(columnAry, excelRows);
                    }
                  }
                });
            }
          });
      }
    };

    const makeExcel = (excelColumn, excelRows) => {
      console.log(excelRows);
      const workbook = new ExcelJs.Workbook(); // 創建試算表檔案
      const sheet = workbook.addWorksheet("工作表1"); //在檔案中新增工作表 參數放自訂名稱

      sheet.addTable({
        // 在工作表裡面指定位置、格式並用columsn與rows屬性填寫內容
        name: "table名稱", // 表格內看不到的，讓你之後想要針對這個table去做額外設定的時候，可以指定到這個table
        ref: "A1", // 從A1開始
        columns: excelColumn,
        rows: excelRows,
      });
      // ["A1", "B1", "C1"].map((key) => {
      //   sheet.getCell(key).fill = {
      //     type: "pattern",
      //     pattern: "solid",
      //     fgColor: {
      //       argb: "FFFF7D7D",
      //     },
      //   };
      // });
      //設定寬度
      sheet.getColumn(1).width = 15;
      sheet.getColumn(2).width = 15;
      sheet.getColumn(3).width = 15;
      sheet.getColumn(4).width = 15;
      sheet.getColumn(5).width = 15;
      sheet.getColumn(6).width = 15;
      sheet.getColumn(7).width = 15;
      sheet.getColumn(8).width = 15;
      sheet.getColumn(9).width = 15;
      sheet.getColumn(10).width = 15;
      sheet.getColumn(11).width = 50;
      sheet.getColumn(12).width = 15;
      sheet.getColumn(13).width = 15;
      sheet.getColumn(14).width = 15;
      sheet.getColumn(15).width = 15;
      sheet.getColumn(16).width = 30;
      sheet.getColumn(17).width = 15;
      sheet.getColumn(18).width = 15;
      sheet.getColumn(19).width = 15;
      sheet.getColumn(20).width = 15;
      sheet.getColumn(21).width = 15;
      sheet.getColumn(22).width = 15;
      sheet.getColumn(23).width = 15;
      sheet.getColumn(24).width = 15;
      
      sheet.getColumn(25).width = 15;
      sheet.getColumn(26).width = 15;
      sheet.getColumn(27).width = 15;
      sheet.getColumn(28).width = 15;
      
      
 
      sheet.getColumn(29).width = 15;
      sheet.getColumn(30).width = 15;
      sheet.getColumn(31).width = 15;
      sheet.getColumn(32).width = 15;
      sheet.getColumn(33).width = 30;
      sheet.getColumn(34).width = 30;
      sheet.getColumn(35).width = 50;
      sheet.getColumn(36).width = 50;
      sheet.getColumn(37).width = 15;

      sheet.getColumn(38).width = 15;

      sheet.getColumn(39).width = 15;



      sheet.getColumn(1).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      sheet.getColumn(2).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      sheet.getColumn(3).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      sheet.getColumn(4).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      sheet.getColumn(5).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      sheet.getColumn(6).alignment = {
        vertical: "middle",
        horizontal: "left",
      };
      sheet.getColumn(7).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      sheet.getColumn(8).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      sheet.getColumn(9).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      sheet.getColumn(10).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      sheet.getColumn(11).alignment = {
        vertical: "middle",
        horizontal: "left",
      };
      // sheet.getColumn(12).alignment = { vertical: "middle", horizontal: "center" };
      sheet.getColumn(12).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      sheet.getColumn(13).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      sheet.getColumn(14).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      sheet.getColumn(15).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      sheet.getColumn(16).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      sheet.getColumn(17).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      sheet.getColumn(18).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      sheet.getColumn(19).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      sheet.getColumn(20).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      sheet.getColumn(21).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      sheet.getColumn(22).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      sheet.getColumn(23).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      sheet.getColumn(24).alignment = {
        vertical: "middle",
        horizontal: "center",
      };

      sheet.getColumn(25).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      sheet.getColumn(26).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      sheet.getColumn(27).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      sheet.getColumn(28).alignment = {
        vertical: "middle",
        horizontal: "center",
      };


      sheet.getColumn(29).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      sheet.getColumn(30).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      sheet.getColumn(31).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      sheet.getColumn(32).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      sheet.getColumn(33).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      sheet.getColumn(34).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      sheet.getColumn(35).alignment = {
        vertical: "middle",
        horizontal: "left",
      };
      sheet.getColumn(36).alignment = {
        vertical: "middle",
        horizontal: "left",
      };
      // sheet.getColumn(30).alignment = { vertical: "middle", horizontal: "center" };
      // sheet.getColumn(31).alignment = { vertical: "middle", horizontal: "center" };
      sheet.getColumn(38).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      sheet.getColumn(39).alignment = {
        vertical: "middle",
        horizontal: "center",
      };

      sheet.getColumn(4).eachCell({ includeEmpty: true }, function (cell) {
        sheet.getCell(cell.address).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: {
            argb: "FFFFe462",
          },
        };
      });

      sheet.getRow(1).eachCell({ includeEmpty: true }, function (cell) {
        sheet.getCell(cell.address).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: {
            argb: "FF003D96",
          },
        };
      });

      // 表格裡面的資料都填寫完成之後，訂出下載的callback function
      // 異步的等待他處理完之後，創建url與連結，觸發下載
      workbook.xlsx.writeBuffer().then((content) => {
        const link = document.createElement("a");
        const blobData = new Blob([content], {
          type: "application/vnd.ms-excel;charset=utf-8;",
        });
        link.download = "電商活動提品商品總表.xlsx";
        link.href = URL.createObjectURL(blobData);
        link.click();
        exportExcelLoading.value = false;
      });
    };

    return {
      btnCopyAdd,
      tabPosition,
      btnGroupAction,
      currPage,
      applyCondition,
      tabClick,
      btnAddGroup,
      // btnSetGroup,
      // btnDelGroup,
      btnRefresh_click,
      btnAddNewItem,
      btnExportExcel,
      exportExcelLoading,
    };
  },
};
</script>

<template>
  <div class="box">
    <!-- 申請 -->
    <div class="apply dBtnContent" v-show="applyCondition">
      <div class="dRadio">
        <el-radio
          v-model="tabPosition"
          label="10"
          size="small"
          @change="tabClick(10)"
          >待揀選</el-radio
        >
        <el-radio
          v-model="tabPosition"
          label="11"
          size="small"
          @change="tabClick(11)"
          >已揀選</el-radio
        >
        <el-radio
          v-model="tabPosition"
          label="12"
          size="small"
          @change="tabClick(12)"
          >拒絕</el-radio
        >
        <el-radio
          v-model="tabPosition"
          label="13"
          size="small"
          @change="tabClick(13)"
          >退回修改</el-radio
        >
        <el-radio
          v-model="tabPosition"
          label="14"
          size="small"
          @change="tabClick(14)"
          >刪除</el-radio
        >
      </div>
      <!-- 只有頁籤在 10 才會出現按鈕 -->
      <div class="btnGroup" v-show="currPage == 10">
        <el-button type="primary" size="small" @click="btnGroupAction(1)"
          >揀選</el-button
        >
        <el-button type="primary" size="small" @click="btnGroupAction(4)"
          >退回修改</el-button
        >
        <el-button type="primary" size="small">拒絕</el-button>
        <el-button type="primary" size="small" @click="btnGroupAction(7)"
          >刪除</el-button
        >

        <uploadExcel v-show="currPage == 10" />
        <uploadExcelMultiplePage v-show="currPage == 10" />
      </div>
    </div>
    <!-- 製作 -->
    <div class="Make dBtnContent" v-show="currPage == 20">
      <el-button type="primary" size="small" @click="btnAddNewItem()"
        >自建品項</el-button
      >
      <el-button type="primary" size="small" @click="btnCopyAdd()">
        複製新增</el-button
      >
      <el-button type="primary" size="small" @click="btnGroupAction(2)">
        退回申請</el-button
      >
      <el-button type="primary" size="small" @click="btnGroupAction(7)"
        >刪除</el-button
      >
      <el-button type="primary" size="small" @click="btnAddGroup"
        >加入群組</el-button
      >
      <el-button
        type="primary"
        size="small"
        @click="btnExportExcel"
        :loading="exportExcelLoading"
        >匯出商品總表</el-button
      >

      <!-- <el-button type="primary" size="small" @click="btnSetGroup"
        >群組設定</el-button
      > -->
      <!-- <el-button type="primary" size="small" @click="btnDelGroup"
        >解除群組</el-button
      > -->
    </div>

    <!-- 檢核 -->
    <div class="Check dBtnContent" v-show="currPage == 30">
      <el-button type="primary" size="small" @click="btnGroupAction(6)"
        >同意</el-button
      >
      <el-button type="primary" size="small">再議</el-button>
      <el-button type="primary" size="small">拒絕</el-button>
      <el-button
        type="primary"
        size="small"
        @click="btnExportExcel"
        :loading="exportExcelLoading"
        >匯出商品總表</el-button
      >
    </div>

    <!-- 確認 -->
    <div class="Ensure dBtnContent" v-show="currPage == 40">
      <!-- <el-button type="primary" size="small">異動</el-button> -->
      <el-button type="primary" size="small" @click="btnCopyAdd()">
        複製新增</el-button
      >
      <el-button type="primary" size="small" @click="btnGroupAction(8)"
        >返回製作</el-button
      >
      <el-button
        type="primary"
        size="small"
        @click="btnExportExcel"
        :loading="exportExcelLoading"
        >匯出商品總表</el-button
      >
    </div>

    <!-- 上架 -->
    <div class="OnSelf dBtnContent" v-show="currPage == 50">
      <!-- <el-button type="primary" size="small">修改</el-button> -->
      <el-button type="primary" size="small" @click="btnCopyAdd()">
        複製新增</el-button
      >
      <el-button
        type="primary"
        size="small"
        @click="btnExportExcel"
        :loading="exportExcelLoading"
        >匯出商品總表</el-button
      >
    </div>
    <div class="dRefresh" @click="btnRefresh_click">
      <el-icon :size="29"><Refresh /></el-icon>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.box {
  display: flex;
  .dBtnContent {
    height: 100%;
    display: flex;
    background: #003d96;
    padding: 4px 8px;
    color: #fff;
    flex-grow: 1;
    .dRadio {
      border-right: 1px dashed #304cbe;
      margin-right: 10px;
    }
  }

  .btnGroup {
    display: flex;
  }

  .elementHide {
    display: none;
  }
  .dRefresh {
    background: #003d96;
    display: flex;
    align-items: center;
    .el-icon {
      color: #fff;
      margin-right: 10px;
    }
  }
}
</style>
