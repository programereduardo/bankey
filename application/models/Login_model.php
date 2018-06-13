<?php
  class login_model extends CI_model
  {
    public function __construct()
    {
      parent::__construct();
      $db['default']['schema'] = 'SEGURIDAD';
    }

    private $user;
    private $pass;

    public function login($user, $password)
    {
      $this->user = $user;
      $this->pass = $password;
      $this->db->select('*');
      $this->db->from('seg_usuarios');
      $this->db->where('usu_password', md5($this->pass));
      $this->db->where('usu_usuario', $this->user);
      $resp = $this->db->get();
      $query = $resp->result_array();
      return $query;
    }

    public function validar_session(){
      $verificar = $this->session->userdata("logueado");
      if ($verificar == TRUE) {
        return true;
      } else {
        return false;
      }
    }

    public function validar_pin_vendedor($data)
    {      
      $this->db->distinct();
      $this->db->select('usu_pin');
      $this->db->from('seg_usuarios');
      $this->db->where('usu_codigo', $data);
      #$this->db->where('usu_pin', $data['pin']);
      $result = $this->db->get();
      $data = $result->result_array();
      return $data[0]['usu_pin'];
    }

    public function obtener_datos_vendedor($data)
    {
      $this->db->select('*');
      $this->db->from('seg_usuarios');
      $this->db->where('usu_codigo', $data);
      $resp = $this->db->get();
      $query = $resp->result_array();
      return $query;
    }
  }
