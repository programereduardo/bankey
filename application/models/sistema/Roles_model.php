<?php

  class roles_model extends CI_model
  {

    function __construct()
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

    public function obtener_modulos($data)
    {
      #'ACCION1' as VER,
      #'ACCION2' as CREAR,
      #'ACCION3' as MODIFICAR,
      #'ACCION4' as ELIMINAR
      $sql = "SELECT DISTINCT
              mod_codigo,
              mod_nombre,
              mod_orden
              FROM seg_permisos AS permisos
              LEFT JOIN seg_acciones AS accion ON permisos.seg_accion = accion.acc_codigo AND accion.acc_descripcion = 'Ver'
              LEFT JOIN seg_modulos AS modulos ON accion.acc_modulo = modulos.mod_codigo
              WHERE seg_roles = $data
              ORDER BY mod_orden ASC
            ";

      $result = $this->db->query($sql);
      return $result->result_array();
    }

    public function obtener_acciones($data)
    {
      $rol = $data['rol'];
      $modulo = $data['modulo'];
      $sql = "SELECT DISTINCT
            acc_codigo,
            acc_descripcion
            FROM  seg_permisos AS permisos
            LEFT JOIN seg_acciones AS acciones ON permisos.seg_accion = acciones.acc_codigo AND acciones.acc_estado = 1
            JOIN seg_modulos as modulos ON acciones.acc_modulo = modulos.mod_codigo AND modulos.mod_codigo = $modulo
            WHERE SEG_ROLES = $rol
            ORDER BY acc_codigo ASC";

      $result = $this->db->query($sql);
      return $result->result_array();
    }

    public function obtener_smodulos()
    {
      $this->db->select('mod_codigo');
      $this->db->select('mod_nombre');
      $this->db->from('seg_modulos');
      $this->db->order_by('mod_orden', 'ASC');
      $result = $this->db->get();
      return $result->result_array();
    }

    public function eliminar_rol($data)
    {
      $this->db->set('rol_estado', 2);
      $this->db->where('rol_codigo', $data);
      $this->db->update('seg_roles');
      return true;
    }

    public function obtener_roles()
    {
      $this->db->select('rol_codigo');
      $this->db->select('rol_nombre');
      $this->db->select('rol_estado');
      $this->db->from('seg_roles');
      //$this->db->where('rol_estado', 1);
      $this->db->order_by('rol_nombre', 'ASC');
      $result = $this->db->get();
      return $result->result_array();
    }

    public function validar_rol($data)
    {
      $this->db->select('rol_nombre');
      $this->db->from('seg_roles');
      $this->db->where('rol_nombre', $data);
      $result = $this->db->get();
      return $result->result_array();
    }

    public function validar_modulo($data)
    {
      $this->db->select('rol_nombre');
      $this->db->from('seg_roles');
      $this->db->where('rol_nombre', $data);
      $result = $this->db->get();
      return $result->result_array();
    }

    public function salvar_rol($data)
    {
      $rol = array(
        'rol_nombre' => $data['rol'],
        'rol_estado' => 1
      );
      $this->db->insert('seg_roles', $rol);
      return true;
    }

    public function actualizar_rol($data)
    {
      $this->db->set('rol_nombre', $data['rol']);
      $this->db->set('rol_estado', $data['estado']);
      $this->db->where('rol_codigo', $data['codigo_rol']);
      $this->db->update('seg_roles');

      return true;
    }
  }
