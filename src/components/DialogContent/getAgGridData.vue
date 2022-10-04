<script>
import { computed } from "vue-demi";
import { useStore } from "vuex";
import Btn from "./Btn.vue";
export default {
  components: {
    Btn,
  },
  setup() {
    const store = useStore();
    const getAgGridData = computed(() => {
      return store.getters["detailDialog/getAgGridData"];
    });
    const getLineName = computed(() => {
      return store.getters["getCurrentLineName"];
    });

    const getDetailData = computed(() => {
      return store.getters["detailDialog/getDetailData"];
    });

    return {
      getAgGridData,
      getLineName,
      getDetailData,
      Btn,
    };
  },
};
</script>

<template>
<div>
  <div class="box">
     <btn />
  </div>
  <div class="dDetailContent" v-if="getDetailData">
    <table>
      <tr>
        <td class="width10P colName"><span>活動檔期</span></td>
        <td class="width30P" colspan="3">
          {{ getAgGridData.PROMO_NAME }}
        </td>

        <!-- 銷售活動別 -->
        <td class="width10P colName"><span>銷售活動別</span></td>
        <td class="width10P">{{ getAgGridData.ACTIVITY_NAME }}</td>
        <td class="width10P colName"><span>活動主題</span></td>
        <td class="width30P" colspan="3">{{ getAgGridData.SUBJECT }}</td>
      </tr>
      <tr>
        <td class="width10P colName"><span>貨號</span></td>
        <td class="width10P">{{ getAgGridData.PLU }}</td>
        <td class="width10P colName"><span>條碼</span></td>
        <td class="width10P">{{ getAgGridData.BARCODE }}</td>
        <td class="width10P colName"><span>大類碼</span></td>
        <td class="width10P">{{ getLineName }}</td>
        <td class="width10P colName"><span>稅別</span></td>
        <td class="width10P"></td>
        <td class="width10P colName"><span>箱入數</span></td>
        <td class="width10P">{{ getDetailData.data[0].BOX_QTY }}</td>
      </tr>
      <tr>
        <td class="width10P colName"><span>品名規格</span></td>
        <td class="width30P" colspan="3">
          {{ getAgGridData.ITEM_NAME }}
        </td>
        <td class="width10P colName"><span>供應商</span></td>
        <td class="width10P">{{ getAgGridData.VENDOR_NAME }}</td>
        <td class="width10P colName"><span>產品別</span></td>
        <td class="width10P">{{ getAgGridData.OMO_TYPE_NAME }}</td>
        <td class="width10P colName"><span>配送溫層</span></td>
        <td class="width10P"></td>
      </tr>
    </table>
  </div>
  </div>
</template>

<style lang="scss" scoped>
.box {
  background: #aaa;
  padding: 4px 8px;
  margin-bottom: 5px;
}


.dDetailContent {
  padding: 4px;
}
table {
  border-collapse: collapse;
  width: 100%;
  padding: 0 4px;
  tr {
    td {
      padding: 0 4px;
      border: 1px solid #ccc;
      color: black;
      //   height: 33px;
      white-space: nowrap;
      font-size: 9pt;
      &.width7p {
        width: 10%;
      }
      &.width10P {
        min-width: 79px;
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
      }

      &.tdEdit {
        background: #f1fa2b78;
      }

      &.tdTopic {
        text-align: center;
        height: 15px;
        background: #e1f3d8;
      }
    }
  }
}


</style>
