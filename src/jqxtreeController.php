<?php

namespace jqxtree;

use jqxtree\jqxtreeModel;
use jqxtree\jqxtreeView;
 
class jqxtreeController {
/*
 * github: sergechurkin/jqxtree
*/
    public function run($params) {
        $model = new jqxtreeModel();
        $model->params = $params;
        $model->httpMethod = ($params['method'] === 'POST') ? INPUT_POST : INPUT_GET;
        $model->view = new jqxtreeView;
        $model->crud = new crud;
        $model->crud->dbParams = [
            'driverName' => $params['driverName'],
            'host' => $params['host'],
            'database' => $params['database'],
            'username' => $params['username'],
            'password' => $params['password'],
            'characterset' => $params['characterset'],
            ];
        if (mb_strtoupper($params['driverName']) === 'MSSQL') {
            $tablename = $params['database'] . '.dbo.category';
        } else {
            $tablename = 'category';
        }
        $page   = filter_input($model->httpMethod, 'page', FILTER_SANITIZE_STRING);
        if (empty($page)) {
            $page = 'tree';
        }
        $action = filter_input($model->httpMethod, 'action', FILTER_SANITIZE_STRING);
        if (empty($action)) {
            $action = 'home';
        }
        if ($action == 'home') {
            $model->view->createForm($params['title'], $params['arrcss'], $params['arrjs']);
        }
        /* Доступные методы:
         * tree_home
         * tree_debug
         * tree_new
         * tree_reqwest
         * tree_create
         * tree_delete
         * tree_rename
         * tree_drag
         */
        $method = $page . '_' . $action;
        if(method_exists($model, $method)) {
            $model->$method ($tablename, '');
        }   else {
            $model->view->putError(405, 'Задан недопустимый метод :',  $method);
        }                               
        if ($action == 'home') {
            $model->view->closeForm();
        }                               
    }                               
}
