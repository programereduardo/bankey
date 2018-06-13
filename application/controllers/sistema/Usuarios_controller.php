<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class usuarios_controller extends CI_controller {
  public function __construct()
  {
    parent::__construct();
    $this->load->model('sistema/usuarios_model');
  }
  //Cargando Vistas
  public function index() {
    $resultado = $this->usuarios_model->validar_session();
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
        if ($data['mod_nombre'] == "Usuarios" && $data['acc_descripcion'] == "Ver") {
          $next = true;
        }
      }
      if ($next === true) {
        $this->load->view('shared/header');
        $this->load->view('shared/menu', $datos);
        $this->load->view('sistema/Usuarios_view');
        $this->load->view('shared/footer');
      } else {
        header("Location: inicio");
      }
    }
  }

  public function obtener_usuarios()
  {
    $rol = $this->input->post('user_rol');
    $result = $this->usuarios_model->obtener_usuarios($rol);

    $success = false;
    if (count($result) > 0) {
      $success = true;
    }
    for ($i = 0; $i < count($result); $i++) {
      
        $result[$i]['ternombre'] = $result[$i]['ter_pnombre'].' '.$result[$i]['ter_snombre'].' '.$result[$i]['ter_papellido'].' '.$result[$i]['ter_sapellido'];
      
      if ($result[$i]['ternombre'] == '') {
        $result[$i]['ternombre'] = 'Usuario del Sistema';
      }
      if ($result[$i]['rol_nombre'] == NULL) {
        $result[$i]['rol_nombre'] = 'No definido';
      }
      if ($result[$i]['usu_estado'] == '1') {
        $result[$i]['usu_estado'] = 'Activo';
      } else {
        $result[$i]['usu_estado'] = 'Inactivo';
      }
    }
    echo json_encode(
      array(
        'data' => $result,
        'success' => $success
      )
    );
  }

  public function eliminar_usuario()
  {
    $user = $this->input->post('codigo');
    $result = $this->usuarios_model->eliminar_usuario($user);
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
    $result = $this->usuarios_model->obtener_roles();
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

  public function validar_usuario()
  {
    $data = $this->input->post('codigo');
    $result = $this->usuarios_model->validar_usuario($data);
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


  public function guardar_usuario(){
    $data = $this->input->post();
    $success = true;
    $type = 'success';
    $msg = 'Acción realizada con exíto.';
    if ($data['tipo'] === "1") {
      $realizar = $this->usuarios_model->salvar_usuario($data);
    } else {
      $realizar = $this->usuarios_model->actualizar_usuario($data);
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
