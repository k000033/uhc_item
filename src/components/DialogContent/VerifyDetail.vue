import { tupleExpression } from "@babel/types";
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
    // 取得銷售活動別的下拉選單的資料
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
    // 取得活動主題
    const getTID= computed(()=>{
      return store.getters["detailDialog/getTID"];
    })


    // 促銷話術
    const getPromoTextArray = computed(() => {
      const res = store.getters["detailDialog/getPromoTextArray"];
      const x = res.data.map((x, idx) => ({
        value: x.CAPTION,
        label: x.CAPTION,
      }));
      return x;
      // return store.getters["detailDialog/getPromoTextArray"];
    });



    /**
     * 平均單價
     * 公式: 促銷售價 / 成立組數 (取小數點兩位) , 編輯此兩欄位時, 需要連動計算 平均單價
     */
    const avgPrice = computed(() => {
      const result =
        parseFloat(paramObject.PRICE) / parseFloat(paramObject.SALE_QTY);
      return apiToDecimal(result||getDetailData.value.data[0]._AVG_PRICE);
    });

    

    // 促銷毛利
    const computed_Gross = computed(() => {
      const result =
        ((parseFloat(paramObject.PRICE) -
          parseFloat(paramObject.COST) +
          parseFloat(paramObject.DISCOUNT)) /
          parseFloat(paramObject.PRICE)) *
        100;
      console.log(result);
      return apiToDecimal(result||getDetailData.value.data[0]._GROSS
      );
    });

    // 原毛利
    const computed_Cnt_Gross = computed(() => {
      return apiToDecimal(paramObject.CNT_GROSS * 100);
    });

    // 補足毛利
    const computed_Add_Gross = computed(() => {
      const result =
        ((parseFloat(paramObject.PRICE) -
          parseFloat(paramObject.COST) +
          parseFloat(paramObject.DISCOUNT) +
          parseFloat(paramObject.ADD_PRICE)) /
          parseFloat(paramObject.PRICE)) *
        100;
      console.log(result);
      return apiToDecimal(result||getDetailData.value.data[0]._ADD_GROSS);
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
        paramObject.CODE = data[0].CODE;
        paramObject.CNT_CODE = data[0].CNT_CODE;
        paramObject.CNT_PRICE = data[0].CNT_PRICE;
        paramObject.CNT_DIPRICE = data[0].CNT_DIPRICE;
        paramObject.CNT_GROSS = data[0].CNT_GROSS;
        paramObject.DM_TITLE = data[0].DM_TITLE;
        paramObject.UNIT = data[0].UNIT;
        paramObject.PROMO_TEXT = data[0].PROMO_TEXT;
        paramObject.TID = data[0].TID;
        paramObject.HP = data[0].HP;
      }
      return store.getters["detailDialog/getDetailData"];
    });

    // 促銷後補別 checkbox 0.不勾 1.勾
    const IS_ADD_TYPE = computed({
      get() {
        return paramObject.ADD_TYPE == 0 ? false : true;
      },
      set(val) {
        paramObject.ADD_TYPE = val == true ? 1 : 0;
      },
    });

    /**
     * 當改變促銷售價，也改變促銷進價
     */
    const iptPrice = () => {
      paramObject.COST = apiToDecimal(
        paramObject.PRICE * (1 - paramObject.CNT_GROSS) + paramObject.DISCOUNT
      );
    };

    /**
     * 異動成立組數，建立售價也跟的異動
     * 建立售價 = 成立組數 * 原售價
     */
    const iptSaleQty_input=()=>{
       paramObject.ORIGINAL_PRICE = (paramObject.SALE_QTY*paramObject.CNT_PRICE)
    }

    const currDoc_id = ref("");

    // 明細資料的欄位
    const paramObject = reactive({
      ACTIVITY_TYPE: "",
      // ACTIVITY_TYPE_TEXT: "",
      CODE: "",
      CNT_CODE: "",
      CNT_PRICE: "",
      CNT_DIPRICE: "",
      CNT_GROSS: "",
      DM_TITLE: "",
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
      PROMO_TEXT: "",
      TAKE_B_DATE: "",
      TAKE_E_DATE: "",
      UNIT_QTY_TYPE: "",
      UNIT_WEIGHT_TYPE: "",
      DELIVERY_TEMP: "",
      TAX_TYPE: "",
      ORIGINAL_PRICE: "",
      SNO: "",
      PRICE_UPDATE: "",
      UNIT: "",
      TID: "",
      HP:""
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
      //取得物件裡的屬性名稱
      let keys = Object.keys(paramObject);
      let paramsString = "";
      // 跑迴圈 ，將欄位的值與資料庫取出來的值來做比對，如果不一樣，代表有修改過，並且組成 key=value字串，以^串聯起來
      keys.forEach((item) => {
        if (getDetailData.value.data[0][item] != paramObject[item]) {
          paramsString += `${item}=${paramObject[item] || ""}^`;
        }
      });
      // 去掉最後一個^
      paramsString = paramsString.substring(0, paramsString.length - 1);
      console.log(paramsString);
      ucItemParams.initial();
      ucItemParams.DOC_ID = getAgGridData.value.DOC_ID;
      ucItemParams.UPDATE = paramsString;
      // 如果沒有修改，按下儲存，不動作
      if (paramsString == "") {
        return;
      }
      store
        .dispatch("detailDialog/saveDetailData", ucItemParams)
        .then((res) => {
          // alert(res.data);
          if (res.data[0].RTN_CODE == 0) { // 成功
            success(res.data[0].RTN_MSG);
            
            ucItemParams.initial();
            ucItemParams.DOC_ID = getAgGridData.value.DOC_ID;
            ucItemParams.DETAIL_PAGE = 1;
            store.dispatch("detailDialog/fetchDetailData", ucItemParams);

            store.commit("setAgGridIsReLoad", true);
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
        duration: 4000,
      });
    };

    // 錯誤訊息
    const error = (msg) => {
      ElMessage({
        message: msg,
        type: "error",
        duration: 4000,
      });
    };

    // const get_doc_Id_Array = computed(() => {
    //   return store.getters["get_doc_Id_Array"];
    // });

    // const getAgGridDataList = computed(() => {
    //   return store.getters["getAgGridType2Data"];
    // });

    // 恢復/取消編輯
    const btnCancel = () => {
      ucItemParams.initial();
      ucItemParams.DOC_ID = getAgGridData.value.DOC_ID;
      ucItemParams.DETAIL_PAGE = 1;
      store.dispatch("detailDialog/fetchDetailData", ucItemParams);
    };

    // const options = getPromoTextArray.data.map((x, idx) => ({
    //   value: x.CAPTION,
    //   label: x.CAPTION,
    // }));



    /**
     * 保留
     * 自动补全输入框
     * @param {*} queryString 
     * @param {*} cb 
     */
    const restaurants = computed(()=>{
        const res = store.getters["detailDialog/getPromoTextArray"];
         const x = res.data.map((x, idx) => ({
        value: x.CAPTION,
        label: x.CAPTION,
      }));
      return x;
    });

    const querySearch = (queryString, cb) => {
      const results = queryString
        ? restaurants.value.filter(createFilter(queryString))
        : restaurants.value;
      // call callback function to return suggestions
      cb(results);
    };
    const createFilter = (queryString) => {
      return (restaurant) => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    };
    /********** */





    // const loadAll = () => {
    //   return [
    //     { value: "vue", link: "https://github.com/vuejs/vue" },
    //     { value: "element", link: "https://github.com/ElemeFE/element" },
    //     { value: "cooking", link: "https://github.com/ElemeFE/cooking" },
    //     { value: "mint-ui", link: "https://github.com/ElemeFE/mint-ui" },
    //     { value: "vuex", link: "https://github.com/vuejs/vuex" },
    //     { value: "vue-router", link: "https://github.com/vuejs/vue-router" },
    //     { value: "babel", link: "https://github.com/babel/babel" },
    //   ];
    // };
    // onMounted(() => {
    //   restaurants.value = loadAll();
    // });

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
      getPromoTextArray,
      btnSave,
      isReadOnly,
      isOpen,
      apiToDecimal,
      computed_Gross,
      computed_Add_Gross,
      computed_freshGross,
      zhTw,
      isEditing,
      // iptChange,
      IS_ADD_TYPE,
      computed_Cnt_Gross,
      avgPrice,
      iptPrice,
      querySearch,
      iptSaleQty_input,getTID,
    };
  },
};
</script>

<template>
  <div>
    <div class="box">
      <btn />
      <button class="btnStyle" @click="btnSave">
        <el-icon><edit /></el-icon>存檔
      </button>

      <button class="btnStyle" @click="btnCancel">
        <el-icon><Refresh /></el-icon>恢復
      </button>
    </div>
    <el-scrollbar height="360">
      <div class="dDetailContent" v-if="getDetailData.data">
        <table v-if="isOpen">
          <tr>
            <td class="width10P colName"><span>活動檔期</span></td>
            <td class="width30P tdValue tdPromo" colspan="3">
              <span>{{ getAgGridData.PROMO_NAME }} </span>
              <span>{{ getAgGridData.PROMO_PERIOD }}</span>
            </td>
          </tr>
          <tr>
            <td class="width10P colName"><span>貨號</span></td>
            <td class="width10P tdValue">{{ getAgGridData.PLU }}</td>
            <td class="width10P colName"><span>條碼</span></td>
            <td class="width10P tdValue">{{ getAgGridData.BARCODE }}</td>
            <td class="width10P colName"><span>大類碼</span></td>
            <td class="width10P tdValue">{{ getLineName }}</td>
            <td class="width10P colName"><span>產品別</span></td>
            <td class="width10P tdValue">{{ getAgGridData.OMO_TYPE_NAME }}</td>
            <td class="width10P colName"><span>配送溫層</span></td>
            <td class="width10P tdValue">{{ getAgGridData.DELIVERY_TEMP }}</td>
            <td class="width10P colName"><span>稅別</span></td>
            <td class="width10P tdValue">{{ getAgGridData.TAX_TYPE }}</td>
          </tr>
          <tr>
            <td class="width10P colName"><span>品名規格</span></td>
            <td class="width30P tdValue" colspan="3">
              {{ getAgGridData.ITEM_NAME }}
            </td>
            <td class="width10P colName"><span>單位</span></td>
            <td class="width10P tdValue">{{ paramObject.UNIT }}</td>
            <td class="width10P colName"><span>供應商</span></td>
            <td class="width10P tdValue">{{ getAgGridData.VENDOR_NAME }}</td>
          </tr>
          <tr>
            <td colspan="12" class="tdTopic"><span> ● 銷售條件設定</span></td>
          </tr>
          <tr>
            <td class="width10P colName"><span>銷售碼</span></td>
            <td class="width10P tdValue">{{ paramObject.CODE }}</td>

            <!-- 活動品名 -->
            <td class="width10P colName"><span>活動品名</span></td>
            <td colspan="4" class="width30P tdEdit elInput">
              <el-input
                v-model="paramObject.ITEM_NAME"
                size="small"
                :class="{
                  editIng: !(
                    `${getDetailData.data[0].ITEM_NAME}` ===
                    `${paramObject.ITEM_NAME}`
                  ),
                }"
                :readonly="isReadOnly"
              />
            </td>
            <td class="width10P colName"><span>活動主題</span></td>
            <td class="width30P tdEdit elSelect" colspan="4">
              <!-- <el-input
                v-model="paramObject.SUBJECT"
                size="small"  
                :class="{
                  editIng: !(
                    `${getDetailData.data[0].SUBJECT}` ===
                    `${paramObject.SUBJECT}`
                  ),
                }"
                :readonly="isReadOnly"
              /> -->
              <el-select
                v-model="paramObject.TID"                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
                class="m-2"
                placeholder="常態活動"
                size="small"
                :class="{
                  editIng: !(
                    getDetailData.data[0].TID ==
                    paramObject.TID
                  ),
                }"
                :disabled="isReadOnly"
                @clear = "sltTID_clear"
              >
                <el-option
                  v-for="item in getTID.data"
                  :key="item.CODE"
                  :label="item.CAPTION"
                  :value="item.CODE"
                /> 
              </el-select>
            </td>
          </tr>
          <tr>
            <!-- 銷售活動別 -->
            <td class="width10P colName"><span>銷售活動別</span></td>
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
              >
                <el-option
                  v-for="item in getActivityNameArray.data"
                  :key="item.CODE"
                  :label="item.CAPTION"
                  :value="item.CODE"
                />
              </el-select>
            </td>
            <!-- 銷售店群 -->
            <td class="width10P colName"><span>銷售店群</span></td>
            <td colspan="2" class="width10P tdEdit elSelect">
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
              >
                <el-option
                  v-for="item in getSaleAttributeArray.data"
                  :key="item.CODE"
                  :label="item.CAPTION"
                  :value="item.CODE"
                />
              </el-select>
            </td>
            <!-- 銷售前置日期 -->
            <td class="width10P colName"><span>銷售前置天數</span></td>
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
              />
            </td>
            <!-- 強度 -->
            <td class="width10P colName"><span>強度</span></td>
            <td class="width10P tdEdit elInput">
              <el-input
                v-model="paramObject.HP"
                size="small"
                :class="{
                  editIng: !(
                    `${getDetailData.data[0].HP}` ==
                    `${paramObject.HP}`
                  ),
                }"
                :readonly="isReadOnly"
              />
            </td>
            <td class="width10P"><span></span></td>
            <td class="width10P"><span></span></td>
            <td class="width10P"><span></span></td>
          </tr>
          <tr>
            <!-- 銷售日期(起) -->
            <td class="width10P colName"><span>銷售日期(起)</span></td>
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
                        `${getDetailData.data[0].SALE_B_DATE}` ===
                        `${paramObject.SALE_B_DATE}`
                      ),
                    }"
                    :readonly="isReadOnly"
                  />
                </el-config-provider>
              </div>
            </td>

            <!-- 銷售日期(迄) -->
            <td class="width10P colName"><span>銷售日期(迄)</span></td>
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
                      `${getDetailData.data[0].SALE_E_DATE}` ===
                      `${paramObject.SALE_E_DATE}`
                    ),
                  }"
                  :readonly="isReadOnly"
                />
              </div>
            </td>
            <!-- 限量數量 -->
            <td class="width10P colName"><span>限量數量</span></td>
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
              />
            </td>
            <td class="width10P"><span></span></td>
            <td class="width10P"><span></span></td>
            <td class="width10P"><span></span></td>
            <td class="width10P"><span></span></td>
            <td class="width10P"><span></span></td>
            <td class="width10P"><span></span></td>
          
          </tr>
          <!-- </table>
   <table> -->
          <tr>
            <td colspan="12" class="tdTopic"><span> ● 提貨條件設定</span></td>
          </tr>
          <tr>
            <td class="width10P colName"><span>提貨別</span></td>
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
              >
                <el-option
                  v-for="item in getTakeTypeArray.data"
                  :key="item.CODE"
                  :label="item.CAPTION"
                  :value="item.CODE"
                />
              </el-select>
            </td>

            <td class="width10P colName"><span>提貨店群</span></td>
            <td class="width10P tdEdit elSelect" colspan="2">
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
              >
                <el-option
                  v-for="item in getTakeAttributeArray.data"
                  :key="item.CODE"
                  :label="item.CAPTION"
                  :value="item.CODE"
                />
              </el-select>
            </td>
            <td class="width10P"><span></span></td>
            <td class="width10P"><span></span></td>
            <td class="width10P"><span></span></td>
            <td class="width10P"><span></span></td>
            <td class="width10P"><span></span></td>
            <td class="width10P"><span></span></td>
            <td class="width10P"><span></span></td>
          </tr>
          <tr>
            <!-- 提貨日期(起) -->
            <td class="width10P colName"><span>提貨日期(起)</span></td>
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
                />
              </div>
            </td>
            <!-- 提貨日期(迄) -->
            <td class="width10P colName"><span>提貨日期(迄)</span></td>
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
                />
              </div>
            </td>
            <!-- 可提貨天數 -->
            <td class="width10P colName"><span>可提貨天數</span></td>
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
              />
            </td>
            <!-- 提貨期限天數 -->
            <td class="width10P colName"><span>提貨期限天數</span></td>
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
              />
            </td>
            <td class="width10P"><span></span></td>
            <td class="width10P"></td>
            <td class="width10P"><span></span></td>
            <td class="width10P"></td>
          </tr>
          <tr>
            <td colspan="12" class="tdTopic"><span> ● 價格設定</span></td>
          </tr>
          <tr>
            <td class="width10p colName"><span>定額/秤重</span></td>
            <td class="width10p colName txt_center" colspan="2">
              <span>單位入數</span>
            </td>
            <td class="width7p colName txt_center" colspan="2">
              <span>單位重量</span>
            </td>
            <td class="width10P colName"><span>箱入數</span></td>
            <td class="width10P colName"><span>成立組數</span></td>
            <td class="width10P colName">平均單價</td>
            <td class="width10P"></td>
            <td class="width10P"></td>
            <td class="width10P"></td>
            <td class="width10P"></td>
          </tr>

          <tr>
            <!--價格設定-->
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
            <td class="width7p tdEdit elInput">
              <el-input
                v-model="paramObject.UNIT_QTY"
                size="small"
                :class="{
                  editIng: !(
                    `${getDetailData.data[0].UNIT_QTY}` ===
                    `${paramObject.UNIT_QTY}`
                  ),
                }"
                :readonly="paramObject.PRICE_UPDATE == 0"
              />
            </td>
            <td class="width7p txt_center">
              {{ paramObject.UNIT_QTY_TYPE }}
            </td>

            <!-- 單位重量 -->
            <td class="width7p tdEdit elInput">
              <el-input
                v-model="paramObject.UNIT_WEIGHT"
                size="small"
                :class="{
                  editIng: !(
                    `${getDetailData.data[0].UNIT_WEIGHT}` ===
                    `${paramObject.UNIT_WEIGHT}`
                  ),
                }"
                :readonly="paramObject.PRICE_UPDATE == 0"
              />
            </td>
            <!-- 重量單位 -->
            <td class="width7p txt_center">
              {{ paramObject.UNIT_WEIGHT_TYPE }}
            </td>
            <!-- 箱入數 -->
            <td class="width10P tdValue">
              {{ getDetailData.data[0].BOX_QTY }}
            </td>
            <!-- 成立組數 -->
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
                :readonly="paramObject.PRICE_UPDATE == 0"
                @input ="iptSaleQty_input"
              />
            </td>
            <!-- 平均單價 -->
            <td class="width10P tdValue">{{ avgPrice }}</td>
            <td class="width10P"></td>
            <td class="width10P"></td>
            <td class="width10P"></td>
            <td class="width10P"></td>
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
            <td class="width7P colName"><span>建議售價</span></td>
            <td class="width10P"><span></span></td>
            <td class="width10P"><span></span></td>
            <td class="width10P"><span></span></td>
          </tr>
          <tr>
            <td class="width7p colName"><span>通賣</span></td>
            <td class="width7p tdValue">
              <span>{{ paramObject.CNT_CODE }}</span>
            </td>
            <td class="width7p tdValue">
              <span>{{ paramObject.CNT_DIPRICE }}</span>
            </td>
            <td class="width7p tdValue">
              <span>{{ paramObject.CNT_PRICE }}</span>
            </td>
            <td class="width7p tdValue">
              <span>{{ computed_Cnt_Gross + "%" }}</span>
            </td>
            <td class="width7p"></td>
            <td class="width7p"></td>
            <td class="width7p"></td>
            <td class="width7P tdEdit elInput">
              <el-input
                v-model="paramObject.ORIGINAL_PRICE"
                size="small"
                :class="{
                  editIng: !(
                    `${getDetailData.data[0].ORIGINAL_PRICE}` ===
                    `${paramObject.ORIGINAL_PRICE}`
                  ),
                }"
                :readonly="paramObject.PRICE_UPDATE == 0"
                
              />
            </td>
            <td class="width10P"><span></span></td>
            <td class="width10P"><span></span></td>
            <td class="width10P"><span></span></td>
          </tr>
          <tr>
            <td class="width7p colName"><span></span></td>
            <td class="width7p colName"><span>促銷進價</span></td>
            <td class="width7p colName"><span>促銷折讓</span></td>
            <td class="width7p colName"><span>促銷售價</span></td>
            <td class="width7p colName"><span>促銷毛利</span></td>
            <td class="width7p colName"><span>後補金額</span></td>
            <td class="width7p colName"><span>補足毛利</span></td>
            <td class="width7p colName"><span>後補別</span></td>
            <td class="width7p colName"><span>贈/扣點數</span></td>
            <td class="width10P"><span></span></td>
            <td class="width10P"><span></span></td>
            <td class="width10P"><span></span></td>
          </tr>
          <tr>
            <!-- <td>{{ getDetailData.data[0].PROMO_TEXT }}</td> -->
            <td class="width10P tdEdit elSelect">
              <!-- <el-autocomplete
                v-model="paramObject.PROMO_TEXT"
                :fetch-suggestions="querySearch"
                clearable
                :class="{
                  editIng: !(
                    getDetailData.data[0].PROMO_TEXT ==
                    paramObject.PROMO_TEXT
                  ),
                }"
                class="inline-input w-50"
                placeholder="Please Input"
               
                 :disabled="paramObject.PRICE_UPDATE == 0"
              /> -->
            </td>

            <!--促銷進價 -->
            <td class="width7p tdEdit elInput">
              <el-input
                v-model="paramObject.COST"
                size="small"
                :class="{
                  editIng: !(getDetailData.data[0].COST == paramObject.COST),
                }"
                :readonly="paramObject.PRICE_UPDATE == 0"
              />
            </td>
            <!--促銷折讓 -->
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
              />
            </td>
            <!--促銷售價 -->
            <td class="width7p tdEdit elInput">
              <el-input
                v-model="paramObject.PRICE"
                size="small"
                :class="{
                  editIng: !(getDetailData.data[0].PRICE == paramObject.PRICE),
                }"
                :readonly="paramObject.PRICE_UPDATE == 0"
                @input="iptPrice"
              />
            </td>
            <!--促銷毛利 -->
            <td class="tdValue">{{ computed_Gross + "%" }}</td>

            <!--後補金額 -->
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
              />
            </td>
            <!-- 補足毛利 -->
            <td class="tdValue">
              {{ computed_Add_Gross + "%" }}
            </td>

            <!--後補別 -->
            <td class="width7p tdEdit elInput">
              <div
                :class="[
                  'cbkAdd_Type',
                  {
                    editIng: !(
                      `${getDetailData.data[0].ADD_TYPE}` ==
                      `${paramObject.ADD_TYPE}`
                    ),
                  },
                  { dReadyOnly: paramObject.PRICE_UPDATE == 0 },
                ]"
              >
                <el-checkbox
                  v-model="IS_ADD_TYPE"
                  size="large"
                  :disabled="paramObject.PRICE_UPDATE == 0"
                />
              </div>
            </td>
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
              />
            </td>
            <td class="width10P"><span></span></td>
            <td class="width10P"><span></span></td>
            <td class="width10P"><span></span></td>
          </tr>
          <tr>
            <td>本檔DM活動</td>
            <td colspan="4">
              <span>{{ paramObject.DM_TITLE }}</span>
            </td>
            <td class="width7p colName"><span>後補說明</span></td>
            <td colspan="3" class="width7p tdEdit elInput">
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
              />
            </td>
          </tr>
          <tr>
            <td colspan="12" class="tdTopic"><span> ● 其他設定</span></td>
          </tr>
          <tr>
            <td class="width1P colName"><span>訂單連絡Email</span></td>
            <td class="width40P tdEdit elInput" colspan="9">
              <el-input
                v-model="paramObject.MAIL"
                size="small"
                :class="{
                  editIng: !(
                    `${getDetailData.data[0].MAIL}` === `${paramObject.MAIL}`
                  ),
                }"
                :readonly="isReadOnly"
              />
            </td>

            <!-- 物流首次備貨量 -->
            <td class="width1P colName"><span>物流加拋數量</span></td>
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
              />
            </td>
          </tr>
          <tr>
            <!-- <td class="width10P colName"><span>選項</span></td> -->
            <!-- 備註 -->
            <td class="width1P colName"><span>備註</span></td>
            <td colspan="9" class="width40P tdEdit elInput">
              <el-input
                v-model="paramObject.MEMO"
                size="small"
                :class="{
                  editIng: !(
                    `${getDetailData.data[0].MEMO}` === `${paramObject.MEMO}`
                  ),
                }"
                :readonly="isReadOnly"
              />
            </td>
            <td class="width1P colName"><span>商品訂購碼</span></td>
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
              />
            </td>
          </tr>
        </table>
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

      &.tdPromo {
        span {
          margin-right: 20px;
        }
      }
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
        padding: 0 0px 0 11px;
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

.txt_center {
  text-align: center;
}

.cbkAdd_Type {
  height: 22px;
  text-align: center;
  line-height: 28px;
  box-shadow: 0 0 0 1px #aaa !important;
  border-radius: 3px;
  &.editIng {
    background: #fff9ab;
  }

  &.dReadyOnly {
    box-shadow: none !important;
  }
}
</style>
