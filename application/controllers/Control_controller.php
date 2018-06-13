<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class control_controller extends CI_controller {
  public function __construct()
  {
    parent::__construct();
    $this->load->model('control_model');
  }
  //Cargando Vistas
  public function index($codigo, $clave, $titulo, $modulo, $nombre) {
    $resultado = $this->control_model->validar_session();
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
        if ($data['mod_nombre'] == $modulo && $data['acc_descripcion'] == "Ver") {
          $next = true;
        }
      }
      if ($next === true) {
        $parametros = array(
          'codigo' => $codigo,
          'clave' => $clave,
          'titulo' => $titulo,
          'modulo' => $modulo,
          'nombre' => $nombre
        );
        $this->load->view('shared/header');
        $this->load->view('shared/menu', $datos);
        $this->load->view('Control_view', $parametros);
        $this->load->view('shared/footer');
      } else {
        header("Location: inicio");
      }
    }
  }

  public function clientes()
  {
    $tip = obtener_codigo_glotipos('CLI', 'TERTIP');
    $codigo = $tip[0]['tipcodigo'];
    $this->index($codigo, 'CLI', 'Clientes', 'Control cliente', 'Cliente');
  }

  public function vendedores()
  {
    $tip = obtener_codigo_glotipos('VEN', 'TERTIP');
    $codigo = $tip[0]['tipcodigo'];
    $this->index($codigo, 'VEN', 'Vendedores', 'Control vendedor', 'Vendedor');
  }

  public function guardar_control()
  {
    $data = $this->input->post();
    if ($data['tipo'] == '1') {
      $re = $this->control_model->guardar_control($data);
    } else {
      $re = $this->control_model->actualizar_control($data);
    }
    return $re;
  }

  public function inactivar_control()
  {
    $dt = $this->input->post('codigo');
    $res = $this->control_model->inactivar_control($dt);
    echo json_encode(
                      array(
                        'success' => $res
                      )
                    );
  }

  public function obtener_control()
  {
    $tipo = $this->input->post('tipo');
    $dt = $this->control_model->obtener_control($tipo);
    for ($i=0; $i < count($dt); $i++) {
      if ($dt[$i]['tertipogrupo'] == "2") {
        $dt[$i]['ternombre'] = $dt[$i]['ternom1'].' '.$dt[$i]['ternom2'].' '.$dt[$i]['terape1'].' '.$dt[$i]['terape2'];
      }
      $dt[$i]['artdescripcion'] = $dt[$i]['artreferencia'].' - '.$dt[$i]['artdescripcion'];
    }
    $success = false;
    if (count($dt) > 0) {
      $success = true;
    }
    echo json_encode(
                      array(
                        'success' => $success,
                        'data' => $dt
                      )
                    );
  }

  public function validar_registro()
  {
    $dt = $this->input->post();
    $re = $this->control_model->validar_registro($dt);
    $success = false;
    $data = 1;
    if (count($re) > 0) {
      $success = true;
      $data = 2;
    }
    echo json_encode(
      array(
        'success' => $success,
        'data' => $data
      )
    );
  }

  public function cliente_vendedor()
  {
    $tip = obtener_codigo_glotipos('VEN', 'TERTIP');
    $codigo = $tip[0]['tipcodigo'];
    $this->index($codigo, 'VEN', 'Vendedores', 'Control vendedor', 'Vendedor'); 
  }
}
