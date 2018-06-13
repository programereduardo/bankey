<?php
  defined('BASEPATH') OR exit('No direct script access allowed');

  class reportes_model extends CI_model
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

    public function cargar_facturas($data)
    {
      $this->db->select('facnumero');
      $this->db->select('faccliente');
      $this->db->select('facvendedor');
      $this->db->select('factotal');
      $this->db->select('facestado');
      $this->db->select('facfecent');
      $this->db->select('facfecvenci');
      $this->db->select('faciva');
      $this->db->select('facdescuento');
      $this->db->select('facsubtotal');
      $this->db->select('gloterceros.ternombre as cliente');
      $this->db->select('gloterceros.terdocnum as numdoc');
      $this->db->select('gloterceros.terdigver as dv');
      $this->db->select('gloterceros.ternom1 as primernombrecliente');
      $this->db->select('gloterceros.ternom2 as segundonombrecliente');
      $this->db->select('gloterceros.terape1 as primerapellidocliente');
      $this->db->select('gloterceros.terape2 as segundoapellidocliente');
      $this->db->select('gloterceros.tertipogrupo as tipo');
      $this->db->select('vendedor.ternombre as vendedor');
      $this->db->select('gloterceros.terclave as clavecliente');
      $this->db->from($this->db->schema3.'.confacturas');
      $this->db->join($this->db->schema2.'.gloterceros', 'contabilidad.confacturas.faccliente = global.gloterceros.tercodigo');
      $this->db->join($this->db->schema2.'.gloterceros vendedor', 'contabilidad.confacturas.facvendedor = vendedor.tercodigo');
      if ($data === true) {
        $this->db->limit(20);
      }
      $this->db->order_by('facnumero', 'DESC');
      $result = $this->db->get();
      return $result->result_array();
    }

    public function busqueda($data)
    {
      $this->db->select('facnumero');
      $this->db->select('faccliente');
      $this->db->select('facvendedor');
      $this->db->select('factotal');
      $this->db->select('facestado');
      $this->db->select('facfecent');
      $this->db->select('facfecvenci');
      $this->db->select('faciva');
      $this->db->select('facdescuento');
      $this->db->select('facsubtotal');
      $this->db->select('gloterceros.ternombre as cliente');
      $this->db->select('gloterceros.terdocnum as numdoc');
      $this->db->select('gloterceros.terdigver as dv');
      $this->db->select('gloterceros.ternom1 as primernombrecliente');
      $this->db->select('gloterceros.ternom2 as segundonombrecliente');
      $this->db->select('gloterceros.terape1 as primerapellidocliente');
      $this->db->select('gloterceros.terape2 as segundoapellidocliente');
      $this->db->select('gloterceros.tertipogrupo as tipo');
      $this->db->select('vendedor.ternombre as vendedor');
      $this->db->select('gloterceros.terclave as clavecliente');
      $this->db->from($this->db->schema3.'.confacturas');
      $this->db->join($this->db->schema2.'.gloterceros', 'contabilidad.confacturas.faccliente = global.gloterceros.tercodigo');
      $this->db->join($this->db->schema2.'.gloterceros vendedor', 'contabilidad.confacturas.facvendedor = vendedor.tercodigo');
      if (isset($data['cliente']) && !empty($data['cliente'])) {
        $this->db->where('faccliente', $data['cliente']);
      }
      if (isset($data['vendedor']) && !empty($data['vendedor'])) {
        $this->db->where('facvendedor', $data['vendedor']);
      }
      if (isset($data['desde']) && !empty($data['desde'])) {
        $this->db->where('facfecent >=', $data['desde']);
      }
      if (isset($data['hasta']) && !empty($data['hasta'])) {
        $this->db->where('facfecent <=', $data['hasta']);
      }
      if (isset($data['estado']) && !empty($data['estado'])) {
        $this->db->where('facestado', $data['estado']);
      }
      $this->db->order_by('facnumero', 'DESC');
      $result = $this->db->get();
      return $result->result_array();
    }
  }
