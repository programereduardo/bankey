<?php

  class usuarios_model extends CI_model
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

    public function obtener_usuarios($data)
    {
      $this->db->distinct();
      $this->db->select('seg_usuarios.*');
      $this->db->select('terceros.*');
      $this->db->select('seg_rolesusuarios.rol_roles');
      $this->db->select('seg_roles.rol_nombre');
      $this->db->from('seg_usuarios');
      $this->db->join('terceros', 'seg_usuarios.usu_tercero = terceros.ter_id', 'left');
      $this->db->join('seg_rolesusuarios', 'seg_usuarios.usu_codigo = seg_rolesusuarios.rol_usuarios', 'left');
      $this->db->join('seg_roles', 'seg_rolesusuarios.rol_roles = seg_roles.rol_codigo', 'left');
      //$this->db->where('usu_estado', 1);
      $this->db->where('usu_usuario <>', 'SyntaxCompany');
      if ($data !== "Administrador") {
        $this->db->where('seg_roles.rol_nombre', 'Usuario');
      }
      $result = $this->db->get();
      $dato = $result->result_array();      
      return $dato;
    }

    public function eliminar_usuario($data)
    {
      $this->db->set('usu_estado', 2);
      $this->db->where('usu_codigo', $data);
      $this->db->update('seg_usuarios');
      return true;
    }

    public function obtener_roles()
    {
      $this->db->select('rol_nombre');
      $this->db->select('rol_codigo');
      $this->db->from('seg_roles');
      $this->db->where('rol_estado', 1);
      $this->db->order_by('rol_nombre', 'ASC');
      $result = $this->db->get();
      return $result->result_array();
    }

    public function validar_usuario($data)
    {
      $this->db->select('usu_usuario');
      $this->db->from('seg_usuarios');
      $this->db->where('usu_usuario', $data);
      $result = $this->db->get();
      return $result->result_array();
    }

    public function salvar_usuario($data)
    {
      $user = array(
        'usu_usuario' => $data['usuario'],
        'usu_password' => md5($data['confirmacion']),
        'usu_estado' => 1,
        'usu_email' => 'No aplica',
        'usu_nombres' => 'NA',
        'usu_apellidos' => 'NA'
      );
      $this->db->insert('seg_usuarios', $user);

      $this->db->select('usu_codigo');
      $this->db->from('seg_usuarios');
      $this->db->where('usu_usuario', $data['usuario']);
      $result = $this->db->get();
      $dat = $result->result_array();
      $user_codigo = $dat[0]['usu_codigo'];

      $asignarRol = array(
        'rol_roles' => $data['rol'],
        'rol_usuarios' => $user_codigo
      );
      $this->db->insert('seg_rolesusuarios', $asignarRol);

      return true;
    }

    public function actualizar_usuario($data)
    {
      $next = true;
      $success = true;
      $this->db->select('usu_password');
      $this->db->from('seg_usuarios');
      $this->db->where('usu_codigo', $data['codigo_user']);
      $res = $this->db->get();
      $dt = $res->result_array();
      /*$pass = $dt[0]['usu_password'];
      if ($pass !== md5($data['password'])) {
        $next = false;
        $success = false;
      }*/
      if ($next === true) {
        $this->db->set('usu_usuario', $data['usuario']);
        $this->db->set('usu_password', md5($data['confirmacion']));
        if ($data['estado'] !== "0") {
          $this->db->set('usu_estado', $data['estado']);
        }
        $this->db->where('usu_codigo', $data['codigo_user']);
        $this->db->update('seg_usuarios');

        $this->db->select('*');
        $this->db->from('seg_rolesusuarios');
        $this->db->where('rol_usuarios', $data['codigo_user']);
        $re = $this->db->get();
        $data_user = $re->result_array();
        if (count($data_user) > 0) {
          $this->db->set('rol_roles', $data['rol']);
          $this->db->where('rol_usuarios', $data['codigo_user']);
          $this->db->update('seg_rolesusuarios');
        } else {
          $datos = array(
            'rol_roles' => $data['rol'],
            'rol_usuarios' => $data['codigo_user']
          );
          $this->db->insert('seg_rolesusuarios', $datos);
        }
      }

      return $success;
    }
  }
