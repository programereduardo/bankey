
<?php
  defined('BASEPATH') OR exit('No direct script access allowed');

  class facturacion_model extends CI_model
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

    public function obtener_formapago()
    {
      $this->db->select('tipcodigo');
      $this->db->select('tipdetalle');
      $this->db->from($this->db->schema2.'.glotipos');
      $this->db->where('tipactivo', 'S');
      $this->db->where('tipgrupo', 'FORPAG');
      $data = $this->db->get();
      //var_dump('Hola',$data->result_array());
      //exit();
      return $data->result_array();
    }

    public function obtener_facturas()
    {
      $rol = $this->session->userdata('rol');
      $user = $this->session->userdata('usuario');
      $year = date('Y');
      $mivar = $year.'-01-01';
      $fecha = new DateTime($mivar);
      $year = $fecha->format('Y-m-d');

      $this->db->select('confacturas.*');
      $this->db->select('gloterceros.terclave');
      $this->db->select('gloterceros.ternombre');
      $this->db->select('gloterceros.ternom1');
      $this->db->select('gloterceros.ternom2');
      $this->db->select('gloterceros.terape1');
      $this->db->select('gloterceros.terape2');
      $this->db->select('gloterceros.tercodigo');
      $this->db->select('gloterceros.terdocnum');
      $this->db->select('gloterceros.tertipogrupo');
      $this->db->select('vendedor.terclave as claven');
      $this->db->select('vendedor.ternom1 as nom1ven');
      $this->db->select('vendedor.ternom2 as nom2ven');
      $this->db->select('vendedor.terape1 as ape1ven');
      $this->db->select('vendedor.terape2 as ape2ven');
      $this->db->select('vendedor.tercodigo as codigo_vendedor');
      $this->db->from($this->db->schema3.'.confacturas');
      $this->db->join($this->db->schema2.'.gloterceros', 'contabilidad.confacturas.faccliente = global.gloterceros.tercodigo', 'left');
      $this->db->join($this->db->schema2.'.gloterceros as vendedor', 'contabilidad.confacturas.facvendedor = vendedor.tercodigo', 'left');
      if ($rol == 'Vendedor') {
        $this->db->where('confacturas.facusucre', $user);
      }
      $this->db->where('facfecent >=', $year);
      $this->db->order_by('facnumero', 'DESC');
      $result = $this->db->get();
      $data = $result->result_array();
      return $data;
    }

    public function obtener_clientes()
    {
      $data = obtener_codigo_glotipos('CLI', 'TERTIP');
      $this->db->select('tercodigo');
      $this->db->select('terdocnum');
      $this->db->select('ternom1');
      $this->db->select('ternom2');
      $this->db->select('terape1');
      $this->db->select('terape2');
      $this->db->select('ternombre');
      $this->db->select('terclave');
      $this->db->from($this->db->schema2.'.gloterceros');
      $this->db->where('teractivo', 'S');
      $this->db->where('tertipo', $data[0]['tipcodigo']);
      $this->db->order_by('terclave');
      $datos = $this->db->get();
      return $datos->result_array();
    }

    public function valid_cli()
    {
        
      $data = obtener_codigo_glotipos('CLI', 'TERTIP');
      $this->db->select('tercodigo');
      $this->db->select('terdocnum');
      $this->db->select('ternom1');
      $this->db->select('ternom2');
      $this->db->select('terape1');
      $this->db->select('terape2');
      $this->db->select('ternombre');
      $this->db->select('terclave');
      $this->db->select('relclicliente');
      $this->db->select('relclivendedor');
      $this->db->from($this->db->schema2.'.gloterceros');
      $this->db->from($this->db->schema2.'.glorel');
      $this->db->where('teractivo', 'S');
      $this->db->where('tertipo', $data[0]['tipcodigo']);
      $this->db->order_by('terclave');
      $datos = $this->db->get();
      return $datos->result_array();
    }

    public function numfactura()
    {
     $data = obtener_codigo_glotipos('VEN', 'TERTIP');
     $this->db->select_max('facnumero');
     $this->db->from($this->db->schema3.'.confacturas');
     $query = $this->db->get();
     return $query->result_array(); 
    }

    public function obtener_vendedores()
    {
      $data = obtener_codigo_glotipos('VEN', 'TERTIP');
      $this->db->select('tercodigo');
      $this->db->select('terdocnum');
      $this->db->select('ternom1');
      $this->db->select('ternom2');
      $this->db->select('terape1');
      $this->db->select('terape2');
      $this->db->select('ternombre');
      $this->db->from($this->db->schema2.'.gloterceros');
      $this->db->where('teractivo', 'S');
      $this->db->where('tertipo', $data[0]['tipcodigo']);
      
      $datos = $this->db->get();
      return $datos->result_array();
    }

    public function obtener_articulos()
    {
      $this->db->select('artcodigo');
      $this->db->select('artreferencia');
      $this->db->select('artdescripcion');
      $this->db->select('artvalor');
      $this->db->select('artporcentajeiva');
      $this->db->from($this->db->schema3.'.conarticulos'); //=> contabilidad.conarticulos
      $this->db->where('artestado', 'S');
      $this->db->order_by('artreferencia');
      $result = $this->db->get();
      $articulos = $result->result_array();
      return $articulos;
    }

    public function obtener_productos($data, $dt)
    {
      $this->db->select('confacdetalle.detcodigo');
      $this->db->select('confacdetalle.detarticulo');
      $this->db->select('confacdetalle.detcantidad');
      $this->db->select('confacdetalle.detprecio');
      $this->db->select('confacdetalle.detiva');
      $this->db->select('confacdetalle.detdescuento');
      $this->db->select('confacdetalle.detvalor');
      $this->db->select('conarticulos.artreferencia');
      $this->db->select('conarticulos.artdescripcion');
      $this->db->select('glotipos.tipdetalle');
      $this->db->select('confacturas.facdescuento');
      $this->db->select('confacturas.faciva');
      $this->db->select('confacturas.factotal');
      $this->db->select('confacturas.facsaldo');

      if (isset($dt) && !empty($dt) && $dt !== false) {
        $this->db->select('gloterceros.tercodigo');
        $this->db->select('gloterceros.ternombre');
        $this->db->select('gloterceros.ternom1');
        $this->db->select('gloterceros.ternom2');
        $this->db->select('gloterceros.terape1');
        $this->db->select('gloterceros.terape2');
        $this->db->select('gloterceros.tertipogrupo');
        $this->db->select('gloterceros.terdocnum');
        $this->db->select('gloterceros.terdigver');
        $this->db->select('confacturas.facfecent');
        $this->db->select('confacturas.facfecvenci');
        $this->db->select('confacturas.facnumero');
        #$this->db->select('confacturas.facsaldo');
      }

      $this->db->from($this->db->schema3.'.confacdetalle');
      $this->db->join($this->db->schema3.'.conarticulos', 'contabilidad.confacdetalle.detarticulo = contabilidad.conarticulos.artcodigo');
      $this->db->join($this->db->schema2.'.glotipos', 'global.glotipos.tipcodigo = contabilidad.conarticulos.artunidad');
      $this->db->join($this->db->schema3.'.confacturas', 'contabilidad.confacturas.facnumero = contabilidad.confacdetalle.detfactura');

      if (isset($dt) && !empty($dt) && $dt !== false) {
        $this->db->join($this->db->schema2.'.gloterceros', 'contabilidad.confacturas.faccliente = global.gloterceros.tercodigo');
      }

      //$this->db->where('detprefijo', $data['prefijo_factura']);
      if (isset($data['numero_real']) && !empty($data['numero_real']) && $data['numero_real'] !== false) {
        $this->db->where('detfactura', $data['numero_real']);
      }

      if (isset($dt) && !empty($dt) && $dt !== false) {
        $this->db->where('detfactura', $dt);
      }

      $this->db->where('detestado', 'S');
      $this->db->order_by('detcodigo', 'ASC');
      $result = $this->db->get();
      $articulos = $result->result_array();
      return $articulos;
    }

    public function inactivar_articulo($data)
    {
      $this->db->select('detvalor');
      $this->db->select('detfactura');
      $this->db->from($this->db->schema3.'.confacdetalle');
      $this->db->where('detcodigo', $data);
      $result1 = $this->db->get();
      $data1 = $result1->result_array();
      $detvalor = $data1[0]['detvalor'];
      $detfactura = $data1[0]['detfactura'];

      $this->db->select('facnumero as numero_factura');
      $this->db->select('factotal as total');
      $this->db->select('facdescuento as descuento');
      $this->db->select('faciva as iva');
      $this->db->from($this->db->schema3.'.confacturas');
      $this->db->where('facnumero', $detfactura);
      $result2 = $this->db->get();
      $data2 = $result2->result_array();
      $datosEnviar = array(
        'numero_factura' => $data2[0]['numero_factura']
      );
      $dt = $this->calcular_datosfactura($datosEnviar);

      $this->db->set('factotal', $dt['total_facturar']);
      $this->db->set('facdescuento', $dt['total_descontar']);
      $this->db->set('faciva', $dt['valoriva']);
      $this->db->set('facsubtotal', $dt['sumt']);
      $this->db->where('facnumero', $detfactura);
      $this->db->update($this->db->schema3.'.confacturas');

      $this->db->set('detestado', 'N');
      $this->db->where('detcodigo', $data);
      $this->db->update($this->db->schema3.'.confacdetalle');
      return true;
    }

    public function inactivar_factura($data)
    {
      $this->db->select('facestado');
      $this->db->from($this->db->schema3.'.confacturas');
      $this->db->where('facnumero', $data['numero']);
      $res = $this->db->get();
      $result = $res->result_array();

      $hecho = false;
      $msg = 'Esta factura no se puede anular porque ya a sido finalizada.';
      if ($result[0]['facestado'] === 'E') {
        $this->db->set('facestado', 'N');
        $this->db->where('facprefijo', 1);
        $this->db->where('facnumero', $data['numero']);
        $this->db->update($this->db->schema3.'.confacturas');
        $hecho = true;
        $msg = 'Acción realizada con exito.';

        /*$this->db->set('detestado', 'N');
        $this->db->where('detfactura', $data['numero']);
        $this->db->update($this->db->schema3.'.confacdetalle');*/
      }

      $retorno = array(
        'hecho' => $hecho,
        'msg' => $msg
      );

      return $retorno;
    }

    public function calcular_datosdetalle($data)
    {

      $this->db->select('artporcentajeiva');
      $this->db->select('artporcentajedescuento');
      $this->db->from($this->db->schema3.'.conarticulos');
      $this->db->where('artcodigo', $data['codigo_producto']);
      $art = $this->db->get();
      $iva_art = $art->result_array();

      $valorI = $data['cantidad'] * $data['valor']; //10 * 100 = 1000
      $descue = $iva_art[0]['artporcentajedescuento'] / 100; //Valor Iva En DB / 100 -- Esto da un número así: 0.05 - 0.08 - 0.10 - 0.15
      $valordescuentodetalle = $valorI * $descue; //1000 - 0.10 = 100 <-- Este número es tomado como ejemplo(10%)
      $subtotaldetalle = $valorI - $valordescuentodetalle; // 1000 - 100 = 900
      $valorivadetalle = $subtotaldetalle * ($iva_art[0]['artporcentajeiva'] / 100); //900 * (19 / 100 = 0.19) = 171 <-- Este número es tomado como ejemplo
      $valorTD = $subtotaldetalle + $valorivadetalle; // 900 + 171 = 1071 <-- Este es el total a pagar por el articulo

      $retorno = array(
        'valorIvaTD' => 0,
        'valorDescTD' => 0,
        'valorTD' => $valorI
      );
      return $retorno;
    }

    public function get_parametros($clave, $grupo)
    {
      $tip = obtener_codigo_glotipos($clave, $grupo);
      $tip = $tip[0]['tipcodigo'];
      $this->db->select('parvalor');
      $this->db->select('parvalorini');
      $this->db->select('parvalorfin');
      $this->db->from($this->db->schema2.'.gloparametros');
      $this->db->where('partipodato', $tip);
      $this->db->where('paractivo', 'S');
      $result = $this->db->get();
      $resp = $result->result_array();
      $result->free_result();
      return $resp;
    }

    public function calcular_datosfactura($data)
    {
      $this->db->select('detvalor');
      $this->db->from($this->db->schema3.'.confacdetalle');
      if (isset($data['numero_real']) && $data['numero_real'] !== "") {
        $this->db->where('detfactura', $data['numero_real']);
      } else {
        $this->db->where('detfactura', $data['numero_factura']);
      }
      $this->db->where('detestado', 'S');
      $respu = $this->db->get();
      $valores = $respu->result_array();

      $sumt = 0;
      for ($i=0; $i < count($valores); $i++) {
        $sumt = $sumt + $valores[$i]['detvalor'];
      }

      $descuento = false;
      $porcentaje_descuento = 0;
      $resp = $this->get_parametros('PRIDES', 'TIPDES');
      for ($i=0; $i < count($resp); $i++) {
        if ($sumt >= $resp[$i]['parvalorini'] && $sumt <= $resp[$i]['parvalorfin']) {
          $descuento = true;
          $porcentaje_descuento = $resp[$i]['parvalor'] / 100;
        }
      }

      /*if ($data['tipo_descuento'] == '1') {
        $valor_descuento = $valor * ($data['descuento'] / 100);
      } else {
        $valor_descuento = $data['descuento'];
      }
      $valor_total = $valor - $valor_descuento;*/

      $total_descontar = 0;
      if ($descuento === true) {
        $total_descontar = $sumt * $porcentaje_descuento;
      }
      $dt = $this->get_parametros('IVA', 'TIPDAT');
      $valor_iva = $dt[0]['parvalor'] / 100;
      $subtotal_facturar = $sumt - $total_descontar;//valor menos descuento
      $valoriva = $subtotal_facturar * $valor_iva;
      $total_facturar = $subtotal_facturar + $valoriva;

      $retorno = array(
        'fac_subtotal' => $sumt,
        'total_facturar' => $total_facturar,
        'sub_facturar' => $subtotal_facturar,
        'total_descontar' => $total_descontar,
        'sumt' => $sumt,
        'valoriva' => $valoriva,
        'pordes' => $porcentaje_descuento
      );

      return $retorno;

    }

    public function guardar_producto($data)
    {
      $datos_detalle = $this->calcular_datosdetalle($data);
      $data_facdetalle = array(
        'detfactura' => $data['numero_factura'],
        'detprefijo' => 1,
        'detarticulo' => $data['codigo_producto'],
        'detcantidad' => $data['cantidad'],
        'detprecio' => $data['valor'],
        'detiva' => $datos_detalle['valorIvaTD'],
        'detdescuento' => $datos_detalle['valorDescTD'],
        'detvalor' => $datos_detalle['valorTD'],
        'detestado' => 'S'
      );
     $numero=$data['numero_factura'];
     $this->session->set_userdata('numero_fac', $numero);

      $this->db->insert($this->db->schema3.'.confacdetalle', $data_facdetalle);

      $datos_factura = $this->calcular_datosfactura($data);
      if ($data['fecha_vencimiento'] == "") {
        $fechavencimiento = date('Y-m-d', strtotime($data['fecha']. '+ 30 day'));
        $data['fecha_vencimiento'] = $fechavencimiento;
      }
      $saldo = $datos_factura['total_facturar'] - $data['cuota_inicial'];

      $this->db->select('relvencodigo');
      $this->db->select('relvenprincipal');
      $this->db->select('relvensecundario');
      $this->db->from($this->db->schema2.'.glorelvendedores');
      $this->db->where('relvenestado', 'S');
      $getRel = $this->db->get();
      $relacion = $getRel->result_array();

      $companero = '';
      for ($i = 0; $i < count($relacion); $i++) {
        if ($relacion[$i]['relvenprincipal'] = $data['vendedor'] ) {
          $companero = $relacion[$i]['relvencodigo'];
        }
        if ($companero == '') {
          if ($relacion[$i]['relvensecundario'] = $data['vendedor']) {
            $companero = $relacion[$i]['relvencodigo'];
          }
        }
      }

      $data_confacturas = array(
        'facprefijo' => 1,
        'facnumero' => $data['numero_factura'],
        'facfecent' => $data['fecha'],
        'faccliente' => $data['cliente'],
        'facvendedor' => $data['vendedor'],
        'facformapago' => $data['formpago'],
        'facfletes' => $data['fletes'],
        'faciva' => $datos_factura['valoriva'],
        'facdescuento' => $datos_factura['total_descontar'], #$datos_factura['total_descontar'],
        'facretefuente' => $data['retefuente'],
        'facreteica' => $data['reteica'],
        'faccomision' => $data['comision'],
        'factotal' => $datos_factura['total_facturar'], #$data['total'],//calcular total - $datos_factura['total_facturar']
        'facfecvenci' => $data['fecha_vencimiento'],//calcular fecha de vencimiento *HECHO*
        'facobservacion' => $data['observacion'],
        'facresolucion' => '1',//Sacar de la tabla gloparametros del esquema global
        'facestado' => 'E',
        'facusucre' => $this->session->userdata('usuario'), //Obtener usuario del usuario logueado en el portal
        'facfeccre' => date('Y-m-d'),
        'facabonos' => $data['cuota_inicial'],
        'facsaldo' => $saldo,
        'facpagoinicial' => $data['cuota_inicial'],
        'facsubtotal' => $datos_factura['fac_subtotal'],
        'facrelvendedor' => $companero
      );

      $this->db->insert($this->db->schema3.'.confacturas', $data_confacturas);

      return true;
    }

    public function agregar_producto($data)
    {
      $datos_detalle = $this->calcular_datosdetalle($data);
      $data_facdetalle = array(
        'detfactura' => $data['numero_factura'],
        'detprefijo' => 1,
        'detarticulo' => $data['codigo_producto'],
        'detcantidad' => $data['cantidad'],
        'detprecio' => $data['valor'],
        'detiva' => $datos_detalle['valorIvaTD'],
        'detdescuento' => $datos_detalle['valorDescTD'],
        'detvalor' => $datos_detalle['valorTD'],
        'detestado' => 'S'
      );
      $this->db->select('detcodigo');
      $this->db->select('detarticulo');
      $this->db->select('detcantidad');
      $this->db->from($this->db->schema3.'.confacdetalle');
      $this->db->where('detfactura', $data['numero_factura']);
      $this->db->where('detestado', 'S');
      $result = $this->db->get();
      $dato_comparar = $result->result_array();
      $cant = 0;
      $existe = false;
      foreach ($dato_comparar as $dc) {
        if ($dc['detarticulo'] == $data['codigo_producto']) {
          $cant = $cant + $dc['detcantidad'];
          $codigo_detalle = $dc['detcodigo'];
          $existe = true;
        }
      }
      $total_cant = $cant + $data['cantidad'];
      if ($existe === true) {
        $this->db->set('detcantidad', $total_cant);
        $this->db->set('detprecio', $data['valor']);
        $this->db->set('detiva', $datos_detalle['valorIvaTD']);
        $this->db->set('detdescuento', $datos_detalle['valorDescTD']);
        $this->db->set('detvalor', $data['valor'] * $total_cant);
        $this->db->where('detcodigo', $codigo_detalle);
        $this->db->update($this->db->schema3.'.confacdetalle');
      } else {
        $this->db->insert($this->db->schema3.'.confacdetalle', $data_facdetalle);
      }
      $datos_factura = $this->calcular_datosfactura($data);
      $saldo = $datos_factura['total_facturar'] - $data['cuota_inicial'];
      $fechavencimiento = date('Y-m-d', strtotime($data['fecha']. '+ 30 day'));
      if ($data['fecha_vencimiento'] == "") {
        $data['fecha_vencimiento'] = $fechavencimiento;
      }

      $this->db->set('facnumero', $data['numero_factura']);
      $this->db->set('facfecent', $data['fecha']);
      $this->db->set('faccliente', $data['cliente']);
      $this->db->set('facvendedor', $data['vendedor']);
      $this->db->set('facformapago', $data['formpago']);
      $this->db->set('facfletes', $data['fletes']);
      $this->db->set('facretefuente', $data['retefuente']);
      $this->db->set('facreteica', $data['reteica']);
      $this->db->set('faccomision', $data['comision']);
      $this->db->set('factotal', $datos_factura['total_facturar']);
      $this->db->set('facdescuento', $datos_factura['total_descontar']);
      $this->db->set('faciva', $datos_factura['valoriva']);
      $this->db->set('facobservacion', $data['observacion']);
      $this->db->set('facfecvenci', $data['fecha_vencimiento']);
      $this->db->set('facresolucion', '1');
      $this->db->set('facestado', 'E');
      $this->db->set('facusucre', $this->session->userdata('usuario'));
      $this->db->set('facfeccre', date('Y-m-d'));
      $this->db->set('facpagoinicial', $data['cuota_inicial']);
      $this->db->set('facsaldo', $saldo);
      $this->db->set('facsubtotal', $datos_factura['fac_subtotal']);
      $this->db->where('facnumero', $data['numero_real']);
      $this->db->update($this->db->schema3.'.confacturas');
      return true;
    }

    public function salvar_factura($data)
    {
      $datos_factura = $this->calcular_datosfactura($data);
      $saldo = $datos_factura['total_facturar'] - $data['cuota_inicial'];
      //$valor_descuento = $data['descuento'];
      $fechavencimiento = date('Y-m-d', strtotime($data['fecha']. '+ 30 day'));
      if ($data['fecha_vencimiento'] == "") {
        $data['fecha_vencimiento'] = $fechavencimiento;
      }
      $this->db->set('facnumero', $data['numero_factura']);
      $this->db->set('facfecent', $data['fecha']);
      $this->db->set('faccliente', $data['cliente-id']);
      $this->db->set('facvendedor', $data['vendedor-id']);
      $this->db->set('facformapago', $data['formpago']);
      $this->db->set('facfletes', $data['fletes']);
      $this->db->set('facretefuente', $data['retefuente']);
      $this->db->set('facreteica', $data['reteica']);
      $this->db->set('faccomision', $data['comision']);
      $this->db->set('facobservacion', $data['observacion']);
      $this->db->set('facfecvenci', $data['fecha_vencimiento']);
      $this->db->set('facresolucion', '1');
      $this->db->set('facestado', 'E');
      $this->db->set('facusucre', $this->session->userdata('usuario'));
      $this->db->set('facfeccre', date('Y-m-d'));
      $this->db->set('facpagoinicial', $data['cuota_inicial']);
      $this->db->set('facsaldo', $saldo);
      $this->db->set('factotal', $datos_factura['total_facturar']);
      $this->db->set('facdescuento', $datos_factura['total_descontar']);
      $this->db->set('faciva', $datos_factura['valoriva']);
      /*if ($data['iva'] !== '') {
      }*/
      $this->db->set('facsubtotal', $datos_factura['fac_subtotal']);
      $this->db->where('facnumero', $data['numero_real']);
      $this->db->update($this->db->schema3.'.confacturas');

      $this->db->set('detfactura', $data['numero_factura']);
      $this->db->where('detfactura', $data['numero_real']);
      $this->db->update($this->db->schema3.'.confacdetalle');
      return true;
    }

    public function finalizar_factura($data)
    {
      $this->db->select('factotal');
      $this->db->from($this->db->schema3.'.confacturas');
      //$this->db->where('detprefijo', $data['prefijo']);
      $this->db->where('facnumero', $data['numero_real']);
      $this->db->where('facestado', 'E');
      $result = $this->db->get();
      $query = $result->result_array();

      $fechavencimiento = date('Y-m-d', strtotime($data['fecha']. '+ 30 day'));
      if ($data['fecha_vencimiento'] == "") {
        $data['fecha_vencimiento'] = $fechavencimiento;
      }
      $datos_factura = $this->calcular_datosfactura($data);
      $saldo = $datos_factura['total_facturar'] - $data['cuota_inicial'];
      $this->db->set('facnumero', $data['numero_factura']);
      $this->db->set('facfecent', $data['fecha']);
      $this->db->set('faccliente', $data['cliente-id']);
      $this->db->set('facvendedor', $data['vendedor-id']);
      $this->db->set('facformapago', $data['formpago']);
      $this->db->set('facfletes', $data['fletes']);
      $this->db->set('facretefuente', $data['retefuente']);
      $this->db->set('facreteica', $data['reteica']);
      $this->db->set('faccomision', $data['comision']);
      $this->db->set('facfecvenci', $data['fecha_vencimiento']);
      $this->db->set('facobservacion', $data['observacion']);
      $this->db->set('facresolucion', '1');
      $this->db->set('facestado', 'A');
      $this->db->set('facusucre', $this->session->userdata('usuario'));
      $this->db->set('facfeccre', date('Y-m-d'));
      $this->db->set('facabonos', $data['cuota_inicial']);
      $this->db->set('facsaldo', $saldo);
      $this->db->set('facpagoinicial', $data['cuota_inicial']);
      $this->db->where('facnumero', $data['numero_real']);
      $this->db->update($this->db->schema3.'.confacturas');

      $this->db->set('detfactura', $data['numero_factura']);
      $this->db->where('detfactura', $data['numero_real']);
      $this->db->update($this->db->schema3.'.confacdetalle');

      $fecha_creacion_pago = date('Y-m-d');
      $tip_pag = obtener_codigo_glotipos('CUOTA1', 'TIPCUO');
      $tipo_pag = $tip_pag[0]['tipcodigo'];
      $datos_pagos = array(
        'pagfactura' => $data['numero_factura'],
        'pagabono' => $data['cuota_inicial'],
        'pagfechacreacion' => $fecha_creacion_pago,
        'pagtipo' => $tipo_pag,
        'pagusucrea' => $this->session->userdata('usuario')
      );
      $this->db->insert($this->db->schema3.'.confacpagos', $datos_pagos);

      $this->db->select('detarticulo');
      $this->db->select('detcantidad');
      $this->db->select('artexistencias');
      $this->db->from($this->db->schema3.'.confacdetalle');
      $this->db->join($this->db->schema3.'.conarticulos', 'contabilidad.confacdetalle.detarticulo = contabilidad.conarticulos.artcodigo');
      $this->db->where('detfactura', $data['numero_real']);
      $result = $this->db->get();
      $var = $result->result_array();

      for ($i = 0; $i < count($var); $i++) {
        $decremento = $var[$i]['artexistencias'] - $var[$i]['detcantidad'];
        $this->db->set('artexistencias', $decremento);
        $this->db->where('artcodigo', $var[$i]['detarticulo']);
        $this->db->update($this->db->schema3.'.conarticulos');
      }
      return true;
    }

    public function validar_estado($data)
    {
      $this->db->select('facestado');
      $this->db->from($this->db->schema3.'.confacturas');
      $this->db->where('facnumero', $data);
      $result = $this->db->get();
      return $result->result_array();
    }

    public function validar_numfac($data)
    {
      $this->db->select('facnumero');
      $this->db->from($this->db->schema3.'.confacturas');
      $this->db->where('facnumero', $data);
      $result = $this->db->get();
      return $result->result_array();
    }

    public function anular_factura($data)
    {
      $fechavencimiento = date('Y-m-d', strtotime($data['fecha']. '+ 30 day'));
      if ($data['fecha_vencimiento'] == "") {
        $data['fecha_vencimiento'] = $fechavencimiento;
      }
      if ($data['tipo'] == "1") {
        $data_confacturas = array(
          'facprefijo' => 1,
          'facnumero' => $data['numero_factura'],
          'facfecent' => $data['fecha'],
          'faccliente' => $data['cliente-id'],
          'facvendedor' => $data['vendedor-id'],
          'facformapago' => $data['formpago'],
          'facfletes' => $data['fletes'],
          'faciva' => $data['iva'],
          'facdescuento' => $data['descuento'], #$data['descuento'],
          'facretefuente' => $data['retefuente'],
          'facreteica' => $data['reteica'],
          'faccomision' => $data['comision'],
          'factotal' => $data['total_factura'], #$data['total'],//calcular total
          'facfecvenci' => $data['fecha_vencimiento'],//calcular fecha de vencimiento *HECHO*
          'facobservacion' => $data['observacion'],
          'facresolucion' => '1',//Sacar de la tabla gloparametros del esquema global
          'facestado' => 'N',
          'facusucre' => $this->session->userdata('usuario'), //Obtener usuario del usuario logueado en el portal
          'facfeccre' => date('Y-m-d'),
          'facsubtotal' => '0'
        );
        $this->db->insert($this->db->schema3.'.confacturas', $data_confacturas);
      } else {
        $this->db->set('facnumero', $data['numero_factura']);
        $this->db->set('facfecent', $data['fecha']);
        $this->db->set('faccliente', $data['cliente-id']);
        $this->db->set('facvendedor', $data['vendedor-id']);
        $this->db->set('facformapago', $data['formpago']);
        $this->db->set('facfletes', $data['fletes']);
        $this->db->set('facretefuente', $data['retefuente']);
        $this->db->set('facreteica', $data['reteica']);
        $this->db->set('faccomision', $data['comision']);
        //$this->db->set('facdescuento', $data['descuento']);
        //$this->db->set('factotal', $data['total_factura']);
        /*if ($data['iva'] !== '') {
          $this->db->set('faciva', $data['iva']);
        }*/
        $this->db->set('facfecvenci', $data['fecha_vencimiento']);
        $this->db->set('facobservacion', $data['observacion']);
        $this->db->set('facresolucion', '1');
        $this->db->set('facestado', 'N');
        $this->db->set('facusucre', $this->session->userdata('usuario'));
        $this->db->set('facfeccre', date('Y-m-d'));
        $this->db->where('facnumero', $data['numero_real']);
        $this->db->update($this->db->schema3.'.confacturas');
      }
      return true;
    }

    public function validar_existencias($data)
    {
      $this->db->select('artexistencias');
      $this->db->from($this->db->schema3.'.conarticulos');
      $this->db->where('artcodigo', $data);
      $result = $this->db->get();
      return $result->result_array();
    }

    public function obtener_tipos_abonos()
    {
      $this->db->select('tipcodigo');
      $this->db->select('tipdetalle');
      $this->db->from($this->db->schema2.'.glotipos');
      $this->db->where('tipgrupo', 'TIPCUO');
      $this->db->where('tipactivo', 'S');
      $result = $this->db->get();
      return $result->result_array();
    }

    public function obtener_pagos($data, $bool)
    {
      $this->db->select('pagabono');
      if ($bool === true) {
        $this->db->select('pagcodigo');
        $this->db->select('pagfechacreacion');
        $this->db->select('tipdetalle');
      }
      $this->db->from($this->db->schema3.'.confacpagos');
      if ($bool === true) {
        $this->db->join($this->db->schema2.'.glotipos', 'contabilidad.confacpagos.pagtipo = global.glotipos.tipcodigo');
      }
      $this->db->where('pagfactura', $data);
      $this->db->where('pagestado', 'S');
      $this->db->order_by('pagcodigo', 'ASC');
      $result = $this->db->get();
      return $result->result_array();
    }

    public function agregar_abono($data)
    {
      $success = 0;
      $this->db->select('factotal');
      $this->db->select('facabonos');
      $this->db->from($this->db->schema3.'.confacturas');
      $this->db->where('facnumero', $data['factura']);
      $result = $this->db->get();
      $dat = $result->result_array();
      $factotal = $dat[0]['factotal'];
      $facabonos = $dat[0]['facabonos'];
      $pagos = $this->obtener_pagos($data['factura'], false);
      $total_abonos = 0;
      $next = true;
      foreach ($pagos as $pag) {
        $total_abonos = $pag['pagabono'] + $total_abonos;
      }
      if ($total_abonos == $factotal) {
        $next = false;
      }
      $total_fin = $total_abonos + $data['valor'];
      if ($total_fin > $factotal) {
        $next = false;
        $success = 1;
      }
      if ($total_abonos == $factotal) {
        $next = false;
        $success = 2;
      }
      if ($next === true) {
        $fecha_creacion_pago = date('Y-m-d');
        $tip_pag = obtener_codigo_glotipos('CUOTA2', 'TIPCUO');
        $tipo_pag = $tip_pag[0]['tipcodigo'];
        $datos_pagos = array(
          'pagfactura' => $data['factura'],
          'pagabono' => $data['valor'],
          'pagfechacreacion' => $fecha_creacion_pago,
          'pagtipo' => $tipo_pag,
          'pagusucrea' => $this->session->userdata('usuario')
        );
        if ($this->db->insert($this->db->schema3.'.confacpagos', $datos_pagos)) {
          $success = 3;
        }
        $total_ab = $facabonos + $data['valor'];
        $this->db->set('facabonos', $total_ab);
        $this->db->where('facnumero', $data['factura']);
        $this->db->update($this->db->schema3.'.confacturas');
      }
      $retorno = array(
        'success' => $success,
        'total_fin' => $total_fin,
        'total_abonos' => $factotal - $total_abonos
      );
      return $retorno;
    }

    public function validar_cliente($data)
    {
      $this->db->select('facnumero');
      $this->db->select('factotal');
      $this->db->from($this->db->schema3.'.confacturas');
      $this->db->where('faccliente', $data);
      $this->db->where('facestado', 'A');
      $result = $this->db->get();
      $dat = $result->result_array();
      $factotal = 0;
      $cant = count($dat);
      if (count($dat) > 0) {
        $facnumero = $dat[0]['facnumero'];
        foreach ($dat as $df) {
          $factotal = $df['factotal'] + $factotal;
        }
      }
      if (isset($facnumero)) {
        $this->db->select('pagabono');
        $this->db->from($this->db->schema3.'.confacpagos');
        $this->db->where('pagfactura', $facnumero);
        $this->db->where('pagestado', 'S');
        $result = $this->db->get();
        $data_pagos = $result->result_array();
      }
      $facabonos = 0;
      $type = '';
      if (isset($data_pagos) && count($data_pagos) > 0) {
        foreach ($data_pagos as $dp) {
          $facabonos = 0 + $facabonos;
        }
      }
      $success = true;
      $total = $factotal - $facabonos;
      if ($total > 0) {
        $success = false;
        $type = 'danger';
      }
      $retorno = array(
        'success' => $success,
        'total' => $total,
        'type' => $type,
        'cant' => $cant
      );
      return $retorno;
    }

    public function mis_datos()
    {
      $this->db->select('tipdetalle');
      $this->db->select('tipgrupo');
      $this->db->from($this->db->schema2.'.glotipos');
      $this->db->where('tipgrupo', 'MISDAT');
      $this->db->order_by('tipabreviatura', 'ASC');
      $dt = $this->db->get();
      return $dt->result_array();
    }

    function getEmail($dt)
    {
      $this->load->helper('Glotipos_helper');
      $tip = obtener_codigo_glotipos('COREMP', 'TERUBI');
      $codigoTip = $tip[0]['tipcodigo'];

      $sql = "SELECT terubicodigo, terubitipo, terubivalor
              FROM global.gloterubicaciones
              WHERE terubitercero = $dt
              AND terubitipo = $codigoTip
              AND terubiactivo = 'S'";

      $result = $this->db->query($sql);
      $query = $result->result_array();
      //var_dump($query);
      if (count($query) > 0) {
        if ($query[0]['terubivalor'] == 'No aplica' && $query[0]['terubivalor'] == 'No Aplica' && $query[0]['terubivalor'] == 'No registra' && $query[0]['terubivalor'] == 'No Registra' && $query[0]['terubivalor'] == NULL && $query[0]['terubivalor'] == '') {
          $tip = obtener_codigo_glotipos('CORPER', 'TERUBI');
          $codigoTip = $tip[0]['tipcodigo'];

          $sql = "SELECT terubicodigo, terubitipo, terubivalor
          FROM global.gloterubicaciones
          WHERE terubitercero = $dt
          AND terubitipo = $codigoTip
          AND terubiactivo = 'S'";

          $result = $this->db->query($sql);
          $query = $result->result_array();
          return $query[0]['terubivalor'];
        } else {
          return $query[0]['terubivalor'];
        }
      }
    }

    public function acc()
    {
      $this->db->select('facnumero');;
      $this->db->from($this->db->schema3.'.confacturas');
      $this->db->where('facnumero <>', '1');
      $this->db->where('facnumero <>', '2');
      $respu = $this->db->get();
      $valores = $respu->result_array();
      for ($i=0; $i < count($valores); $i++) {
        $dt = $valores[$i]['facnumero'];
        $datos_insertar = array(
          'locfactura' => $dt,
          'loclongitud' => -74.789065,
          'loclatitud' => 10.999763,
          'locproximidad' => 0
        );
        if ($this->db->insert($this->db->schema2.'.glolocalizacion', $datos_insertar)) {
          $success = true;
        } else {
          $success = false;
        }
        if ($success === false) {
          echo $success.' '.$valores[$i]['facnumero'];
          echo "<br>";
        }
        echo $valores[$i]['facnumero'].'<br>';
      }
    }

    public function save_location($data){
      $getLocation = $this->session->userdata('numero_fac');
      
       $longitude= -74.789065;
       $latitude= 10.999763;

      /*if ($getLocation>0) {
        $success = false;
      } else {*/

        $this->db->select('*');
        $this->db->from($this->db->schema2.'.glolocalizacion');
        $this->db->where('locfactura',$getLocation);
        $result=$this->db->get();
        $query=$result->result_array();
          
       if (count($query)===0)
        {
          $data_localizacion = array(
          'locfactura' => $this->session->userdata('numero_fac'),
          'loclongitud' => $longitude,
          'loclatitud' => $latitude,
          'locproximidad' => 0
          );
          $this->db->insert($this->db->schema2.'.glolocalizacion', $data_localizacion);
          $success = true;
      
      return $success;   
        } 
        
    }

    public function get_location($data){
      $this->db->select('*');
      $this->db->from($this->db->schema2.'.glolocalizacion');
      $dt = $this->db->get();
      $res = $dt->result_array();
      $dt->free_result();
      return $res;

    }
  }
