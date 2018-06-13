<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class facturacion_controller extends CI_controller {
  public function __construct()
  {
    parent::__construct();
    $this->load->model('facturacion_model');
  }
  //Cargando Vistas
  public function index($controlador) {
    $resultado = $this->facturacion_model->validar_session();
    if ($resultado === false) {
      header('Location: login');
    } else {
      $this->load->model('sistema/permisos_model');
      $acciones = $this->permisos_model->obtener_acciones();
      $datos = array(
        'acciones' => $acciones
      );
      $next = false;
      foreach ($acciones as $data) {
        if ($data['mod_nombre'] == "Facturacion" && $data['acc_descripcion'] == "Ver") {
          $next = true;
        }
      }
      if ($next === true) {
        $data = array(
          'controller' => $controlador
        );
        $this->load->view('shared/header');
        $this->load->view('shared/menu', $datos);
        $this->load->view('Facturacion_view', $data);
        $this->load->view('shared/footer');
      } else {
        header("Location: inicio");
      }
    }
  }

  public function imprimir()
  {
    $dt = $this->input->post('num');
    $send = $this->input->post('send');
    $ver = $this->input->post('ver');

    $dato_encabezado = $this->facturacion_model->mis_datos();
    $aux = array('numero_real' => false);
    $result = $this->facturacion_model->obtener_productos($aux, $dt);
    for ($i=0; $i < count($result); $i++) {
      if ($result[$i]['tertipogrupo'] == "2") {
        $result[$i]['faccliente'] = $result[$i]['ternom1'].' '.$result[$i]['ternom2'].' '.$result[$i]['terape1'].' '.$result[$i]['terape2'];
      } else {
        $result[$i]['faccliente'] = $result[$i]['ternombre'];
        $result[$i]['terdocnum'] = $result[$i]['terdocnum'].'-'.$result[$i]['terdigver'];
      }
    }

    $getEmail = $this->facturacion_model->getEmail($result[0]['tercodigo']);

    $this->load->library('pdf');
    $pdf = new pdf(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
    // set document (meta) information
    $pdf->SetCreator(PDF_CREATOR);
    $pdf->SetAuthor('Carlos Marquez');
    $pdf->SetTitle('FACTURA '.$result[0]['facnumero']);
    $pdf->SetSubject('FACTURA');
    $pdf->SetKeywords('TCPDF, PDF, FACTURA, FACTURA');

    // add a page
    $pdf->AddPage();

    $pdf->CreateTextBox($dato_encabezado[0]['tipdetalle'], 0, 10, 0, 10, 8, 'B', 'C');
    $pdf->CreateTextBox($dato_encabezado[1]['tipdetalle'], 0, 15, 0, 10, 8, 'B', 'C');
    $pdf->CreateTextBox($dato_encabezado[2]['tipdetalle'], 0, 20, 0, 10, 8, 'B', 'C');
    $pdf->CreateTextBox($dato_encabezado[3]['tipdetalle'], 0, 25, 0, 10, 8, 'B', 'C');
    $pdf->CreateTextBox($dato_encabezado[4]['tipdetalle'].' - '.$dato_encabezado[5]['tipdetalle'], 0, 30, 0, 10, 8, 'B', 'C');

    // create address box
    $pdf->CreateTextBox('Cliente', 0, 35, 80, 10, 10, 'B');
    $pdf->CreateTextBox($result[0]['faccliente'], 0, 40, 80, 10, 10);
    $pdf->CreateTextBox($result[0]['terdocnum'], 0, 45, 80, 10, 10);

    // invoice title / number
    $pdf->CreateTextBox('Factura Num: '.$result[0]['facnumero'], 0, 60, 120, 20, 16);

    // date, order ref
    $pdf->CreateTextBox('Fecha: '.$result[0]['facfecent'], 0, 35, 0, 10, 10, '', 'R');
    $pdf->CreateTextBox('Fecha Vencimiento: '.$result[0]['facfecvenci'], 0, 40, 0, 10, 10, '', 'R');

        // list headers
    $pdf->CreateTextBox('Ref.', 0, 75, 90, 10, 10, 'B');
    $pdf->CreateTextBox('Descripción', 20, 75, 90, 10, 10, 'B');
    $pdf->CreateTextBox('Cantidad', 110, 75, 150, 10, 10, 'B', 'L');
    $pdf->CreateTextBox('Valor', 120, 75, 30, 10, 10, 'B', 'R');
    $pdf->CreateTextBox('Total', 140, 75, 30, 10, 10, 'B', 'R');


    $style = array('width' => 0.5, 'cap' => 'butt', 'join' => 'miter', 'dash' => '10,20,5,10', 'phase' => 10, 'color' => array(255, 0, 0));
    $pdf->Line(20, 88, 195, 88);

    $currY = 90;
    $subtotal = 0;
    $salt = 1;
    $i = 0;
    foreach ($result as $row) {
      if ($i == 0) {
        $pdf->CreateTextBox($row['artreferencia'], 0, $currY, 90, 10, 7, '');
        $var = $pdf->CreateTextBox($row['artdescripcion'], 20, $currY, 90, 10, 7, '');
        $pdf->CreateTextBox($row['detcantidad'], 100, $currY, 50, 10, 7, '', 'C');
        $pdf->CreateTextBox('$'.number_format($row['detprecio']), 120, $currY, 30, 10, 7, '', 'R');
        $amount = $row['detcantidad']*$row['detprecio'];
        $pdf->CreateTextBox('$'.number_format($row['detvalor']), 140, $currY, 30, 10, 7, '', 'R');
        $currY = $currY+3 + $var+4;
        $subtotal = $subtotal+$amount;
        $pdf->Line(20, $currY-3, 195, $currY-3);
      } else {
        $pdf->CreateTextBox($row['artreferencia'], 0, $currY, 90, 10, 7, '');
        $var = $pdf->CreateTextBox($row['artdescripcion'], 20, $currY, 90, 10, 7, '');
        $pdf->CreateTextBox($row['detcantidad'], 100, $currY, 50, 10, 7, '', 'C');
        $pdf->CreateTextBox('$'.number_format($row['detprecio']), 120, $currY, 30, 10, 7, '', 'R');
        $amount = $row['detcantidad']*$row['detprecio'];
        $pdf->CreateTextBox('$'.number_format($row['detvalor']), 140, $currY, 30, 10, 7, '', 'R');
        $currY = $currY+3 + $var+4;
        $subtotal = $subtotal+$amount;
        $pdf->Line(20, $currY-3, 195, $currY-3);
      }
      $i++;
    }
    //$pdf->Line(20, $currY+4, 195, $currY+4);
    $this->load->helper('convertNumber_Helper');
    $letra = convertNumber_Helper($result[0]['factotal']);
    // output the total row
    $pdf->CreateTextBox('SON EN LETRAS:', 0, $currY+10, 90, 10, 7, 'B', 'L');
    $pdf->CreateTextBox($letra, 0, $currY+15, 90, 15, 8, '', 'L');

    $pdf->CreateTextBox('Subtotal:', 20, $currY+10, 120, 10, 7, 'B', 'R');
    $pdf->CreateTextBox('$'.number_format($subtotal), 140, $currY+10, 30, 10, 7, '', 'R');

    $pdf->CreateTextBox('Descuento:', 20, $currY+16, 120, 10, 7, 'B', 'R');
    $pdf->CreateTextBox('$'.number_format($result[0]['facdescuento']), 140, $currY+16, 30, 10, 7, '', 'R');

    $pdf->CreateTextBox('Iva:', 20, $currY+21, 120, 10, 7, 'B', 'R');
    $pdf->CreateTextBox('$'.number_format($result[0]['faciva']), 140, $currY+21, 30, 10, 7, '', 'R');

    $pdf->CreateTextBox('Total:', 20, $currY+26, 120, 10, 7, 'B', 'R');
    $pdf->CreateTextBox('$'.number_format($result[0]['factotal']), 140, $currY+26, 30, 10, 7, '', 'R');

    // some payment instructions or information
    $pdf->setXY(20, $currY+30);
    $pdf->SetFont(PDF_FONT_NAME_MAIN, '', 10);
    //$pdf->MultiCell(175, 10, '<em>Lorem ipsum dolor sit amet, consectetur adipiscing elit</em>.Vestibulum sagittis venenatis urna, in pellentesque ipsum pulvinar eu. In nec <a href="http://www.google.com/">nulla libero</a>, eu sagittis diam. Aenean egestas pharetra urna, et tristique metus egestas nec. Aliquam erat volutpat. Fusce pretium dapibus tellus.', 0, 'L', 0, 1, '', '', true, null, true);

    //Close and output PDF document
    $num = $result[0]['facnumero'];
    ob_clean();
    $ruta = $_SERVER['DOCUMENT_ROOT'].'admin2c/pdf/';
    $archivo = 'factura.pdf';
    $fecha = date('Y-m-d');
    $nombre = 'Factura No.'.$num.'- Emitida '.$fecha.'.pdf';
    $pdf->Output($ruta.$nombre, $ver);

    if ($send == "true" && $getEmail !== '' && $getEmail !== 'No aplica' && $getEmail !== 'No registra' && $getEmail !== 'No Registra' && $getEmail !== NULL) {
      $file = fopen($ruta.$nombre, "r");
      $subject = 'Prueba';
      $message = '<p>Este es un mensaje de prueba.</p>';

      // Get full html:
      $body = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
      <meta http-equiv="Content-Type" content="text/html; charset=' . strtolower(config_item('charset')) . '" />
      <title>' . html_escape($subject) . '</title>
      <style type="text/css">
      body {
        font-family: Arial, Verdana, Helvetica, sans-serif;
        font-size: 16px;
      }
      </style>
      </head>
      <body>
      ' . $message . '
      </body>
      </html>';
      // Also, for getting full html you may use the following internal method:
      //$body = $this->email->full_html($subject, $message);
      //->reply_to('carlos17carr@gmail.com')    // Optional, an account where a human being reads.
      $config['protocol'] = 'smtp';
      $config['smtp_host'] = 'smtp.googlemail.com';
      $config['smtp_crypto'] = 'ssl';
      $config['smtp_port'] = 465;
      $config['smtp_timeout'] = 10;
      $config['smtp_user'] = 'carlos0carr@gmail.com';
      $config['smtp_pass'] = '199897322';
      $config['charset'] = 'utf-8';
      $config['newline'] = "\r\n";
      $config['mailtype'] = 'html'; // or html or text
      $config['validation'] = TRUE; // bool whether to

      $this->load->library("email");
      $this->email->initialize($config);
      $send = $this->email
      ->from($dato_encabezado[1]['tipdetalle'], $dato_encabezado[0]['tipdetalle'])
      ->to($getEmail) #$dato_encabezado[1]['tipdetalle'],
      ->subject($subject)
      ->message($body)
      ->attach($ruta.$nombre)
      ->send();

      //echo $this->email->print_debugger();
      fclose($file);
      unlink($ruta.$nombre);
    }
    if ($ver == 'F') {
      $this->load->view('cerrar');
    }
  }

  public function facturas(){
    $this->index('categorias_controller');
  }

  public function obtener_tipos_abonos()
  {
    $result = $this->facturacion_model->obtener_tipos_abonos();
    $success = false;
    if (count($result) > 0) {
      $success = true;
    }
    echo json_encode(
      array(
        'success' => $success,
        'data' => $result
      )
    );
  }

  public function obtener_pagos()
  {
    $data = $this->input->post('numero');
    $result = $this->facturacion_model->obtener_pagos($data, true);
    $success = false;
    if (count($result) > 0) {
      $success = true;
    }
    echo json_encode(
      array(
        'success' => $success,
        'data' => $result
      )
    );
  }

  public function agregar_abono()
  {
    $data = $this->input->post();
    $result = $this->facturacion_model->agregar_abono($data);
    $msg = 'Acción realizada con exíto.';
    $type = 'success';
    if ($result['success'] == 0) {
      $msg = 'Se ha producido un error (ERROR: AGGAB001). Comuniquese con el Departamento de Sistemas.';
      $type = 'danger';
    }
    if ($result['success'] == 1) {
      $msg = 'El valor del abono ($'.$data['valor'].') excede la cantidad de saldo de la factura ($'.$result['total_abonos'].').';
      $type = 'danger';
    }
    if ($result['success'] == 2) {
      $msg = 'A esta factura no se le pueden agregar más abonos porque su saldo es igual a cero (0).';
      $type = 'danger';
    }
    echo json_encode(
      array(
        'success' => $result['success'],
        'msg' => $msg,
        'type' => $type
      )
    );
  }


  public function obtener_facturas()
  {
    $data = $this->facturacion_model->obtener_facturas();
    $success = false;
    for ($i=0; $i < count($data); $i++) {
      if ($data[$i]['tertipogrupo'] == "2") {
        $data[$i]['faccliente'] = $data[$i]['ternom1'].' '.$data[$i]['ternom2'].' '.$data[$i]['terape1'].' '.$data[$i]['terape2'];
      } else {
        $data[$i]['faccliente'] = $data[$i]['ternombre'];
      }
      if ($data[$i]['claven'] == 'VEN') {
        $data[$i]['facvendedor'] = $data[$i]['nom1ven'].' '.$data[$i]['nom2ven'].' '.$data[$i]['ape1ven'].' '.$data[$i]['ape2ven'];
      }
      if ($data[$i]['facestado'] == 'E') {
        $data[$i]['facestado'] = 'Edición';
      }
      if ($data[$i]['facestado'] == 'A') {
        $data[$i]['facestado'] = 'Finalizado';
      }
      if ($data[$i]['facestado'] == 'N') {
        $data[$i]['facestado'] = 'Anulado';
      }
      $data[$i]['facsaldo'] = $data[$i]['factotal'] - $data[$i]['facabonos'];
    }

    if (count($data) > 0) {
      $success = true;
    }
    $this->load->helper('facturas_Helper');
    $resultado = contar_facturas();
    $cantidad = $resultado[0]["cantidad_facturas"];
    $historico_iva = $resultado[0]["iva_historico"];
    $historico_descuento = $resultado[0]["descuento_historico"];
    $historico_total = $resultado[0]["total_historico"];
    echo json_encode(array(
      'success' => $success,
      'data' => $data,
      'cant' => $cantidad,
      'hiva' => $historico_iva,
      'hdesc' => $historico_descuento,
      'htotal' => $historico_total
    ));
  }

  public function obtener_formapago()
  {
    $result = $this->facturacion_model->obtener_formapago();
    $success = false;
    if (count($result) > 0) {
      $success = true;
    }
    echo json_encode(array(
      'success' => $success,
      'data' => $result
    ));
  }

  public function obtener_clientes()
  {
    $clientes = $this->facturacion_model->obtener_clientes();
    $i = 0;
    while ($i <= count($clientes) - 1) {
      if ($clientes[$i]['terclave'] == 'CLI') {
        $data[$i]['value'] = $clientes[$i]['ternom1'].' '.$clientes[$i]['ternom2'].' '.$clientes[$i]['terape1'].' '.$clientes[$i]['terape2'];
        $data[$i]['id'] = $clientes[$i]['tercodigo'];
      } else{
        $data[$i]['value'] = $clientes[$i]['ternombre'];
        $data[$i]['id'] = $clientes[$i]['tercodigo'];
      }
      $i++;
    }
    $a = 0;
    while ($a <= count($clientes) - 1) {
      $data[$i]['value'] = $clientes[$a]['terdocnum'];
      $data[$i]['id'] = $clientes[$a]['tercodigo'];
      $i++;
      $a++;
    }

    $succes = false;
    if (count($clientes) > 0) {
      $success = true;
    }
    if (!isset($data)) {
      $success = false;
      $data = '';
    }
    echo json_encode(array(
      'success' => $success,
      'data' => $data
    ));
  }

  public function obtener_vendedores()
  {
    $vendedores = $this->facturacion_model->obtener_vendedores();
    $i = 0;
    $success = false;
    if (count($vendedores) > 0) {
      while ($i <= count($vendedores) - 1) {
        $data[$i]['value'] = $vendedores[$i]['ternom1'].' '.$vendedores[$i]['ternom2'].' '.$vendedores[$i]['terape1'].' '.$vendedores[$i]['terape2'];
        $data[$i]['id'] = $vendedores[$i]['tercodigo'];
        $i++;
      }
      $a = 0;
      while ($a <= count($vendedores) - 1) {
        $data[$i]['value'] = $vendedores[$a]['terdocnum'];
        $data[$i]['id'] = $vendedores[$a]['tercodigo'];
        $i++;
        $a++;
      }
      $success = true;
    }
    if (!isset($data)) {
      $success = false;
      $data = '';
    }
    echo json_encode(array(
      'success' => $success,
      'data' => $data
    ));
  }

  public function obtener_articulos()
  {
    $result = $this->facturacion_model->obtener_articulos();
    $success = false;
    if (count($result) > 0) {
      $success = true;
    }
    echo json_encode(
      array(
        'success' => $success,
        'articulos' => $result
      )
    );
  }

  public function eliminar_articulo()
  {
    $data = $this->input->post('codigo');
    $result = $this->facturacion_model->inactivar_articulo($data);
    $success = false;
    if ($result === true) {
      $success = true;
    }
    echo json_encode(array(
      'success' => $success
    ));
  }

  public function eliminar_factura()
  {
    $data = $this->input->post();
    $result = $this->facturacion_model->inactivar_factura($data);
    $success = false;
    $tipo = 'danger';
    if ($result['hecho'] === true) {
      $tipo = 'success';
      $success = true;
    }
    echo json_encode(array(
      'success' => $success,
      'msg' => $result['msg'],
      'tipo' => $tipo
    ));
  }

  public function obtener_productos()
  {
    $data = $this->input->post();
    $result = $this->facturacion_model->obtener_productos($data, false);
    $success = false;
    if (count($result) > 0) {
      $success = true;
    }
    echo json_encode(
      array(
        'success' => $success,
        'articulos' => $result
      )
    );
  }

  public function guardar_producto()
  {
    $data = $this->input->post();


    /*var_dump($data);
    exit();*/
    if ($data['tipo'] == '1') {
      $result = $this->facturacion_model->guardar_producto($data);
    } else {
      $result = $this->facturacion_model->agregar_producto($data);
    }
    $success = false;
    if ($result === true) {
      $success = true;
    }
    echo json_encode(
      array(
        'success' => $success
      )
    );
  }

  public function salvar_factura()
  {
    $data = $this->input->post();
    $result = $this->facturacion_model->salvar_factura($data);
    $success = false;
    if ($result === true) {
      $success = true;
    }
    echo json_encode(
      array(
        'success' => $success
      )
    );
  }

  public function finalizar_factura()
  {
    $data = $this->input->post();
    $result = $this->facturacion_model->finalizar_factura($data);
    $result2 =$this->facturacion_model->save_location($data);
    $result2 =$this->facturacion_model->get_location($data);
    $success = false;
    if ($result === true) {
      $success = true;
    }
    echo json_encode(
      array(
        'success' => $success
      )
    );
    //$this->imprimir($data['numero_real'], "true", "F");
  }

  public function validar_estado()
  {
    $data = $this->input->post('codigo');
    $result = $this->facturacion_model->validar_estado($data);
    $success = false;
    if ($result[0]['facestado'] == 'E') {
      $success = true;
    }
    echo json_encode(
      array(
        'success' => $success,
        'data' => $result
      )
    );
  }

  public function validar_numfac()
  {
    $data = $this->input->post('codigo');
    $result = $this->facturacion_model->validar_numfac($data);
    $success = false;
    $data = 1;
    if (count($result) > 0) {
      $success = true;
      $data = 2;
    }
    echo json_encode(
      array(
        'success' => $success,
        'data' => $data
      )
    );
  }

  public function anular_factura()
  {
    $data = $this->input->post();
    $result = $this->facturacion_model->anular_factura($data);
    $success = false;
    if ($result === true) {
      $success = true;
    }
    echo json_encode(array(
      'success' => $success
    ));
  }

  public function validar_existencias()
  {
    $datos = $this->input->post();
    $result = $this->facturacion_model->validar_existencias($datos['producto']);
    $success = true;
    $msg = "Articulo seleccionado con exíto.";
    $type = "success";
    foreach ($result as $data) {
      if ($data['artexistencias'] <= $datos['cantidad']) {
        $success = false;
        $msg = 'Este articulo posee menos cantidad en inventario ('.$data['artexistencias'].') de la que se piensa vender.';
        $type = "danger";
      }
    }
    echo json_encode(
      array(
        'success' => $success,
        'msg' => $msg,
        'type' => $type
      )
    );
  }

  public function validar_cliente()
  {
    $datos = $this->input->post('cliente');
    $result = $this->facturacion_model->validar_cliente($datos);
    echo json_encode(
      array(
        'success' => $result['success'],
        'type' => $result['type'],
        'total' => $result['total'],
        'cant' => $result['cant']
      )
    );
  }

  public function acciones()
  {
    $re = $this->facturacion_model->acc();
  }

  function save_location(){
    $data = $this->input->post();
    /*var_dump($data['factura']);
    exit();*/
    $re = $this->facturacion_model->save_location($data);
    echo json_encode(
      array(
        'success' => $re
      )
    );
  }


  public function obtener_numfac()
  {
    $num = $this->facturacion_model->numfactura();
    echo json_encode(
      array(
        'success'=> true,
        'data'=>$num
      ));
  }




  public function obtener_cli()
  {
    $clientes = $this->facturacion_model->valid_cli();
    $i = 0;
    while ($i <= count($clientes) - 1) {
      if ($clientes[$i]['terclave'] == 'CLI') {
        $data[$i]['value'] = $clientes[$i]['ternom1'].' '.$clientes[$i]['ternom2'].' '.$clientes[$i]['terape1'].' '.$clientes[$i]['terape2'];
        $data[$i]['id'] = $clientes[$i]['tercodigo'];
      } else{
        $data[$i]['value'] = $clientes[$i]['ternombre'];
        $data[$i]['id'] = $clientes[$i]['tercodigo'];
      }
      $i++;
    }
    $a = 0;
    while ($a <= count($clientes) - 1) {
      $data[$i]['value'] = $clientes[$a]['terdocnum'];
      $data[$i]['id'] = $clientes[$a]['tercodigo'];
      $i++;
      $a++;
    }

    $succes = false;
    if (count($clientes) > 0) {
      $success = true;
    }
    if (!isset($data)) {
      $success = false;
      $data = '';
    }
    echo json_encode(array(
      'success' => $success,
      'data' => $data
    ));
  }

}
