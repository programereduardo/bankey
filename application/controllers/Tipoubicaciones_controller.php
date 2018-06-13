<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class tipoubicaciones_controller extends CI_controller {
  public function __construct()
  {
    parent::__construct();
    $this->load->model('tipoubicaciones_model');
  }
  //Cargando Vistas
  public function index() {
    $resultado = $this->tipoubicaciones_model->validar_session();
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
        $this->load->view('Tipoubicaciones_view');
        $this->load->view('shared/footer');
      } else {
        header("Location: inicio");
      }
    }
  }

  public function guardar_tipoubicaciones()
  {
    $datos = $this->input->post();
    var_dump($datos);
    if ($datos['tipo'] === '1') {
      $realizar = $this->tipoubicaciones_model->salvar_tipoubicaciones($datos);
    } else {
      $realizar = $this->tipoubicaciones_model->actualizar_tipoubicaciones($datos);
    }
    $success = false;
    if ($realizar !== false) {
      $success = true;
    }
    echo json_encode(array(
      'success' => $success
    ));
  }

  public function obtener_tipoubicaciones()
  {
    $result = $this->tipoubicaciones_model->obtener_tipoubicaciones();
    $success = false;
    $cantidad = count($result);
    if ($cantidad > 0) {
      $success = true;
    }
    echo json_encode(array(
      'success' => $success,
      'tipoubicaciones' => $result
    ));
  }

  public function inactivar_tipoubicaciones()
  {
    $codigo_tipoubicaciones = $this->input->post('codigo_ubicaciones');
    $result = $this->tipoubicaciones_model->inactivar_tipoubicaciones($codigo_tipoubicaciones);
    $success = false;
    if ($result !== false) {
      $success = true;
    }
    echo json_encode(array(
      "success" => $success
    ));
  }

}
