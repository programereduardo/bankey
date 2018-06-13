<?php
  defined('BASEPATH') OR exit('No direct script access allowed');

  class gastos_model extends CI_model
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

    public function salvar_gasto($data)
    {
      $fecha = date('Y-m-d');
      $data_insertar = array(
        'gastipo' => $data['tipo_gasto'],
        'gasvalor' => $data['valor'],
        'gasfecha' => $data['fecha'],
        'gasusuariocrea' => $this->session->userdata('usuario'),
        'gasfechacrea' => $fecha,
        'gasestado' => 'S'
      );
      $this->db->insert($this->db->schema3.'.congastos', $data_insertar);
      return true;
    }

    public function actualizar_articulo($datos)
    {
      $this->db->set('artbarcode', $datos['codigobarra']);
      $this->db->set('artreferencia', $datos['referencia']);
      $this->db->set('artnombre', $datos['nombrearticulo']);
      $this->db->set('artdescripcion', $datos['descripcion']);
      $this->db->set('artresumen', $datos['nombrecorto']);
      $this->db->set('artlinea', $datos['linea']);
      $this->db->set('artfamilia', $datos['familia']);
      $this->db->set('artmarca', $datos['marca']);
      $this->db->set('artgrupo', $datos['grupo']);
      $this->db->set('artunidad', $datos['unidad']);
      $this->db->set('artporcentajeiva', $datos['iva']);
      $this->db->set('artexistencias', $datos['cantidad']);
      $this->db->set('artstock', $datos['cantidadmin']);
      $this->db->set('artvalor', $datos['valor']);
      $this->db->where('artcodigo', $datos['codigo_cliente']);
      $this->db->update($this->db->schema3.'.conarticulos');
      return true;
    }

    public function actualizar_familia($datos)
    {
      $this->db->set('tipclave', $datos['clave']);
      $this->db->set('tipdetalle', $datos['detalle']);
      $this->db->set('tipabreviatura', $datos['abreviatura']);
      $this->db->where('tipcodigo', $datos['codigo_familia']);
      $this->db->update($this->db->schema2.'.glotipos');
      return true;
    }

    public function reporteArticulos()
    {
      $this->db->select('conarticulos.*');
      $this->db->select('global.glotipos.tipdetalle as familia');
      $this->db->select('tipo2.tipdetalle as linea');
      $this->db->select('tipo3.tipdetalle as grupo');
      $this->db->select('tipo4.tipdetalle as marca');
      $this->db->select('tipo5.tipdetalle as unidad');
      $this->db->where('artestado', 'S');
      $this->db->from($this->db->schema3.'.conarticulos');
      $this->db->join($this->db->schema2.'.glotipos', 'contabilidad.conarticulos.artfamilia = global.glotipos.tipcodigo');
      $this->db->join($this->db->schema2.'.glotipos tipo2', 'contabilidad.conarticulos.artlinea = tipo2.tipcodigo');
      $this->db->join($this->db->schema2.'.glotipos tipo3', 'contabilidad.conarticulos.artgrupo = tipo3.tipcodigo');
      $this->db->join($this->db->schema2.'.glotipos tipo4', 'contabilidad.conarticulos.artmarca = tipo4.tipcodigo');
      $this->db->join($this->db->schema2.'.glotipos tipo5', 'contabilidad.conarticulos.artunidad = tipo5.tipcodigo');
      $this->db->order_by('artnombre', 'ASC');
      $query = $this->db->get();
      $result = $query->result_array();
      return $result;
    }

    public function obtener_gastos()
    {
      /*$this->load->helper('Glotipos_helper');
      $tipsus = obtener_codigo_glotipos('DIA', 'TIPSUS');
      $codigosus = $tipsus[0]['tipcodigo'];*/

      $this->db->select('congastos.*');
      $this->db->select('glotipos.tipdetalle');
      $this->db->from($this->db->schema3.'.congastos');
      $this->db->join($this->db->schema2.'.glotipos', 'contabilidad.congastos.gastipo = global.glotipos.tipcodigo');
      $this->db->order_by('gascodigo', 'DESC');
      $query = $this->db->get();
      $result = $query->result_array();
      return $result;
    }

    public function inactivar_gasto($codigo)
    {
      $fecha = date('Y-m-d');
      $this->db->set('gasestado', 'N');
      $this->db->set('gasfechaanula', $fecha);
      $this->db->set('gasusuarioanula', $this->session->userdata('usuario'));
      $this->db->where('gascodigo', $codigo);
      $this->db->update($this->db->schema3.'.congastos');
      return true;
    }

    public function obtener_tipo_gastos()
    {
      $this->db->select('tipcodigo');
      $this->db->select('tipdetalle');
      $this->db->where('tipactivo', 'S');
      $this->db->where('tipgrupo', 'TIPGAS');
      $this->db->from($this->db->schema2.'.glotipos');
      $this->db->order_by('tipcodigo', 'ASC');
      $query = $this->db->get();
      $result = $query->result_array();
      return $result;
    }

    public function validar_suscripcion($dt)
    {
      $fecha = date('Y-m-d');
      $hora = date('h:m:s A');
      $success = false;
      $type = 'success';
      $msg = 'Suscripción utilizada exítosamente.';

      $this->load->helper('glotiposuscripcion_Helper');
      $tipsus = obtener_codigo_glotiposuscripcion('DIA', 'TIPSUS');
      $codigosus = $tipsus[0]['tipcodigo'];

      $this->db->select('tercodigo');
      $this->db->where('terdocnum', $dt);
      $this->db->from($this->db->schema2.'.gloterceros');
      $query = $this->db->get();
      $result = $query->result_array();

      if (count($result) > 0) {
        $success = true;
        $tercodigo = $result[0]['tercodigo'];
        $this->db->select('suscodigo');
        $this->db->select('susfechainicio');
        $this->db->select('susfechafin');
        $this->db->where('susestado', 'S');
        $this->db->where('sustercero', $tercodigo);
        $this->db->where('sustipo<>', $codigosus);
        $this->db->from($this->db->schema4.'.gymsuscripciones');
        $search = $this->db->get();
        $datos = $search->result_array();
        if (count($datos) > 0) {
          $sucess = true;
          $suscodigo = $datos[0]['suscodigo'];
          $susfechainicio = $datos[0]['susfechainicio'];
          $susfechafin = $datos[0]['susfechafin'];
          if ($susfechafin < $fecha) {
            $success = false;
            $type = 'danger';
            $msg = 'Error! Usted no tiene ninguna suscripción activa.';
          }
        } else {
          $success = false;
          $type = 'danger';
          $msg = 'Error! Usted no tiene ninguna suscripción activa.';
        }
      } else {
        $success = false;
        $type = 'danger';
        $msg = 'Error! Usted no tiene ninguna suscripción activa.';
      }

      if ($success === true) {
        $datos_insert = array(
          'asisuscripcion' => $suscodigo,
          'asifecha' => $fecha,
          'asihora' => $hora
        );
        $this->db->insert($this->db->schema4.'.gymasistencias', $datos_insert);
      }
      $data = array(
        'success' => $success,
        'msg' => $msg,
        'type' => $type
      );

      return $data;
    }
  }
