<?php

function pretty($url, $return = false) {
    $link = "";
    $url = explode("&", str_replace("?", "", $url));
    foreach ($url as $key => $value) {
        $aux = explode("=", $value);
        $link .=  $aux[1]."/";
    }
    if ($return) {
        return SITE_PATH . $link;
    }
    error_log(print_r(SITE_PATH . $link,1));
    die();
    echo SITE_PATH . $link;
}