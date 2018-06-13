<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class home_controller extends CI_controller {
  public function __construct()
  {
    parent::__construct();
    $this->load->model('home_model');
  }
  //Cargando Vistas
  public function index()	{
    $resultado = $this->home_model->validar_session();
    if ($resultado === false) {
      header('Location: login');
    } else {
      $this->load->model('sistema/permisos_model');
      $acciones = $this->permisos_model->obtener_acciones();
      $datos = array(
        'acciones' => $acciones
      );
		  $this->load->view('shared/header');
      $this->load->view('shared/menu', $datos);
      $this->load->view('Home_view');
		  $this->load->view('shared/footer');
    }
	}

  public function obtener_terceros()
  {
    $result = $this->home_model->obtener_terceros();
    $return = array();
    $success = false;
    if (count($result) > 0) {
      for ($i = 0; $i < count($result); $i++) {
        $return[$i]['cant'] = $result[$i]['cant'];
        $return[$i]['data'] = $result[$i]['tipabreviatura'];
      }
      $success = true;
    }
    echo json_encode(array(
      'success' => $success,
      'data' => $return
    ));
  }

  public function validar_articulos()
  {
    $result = $this->home_model->validar_articulos();
    $success = false;
    if (count($result) > 0) {
      $success = true;
    }
    echo json_encode(
      array(
        'success' => $success,
        'data' => $result
      )
    );
  }
}
