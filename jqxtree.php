<?php

if(isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH']==='XMLHttpRequest') { // Ajax
    ini_set('log_errors', 'On');
    ini_set('error_log', 'php_errors.log');
}

$loader = require( __DIR__ . '/vendor/autoload.php' );
$loader->addPsr4( 'jqxtree\\', __DIR__ . '/src/' );

use jqxtree\jqxtreeController;

$params = require('./src/params.php');
(new jqxtreeController())->run($params);
