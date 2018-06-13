<?php
  defined('BASEPATH') OR exit('No direct script access allowed');

  class reportesCli_model extends CI_model
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

    public function buscar($data)
    {
      if ($data['pais'] == "" || $data['pais'] == "NA") {

      }
      $this->db->select('*');
      $this->db->from($this->db->schema2.'.gloterceros');
      if ($data['tipo'] !== "" && $data['tipo'] !== "NA") {
        $this->db->where('tertipogrupo', $data['tipo']);
      }
      $this->db->join($this->db->schema2.'gloterubicaciones');
      $result = $this->db->get();
      return $result->result_array();
    }

    public function obtener_nombre_pais($data)
    {
      $this->db->select('painombre');
      $this->db->from($this->db->schema2.'.glopaises');
      $this->db->where('paicodigo', $data);
      $result = $this->db->get();
      $retorno = $result->result_array();
      return $retorno[0]['painombre'];
    }

    public function obtener_nombre_estado($data)
    {
      $this->db->select('depnombre');
      $this->db->from($this->db->schema2.'.glodepartamentos');
      $this->db->where('depcodigo', $data);
      $result = $this->db->get();
      $retorno = $result->result_array();
      return $retorno[0]['depnombre'];
    }


    public function obtener_nombre_ciudad($data)
    {
      $this->db->select('munnombre');
      $this->db->from($this->db->schema2.'.glomunicipios');
      $this->db->where('muncodigo', $data);
      $result = $this->db->get();
      $retorno = $result->result_array();
      return $retorno[0]['munnombre'];
    }

    public function obtener_nombre_barrios($data)
    {
      $this->db->select('barnombre');
      $this->db->from($this->db->schema2.'.globarrios');
      $this->db->where('barcodigo', $data);
      $result = $this->db->get();
      $retorno = $result->result_array();
      return $retorno[0]['barnombre'];
    }
  }
