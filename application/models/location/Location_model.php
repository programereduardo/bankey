<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class location_model extends CI_Model {
  public function __construct()
  {
    parent::__construct();
  }

  public function get_location()
  {
    $this->db->select('f.facnumero');
    $this->db->select('l.loclongitud');
    $this->db->select('l.loclatitud');
    $this->db->select('r.relvenprincipal');
    $this->db->select('r.relvensecundario');
    $this->db->from($this->db->schema3.'.confacturas as f');
    $this->db->join($this->db->schema2.'.glolocalizacion as l', 'f.facnumero = l.locfactura');
    $this->db->join($this->db->schema2.'.glorelvendedores as r', 'f.facrelvendedor = r.relvencodigo');
    $this->db->order_by('facnumero', 'DESC');
    $this->db->limit('1');
    $re = $this->db->get();
    return $re->result_array();
  }
 
  public function search_location($data)
  {
    $this->db->select('f.facnumero');
    $this->db->select('f.facfecent');
    $this->db->select('l.loclongitud');
    $this->db->select('l.loclatitud');
    $this->db->select('r.relvenprincipal');
    $this->db->select('r.relvensecundario');
    $this->db->from($this->db->schema3.'.confacturas as f');
    $this->db->join($this->db->schema2.'.glolocalizacion as l', 'f.facnumero = l.locfactura');
    $this->db->join($this->db->schema2.'.glorelvendedores as r', 'f.facrelvendedor = r.relvencodigo');
    if (isset($data['vendedor_id']) && !empty($data['vendedor_id'])) {
      $this->db->where('r.relvenprincipal', $data['vendedor_id']);
      
      
      $this->db->or_where('r.relvensecundario', $data['vendedor_id']);
      
    }
    if (isset($data['desde']) && !empty($data['desde'])) {
      $this->db->where('facfecent >=', $data['desde']);
    }
    if (isset($data['hasta']) && !empty($data['hasta'])) {
      $this->db->where('facfecent <=', $data['hasta']);
    }
    $this->db->order_by('facnumero', 'DESC');
    $re = $this->db->get();
    return $re->result_array();
  }
}
