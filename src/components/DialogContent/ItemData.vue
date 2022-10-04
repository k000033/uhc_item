<script>
import getAgGridData from "./getAgGridData.vue";
import { useStore } from "vuex";
import { computed } from "vue";
export default {
  components: {
    getAgGridData,
  },
  setup() {
    const store = useStore();
    const iframe_url = computed(() => {
      const data = store.getters["detailDialog/getAgGridData"];
      return `http://192.168.100.134/WORK/omo_Item/index.aspx?BARCODE=${data.BARCODE}&TYPE=10`;
    });
    return {
      iframe_url,
    };
  },
};
</script>

<template>
  <div>
    <div>
      <getAgGridData />
    </div>
    <div class="dContent">
      <iframe :src="iframe_url" frameborder="0"></iframe>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dContent {
    width: 100%;
   
     iframe{
         width: 100%;
          height: calc( 90vh - 52px - 100px);
     }
}
</style>
