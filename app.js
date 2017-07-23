'use strict';

angular.module('myApp', [])
    .controller('MainController', function($scope, $http, $compile) {
        
        //Get all Companies
        $scope.getCompanies = function(){
            $http.get('http://localhost:5000/api/company')
            .then(function(result){
                $scope.draw(result);
            });
        };    
        
        //Remove already built tree
        $scope.removeTree = function(){
            var companiesTreeNode = angular.element('#companiesTree')[0];
            while (companiesTreeNode.firstChild) {
                companiesTreeNode.removeChild(companiesTreeNode.firstChild);
            }
        };    
        
        //Method prepare tree to be drawed
        $scope.draw = function(result){
            $scope.removeTree();
            $scope.companies = result.data;
            console.log(result);
            $scope.padding=0;
            $scope.companies.forEach(function(item){
                if (item.parentId == undefined){
                    $scope.drawCompany(item);
                    $scope.drawTree(item);
                }
            });
        };    
    
        //Method draw companies tree
        $scope.drawTree = function(company){
            $scope.padding+=20;
            $scope.companies.forEach(function(item){
                if (item.parentId == company._id){
                    $scope.drawCompany(item);
                    $scope.drawTree(item);
                }
            })
            $scope.padding-=20;
        };
    
        //Method append company data in html
        $scope.drawCompany = function(item){
            var companiesTreeElm = angular.element($('#companiesTree'));
            
            var buttons = $scope.drawButtons(item);
            
            var elm = "<div><span style='padding-left:" + $scope.padding + "px; padding-right:20px;'>" + item.name + " | " + item.earnings + " | " + item.allEarnings+"</span>" + buttons + "<br/></div>";
            
            angular.element(companiesTreeElm).append($compile(elm)($scope));
        };
        
        //Method append delete, add, edit buttons
        $scope.drawButtons = function(item){
            var buttonPlus = 
            '<span class="glyphicon glyphicon-plus" aria-hidden="true" ng-click="this.modalAddShow(\''+item._id+'\')"></span>';
            
            var buttonMinus =
            '</span><span class="glyphicon glyphicon-remove" aria-hidden="true" ng-click="this.deleteCompany(\''+item._id+'\')"></span>';
            
            var buttonEdit = 
            '</span><span class="glyphicon glyphicon-pencil" aria-hidden="true" ng-click="this.modalEditShow(\''+item._id+'\')"></span>';
            
            var buttons = buttonPlus + buttonMinus + buttonEdit;
            
            return buttons;
        };
        
        //Find company by ID
        $scope.findCompany = function(id){
            if(id == undefined){
                $scope.currCompany = {_id: undefined};
                return;
            }
            $scope.companies.forEach(function(item){
                if(""+item._id == ""+id){
                    console.log(item);
                    $scope.currCompany = item;
                }
            });
        };
        
        //Invoke modal for adding company
        $scope.modalAddShow = function(id){
            $scope.findCompany(id);
            $scope.modalMode = "add";
            angular.element('.btn-primary').text("Add new");
            angular.element('.modal-name-input')[0].value = "";
            $scope.modalName = "";
            angular.element('.modal-earnings-input')[0].value = "";
            $scope.modalEarnings = "";
            angular.element('#myModal').css('display', 'block');
        };
        
        //invoke modal for editing
        $scope.modalEditShow = function(id){
            $scope.findCompany(id);
            $scope.modalMode = "edit";
            angular.element('.btn-primary').text("Edit");
            angular.element('.modal-name-input')[0].value = $scope.currCompany.name;
            $scope.modalName = $scope.currCompany.name;
            angular.element('.modal-earnings-input')[0].value = $scope.currCompany.earnings;
            $scope.modalEarnings = $scope.currCompany.earnings;
            angular.element('#myModal').css('display', 'block');
        };
        
        //Close Modal
        $scope.modalClose = function() {
            angular.element('#myModal').css('display', 'none');
        }
        
        //Send company Data
        $scope.sendCompany = function() {
            if($scope.modalMode == "edit"){
                $scope.editCompany();
            }else if($scope.modalMode == "add"){
                $scope.addCompany();
            }
            setTimeout($scope.modalClose,1500);
        }
        
        //Send company data to add
        $scope.addCompany = function(){
            $http({
                method: 'POST',
                url: 'http://localhost:5000/api/company',
                data: {name: $scope.modalName, earnings: $scope.modalEarnings, parentId: $scope.currCompany._id},
                headers: {
                    'Content-type': 'application/json;charset=utf-8'
                }
            }).then(result => $scope.getCompanies());
        };
        
        //Send company data to edit
        $scope.editCompany = function(){
            $http({
                method: 'PUT',
                url: 'http://localhost:5000/api/company',
                data: {_id: $scope.currCompany._id, name: $scope.modalName, earnings: $scope.modalEarnings},
                headers: {
                    'Content-type': 'application/json;charset=utf-8'
                }
            }).then(result => $scope.draw(result));
        };
        
        //Delete company data
        $scope.deleteCompany = function(id){
            $http({
                method: 'DELETE',
                url: 'http://localhost:5000/api/company',
                data: {
                    _id: id
                },
                headers: {
                    'Content-type': 'application/json;charset=utf-8'
                }
            }).then(result => $scope.draw(result));
        };
        
        $scope.getCompanies();
    });