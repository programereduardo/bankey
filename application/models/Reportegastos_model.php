<?php
  defined('BASEPATH') OR exit('No direct script access allowed');

  class reporteGastos_model extends CI_model
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

    public function cargar_gastos($data)
    {
      $this->db->select('congastos.*');
      $this->db->select('glotipos.tipdetalle');
      $this->db->from($this->db->schema3.'.congastos');
      $this->db->join($this->db->schema2.'.glotipos', 'contabilidad.congastos.gastipo = global.glotipos.tipcodigo');
      $this->db->order_by('gascodigo', 'DESC');
      if ($data === false) {
        $this->db->limit(20);
      }
      $result = $this->db->get();
      return $result->result_array();
    }

    public function busqueda($data)
    {      
      $this->db->select('congastos.*');
      $this->db->select('glotipos.tipdetalle');
      $this->db->from($this->db->schema3.'.congastos');
      $this->db->join($this->db->schema2.'.glotipos', 'contabilidad.congastos.gastipo = global.glotipos.tipcodigo');
      $this->db->order_by('gascodigo', 'DESC');

      if (isset($data['estado']) && !empty($data['estado'])) {
        $this->db->where('gasestado', $data['estado']);
      }

      if (isset($data['desde']) && !empty($data['desde'])) {
        $this->db->where('gasfecha >=', $data['desde']);
      }

      if (isset($data['hasta']) && !empty($data['hasta'])) {
        $this->db->where('gasfecha <=', $data['hasta']);
      }

      $result = $this->db->get();
      return $result->result_array();


      $this->db->order_by('gascodigo', 'DESC');
      $result = $this->db->get();
      return $result->result_array();
    }
  }
