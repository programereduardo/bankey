<?php
  defined('BASEPATH') OR exit('No direct script access allowed');

  class home_model extends CI_model
  {
    public function __construct()
    {
      parent::__construct();
    }

    public function validar_session(){
      $verificar = $this->session->userdata("logueado");	  
      if ($verificar == TRUE) {
        return true;
      } else {
        return false;
      }
    }

    public function obtener_terceros()
    {
      $sql = "SELECT COUNT(tertipo) as cant, tertipo, tipabreviatura
              FROM global.gloterceros
              JOIN global.glotipos ON global.gloterceros.tertipo = global.glotipos.tipcodigo
              WHERE teractivo = 'S'
              GROUP BY tertipo, tipabreviatura
              ";
      $result = $this->db->query($sql);
      return $result->result_array();
    }

    public function validar_articulos()
    {
      $this->db->select('artreferencia');
      $this->db->select('artnombre');
      $this->db->select('artexistencias');
      $this->db->select('artstock');
      $this->db->from($this->db->schema3.'.conarticulos');
      $this->db->order_by('artreferencia', 'ASC');
      $data = $this->db->get();
      $result = $data->result_array();	  
      $retorno = array();
      foreach ($result as $datos) {
        if ($datos['artexistencias'] <= $datos['artstock']) {
          $codigo = obtener_codigo_glotipos('ART1', 'TIPNOT');
          if ($datos['artexistencias'] == 0) {
            $codigo = obtener_codigo_glotipos('ART2', 'TIPNOT');
          }
          $datos['artdescripcion'] = $codigo[0]['tipdetalle'];
          array_push($retorno, $datos);
        }
      }
      return $retorno;
    }
  }
