/// <reference path="~/Scripts/angular.min.js" />
/// <reference path="~/Scripts/angular-resource.js" />

var todoApp = angular.module('todoApp', ['ngResource']);

todoApp.controller("TodoCtrl", function ($scope, $resource) {
    //WebAPI呼び出し用オブジェクト作成
    var todoClass = $resource('/api/Todoes/:id', { id: '@Id' }
                                , { 'update': { method: 'PUT' } }     //既定でPUT呼び出しが無いので定義
                                );
    //ToDoリスト初期化
    $scope.todos = todoClass.query();

    // 各アイテムに変更監視ハンドラをセット
    var deWatchTodo = new Array();  //ハンドラリセット用配列
    $scope.$watchCollection("todos", function (newVal) {
        //古いハンドラをリセット
        angular.forEach(deWatchTodo, function (value, key) { value(); });   
        deWatchTodo = [];
        // 監視関数をセット
        angular.forEach(newVal, function (value, key) {
            var deregistration = $scope.$watch("todos[" + key + "]", function (newVal, oldVal, scope) {
                if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {    //内容が変わっている場合だけWebAPIコール
                    todoClass.update(newVal.Id, newVal);
                }
            }, true);
            deWatchTodo.push(deregistration);   //リセット用に記録
        });
    });
    
    // アイテム追加
    $scope.addTodo = function () {
        //WebAPIコール
        todoClass.save({ Text: $scope.todoText, Done: false }, function (result) {
            //成功したらクライアント側でも記録
            $scope.todos.push(result);
        });
        $scope.todoText = '';
    };

    // 残り件数
    $scope.remaining = function () {
        var count = 0;
        angular.forEach($scope.todos, function (todo) {
            count += todo.Done ? 0 : 1;
        });
        return count;
    };

    // 終了済みアイテムを削除
    $scope.archive = function () {
        var oldTodos = $scope.todos;
        $scope.todos = [];
        angular.forEach(oldTodos, function (value, key) {
            if (value.Done) {               //終わってら
                todoClass.delete(value.Id); //削除WebAPIコール
            } else {                        //終わってなかったら
                $scope.todos.push(value)    //ToDoリストに戻す
            }
        });
    };
});

