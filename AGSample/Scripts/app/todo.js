/// <reference path="~/Scripts/angular.min.js" />
/// <reference path="~/Scripts/angular-resource.js" />

var todoApp = angular.module('todoApp', ['ngResource']);

todoApp.controller("TodoCtrl", function ($scope, $resource) {
    var todoClass = $resource('/api/Todoes/:id', { id: '@Id' });
    $scope.todos = todoClass.query();

    $scope.addTodo = function () {
        $scope.todos.push({ text: $scope.todoText, done: false });
        $scope.todoText = '';
    };

    $scope.remaining = function () {
        var count = 0;
        angular.forEach($scope.todos, function (todo) {
            count += todo.done ? 0 : 1;
        });
        return count;
    };

    $scope.archive = function () {
        var oldTodos = $scope.todos;
        $scope.todos = [];
        angular.forEach(oldTodos, function (todo) {
            if (!todo.done) $scope.todos.push(todo);
        });
    };
});

