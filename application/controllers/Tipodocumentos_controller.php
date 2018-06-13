<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class tipodocumentos_controller extends CI_controller {
  public function __construct()
  {
    parent::__construct();
    $this->load->model('tipodocumentos_model');
  }
  //Cargando Vistas
  public function index() {
    $resultado = $this->tipodocumentos_model->validar_session();
    if ($resultado === false) {
      header('Location: login');
    } else {
      $this->load->model('sistema/permisos_model');
      $acciones = $this->permisos_model->obtener_acciones();
      $datos = array(
        'acciones' => $acciones
      );
      $next = false;
      foreach ($acciones as $data) {
        if ($data['mod_nombre'] == "Mantenimientos" && $data['acc_descripcion'] == "Ver") {
          $next = true;
        }
      }
      if ($next === true) {
        $this->load->view('shared/header');
        $this->load->view('shared/menu', $datos);
        $this->load->view('Tipodocumentos_view');
        $this->load->view('shared/footer');
      } else {
        header("Location: inicio");
      }
    }
  }

  public function guardar_tipodocumentos()
  {
    $datos = $this->input->post();
    if ($datos['tipo'] === '1') {
      $realizar = $this->tipodocumentos_model->salvar_tipodocumentos($datos);
    } else {
      $realizar = $this->tipodocumentos_model->actualizar_tipodocumentos($datos);
    }
    $success = false;
    if ($realizar !== false) {
      $success = true;
    }
    echo json_encode(array(
      'success' => $success
    ));
  }

  public function obtener_tipodocumentos()
  {
    $result = $this->tipodocumentos_model->obtener_tipodocumentos();
    $success = false;
    $cantidad = count($result);
    if ($cantidad > 0) {
      $success = true;
    }
    echo json_encode(array(
      'success' => $success,
      'tipodocumentos' => $result
    ));
  }

  public function inactivar_tipodocumentos()
  {
    $codigo_tipodocumentos = $this->input->post('codigo_tipodocumentos');
    $result = $this->tipodocumentos_model->inactivar_tipodocumentos($codigo_tipodocumentos);
    $success = false;
    if ($result !== false) {
      $success = true;
    }
    echo json_encode(array(
      'success' => $success
    ));
  }

}
