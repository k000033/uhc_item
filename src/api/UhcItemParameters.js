const getHubUrl = new URL(window.location.href);
let username = new URL(`https://1.com?${getHubUrl.href.split("?")[1]}`).searchParams.get("username");


export const useUhcItemParams = function () {
    this._TYPE = "";
    this.DOC_ID = "";
    this.PROMO_ID = "";
    this.PROMO_IDX = "";
    this.PROMO_TYPE = "";
    this.PAGE = "";
    this.DETAIL_PAGE = "";
    this.LINE_ID = "";
    this.UPDATE = "";
    this.CODE_TYPE = "";
    this.CODE_VALUE = "";
    this.ACTION_TYPE = "";
    this.USER_ID = `${username}`;
    this.GID = '';
    this.D_DATE='';
};

useUhcItemParams.prototype.initial = function () {
    this._TYPE = "";
    this.DOC_ID = "";
    this.PROMO_ID = "";
    this.PROMO_IDX = "";
    this.PROMO_TYPE = "";
    this.PAGE = "";
    this.DETAIL_PAGE = ""; 
    this.LINE_ID = "";
    this.UPDATE = "";
    this.CODE_TYPE = "";
    this.CODE_VALUE = "";
    this.ACTION_TYPE = "";
    this.GID = "";
    this.D_DATE='';
};
// Excel 參數
export const useExcelParams = function () {
    this._TYPE = 'INSERT';
    // this.DOC_ID="";
    this.FILE_NAME = "";
    this.PROMO_ID = "";
    this.PROMO_IDX = "";
    this.CRT_BY = `${username}`;
    this.ACTIVITY_TYPE_NAME = '';
    this.ITEM_ID = '';
    this.BARCODE = '';
    this.ITEM_NAME = '';
    this.SALE_B_DATE = '';
    this.SALE_E_DATE = '';
    this.COST = '';
    this.DISCOUNT = '';
    this.PRICE = '';
    this.TAKE_TYPE_NAME = '';
    this.SALE_QTY = '';
    this.SALE_STOCK = '';
    this.SALE_ATTRIBUTE_ID = '';
    this.TAKE_ATTRIBUTE_ID = '';
    this.TAKE_B_DAY = '';
    this.TAKE_E_DAY = '';
    this.TAKE_B_DATE = '';
    this.TAKE_E_DATE = '';
    this.MAIL = '';
    this.ORIGINAL_PRICE='';
    this.SNO='';
};

useExcelParams.prototype.initial = function () {
    this.FILE_NAME = "";
    this.PROMO_ID = "";
    this.PROMO_IDX = "";
    this.ACTIVITY_TYPE_NAME = '';
    this.ITEM_ID = '';
    this.BARCODE = '';
    this.ITEM_NAME = '';
    this.SALE_B_DATE = '';
    this.SALE_E_DATE = '';
    this.COST = '';
    this.DISCOUNT = '';
    this.PRICE = '';
    this.TAKE_TYPE_NAME = '';
    this.SALE_QTY = '';
    this.SALE_STOCK = '';
    this.SALE_ATTRIBUTE_ID = '';
    this.TAKE_ATTRIBUTE_ID = '';
    this.TAKE_B_DAY = '';
    this.TAKE_E_DAY = '';
    this.TAKE_B_DATE = '';
    this.TAKE_E_DATE = '';
    this.MAIL = '';
    this.ORIGINAL_PRICE='';
    this.SNO='';
    this.SUBJECT='';
    this.PROMO_TEXT='';    
}

//匯入EXCEL後 要執行的
export const useB2bEcItemParams = function () {
    this._TYPE = 'UPDATE';
    this.ACTION_TYPE = '';
    this.FILE_NAME = '';
    this.USER_ID = `${username}`;
};

useB2bEcItemParams.prototype.initial = function () {
    this.FILE_NAME = '';
    this.ACTION_TYPE = '';
}

// 新增
export const useAddItemParams = function(){
    this._TYPE = 'Delete';
    this.TYPE="";
    this.ACTION_TYPE="";
    this.PROMO_ID="";
    this.LINE_ID="";
    this.DOC_ID="";
    this.USER_ID =`${username}`;
};  

useAddItemParams.prototype.initial = function(){
    this.TYPE='';
    this.ACTION_TYPE="";
    this.PROMO_ID="";
    this.LINE_ID="";
    this.DOC_ID="";
};


//多PAGE EXCEL
export const useExcelMultiplePageParams =function(){
    this._TYPE="";
    this.FILE_NAME="";
    this.PROMO_ID ="";
    this.PROMO_IDX="";
    this.A="";
    this.B="";
    this.C="";
    this.D="";
    this.E="";
    this.F="";
    this.G="";
    this.H="";
    this.I="";
    this.J="";
    this.K="";
    this.L="";
    this.M="";
    this.N="";
    this.O="";
    this.P="";
    this.Q="";
    this.R="";
    this.S="";
    this.T="";
    this.U="";
    //this.V="";
    this.W="";
    this.X="";
    this.Y="";
    //this.Z="";
    this.AA="";
    this.AB="";
    this.AC="";
    this.AD="";
    this.AE="";
    this.AF="";
    this.AG="";
    this.CRT_BY=`${username}`;
    this.TABS="";
}

useExcelMultiplePageParams.prototype.initial = function(){
    this.FILE_NAME="";
    this.PROMO_ID ="";
    this.PROMO_IDX="";
    this.A="";
    this.B="";
    this.C="";
    this.D="";
    this.E="";
    this.F="";
    this.G="";
    this.H="";
    this.I="";
    this.J="";
    this.K="";
    this.L="";
    this.M="";
    this.N="";
    this.O="";
    this.P="";
    this.Q="";
    this.R="";
    this.S="";
    this.T="";
    this.U="";
    //this.V="";
    this.W="";
    this.X="";
    this.Y="";
    //this.Z="";
    this.AA="";
    this.AB="";
    this.AC="";
    this.AD="";
    this.AE="";
    this.AF="";
    this.AG="";
    this.TABS="";
}

export class useExportExcelParams{
    constructor(){
        this.ID="";
        this.DOC_ID="";
        this.CRT_BY=`${username}`;
    }

    inital(){
        this.ID="";
        this.DOC_ID="";
    }
}

