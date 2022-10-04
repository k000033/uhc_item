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
    <el-button type="primary" size="small">異動</el-button>
    <el-button type="primary" size="small">返回製作</el-button>

   </div>


</template>


<style lang="scss" scoped>
  .box{
    background: #003d96;
    padding: 4px 8px;
  }
</style>