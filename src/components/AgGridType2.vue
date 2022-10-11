<script>
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-enterprise";
import { useStore } from "vuex";
import { apiUseUhcItemParams } from "../api/index";
import { computed, onMounted, reactive, ref } from "vue-demi";
import openDialog from "./OpenDialog.vue";
import openGroup from "./OpenGroup.vue";
import openAddDialog from "./AddNewItem/openAddDialog.vue";
import { apiUseAgGridHandel } from "../componentAPI/index";
import openSettingTimeDialog from '../components/NoLongerBeSold/SettingTimeDilaog.vue'
export default {
  components: {
    AgGridVue,
    openDialog,
    openGroup,
    openAddDialog,
    openSettingTimeDialog
  },
  setup() {
    const store = useStore();
    // const loading = ref(false);
    const UcItemParams = new apiUseUhcItemParams();
    const { getDetail } = apiUseAgGridHandel();
    const getAgGridType2Data = computed(() => {
      return store.getters["getAgGridType2Data"];
    });

    const currDoc_id = computed({
      get() {
        return store.getters["getCurrDoc_id"];
      },
      set(val) {
        store.commit("setCurrDoc_id", val);
      },
    });

    const currPage = computed(() => {
      return store.getters["getCurrentPage"];
    });

    const currPromoID = computed(()=>{
      return store.getters["getCurrentPromoID"];
    })

    // const openDialog = ref(false);

    onMounted(() => {
      // fetchAgGridData();
      // apiUseFetchAgGridData();
    });
    // 取得AgGrid Data
    // const fetchAgGridData = () => {
    //   UcItemParams.initial();
    //   store.dispatch("fetchAgGridTpe2", UcItemParams).then((res) => {
    //   });
    // };

    //取得載入的狀態
    const loading = computed(() => {
      return store.getters["getAqGridIsLoading"];
    });

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
    // agGrid全選
    window.isFirstColumn = function isFirstColumn(params) {
      var displayedColumns = params.columnApi.getAllDisplayedColumns();
      var thisIsFirstColumn = displayedColumns[0] === params.column;

      //window.gridApi.getSelectedRows()
      return thisIsFirstColumn;
    };

    const onCellDbClicked = (params) => {
      // 頁籤代號 10 11 12 13 14 的 AgGrid,不開啟Dialog
      let isEnableOpen = ["10", "11", "12", "13", "14"].includes(
        `${currPage.value}`
      );
      if (isEnableOpen) {
        return;
      }
      // const selectedRows = window.gridApi.getSelectedRows();
      // console.log(selectedRows);
      console.log(params);
      currDoc_id.value = params.data.DOC_ID;
      // 儲存AgGrid上的資料
      store.commit("detailDialog/setAgGridData", params.data);
      // 開啟 Dialog
      store.commit("detailDialog/setIsOpen", true);

      // 取得品項的明細資料
      // UcItemParams.initial();
      // UcItemParams.DOC_ID = params.data.DOC_ID;
      // UcItemParams.DETAIL_PAGE = 1;
      // store.dispatch("detailDialog/fetchDetailData", { ...UcItemParams });
      
      // 取得品項的明細資料
      getDetail(params.data.DOC_ID);
      // 撈取下拉選單資料
      UcItemParams.initial();
      UcItemParams.CODE_TYPE = 0;
      store.dispatch("detailDialog/fetchDropDownData", { ...UcItemParams });
      UcItemParams.initial();
      UcItemParams.CODE_TYPE = 4;
      store.dispatch("detailDialog/fetchDropDownData", { ...UcItemParams });
      UcItemParams.initial();
      UcItemParams.CODE_TYPE = 3;
      store.dispatch("detailDialog/fetchDropDownData", { ...UcItemParams });
      UcItemParams.initial();
      UcItemParams.CODE_TYPE = 2;
      store.dispatch("detailDialog/fetchDropDownData", { ...UcItemParams });
      UcItemParams.initial();
      UcItemParams.CODE_TYPE = 5;
      store.dispatch("detailDialog/fetchDropDownData", { ...UcItemParams });
      UcItemParams.CODE_TYPE = 6;
      UcItemParams.PROMO_ID = currPromoID.value;
      store.dispatch("detailDialog/fetchDropDownData", { ...UcItemParams });

      // //單品檢核
      // UcItemParams.initial();
      // UcItemParams.DOC_ID = params.data.DOC_ID;
      // UcItemParams.DETAIL_PAGE = 3;
      // store.dispatch("detailDialog/fetchItemCheckData", { ...UcItemParams });

      //群組設定
      // UcItemParams.initial();
      // UcItemParams.GID = params.data.GID;
      // store.dispatch("btnGroup/btnCRUDGroup", { ...UcItemParams });
      // getGroupData(params.data.GID);
    };

    // const navigateToNextCell = (params) => {
    //   const suggestedNextCell = params.nextCellPosition;

    //   // this is some code
    //   const KEY_UP = "ArrowUp";
    //   const KEY_DOWN = "ArrowDown";

    //   const noUpOrDownKeyPressed =
    //     params.key !== KEY_DOWN && params.key !== KEY_UP;
    //   if (noUpOrDownKeyPressed) {
    //     return suggestedNextCell;
    //   }

    //   params.api.forEachNode((node) => {
    //     if (node.rowIndex === suggestedNextCell.rowIndex) {
    //       node.setSelected(true);
    //     }
    //   });

    //   return suggestedNextCell;
    // };

    function getRowId(rowData) {
      //rowData 會有row的資料
      return rowData.data.DOC_ID;
    }

    var ag_Text = { page: "頁" };

    return {
      // navigateToNextCell,
      // openDialog,
      ag_Text,
      getRowId,
      onCellDbClicked,
      isFirstColumn,
      loading,
      svg,
      getAgGridType2Data,
      columnDefs: [
        {
          headerName: "來源",
          field: "CRT_TYPE_NAME",
          filter: "agTextColumnFilter",
          width: "100px",
          checkboxSelection: isFirstColumn, //   在欄位設定 true 是 針對那一行增加 checkbox
                    cellClassRules: {
            txtBlue: params => params.data.ERR_TYPE ==1,
            txtPurple: params => params.data.ERR_TYPE ==2,
            txtRed: params => params.data.ERR_TYPE ==3,
            txtBlack: params => params.data.ERR_TYPE ==0,
        },
        },
        {
          headerName: "狀態",
          field: "STATUS_NAME",
          filter: "agTextColumnFilter",
          width: "70px",
          cellClassRules: {
            txtBlue: params => params.data.ERR_TYPE ==1,
            txtPurple: params => params.data.ERR_TYPE ==2,
            txtRed: params => params.data.ERR_TYPE ==3,
            txtBlack: params => params.data.ERR_TYPE ==0,
        },
        },
        {
          headerName: "活動檔期",
          field: "PROMO_NAME",
          filter: "agTextColumnFilter",
          width: "200px",
                    cellClassRules: {
            txtBlue: params => params.data.ERR_TYPE ==1,
            txtPurple: params => params.data.ERR_TYPE ==2,
            txtRed: params => params.data.ERR_TYPE ==3,
            txtBlack: params => params.data.ERR_TYPE ==0,
        },
        },
        // {
        //   headerName: "活動起迄日",
        //   field: "PROMO_PERIOD",
        //   filter: "agTextColumnFilter",
        //   width: "100px",
        // },
        {
          headerName: "活動別",
          field: "ACTIVITY_NAME",
          sortable: true,
          filter: "agTextColumnFilter",
          width: "100px",
                    cellClassRules: {
            txtBlue: params => params.data.ERR_TYPE ==1,
            txtPurple: params => params.data.ERR_TYPE ==2,
            txtRed: params => params.data.ERR_TYPE ==3,
            txtBlack: params => params.data.ERR_TYPE ==0,
        },
        },
        {
          headerName: "供應商",
          field: "VENDOR_NAME",
          sortable: true,
          filter: "agTextColumnFilter",
          width: "140px",
                    cellClassRules: {
            txtBlue: params => params.data.ERR_TYPE ==1,
            txtPurple: params => params.data.ERR_TYPE ==2,
            txtRed: params => params.data.ERR_TYPE ==3,
            txtBlack: params => params.data.ERR_TYPE ==0,
        },
        },
        {
          headerName: "店內碼",
          field: "PLU",
          sortable: true,
          filter: "agTextColumnFilter",
          width: "135px",
                    cellClassRules: {
            txtBlue: params => params.data.ERR_TYPE ==1,
            txtPurple: params => params.data.ERR_TYPE ==2,
            txtRed: params => params.data.ERR_TYPE ==3,
            txtBlack: params => params.data.ERR_TYPE ==0,
        },
        },
        {
          headerName: "商品名稱",
          field: "ITEM_NAME",
          sortable: true,
          filter: "agTextColumnFilter",
          width: "380px",
                    cellClassRules: {
            txtBlue: params => params.data.ERR_TYPE ==1,
            txtPurple: params => params.data.ERR_TYPE ==2,
            txtRed: params => params.data.ERR_TYPE ==3,
            txtBlack: params => params.data.ERR_TYPE ==0,
        },
        },
        {
          headerName: "銷售起迄日",
          field: "SALE_PERIOD",
          sortable: true,
          filter: "agTextColumnFilter",
          width: "120px",
                    cellClassRules: {
            txtBlue: params => params.data.ERR_TYPE ==1,
            txtPurple: params => params.data.ERR_TYPE ==2,
            txtRed: params => params.data.ERR_TYPE ==3,
            txtBlack: params => params.data.ERR_TYPE ==0,
        },
        },
        {
          headerName: "促銷售價",
          field: "PRICE",
          sortable: true,
          filter: "agTextColumnFilter",
          width: "110px",
                    cellClassRules: {
            txtBlue: params => params.data.ERR_TYPE ==1,
            txtPurple: params => params.data.ERR_TYPE ==2,
            txtRed: params => params.data.ERR_TYPE ==3,
            txtBlack: params => params.data.ERR_TYPE ==0,
        },
        },
        {
          headerName: "產品別",
          field: "OMO_TYPE_NAME",
          sortable: true,
          filter: "agTextColumnFilter",
          width: "100px",
                    cellClassRules: {
            txtBlue: params => params.data.ERR_TYPE ==1,
            txtPurple: params => params.data.ERR_TYPE ==2,
            txtRed: params => params.data.ERR_TYPE ==3,
            txtBlack: params => params.data.ERR_TYPE ==0,
        },
        },
        {
          headerName: "銷售店群",
          field: "SALE_ATTRIBUTE_NAME",
          sortable: true,
          filter: "agTextColumnFilter",
          width: "110px",
                    cellClassRules: {
            txtBlue: params => params.data.ERR_TYPE ==1,
            txtPurple: params => params.data.ERR_TYPE ==2,
            txtRed: params => params.data.ERR_TYPE ==3,
            txtBlack: params => params.data.ERR_TYPE ==0,
        },
        },
        {
          headerName: "條碼",
          field: "BARCODE",
          sortable: true,
          filter: "agTextColumnFilter",
          width: "120px",
                    cellClassRules: {
            txtBlue: params => params.data.ERR_TYPE ==1,
            txtPurple: params => params.data.ERR_TYPE ==2,
            txtRed: params => params.data.ERR_TYPE ==3,
            txtBlack: params => params.data.ERR_TYPE ==0,
        },
        },
        {
          headerName: "活動主題",
          field: "SUBJECT",
          sortable: true,
          filter: "agTextColumnFilter",
          width: "140px",
                    cellClassRules: {
            txtBlue: params => params.data.ERR_TYPE ==1,
            txtPurple: params => params.data.ERR_TYPE ==2,
            txtRed: params => params.data.ERR_TYPE ==3,
            txtBlack: params => params.data.ERR_TYPE ==0,
        },
        },
        {
          headerName: "異動日期",
          field: "UPD_DATE",
          sortable: true,
          filter: "agTextColumnFilter",
          width: "120px",
                    cellClassRules: {
            txtBlue: params => params.data.ERR_TYPE ==1,
            txtPurple: params => params.data.ERR_TYPE ==2,
            txtRed: params => params.data.ERR_TYPE ==3,
            txtBlack: params => params.data.ERR_TYPE ==0,
        },
        },
        {
          headerName: "異動人員",
          field: "UPD_BY",
          sortable: true,
          filter: "agTextColumnFilter",
          width: "120px",
                    cellClassRules: {
            txtBlue: params => params.data.ERR_TYPE ==1,
            txtPurple: params => params.data.ERR_TYPE ==2,
            txtRed: params => params.data.ERR_TYPE ==3,
            txtBlack: params => params.data.ERR_TYPE ==0,
        },
        },
      ],
      defaultColDef: {
        floatingFilter: true,
        resizable: true,
        headerCheckboxSelection: isFirstColumn,
        headerCheckboxSelectionFilteredOnly: true,
      },
      onGridReady(params) {
        //設定全域變數，某些事件會使用
        window.gridApi = params.api; //設定全域變數
        window.gridColumnApi = params.columnApi; //設定全域變數
        window.gridApi.selectionService.selectIndex("0");
      },
    };
  },
};
</script>

<template>
  <ag-grid-vue
    v-loading="loading"
    element-loading-text="Loading..."
    :element-loading-spinner="svg"
    element-loading-svg-view-box="-10, -10, 50, 50"
    style="width: 100%; height: 100%"
    class="ag-theme-balham"
    :columnDefs="columnDefs"
    :rowData="getAgGridType2Data.data"
    :defaultColDef="defaultColDef"
    @grid-ready="onGridReady"
    animateRows="true"
    rowSelection="multiple"
    enableCellTextSelection="true"
    :suppressRowClickSelection="true"
    @cell-DoubleClicked="onCellDbClicked"
    :pagination="true"
  
    :localeText="ag_Text"
  >
  </ag-grid-vue>

  <!-- <el-dialog  v-model="openDialog" title="Shipping address"  :fullscreen="true" width="80%" :draggable="true"> -->
  <openDialog />
  <openGroup />
  <openAddDialog />
  <openSettingTimeDialog/>
  <!-- </el-dialog> 
  <-->
</template>

<style lang="scss" scoped>

</style>
