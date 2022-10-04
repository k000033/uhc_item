<script>
import {
  computed,
  onBeforeMount,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch,
} from "vue-demi";
import { useStore } from "vuex";
import { apiUseUhcItemParams } from "../../api/index";
import { ElMessage } from "element-plus";
import { apiToDecimal } from "../../componentAPI/index";
import zhTw from "element-plus/lib/locale/lang/zh-tw";
import btn from "./Btn.vue";
export default {
  components: {
    btn,
    ElMessage,
  },
  setup() {
    const store = useStore();
    const ucItemParams = new apiUseUhcItemParams();

    const isEdit = ref(true);
    // 是否編擊中
    const isEditing = ref(true);
    const isReadOnly = ref(true);
    const isSave = ref(false);
    // const getPage = computed(()=>{
    //    const page = store.getters["getCurrentPage"];
    //    isEditing.value = page!='20'?true:false;
    //    return  store.getters["getCurrentPage"];
    // });

    onMounted(() => {
      const page = store.getters["getCurrentPage"];
      isEditing.value = page != "20" ? true : false;
      isEditing.value = page != "50" ? true : false;

      if (page == "40" || page == "50") {
        isReadOnly.value = true;
      } else {
        isReadOnly.value = false;
      }
    });

     const isOpen = ref(false);
    // 取得背後AgGrid 資料
    const getAgGridData = computed(() => {
      return store.getters["detailDialog/getAgGridData"];
    });
    // 取得目前類別名稱
    const getLineName = computed(() => {
      return store.getters["getCurrentLineName"];
    });
    // 下拉選單
    // 取得銷收活動別的下拉選單的資料
    const getActivityNameArray = computed(() => {
      return store.getters["detailDialog/getActivityNameArray"];
    });
    // 取得提貨別下拉選單的資料
    const getTakeTypeArray = computed(() => {
      return store.getters["detailDialog/getTakeTypeArray"];
    });
    // 取得銷售店群下拉選單的資料
    const getSaleAttributeArray = computed(() => {
      return store.getters["detailDialog/getSaleAttributeArray"];
    });
    // 取得提貨店群下拉選單的資料
    const getTakeAttributeArray = computed(() => {
      return store.getters["detailDialog/getTakeAttributeArray"];
    });
    // 取得 秤重/定額
    const getPriceTypeArray = computed(() => {
      return store.getters["detailDialog/getPriceTypeArray"];
    });

    //乾貨毛利
    const computed_Gross = computed(() => {
      const result =
        ((parseFloat(paramObject.PRICE) -
          parseFloat(paramObject.COST) +
          parseFloat(paramObject.DISCOUNT)) /
          parseFloat(paramObject.PRICE)) *
        100;
      console.log(result);
      return apiToDecimal(result);
    });

    const computed_Add_Gross = computed(() => {
      const result =
        ((parseFloat(paramObject.PRICE) -
          parseFloat(paramObject.COST) +
          parseFloat(paramObject.DISCOUNT) +
          parseFloat(paramObject.ADD_PRICE)) /
          parseFloat(paramObject.PRICE)) *
        100;
      console.log(result);
      return apiToDecimal(result);
    });

    const computed_freshGross = computed(() => {
      const result =
        ((parseFloat(paramObject.PRICE) - parseFloat(paramObject.COST)) /
          parseFloat(paramObject.PRICE)) *
        100;
      return apiToDecimal(result);
    });

    // 取得單品名細資料
    const getDetailData = computed(() => {
      const data = store.getters["detailDialog/getDetailData"].data;
      // if (
      //   getSaleAttributeArray.value.length == 0 ||
      //   getTakeAttributeArray.value.length == 0 ||
      //   getTakeTypeArray.value.length == 0 ||
      //   getActivityNameArray.value.lenth == 0
      // ) {
      //   return;
      // }

      // 如果有取得資料，將資料帶入參數裡
      if (data) {
        paramObject.SALE_B_DATE = data[0].SALE_B_DATE;
        paramObject.SALE_E_DATE = data[0].SALE_E_DATE;
        paramObject.ITEM_NAME = data[0].ITEM_NAME;
        paramObject.SALE_LT = data[0].SALE_LT;
        paramObject.SALE_STOCK = data[0].SALE_STOCK;
        paramObject.SALE_QTY = data[0].SALE_QTY;
        paramObject.TAKE_B_DAY = data[0].TAKE_B_DAY;
        paramObject.TAKE_E_DAY = data[0].TAKE_E_DAY;
        paramObject.TAKE_QTY = data[0].TAKE_QTY;
        paramObject.MEMO = data[0].MEMO;
        paramObject.MAIL = data[0].MAIL;
        paramObject.STOCK_QTY = data[0].STOCK_QTY;
        paramObject.UNIT_QTY = data[0].UNIT_QTY;
        paramObject.UNIT_WEIGHT = data[0].UNIT_WEIGHT;
        paramObject.COST = apiToDecimal(data[0].COST);
        paramObject.DISCOUNT = data[0].DISCOUNT;
        paramObject.PRICE = data[0].PRICE;
        paramObject.ADD_PRICE = data[0].ADD_PRICE;
        paramObject.ADD_TYPE = data[0].ADD_TYPE;
        paramObject.ADD_MEMO = data[0].ADD_MEMO;
        paramObject.USE_BONUS = data[0].USE_BONUS;
        paramObject.SALE_ATTRIBUTE_ID = data[0].SALE_ATTRIBUTE_ID;
        // paramObject.SALE_ATTRIBUTE_ID_TEXT =
        //   getSaleAttributeArray.value.data.filter(
        //     (item) => item.CODE == data[0].SALE_ATTRIBUTE_ID
        //   )[0].CAPTION;
        paramObject.TAKE_ATTRIBUTE_ID = data[0].TAKE_ATTRIBUTE_ID;
        // paramObject.TAKE_ATTRIBUTE_ID_TEXT =
        //   getTakeAttributeArray.value.data.filter(
        //     (item) => item.CODE == data[0].TAKE_ATTRIBUTE_ID
        //   )[0].CAPTION;
        paramObject.PRICE_TYPE = data[0].PRICE_TYPE;
        // paramObject.PRICE_TYPE_TEXT = getPriceTypeArray.value.data.filter(
        //   (item) => item.CODE == data[0].PRICE_TYPE
        // )[0].CAPTION;
        paramObject.TAKE_TYPE = data[0].TAKE_TYPE;
        // paramObject.TAKE_TYPE_TEXT = getTakeTypeArray.value.data.filter(
        //   (item) => item.CODE == data[0].TAKE_TYPE
        // )[0].CAPTION;
        paramObject.TAKE_B_DATE = data[0].TAKE_B_DATE;
        paramObject.TAKE_E_DATE = data[0].TAKE_E_DATE;
        paramObject.ACTIVITY_TYPE = data[0].ACTIVITY_TYPE;
        // paramObject.ACTIVITY_TYPE_TEXT = getActivityNameArray.value.data.filter(
        //   (item) => item.CODE == data[0].ACTIVITY_TYPE
        // )[0].CAPTION;
        paramObject.UNIT_QTY_TYPE = data[0].UNIT_QTY_TYPE;
        paramObject.UNIT_WEIGHT_TYPE = data[0].UNIT_WEIGHT_TYPE;
        paramObject.DELIVERY_TEMP = data[0].DELIVERY_TEMP;
        paramObject.TAX_TYPE = data[0].TAX_TYPE;
        paramObject.ORIGINAL_PRICE = data[0].ORIGINAL_PRICE;
        paramObject.SNO = data[0].SNO;
        paramObject.PRICE_UPDATE = data[0].PRICE_UPDATE;
      }
      return store.getters["detailDialog/getDetailData"];
    });

    const currDoc_id = ref("");

    // // 更改編輯的狀態
    // const btnEdit = () => {
    //   isEdit.value = true;
    // };
    // // 當取消編擊時，將編擊欄位的值回復到原本的值
    // const btnCancel = () => {
    //   isEdit.value = false;
    //   paramObject.SALE_B_DATE = getDetailData.value.data[0].SALE_B_DATE;
    //   paramObject.SALE_E_DATE = getDetailData.value.data[0].SALE_E_DATE;
    //   paramObject.ITEM_NAME = getDetailData.value.data[0].ITEM_NAME;
    //   paramObject.SALE_LT = getDetailData.value.data[0].SALE_LT;
    //   paramObject.SALE_STOCK = getDetailData.value.data[0].SALE_STOCK;
    //   paramObject.SALE_QTY = getDetailData.value.data[0].SALE_QTY;
    //   paramObject.TAKE_B_DAY = getDetailData.value.data[0].TAKE_B_DAY;
    //   paramObject.TAKE_E_DAY = getDetailData.value.data[0].TAKE_E_DAY;
    //   paramObject.TAKE_QTY = getDetailData.value.data[0].TAKE_QTY;
    //   paramObject.MEMO = getDetailData.value.data[0].MEMO;
    //   paramObject.MAIL = getDetailData.value.data[0].MAIL;
    //   paramObject.STOCK_QTY = getDetailData.value.data[0].STOCK_QTY;
    //   paramObject.UNIT_QTY = getDetailData.value.data[0].UNIT_QTY;
    //   paramObject.UNIT_WEIGHT = getDetailData.value.data[0].UNIT_WEIGHT;
    //   paramObject.COST = apiToDecimal(getDetailData.value.data[0].COST);
    //   paramObject.DISCOUNT = getDetailData.value.data[0].DISCOUNT;
    //   paramObject.PRICE = apiToDecimal(getDetailData.value.data[0].PRICE);
    //   paramObject.ADD_PRICE = getDetailData.value.data[0].ADD_PRICE;
    //   paramObject.ADD_TYPE = getDetailData.value.data[0].ADD_TYPE;
    //   paramObject.ADD_MEMO = getDetailData.value.data[0].ADD_MEMO;
    //   paramObject.USE_BONUS = getDetailData.value.data[0].USE_BONUS;
    //   paramObject.ACTIVITY_TYPE = getDetailData.value.data[0].ACTIVITY_TYPE;
    //   paramObject.SALE_ATTRIBUTE_ID = getDetailData[0].SALE_ATTRIBUTE_ID;
    //   paramObject.TAKE_ATTRIBUTE_ID = getDetailData[0].TAKE_ATTRIBUTE_ID;
    //   paramObject.PRICE_TYPE = getDetailData[0].PRICE_TYPE;
    //   paramObject.TAKE_TYPE = getDetailData[0].TAKE_TYPE;
    //   paramObject.TAKE_B_DATE = getDetailData[0].TAKE_B_DATE;
    //   paramObject.TAKE_E_DATE = getDetailData[0].TAKE_E_DATE;
    //   paramObject.UNIT_QTY_TYPE = getDetailData[0].UNIT_QTY_TYPE;
    //   paramObject.UNIT_WEIGHT_TYPE = getDetailData[0].UNIT_WEIGHT_TYPE;
    //   paramObject.DELIVERY_TEMP = getDetailData[0].DELIVERY_TEMP;
    //   paramObject.TAX_TYPE = getDetailData[0].TAX_TYPE;
    //   paramObject.ORIGINAL_PRICE = getDetailData[0].ORIGINAL_PRICE;
    //   paramObject.SNO = getDetailData[0].SNO;
    // };

    // 預設匯入Excel餐數
    const paramObject = reactive({
      ACTIVITY_TYPE: "",
      // ACTIVITY_TYPE_TEXT: "",
      ITEM_NAME: "",
      SALE_B_DATE: "",
      SALE_E_DATE: "",
      SALE_LT: "",
      SALE_STOCK: "",
      SALE_QTY: "",
      TAKE_B_DAY: "",
      TAKE_E_DAY: "",
      TAKE_QTY: "",
      MEMO: "",
      MAIL: "",
      STOCK_QTY: "",
      UNIT_QTY: "",
      UNIT_WEIGHT: "",
      COST: "",
      DISCOUNT: "",
      PRICE: "",
      ADD_PRICE: "",
      ADD_TYPE: "",
      ADD_MEMO: "",
      USE_BONUS: "",
      SALE_ATTRIBUTE_ID: "",
      // SALE_ATTRIBUTE_ID_TEXT: "",
      TAKE_ATTRIBUTE_ID: "",
      // TAKE_ATTRIBUTE_ID_TEXT: "",
      PRICE_TYPE: "",
      // PRICE_TYPE_TEXT: "",
      TAKE_TYPE: "",
      // TAKE_TYPE_TEXT: "",
      TAKE_B_DATE: "",
      TAKE_E_DATE: "",
      UNIT_QTY_TYPE: "",
      UNIT_WEIGHT_TYPE: "",
      DELIVERY_TEMP: "",
      TAX_TYPE: "",
      ORIGINAL_PRICE: "",
      SNO: "",
      PRICE_UPDATE: "",
    });

    onMounted(() => {
      // isEdit.value = false;
      isOpen.value = true;
      // paramObject.ACTIVITY_TYPE = getAgGridData.value.ACTIVITY_TYPE;
    });
    onUnmounted(() => {
      isOpen.value = false;
      // isEdit.value = false;
    });
    // 存檔
    const btnSave = () => {
      //  console.log(paramObject);
      let keys = Object.keys(paramObject);
      let paramsString = "";
      keys.forEach((item) => {
        // if(item=="ACTIVITY_TYPE"&&paramObject[item]!=getAgGridData.value.ACTIVITY_TYPE)
        // {
        //   paramsString += `${item}=${paramObject[item] || ""}^`;
        // };

        if (getDetailData.value.data[0][item] != paramObject[item]) {
          paramsString += `${item}=${paramObject[item] || ""}^`;
        }
      });
      paramsString = paramsString.substring(0, paramsString.length - 1);
      console.log(paramsString);
      ucItemParams.initial();
      ucItemParams.DOC_ID = getAgGridData.value.DOC_ID;
      ucItemParams.UPDATE = paramsString;
      if (paramsString == "") {
        return;
      }
      store
        .dispatch("detailDialog/saveDetailData", ucItemParams)
        .then((res) => {
          // alert(res.data);
          if (res.data[0].RTN_CODE == 0) {
            success(res.data[0].RTN_MSG);
            ucItemParams.initial();
            ucItemParams.DOC_ID = getAgGridData.value.DOC_ID;
            ucItemParams.DETAIL_PAGE = 1;
            store.dispatch("detailDialog/fetchDetailData", ucItemParams);
          } else {
            error(res.data[0].RTN_MSG);
          }
        });
    };

    // 成功訊息
    const success = (msg) => {
      ElMessage({
        message: msg,
        type: "success",
        duration: 800,
      });
    };

    // 錯誤訊息
    const error = (msg) => {
      ElMessage({
        message: msg,
        type: "error",
        duration: 800,
      });
    };

    const get_doc_Id_Array = computed(() => {
      return store.getters["get_doc_Id_Array"];
    });
    const getAgGridDataList = computed(() => {
      return store.getters["getAgGridType2Data"];
    });

    // // 上一筆
    // const btnPrevious = () => {
    //   const doc_id = getAgGridData.value.DOC_ID;
    //   var idx = get_doc_Id_Array.value.indexOf(doc_id);
    //   if (idx == 0) {
    //     error("已經是第一筆資料");
    //   }
    //   const preDoc_id = get_doc_Id_Array.value[idx - 1];
    //   store.commit("setCurrDoc_id", preDoc_id);
    //   getAgGridDataList.value.data.forEach((item) => {
    //     if (item.DOC_ID == preDoc_id) {
    //       store.commit("detailDialog/setAgGridData", item);
    //       ucItemParams.initial();
    //       ucItemParams.DOC_ID = preDoc_id;
    //       ucItemParams.DETAIL_PAGE = 1;
    //       store.dispatch("detailDialog/fetchDetailData", ucItemParams);
    //     }
    //   });
    // };

    // // 下一筆
    // const btnNext = () => {
    //   const doc_id = getAgGridData.value.DOC_ID;
    //   var idx = get_doc_Id_Array.value.indexOf(doc_id);
    //   if (idx == get_doc_Id_Array.value.length - 1) {
    //     error("已經是最後一筆資料");
    //   }
    //   const nextDoc_id = get_doc_Id_Array.value[idx + 1];
    //   store.commit("setCurrDoc_id", nextDoc_id);
    //   getAgGridDataList.value.data.forEach((item) => {
    //     if (item.DOC_ID == nextDoc_id) {
    //       store.commit("detailDialog/setAgGridData", item);
    //       ucItemParams.initial();
    //       ucItemParams.DOC_ID = nextDoc_id;
    //       ucItemParams.DETAIL_PAGE = 1;
    //       store.dispatch("detailDialog/fetchDetailData", ucItemParams);
    //     }
    //   });
    // };


    const btnCancel = () => {
      ucItemParams.initial();
      ucItemParams.DOC_ID = getAgGridData.value.DOC_ID;
      ucItemParams.DETAIL_PAGE = 1;
      store.dispatch("detailDialog/fetchDetailData", ucItemParams);
    };

    const iptChange = (val, column) => {
      // let keys = Object.keys(paramObject);
      // isSave.value =false;
      // keys.forEach((item) => {
      //   if (getDetailData.value.data[0][item] != paramObject[item]) {
      //        isSave.value =true;
      //        return ;
      //   };
      // });
      // console.log(isSave.value);
      // let edited = document.getElementsByClassName('editIng').length;
      // if(edited>0){
      //   isSave.value = true;
      // }else{
      // };
    };

    return {
     
      getDetailData,
      // getIsOpen,
      getAgGridData,
      getLineName,
      isEdit,
      // openDetailDialog,
      // btnEdit,
      btnCancel,
      paramObject,
      //下拉選單
      getActivityNameArray,
      getSaleAttributeArray,
      getTakeTypeArray,
      getTakeAttributeArray,
      getPriceTypeArray,
      btnSave,
      isReadOnly,
    isOpen,
      apiToDecimal,
      computed_Gross,
      computed_Add_Gross,
      computed_freshGross,
      zhTw,
      isEditing,
      iptChange,
    };
  },
};
</script>

<template>
  <!-- <el-dialog
    v-model="getIsOpen"
    title="Shipping address"
    :fullscreen="true"
    width="1030px"
    :draggable="true"
    @open="openDetailDialog"
    @close="closeDetailDialog"
  > -->
  <div>
    <div class="box">
      <!-- <el-button :disabled="isEdit" type="primary" size="small" @click="btnEdit"
        >修改</el-button
      > -->
      <!-- <el-button
        :disabled="!isEdit"
        type="primary"
        size="small"
        @click="btnSave"
        >存檔</el-button
      > -->
      <!-- <button class="btnStyle" @click="btnPrevious">
        <el-icon><caret-left /></el-icon>上一筆
      </button>
      <button class="btnStyle" @click="btnNext">
        <el-icon><caret-right /></el-icon>下一筆
      </button> -->
      <btn />
      <button class="btnStyle" @click="btnSave">
        <el-icon><edit /></el-icon>存檔
      </button>

      <button class="btnStyle" @click="btnCancel">
        <el-icon><Refresh /></el-icon>恢復
      </button>
    </div>
    <el-scrollbar class="test" height="360">
      <div class="dDetailContent" v-if="getDetailData.data">
        <table>
          <tr>
            <td class="width10P colName"><span>活動檔期</span></td>
            <td class="width30P tdValue" colspan="3">
              {{ getAgGridData.PROMO_NAME }}
            </td>

            <!-- 銷售活動別 -->
            <td class="width10P colName"><span>銷售活動別</span></td>
            <!-- <td class="width10P tdValue" v-show="!isEditing">
              {{ paramObject.ACTIVITY_TYPE_TEXT }}
            </td> -->
            <td class="width10P tdEdit elSelect">
              <el-select
                v-model="paramObject.ACTIVITY_TYPE"
                class="m-2"
                placeholder="Select"
                size="small"
                :class="{
                  editIng: !(
                    getDetailData.data[0].ACTIVITY_TYPE ==
                    paramObject.ACTIVITY_TYPE
                  ),
                }"
                :disabled="isReadOnly"
                @change="iptChange(paramObject.ACTIVITY_TYPE, 'ACTIVITY_TYPE')"
              >
                <el-option
                  v-for="item in getActivityNameArray.data"
                  :key="item.CODE"
                  :label="item.CAPTION"
                  :value="item.CODE"
                />
              </el-select>
            </td>

            <td class="width10P colName"><span>活動主題</span></td>
            <td class="width30P tdValue" colspan="3">
              {{ getAgGridData.SUBJECT }}
            </td>
          </tr>
          <tr>
            <td class="width10P colName"><span>貨號</span></td>
            <td class="width10P tdValue">{{ getAgGridData.PLU }}</td>
            <td class="width10P colName"><span>條碼</span></td>
            <td class="width10P tdValue">{{ getAgGridData.BARCODE }}</td>
            <td class="width10P colName"><span>大類碼</span></td>
            <td class="width10P tdValue">{{ getLineName }}</td>
            <td class="width10P colName"><span>稅別</span></td>
            <td class="width10P tdValue">{{ getAgGridData.TAX_TYPE }}</td>
            <td class="width10P colName"><span>箱入數</span></td>
            <td class="width10P tdValue">
              {{ getDetailData.data[0].BOX_QTY }}
            </td>
          </tr>
          <tr>
            <td class="width10P colName"><span>品名規格</span></td>
            <td class="width30P tdValue" colspan="3">
              {{ getAgGridData.ITEM_NAME }}
            </td>
            <td class="width10P colName"><span>供應商</span></td>
            <td class="width10P tdValue">{{ getAgGridData.VENDOR_NAME }}</td>
            <td class="width10P colName"><span>產品別</span></td>
            <td class="width10P tdValue">{{ getAgGridData.OMO_TYPE_NAME }}</td>
            <td class="width10P colName"><span>配送溫層</span></td>
            <td class="width10P tdValue">{{ getAgGridData.DELIVERY_TEMP }}</td>
          </tr>
          <!-- </table>
   <table> -->
          <tr>
            <td colspan="10" class="tdTopic"><span> ● 銷售條件設定</span></td>
          </tr>
          <tr>
            <td class="width10P colName"><span>銷售碼</span></td>
            <td class="width10P tdValue">{{ getAgGridData.BARCODE }}</td>

            <!-- 活動品名 -->
            <td class="width10P colName"><span>活動品名</span></td>
            <!-- <td colspan="3" class="width30P tdValue" v-show="!isEditing">
              {{ paramObject.ITEM_NAME }}
            </td> -->
            <td colspan="3" class="width30P tdEdit elInput">
              <el-input
                v-model="paramObject.ITEM_NAME"
                size="small"
                :class="{
                  editIng: !(
                   `${getDetailData.data[0].ITEM_NAME}` === `${paramObject.ITEM_NAME}`
                  ),
                }"
                :readonly="isReadOnly"
                @change="iptChange(paramObject.ITEM_NAME, 'ITEM_NAME')"
              />
            </td>

            <!-- 銷售店群 -->
            <td class="width10P colName"><span>銷售店群</span></td>
            <!-- <td colspan="1" class="width30P tdValue" v-show="!isEditing">
              {{ paramObject.SALE_ATTRIBUTE_ID_TEXT }}
            </td> -->
            <td colspan="1" class="width10P tdEdit elSelect">
              <el-select
                v-model="paramObject.SALE_ATTRIBUTE_ID"
                class="m-2 slt100P"
                placeholder="Select"
                size="small"
                :class="{
                  editIng: !(
                    getDetailData.data[0].SALE_ATTRIBUTE_ID ==
                    paramObject.SALE_ATTRIBUTE_ID
                  ),
                }"
                :disabled="isReadOnly"
                @change="
                  iptChange(paramObject.SALE_ATTRIBUTE_ID, 'SALE_ATTRIBUTE_ID')
                "
              >
                <el-option
                  v-for="item in getSaleAttributeArray.data"
                  :key="item.CODE"
                  :label="item.CAPTION"
                  :value="item.CODE"
                />
              </el-select>
            </td>
            <td class="width7P colName"><span>建議售價</span></td>
            <!-- <td class="width7P tdEdit" v-show="!isEditing">
              {{ paramObject.ORIGINAL_PRICE }}
            </td> -->
            <td class="width7P tdEdit elInput">
              <el-input
                v-model="paramObject.ORIGINAL_PRICE"
                size="small"
                :class="{
                  editIng: !(
                     `${getDetailData.data[0].ORIGINAL_PRICE}` === `${paramObject.ORIGINAL_PRICE}`
                  ),
                }"
                :readonly="isReadOnly"
                @change="
                  iptChange(paramObject.ORIGINAL_PRICE, 'ORIGINAL_PRICE')
                "
              />
            </td>
          </tr>
          <tr>
            <!-- 銷售日期(起) -->
            <td class="width10P colName"><span>銷售日期(起)</span></td>
            <!-- <td class="width10P tdValue" v-show="!isEditing">
              {{ paramObject.SALE_B_DATE }}
            </td> -->
            <td class="width10P tdEdit elInput">
              <div>
                <el-config-provider :locale="zhTw">
                  <el-date-picker
                    v-if="isOpen"
                    v-model="paramObject.SALE_B_DATE"
                    type="date"
                    format="YYYY/MM/DD"
                    value-format="YYYY-MM-DD"
                    size="small"
                    :class="{
                      editIng: !(
                         `${getDetailData.data[0].SALE_B_DATE}` === `${paramObject.SALE_B_DATE}`
                      ),
                    }"
                    :readonly="isReadOnly"
                    @change="iptChange(paramObject.SALE_B_DATE, 'SALE_B_DATE')"
                  />
                </el-config-provider>
              </div>
            </td>

            <!-- 銷售日期(迄) -->
            <td class="width10P colName"><span>銷售日期(迄)</span></td>
            <!-- <td class="width10P tdValue" v-show="!isEditing">
              {{ paramObject.SALE_E_DATE }}
            </td> -->
            <td class="width10P tdEdit elInput">
              <div>
                <el-date-picker
                   v-if="isOpen"
                  v-model="paramObject.SALE_E_DATE"
                  type="date"
                  format="YYYY/MM/DD"
                  value-format="YYYY-MM-DD"
                  size="small"
                  :class="{
                    editIng: !(
                     `${getDetailData.data[0].SALE_E_DATE}` === `${paramObject.SALE_E_DATE}`
                    ),
                  }"
                  :readonly="isReadOnly"
                  @change="iptChange(paramObject.SALE_E_DATE, 'SALE_E_DATE')"
                />
              </div>
            </td>

            <!-- 銷售前置日期 -->
            <td class="width10P colName"><span>銷售前置天數</span></td>
            <!-- <td class="width10P tdValue" v-show="!isEditing">
              {{ paramObject.SALE_LT }}
            </td> -->
            <td class="width10P tdEdit elInput">
              <el-input
                v-model="paramObject.SALE_LT"
                size="small"
                :class="{
                  editIng: !(
                    `${getDetailData.data[0].SALE_LT}` ==
                    `${paramObject.SALE_LT}`
                  ),
                }"
                :readonly="isReadOnly"
                @change="iptChange(paramObject.SALE_LT, 'SALE_LT')"
              />
            </td>

            <!-- 限量數量 -->
            <td class="width10P colName"><span>限量數量</span></td>
            <!-- <td class="width10P tdValue" v-show="!isEditing">
              {{ paramObject.SALE_STOCK }}
            </td> -->
            <td class="width10P tdEdit elInput">
              <el-input
                v-model="paramObject.SALE_STOCK"
                size="small"
                :class="{
                  editIng: !(
                    `${getDetailData.data[0].SALE_STOCK}` ==
                    `${paramObject.SALE_STOCK}`
                  ),
                }"
                :readonly="isReadOnly"
                @change="iptChange"
              />
            </td>

            <!-- 成立組數 -->
            <td class="width10P colName"><span>成立組數</span></td>
            <!-- <td class="width10P tdValue" v-show="!isEditing">
              {{ paramObject.SALE_QTY }}
            </td> -->
            <td class="width10P tdEdit elInput">
              <el-input
                v-model="paramObject.SALE_QTY"
                size="small"
                :class="{
                  editIng: !(
                    `${getDetailData.data[0].SALE_QTY}` ==
                    `${paramObject.SALE_QTY}`
                  ),
                }"
                :readonly="isReadOnly"
                @change="iptChange(paramObject.SALE_QTY, 'SALE_QTY')"
              />
            </td>
          </tr>
          <!-- </table>
   <table> -->
          <tr>
            <td colspan="10" class="tdTopic"><span> ● 提貨條件設定</span></td>
          </tr>
          <tr>
            <!-- 可提貨天數 -->
            <td class="width10P colName"><span>可提貨天數</span></td>
            <!-- <td class="width10P tdValue" v-show="!isEditing">
              {{ paramObject.TAKE_B_DAY }}
            </td> -->
            <td class="width10P tdEdit elInput">
              <el-input
                v-model="paramObject.TAKE_B_DAY"
                size="small"
                :class="{
                  editIng: !(
                    `${getDetailData.data[0].TAKE_B_DAY}` ==
                    `${paramObject.TAKE_B_DAY}`
                  ),
                }"
                :readonly="isReadOnly"
                @change="iptChange(paramObject.TAKE_B_DAY, 'TAKE_B_DAY')"
              />
            </td>

            <!-- 提貨期限天數 -->
            <td class="width10P colName"><span>提貨期限天數</span></td>
            <!-- <td class="width10P tdValue" v-show="!isEditing">
              {{ paramObject.TAKE_E_DAY }}
            </td> -->
            <td class="width10P tdEdit elInput">
              <el-input
                v-model="paramObject.TAKE_E_DAY"
                size="small"
                :class="{
                  editIng: !(
                    `${getDetailData.data[0].TAKE_E_DAY}` ==
                    `${paramObject.TAKE_E_DAY}`
                  ),
                }"
                :readonly="isReadOnly"
                @change="iptChange(paramObject.TAKE_E_DAY, 'TAKE_E_DAY')"
              />
            </td>

            <td class="width10P colName"><span>提貨別</span></td>
            <!-- <td class="width10P tdValue" v-show="!isEditing">
              {{ paramObject.TAKE_TYPE_TEXT }}
            </td> -->
            <td class="width10P tdEdit elSelect">
              <el-select
                v-model="paramObject.TAKE_TYPE"
                class="m-2"
                placeholder="Select"
                size="small"
                :class="{
                  editIng: !(
                    getDetailData.data[0].TAKE_TYPE == paramObject.TAKE_TYPE
                  ),
                }"
                :disabled="isReadOnly"
                @change="iptChange(paramObject.TAKE_TYPE, 'TAKE_TYPE')"
              >
                <el-option
                  v-for="item in getTakeTypeArray.data"
                  :key="item.CODE"
                  :label="item.CAPTION"
                  :value="item.CODE"
                />
              </el-select>
            </td>

            <!-- <td class="width10P colName"><span>提貨店群</span></td> -->
            <!-- <td class="width10P tdValue" v-show="!isEdit">
              {{ getDetailData.data[0].TAKE_ATTRIBUTE_ID }}
            </td> -->
            <!-- <td class="width10P tdEdit">
              <el-select
                v-model="paramObject.TAKE_ATTRIBUTE_ID"
                class="m-2"
                placeholder="Select"
                size="small"
                :class="{ editIng: isEdit }"
                :disabled="isReadOnly"
              >
                <el-option
                  v-for="item in getTakeAttributeArray.data"
                  :key="item.CODE"
                  :label="item.CAPTION"
                  :value="item.CODE"
                />
              </el-select>
            </td> -->
            <td class="width10P colName"><span></span></td>
            <td class="width10P colName"><span></span></td>
            <td class="width10P colName"><span></span></td>
            <td class="width10P colName"></td>
          </tr>
          <tr>
            <!-- 提貨日期(起) -->
            <td class="width10P colName"><span>提貨日期(起)</span></td>
            <!-- <td class="width10P tdValue" v-show="!isEditing">
              {{ paramObject.TAKE_B_DATE }}
            </td> -->
            <td class="width10P tdEdit elInput">
              <div>
                <el-date-picker
                   v-if="isOpen"
                  v-model="paramObject.TAKE_B_DATE"
                  type="date"
                  format="YYYY/MM/DD"
                  value-format="YYYY-MM-DD"
                  size="small"
                  :class="{
                    editIng: !(
                        `${getDetailData.data[0].TAKE_B_DATE}` ==
                    `${paramObject.TAKE_B_DATE}`
                    ),
                  }"
                  :readonly="isReadOnly"
                  @change="iptChange(paramObject.TAKE_B_DATE, 'TAKE_B_DATE')"
                />
              </div>
            </td>
            <!-- 提貨日期(迄) -->
            <td class="width10P colName"><span>提貨日期(迄)</span></td>
            <!-- <td class="width10P tdValue" v-show="!isEditing">
              {{ paramObject.TAKE_E_DATE }}
            </td> -->
            <td class="width10P tdEdit elInput">
              <div>
                <el-date-picker
                v-if="isOpen"
                  v-model="paramObject.TAKE_E_DATE"
                  type="date"
                  format="YYYY/MM/DD"
                  value-format="YYYY-MM-DD"
                  size="small"
                  :class="{
                    editIng: !(
                       `${getDetailData.data[0].TAKE_E_DATE}` ==
                    `${paramObject.TAKE_E_DATE}`
                    ),
                  }"
                  :readonly="isReadOnly"
                  @change="iptChange(paramObject.TAKE_E_DATE, 'TAKE_E_DATE')"
                />
              </div>
            </td>

            <!-- 提貨次數 -->
            <!-- <td class="width10P colName"><span>提貨次數</span></td> -->
            <!-- <td colspan="1" class="width10P tdValue" v-show="!isEdit">
              {{ getDetailData.data[0].TAKE_QTY }}
            </td> -->
            <!-- <td colspan="1" class="width10P tdEdit">
              <el-input
                v-model="paramObject.TAKE_QTY"
                size="small"
                placeholder="Please input"
                :class="{ editIng: isEdit }"
                :readonly="isReadOnly"
              />
            </td> -->
            <td class="width10P colName"><span>提貨店群</span></td>
            <!-- <td class="width10P tdValue" v-show="!isEditing">
              {{ paramObject.TAKE_ATTRIBUTE_ID_TEXT }}
            </td> -->
            <td class="width10P tdEdit elSelect">
              <el-select
                v-model="paramObject.TAKE_ATTRIBUTE_ID"
                class="m-2"
                placeholder="Select"
                size="small"
                :class="{
                  editIng: !(
                    getDetailData.data[0].TAKE_ATTRIBUTE_ID ==
                    paramObject.TAKE_ATTRIBUTE_ID
                  ),
                }"
                :disabled="isReadOnly"
                @change="
                  iptChange(paramObject.TAKE_ATTRIBUTE_ID, 'TAKE_ATTRIBUTE_ID')
                "
              >
                <el-option
                  v-for="item in getTakeAttributeArray.data"
                  :key="item.CODE"
                  :label="item.CAPTION"
                  :value="item.CODE"
                />
              </el-select>
            </td>
            <td class="width10P colName"><span></span></td>
            <td class="width10P colName"></td>
            <td class="width10P colName"><span></span></td>
            <td class="width10P colName"></td>
          </tr>
          <!-- </table>
   <table> -->
        </table>
        <div class="dTableGroup" v-show="getAgGridData.CP_TYPE == 1">
          <div class="dWidth60P">
            <table>
              <tr>
                <td colspan="10" class="tdTopic"><span> ● 價格設定</span></td>
              </tr>
              <tr>
                <td class="width7p colName"><span>價格設定</span></td>
                <td class="width7p colName"><span>原進</span></td>
                <td class="width7p colName"><span>原折讓</span></td>
                <td class="width7p colName"><span>原售價</span></td>
                <td class="width7p colName"><span>原毛利</span></td>
                <td class="width7p colName"><span>後補金額</span></td>
                <td class="width7p colName"><span>後補毛利</span></td>
                <td class="width7p colName"><span>後補別</span></td>
              </tr>
              <tr>
                <td class="width7p colName"><span>通賣</span></td>
                <td class="width7p"></td>
                <td class="width7p"></td>
                <td class="width7p"></td>
                <td class="width7p"></td>
                <td class="width7p"></td>
                <td class="width7p"></td>
                <td class="width7p"></td>
              </tr>
            </table>
          </div>
          <div class="dWidth40P">
            <table>
              <tr>
                <td colspan="10" class="tdTopic tdEmpty"><span></span></td>
              </tr>
              <tr>
                <td class="width7p colName"><span>定額/秤重</span></td>
                <td class="width7p colName txt_center" colspan="2">
                  <span>單位入數</span>
                </td>
                <td class="width7p colName txt_center" colspan="2">
                  <span>單位重量</span>
                </td>
              </tr>
              <tr>
                <!-- <td class="width7p tdValue" v-show="!isEditing">
                  {{ paramObject.PRICE_TYPE_TEXT }}
                </td> -->
                <td class="width10P tdEdit elSelect">
                  <el-select
                    v-model="paramObject.PRICE_TYPE"
                    class="m-2"
                    placeholder="Select"
                    size="small"
                    :class="{
                      editIng: !(
                        getDetailData.data[0].PRICE_TYPE ==
                        paramObject.PRICE_TYPE
                      ),
                    }"
                    :disabled="paramObject.PRICE_UPDATE == 0"
                    @change="
                      iptChange(paramObject.PRICE_UPDATE, 'PRICE_UPDATE')
                    "
                  >
                    <el-option
                      v-for="item in getPriceTypeArray"
                      :key="item.CODE"
                      :label="item.CAPTION"
                      :value="item.CODE"
                    />
                  </el-select>
                </td>
                <!-- 單位入數 -->
                <!-- <td class="width7p tdValue" v-show="!isEditing">
                  {{ paramObject.UNIT_QTY }}
                </td> -->
                <td class="width7p tdEdit elInput">
                  <el-input
                    v-model="paramObject.UNIT_QTY"
                    size="small"
                    :class="{
                      editIng: !(
                       `${getDetailData.data[0].UNIT_QTY}` === `${paramObject.UNIT_QTY}`
                      ),
                    }"
                    :readonly="paramObject.PRICE_UPDATE == 0"
                    @change="iptChange(paramObject.UNIT_QTY, 'UNIT_QTY')"
                  />
                </td>
                <td class="width7p txt_center">
                  {{ paramObject.UNIT_QTY_TYPE }}
                </td>

                <!-- 單位重量 -->
                <!-- <td class="width7p tdValue" v-show="!isEditing">
                  {{ paramObject.UNIT_WEIGHT }}
                </td> -->
                <td class="width7p tdEdit elInput">
                  <el-input
                    v-model="paramObject.UNIT_WEIGHT"
                    size="small"
                    :class="{
                      editIng: !(
                         `${getDetailData.data[0].UNIT_WEIGHT}` === `${paramObject.UNIT_WEIGHT}`
                      ),
                    }"
                    :readonly="paramObject.PRICE_UPDATE == 0"
                    @change="iptChange(paramObject.UNIT_WEIGHT, 'UNIT_WEIGHT')"
                  />
                </td>
                <td class="width7p txt_center">
                  {{ paramObject.UNIT_WEIGHT_TYPE }}
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div class="dTableGroup" v-show="getAgGridData.CP_TYPE == 1">
          <div class="dWidth60P">
            <table>
              <tr>
                <td class="width7p colName"><span>促銷話術</span></td>
                <td class="width7p colName"><span>促銷進價</span></td>
                <td class="width7p colName"><span>促銷折讓</span></td>
                <td class="width7p colName"><span>促銷售價</span></td>
                <td class="width7p colName"><span>促銷毛利</span></td>
                <td class="width7p colName"><span>後補金額</span></td>
                <td class="width7p colName"><span>補足毛利</span></td>
                <td class="width7p colName"><span>後補別</span></td>
              </tr>
              <tr>
                <td>{{ getDetailData.data[0].PROMO_TEXT }}</td>
                <!--促銷進價 -->
                <!-- <td v-show="!isEdit" class="tdValue">
                  {{ getDetailData.data[0].COST }}
                </td> -->
                <td class="width7p tdEdit elInput">
                  <el-input
                    v-model="paramObject.COST"
                    size="small"
                    :class="{
                      editIng: !(
                        getDetailData.data[0].COST == paramObject.COST
                      ),
                    }"
                    :readonly="paramObject.PRICE_UPDATE == 0"
                    @change="iptChange(paramObject.COST, 'COST')"
                  />
                </td>
                <!--促銷折讓 -->
                <!-- <td v-show="!isEdit" class="tdValue">
                  {{ getDetailData.data[0].DISCOUNT }}
                </td> -->
                <td class="width7p tdEdit elInput">
                  <el-input
                    v-model="paramObject.DISCOUNT"
                    size="small"
                    :class="{
                      editIng: !(
                        `${getDetailData.data[0].DISCOUNT}` ==
                        `${paramObject.DISCOUNT}`
                      ),
                    }"
                    :readonly="paramObject.PRICE_UPDATE == 0"
                    @change="iptChange(paramObject.DISCOUNT, 'DISCOUNT')"
                  />
                </td>
                <!--促銷售價 -->
                <!-- <td v-show="!isEdit" class="tdValue">
                  {{ getDetailData.data[0].PRICE }}
                </td> -->
                <td class="width7p tdEdit elInput">
                  <el-input
                    v-model="paramObject.PRICE"
                    size="small"
                    :class="{
                      editIng: !(
                        getDetailData.data[0].PRICE == paramObject.PRICE
                      ),
                    }"
                    :readonly="paramObject.PRICE_UPDATE == 0"
                    @change="iptChange(paramObject.PRICE, 'PRICE')"
                  />
                </td>
                <td class="tdValue">{{ computed_Gross + "%" }}</td>

                <!--後補金額 -->
                <!-- <td v-show="!isEdit" class="tdValue">
                  {{ getDetailData.data[0].ADD_PRICE }}
                </td> -->
                <td class="width7p tdEdit elInput">
                  <el-input
                    v-model="paramObject.ADD_PRICE"
                    size="small"
                    :class="{
                      editIng: !(
                        `${getDetailData.data[0].ADD_PRICE}` ==
                        `${paramObject.ADD_PRICE}`
                      ),
                    }"
                    :readonly="paramObject.PRICE_UPDATE == 0"
                    @change="iptChange(paramObject.ADD_PRICE, 'ADD_PRICE')"
                  />
                </td>

                <td class="tdValue">
                  {{ computed_Add_Gross + "%" }}
                </td>

                <!--後補別 -->
                <!-- <td v-show="!isEdit" class="tdValue">
                  {{ getDetailData.data[0].ADD_TYPE }}
                </td> -->
                <td class="width7p tdEdit elInput">
                  <el-input
                    v-model="paramObject.ADD_TYPE"
                    size="small"
                    :class="{
                      editIng: !(
                        `${getDetailData.data[0].ADD_TYPE}` ==
                        `${paramObject.ADD_TYPE}`
                      ),
                    }"
                    :readonly="paramObject.PRICE_UPDATE == 0"
                    @change="iptChange(paramObject.ADD_TYPE, 'ADD_TYPE')"
                  />
                </td>
              </tr>
            </table>
          </div>
          <div class="dWidth40P">
            <table>
              <tr>
                <td class="width7p colName"><span>後補說明</span></td>
                <td class="width7p colName"><span>贈/扣點數</span></td>
              </tr>
              <tr>
                <!--後補說明 -->
                <!-- <td class="width7p tdEdit" v-show="!isEditing">
                  {{ paramObject.ADD_MEMO }}
                </td> -->
                <td class="width7p tdEdit elInput">
                  <el-input
                    v-model="paramObject.ADD_MEMO"
                    size="small"
                    :class="{
                      editIng: !(
                        `${getDetailData.data[0].ADD_MEMO}` ==
                        `${paramObject.ADD_MEMO}`
                      ),
                    }"
                    :readonly="paramObject.PRICE_UPDATE == 0"
                    @change="iptChange(paramObject.ADD_MEMO, 'ADD_MEMO')"
                  />
                </td>
                <!--贈/扣點數 -->
                <!-- <td class="width7p tdEdit" v-show="!isEditing">
                  {{ paramObject.USE_BONUS }}
                </td> -->
                <td class="width7p tdEdit elInput">
                  <el-input
                    v-model="paramObject.USE_BONUS"
                    size="small"
                    :class="{
                      editIng: !(
                        `${getDetailData.data[0].USE_BONUS}` ===
                        `${paramObject.USE_BONUS}`
                      ),
                    }"
                    :readonly="paramObject.PRICE_UPDATE == 0"
                    @change="iptChange(paramObject.USE_BONUS, 'USE_BONUS')"
                  />
                </td>
              </tr>
            </table>
          </div>
        </div>

        <div class="dTableGroup" v-show="getAgGridData.CP_TYPE == 0">
          <table>
            <tr>
              <td colspan="10" class="tdTopic"><span> ● 銷售條件設定</span></td>
            </tr>
            <tr>
              <td class="width7p colName"><span>促銷進價</span></td>
              <td class="width7p colName"><span>促銷售價</span></td>
              <td class="width7p colName"><span>促銷毛利</span></td>
            </tr>
            <tr>
              <td class="width7p tdEdit elInput">
                <el-input
                  v-model="paramObject.COST"
                  size="small"
                  :class="{
                    editIng: !(getDetailData.data[0].COST == paramObject.COST),
                  }"
                  :readonly="paramObject.PRICE_UPDATE == 0"
                  @change="iptChange(paramObject.COST, 'COST')"
                />
              </td>
              <td class="width7p tdEdit elInput">
                <el-input
                  v-model="paramObject.PRICE"
                  size="small"
                  :class="{
                    editIng: !(
                      getDetailData.data[0].PRICE == paramObject.PRICE
                    ),
                  }"
                  :readonly="paramObject.PRICE_UPDATE == 0"
                  @change="iptChange(paramObject.PRICE, 'PRICE')"
                />
              </td>
              <td class="tdValue">{{ computed_freshGross + "%" }}</td>
            </tr>
          </table>
          <table>
            <tr>
              <td colspan="10" class="tdTopic tdEmpty"><span></span></td>
            </tr>
            <tr>
              <td class="width7p colName"><span>定額/秤重</span></td>
              <td class="width7p colName txt_center" colspan="2">
                <span>單位入數</span>
              </td>
              <td class="width7p colName txt_center" colspan="2">
                <span>單位重量</span>
              </td>
              <td class="width7p colName"><span>贈/扣點數</span></td>
              <td class="width7p colName"></td>
            </tr>
            <tr>
              <!-- <td class="width10P tdEdit" v-show="!isEditing">
                {{ paramObject.PRICE_TYPE }}
              </td> -->
              <td class="width10P tdEdit elSelect">
                <el-select
                  v-model="paramObject.PRICE_TYPE"
                  class="m-2"
                  placeholder="Select"
                  size="small"
                  :class="{
                    editIng: !(
                      getDetailData.data[0].PRICE_TYPE == paramObject.PRICE_TYPE
                    ),
                  }"
                  :disabled="paramObject.PRICE_UPDATE == 0"
                  @change="iptChange(paramObject.PRICE_TYPE, 'PRICE_TYPE')"
                >
                  <el-option
                    v-for="item in getPriceTypeArray"
                    :key="item.CODE"
                    :label="item.CAPTION"
                    :value="item.CODE"
                  />
                </el-select>
              </td>
              <!-- 單位入數 -->
              <!-- <td class="width7p tdValue" v-show="!isEditing">
                {{ paramObject.UNIT_QTY }}
              </td> -->
              <td class="width7p tdEdit elInput">
                <el-input
                  v-model="paramObject.UNIT_QTY"
                  size="small"
                  :class="{
                    editIng: !(
                     `${getDetailData.data[0].UNIT_QTY}` === `${paramObject.UNIT_QTY}`
                    ),
                  }"
                  :readonly="paramObject.PRICE_UPDATE == 0"
                  @change="iptChange(paramObject.UNIT_QTY, 'UNIT_QTY')"
                />
              </td>
              <td class="width7p txt_center">
                {{ paramObject.UNIT_QTY_TYPE }}
              </td>

              <!-- 單位重量 -->
              <!-- <td class="width7p tdValue" v-show="!isEditing">
                {{ paramObject.UNIT_WEIGHT }}
              </td> -->
              <td class="width7p tdEdit elInput">
                <el-input
                  v-model="paramObject.UNIT_WEIGHT"
                  size="small"
                  :class="{
                    editIng: !(
                      `${getDetailData.data[0].UNIT_WEIGHT}` === `${paramObject.UNIT_WEIGHT}`
                    ),
                  }"
                  :readonly="paramObject.PRICE_UPDATE == 0"
                  @change="iptChange(paramObject.UNIT_WEIGHT, 'UNIT_WEIGHT')"
                />
              </td>

              <td class="width7p txt_center">
                {{ paramObject.UNIT_WEIGHT_TYPE }}
              </td>

              <!-- <td class="width7p tdValue" v-show="!isEditing">
                {{ paramObject.USE_BONUS }}
              </td> -->
              <td class="width7p tdEdit elInput">
                <el-input
                  v-model="paramObject.USE_BONUS"
                  size="small"
                  :class="{
                    editIng: !(
                    `${getDetailData.data[0].USE_BONUS}` === `${paramObject.USE_BONUS}`
                    ),
                  }"
                  :readonly="paramObject.PRICE_UPDATE == 0"
                  @change="iptChange(paramObject.USE_BONUS, 'USE_BONUS')"
                />
              </td>

              <td class="width7p colName"></td>
            </tr>
          </table>
        </div>
        <div>
          <table>
            <tr>
              <td colspan="10" class="tdTopic"><span> ● 其他設定</span></td>
            </tr>
            <tr>
              <td class="width1P colName"><span>訂單連絡Email</span></td>
              <!-- <td class="width20P tdValue" colspan="7" v-show="!isEditing">
              {{ paramObject.MAIL }}
            </td> -->
              <td class="width40P tdEdit elInput" colspan="7">
                <el-input
                  v-model="paramObject.MAIL"
                  size="small"
                  :class="{
                    editIng: !(
                      `${getDetailData.data[0].MAIL}` === `${paramObject.MAIL}`
                    ),
                  }"
                  :readonly="isReadOnly"
                  @change="iptChange(paramObject.MAIL, 'MAIL')"
                />
              </td>
              <!-- 訂單連絡Email -->
              <!-- <td class="width10P colName"><span>訂單連絡Email</span></td> -->
              <!-- <td class="width20P tdValue" colspan="2" v-show="!isEdit">
              {{ getDetailData.data[0].MAIL }}
            </td> -->
              <!-- <td class="width20P tdEdit" colspan="2">
              <el-input
                v-model="paramObject.MAIL"
                size="small"
                placeholder="Please input"
                :class="{ editIng: isEdit }"
                :readonly="isReadOnly"
              />
            </td> -->

              <!-- 物流首次備貨量 -->
              <td class="width1P colName"><span>物流首次備貨量</span></td>
              <!-- <td class="width10P tdValue" v-show="!isEditing">
              {{ paramObject.STOCK_QTY }}
            </td> -->
              <td class="width1P tdEdit elInput">
                <el-input
                  v-model="paramObject.STOCK_QTY"
                  size="small"
                  :class="{
                    editIng: !(
                      `${getDetailData.data[0].STOCK_QTY}` ===
                      `${paramObject.STOCK_QTY}`
                    ),
                  }"
                  :readonly="isReadOnly"
                  @change="iptChange(paramObject.STOCK_QTY, 'STOCK_QTY')"
                />
              </td>
            </tr>
            <tr>
              <!-- <td class="width10P colName"><span>選項</span></td>
            <td colspan="9" class="tdValue">
              {{ getDetailData.data[0].OPTIONS }}
            </td> -->
              <!-- 備註 -->
              <td class="width1P colName"><span>備註</span></td>
              <!-- <td class="width40P tdValue" colspan="7" v-show="!isEditing">
              {{ paramObject.MEMO }}
            </td> -->
              <td colspan="7" class="width40P tdEdit elInput">
                <el-input
                  v-model="paramObject.MEMO"
                  size="small"
                  :class="{
                    editIng: !(
                      `${getDetailData.data[0].MEMO}` === `${paramObject.MEMO}`
                    ),
                  }"
                  :readonly="isReadOnly"
                  @change="iptChange(paramObject.MEMO, 'MEMO')"
                />
              </td>
              <td class="width1P colName"><span>商品訂購碼</span></td>
              <!-- <td class="width10P tdEdit" v-show="!isEditing">
              {{ paramObject.SNO }}
            </td> -->
              <td class="width10P tdEdit elInput">
                <el-input
                  v-model="paramObject.SNO"
                  size="small"
                  :class="{
                    editIng: !(
                      `${getDetailData.data[0].SNO}` === `${paramObject.SNO}`
                    ),
                  }"
                  :readonly="isReadOnly"
                  @change="iptChange(paramObject.SNO, 'SNO')"
                />
              </td>
            </tr>
          </table>
        </div>
      </div>
    </el-scrollbar>
  </div>
  <!-- </el-dialog> -->
</template>

<style lang="scss" scoped>
.box {
  background: #aaa;
  padding: 4px 8px;
  margin-bottom: 5px;
  display: flex;
  .btnStyle {
    padding: 2px 4px;
    margin-right: 5px;

    .el-icon {
      top: 2px;
      margin-right: 2px;
    }
  }
}
table {
  border-collapse: collapse;
  width: 100%;
  tr {
    td {
      padding: 2px 1px;
      border: 1px solid #fff;
      height: 21px;

      white-space: nowrap;
      font-size: 10pt;
      color: #000;
      &.width1P {
        width: 1%;
      }
      &.width7p {
        width: 10%;
      }
      &.width10P {
        min-width: 95px;
        width: 10%;
      }

      &.width50P {
        width: 50%;
      }
      &.width40P {
        width: 40%;
      }

      &.width20P {
        width: 20%;
      }

      &.width30P {
        width: 30%;
      }

      &.colName {
        background: #eee;
        padding: 0 0 0 4px;
        height: 27px;
      }

      &.tdEdit {
        //  background: #f1fa2b78;
      }

      &.tdTopic {
        text-align: left;
        padding-left: 5px;
        height: 15px;
        background: #aaa;
        color: #000;
        font-size: 11pt;
      }

      &.tdValue {
        color: #000;
        padding: 0 0px 0 4px;
      }

      &.width10P.colName {
        width: 1%;
      }

      &.tdEmpty {
        padding: 10.5px 0;
      }
    }
  }
}

.dDetailContent {
  min-width: 1100px;
  // width: 100%;
  // height: calc(100vh - 26px - 80px);
  min-height: 331px;

  padding: 0 8px;
  padding-bottom: 12px;
}
.dTableGroup {
  display: flex;
  margin-top: 2px;
  > div:nth-child(1) {
    padding-right: 1px;
  }
  .dWidth60P {
    width: 60%;
  }
  .dWidth40P {
    width: 40%;
  }
}

.slt100P {
  width: 100%;
}

.test {
}

.txt_center {
  text-align: center;
}
</style>
