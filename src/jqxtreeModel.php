<?php

namespace jqxtree;

use jqxtree\jqxtreeController;
use jqxtree\jqxtreeView;
use jqxtree\crud;
 
class jqxtreeModel {
    public $view;
    public $crud;
    public $params = [];
    public $httpMethod = INPUT_POST;

//  Формирование имени новой папки
    public function tree_new($tablename, $ret) {
        $rV = 'Новая папка';
        $rows = $this->crud->get($tablename, 'name', "name like '" . $rV . "%'");
        if(isSet($rows[0]['error'])) {
            $ret = $ret . $rows[0]['error'];
        } else {
            $match_max = 0;
            $found = false;
            foreach($rows as $row) {
                $found = true;
                preg_match("/\d+/", $row['name'], $match);
                if (count($match) > 0) {
                    $match[0] = (int)$match[0];
                    if ( $match[0] > $match_max) {
                        $match_max = $match[0];
                    }
                }
            }
            if ($match_max > 0 || $found) {
                $match_max++;
                $rV = $rV . ' ' . $match_max;
            }
        }
        echo json_encode(['retval'=>$rV], JSON_UNESCAPED_UNICODE);
    }

    public function tree_debug($tablename, $ret) {
        echo json_encode(['debug'=>$this->params['debug']], JSON_UNESCAPED_UNICODE);
    }

    public function tree_home($tablename, $ret) {
        $rV = 'OK';
        if (mb_strtoupper($this->params['driverName']) === 'MSSQL') {
            $sql = <<<SQL
                IF object_id('$tablename') is null BEGIN;
                   CREATE TABLE $tablename (
                       id integer not null primary key,
                       parent_category_id integer,
                       before_category_id integer,
                       name varchar(100) not null
                   );
                   CREATE INDEX CATEGORY_NAME ON $tablename (name);
                   CREATE INDEX FK_PARENT ON $tablename (parent_category_id);
                   CREATE INDEX FK_BEFORE ON $tablename (before_category_id);
                   BEGIN TRANSACTION
                   INSERT INTO $tablename (id, parent_category_id, name, before_category_id) VALUES (1, 0, 'Новая папка', 0);
                   COMMIT;
                   CREATE SEQUENCE s_category
                     START WITH 2
                     INCREMENT BY 1;
                END;
SQL;
            $rV = $this->crud->query($sql);
       } else {
            if ($this->crud->query("SELECT 1 FROM " . $tablename . " LIMIT 1") !== 'OK') {
                $sql = <<<SQL
                   DROP TABLE IF EXISTS $tablename;
                   CREATE TABLE $tablename (
                       id integer not null AUTO_INCREMENT,
                       parent_category_id integer references category(id),
                       before_category_id integer references category(id),
                       name varchar(100) not null,
                       PRIMARY KEY (id) 
                   ) ENGINE=InnoDB AUTO_INCREMENT=1 CHARACTER SET 'utf8' COLLATE 'utf8_general_ci';
                   CREATE INDEX CATEGORY_NAME ON $tablename (name);
                   CREATE INDEX FK_PARENT ON $tablename (parent_category_id);
                   CREATE INDEX FK_BEFORE ON $tablename (before_category_id);
                   INSERT INTO $tablename (parent_category_id, name, before_category_id) VALUES (0, 'Новая папка', 0);
SQL;
                $rV = $this->crud->query($sql);
            }
        }
        if ($rV === 'OK') {
            $this->view->bldpage($this->params);
        } else {
            $this->view->putError(405, '', $rV);
        }
    }

    public function tree_reqwest($tablename, $ret) {
        $parent = filter_input($this->httpMethod, 'parent');
        if (empty($parent)) {
            $parent = '= 0';
        } else {
            $parent = '= ' . $parent;
        }
        $rows = $this->crud->get($tablename, 'id,name,parent_category_id,before_category_id', 'parent_category_id ' . $parent . ' order by before_category_id,id');
//      Сортировка дерева
        $i = 0;
        $rows_sort[0] = $rows[0];

        if (!empty($rows_sort[0]['error'])) {
           $rows_sort[0]['label'] = '?';
           echo json_encode($rows_sort, JSON_UNESCAPED_UNICODE);
           return;
        }

        $error[0] = '';
        while($i < count($rows) - 1) {
            $found = false;
            for ($j = 1; $j < count($rows); $j++) { 
                 if ( $rows_sort[$i]['id'] == $rows[$j]['before_category_id']) {
                     $i++;
                     $rows_sort[$i] = $rows[$j];
                     $error[$i] = '';
                     $found = true;
                     break;
                 }
            }
            if (!$found) {
                $rows_sort[$i]['name'] =  $rows_sort[$i]['name'];
                $error[$i] = 'Не найдена следующая папка для ' . $rows_sort[$i]['name'];
                break;
            }
        }
        foreach ($rows_sort as $key=>$row) {
            $count = $this->crud->get($tablename, 'count(*) c', 'parent_category_id = ' . $row['id']);
            if ( $count[0]['c'] > 0) {
                $arrchild = [["value" => "jqxtree.php?page=tree&action=reqwest&parent=" . $row['id'], "label" => "Загрузка..." ]];
                $root[] = ["icon" => "./images/folder.png", "label" => $row['name'], "items" => $arrchild, "error"=>$error[$key]];
            } else {
                $root[] = ["icon" => "./images/folder.png", "label" => $row['name'], "error"=>$error[$key]];
            }
        }
        echo json_encode($root, JSON_UNESCAPED_UNICODE);
    }
    public function tree_delete($tablename, $ret) {
        $prevlabel = filter_input($this->httpMethod, 'prevlabel');
        $sellabel = filter_input($this->httpMethod, 'sellabel');
        $nextlabel = filter_input($this->httpMethod, 'nextlabel');
        $rows = $this->crud->get($tablename, 'id,name,parent_category_id,before_category_id', "name = '" . $sellabel . "'");
        if ($this->isError($rows)) return;
//      Изменение папки, перед которой убираем элемент
        if ($nextlabel !== '0' ) {
            $rowsnext = $this->crud->get($tablename, 'id,name,parent_category_id,before_category_id', "name = '" . $nextlabel . "'");
            if ($this->isError($rowsnext)) return;
            if ( $rows[0]['parent_category_id'] === $rowsnext[0]['parent_category_id']) { // Меняем следующую только если она в том же уровне
                $requestData = ['before_category_id'=>$rows[0]['before_category_id'],];
                $ret = $ret . ' ' . $this->crud->put($tablename, "name='" . $nextlabel . "'", $requestData);
            }
        }
        $ret = $ret . ' ' . $this->crud->delete($tablename, "parent_category_id='" . $rows[0]['id'] . "'");
        $ret = $ret . ' ' . $this->crud->delete($tablename, "name='" . $sellabel . "'");
        echo json_encode(['retval'=>$ret], JSON_UNESCAPED_UNICODE);
    }

    public function tree_drag($tablename, $ret) {
        $in = filter_input($this->httpMethod, 'in');
        $sellabelstart = filter_input($this->httpMethod, 'sellabelstart');
        $sellabel = filter_input($this->httpMethod, 'sellabel');
        $nextlabelstart = filter_input($this->httpMethod, 'nextlabelstart');
        $nextlabel = filter_input($this->httpMethod, 'nextlabel');
        $rows = $this->crud->get($tablename, 'id,name,parent_category_id,before_category_id', "name = '" . $sellabelstart . "'");
        if ($this->isError($rows)) return;
//      Изменение папки, перед которой убираем элемент
        if ($nextlabelstart !== '0' /*&& $nextlabel !== '0'*/ ) {
            $rowsnext = $this->crud->get($tablename, 'id,name,parent_category_id,before_category_id', "name = '" . $nextlabelstart . "'");
            if ($this->isError($rowsnext)) return;
            if ( $rows[0]['parent_category_id'] === $rowsnext[0]['parent_category_id']) { // Меняем следующую только если она в том же уровне
                $requestData = ['before_category_id'=>$rows[0]['before_category_id'],];
                $ret = $ret . ' ' . $this->crud->put($tablename, "name='" . $nextlabelstart . "'", $requestData);
            }
        }
        $this->tree_create($tablename, $ret);
    }

    public function tree_rename($tablename, $ret) {
        $sellabel = filter_input($this->httpMethod, 'sellabel');
        $newlabel = filter_input($this->httpMethod, 'newlabel');
        $requestData = ['name'=>$newlabel,];
        $ret = $ret . ' ' . $this->crud->put($tablename, "name='" . $sellabel . "'", $requestData);
        echo json_encode(['retval'=>$ret], JSON_UNESCAPED_UNICODE);
    }

    private function isError($rows) {
        if(isSet($rows[0]['error'])) {
            echo json_encode(['retval'=>$rows[0]['error']], JSON_UNESCAPED_UNICODE); 
//            file_put_contents("log.txt", 'isError: ' . $rows[0]['error'] . "\n", FILE_APPEND);
            return true;
        } else {
//            file_put_contents("log.txt", 'isError: false' . "\n", FILE_APPEND);
            return false;
        }
    }
//  Поиск id последней папки в ветке рекурсивно
    private function defBottomFolder($rowsin, $id) {
        $rV = $id;
        foreach($rowsin as $key=>$row) {
            if ( $row['before_category_id'] === $id ) {
               $rV = $row['id'];
               break;
            }
        }
        if ( $rV !== $id) {
            $rV = $this->defBottomFolder($rowsin, $rV);
        }
        return $rV;
    }

    public function tree_create($tablename, $ret) {
        $in = filter_input($this->httpMethod, 'in');
        $sellabelstart = filter_input($this->httpMethod, 'sellabelstart');
        $prevlabel = filter_input($this->httpMethod, 'prevlabel');
        $sellabel = filter_input($this->httpMethod, 'sellabel');
        $nextlabel = filter_input($this->httpMethod, 'nextlabel');
        $newlabel = filter_input($this->httpMethod, 'newlabel');
        $rows = $this->crud->get($tablename, 'id,name,parent_category_id,before_category_id', "name = '" . $sellabel . "'");
        if ($this->isError($rows)) return;
//        file_put_contents("log.txt", 'tree_create: ' . $in . " sellabel : parent_category_id: " . $rows[0]['parent_category_id'] . " id:" . $rows[0]['name'] . "\n", FILE_APPEND);
        if ($nextlabel !== '0') { 
            $rowsnext = $this->crud->get($tablename, 'id,name,parent_category_id,before_category_id', "name = '" . $nextlabel . "'");
            if ($this->isError($rowsnext)) return;
        }
        if ($in === 'after') {
            $rown = $this->crud->get($tablename, 'id,name,parent_category_id,before_category_id', "before_category_id=" . $rows[0]['id']);
            if ($sellabelstart === $newlabel) {
                $requestData = [
                    'parent_category_id'=>$rows[0]['parent_category_id'],
                    'before_category_id'=>$rows[0]['id'],];
                $ret = $ret . ' ' . $this->crud->put($tablename, 'name=' . "'" . $newlabel . "'", $requestData);
            } else {
                $requestData['name'] = $newlabel;
                $requestData['parent_category_id'] = $rows[0]['parent_category_id'];
                $requestData['before_category_id'] = $rows[0]['id'];
                if (mb_strtoupper($this->params['driverName']) === 'MSSQL') {
                    $requestData['id'] = 'NEXT VALUE FOR s_category';
                }
                $ret = $ret . ' ' . $this->crud->post($tablename, $requestData);
            }
            if(isSet($rown[0]['name'])) { // Следующей папкиа найдена
                $rownew = $this->crud->get($tablename, 'id,parent_category_id', 'name=' . "'" . $newlabel . "'");
                $requestData = ['before_category_id'=>$rownew[0]['id'],];
                $ret = $ret . ' ' . $this->crud->put($tablename, 'name=' . "'" . $rown[0]['name'] . "'", $requestData);
            }
        }
        if ($in === 'before') {
            if ($prevlabel == '0') {
                $before_category_id = 0;
            } else {
                $before_category_id = $rows[0]['before_category_id'];
            }
            if ($sellabelstart === $newlabel) {
                $requestData = [
                    'parent_category_id'=>$rows[0]['parent_category_id'],
                    'before_category_id'=>$before_category_id,];
                $ret = $ret . ' ' . $this->crud->put($tablename, 'name=' . "'" . $newlabel . "'", $requestData);
                $rownew = $this->crud->get($tablename, 'id', "name = '" . $newlabel . "'");
                if ($this->isError($rownew)) return;
                $requestData = ['before_category_id'=>$rownew[0]['id'],];
                $ret = $ret . ' ' . $this->crud->put($tablename, 'name=' . "'" . $sellabel . "'", $requestData);
            } else {
                    $requestData['name'] = $newlabel;
                    $requestData['parent_category_id'] = $rows[0]['parent_category_id'];
                    $requestData['before_category_id'] = $before_category_id;
                if (mb_strtoupper($this->params['driverName']) === 'MSSQL') {
                    $requestData['id'] = 'NEXT VALUE FOR s_category';
                }
                $ret = $ret . ' ' . $this->crud->post($tablename, $requestData);
                $rownew = $this->crud->get($tablename, 'id', "name = '" . $newlabel . "'");
                if ($this->isError($rownew)) return;
                $requestData = ['before_category_id'=>$rownew[0]['id'],];
                $ret = $ret . ' ' . $this->crud->put($tablename, 'id=' . $rows[0]['id'], $requestData);
            }
        }
        if ($in === 'inside') {
            $rowsin = $this->crud->get($tablename, 'id,before_category_id', 'parent_category_id=' . $rows[0]['id'] . ' order by before_category_id,id');
            if (!isSet($rowsin[0]['id'])) {
                $before_category_id = 0;
            } else {
                $before_category_id = $this->defBottomFolder($rowsin, $rowsin[0]['id']);
            }
            if ($sellabelstart === $newlabel) {
                $requestData = [
                    'parent_category_id'=>$rows[0]['id'],
                    'before_category_id'=>$before_category_id,];
                $ret = $ret . ' ' . $this->crud->put($tablename, 'name=' . "'" . $newlabel . "'", $requestData);
            } else {
                    $requestData['name'] = $newlabel;
                    $requestData['parent_category_id'] = $rows[0]['id'];
                    $requestData['before_category_id'] = $before_category_id;
                    if (mb_strtoupper($this->params['driverName']) === 'MSSQL') {
                        $requestData['id'] = 'NEXT VALUE FOR s_category';
                    }
                $ret = $ret . ' ' . $this->crud->post($tablename, $requestData);
            }
        }
        echo json_encode(['retval'=>$ret], JSON_UNESCAPED_UNICODE);
    }
}
