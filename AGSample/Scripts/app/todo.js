/// <reference path="~/Scripts/angular.min.js" />
/// <reference path="~/Scripts/angular-resource.js" />

var todoApp = angular.module('todoApp', ['ngResource']);

todoApp.controller("TodoCtrl", function ($scope, $resource) {
    var todoClass = $resource('/api/Todoes/:id', { id: '@Id' }, { 'update': { method: 'PUT' } });
    $scope.todos = todoClass.query();

    // set watch listener for each items to Update 
    var deWatchTodo = new Array();
    $scope.$watchCollection("todos", function (newVal) {
        angular.forEach(deWatchTodo, function (value, key) { value(); });   //cleaer watch
        deWatchTodo = [];
        // set watcher each item
        angular.forEach(newVal, function (value, key) {
            var deregistration = $scope.$watch("todos[" + key + "]", function (newVal, oldVal, scope) {
                if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
                    todoClass.update(newVal.Id, newVal);
                }
            }, true);
            deWatchTodo.push(deregistration);
        });
    });
    
    $scope.addTodo = function () {
        todoClass.save({ Text: $scope.todoText, Done: false }, function (result) {
            $scope.todos.push(result);
        });
        $scope.todoText = '';
    };

    $scope.remaining = function () {
        var count = 0;
        angular.forEach($scope.todos, function (todo) {
            count += todo.Done ? 0 : 1;
        });
        return count;
    };

    // delete done items
    $scope.archive = function () {
        var oldTodos = $scope.todos;
        $scope.todos = [];
        angular.forEach(oldTodos, function (value, key) {
            if (value.Done) {
                todoClass.delete(value.Id);
            } else {
                $scope.todos.push(value)
            }
        });
    };
});

