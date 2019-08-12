(function () {
   'use strict'
   angular.module('WeViews').controller('MainRoleRoleaddController',MainRoleRoleaddController)
   function MainRoleRoleaddController($uibModalInstance,RoleService,edit,$rootScope,Message) {
       var vm = this

       edit === '' ? vm.characterName = '' : vm.characterName = edit.name //名称
       edit === '' ? vm.remarks = '' :  vm.remarks = edit.description //备注

       vm.funsId = '' //列表id
       vm.userId = $rootScope.userInfo.userId

       vm.list = [
           { name: '精简看板', id: "1", checked: false },
           { name: '大数据展示', id: "2", checked: false },
           { name: '位置监控', id: "3", checked: false },
           {
               name: '全选', id: ["8"], checked: false, label: '主动安全',
               children: [
                   { name: '变更驾驶员', id: "8", checked: false }
               ]
           },
           {
               name: '全选', id: ["9", "10"], checked: false, label: '基本信息',
               children: [
                   { name: '车辆安全列表', id: "9", checked: false },
                   { name: '驾驶员信息', id: "10", checked: false }
               ]
           },
           {
               name: '全选', id: ["11", "12"], checked: false, label: '报表管理',
               children: [
                   { name: '车辆安全排名', id: "11", checked: false },
                   { name: '车辆报警历史记录', id: "12", checked: false }
               ]
           },
           {
               name: '全选', id: ["13", "14", "15"], checked: false, label: '报警中心',
               children: [
                   { name: 'ADAS事件设置', id: "13", checked: false },
                   { name: 'DMS事件设置', id:"14", checked: false },
                   { name: '驾驶行为事件设置', id: "15", checked: false }
               ]
           },
           {
               name: '全选', id: ["17","18","19"], checked: false, label: '载重监控',
               children: [
                   { name: '载重预警大屏', id: "17", checked: false },
                   { name: '载重实时监控', id: "18", checked: false },
                   { name: '历史载重分析', id: "19", checked: false }
               ]
           },
           {
               name: '全选', id: ["21", "22"], checked: false, label: '平台管理',
               children: [
                   { name: '角色管理', id: "21", checked: false },
                   { name: '账号管理', id: "22", hecked: false }
               ]
           }
       ]

       /* 获取权限id */
       vm.getFuncIds = function(item){
           if(item.children){
               if(item.checked){
                   item.children.forEach(function (i) {
                       vm.funsId = vm.funsId.replace(i.id+',','')
                       i.checked = true
                   })
                   vm.funsId += item.id + ','
               }else{
                   item.children.forEach(function (i) {
                       i.checked = false
                   })
                   vm.funsId = vm.funsId.replace(item.id+',','')
               }
           }else{
               cancelAllChoose(vm.list)
               if(item.checked){
                   vm.funsId += item.id + ','
               }else{
                   vm.funsId = vm.funsId.replace(item.id+',','')
               }
           }
           return vm.funsId
       }

       /* 取消全选状态 */
       function cancelAllChoose(list) {
           for(var i in list){
               var isCheck = [];
               if(list[i].children){
                   list[i].children.forEach(function (item) {
                       if(!item.checked){
                           isCheck.push("0")
                       }else{
                           isCheck.push("1")
                       }
                   })
                   if(isCheck.indexOf('0')!=-1){
                       list[i].checked = false
                   }else {
                       list[i].checked = true
                   }
               }
           }
       }

       /* 判断编辑页面权限项是否选中 */
       function editChoose(list){
           if(edit !== ''){
               for(var i in list){
                   var isCheck = [];
                   if(list[i].children){
                       list[i].children.forEach(function (item) {
                           if(edit.context.split(',').includes(item.id)){
                               item.checked = true
                               isCheck.push("1")
                               vm.funsId += item.id +','
                           }else {
                               isCheck.push("0")
                           }
                       })
                       if(isCheck.indexOf('0')!=-1){
                           list[i].checked = false
                       }else {
                           list[i].checked = true
                       }
                   }else {
                       if(edit.context.split(',').includes(list[i].id)){
                           list[i].checked = true
                           vm.funsId += list[i].id +','
                       }
                   }
               }
           }
       }
       editChoose(vm.list)

       /* 新增 */
       vm.submit = function (event) {
           event.preventDefault()
           if(edit === ''){
               RoleService.addRole(vm.characterName, vm.remarks, vm.funsId,vm.userId)
                   .then(function () {
                       $uibModalInstance.close()
                       vm.funsId = []
                   })
                   .catch(function (err) {
                       Message.error('请至少选择一个菜单项')
                   })
           }else{
               RoleService.editRole(vm.characterName, vm.remarks, vm.funsId,edit.id,vm.userId)
                   .then(function () {
                       $uibModalInstance.close()
                   })
                   .catch(function (err) {
                       Message.error(err.message)
                   })
           }
       }

       /* 关闭新增 */
       vm.cancel = function () {
           $uibModalInstance.dismiss("cancel")
       }
   }
})();
