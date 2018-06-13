<?php 
defined('BASEPATH') OR exit('No direct script access allowed');

class creditos_model extends CI_Model
{
	
	function __construct()
	{
		parent::__construct();
		$this->session->set_userdata('interes',0.20);
		date_default_timezone_set("America/Bogota");
	}

	public function validar_session()
	{
      $verificar = $this->session->userdata("logueado");
      if ($verificar == TRUE) {
        return true;
      } else {
        return false;
      }
    }

    public function obtener_doccliente()
    {
    	$this->db->select('*');
    	$this->db->from('terceros');
        $this->db->order_by('ter_pnombre','ASC');
    	$query = $this->db->get();
    	$resultado = $query->result_array();
    	return $resultado;
    }

    public function guardar_credito($datos)
    {
    	$fecha = date('Y-m-d');
    	$valor_interes = $datos['valor']*$this->session->userdata('interes');
    	$guardar_datos = array(
    		'ter_id' =>$datos['cliente'] ,
    		'cre_valor'=>$datos['valor'],
    		'cre_interes'=>$valor_interes,
    		'cre_fechaprest'=>$fecha,
    		'cre_estado'=>'A'
    		 );
    	$resultado = $this->db->insert('creditos',$guardar_datos);
    	return $resultado;
    }

    public function obtener_creditos()
    {
        $this->db->select('creditos.*');
        $this->db->select('terceros.*');
        $this->db->from('creditos');
        $this->db->join('terceros','terceros.ter_id = creditos.ter_id');
        $query = $this->db->get();
        $resultado = $query->result_array();
        return $resultado;
    }


}


 ?>