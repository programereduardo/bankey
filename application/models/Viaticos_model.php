<?php
  defined('BASEPATH') OR exit('No direct script access allowed');

  class viaticos_model extends CI_model
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

    public function salvar_viatico($datos)
    {
      $vendedor = $this->session->userdata('tercero');
      if (isset($datos['vendedor-id'])) {
        $vendedor = $datos['vendedor-id'];
      }
      $datos_insertar = array(
        'gasvendedor' => $vendedor,
        'gastipo' => $datos['tipo_viatico'],
        'gasfecha' => $datos['fecha'],
        'gasfactura' => $datos['factura'],
        'gasproveedor' => $datos['proveedor'],
        'gassubtotal' => $datos['subtotal'],
        'gasiva' => $datos['iva'],
        'gasreteiva' => $datos['reteiva'],
        'gasreteica' => $datos['reteica'],
        'gasretefuente' => $datos['retefuente'],
        'gastotal' => $datos['total'],
        'gasobservacion' => $datos['observacion'],
        'gasfechacrea' => date('Y-m-d'),
        'gasusuariocrea' => $this->session->userdata('usuario')
      );
      $this->db->insert($this->db->schema3.'.congastos', $datos_insertar);
      return true;
    }

    public function actualizar_viatico($datos)
    {
      $vendedor = $this->session->userdata('tercero');
      if (isset($datos['vendedor-id'])) {
        $vendedor = $datos['vendedor-id'];
      }
      $this->db->set('gasvendedor', $vendedor);
      $this->db->set('gastipo', $datos['tipo_viatico']);
      $this->db->set('gasfecha', $datos['fecha']);
      $this->db->set('gasfactura', $datos['factura']);
      $this->db->set('gasproveedor', $datos['proveedor']);
      $this->db->set('gassubtotal', $datos['subtotal']);
      $this->db->set('gasiva', $datos['iva']);
      $this->db->set('gasreteiva', $datos['reteiva']);
      $this->db->set('gasreteica', $datos['reteica']);
      $this->db->set('gasretefuente', $datos['retefuente']);
      $this->db->set('gastotal', $datos['total']);
      $this->db->set('gasobservacion', $datos['observacion']);
      $this->db->where('gascodigo', $datos['codigo_viatico']);
      $this->db->update($this->db->schema3.'.congastos');
      return true;
    }

    public function obtener_viaticos($data)
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

    public function obtener_proveedores()
    {
      $this->load->helper('Glotipos_helper');
      $mivariable = obtener_codigo_glotipos('SER', 'TERTIP');
      $micodigo = $mivariable[0]['tipcodigo'];
      $this->db->select('tercodigo');
      $this->db->select('ternombre');
      $this->db->from($this->db->schema2.'.gloterceros');
      $this->db->where('tertipo', $micodigo);
      $this->db->where('teractivo', 'S');
      $this->db->order_by('ternombre', 'ASC');
      $query = $this->db->get();
      return $query->result_array();
    }

    public function accion($codigo, $data)
    {
      $success = false;
      $this->db->set('gasestado', $data);
      if ($data == 'N') {
        $this->db->set('gasfechaanula', date('Y-m-d'));
        $this->db->set('gasusuarioanula', $this->session->userdata('usuario'));
      }
      $this->db->where('gascodigo', $codigo);
      if ($this->db->update($this->db->schema3.'.congastos')){
        $success = true;
      }
      return $success;
    }

    public function validar_estado($data)
    {
      $this->db->select('gasestado');
      $this->db->from($this->db->schema3.'.congastos');
      $this->db->where('gascodigo', $data);
      $result = $this->db->get();
      return $result->result_array();
    }
  }
