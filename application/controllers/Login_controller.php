<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class login_controller extends CI_controller {

	public function __construct()
	{
  	parent::__construct();
		$this->load->model('login_model');
 	}

 	public $user;
 	public $password;

	public function index()	{
    $resultado = $this->login_model->validar_session();
    if ($resultado === true) {
      header('Location: inicio');
    } else {
			$this->load->view('shared/scripts');
			$this->load->view('Login_view');
    }
	}

	public function validar_login(){
		header('Access-Control-Allow-Origin: *');
		header('Access-Control-Allow-Methods: GET, POST');  
		$rol = '';
		$success = true;
		$msg = 'Cargando...';
		$codigo_user = '';
		$user = $this->input->post('usuario');
		$password = $this->input->post('password');
		$resultado = $this->login_model->login($user, $password);
		$cantidad = count($resultado);
		if (count($resultado) > 0) {
			if ($resultado[0]['usu_estado'] == "2") {
				$success = false;
				$msg = 'Este usuario esta Inactivo, comuniquese con el Departamento de Sistemas.';
			} else { 
				$codigo_user = $resultado[0]["usu_codigo"];
				$this->load->model('sistema/permisos_model');
				$datos = $this->permisos_model->obtener_rol($resultado[0]["usu_codigo"], false);
				$rol = $datos[0]['rol_nombre'];
				
			}
			if ($rol == "Vendedor") {
				$msg = "Ingrese el PIN.";
			} else {
				if ($success === true) {
					if ($cantidad > 0) {
						$this->session->set_userdata('codigo',$resultado[0]["usu_codigo"]);
						$this->session->set_userdata('estado',$resultado[0]["usu_estado"]);
						$this->session->set_userdata('usuario',$resultado[0]["usu_usuario"]);
						$this->session->set_userdata('apellidos',$resultado[0]["usu_apellidos"]);
						$this->session->set_userdata('email',$resultado[0]["usu_email"]);
						$this->session->set_userdata('logueado', true);
						$this->session->set_userdata('rol', $rol);
						$this->session->set_userdata('tercero', $resultado[0]['usu_tercero']);
						if ($rol == "Gerencia") {
							$generarpin = $this->generar_pin_vendedor();
						}
					} else {
						$msg = 'Credenciales incorrectos.';
					}
				}
			}
		} else {
			$success = false;
			$msg = 'Credenciales incorrectos.';
		}
		echo json_encode(array(
			'rol' => $rol,
			'cod_user' => $codigo_user,
			'success' => $success,
			'msg' => $msg
    ));
	}

	public function generar_pin_vendedor()
	{
		$this->load->model('sistema/permisos_model');
		$result = $this->permisos_model->generar_pin_vendedor();
		return true;
		/*
		echo json_encode(array(
			'success' => $result
		));
		*/
	}

	public function validar_pin_vendedor()
	{
		header('Access-Control-Allow-Origin: *');
		header('Access-Control-Allow-Methods: GET, POST'); 
		$data = $this->input->post();
		$pin = $data['pin'];
		$user = $data['user'];
		$result = $this->login_model->validar_pin_vendedor($user);		
		$success = false;
		$msg = 'Cargando...';
    if ($result !== "" && $result !== NULL) {
			if ($result == $pin) {
				$success = true;
				$datosv = $this->login_model->obtener_datos_vendedor($user);

				$codigo_user = $datosv[0]["usu_codigo"];
				$this->load->model('sistema/permisos_model');
				$datos = $this->permisos_model->obtener_rol($datosv[0]["usu_codigo"], false);
				$rol = $datos[0]['rol_nombre'];

				$this->session->set_userdata('codigo',$datosv[0]["usu_codigo"]);
				$this->session->set_userdata('estado',$datosv[0]["usu_estado"]);
				$this->session->set_userdata('usuario',$datosv[0]["usu_usuario"]);
				$this->session->set_userdata('apellidos',$datosv[0]["usu_apellidos"]);
				$this->session->set_userdata('email',$datosv[0]["usu_email"]);
				$this->session->set_userdata('logueado', true);
				$this->session->set_userdata('rol', $rol);
				$this->session->set_userdata('tercero', $datosv[0]['usu_tercero']);
			} else {
				$success = false;
				$msg = 'Pin invalido';
			}
    } else {
    	$succes = false;
			$msg = 'Pin invalido.';
			$this->cerrar_ses();
    }
    echo json_encode(
      array(
        'success' => $success,
				'msg' => $msg
      )
    );
	}

	public function cerrar_ses(){
		$this->session->sess_destroy();
	}

	public function cerrar_sesion(){
		$this->session->sess_destroy();
		header('Location: login');
	}
}
