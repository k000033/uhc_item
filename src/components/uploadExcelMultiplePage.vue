<script>
import { ElMessage } from "element-plus";
import { computed, reactive, ref } from "vue-demi";
import { useStore } from "vuex";
import {
  apiUseExcelMultiplePageParams,
  apiUseB2bEcItemParams,
  apiUseUhcItemParams,
} from "../api/index";
import * as XLSX from "xlsx";
import { apiToDecimal, apiFormatExcelDate } from "../componentAPI/index";
export default {
  components: {
    ElMessage,
  },
  setup() {
    const store = useStore();
    // 取得目前 Promo ID
    const getCurrentPromoID = computed(() => {
      return store.getters["getCurrentPromoID"];
    });
    // 取得目前 Promo IDX
    const getCurrentPromoIDX = computed(() => {
      return store.getters["getCurrentPromoIDX"];
    });
    const ucItemParams = new apiUseUhcItemParams();
    const excelParams = new apiUseExcelMultiplePageParams();
    const b2bEcItemParams = new apiUseB2bEcItemParams();
    const fileName = ref("");
    const loading = ref(false);
    const excelData = reactive({
      header: null,
      results: null,
    });
    const iptUploadExcel = ref();
    function handleDragover(e) {
      e.stopPropagation();
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    }

    function handleDrop(e) {
      if(getCurrentPromoIDX.value==99){
        error('在期間全部檔期時，不能匯入EXCEL');
       return;
      };
      e.stopPropagation();
      e.preventDefault();
      if (loading.value) return;
      const files = e.dataTransfer.files;
      fileName.value = files[0].name.split(".")[0];
      if (files.length !== 1) {
        error("只能一個檔案");
      }
      const rawFile = files[0];
      if (!isExcel(rawFile)) {
        error("只能 .xlsx .xls");
        return false;
      }

      upload(rawFile);
      e.stopPropagation();
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    }

    function handleUpload() {
      if(getCurrentPromoIDX.value==99){
        error('在期間全部檔期時，不能匯入EXCEL');
       return;
      };
      iptUploadExcel.value.click();
    }

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

    function readerData(rawFile) {
      // loading.value = true;
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target.result;
          const workbook = XLSX.read(data, {
            type: "array",
          });
          for (var i = 0; i < workbook.SheetNames.length; i++) {
            const firstSheetName = workbook.SheetNames[i];
            const worksheet = workbook.Sheets[firstSheetName];
            const header = getHeaderRow(worksheet);
            const result = XLSX.utils.sheet_to_json(worksheet);
            generateData(header, result, i,workbook.SheetNames.length);
            loading.value = false;
            resolve();
          }
        };
        reader.readAsArrayBuffer(rawFile);
      });
    }

    //將資料塞入物件裡
    function generateData(header, results, tab,Sheetlength) {
      excelData.header = header;
      excelData.results = results;
      excelData.tab = tab;
      excelData.Sheetlength=Sheetlength;
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

    function format(results) {
      const mapInfo = {
        A: "A",
        B: "B",
        C: "C",
        D: "D",
        E: "E",
        F: "F",
        G: "G",
        H: "H",
        I: "I",
        J: "J",
        K: "K",
        L: "L",
        M: "M",
        N: "N",
        O: "O",
        P: "P",
        Q: "Q",
        R: "R",
        S: "S",
        T: "T",
        "U": "U",
        //V: "V",
        W: "W",
        X: "X",
        "Y":"Y",
        //Z: "Z",
        AA: "AA",
        AB: "AB",
        AC: "AC",
        AD: "AD",
        AE: "AE",
        AF: "AF",
        AG:"AG"
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
          //   if (enKey === "timeOfEntry" || enKey === "correctionTime") {
          //     // excel中的日期格式和编程语言中的格式不一致，要转换
          //     // 44892 -------> 2022-11-11
          //     newObj[enKey] = new Date(formatExcelDate(obj[zhkey]));
          //   } else {

          newObj[enKey] = obj[zhkey] ? obj[zhkey] : "";
          //newObj[mapInfo[s[keys]]] = obj[s[keys]] || "";
          //   }
        });

        return newObj;
      });
      return res;
    }

    function handelSuccess({ header, results, tab,Sheetlength }) {
      const reault = format(results);
      console.log(results);

      reault.forEach((item, key) => {
        if (key == 0) {
          return;
        }

        excelParams.initial();
        excelParams.FILE_NAME = fileName.value;
        excelParams.PROMO_ID = getCurrentPromoID.value;
        excelParams.PROMO_IDX = getCurrentPromoIDX.value;
        excelParams.A = item.A;
        excelParams.B = item.B != "" ? apiFormatExcelDate(item.B) : "";
        excelParams.C = item.C != "" ? apiFormatExcelDate(item.C) : "";
        excelParams.D = item.D;
        excelParams.E = item.E;
        excelParams.F = item.F;
        excelParams.G = item.G;
        excelParams.H = item.H;
        excelParams.I = item.I;
        excelParams.J = item.J;
        excelParams.K = item.K;
        excelParams.L = item.L;
        excelParams.M = item.M;
        excelParams.N = item.N;
        excelParams.O = item.O;
        excelParams.P = item.P;
        excelParams.Q = item.Q;
        excelParams.R = item.R;
        excelParams.S = item.S;
        excelParams.T = item.T;
         excelParams.U = item.U;
        //excelParams.V = apiToDecimal(item.V);
        excelParams.W = apiToDecimal(item.W);
        excelParams.X = item.X;
        excelParams.Y = item.Y;
        //excelParams.Z = item.Z;
        excelParams.AA = item.AA;
        excelParams.AB = item.AB;
        excelParams.AC = item.AC;
        excelParams.AD = item.AD;
        excelParams.AE = item.AE;
        excelParams.AF = item.AF;
        excelParams.AG = item.AG;
        excelParams.TABS = tab;
        store.dispatch("importExcel/importExcelMultiplePage", {
          ...excelParams,
        });

        if(reault.length==key+1){
          b2bEcItemParams.initial();
          b2bEcItemParams.ACTION_TYPE = 4;
          b2bEcItemParams.FILE_NAME=fileName.value;
          setTimeout(()=>{
             store.dispatch('importExcel/b2bEcItemAction',b2bEcItemParams).then((res)=>{
                 if (res.msg != "") {
                  error(res.msg);
                  return;
                }
                if (res.data[0].RTN_CODE > 0) {
                  error(res.data[0].RTN_MSG);
                } else {
                  // 成功
                  success(`第${tab+1}頁,匯入成功,共${reault.length-1}筆`);
                  ucItemParams.initial();
                  // 重新撈agGrid 資料
                  store.dispatch("fetchAgGridTpe2", ucItemParams);
                }
             });
          },500);
        };
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

    //判斷副檔名是不是 Excel
    function isExcel(file) {
      return /\.(xlsx|xls|csv)$/.test(file.name);
    }

    return {
      excelUploadInput: iptUploadExcel,
      handleDragover,
      handleDrop,
      handleUpload,
      loading,
      handleClick,
    };
  },
};
</script>

<template>
  <div>
    <input
      ref="excelUploadInput"
      type="file"
      accept=".xlsx,.xls"
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
        匯入採購版Excel
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
