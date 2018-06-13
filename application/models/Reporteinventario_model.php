<?php
  defined('BASEPATH') OR exit('No direct script access allowed');

  class reporteInventario_model extends CI_model
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

    public function cargar_articulos($data)
    {
      $this->db->select('conarticulos.*');
      $this->db->select('global.glotipos.tipdetalle as familia');
      $this->db->select('tipo2.tipdetalle as linea');
      $this->db->select('tipo3.tipdetalle as grupo');
      $this->db->select('tipo4.tipdetalle as marca');
      $this->db->select('tipo5.tipdetalle as unidad');
      $this->db->from($this->db->schema3.'.conarticulos');
      $this->db->join($this->db->schema2.'.glotipos', 'contabilidad.conarticulos.artfamilia = global.glotipos.tipcodigo');
      $this->db->join($this->db->schema2.'.glotipos tipo2', 'contabilidad.conarticulos.artlinea = tipo2.tipcodigo');
      $this->db->join($this->db->schema2.'.glotipos tipo3', 'contabilidad.conarticulos.artgrupo = tipo3.tipcodigo');
      $this->db->join($this->db->schema2.'.glotipos tipo4', 'contabilidad.conarticulos.artmarca = tipo4.tipcodigo');
      $this->db->join($this->db->schema2.'.glotipos tipo5', 'contabilidad.conarticulos.artunidad = tipo5.tipcodigo');
      $this->db->where('artestado', 'S');
      $this->db->order_by('artnombre', 'ASC');
      $query = $this->db->get();
      $result = $query->result_array();
      return $result;
    }

    public function busqueda($data)
    {
      $this->db->select('conarticulos.*');
      $this->db->select('global.glotipos.tipdetalle as familia');
      $this->db->select('tipo2.tipdetalle as linea');
      $this->db->select('tipo3.tipdetalle as grupo');
      $this->db->select('tipo4.tipdetalle as marca');
      $this->db->select('tipo5.tipdetalle as unidad');
      $this->db->from($this->db->schema3.'.conarticulos');
      $this->db->join($this->db->schema2.'.glotipos', 'contabilidad.conarticulos.artfamilia = global.glotipos.tipcodigo');
      $this->db->join($this->db->schema2.'.glotipos tipo2', 'contabilidad.conarticulos.artlinea = tipo2.tipcodigo');
      $this->db->join($this->db->schema2.'.glotipos tipo3', 'contabilidad.conarticulos.artgrupo = tipo3.tipcodigo');
      $this->db->join($this->db->schema2.'.glotipos tipo4', 'contabilidad.conarticulos.artmarca = tipo4.tipcodigo');
      $this->db->join($this->db->schema2.'.glotipos tipo5', 'contabilidad.conarticulos.artunidad = tipo5.tipcodigo');
      $this->db->where('artestado', 'S');
      if (isset($data['marca']) && !empty($data['marca'])) {
        $this->db->where('artmarca', $data['marca']);
      }
      if (isset($data['linea']) && !empty($data['linea'])) {
        $this->db->where('artlinea', $data['linea']);
      }
      if (isset($data['unidad']) && !empty($data['unidad'])) {
        $this->db->where('artunidad', $data['unidad']);
      }
      if (isset($data['grupo']) && !empty($data['grupo'])) {
        $this->db->where('artgrupo', $data['grupo']);
      }
      if (isset($data['familia']) && !empty($data['familia'])) {
        $this->db->where('artfamilia', $data['familia']);
      }
      if (isset($data['existencias']) && !empty($data['existencias'])) {
        $this->db->where('artexistencias', $data['existencias']);
      }
      $this->db->order_by('artnombre', 'ASC');
      $result = $this->db->get();
      return $result->result_array();
    }

    public function obtener_marcas()
    {
      $this->db->select('tipcodigo');
      $this->db->select('tipdetalle');
      $this->db->where('tipactivo', 'S');
      $this->db->where('tipgrupo', 'ARTMAR');
      $this->db->from($this->db->schema2.'.glotipos');
      $this->db->order_by('tipdetalle', 'ASC');
      $result = $this->db->get();
      $marcas = $result->result_array();
      return $marcas;
    }
  }
