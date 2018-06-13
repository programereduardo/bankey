<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class actividadese_controller extends CI_controller {
  public function __construct()
  {
    parent::__construct();
    $this->load->model('actividadese_model');
  }
  //Cargando Vistas
  public function index() {
    $resultado = $this->actividadese_model->validar_session();
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
        if ($data['mod_nombre'] == "Actividades" && $data['acc_descripcion'] == "Ver") {
          $next = true;
        }
      }
      if ($next === true) {
        $this->load->view('shared/header');
        $this->load->view('shared/menu', $datos);
        $this->load->view('Actividadese_view');
        $this->load->view('shared/footer');
      } else {
        header("Location: inicio");
      }
    }
  }

  public function guardar_actividades()
  {
    $datos = $this->input->post();
    if ($datos['tipo'] === '1') {
      $realizar = $this->actividadese_model->salvar_actividades($datos);
    } else {
      $realizar = $this->actividadese_model->actualizar_actividades($datos);
    }
    $success = false;
    if ($realizar !== false) {
      $success = true;
    }
    echo json_encode(array(
      'success' => $success
    ));
  }

  public function obtener_actividades()
  {
    $result = $this->actividadese_model->obtener_actividades();
    $success = false;
    $cantidad = count($result);
    if ($cantidad > 0) {
      $success = true;
    }
    echo json_encode(array(
      'success' => $success,
      'actividades' => $result
    ));
  }

  public function inactivar_actividades()
  {
    $codigo_actividades = $this->input->post('codigo_actividades');
    $result = $this->actividadese_model->inactivar_actividades($codigo_actividades);
    $success = false;
    if ($result !== false) {
      $success = true;
    }
    echo json_encode(array(
      'success' => $success
    ));
  }

}
