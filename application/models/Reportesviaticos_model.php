<?php
  defined('BASEPATH') OR exit('No direct script access allowed');

  class reportesViaticos_model extends CI_model
  {
    public function __construct()
    {
      parent::__construct();
      $db['default']['schema'] = 'GLOBAL';
    }


    public function validar_session(){
      $verificar = $this->session->userdata("logueado");
      if ($verificar == TRUE) {
        return true;
      } else {
        return false;
      }
    }

    public function listar_viaticos($data)
    {
      $rol = $this->session->userdata('rol');
      $this->db->select('congastos.gascodigo');
      $this->db->select('congastos.gastipo');
      $this->db->select('congastos.gasfecha');
      $this->db->select('congastos.gasfactura');
      $this->db->select('congastos.gasproveedor');
      $this->db->select('congastos.gasvendedor');
      $this->db->select('congastos.gasobservacion');
      $this->db->select('congastos.gasestado');
      $this->db->select('congastos.gassubtotal');
      $this->db->select('congastos.gasiva');
      $this->db->select('congastos.gasreteiva');
      $this->db->select('congastos.gasreteica');
      $this->db->select('congastos.gasretefuente');
      $this->db->select('congastos.gastotal');
      $this->db->select('glotipos.tipdetalle');
      $this->db->select('glotipos.tipcodigo');
      $this->db->select('proveedor.ternombre as nombre_proveedor');
      $this->db->select('proveedor.tercodigo as codigo_proveedor');
      $this->db->select('gloterceros.tercodigo');
      $this->db->select('gloterceros.terdocnum');
      $this->db->select('gloterceros.ternom1');
      $this->db->select('gloterceros.ternom2');
      $this->db->select('gloterceros.terape1');
      $this->db->select('gloterceros.terape2');
      $this->db->select('gloterceros.ternombre');
      $this->db->select('gloterceros.tertipogrupo');
      $this->db->from($this->db->schema3.'.congastos');
      $this->db->join($this->db->schema2.'.glotipos', 'contabilidad.congastos.gastipo = global.glotipos.tipcodigo');
      $this->db->join($this->db->schema2.'.gloterceros as proveedor', 'contabilidad.congastos.gasproveedor = proveedor.tercodigo', 'left');
      $this->db->join($this->db->schema2.'.gloterceros', 'contabilidad.congastos.gasvendedor = global.gloterceros.tercodigo', 'left');
      if ($rol == "Vendedor") {
        $this->db->where('gasvendedor', $this->session->userdata('tercero'));
      }
      $this->db->where('tipgrupo', $data);
      #$this->db->where('gasestado', 'E');
      $this->db->order_by('gascodigo', 'DESC');
      $r = $this->db->get();
      return $r->result_array();
    }

    public function busqueda($data)
    {      
      $rol = $this->session->userdata('rol');
      $this->db->select('congastos.gascodigo');
      $this->db->select('congastos.gastipo');
      $this->db->select('congastos.gasfecha');
      $this->db->select('congastos.gasfactura');
      $this->db->select('congastos.gasproveedor');
      $this->db->select('congastos.gasvendedor');
      $this->db->select('congastos.gasobservacion');
      $this->db->select('congastos.gasestado');
      $this->db->select('congastos.gassubtotal');
      $this->db->select('congastos.gasiva');
      $this->db->select('congastos.gasreteiva');
      $this->db->select('congastos.gasreteica');
      $this->db->select('congastos.gasretefuente');
      $this->db->select('congastos.gastotal');
      $this->db->select('glotipos.tipdetalle');
      $this->db->select('glotipos.tipcodigo');
      $this->db->select('proveedor.ternombre as nombre_proveedor');
      $this->db->select('proveedor.tercodigo as codigo_proveedor');
      $this->db->select('gloterceros.tercodigo');
      $this->db->select('gloterceros.terdocnum');
      $this->db->select('gloterceros.ternom1');
      $this->db->select('gloterceros.ternom2');
      $this->db->select('gloterceros.terape1');
      $this->db->select('gloterceros.terape2');
      $this->db->select('gloterceros.ternombre');
      $this->db->select('gloterceros.tertipogrupo');
      $this->db->from($this->db->schema3.'.congastos');
      $this->db->join($this->db->schema2.'.glotipos', 'contabilidad.congastos.gastipo = global.glotipos.tipcodigo');
      $this->db->join($this->db->schema2.'.gloterceros as proveedor', 'contabilidad.congastos.gasproveedor = proveedor.tercodigo', 'left');
      $this->db->join($this->db->schema2.'.gloterceros', 'contabilidad.congastos.gasvendedor = global.gloterceros.tercodigo', 'left');
      if ($rol == "Vendedor") {
        $this->db->where('gasvendedor', $this->session->userdata('tercero'));
      }
      if (isset($data['vendedor']) && !empty($data['vendedor'])) {
        $this->db->where('gasvendedor', $data['vendedor']);
      }
      if (isset($data['desde']) && !empty($data['desde'])) {
        $this->db->where('gasfecha >=', $data['desde']);
      }
      if (isset($data['hasta']) && !empty($data['hasta'])) {
        $this->db->where('gasfecha <=', $data['hasta']);
      }
      if (isset($data['tipo']) && !empty($data['tipo'])) {
        $this->db->where('gastipo', $data['tipo']);
      }
      $this->db->where('tipgrupo', $data['grupo']);
      #$this->db->where('gasestado', 'E');
      $this->db->order_by('gascodigo', 'DESC');
      $r = $this->db->get();
      return $r->result_array();
    }

    public function obtener_viaticos_combo($data)
    {
      $this->db->select('tipcodigo');
      $this->db->select('tipdetalle');
      $this->db->from($this->db->schema2.'.glotipos');
      $this->db->where('tipgrupo', $data);
      $this->db->where('tipactivo', 'S');
      $this->db->order_by('tipdetalle', 'ASC');
      $query = $this->db->get();
      return $query->result_array();
    }
  }
