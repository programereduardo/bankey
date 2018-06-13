<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class roles_controller extends CI_controller {
  public function __construct()
  {
    parent::__construct();
    $this->load->model('sistema/roles_model');
  }
  //Cargando Vistas
  public function index() {
    $resultado = $this->roles_model->validar_session();
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
        if ($data['mod_nombre'] == "Roles" && $data['acc_descripcion'] == "Ver") {
          $next = true;
        }
      }
      if ($next === true) {
        $this->load->view('shared/header');
        $this->load->view('shared/menu', $datos);
        $this->load->view('sistema/Roles_view');
        $this->load->view('shared/footer');
      } else {
        header("Location: inicio");
      }
    }
  }

  public function obtener_modulos()
  {
    $data = $this->input->post('codigo');
    $result = $this->roles_model->obtener_modulos($data);
    $success = false;
    $retorno = array();
    if (count($result) > 0) {
      $success = true;
      for ($i = 0; $i < count($result); $i++) {
        if ($result[$i]['mod_codigo'] == NULL || $result[$i]['mod_nombre'] == NULL || $result[$i]['mod_orden'] == NULL ) {
          unset($result[$i]);
        }
      }
    }
    $retorno = array_values($result);
    echo json_encode(
      array(
        'data' => $retorno,
        'success' => $success
      )
    );
  }

  public function obtener_acciones()
  {
    $data = $this->input->post();
    #var_dump($data);
    #exit();
    $result = $this->roles_model->obtener_acciones($data);
    $success = false;
    $retorno = array();
    if (count($result) > 0) {
      $success = true;
    }
    $retorno = array_values($result);
    echo json_encode(
      array(
        'data' => $retorno,
        'success' => $success
      )
    );
  }

  public function obtener_smodulos()
  {
    $result = $this->roles_model->obtener_smodulos();
    $success = false;
    if (count($result) > 0) {
      $success = true;
    }
    echo json_encode(
      array(
        'data' => $result,
        'success' => $success
      )
    );
  }


  public function eliminar_rol()
  {
    $rol = $this->input->post('codigo');
    $result = $this->roles_model->eliminar_rol($rol);
    $success = false;
    if ($result === true) {
      $success = true;
    }
    echo json_encode(
      array(
        'success' => $success
      )
    );
  }

  public function obtener_roles()
  {
    $result = $this->roles_model->obtener_roles();
    $success = false;
    if (count($result) > 0) {
      $success = true;
      for ($i = 0; $i < count($result); $i++) {
        if ($result[$i]['rol_estado'] == '1') {
          $result[$i]['rol_estado'] = 'Activo';
        } else {
          $result[$i]['rol_estado'] = 'Inactivo';
        }
      }
    }
    echo json_encode(
      array(
        'success' => $success,
        'data' => $result
      )
    );
  }

  public function validar_rol()
  {
    $data = $this->input->post('codigo');
    $result = $this->roles_model->validar_rol($data);
    $success = false;
    if (count($result) > 0) {
      $success = true;
    }
    echo json_encode(
      array(
        'success' => $success
      )
    );
  }

  public function validar_modulo()
  {
    $data = $this->input->post();
    var_dump($data);
    exit();
    $result = $this->roles_model->validar_modulo($data);
    $success = false;
    if (count($result) > 0) {
      $success = true;
    }
    echo json_encode(
      array(
        'success' => $success
      )
    );
  }

  public function guardar_rol(){
    $data = $this->input->post();
    $success = true;
    $type = 'success';
    $msg = 'Acción realizada con exíto.';
    if ($data['tipo'] === "1") {
      $realizar = $this->roles_model->salvar_rol($data);
    } else {
      $realizar = $this->roles_model->actualizar_rol($data);
    }
    if ($realizar === false) {
      $success = false;
      $msg = 'La contraseña ingresada es incorrecta.';
      $type = "danger";
    }
    echo json_encode(array(
      'success' => $success,
      'msg' => $msg,
      'type' => $type
    ));
  }

}
