<?php
  defined('BASEPATH') OR exit('No direct script access allowed');

  class tipoubicaciones_model extends CI_model
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

    public function salvar_tipoubicaciones($datos)
    {
      $clave = strtoupper($datos['clave']);
      $datos_insertar = array(
        'tipclave' => $clave,
        'tipdetalle' => $datos['detalle'],
        'tipabreviatura' => $datos['abreviatura'],
        'tipgrupo' => 'TERUBI'
      );
      $this->db->insert($this->db->schema2.'.glotipos', $datos_insertar);
      return true;
    }

    public function actualizar_tipoubicaciones($datos)
    {
      $this->db->set('tipclave', $datos['clave']);
      $this->db->set('tipdetalle', $datos['detalle']);
      $this->db->set('tipabreviatura', $datos['abreviatura']);
      $this->db->where('tipcodigo', $datos['codigo_ubicaciones']);
      $this->db->update($this->db->schema2.'.glotipos');
      return true;
    }

    public function obtener_tipoubicaciones()
    {
      $this->db->select('tipcodigo');
      $this->db->select('tipclave');
      $this->db->select('tipabreviatura');
      $this->db->select('tipdetalle');
      $this->db->where('tipactivo', 'S');
      $this->db->where('tipgrupo', 'TERUBI');
      $this->db->from($this->db->schema2.'.glotipos');
      $this->db->order_by('tipclave', 'ASC');
      $query = $this->db->get();
      $result = $query->result_array();
      return $result;
    }

    public function inactivar_tipoubicaciones($codigo_tipoubicaciones)
    {
      $desactivar = 'N';
      $this->db->set('tipactivo', $desactivar);
      $this->db->where('tipcodigo', $codigo_tipoubicaciones);
      $this->db->update($this->db->schema2.'.glotipos');
      return true;
    }
  }
