<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class viaticos_controller extends CI_controller {
  public function __construct()
  {
    parent::__construct();
    $this->load->model('viaticos_model');
  }
  //Cargando Vistas
  public function index($titulo, $grupo) {
    $resultado = $this->viaticos_model->validar_session();
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
        if ($data['mod_nombre'] == $titulo && $data['acc_descripcion'] == "Ver") {
          $next = true;
        }
      }
      if ($next === true) {
        $parametros = array(
          'titulo' => $titulo,
          'grupo' => $grupo
        );
        $this->load->view('shared/header');
        $this->load->view('shared/menu', $datos);
        $this->load->view('Viaticos_view', $parametros);
        $this->load->view('shared/footer');
      } else {
        header("Location: inicio");
      }
    }
  }

  public function viaticos()
  {
    $this->index('Viaticos', 'TIPVIA');
  }

  public function gastos()
  {
    $this->index('Gastos', 'TIPGAS');
  }

  public function guardar_viatico()
  {
    $datos = $this->input->post();
    if ($datos['tipo'] === '1') {
      $realizar = $this->viaticos_model->salvar_viatico($datos);
    } else {
      $realizar = $this->viaticos_model->actualizar_viatico($datos);
    }
    $success = false;
    if ($realizar !== false) {
      $success = true;
    }
    echo json_encode(array(
      'success' => $success
    ));
  }

  public function listar_viaticos()
  {
    $grupo = $this->input->post('grupo');
    $result = $this->viaticos_model->listar_viaticos($grupo);
    for ($i=0; $i < count($result); $i++) {
      if ($result[$i]['tertipogrupo'] == "2") {
        $result[$i]['ternombre'] = $result[$i]['ternom1'].' '.$result[$i]['ternom2'].' '.$result[$i]['terape1'].' '.$result[$i]['terape2'];
      }
      if ($result[$i]['gasestado'] == 'E') {
        $result[$i]['gasestado'] = 'En revisión';
      }
      if ($result[$i]['gasestado'] == 'N') {
        $result[$i]['gasestado'] = 'Anulado';
      }
      if ($result[$i]['gasestado'] == 'F') {
        $result[$i]['gasestado'] = 'Finalizado';
      }
      if ($result[$i]['gasobservacion'] == '') {
        $result[$i]['gasobservacion'] = 'Información no suministrada.';
      }
    }

    $success = false;
    $cantidad = count($result);
    if ($cantidad > 0) {
      $success = true;
    }
    echo json_encode(array(
      'success' => $success,
      'data' => $result
    ));
  }

  public function accion()
  {
    $codigo_viatico = $this->input->post('codigo_viatico');
    $data = $this->input->post('data');
    if ($data == 'N') {
      $msg = 'Eliminado correctamente.';
    } elseif ($data == 'F') {
      $msg = 'FInalizado correctamente.';
    }
    $result = $this->viaticos_model->accion($codigo_viatico, $data);
    $success = false;
    if ($result !== false) {
      $success = true;
    }
    echo json_encode(array(
      'success' => $success,
      'msg' => $msg
    ));
  }

  public function obtener_viaticos()
  {
    $dt = $this->input->post('grupo');
    $data = $this->viaticos_model->obtener_viaticos($dt);
    $success = false;
    if (count($data) > 0) {
      $success = true;
    }
    echo json_encode(array(
      'success' => $success,
      'data' => $data
    ));
  }

  public function obtener_proveedores()
  {
    $data = $this->viaticos_model->obtener_proveedores();
    $success = false;
    if (count($data) > 0) {
      $success = true;
    }
    echo json_encode(array(
      'success' => $success,
      'data' => $data
    ));
  }

  public function validar_estado()
  {
    $data = $this->input->post('codigo');
    $result = $this->viaticos_model->validar_estado($data);
    $success = false;
    if ($result[0]['gasestado'] == 'E') {
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
