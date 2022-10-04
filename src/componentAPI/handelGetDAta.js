import { useStore } from "vuex";
import { apiUseUhcItemParams } from "../api/index";


export const useAgGridHandel = ()=>{
    const UcItemParams = new apiUseUhcItemParams();
    const store = useStore();
    
    //打api  取得 品項 AgGrid資料
    const fetchAgGridData=()=>{
      UcItemParams.initial();
      store.dispatch("fetchAgGridTpe2", UcItemParams)
    }
     
    // 取得品項的明細資料
    const getDetail = (doc_id)=>{
      UcItemParams.initial();
      UcItemParams.DOC_ID =doc_id;
      UcItemParams.DETAIL_PAGE = 1;
      store.dispatch("detailDialog/fetchDetailData", { ...UcItemParams });
    };

    //打api 取得 群組資料
    const getGroupData = (guid)=>{
      UcItemParams.initial();
      UcItemParams.GID = guid;
      store.dispatch("btnGroup/btnCRUDGroup", { ...UcItemParams });
    };
    
    //單品檢核
      const itemCheckAction = (doc_id)=>{
      UcItemParams.initial();
      UcItemParams.DOC_ID = doc_id;
      UcItemParams.DETAIL_PAGE = 3;
      store.dispatch("detailDialog/fetchItemCheckData", { ...UcItemParams });
    }

   return {fetchAgGridData,getGroupData,itemCheckAction,getDetail}
};