<?php
  defined('BASEPATH') OR exit('No direct script access allowed');

  class control_model extends CI_model
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

    public function guardar_control($data)
    {
      $return = false;
      if (isset($data) && !empty($data)) {
        if ($data['clave_tipo_tercero'] == 'CLI') {
          $tercero = $data['cliente-id'];
        } else {
          $tercero = $data['vendedor-id'];
        }
        $fecha = date('Y-m-d');
        $datos_insertar = array(
                                'invcontercero' => $tercero,
                                'invconarticulo' => $data['producto'],
                                'invconexistencia' => $data['existencia_actual'],
                                'invconpedidos' => $data['pedidos'],
                                'invconfecha' => $data['fecha'],
                                'invconfechacrea' => $fecha,
                                'invconusuariocrea' => $this->session->userdata('usuario'),
                                'invcontipotercero' => $data['tipo_tercero']
                               );
        if ($this->db->insert($this->db->schema3.'.coninvcontrol', $datos_insertar)) {
          $return = true;
        }
      }
      return $return;
    }

    public function actualizar_control($data)
    {
      $this->db->select('invconexistencias');
      $this->db->select('invconpedidos');
      $this->db->from($this->db->schema3.'.coninvcontrol');
      $this->db->where('invconcodigo', $data['codigo_control']);
      $resp = $this->db->get();
      $dt = $resp->result_array();

      $entran = $dt[0]['invconexistencias'] + $data['entran'];
      $salen = $dt[0]['invconpedidos'] + $data['salen'];

      $re = false;
      $this->db->set('invconexistencias', $data['entran']);
      $this->db->set('invconpedidos', $data['salen']);
      $this->db->set('invconfecha', $data['fecha']);
      $this->db->where('invconcodigo', $data['codigo_control']);
      if ($this->db->update($this->db->schema3.'.coninvcontrol')) {
        $re = true;
      }
      return $re;
    }

    public function inactivar_control($dt)
    {
      $re = false;
      $this->db->set('invconestado', 'N');
      $this->db->where('invconcodigo', $dt);
      if ($this->db->update($this->db->schema3.'.coninvcontrol')) {
        $re = true;
      }
      return $re;
    }

    public function obtener_control($data)
    {
      $this->db->select('invconcodigo');
      $this->db->select('invconarticulo');
      $this->db->select('invconexistencias');
      $this->db->select('invconpedidos');
      $this->db->select('invconfecha');
      $this->db->select('ternombre');
      $this->db->select('ternom1');
      $this->db->select('ternom2');
      $this->db->select('terape1');
      $this->db->select('terape2');
      $this->db->select('terdocnum');
      $this->db->select('tertipogrupo');
      $this->db->select('artreferencia');
      $this->db->select('artdescripcion');
      $this->db->from($this->db->schema3.'.coninvcontrol');
      $this->db->join($this->db->schema2.'.gloterceros', 'contabilidad.coninvcontrol.invcontercero = global.gloterceros.tercodigo');
      $this->db->join($this->db->schema3.'.conarticulos', 'contabilidad.coninvcontrol.invconarticulo = contabilidad.conarticulos.artcodigo');
      $this->db->where('invcontipotercero', $data);
      $this->db->where('invconestado', 'S');
      $this->db->where('teractivo', 'S');
      $re = $this->db->get();
      return $re->result_array();
    }

    public function validar_registro($data)
    {
      $this->db->select('invconcodigo');
      $this->db->from($this->db->schema3.'.coninvcontrol');
      $this->db->where('invcontercero', $data['tercero']);
      $this->db->where('invconarticulo', $data['producto']);
      $this->db->where('invconestado', 'S');
      $re = $this->db->get();
      return $re->result_array();
    }
  }
