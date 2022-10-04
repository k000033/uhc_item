<script>
import { computed, ref } from "vue-demi";
import { useStore } from "vuex";
import getAgGridData from "./getAgGridData.vue";
import { apiUseUhcItemParams } from "../../api/index";
import {Delete} from '@element-plus/icons-vue'
import {apiUseAgGridHandel} from '../../componentAPI/index'
export default {
  components: {
    getAgGridData
  },
  setup() {
    const store = useStore();  
    // 紀錄群族頭的ID
    const currGid = ref("");
    const {getGroupData} = apiUseAgGridHandel();
    const ucItemParams = new apiUseUhcItemParams();

    const GroupList = computed(() => {
      const data = store.getters["btnGroup/getGroupList"];
      if (data.data) {
        //尋找DOC_ID == itemGID 代表是群組的頭
        data.data.forEach((item) => {
          if (item.DOC_ID == item.GID) {
            currGid.value = item.GID;
          }
        });
      }
      return data;
    });
      
    // 設定群族的頭
    const rowclick = (item) => {
      currGid.value = item.DOC_ID;
      console.log(item);
      GroupList.value.data.forEach((x) => {
        ucItemParams.initial();
        ucItemParams.DOC_ID = x.DOC_ID;
        ucItemParams.GID = item.DOC_ID;
        store.dispatch("btnGroup/btnCRUDGroup", { ...ucItemParams });
      });
      store.commit("setAgGridIsReLoad", true);
    };

        // 取得群組資料
    // const getGroupList = () => {
    //   ucItemParams.initial();
    //   ucItemParams.GID = currGid.value;
    //   store.dispatch("btnGroup/btnCRUDGroup", { ...ucItemParams });
    // };
    
    // 刪除群族的成員
    const delGroupItem = (doc_id)=>{
      ucItemParams.initial();
      ucItemParams.DOC_ID = doc_id;
      ucItemParams.GID = doc_id;
      store
        .dispatch("btnGroup/btnCRUDGroup", { ...ucItemParams })
        .then((res) => {
        //   getGroupList();
        getGroupData(currGid.value)
        store.commit("setAgGridIsReLoad", true);
        });
    };

    //    //更換Lead
    //     const GroupItemClick = (doc_id) => {
    //       currGid.value = doc_id;

    //       GroupList.value.data.forEach((item) => {
    //         ucItemParams.initial();
    //         ucItemParams.DOC_ID = item.DOC_ID;
    //         ucItemParams.GID = currGid.value;
    //         store.dispatch("btnGroup/btnCRUDGroup", { ...ucItemParams });
    //       });
    //       changeLead.value = true;
    //     };

    return { GroupList, currGid, rowclick,Delete,delGroupItem };
  },
};
</script>

<template>
  <div>
    <div>
      <getAgGridData />
    </div>
    <div>
      <div class="dGroupContent">
        <el-table
          :data="GroupList.data"
          style="width: 100%"
          :border="true"
          @row-click="rowclick"
        >
          <el-table-column width="70" align="center" prop="BARCODE">
            <template #header>
              <span>主</span>
            </template>
            <template #default="scope">
              <el-icon
                v-show="scope.row.DOC_ID == currGid"
                class="iconStart"
                :size="17"
                ><StarFilled
              /></el-icon>
            </template>
          </el-table-column>
          <el-table-column prop="BARCODE" label="條碼" sortable width="150" />
          <el-table-column prop="ITEM_NAME" label="商品名稱" sortable />
          <el-table-column width="60" align="center">
            <template #header>
              <span>刪除</span>
            </template>
             <template #default="scope">
               <el-button type="danger" :icon="Delete" circle size="small" @click.stop="delGroupItem(scope.row.DOC_ID)"/>
             </template>
          </el-table-column>
        </el-table>
        <!-- <ul>
               <li v-for="(item,key) in GroupList.data" :key="item.DOC_ID">
                   <span>{{item.BARCODE}} {{item.ITEM_NAME}}</span>
               </li>
           </ul> -->
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dGroupContent {
  padding: 4px;
  table {
    th {
      background: #eee !important;
      color: black !important;
    }

    td {
      color: black !important;

      .iconStart {
        vertical-align: sub;
        color: #e1c711;
      }
    }
  }
}
</style>
