<?php 
defined('BASEPATH') OR exit('No direct script access allowed');

class terceros_controller extends CI_controller {
  public function __construct()
  {
    parent::__construct();
    $this->load->model('terceros_model');
  }
  //Cargando Vistas
  public function index($nombre_minuscula, $titulo, $accMod, $tip) {
    $next = false;
    $resultado = $this->terceros_model->validar_session();
    if ($resultado === false) {
      header('Location: login');
    } else {
      $this->load->model('sistema/permisos_model');
      $acciones = $this->permisos_model->obtener_acciones();
      $datos = array(
        'acciones' => $acciones
      );
      foreach ($acciones as $data) {
        if ($data['mod_nombre'] == $titulo && $data['acc_descripcion'] == "Ver") {
          $next = true;
        }
      }

      $parametros = array(
        'controlador' => 'terceros_controller',
        'titulo' => $titulo,
        'modalName' => 'modalClientes',
        'clase' => 'cli',
        'tipo' => $nombre_minuscula,
        'accMod' => $accMod,
        'tip' => $tip
      );
      if ($next) {
        $this->load->view('shared/scripts');
        $this->load->view('shared/header');
        $this->load->view('shared/menu', $datos);
        $this->load->view('Terceros_view', $parametros);
        $this->load->view('shared/ubicaciones');
        $this->load->view('shared/footer');
      } else {
        header('Location: inicio');
      }
    }
  }

  public function clientes() {
    $next = false;
    $this->load->model('sistema/permisos_model');
    $acciones = $this->permisos_model->obtener_acciones();
    $datos = array(
      'acciones' => $acciones
    );
    foreach ($acciones as $data) {
      if ($data['mod_nombre'] == "Clientes" && $data['acc_descripcion'] == "Ver") {
        $next = true;
      }
    }
    if ($next === true) {
      $this->index('terceros', 'Clientes', 'Cliente', 'CLI');
    } else {
      header("Location: inicio");
    }
  }

  public function servicios($value='')
  {
    $next = false;
    $this->load->model('sistema/permisos_model');
    $acciones = $this->permisos_model->obtener_acciones();
    $datos = array(
      'acciones' => $acciones
    );
    foreach ($acciones as $data) {
      if ($data['mod_nombre'] == "Servicios" && $data['acc_descripcion'] == "Ver") {
        $next = true;
      }
    }
    if ($next === true) {
      $this->index('servicios', 'Servicios', 'Proveedor de Servicio', 'SER');
    } else {
      header("Location: inicio");
    }
  }

  public function proveedores() {
    $next = false;
    $this->load->model('sistema/permisos_model');
    $acciones = $this->permisos_model->obtener_acciones();
    $datos = array(
      'acciones' => $acciones
    );
    foreach ($acciones as $data) {
      if ($data['mod_nombre'] == "Proveedores" && $data['acc_descripcion'] == "Ver") {
        $next = true;
      }
    }
    if ($next === true) {
      $this->index('proveedores', 'Proveedores', 'Proveedor', 'PRO');
    } else {
      header("Location: inicio");
    }
  }

  public function vendedores() {
    $next = false;
    $this->load->model('sistema/permisos_model');
    $acciones = $this->permisos_model->obtener_acciones();
    $datos = array(
      'acciones' => $acciones
    );
    foreach ($acciones as $data) {
      if ($data['mod_nombre'] == "Vendedores" && $data['acc_descripcion'] == "Ver") {
        $next = true;
      }
    }
    if ($next === true) {
      $this->index('vendedores', 'Vendedores', 'Vendedor', 'VEN');
    } else {
      header("Location: inicio");
    }
  }

  public function guardar_tercero(){
    $datos_tercero = $this->input->post();
    
    $success = false;
    $msg = "";
     
    if ($datos_tercero['tipo'] === "1") {
      $realizar = $this->terceros_model->salvar_tercero($datos_tercero);
    } else {
      $realizar = $this->terceros_model->actualizar_tercero($datos_tercero);
    }
    if ($realizar !== false) {
      $success = true;
      $msg = $realizar;
    }
    echo json_encode(array(
      'msg' => $msg,
      'success' => $success
    ));
  }

  public function eliminar_cliente(){
    $codigo = $this->input->post('codigo');
    $result = $this->terceros_model->inactivar_Cliente($codigo);
    $success = false;
    $msg = '';
    if ($result !== false) {
      $success = true;
      $msg = $result;
    }
    echo json_encode(array(
      'msg' => $msg,
      'success' => $success
    ));
  }


  public function listar_tercero(){
    $data = $this->input->post('data');
    $datos = $this->terceros_model->obtener_terceros($data);
    $cantidad = count($datos);
    if ($cantidad <= 0) {
      $retorno = "0";
    } else {
      $retorno = $cantidad;
    }
    $success = false;
    if ($cantidad > 0) {
      $success = true;
    }
    echo json_encode(array(
      'success' => $success,
      'clientes' => $datos,
      'cantidad' => $retorno
    ));
  }

  //UBICACIONES

  public function obtener_ubicacion(){
    $codigo = $this->input->post('codigo');
    $result = $this->terceros_model->obtener_ubicacion($codigo);
    $cantidad = count($result);
    $success = false;
    if ($cantidad > 0) {
      $success = true;
    }
    echo json_encode(array(
      'success' => $success,
      'ubicaciones' => $result
    ));
  }

  public function obtener_tertip(){
    $result = $this->terceros_model->obtener_tertip();
    $cantidad = count($result);
    $success = false;
    if ($cantidad > 0) {
      $success = true;
    }
    echo json_encode(array(
      'success' => $success,
      'data' => $result
    ));
  }

  public function inactivar_ubicacion(){
    $codigo = $this->input->post();
    $result = $this->terceros_model->inactivar_ubicacion($codigo);
    $success = false;
    $msg = '';
    if ($result !== false) {
      $success = true;
    }
    echo json_encode(array(
      'success' => $success,
      'msg' => $msg
    ));
  }

  public function guardar_ubicacion(){
    $datos = $this->input->post();
    if ($datos['tipoU'] == '1') {
      $result = $this->terceros_model->guardar_ubicacion($datos);
    } else {
      $result = $this->terceros_model->modificar_ubicacion($datos);
    }
    $msg = '';
    if ($result !== false) {
        $success = true;
      }
      echo json_encode(array(
        'success' => $success,
        'msg' => $msg
      ));
  }

  public function obtener_paises()
  {
    $paises = $this->terceros_model->obtener_paises();
    $success = false;
    if (count($paises) > 0) {
      $success = true;
    }
    echo json_encode(array(
      'success' => $success,
      'paises' => $paises
    ));
  }

  public function obtener_estados()
  {
    $codigo_pais = $this->input->post('codigo_pais');
    $resultado = $this->terceros_model->obtenter_estados($codigo_pais);
    $success = false;
    if (count($resultado) > 0) {
      $success = true;
    }
    echo json_encode(array(
      'success' => $success,
      'estados' => $resultado
    ));
  }

  public function obtener_ciudades()
  {
    $codigo_estado = $this->input->post('codigo_estado');
    $resultado = $this->terceros_model->obtener_ciudades($codigo_estado);
    $success = false;
    if (count($resultado) > 0) {
      $success = true;
    }
    echo json_encode(array(
      'success' => $success,
      'ciudades' => $resultado
    ));
  }

  public function obtener_documentos()
  {
    $resultado = $this->terceros_model->obtener_documentos();
    $success = false;
    if (count($resultado) > 0) {
      $success = true;
    }
    echo json_encode(array(
      'success' => $success,
      'documentos' => $resultado
    ));
  }

  public function obtener_generos()
  {
    $resultado = $this->terceros_model->obtener_generos();
    $success = false;
    if (count($resultado) > 0) {
      $success = true;
    }
    echo json_encode(array(
      'success' => $success,
      'generos' => $resultado
    ));
  }

  public function obtener_tiposubi()
  {
    $resultado = $this->terceros_model->obtener_tiposubi();
    $success = false;
    if (count($resultado) > 0) {
      $success = true;
    }
    echo json_encode(array(
      'success' => $success,
      'ubi' => $resultado
    ));
  }

  public function obtener_barrios()
  {
    $codigo_ciudad = $this->input->post('codigo_ciudad');
    $resultado = $this->terceros_model->obtener_barrios($codigo_ciudad);
    $success = false;
    if (count($resultado) > 0) {
      $success = true;
    }
    echo json_encode(array(
      'success' => $success,
      'barrios' => $resultado
    ));
  }

  public function guardar_barrio()
  {
    $datos = $this->input->post();
    $resultado = $this->terceros_model->guardar_barrio($datos);
    $success = false;
    if ($resultado !== false) {
      $success = true;
    }
    echo json_encode(array(
      'success' => $success,
      'barrios' => $resultado
    ));
  }

  public function validar_documento()
  {
    $data = $this->input->post('codigo');
    $result = $this->terceros_model->validar_documento($data);

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

  public function validar_ubipri()
  {
    $tipo = $this->input->post('tipo');

    $tercero = $this->input->post('tercero');
    $result = $this->terceros_model->validar_terubipri($tipo, $tercero);
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

  public function reporte_clientes()
   {
     $data = $this->input->get('data');
     $datos = $this->terceros_model->obtener_clientes($data);
     $this->load->library('excel/excel');
     $objPHPExcel = new excel();
     $styleCabecera = new PHPExcel_Style();
     $styleCabecera->applyFromArray(
             array(
                 'fill' => array(
                     'type' => PHPExcel_Style_Fill::FILL_SOLID,
                     'color' => array('argb' => 'FF5e74e8')
                 ),
                 'borders' => array(
                     'bottom' => array('style' => PHPExcel_Style_Border::BORDER_THIN),
                     'right' => array('style' => PHPExcel_Style_Border::BORDER_THIN),
                     'left' => array('style' => PHPExcel_Style_Border::BORDER_THIN),
                     'top' => array('style' => PHPExcel_Style_Border::BORDER_THIN)
                 )
             )
     );

     $styleCuerpo = new PHPExcel_Style();
     $styleCuerpo->applyFromArray(
         array(
             'borders' => array(
                 'bottom' => array('style' => PHPExcel_Style_Border::BORDER_THIN),
                 'right' => array('style' => PHPExcel_Style_Border::BORDER_THIN),
                 'left' => array('style' => PHPExcel_Style_Border::BORDER_THIN),
                 'top' => array('style' => PHPExcel_Style_Border::BORDER_THIN)
             )
         )
     );

     $styleCentrar = new PHPExcel_Style();
     $styleCentrar->applyFromArray(
       array(
           'alignment' => array(
               'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_LEFT,
               'vertical' => PHPExcel_Style_Alignment::VERTICAL_CENTER,
           )
       )
     );

     $styleBordes = new PHPExcel_Style();
     $styleBordes->applyFromArray(
             array(
                 'borders' => array(
                     'bottom' => array('style' => PHPExcel_Style_Border::BORDER_THIN),
                     'right' => array('style' => PHPExcel_Style_Border::BORDER_THIN),
                     'left' => array('style' => PHPExcel_Style_Border::BORDER_THIN),
                     'top' => array('style' => PHPExcel_Style_Border::BORDER_THIN)
                 )
             )
     );

     $objPHPExcel->setActiveSheetIndex(0)->setSharedStyle($styleCabecera, "A1:Q1");
     $objPHPExcel->setActiveSheetIndex(0)
             ->setCellValue ('A1','ID')
             ->setCellValue ('B1','Tip. Doc')
             ->setCellValue ('C1','Identificación')
             ->setCellValue ('D1','D.V')
             ->setCellValue ('E1','Nombre')
             ->setCellValue ('F1','Tipo')
             ->setCellValue ('G1','Nombre Asociación / Nombre Persona')
             ->setCellValue ('H1','Contributivo')
             ->setCellValue ('I1','Retenedor')
             ->setCellValue ('J1','Dirección')
             ->setCellValue ('K1','Correo')
             ->setCellValue ('L1','Telefono')
             ->setCellValue ('M1','Celular')
             ->setCellValue ('N1','Barrio')
             ->setCellValue ('O1','Ciudad')
             ->setCellValue ('P1','Departamento')
             ->setCellValue ('Q1','País');

     $cedula = "";
     $filaPos = 1;

     $hoja = $objPHPExcel->setActiveSheetIndex(0);
     $row = 2;
     $contador = 1;
     foreach ($datos as $campo) {
       $filaPos++;
         if($cedula != $campo['terdocnum']) {
           if($cedula != "") {
           $arrayCombinacion = array('A','B','C','D','E','F','G','H', 'I');
           foreach ($arrayCombinacion as $columna) {
             $hoja->mergeCells($columna.$filaIni.":".$columna.($filaPos - 1));
             $hoja->setSharedStyle($styleCentrar, $columna.$filaIni.":".$columna.($filaPos - 1));
             $objPHPExcel->setActiveSheetIndex(0)->setSharedStyle($styleCuerpo, $columna.$filaIni.":".$columna.($filaPos - 1));
           }
         }

         $filaIni = $filaPos;
         //Nuevo registro
         $cedula = $campo['terdocnum'];
         $hoja   ->setCellValue ('A'.$filaPos, $contador)
                 ->setCellValue ('B'.$filaPos, $campo["detalle"])
                 ->setCellValue ('C'.$filaPos, $campo["terdocnum"])
                 ->setCellValue ('D'.$filaPos, $campo["terdigver"])
                 ->setCellValue ('E'.$filaPos, $campo["ternom1"]. ' ' .$campo["ternom2"].' '.$campo["terape1"].' '.$campo["terape2"])
                 ->setCellValue ('F'.$filaPos, $campo["clave"])
                 ->setCellValue ('G'.$filaPos, $campo["ternombre"])
                 ->setCellValue ('H'.$filaPos, $campo["contributivo"] == 'S' ? "SI" : "NO")
                 ->setCellValue ('I'.$filaPos, $campo["retenedor"] == 'S' ? "SI" : "NO");

         $hoja   ->setCellValue ('J'.$filaPos, $campo["direccion"])
                 ->setCellValue ('K'.$filaPos, $campo["correo"])
                 ->setCellValue ('L'.$filaPos, $campo["telefono"])
                 ->setCellValue ('M'.$filaPos, $campo["celular"])
                 ->setCellValue ('N'.$filaPos, $campo["barrio"])
                 ->setCellValue ('O'.$filaPos, $campo["municipio"])
                 ->setCellValue ('P'.$filaPos, $campo["dpto"])
                 ->setCellValue ('Q'.$filaPos, $campo["pais"]);

       } else {
         $contador = $contador - 1;
         $hoja   ->setCellValue ('A'.$filaPos, $contador)
                 ->setCellValue ('J'.$filaPos, $campo["direccion"])
                 ->setCellValue ('K'.$filaPos, $campo["correo"])
                 ->setCellValue ('L'.$filaPos, $campo["telefono"])
                 ->setCellValue ('M'.$filaPos, $campo["celular"])
                 ->setCellValue ('N'.$filaPos, $campo["barrio"])
                 ->setCellValue ('O'.$filaPos, $campo["municipio"])
                 ->setCellValue ('P'.$filaPos, $campo["dpto"])
                 ->setCellValue ('Q'.$filaPos, $campo["pais"]);

       }
       $objPHPExcel->setActiveSheetIndex(0)->setSharedStyle($styleCuerpo, "A".$row.":"."Q".$row);
       $contador++;
       $row++;
     }

     foreach ($objPHPExcel->getWorksheetIterator() as $worksheet) {
       $objPHPExcel->setActiveSheetIndex($objPHPExcel->getIndex($worksheet));
       $sheet = $objPHPExcel->getActiveSheet();
       $cellIterator = $sheet->getRowIterator()->current()->getCellIterator();
       $cellIterator->setIterateOnlyExistingCells(true);
       /** @var PHPExcel_Cell $cell */
       foreach ($cellIterator as $cell) {
           $sheet->getColumnDimension($cell->getColumn())->setAutoSize(true);
       }
     }
     $fecha = date('Y-m-d-h-s');
     header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
     header('Content-Disposition: attachment;filename="clientes'.$fecha.'.xlsx"');
     header('Cache-Control: max-age=0');
     $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
     $objWriter->save('php://output');
   }

   public function obtener_regimenes()
   {
     $data = $this->terceros_model->obtener_regimenes();
     $success = false;
     if (count($data) > 0) {
       $success = true;
     }
     echo json_encode(array(
       'success' => $success,
       'data' => $data
     ));
   }
 }
