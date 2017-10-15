<?php

namespace jqxtree;

class jqxtreeView {

    public function createForm($tytle, $arrcss, $arrjs) {
        echo '<!DOCTYPE html>' . "\n";
        echo '<html lang="ru">' . "\n";
        echo '<head>' . "\n";
        echo '<meta http-equiv="content-type" content="text/html; charset=utf-8" />' . "\n";
        echo '<title>' . $tytle . '</title>' . "\n";
        foreach($arrcss as $css) {
            echo '<link rel="stylesheet" href="' . $css . '" type="text/css" />' . "\n";
        }
        foreach($arrjs as $js) {
            echo '<script type="text/javascript" src="' . $js . '"></script>' . "\n";
        }
        echo '</head>' . "\n";
    }

    public function bldpage($params) {
        $rV = <<<HTML
<body class="default">
    <div id="jqxWidget">
        <div id="jqxExpander" style="float: left; margin-left: 30px;border: none;">
            <div><b> {$params['title']} </b></div>
            <div id="jqxTree">
                <div style="visibility: hidden;" id="dialog">
                    <div style="overflow: hidden;">
                        <table style="table-layout: fixed; border-style: none;">
                            <tr>
                                <td align="right">
                                     Наименование:
                                </td>
                                <td align="left">
                                     <input id="Title" />
                                </td>
                            </tr>
                            <tr>
                                <td align="right">
                                     <br />
                                     <button id="save">Сохранить</button>
                                </td>
                                <td align="right">
                                     <br />
                                     <button id="cancel">Отменить</button>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div> <!--id="jqxExpander"-->
        </div> <!--id="jqxTree"-->
        <div id="popover">
            <div id="mess">
            </div>
        </div>
HTML;
        if ($params['debug']) {
            $rV = $rV . <<<HTML
        <div style="margin-left: 20px; float: left;">
            <div> <!-- style="visibility: hidden;" -->
                <span><b>Протокол:</b></span>
                <div id="Events">
                </div>
            </div>
        </div>
HTML;
        }
        $rV = $rV . <<<HTML
        <div id="jqxMenu">
            <ul>
                <li>Добавить в папку</li>
                <li>Добавить до</li>
                <li>Добавить после</li>
                <li>Удалить</li>
                <li>Редактировать</li>
            </ul>
        </div>
    </div> <!-- id="jqxWidget"> -->
HTML;
        if ($params['debug']) {
            $rV = $rV . <<<HTML
    <div> <!-- style="visibility: hidden;" -->
        <div>
            <input type="button" style="margin: 10px;" id="jqxbutton_clear" value="Очистить протокол" />
        </div>
    </div>
HTML;
        }
        $rV = $rV . '</body>' . "\n";
        echo $rV;
    }

    public function putError($num, $messRu, $metod) {
        $errorMessage['200'] = 'OK';
        $errorMessage['203'] = 'Non-Authoritative Information';
        $errorMessage['404'] = 'Not Found';
        $errorMessage['405'] = 'Method Not Allowed';
        header('HTTP/1.1 ' . $num . $errorMessage[$num]);
        echo '<center><h1>' . $num . ' ' . $errorMessage[$num] . '</h1></center><hr>' . $messRu . ' ' . $metod . "\n";
    }

    public function closeForm() {
        echo '</html>' . "\n";
    }
}