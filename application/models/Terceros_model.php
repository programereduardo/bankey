<?php
  defined('BASEPATH') OR exit('No direct script access allowed');

  class terceros_model extends CI_model
  {
    public function __construct()
    {
      parent::__construct();
      $db['default']['schema'] = 'GLOBAL';
      date_default_timezone_set("America/Bogota");
    }

    public function validar_session(){
      $verificar = $this->session->userdata("logueado");
      if ($verificar === true) {
        return true;
      } else {
        return false;
      }
    }

    public function salvar_tercero($datos_tercero){
      
      function generar_password() {
        return substr(md5(uniqid(rand(), true)), 0, 8);
      }
      if ($datos_tercero['correo'] == "") {
        $datos_tercero['correo'] = "No Definido";
      }
      //insert to table terceros
      $fecha_creacion = date('Y-m-d H:i:s');
      $data = array(
        'ter_identificacion' => $datos_tercero['numero_documento'],
        'ter_tipo'=>$datos_tercero['tip'],
        'ter_pnombre' => $datos_tercero['nombre1'],
        'ter_snombre' => $datos_tercero['nombre2'],
        'ter_papellido' => $datos_tercero['apellido1'],
        'ter_sapellido' => $datos_tercero['apellido2'],
        'ter_telefono1'=>$datos_tercero['telefono'],
        'ter_telefono2'=>$datos_tercero['celular'],
        'ter_direccionreside'=>$datos_tercero['dir_res'],
        'ter_direcciontrabajo'=>$datos_tercero['dir_trab'],
        'ter_correo'=>$datos_tercero['correo'],
        'ter_feccrea' => $fecha_creacion,
        'ter_usucrea' => $this->session->userdata('usuario'),
        'ter_estado' => 'A'
      );

      $respuesta = $this->db->insert('terceros', $data);
      if ($respuesta === true)
      {
        $this->db->select('*');
        $this->db->from('terceros');
        $this->db->where('ter_identificacion',$datos_tercero['numero_documento']);
        $querytercero = $this->db->get();
        $resultado = $querytercero->result_array();
        $id_tercero = $resultado[0]['ter_id'];

        $data_segusuario = array(
          'usu_estado'=>2,
          'usu_usuario'=>$datos_tercero['numero_documento'],
          'usu_password'=>md5($datos_tercero['numero_documento']),
          'usu_nombres'=>$datos_tercero['nombre1'],
          'usu_apellidos'=>$datos_tercero['apellido1'],
          'usu_email'=>$datos_tercero['correo'],
          'usu_tercero'=>$id_tercero,
          'usu_tipo'=>$datos_tercero['tip']
        );
        $respuestaseguser = $this->db->insert('seg_usuarios',$data_segusuario);

        if ($respuestaseguser === true)
        {
          
            $this->db->select('*');
            $this->db->from('seg_usuarios');
            $this->db->where('usu_tercero',$id_tercero);
            $queryseguser = $this->db->get();
            $resultadoseguser = $queryseguser->result_array();
            $id_seguser = $resultadoseguser[0]['usu_codigo'];

            $datos_roluser = array(
              'rol_usuarios'=>$id_seguser,
              'rol_roles'=>'2'
            );
            $respuestaroluser = $this->db->insert('seg_rolesusuarios',$datos_roluser);
            return $respuestaseguser;

        }
      }


      
    }


    public function obtener_terceros($data){
      
 

      //var_dump($this->db->last_query());

      $this->db->select('*');
      $this->db->from('terceros');
      $this->db->where('ter_estado','A');
      $this->db->where('ter_tipo','CLI');
      $this->db->order_by('ter_id','DESC');
      $query = $this->db->get();
      $data = $query->result_array();
      //$datos = array_merge($array1, $array2); Unir dos arrays

      return $data;
    }

    public function actualizar_tercero($datos_tercero)
    {
      $numedo_documento = strtoupper($datos_tercero['numero_documento']);
     
      $this->db->set('ter_identificacion', $datos_tercero['numero_documento']);
      $this->db->set('ter_pnombre', $datos_tercero['nombre1']);
      $this->db->set('ter_snombre', $datos_tercero['nombre2']);
      $this->db->set('ter_papellido', $datos_tercero['apellido1']);
      $this->db->set('ter_sapellido', $datos_tercero['apellido2']);
      $this->db->set('ter_correo', $datos_tercero['correo']);
      $this->db->set('ter_telefono1', $datos_tercero['telefono']);
      $this->db->set('ter_telefono2', $datos_tercero['celular']);
      $this->db->set('ter_direccionreside', $datos_tercero['dir_res']);
      $this->db->set('ter_direcciontrabajo', $datos_tercero['dir_trab']);
      $this->db->where('ter_id',$datos_tercero['codigo_cliente']);
      $resultado = $this->db->update('terceros');
      
      return $resultado;
    }

    public function inactivar_Cliente($codigo){
      $desactivar = '*';
      $this->db->set('ter_estado', $desactivar);
      $this->db->where('ter_id', $codigo);
      $resultado = $this->db->update('terceros');
      return $resultado;
    }

    //UBICACIONES

    public function obtener_ubicacion($codigo){
      $sql = "SELECT terubicodigo, terubitipo, terubivalor, tipdetalle, barnombre,
              munnombre, depnombre, painombre, barcodigo, muncodigo, depcodigo,
              paicodigo,
              COALESCE(ternombre, '') AS ternombre,
              COALESCE(ternom1, '') AS ternom1,
              COALESCE(ternom2, '') AS ternom2,
              COALESCE(terape1, '') AS terape1,
              COALESCE(terape2, '') AS terape2,
              tertipogrupo
              FROM gloterubicaciones
              JOIN gloterceros ON gloterubicaciones.terubitercero = gloterceros.tercodigo
              JOIN glotipos ON gloterubicaciones.terubitipo = glotipos.tipcodigo
              JOIN globarrios ON gloterubicaciones.terubibarrio = globarrios.barcodigo
              JOIN glomunicipios ON globarrios.barmunicipio = glomunicipios.muncodigo
              JOIN glodepartamentos ON glomunicipios.mundepartamento = glodepartamentos.depcodigo
              JOIN glopaises ON glodepartamentos.deppais = glopaises.paicodigo
              WHERE terubitercero = $codigo
              AND terubiactivo = 'S'";

      $result = $this->db->query($sql);
      $query = $result->result_array();
      return $query;
    }

    public function inactivar_ubicacion($codigo){
      $desactivar = 'N';
      $this->db->set('terubiactivo', $desactivar);
      $this->db->where('terubitercero', $codigo['codigo_ter']);
      $this->db->where('terubicodigo', $codigo['codigo_ubi']);
      $this->db->update('gloterubicaciones');
      return true;
    }

    public function guardar_ubicacion($datos)
    {
      if (!isset($datos['barrio'])) {
        $datos['barrio'] = '0';
      }

      $datos_ubi = array(
        'terubitercero' => $datos['codigof'],
        'terubibarrio' => $datos['barrio'],
        'terubitipo' => $datos['tipo_ubicacion'],
        'terubivalor' => $datos['descripcion']
      );
      $this->db->insert('gloterubicaciones', $datos_ubi);
      return true;
    }

    public function modificar_ubicacion($datos)
    {
      $this->db->set('terubivalor', $datos['descripcion']);
      if (isset($datos['barrio'])) {
        $this->db->set('terubibarrio', $datos['barrio']);
      }
      $this->db->set('terubitipo', $datos['tipo_ubicacion']);
      $this->db->where('terubicodigo', $datos['codigoU']);
      $this->db->update('gloterubicaciones');
      return true;
    }

    public function obtener_paises()
    {
      $this->db->select('*');
      $this->db->from('glopaises');
      $result = $this->db->get();
      $paises = $result->result_array();
      return $paises;
    }

    public function obtener_tertip()
    {
      $this->db->select('*');
      $this->db->from('glotipos');
      $this->db->where('tipgrupo', 'TERTIP');
      $this->db->where('tipclave', 'CLI');
      $this->db->or_where('tipclave', 'EMP');
      $result = $this->db->get();
      $tip1 = $result->result_array();
      return $tip1;
    }

    public function obtenter_estados($codigo_pais)
    {
      $this->db->select('*');
      $this->db->from('glodepartamentos');
      $this->db->where('deppais', $codigo_pais);
      $result = $this->db->get();
      $estados = $result->result_array();
      return $estados;
    }

    public function obtener_ciudades($codigo_estado)
    {
      $this->db->select('*');
      $this->db->from('glomunicipios');
      $this->db->where('mundepartamento', $codigo_estado);
      $result = $this->db->get();
      $ciudades = $result->result_array();
      return $ciudades;
    }

    public function obtener_documentos()
    {
      $this->db->select('*');
      $this->db->from('glotipos');
      $this->db->where('tipgrupo', 'TERDOC');
      $this->db->order_by('tipdetalle', 'ASC');
      $result = $this->db->get();
      $doc = $result->result_array();
      return $doc;
    }

    public function obtener_generos()
    {
      $this->db->select('*');
      $this->db->from('glotipos');
      $this->db->where('tipgrupo', 'TERGEN');
      $result = $this->db->get();
      $gen = $result->result_array();
      return $gen;
    }

    public function obtener_tiposubi()
    {
      $this->db->select('*');
      $this->db->from('glotipos');
      $this->db->where('tipgrupo', 'TERUBI');
      $this->db->where('tipactivo', 'S');
      $this->db->order_by('tipdetalle', 'ASC');
      $result = $this->db->get();
      $ubi = $result->result_array();
      return $ubi;
    }

    public function obtener_barrios($codigo_ciudad)
    {
      $this->db->select('*');
      $this->db->from('globarrios');
      $this->db->where('barmunicipio', $codigo_ciudad);
      $this->db->where('barestado', 'S');
      $this->db->order_by('barnombre', 'ASC');
      $result = $this->db->get();
      $barrios = $result->result_array();
      return $barrios;
    }

    public function guardar_barrio($data)
    {
      $datos = array(
        'barnombre' => $data['nombrebarrio'],
        'barmunicipio' => $data['ciudadBa']
      );
      $this->db->insert('globarrios', $datos);
      return true;
    }

    public function validar_documento($data)
    {
      $this->db->select('*');
      $this->db->from('terceros');
      $this->db->where('ter_identificacion', $data);
      $result = $this->db->get();
      return $result->result_array();
    }

    public function validar_terubipri($tipo, $tercero)
    {
      
      
      
      
      $this->db->select('terubitipo');
      $this->db->from('gloterubicaciones');
      $this->db->where('terubitipo', $tipo);
      $this->db->where('terubitercero', $tercero);
      $result = $this->db->get();
      return $result->result_array();
    }

    public function obtener_regimenes()
    {
      $this->db->select('tipcodigo');
      $this->db->select('tipdetalle');
      $this->db->from('glotipos');
      $this->db->where('tipgrupo', 'TERREG');
      $this->db->where('tipactivo', 'S');
      $this->db->order_by('tipdetalle', 'DESC');
      $result = $this->db->get();
      return $result->result_array();
    }

}
