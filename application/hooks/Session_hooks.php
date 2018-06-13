<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Session_hooks {
  public function is_session()
  {
    $ci =& get_instance();
    if ($ci->session->userdata('logueado') === NULL) {
      if(uri_string() !== ""){
        if (
          !empty($_SERVER['HTTP_X_REQUESTED_WITH'])
          && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest'
        ) {
          echo json_encode(array(
            "success" => false,
            "msg" => "La sesi&oacute;n se caduc&oacute;, por favor ingrese nuevamente.",
            "session" => false
          ));
          exit();
        }else{
          $logueado = $ci->session->userdata('logueado');
          $url = base_url().urlencode(uri_string().($_SERVER["QUERY_STRING"] == "" ? "" : "?".$_SERVER["QUERY_STRING"]));
          if($logueado === false){
            redirect('login', 'refresh');
          }
          redirect($url, "refresh");
        }
      }
    }else if($ci->session->userdata('logueado') !== NULL){
      if(uri_string() == ""){
        redirect("inicio", "refresh");
      }
    }
  }
}
