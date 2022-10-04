<script>
import { computed, defineAsyncComponent, ref } from "vue-demi";
import { useStore } from "vuex";
import { apiUseUhcItemParams } from "../api/index";
export default {
  setup() {
    const store = useStore();
    const currGid = ref("");
    const changeLead = ref(false);
    // const delItem
    const ucItemParams = new apiUseUhcItemParams();
    const openGroup = computed({
      get() {
        return store.getters["btnGroup/getOpenCreateGroup"];
      },
      set(val) {
        store.commit("btnGroup/setOpenCreateGroup", val);
      },
    });
    const GroupList = computed(() => {
      const data = store.getters["btnGroup/getGroupList"];
      if (data.data) {
        data.data.forEach((item) => {
          if (item.DOC_ID == item.GID) {
            currGid.value = item.GID;
          }
        });
      }

      return data;
    });

    const reFreshAgGridData = () => {
      ucItemParams.initial();
      store.dispatch("fetchAgGridTpe2", ucItemParams);
    };

    //更換Lead
    const GroupItemClick = (doc_id) => {
      currGid.value = doc_id;

      GroupList.value.data.forEach((item) => {
        ucItemParams.initial();
        ucItemParams.DOC_ID = item.DOC_ID;
        ucItemParams.GID = currGid.value;
        store.dispatch("btnGroup/btnCRUDGroup", { ...ucItemParams });
      });
      changeLead.value = true;
    };

    // //關閉Dialog
    const btnCancel_click = () => {
      if (changeLead.value) {
        reFreshAgGridData();
        changeLead.value = false;
      }
      openGroup.value = false;
    };

    // 刪除子項 doc_id == gid
    const btnDelItem = (doc_id) => {
      ucItemParams.initial();
      ucItemParams.DOC_ID = doc_id;
      ucItemParams.GID = doc_id;
      store
        .dispatch("btnGroup/btnCRUDGroup", { ...ucItemParams })
        .then((res) => {
          getGroupList();
          changeLead.value = true;
        });
    };
    // 取得群組資料
    const getGroupList = () => {
      ucItemParams.initial();
      ucItemParams.GID = currGid.value;
      store.dispatch("btnGroup/btnCRUDGroup", { ...ucItemParams });
    };

    // 按下確定，如果有更改Lead，則跑迴圈重新設定群組，並重新撈背後的AgGrid
    const ensure_click = () => {
      if (changeLead.value) {
        //  console.log(GroupList.value.data);
        //  GroupList.value.data.forEach((item)=>{
        //      ucItemParams.initial();
        //      ucItemParams.DOC_ID = item.DOC_ID;
        //      ucItemParams.GID = currGid.value;
        //      store.dispatch('btnGroup/btnCRUDGroup',{...ucItemParams});
        //
        //      openGroup.value = false;
        //  });
        reFreshAgGridData();
        changeLead.value = false;
      }
      openGroup.value = false;
    };

    return {
      openGroup,
      GroupList,
      GroupItemClick,
      currGid,
      btnCancel_click,
      btnDelItem,
      ensure_click,
    };
  },
};
</script>

<template>
  <el-dialog
    :destroy-on-close="true"
    v-model="openGroup"
    title="群組設定"
    :draggable="true"
    width="400px"
    @close="btnCancel_click"
  >
    <div class="content">
      <div class="topic">
        <span>設定lead</span>
      </div>
      <el-scrollbar height="268px">
        <div style="height: 268px">
          <ul>
            <li
              :class="['liGroupItem', { selected: item.DOC_ID == currGid }]"
              v-for="item in GroupList.data"
              :key="item.BARCODE"
              @click.stop="GroupItemClick(item.DOC_ID)"
            >
              <span class="spnIcon">
                <el-icon class="iconStar" v-show="item.DOC_ID == currGid"
                  ><StarFilled
                /></el-icon>
                <!-- <el-icon :size="17" v-show="item.DOC_ID != currGid" ><Star /></el-icon> -->
              </span>

              {{ item.BARCODE + " " + item.ITEM_NAME }}

              <el-icon class="iconDelete" @click.stop="btnDelItem(item.DOC_ID)"
                ><CircleClose
              /></el-icon>
            </li>
          </ul>
        </div>
      </el-scrollbar>
      <div class="dBtnGroup">
        <el-button @click="btnCancel_click">關閉</el-button>
        <!-- <el-button @click="btnCancel_click">取消</el-button> -->
      </div>
    </div>
  </el-dialog>
</template>


<style lang="scss" scoped>
.content {
  font-size: 12px;
  ul {
    height: 240px;
  }
  .topic {
    background: #003d96;
    color: #fff;
    padding: 4px 8px;
  }
  .liGroupItem {
    padding: 4px 8px;
    display: flex;
    align-items: center;
    cursor: pointer;
    &.selected {
      background: #add6f1;
    }
    &:hover {
      background: #d0e9fa;
    }
  }

  .spnIcon {
    display: flex;
    width: 20px;

    .iconStar {
      color: #ffff00;
      cursor: pointer;
      font-size: 16px;
    }
  }
  .iconDelete {
    margin-left: auto;
    margin-right: 10px;
    color: red;
    font-size: 18px;
  }

  .dBtnGroup {
    padding-bottom: 10px;
    text-align: center;
  }
}
</style>