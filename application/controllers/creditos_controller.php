<?php 
defined('BASEPATH') OR exit('No direct script access allowed');

class creditos_controller extends CI_Controller
{
	
	function __construct()
	{
		parent::__construct();
		$this->load->model('creditos_model');
	}

	 //Cargando Vistas
  public function index($nombre_minuscula, $titulo, $accMod, $tip) {
    $next = false;
    $resultado = $this->creditos_model->validar_session();
    if ($resultado === false) {
      header('Location: login');
    } else {
      $this->load->model('sistema/permisos_model');
      $acciones = $this->permisos_model->obtener_acciones();
      $datos = array(
        'acciones' => $acciones
      );
      foreach ($acciones as $data) {
        if ($data['mod_nombre'] == $titulo && $data['acc_descripcion'] == "Ver") {
          $next = true;
        }
      }
      $parametros = array(
        'controlador' => 'creditos_controller',
        'titulo' => $titulo,
        'modalName' => 'modalCreditos',
        'clase' => 'CRE',
        'tipo' => $nombre_minuscula,
        'accMod' => $accMod,
        'tip' => $tip
      );
      if ($next) {
        $this->load->view('shared/header');
        $this->load->view('shared/menu', $datos);
        $this->load->view('Creditos_view', $parametros);
        $this->load->view('shared/ubicaciones');
        $this->load->view('shared/footer');
      } else {
        header('Location: inicio');
      }
    }
  }


  public function creditos() {
    $next = false;
    $this->load->model('sistema/permisos_model');
    $acciones = $this->permisos_model->obtener_acciones();
    $datos = array(
      'acciones' => $acciones
    );
    foreach ($acciones as $data) {
      if ($data['mod_nombre'] == "Creditos" && $data['acc_descripcion'] == "Ver") {
        $next = true;
      }
    }
    if ($next === true) {
      $this->index('creditos', 'Creditos', 'Creditos', 'CRE');
    } else {
      header("Location: inicio");
    }
  }

  

  public function obtener_doccliente()
  {
    $clientes = $this->creditos_model->obtener_doccliente();
    $i = 0;
    $success = false;
    if (count($clientes) > 0) {
      
    echo json_encode(array(
      'success' => true,
      'data' => $clientes
    ));
    }
  }

  public function guardar_credito()
  {
  	$datos = $this->input->post();

  	$respuesta = $this->creditos_model->guardar_credito($datos);
  	
  	if ($respuesta === true)
  	{
  		echo json_encode(
  			array(
  				'success'=>true
  			)
  		);
  	}else{
  		echo json_encode(
  			array(
  				'success'=>false
  			)
  		);
  	}
  }

  public function obtener_creditos()
  {
  	$respuesta = $this->creditos_model->obtener_creditos();
  	$cantidad = count($respuesta);
  	if ($cantidad>0)
  	{
  		echo json_encode(
  			array(
  				'success'=>true,
  				'cantidad'=>$cantidad,
  				'data'=>$respuesta
  			)
  		);
  	}
  }


}
 ?>