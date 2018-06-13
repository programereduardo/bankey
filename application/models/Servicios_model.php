<?php
  defined('BASEPATH') OR exit('No direct script access allowed');

  class servicios_model extends CI_model
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

    public function salvar_proveedores($datos_proveedores){
      $tip = obtener_codigo_glotipos($datos_proveedores['tip'], 'TERTIP');
      $this->load->model('sistema/permisos_model');
      $getRol = $this->permisos_model->get_rol($tip[0]['tipdetalle']);
      $codigoRol = $getRol[0]['rol_codigo'];

      function generar_password() {
        return substr(md5(uniqid(rand(), true)), 0, 8);
      }
      //insert to table gloterceros
      $fecha_creacion = date('Y-m-d', time());
      $data = array(
        'tertipdoc' => 14,
        'terdocnum' => $datos_proveedores['nit'],
        'terdigver' => $datos_proveedores['digito_verificacion'],
        'ternombre' => $datos_proveedores['nombre'],
        'terclave' => $datos_proveedores['tip'],
        'tertipo' => $tip[0]['tipcodigo'],
        'terfeccre' => $fecha_creacion,
        'teractivo' => 'S',
        'tertipogrupo' => 1
      );
      $this->db->insert($this->db->schema2.'.gloterceros', $data);

      $this->db->select('tercodigo');
      $this->db->from($this->db->schema2.'.gloterceros');
      $this->db->where('terdocnum', $datos_proveedores['nit']);
      $resp = $this->db->get();
      $valor = $resp->result_array();
      $codigo = $valor[0]['tercodigo'];

      //insert to table ubicaciones of the schema seguridad
      $ubi = array(
        'terubitercero' => $codigo,
        'terubibarrio' => 1,
        'terubitipo' => 9,
        'terubivalor' => $datos_proveedores['correo'],
        'terubiactivo' => 'S'
      );
      $this->db->insert($this->db->schema2.'.gloterubicaciones', $ubi);
      //insert to table usuarios of the scheme seguridad
      //insert to table datosempresa of the scheme GLOBAL
      if ($datos_clientes['retenedor'] == 'NA') {
        $datos_clientes['retenedor'] = 'N';
      }
      if ($datos_clientes['contributivo'] == 'NA') {
        $datos_clientes['contributivo'] = 'N';
      }

      $datos_empresa = array(
        'terdatcodigo' => $codigo,
        'terdatretenedor' => $datos_proveedores['retenedor'],
        'terdatcontributivo' => $datos_proveedores['contributivo'],
        'terdatactivo' => 'S'
      );
      $this->db->insert($this->db->schema2.'.gloterdatosempresa', $datos_empresa);

      /* ENVIO DE EMAIL
      $ser = 'Sra';
      if ($datos['genero'] === '18') {
        $ser = 'Sr';
      }
      $this->load->library('email');
      $this->email->from('correoempresa@correoempresa.com');
      $this->email->too($datos_provedores['correo']);
      $this->email->subject('Bienvenido a nuestro portal '. $ser . $datos_provedores['nombre1'] . '.');
      $this->email->message('Mensaje de bienvenida por parte de la empresa. Sus credenciales de accero a nuestro portal son los siguientes: Usuario: '.$datos_provedores['numero_documento']. ' Contraseña: '. $password);
      $this->email->send();
      */

      return true;
    }

    public function obtener_proveedores($data){
      $tip = obtener_codigo_glotipos($data, 'TERTIP');
      $dir = obtener_codigo_glotipos('DIREMP', 'TERUBI');
      $tel = obtener_codigo_glotipos('TELEMP', 'TERUBI');
      $cor = obtener_codigo_glotipos('COREMP', 'TERUBI');
      $codigo_dir = $dir[0]['tipcodigo'];
      $codigo_tel = $tel[0]['tipcodigo'];
      $codigo_cor = $cor[0]['tipcodigo'];
      $tipo = $tip[0]['tipcodigo'];
      //var_dump($this->db->last_query());

      $sql = "SELECT tercodigo, tertipdoc, terdocnum, ternombre, ternom1, tertipo, ternom2, terape1, terape2, terdigver, tertipogrupo,
        	terdatfecnac, terdattipsex, terdattipnac, terdatciunac, g.tipclave AS clave, tipo2.tipclave AS detalle,
        	de.terdatcontributivo AS contributivo, de.terdatretenedor AS retenedor,
        	COALESCE(ud.terubivalor, 'No Aplica') AS direccion,
        	COALESCE(ut.terubivalor, 'No Aplica') AS telefono,
        	COALESCE(uc.terubivalor, 'No Aplica') AS correo,
          COALESCE(bar.barnombre, 'No Aplica') AS  barrio,
          COALESCE(m.munnombre, 'No Aplica') AS municipio,
          COALESCE(dpto.depnombre, 'No Aplica') AS dpto,
          COALESCE(p.painombre, 'No Aplica') AS pais
        	FROM  global.gloterceros AS t
        	JOIN global.glotipos g ON t.tertipo = g.tipcodigo
        	LEFT JOIN global.gloterdatospersonales AS dp ON t.tercodigo = dp.terdatcodigo
        	LEFT JOIN global.gloterdatosempresa de ON t.tercodigo = de.terdatcodigo
        	LEFT JOIN global.glotipos tipo2 ON t.tertipdoc = tipo2.tipcodigo
        	LEFT JOIN global.gloterubicaciones AS ud ON t.tercodigo = ud.terubitercero AND ud.terubitipo = $codigo_dir AND ud.terubiactivo = 'S'
        	LEFT JOIN global.gloterubicaciones AS ut ON t.tercodigo = ut.terubitercero AND ut.terubitipo = $codigo_tel AND ut.terubiactivo = 'S'
        	LEFT JOIN global.gloterubicaciones AS uc ON t.tercodigo = uc.terubitercero AND uc.terubitipo = $codigo_cor AND uc.terubiactivo = 'S'
        	LEFT JOIN global.globarrios bar ON ud.terubibarrio = bar.barcodigo
        	LEFT JOIN global.glomunicipios m ON bar.barmunicipio = m.muncodigo
        	LEFT JOIN global.glodepartamentos dpto ON m.mundepartamento = dpto.depcodigo
        	LEFT JOIN global.glopaises p ON dpto.deppais = p.paicodigo
        	WHERE teractivo = 'S'
        	AND tertipo = $tipo
        	ORDER BY terdocnum ASC";

      $result = $this->db->query($sql);
      $data = $result->result_array();
      return $data;
    }

    public function actualizar_proveedor($datos_clientes)
    {
      $this->db->set('tertipdoc', $datos_clientes['tipo_documento']);
      $this->db->set('terdocnum', $datos_clientes['numero_documento']);
      $this->db->set('ternombre', $datos_clientes['nombre']);
      $this->db->set('terclave', 'clave');
      $this->db->set('ternom1', $datos_clientes['nombre1']);
      $this->db->set('ternom2', $datos_clientes['nombre2']);
      $this->db->set('terape1', $datos_clientes['apellido1']);
      $this->db->set('terape2', $datos_clientes['apellido2']);
      $this->db->where('tercodigo', $datos_clientes['codigo_cliente']);
      $this->db->update($this->db->schema2.'.gloterceros');

      if ($datos_clientes['retenedor'] == 'NA') {
        $datos_clientes['retenedor'] = 'N';
      }
      if ($datos_clientes['contributivo'] == 'NA') {
        $datos_clientes['contributivo'] = 'N';
      }

      $this->db->set('terdatcontributivo', $datos_clientes['contributivo']);
      $this->db->set('terdatretenedor', $datos_clientes['retenedor']);
      $this->db->where('terdatcodigo', $datos_clientes['codigo_cliente']);
      $this->db->update($this->db->schema2.'.gloterdatosempresa');
    }

    public function obtener_tertip()
    {
      $this->db->select('*');
      $this->db->from($this->db->schema2.'.glotipos');
      $this->db->where('tipgrupo', 'TERTIP');
      $this->db->where('tipclave', 'SER');
      $result = $this->db->get();
      $tip1 = $result->result_array();
      return $tip1;
    }

    public function salvar_proveedor($datos_clientes){
      function generar_password() {
        return substr(md5(uniqid(rand(), true)), 0, 8);
      }
      $tip = obtener_codigo_glotipos($datos_clientes['tip'], 'TERTIP');
      $fecha_creacion = date('Y-m-d', time());
      $nombre = $datos_clientes['nombre1']." ".$datos_clientes['nombre2']." ".$datos_clientes['apellido1']." ".$datos_clientes['apellido2'];
      $data = array(
        'tertipdoc' => $datos_clientes['tipo_documento'],
        'terdocnum' => $datos_clientes['numero_documento'],
        'terdigver' => $datos_clientes['digito_verificacion'],
        'ternombre' => $datos_clientes['nombre'],
        'terclave' => $datos_clientes['tip'],
        'tertipo' => $tip[0]['tipcodigo'],
        'terfeccre' => $fecha_creacion,
        'teractivo' => 'S',
        'ternom1' => $datos_clientes['nombre1'],
        'ternom2' => $datos_clientes['nombre2'],
        'terape1' => $datos_clientes['apellido1'],
        'terape2' => $datos_clientes['apellido2'],
        'tertipogrupo' => 1
      );
      $this->db->insert($this->db->schema2.'.gloterceros', $data);

      $this->db->select('tercodigo');
      $this->db->from($this->db->schema2.'.gloterceros');
      $this->db->where('terdocnum', $datos_clientes['numero_documento']);
      $resp = $this->db->get();
      $valor = $resp->result_array();
      $codigo = $valor[0]['tercodigo'];

      //insert to table ubicaciones
      $tipcorreo = obtener_codigo_glotipos('COREMP', 'TERUBI');
      $codigocorreo = $tipcorreo[0]['tipcodigo'];
      $ubi = array(
        'terubitercero' => $codigo,
        'terubibarrio' => 1, //$datos_clientes['barrio'],
        'terubitipo' => $codigocorreo,
        'terubivalor' => $datos_clientes['correo'],
        'terubiactivo' => 'S'
      );
      $this->db->insert($this->db->schema2.'.gloterubicaciones', $ubi);

      //insert to table usuarios of the scheme seguridad

      $datos_empresas = array(
        'terdatcodigo' => $codigo,
        'terdatretenedor' => $datos_clientes['retenedor'],
        'terdatcontributivo' => $datos_clientes['contributivo'],
        'terdatactividad' => /*$datos_clientes['contributivo']*/1, //Hay que definir esto
        'terdatactivo' => 'S'
      );
      $this->db->insert($this->db->schema2.'.gloterdatosempresa', $datos_empresas);



      //enviar email
      if ($datos_clientes['correo'] !== 'No aplica') {
        $this->db->select('ternombre');
        $this->db->select('terdocnum');
        $this->db->from($this->db->schema2.'.gloterceros');
        $this->db->where('tercodigo', $this->session->userdata('tercero'));
        $re = $this->db->get();
        $result = $re->result_array();

        $msg = 'Sr. '.$datos_clientes['nombre'].". Nos informaron que nuestro vendedor identificado con el nombre de ".$result[0]['ternombre'].' y el número de identificacion '.$result[0]['terdocnum'].' estuvo presente en su establecimiento en la fecha '.date('d-m-Y');
        $this->load->library('email');
        $this->email->from('correoempresa@correoempresa.com');
        $this->email->to($datos_clientes['correo']);
        $this->email->subject('INGRESO DE VENDEDOR A ESTABLECIMIENTO');
        $this->email->message($msg);
        $this->email->send();
      }
    }



    public function obtener_tiposubi()
    {
      $this->db->select('*');
      $this->db->from($this->db->schema2.'.glotipos');
      $this->db->where('tipgrupo', 'TERUBI');
      $result = $this->db->get();
      $ubi = $result->result_array();
      return $ubi;
    }

    public function obtener_ubicacion($codigo){
      $this->db->select('terubicodigo');
      $this->db->select('terubitipo');
      $this->db->select('terubivalor');
      $this->db->select('tipdetalle');
      $this->db->from($this->db->schema2.'.gloterubicaciones');
      $this->db->where('terubitercero', $codigo);
      $this->db->where('terubiactivo', 'S');
      $this->db->join($this->db->schema2.'.glotipos', 'global.gloterubicaciones.terubitipo = global.glotipos.tipcodigo');
      $result = $this->db->get();
      $query = $result->result_array();
      return $query;
    }


    public function obtener_paises()
    {
      $this->db->select('*');
      $this->db->from($this->db->schema2.'.glopaises');
      $result = $this->db->get();
      $paises = $result->result_array();
      return $paises;
    }

    public function obtenter_estados($codigo_pais)
    {
      $this->db->select('*');
      $this->db->from($this->db->schema2.'.glodepartamentos');
      $this->db->where('deppais', $codigo_pais);
      $result = $this->db->get();
      $estados = $result->result_array();
      return $estados;
    }

    public function obtener_ciudades($codigo_estado)
    {
      $this->db->select('*');
      $this->db->from($this->db->schema2.'.glomunicipios');
      $this->db->where('mundepartamento', $codigo_estado);
      $result = $this->db->get();
      $ciudades = $result->result_array();
      return $ciudades;
    }

    public function obtener_barrios($codigo_ciudad)
    {
      $this->db->select('*');
      $this->db->from($this->db->schema2.'.globarrios');
      $this->db->where('barmunicipio', $codigo_ciudad);
      $this->db->where('barestado', 'S');
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
      $this->db->insert($this->db->schema2.'.globarrios', $datos);
      return true;
    }

    public function guardar_ubicacion($datos)
    {
      if (!isset($datos['barrio'])) {
        $datos['barrio'] = '1';
      }
      $datos_ubi = array(
        'terubitercero' => $datos['codigof'],
        'terubibarrio' => $datos['barrio'],
        'terubitipo' => $datos['tipo_ubicacion'],
        'terubivalor' => $datos['descripcion']
      );
      $this->db->insert($this->db->schema2.'.gloterubicaciones', $datos_ubi);
      return true;
    }

    public function inactivar_provedor($codigo){
      $desactivar = 'N';
      $this->db->set('teractivo', $desactivar);
      $this->db->where('tercodigo', $codigo);
      $this->db->update($this->db->schema2.'.gloterceros');
      $inactivar = 2;
      $this->db->set('usu_estado', $inactivar);
      $this->db->where('usu_codigo', $codigo);
      $this->db->update($this->db->schema1.'.seg_usuarios');
      return true;
    }

    public function inactivar_ubicacion($codigo){
      $desactivar = 'N';
      $this->db->set('terubiactivo', $desactivar);
      $this->db->where('terubitercero', $codigo['codigo_ter']);
      $this->db->where('terubicodigo', $codigo['codigo_ubi']);
      $this->db->update($this->db->schema2.'.gloterubicaciones');
      return true;
    }
  }
