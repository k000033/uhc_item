
import axios from 'axios'

const defineAxios = axios.create({
      baseURL: 'http://localhost/work/carryProject.ashx' //測試

      //baseURL: `${location.origin}/work/carryProject.ashx` //正式
});


export const useDefineAxios = (params) => {
    console.log('-- _NAME === ' + 'uhc.Item');
    console.log('-- _TYPE === ' + '');
    console.log('-- DOC_ID === ' + params.DOC_ID);
    console.log('-- PROMO_ID === ' + params.PROMO_ID);
    console.log('-- PROMO_IDX === ' + params.PROMO_IDX);
    console.log('-- PROMO_TYPE === ' + params.PROMO_TYPE);
    console.log('-- PAGE === ' + params.PAGE);
    console.log('-- DETAIL_PAGE === ' + params.DETAIL_PAGE);
    console.log('-- LINE_ID === ' + params.LINE_ID);
    console.log('-- UPDATE === ' + params.UPDATE);
    console.log('-- CODE_TYPE === ' + params.CODE_TYPE);
    console.log('-- CODE_VALUE === ' + params.CODE_VALUE);
    console.log('-- ACTION_TYPE === ' + params.ACTION_TYPE);
    console.log('-- USER_ID === ' + params.USER_ID);
    console.log('-- GID === ' + params.GID);
    console.log('-- D_DATE === ' + params.D_DATE);
    return defineAxios.get('', {
        params: {
            _NAME: 'uhc.Item',
            _TYPE: '',
            DOC_ID: params.DOC_ID,
            PROMO_ID: params.PROMO_ID,
            PROMO_IDX: params.PROMO_IDX,
            PROMO_TYPE: params.PROMO_TYPE,
            PAGE: params.PAGE,
            DETAIL_PAGE: params.DETAIL_PAGE,
            LINE_ID: params.LINE_ID,
            UPDATE: params.UPDATE,
            CODE_TYPE: params.CODE_TYPE,
            CODE_VALUE: params.CODE_VALUE,
            ACTION_TYPE: params.ACTION_TYPE,
            USER_ID: params.USER_ID,
            GID:params.GID,
            D_DATE:params.D_DATE
        }
    });
};


export const useImportExcelAxios =(params)=>{
    console.log('-- _NAME === ' + 'uhc.Item');
    console.log('-- _TYPE === ' + params._TYPE);
    console.log('-- FILE_NAME === ' + params.FILE_NAME);
    console.log('-- PROMO_ID === ' + params.PROMO_ID);
    console.log('-- PROMO_IDX === ' + params.PROMO_IDX);
    console.log('-- CRT_BY === ' + params.CRT_BY);
    console.log('-- ACTIVITY_TYPE_NAME === ' + params.ACTIVITY_TYPE_NAME);
    console.log('-- ITEM_ID === ' + params.ITEM_ID);
    console.log('-- BARCODE === ' + params.BARCODE);
    console.log('-- ITEM_NAME === ' + params.ITEM_NAME);
    console.log('-- SALE_B_DATE === ' + params.SALE_B_DATE);
    console.log('-- SALE_E_DATE === ' + params.SALE_E_DATE);
    console.log('-- COST === ' + params.COST);
    console.log('-- DISCOUNT === ' + params.DISCOUNT);
    console.log('-- PRICE === ' + params.PRICE);
    console.log('-- TAKE_TYPE_NAME === ' + params.TAKE_TYPE_NAME);
    console.log('-- SALE_QTY === ' + params.SALE_QTY);
    console.log('-- SALE_STOCK === ' + params.SALE_STOCK);
    console.log('-- SALE_ATTRIBUTE_ID === ' + params.SALE_ATTRIBUTE_ID);
    console.log('-- TAKE_ATTRIBUTE_ID === ' + params.TAKE_ATTRIBUTE_ID);
    console.log('-- TAKE_B_DAY === ' + params.TAKE_B_DAY);
    console.log('-- TAKE_E_DAY === ' + params.TAKE_E_DAY);
    console.log('-- TAKE_B_DATE === ' + params.TAKE_B_DATE);
    console.log('-- TAKE_E_DATE === ' + params.TAKE_E_DATE);
    console.log('-- MAIL === ' + params.MAIL);
    console.log('-- ORIGINAL_PRICE === ' + params.ORIGINAL_PRICE);
    console.log('-- SNO === ' + params.SNO);
    console.log('-- PROMO_TEXT === ' + params.PROMO_TEXT);
    console.log('-- SUBJECT === ' + params.SUBJECT);
    return defineAxios.get('',{params:{
      _NAME: 'uhc.Item',
      _TYPE:params._TYPE,
      FILE_NAME :params.FILE_NAME,
      PROMO_ID :params.PROMO_ID,
      PROMO_IDX :params.PROMO_IDX,
      CRT_BY : params.CRT_BY,
      ACTIVITY_TYPE_NAME : params.ACTIVITY_TYPE_NAME,
      ITEM_ID :params.ITEM_ID,
      BARCODE : params.BARCODE,
      ITEM_NAME : params.ITEM_NAME,
      SALE_B_DATE : params.SALE_B_DATE,
      SALE_E_DATE : params.SALE_E_DATE,
      COST : params.COST,
      DISCOUNT :params.DISCOUNT,
      PRICE : params.PRICE,
      TAKE_TYPE_NAME : params.TAKE_TYPE_NAME,
      SALE_QTY : params.SALE_QTY,
      SALE_STOCK : params.SALE_STOCK,
      SALE_ATTRIBUTE_ID : params.SALE_ATTRIBUTE_ID,
      TAKE_ATTRIBUTE_ID : params.TAKE_ATTRIBUTE_ID,
      TAKE_B_DAY : params.TAKE_B_DAY,
      TAKE_E_DAY : params.TAKE_E_DAY,
      TAKE_B_DATE : params.TAKE_B_DATE,
      TAKE_E_DATE : params.TAKE_E_DATE,
      MAIL : params.MAIL,
      ORIGINAL_PRICE:params.ORIGINAL_PRICE,
      SNO:params.SNO,
      PROMO_TEXT:params.PROMO_TEXT,
      SUBJECT:params.SUBJECT
    }
    })
}

export const useB2bEcItemAxios = (params)=>{
    console.log('-- _NAME === ' + 'uhc.Item');
    console.log('-- _TYPE === ' + params._TYPE);
    console.log('-- ACTION_TYPE === ' + params.ACTION_TYPE);
    console.log('-- FILE_NAME === ' + params.FILE_NAME);
    console.log('-- USER_ID === ' + params.USER_ID);
    return defineAxios.get('',{params:{
        _NAME: 'uhc.Item',
        _TYPE:params._TYPE,
        ACTION_TYPE :params.ACTION_TYPE,
        FILE_NAME :params.FILE_NAME,
        USER_ID :params.USER_ID,
    }})
}

export const useAddItemAxios = (params)=>{
    console.log('-- _NAME === ' + 'uhc.Item');
    console.log('-- _TYPE === ' + params._TYPE);
    console.log('--  TYPE === ' + params.TYPE);
    console.log('--  ACTION_TYPE === ' + params.ACTION_TYPE);
    console.log('--  PROMO_ID === ' + params.PROMO_ID);
    console.log('--  LINE_ID === ' + params.LINE_ID);
    console.log('--  DOC_ID === ' + params.DOC_ID);
    console.log('--  USER_ID === ' + params.USER_ID);
    return defineAxios.get('',{params:{
        _NAME:"uhc.Item",
        _TYPE:params._TYPE,
        TYPE:params.TYPE,
        ACTION_TYPE:params.ACTION_TYPE,
        PROMO_ID:params.PROMO_ID,
        LINE_ID:params.LINE_ID,
        DOC_ID:params.DOC_ID,
        USER_ID:params.USER_ID
    }})
}

export const useExcelMultiplePageAxios = (params)=>{
    console.log('-- _NAME === ' + 'uhc.Item_2');
    console.log('-- _TYPE === ' + params._TYPE);
    console.log('-- FILE_NAME === ' + params.FILE_NAME);
    console.log('-- PROMO_ID === ' + params.PROMO_ID);
    console.log('-- PROMO_IDX === ' + params.PROMO_IDX);
    console.log('-- A === ' + params.A);
    console.log('-- B === ' + params.B);
    console.log('-- C === ' + params.C);
    console.log('-- D === ' + params.D);
    console.log('-- E === ' + params.E);
    console.log('-- F === ' + params.F);
    console.log('-- G === ' + params.G);
    console.log('-- H === ' + params.H);
    console.log('-- I === ' + params.I);
    console.log('-- J === ' + params.J);
    console.log('-- K === ' + params.K);
    console.log('-- L === ' + params.L);
    console.log('-- M === ' + params.M);
    console.log('-- N === ' + params.N);
    console.log('-- O === ' + params.O);
    console.log('-- P === ' + params.P);
    console.log('-- Q === ' + params.Q);
    console.log('-- R === ' + params.R);
    console.log('-- S === ' + params.S);
    console.log('-- T === ' + params.T);
    console.log('-- U === ' + params.U);
    //console.log('-- V === ' + params.V);
    console.log('-- W === ' + params.W)
    console.log('-- X === ' + params.X);
    console.log('-- Y === ' + params.Y);
    //console.log('-- Z === ' + params.Z);
    console.log('-- AA === ' + params.AA);
    console.log('-- AB === ' + params.AB);
    console.log('-- AC === ' + params.AC);
    console.log('-- AD === ' + params.AD);
    console.log('-- AE === ' + params.AE);
    console.log('-- AF === ' + params.AF);
    console.log('-- AG === ' + params.AG);
    console.log('-- CRT_BY === ' + params.CRT_BY);
    console.log('-- TABS === ' + params.TABS);
    return defineAxios.get('',{params:{
        _NAME:"uhc.Item_2",
        _TYPE:params._TYPE,
        FILE_NAME:params.FILE_NAME,
        PROMO_ID:params.PROMO_ID,
        PROMO_IDX:params.PROMO_IDX,
        A:params.A,
        B:params.B,
        C:params.C,
        D:params.D,
        E:params.E,
        F:params.F,
        G:params.G,
        H:params.H,
        I:params.I,
        J:params.J,
        K:params.K,
        L:params.L,
        M:params.M,
        N:params.N,
        O:params.O,
        P:params.P,
        Q:params.Q,
        R:params.R,
        S:params.S,
        T:params.T,
        U:params.U,
       // V:params.V,
        W:params.W,
        X:params.X,
        Y:params.Y,
       // Z:params.Z,
        AA:params.AA,
        AB:params.AB,
        AC:params.AC,
        AD:params.AD,
        AE:params.AE,
        AF:params.AF,
        AG:params.AG,
        CRT_BY:params.CRT_BY,
        TABS:params.TABS
    }})
}


export const useEmportExcelAxios = (params)=>{
    console.log('-- _NAME === ' + 'uhc.Item_2');
    console.log('-- _TYPE === ' + 'INSERT');
    console.log('--  ID === ' + params.ID);
    console.log('--  DOC_ID === ' + params.DOC_ID);
    console.log('--  USER_ID === ' + params.CRT_BY);
    return defineAxios.get('',{params:{
        _NAME:"uhc.Item_2",
        _TYPE:'INSERT',
        ID:params.ID,
        DOC_ID:params.DOC_ID,
        USER_ID:params.CRT_BY
    }})
}
