<script>
import { computed, onMounted } from "vue-demi";
import { useStore } from "vuex";
import { apiUseAddItemParams } from "../../api/index";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-enterprise";
export default {
  components: {
    AgGridVue,
  },
  setup() {
    const store = useStore();
    // const addItemParams = new apiUseAddItemParams();

    // const getTabType = computed(() => {
    //   return store.getters["addNewItem/getTabType"];
    // });
    // const fetchAddItemAxiosData = () => {
    //   addItemParams.initial();
    //   addItemParams.ACTION_TYPE = getTabType.value;
    //   addItemParams.PROMO_ID = getCurrnetPromoID.value;
    //   addItemParams.LINE_ID = getCruuentLineID.value
    //   store.dispatch("addNewItem/fetchAddItemAxiosData", addItemParams);
    // };
    const getAddItemAxiosData = computed(() => {
      return store.getters["addNewItem/getAddItemAxiosData"];
    });

    // onMounted(() => {
    //   fetchAddItemAxiosData();
    // });

    //取得載入的狀態
    const loading = computed(() => {
      return store.getters["addNewItem/getIsLoading"];
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
    return {
      //   getRowNodeId,
      //   onCellDbClicked,
      isFirstColumn,
      getAddItemAxiosData,
      loading,
      svg,
      rowClassRules: {
       noMOM: function (params) {
             return params.data.NO_OMO==1
        },
      },
      columnDefs: [
        {
          headerName: "貨號",
          field: "ITEM_ID",
          sortable: true,
          filter: "agTextColumnFilter",
          width: "110px",
          checkboxSelection: isFirstColumn, //   在欄位設定 true 是 針對那一行增加 checkbox
        },
        {
          headerName: "條碼",
          field: "BARCODE",
          sortable: true,
          filter: "agTextColumnFilter",
          width: "125px",
        },
        {
          headerName: "品項",
          field: "ITEM_NAME",
          sortable: true,
          filter: "agTextColumnFilter",
          width: "280px",
        },
        {
          headerName: "品項說明 ",
          field: "MEMO",
          sortable: true,
          filter: "agTextColumnFilter",
          width: "363.8px",
        },
      ],

      defaultColDef: {
        resizable: true,
        floatingFilter: true,
        headerCheckboxSelection: isFirstColumn,
        headerCheckboxSelectionFilteredOnly: true,
      },
      onGridReady(params) {
        //設定全域變數，某些事件會使用
        window.addgridApi = params.api; //設定全域變數
        window.addgridColumnApi = params.columnApi; //設定全域變數
        window.addgridApi.selectionService.selectIndex("0");
      }
    };
  },
};
</script>

<template>
  <div class="dAgGridBox">
    <ag-grid-vue
      v-loading="loading"
      element-loading-text="Loading..."
      :element-loading-spinner="svg"
      element-loading-svg-view-box="-10, -10, 50, 50"
      style="width: 100%; height: 100%"
      class="ag-theme-balham"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :rowData="getAddItemAxiosData.data"
      @grid-ready="onGridReady"
      animateRows="true"
      enableCellTextSelection="true"
      rowSelection="multiple"
      :suppressRowClickSelection="true"
      :rowClassRules="rowClassRules"
    >
    </ag-grid-vue>
  </div>
</template>

<style lang="scss" scoped>
.dAgGridBox {
  height: 100%;
  padding: 10px;
}


</style>
