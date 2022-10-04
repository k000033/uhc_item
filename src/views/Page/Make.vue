<script>
import { apiUseUhcItemParams } from "../../api/index";
import { useStore } from "vuex";
export default {
  components: {

  },
  setup() {
    
    return {};
  },
};
</script>

<template>
  <div class="box">
    <!-- <AgGridType2 /> -->
    <el-button type="primary" size="small">新增</el-button>
    <el-button type="primary" size="small" > 退回申請</el-button>
    <el-button type="primary" size="small">刪除</el-button>
  </div>
</template>


<style lang="scss" scoped>
  .box{
    background: #003d96;
    padding: 4px 8px;
  }
</style>