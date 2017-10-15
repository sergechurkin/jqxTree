<?php

namespace jqxtree;

class crud {
    public $dbParams = [];

    public function connect() {
        if (mb_strtoupper($this->dbParams['driverName']) === 'MYSQL') {
            try {
                $pdo = new \PDO($this->dbParams['driverName'] . ':dbname=' . $this->dbParams['database'] . ';host=' . $this->dbParams['host'] . ';charset=' . $this->dbParams['characterset'], $this->dbParams['username'], $this->dbParams['password']);
            } catch (Exception $e) {
                echo 'Нет соезинения с БД ' . $this->dbParams['database'] . ' host=' . $this->dbParams['host'] . "\n";
                throw new \RuntimeException($e->getMessage());
            }
            return $pdo;
        }
        else if (mb_strtoupper($this->dbParams['driverName']) === 'MSSQL') {
            $conn = sqlsrv_connect( $this->dbParams['host'], ["UID" => $this->dbParams['username'], "PWD" => $this->dbParams['password'], "Database"=>$this->dbParams['database'], "CharacterSet"=>$this->dbParams['characterset']]);
            if( $conn ) {
                return $conn;
            } else {
                echo 'Нет соединения с БД ' . $this->dbParams['database'] . ' host=' . $this->dbParams['host'] . "\n";
                die( print_r( sqlsrv_errors(), true));
            }    
        }    
   }    

    public function get($table, $filds, $condition) {
        $rdata = [];
        $str = '';
        $pdo = $this->connect();
        $sql = 'SELECT ' . $filds . ' FROM ' . $str . $table . $str;
        if (!empty($condition)) {
            $sql .= ' WHERE ' . $condition;
        }
        if (mb_strtoupper($this->dbParams['driverName']) === 'MYSQL') {
            $rows = $pdo->query($sql);
            if (!$rows) {
                $rdata[0]['error'] = 'Ошибка выполнения запроса: ' . $sql;
                return $rdata;
            }
            $rdata = $rows->fetchAll();
        } else if (mb_strtoupper($this->dbParams['driverName']) === 'MSSQL') {
            $stmt = sqlsrv_prepare($pdo, $sql, []);
            if (!$stmt) {
                $rdata[0]['error'] = 'Ошибка выполнения запроса: ' . $sql;
            } else {
                $result = sqlsrv_execute($stmt);
                while( $row = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC) ) {
                    $rdata[] = $row;
                }
            }
        }
        $pdo = null; // Close connectuin
        if (sizeof($rdata) == 0) {
            $rdata[0]['error'] = 'Данных не найдено: ' . $sql;
        }    
        return $rdata;
}

    public function query($sql) {
         $pdo = $this->connect();
         if (mb_strtoupper($this->dbParams['driverName']) === 'MYSQL') {
             $query = $pdo->prepare($sql);
             if (!$query) {
                 $rv = false;
             } else {
                 $rv = $query->execute();
             }
         } else if (mb_strtoupper($this->dbParams['driverName']) === 'MSSQL') {
             $rv = sqlsrv_query( $pdo, $sql, []);
         } 
         $pdo = null; // Close connectuin
         if ($rv == false) {
             return 'Ошибка выполнения запроса: ' . $sql;
        } else {
             return 'OK';
         }
    }
    public function post($table, $requestData) {
        $i = 0;
        $str = '';
        $sql = 'INSERT INTO ' . $str . $table . $str . ' ( ';
        foreach ($requestData as $key=>$r) {
            if ($i !== 0) {
                $sql .= ', ';
            }
            $sql .= $key;
            $i++;
        }
        $i = 0;
        $sql .= ') VALUES (';
        foreach ($requestData as $key=>$r) {
            if ($i !== 0) {
                $sql .= ', ';
            }
            $sql .= $this->prepStr($r);
            $i++;
        }
        $sql .= ')';
        return $this->query($sql);
    }

    public function put($table, $condition, $requestData) {
         $i = 0;
         $sql = 'UPDATE ' . $table . ' SET ';
         foreach ($requestData as $key=>$r) {
             if ($i !== 0) {
                 $sql .= ', ';
             }
             $sql .= $key . '=' . $this->prepStr($r);
             $i++;
         }
         $sql .= ' WHERE ' . $condition;
//         file_put_contents("log.txt", 'put: ' . $sql . "\n", FILE_APPEND);
         return $this->query($sql);
    }

    public function delete($table, $condition) {
         $str = '';
         $sql = 'DELETE FROM ' . $str . $table . $str . ' WHERE ' . $condition;
         return $this->query($sql);
    }

    public function prepStr($str) {
        if (is_string($str) && mb_strpos( mb_strtoupper($str), 'NEXT VALUE FOR') === false) {
            return "'" . addslashes($str) . "'";
        } else {
            return $str;
        }
    }
}
