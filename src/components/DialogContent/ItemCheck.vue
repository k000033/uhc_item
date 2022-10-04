<script>
import { computed } from "vue-demi";
import { useStore } from "vuex";
import getAgGridData from "./getAgGridData.vue";
export default {
  components: {
    getAgGridData,
  },
  setup() {
    const store = useStore();
    const getItemCheckData = computed(() => {
      return store.getters["detailDialog/getItemCheckData"];
    });
    
    const tableRowClassName = ({row,rowIndex})=>{
      console.log(row);
      if(row.ERR_TYPE >1){
        return 'error'
      }else{
        return ''
      }
    }

    return {
      getItemCheckData,
      tableRowClassName
    };
  },
};


</script>

<template>
<el-scrollbar class="scrollbar">
  <div>
    <div>
      <getAgGridData />
    </div>
    <div class="dContent">
      <el-table :data="getItemCheckData.data" style="width: 100%" :border="true" :row-class-name="tableRowClassName">
        <el-table-column  prop="ERR_TYPE" label="訊息編號" sortable width="100"  />
        <el-table-column  prop="ERR_MESSAGE" label="訊息" sortable  />
        <el-table-column  prop="ERR_MEMO" label="說明" sortable />
        <el-table-column  prop="ERR_TYPE_NAME" label="訊息別" sortable width="100"  />
      </el-table>
    </div>
  </div>
</el-scrollbar>
</template>


<style lang="scss" >
.dContent
{
    
    padding: 4px;
    table{
      th{
        background: #eee !important;
        color: black !important;
      }

      td{
           color: black !important;
      }
    }
       .error td{
      
        color: red !important;
 
    }

}
.scrollbar {
  padding-bottom: 10px;
  width: 100%;
  height: calc(100vh - 26px - 40px);
}

</style>