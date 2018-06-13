<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class location_controller extends CI_Controller {
  public function __construct()
  {
    parent::__construct();
    $this->load->model('location/location_model');
  }
  //Cargando Vistas
  public function index() {
    $resultado = $this->location_model->validar_session();
    /*if ($resultado === false) {
      header('Location: login');
    } else {
      $this->load->model('sistema/permisos_model');
      $acciones = $this->permisos_model->obtener_acciones();
      $datos = array(
        'acciones' => $acciones
      );
      $next = false;
      if ($next === true) {
        $this->load->view('shared/header');
        $this->load->view('shared/menu', $datos);
        $this->load->view('Actividadese_view');
        $this->load->view('shared/footer');
      } else {
        header("Location: inicio");
      }
    }*/
  }

  public function get_location()
  {
    //$data = $this->input->post();
    $re = $this->location_model->get_location();
    $success = false;
    if (count($re) > 0) {
      $success = true;
    }
    echo json_encode(
      array(
        'success' => $success,
        'data' => $re
      )
    );
  }

  public function search_location()
  {
    $dt = $this->input->post();    
    $re = $this->location_model->search_location($dt);
    $success = false;
    if (count($re) > 0) {
      $success = true;
    }
    echo json_encode(
      array(
        'success' => $success,
        'data' => $re
      )
    );
  }

}
