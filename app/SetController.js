/**
 * Created by ismikin on 23/11/14.
 */

'use strict'
var app = angular.module('SetController',['ngColorPicker'])

app.controller('SetController',  function($scope,$rootScope) {


    this.init = function(name,id){
        this.name=name;
        this.id=id;
        this.dices=[];
        this.editing = false;
        this.color = "rgba(225, 225, 225, 0.5)";
    };

    this.updateParent = function(){
        // I have to edit this part
        var myself;
        myself = {
            name: this.name,
            id: this.id,
            dices: this.dices,
            color: this.color
        };
        $rootScope.dataStore[this.name] = myself;
    };

    this.removeDice = function(idDice){
        var indexToRemove=null;
        $.each(this.dices, function(index,dice){
            if(dice.id == idDice)
                indexToRemove = index;
        });
        if(indexToRemove!=null)
            this.dices.splice(indexToRemove,1);
        this.updateParent();
    };


    this.changeName= function(nset){
        this.name =nset.name;
        this.changeEditing();
    };


    this.addDice = function(newDice){
      var toInsert = angular.copy(newDice);
        toInsert.id = Math.random();
      this.dices.push(toInsert);
        this.updateParent();
    };

    this.changeEditing = function(){
        this.editing = !this.editing;
    };

    this.setColor = function(){
        this.color=$scope.selected;
        this.updateParent();
    };

});