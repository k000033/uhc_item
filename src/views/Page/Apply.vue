<script>
import { computed, ref, watch } from "vue-demi";
import { useStore } from "vuex";
import uploadExcel from "../../components/uploadExcel.vue";
import { apiUseUhcItemParams } from "../../api/index";
export default {
  components: {
    uploadExcel,
  },
  setup() {
    const store = useStore();
    const tabPosition = ref("10");
    const ucItemParams = new apiUseUhcItemParams();
    watch(tabPosition, (newValue) => {
      // console.log(newValue);
      ucItemParams.initial();
      store.dispatch("fetchAgGridTpe2", ucItemParams);
      store.commit("setCurrentPage", newValue);
    });

    const btnGroupAction = (action_type) => {
      //  ucItemParams.initial();
      //  ucItemParams.ACTION_TYPE = action_type;
      //  store.dispatch('')
      const selectedRows = window.gridApi.getSelectedRows();
      console.log(selectedRows);
      selectedRows.forEach((rows, key) => {
        ucItemParams.initial();
        ucItemParams.ACTION_TYPE = action_type;
        ucItemParams.DOC_ID = rows.DOC_ID;
        store
          .dispatch("btnGroup/btnGroupAction", { ...ucItemParams })
          .then((res) => {
            if (key == selectedRows.length - 1) {
              ucItemParams.initial();
              store.dispatch("fetchAgGridTpe2", ucItemParams);
            }
          });
      });
    };

    return { tabPosition, btnGroupAction };
  },
};
</script>

<template>
  <div class="box">
    <div class="apply">
      <div class="dRadio">
        <el-radio v-model="tabPosition" label="10" size="small"
          >待揀選</el-radio
        >
        <el-radio v-model="tabPosition" label="11" size="small"
          >已揀選</el-radio
        >
        <el-radio v-model="tabPosition" label="12" size="small">拒絕</el-radio>
        <el-radio v-model="tabPosition" label="13" size="small"
          >退回修改</el-radio
        >
        <el-radio v-model="tabPosition" label="14" size="small">刪除</el-radio>
      </div>
      <div class="btnGroup" v-show="tabPosition == 10">
        <el-button type="primary" size="small" @click="btnGroupAction(1)"
          >揀選</el-button
        >
        <el-button type="primary" size="small" @click="btnGroupAction(4)"
          >退回修改</el-button
        >
        <el-button type="primary" size="small" @click="btnGroupAction(7)"
          >拒絕</el-button
        >
        <el-button type="primary" size="small">刪除</el-button>

        <uploadExcel v-show="tabPosition == 10" />
      </div>
    </div>
  </div>
</template>


<style lang="scss" scoped>
.box {
  height: 100%;
  display: flex;
  background: #003d96;
  padding: 4px 8px;
  color: #fff;
  .dRadio {
    border-right: 1px dashed #304cbe;
    margin-right: 10px;
  }

  .btnGroup {
    display: flex;
  }

  .elementHide {
    display: none;
  }
}
</style>