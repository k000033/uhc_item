
<template>
  <router-view />
</template>

<style lang="scss">
* {
  padding: 0;
  margin: 0;
  list-style: none;
  box-sizing: border-box;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}
body {
  /* padding: 8px; */
  overflow: hidden;

}

/* Dialog */
.el-dialog__header {
  border-bottom: 1px solid #ccc !important;
  margin-right: 0px !important;
  padding: 1px 20px !important;
  background: #bddbfe66;
}
.el-dialog__header span {
  font-size: 14px !important;
}

.el-dialog__headerbtn {
  height: 20px !important;
}

.el-dialog__body {
  padding: 0px 0px !important;
}

/* Table */
.el-table__cell {
  padding: 1px 0 !important;
  font-size: 12px !important;
}

/*  drawer */
.el-drawer__header {
  padding: 0px !important;
  border-bottom: 1px solid !important;
  margin: 0  6px !important;
}
.el-drawer__body {
  padding: 0 0px !important;
  margin-top: 1px !important;
}
.el-table__body tr.current-row > td.el-table__cell {
  background: #c1daf6 !important;
}

/* tab */
.el-tabs__nav {
}
.el-tabs--card > .el-tabs__header .el-tabs__item:first-child {
}
.el-tabs__header
{
  margin: 0 0 0px !important;
}
.el-tabs__item{
  height: 25px !important;
  line-height: 25px !important;
  font-size: 12px !important;
}

.el-radio-button__original-radio:checked+.el-radio-button__inner
{
  color: #fff;
  background-color: #e6a23c !important;
  border: 1px solid #e6a23c !important;
  box-shadow: -1px 0 0 0 #e6a23c !important;
}

.el-radio
{
  margin-right: 15px !important;
}

.el-select__popper{
  z-index: 3400 !important;
}

.el-date-editor{
  width: 100% !important;
}

.el-popper
{
  z-index: 3400 !important;
}

 .editIng .el-input__inner
{
  background: #fff9ab !important;
} 
.el-input__inner
{
  box-shadow: 0 0 0 1px #aaa !important  ;
  width: 100%;
  font-size: 10pt !important;
  color:#000 !important;
}
.el-input__inner[disabled]
{
  background: #fff !important;
  color: #606266 !important;
}

.dSltSub .el-input--small .el-input__inner{
  height: 25px !important;
}

.el-select
{
  width: 100% !important;
}

.el-radio 
{
  color: #fff !important;
}
/* 
.el-drawer.ltr
{
   height: 400px !important;
   top:auto !important ;
} */
.el-input--small .el-input__inner 
{
  height: 22px !important;
}

 .dDialog_Tab .el-tabs__item
{
  font-size: 16px !important;
}

.el-notification__title
{
  font-size: 14px !important;
}
.el-dialog__close
{
  font-size: 20px !important; 
    color: red !important;
    border: 1px solid !important;
    border-radius: 9px !important;
    &:hover{
      color:  #79bbff !important;
    }
}

.el-select-dropdown__item
{
  font-size: 12px !important;
  height: 24px !important ;
}

.elInput .el-input__inner:read-only
{
   box-shadow: none !important;
}

.elSelect .el-input__inner:disabled
{
   box-shadow: none !important;
}

.elSelect .el-input__inner:disabled + .el-input__suffix
{
   display: none;
}

.dDialog .el-dialog__body{
      min-height: 412px;
}

.ag-watermark{
   display: none !important;
}

.dwarningDialog .el-dialog__header
{
  background: #fff !important;
  border: none !important;
  padding: 15px !important;
  padding-bottom: 10px !important;
}

.dwarningDialog .el-dialog__close{
  border: none !important;
  color: #909399 !important;
}
.dwarningDialog .el-dialog__headerbtn{
      padding-top: 5px !important;
}

.dwarningDialog .el-dialog__body
{
  min-height: 100%;
}

.el-tabs__item.is-active {
    color: var(--el-color-primary) !important;
}
.cbkAdd_Type .el-checkbox.el-checkbox--large
{
  height: 0 !important;
}

.editIng .el-select-v2__wrapper{
 background: #fff9ab !important;
}

.noMOM {
  color: red !important;
}

.el-autocomplete .el-input__inner{
  height: 22px !important;
}
</style>
