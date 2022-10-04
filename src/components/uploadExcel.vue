<script>
import { ElButton, ElMessage } from "element-plus";
import { reactive, ref } from "@vue/reactivity";
import * as XLSX from "xlsx";
import {
  apiUseExcelParams,
  apiUseB2bEcItemParams,
  apiUseUhcItemParams,
} from "../api/index";
import { computed } from "vue-demi";
import { useStore } from "vuex";
import { apiFormatExcelDate } from "../componentAPI/index";
import { apiRoundDecimal } from "../componentAPI/index";
export default {
  components: {
    ElButton,
    ElMessage,
  },
  setup() {
    const store = useStore();
    const ucItemParams = new apiUseUhcItemParams();
    // 取得目前 Promo ID
    const getCurrentPromoID = computed(() => {
      return store.getters["getCurrentPromoID"];
    });
    // 取得目前 Promo IDX
    const getCurrentPromoIDX = computed(() => {
      return store.getters["getCurrentPromoIDX"];
    });
    // Excel 參數
    const ExcelParams = new apiUseExcelParams();
    const b2bEcItemParams = new apiUseB2bEcItemParams();
    // 預設檔名參數
    const fileName = ref("");
    // 判斷 匯入Excel是否正在匯入中
    const loading = ref(false);
    // 設定 取得 Excel 標頭與資料的參數
    const excelData = reactive({
      header: null,
      results: null,
    });

    const iptUploadExcel = ref();

    //拖移 Excel 觸發事件
    function handleDrop(e) {
      if(getCurrentPromoIDX.value==99){
        error('在期間全部檔期時，不能匯入EXCEL');
       return;
      };
      e.stopPropagation();
      e.preventDefault();
      // 正在匯入中，不得再匯入
      if (loading.value) return;
      // 取得拖移的檔案
      const files = e.dataTransfer.files;
      // 從取得的檔案，擷取檔名
      fileName.value = files[0].name.split(".")[0];
      if (files.length !== 1) {
        // 錯誤訊息 : 只能一個檔案
        error("只能一個檔案");
      }

      const rawFile = files[0];
      // 判斷是不是excel
      if (!isExcel(rawFile)) {
        //錯誤訊息 : 只能 .xlsx .xls
        error("只能 .xlsx .xls");
        return false;
      }

      upload(rawFile);
      e.stopPropagation();
      e.preventDefault();
    }

    function handleDragover(e) {
      e.stopPropagation();
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    }

    // 點擊 button 匯入Excel
    function handleUpload() {
      if(getCurrentPromoIDX.value==99){
        error('在期間全部檔期時，不能匯入EXCEL');
       return;
      };
      iptUploadExcel.value.click();
    }

    // file input 上傳Excel
    function handleClick(e) {
      const files = e.target.files;
      const rawFile = files[0];

      if (files.length !== 1) {
        // 錯誤訊息 : 只能一個檔案
        error("只能一個檔案");
      }
      if (!isExcel(rawFile)) {
        //錯誤訊息 : 只能 .xlsx .xls
        error("只能 .xlsx .xls");
        return false;
      }
      //取檔名
      fileName.value = rawFile.name.split(".")[0];
      if (!rawFile) return;
      loading.value = true;
      setTimeout(()=>{
              upload(rawFile);
      },100)

    }

    function upload(rawFile) {
      iptUploadExcel.value.value = null;
      readerData(rawFile);
    }

    // 處理 Excel 資料
    function readerData(rawFile) {
    
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target.result;
          const workbook = XLSX.read(data, {
            type: "array",
          });

          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const header = getHeaderRow(worksheet);
          //讀 Excel 資料 轉 Json
          const result = XLSX.utils.sheet_to_json(worksheet);
          //將資料塞入物件裡
          generateData(header, result);
          // excelData.header = header;
          // excelData.results = result;
          // console.log(excelData);
          loading.value = false;
          resolve();
        };
        reader.readAsArrayBuffer(rawFile);
      });
    }
    //將資料塞入物件裡
    function generateData(header, results) {
      excelData.header = header;
      excelData.results = results;
      handelSuccess(excelData);
    }

    // 取得Excel 標題
    function getHeaderRow(sheet) {
      const headers = [];
      const range = XLSX.utils.decode_range(sheet["!ref"]);
      let C;
      const R = range.s.r;
      /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) {
        /* walk every column in the range */
        const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })];
        /* find the cell in the first row */
        let hdr = "UNKNOWN " + C; // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);
        headers.push(hdr);
      }
      return headers;
    }

    //判斷副檔名是不是 Excel
    function isExcel(file) {
      return /\.(xlsx|xls|csv)$/.test(file.name);
    }
    // 成立組數 (箱購) / ↵取貨數量 (分批) / ↵成團數量 (圈團) ↵
    // 將Excel欄位名稱改成SQL對應的欄位名稱，並將日期轉換
    function format(results) {
      const mapInfo = {
        A: "ACTIVITY_TYPE_NAME",
        B: "ITEM_ID",
        C: "BARCODE",
        D: "ITEM_NAME",
        E: "SALE_B_DATE",
        F: "SALE_E_DATE",
        G: "ORIGINAL_PRICE",
        H: "COST",
        I: "DISCOUNT",
        J: "PRICE",
        L: "TAKE_TYPE_NAME",
        M: "SALE_QTY",
        N: "SALE_STOCK",
        O: "SALE_ATTRIBUTE_ID",
        P: "TAKE_ATTRIBUTE_ID",
        Q: "TAKE_B_DAY",
        R: "TAKE_E_DAY",
        S: "TAKE_B_DATE",
        T: "TAKE_E_DATE",
        U: "SUBJECT",
        V: "PROMO_TEXT",
        W: "MAIL",
        X: "SNO",   
      };

      const res = results.map((obj) => {
        // obj属性名是中文
        // 1. 取出所有的属性名 ---> 数组
        // 2  循环这个数组
        //    向newObj中补充键值对
        //             键：从中文->英文
        //             值: obj中的值
        const newObj = {};

        const s = Object.keys(obj);

        // console.log(s[0]);

        // 存储对象每个键为一个数组
        const zhKeys = Object.keys(mapInfo);
        // console.log(zhKeys, 'zhKeys')
        zhKeys.forEach((zhkey, keys) => {
          const enKey = mapInfo[zhkey];

          // if(当前的key是日期相关的，要额外处理)
          // 判斷哪些欄位需要轉換日期
          if (enKey === "timeOfEntry" || enKey === "correctionTime") {
            // excel中的日期格式和编程语言中的格式不一致，要转换
            // 44892 -------> 2022-11-11
            newObj[enKey] = new Date(formatExcelDate(obj[zhkey]));
          } else {
            newObj[enKey] = obj[zhkey] || "";
            //newObj[mapInfo[s[keys]]] = obj[s[keys]] || "";
          }
        });

        return newObj;
      });
      return res;
    }
    // 成功取得資料後，將資料帶入參數
    function handelSuccess({ header, results }) {
      const result = format(results);
      console.log(result);

      result.forEach((item, key) => {
        if (key == 0) {
          return;
        }
        // console.log(item.ITEM_ID)
        ExcelParams.initial();
        ExcelParams.FILE_NAME = fileName.value;
        ExcelParams.PROMO_ID = getCurrentPromoID.value;
        ExcelParams.PROMO_IDX = getCurrentPromoIDX.value;
        ExcelParams.ACTIVITY_TYPE_NAME = item.ACTIVITY_TYPE_NAME.trim();
        ExcelParams.ITEM_ID = `${item.ITEM_ID}`.trim();
        ExcelParams.BARCODE = `${item.BARCODE}`.trim();
        ExcelParams.ITEM_NAME = item.ITEM_NAME.trim();
        ExcelParams.SALE_B_DATE =
          item.SALE_B_DATE != "" ? apiFormatExcelDate(item.SALE_B_DATE) : "";
        ExcelParams.SALE_E_DATE =
          item.SALE_B_DATE != "" ? apiFormatExcelDate(item.SALE_E_DATE) : "";
        ExcelParams.COST = apiRoundDecimal(item.COST, 2);
        ExcelParams.DISCOUNT = `${item.DISCOUNT}`.trim();
        ExcelParams.PRICE = `${item.PRICE}`.trim();
        ExcelParams.TAKE_TYPE_NAME = item.TAKE_TYPE_NAME.trim();
        ExcelParams.SALE_QTY = `${item.SALE_QTY}`.trim();
        ExcelParams.SALE_STOCK = `${item.SALE_STOCK}`.trim();
        ExcelParams.SALE_ATTRIBUTE_ID = `${item.SALE_ATTRIBUTE_ID}`.trim();
        ExcelParams.TAKE_ATTRIBUTE_ID = `${item.TAKE_ATTRIBUTE_ID}`.trim();
        ExcelParams.TAKE_B_DAY = `${item.TAKE_B_DAY}`.trim();
        ExcelParams.TAKE_E_DAY = `${item.TAKE_E_DAY}`.trim();
        ExcelParams.TAKE_B_DATE =
          item.TAKE_B_DATE != "" ? apiFormatExcelDate(item.TAKE_B_DATE) : "";
        ExcelParams.TAKE_E_DATE =
          item.TAKE_E_DATE != "" ? apiFormatExcelDate(item.TAKE_E_DATE) : "";
        ExcelParams.MAIL = item.MAIL.trim();
        ExcelParams.ORIGINAL_PRICE = `${item.ORIGINAL_PRICE}`.trim();
        ExcelParams.SNO = `${item.SNO}`.trim();
        ExcelParams.SUBJECT = `${item.SUBJECT}`.trim();
        ExcelParams.PROMO_TEXT = `${item.PROMO_TEXT}`.trim();
        store.dispatch("importExcel/importExcel", ExcelParams);
        // 最後一筆時，呼SP 取得 成功/失敗訊息
        if (result.length == key + 1) {
          b2bEcItemParams.initial();
          b2bEcItemParams.FILE_NAME = fileName.value;
          b2bEcItemParams.ACTION_TYPE = 2;
          setTimeout(function () {
            store
              .dispatch("importExcel/b2bEcItemAction", b2bEcItemParams)
              .then((res) => {
                // 失敗
                if (res.msg != "") {
                  error(res.msg);
                  return;
                }
                if (res.data[0].RTN_CODE > 0) {
                  error(res.data[0].RTN_MSG);
                } else {
                  // 成功
                  success(res.data[0].RTN_MSG);
                  ucItemParams.initial();
                  // 重新撈agGrid 資料
                  store.dispatch("fetchAgGridTpe2", ucItemParams);
                }
              });
          }, 500);
        }
      });
    }
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
        duration: 0,
        showClose: true,
      });
    };

    return {
      excelUploadInput: iptUploadExcel,
      handleDrop,
      handleUpload,
      handleClick,
      loading,
      handleDragover,
      format,
    };
  },
};
</script>

<template>
  <div>
    <input
      ref="excelUploadInput"
      type="file"
      accept=".xlsx, .xls"
      class="excel-upload-input"
      @change="handleClick"
    />
    <div
      class="drop"
      @drop="handleDrop"
      @dragover="handleDragover"
      @dragenter="handleDragover"
    >
      拖移Excel匯入資料
      <el-button
        :loading="loading"
        size="small"
        type="primary"
        class="btnExcel"
        @click="handleUpload"
      >
        匯入Excel
      </el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.excel-upload-input {
  display: none;
}
.drop {
  width: 250px;
  border: 2px dashed #bbb;
  border-radius: 5px;
  /* height: 78%; */
  height: 25px;
  margin-left: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  .btnExcel {
    margin-left: 10px;
  }
}
</style>
