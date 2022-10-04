<script>
import AgGridType2 from '../../components/AgGridType2.vue'
export default {
  components:{
      AgGridType2
  },
  setup(){
      return{

      }
  }
}
</script>

<template>
   <div class="box">
    <el-button type="primary" size="small">同意</el-button>
    <el-button type="primary" size="small">在議</el-button>
    <el-button type="primary" size="small">拒絕</el-button>
   </div>


</template>


<style lang="scss" scoped>
  .box{
    background: #003d96;
    padding: 4px 8px;
  }
</style>