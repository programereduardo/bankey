<?php
  class permisos_model extends CI_model
  {

    function __construct()
    {
      parent::__construct();
    }

    public function obtener_rol($data, $nombre_rol)
    {
      $this->db->select('rol_codigo');
      $this->db->select('rol_nombre');
      $this->db->from('seg_rolesusuarios');
      $this->db->join('seg_roles', 'seg_rolesusuarios.rol_roles = seg_roles.rol_codigo');
      if ($data !== false) {
        $this->db->where('rol_usuarios', $data);
      }
      if ($nombre_rol !== false) {
        $this->db->where('rol_nombre', $nombre_rol);
      }
      $this->db->where('rol_estado', 1);
      $result = $this->db->get();
      $dato = $result->result_array();
      return $dato;
    }

    public function get_rol($nombre_rol)
    {
      $this->db->select('rol_codigo');
      $this->db->select('rol_nombre');
      $this->db->from('seg_roles');
      if ($nombre_rol !== false && $nombre_rol !== '' && $nombre_rol !== NULL) {
        $this->db->where('rol_nombre', $nombre_rol);
      }
      $this->db->where('rol_estado', 1);
      $result = $this->db->get();
      $dato = $result->result_array();
      return $dato;
    }

    public function generar_pin_vendedor(){
      function generar_pin() {
        $pin =  substr(uniqid(rand(), true), 0, 4);
        settype($pin, 'integer');
        return $pin;
      }

      $this->db->select('seg_usuarios.usu_codigo');
      $this->db->select('seg_rolesusuarios.rol_roles');
      $this->db->select('seg_roles.rol_nombre');
      $this->db->from('seg_usuarios');
      $this->db->join('seg_rolesusuarios', 'seg_usuarios.usu_codigo = seg_rolesusuarios.rol_usuarios', 'left');
      $this->db->join('seg_roles', 'seg_rolesusuarios.rol_roles = seg_roles.rol_codigo', 'left');
      $this->db->where('usu_estado', 1);
      $this->db->where('usu_usuario <>', 'SyntaxCompany');
      $this->db->where('seg_roles.rol_nombre', 'Vendedor');

      $result = $this->db->get();
      $dato = $result->result_array();

      $ret = false;
      if (count($dato) > 0) {

        foreach ($dato as $data) {
          $pin = generar_pin();
          $this->db->set('usu_pin', $pin);
          $this->db->where('usu_codigo', $data['usu_codigo']);
          $this->db->update('seg_usuarios');
        }
        $ret =  true;
      }

      return $ret;

    }

    public function obtener_acciones()
    {
      $rol = $this->obtener_rol(false, $this->session->userdata('rol'));
      $codigo_rol = $rol[0]['rol_codigo'];

      $this->db->select('acc_descripcion');
      $this->db->select('mod_nombre');
      $this->db->select('mod_orden');
      $this->db->from('seg_permisos');
      $this->db->where('seg_roles', $codigo_rol);
      $this->db->join('seg_acciones', 'seg_permisos.seg_accion = seg_acciones.acc_codigo');
      $this->db->join('seg_modulos', 'seg_acciones.acc_modulo = seg_modulos.mod_codigo');
      $this->db->group_by('seg_modulos.mod_nombre');
      $this->db->group_by('seg_acciones.acc_descripcion');
      $this->db->group_by('seg_modulos.mod_orden');
      $this->db->order_by('mod_orden', 'ASC');
      $result = $this->db->get();
      $data = $result->result_array();
      return $data;
    }

    public function obtener_codigo_rol($data)
    {
      $this->db->select('rol_codigo');
      $this->db->from($this->d->schema1.'.seg_roles');
      $this->db->where('rol_nombre', $data);
      $result = $this->db->get();
      return $result->result_array();
    }

  }
