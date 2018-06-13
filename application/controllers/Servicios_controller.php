<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class servicios_controller extends CI_controller {
  public function __construct()
  {
    parent::__construct();
    $this->load->model('servicios_model');
  }

  public function listar_clientes(){
    $data = $this->input->post('data');
    $datos = $this->servicios_model->obtener_proveedores($data);
    $success = false;
    $cantidad = count($datos);
    if ($cantidad > 0) {
      $success = true;
    }
    echo json_encode(array(
      'success' => $success,
      'clientes' => $datos
    ));
  }

  public function obtener_tertip(){
    $result = $this->servicios_model->obtener_tertip();
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

  public function reporte_clientes()
  {
    $data = $this->input->get('data');
    $datos = $this->servicios_model->obtener_proveedores($data);
    $this->load->library('excel/excel');
    $objPHPExcel = new excel();
    $styleNormal = new PHPExcel_Style();
    $styleNormal->applyFromArray(
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
    $objPHPExcel->setActiveSheetIndex(0)->setSharedStyle($styleNormal, "A1:O1");
    $objPHPExcel->setActiveSheetIndex(0)
            ->setCellValue ('A1','Tip. Doc')
            ->setCellValue ('B1','Identificación')
            ->setCellValue ('C1','D.V')
            ->setCellValue ('D1','Nombre')
            ->setCellValue ('E1','Tipo')
            ->setCellValue ('F1','Nombre Asociación / Nombre Persona')
            ->setCellValue ('G1','Contributivo')
            ->setCellValue ('H1','Retenedor')
            ->setCellValue ('I1','Dirección')
            ->setCellValue ('J1','Correo')
            ->setCellValue ('K1','Telefono')
            ->setCellValue ('L1','Barrio')
            ->setCellValue ('M1','Ciudad')
            ->setCellValue ('N1','Departamento')
            ->setCellValue ('O1','País');
    for ($i = 0; $i < count($datos) ; $i++) {
      $aux = $i + 2;
      if ($datos[$i]["contributivo"] == 'S') {
        $datos[$i]["contributivo"] = 'Si';
      } else {
        $datos[$i]["contributivo"] = 'No';
      }
      if ($datos[$i]["retenedor"] == 'S') {
        $datos[$i]["retenedor"] = 'Si';
      } else {
        $datos[$i]["retenedor"] = 'No';
      }
      $objPHPExcel->setActiveSheetIndex(0)->setSharedStyle($styleBordes, 'A'.$aux.':'.'O'.$aux);
      $objPHPExcel->setActiveSheetIndex(0)
              ->setCellValue ('A'.$aux, $datos[$i]["detalle"])
              ->setCellValue ('B'.$aux, $datos[$i]["terdocnum"])
              ->setCellValue ('C'.$aux, $datos[$i]["terdigver"])
              ->setCellValue ('D'.$aux, $datos[$i]["ternom1"]. ' ' .$datos[$i]["ternom2"].' '.$datos[$i]["terape1"].' '.$datos[$i]["terape2"] )
              ->setCellValue ('E'.$aux, $datos[$i]["clave"])
              ->setCellValue ('F'.$aux, $datos[$i]["ternombre"])
              ->setCellValue ('G'.$aux, $datos[$i]["contributivo"])
              ->setCellValue ('H'.$aux, $datos[$i]["retenedor"])
              ->setCellValue ('I'.$aux, $datos[$i]["direccion"])
              ->setCellValue ('J'.$aux, $datos[$i]["correo"])
              ->setCellValue ('K'.$aux, $datos[$i]["telefono"])
              ->setCellValue ('L'.$aux, $datos[$i]["barrio"])
              ->setCellValue ('M'.$aux, $datos[$i]["municipio"])
              ->setCellValue ('N'.$aux, $datos[$i]["dpto"])
              ->setCellValue ('O'.$aux, $datos[$i]["pais"]);
    }
    $fecha = date('Y-m-d-h-s');
    header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    header('Content-Disposition: attachment;filename="proveedores'.$fecha.'.xlsx"');
    header('Cache-Control: max-age=0');
    $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
    $objWriter->save('php://output');
  }

  public function guardar_clientes(){
    $datos_clientes = $this->input->post();
    $success = false;
    $msg = "";
    if (isset($datos_clientes['contributivo'])) {
      if ($datos_clientes['contributivo'] == "NA") {
        $datos_clientes['contributivo'] = "N";
      }
    }
    if (isset($datos_clientes['retenedor'])) {
      if ($datos_clientes['retenedor'] == "NA") {
        $datos_clientes['retenedor'] = "N";
      }
    }
    if ($datos_clientes['tipo'] === "1") {
      $realizar = $this->servicios_model->salvar_proveedor($datos_clientes);
    } else {
      $realizar = $this->servicios_model->actualizar_proveedor($datos_clientes);
    }
    if ($realizar !== false) {
        $success = true;
        $msg = $realizar;
    }
    echo json_encode(array('msg' => $msg,
                    'success' => $success
    ));
  }


  //Cargando Vistas
  /*public function index() {
    $resultado = $this->servicios_model->validar_session();
    if ($resultado === false) {
      header('Location: login');
    } else {
      $this->load->view('shared/header');
      $this->load->view('shared/menu', $datos);
      $this->load->view('provedores_view');
      $this->load->view('shared/footer');
    }
  }*/

  public function eliminar_cliente(){
    $codigo = $this->input->post('codigo');
    $result = $this->servicios_model->inactivar_provedor($codigo);
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

  public function obtener_tiposubi()
  {
    $resultado = $this->servicios_model->obtener_tiposubi();
    $success = false;
    if (count($resultado) > 0) {
      $success = true;
    }
    echo json_encode(array(
      'success' => $success,
      'ubi' => $resultado
    ));
  }

  public function obtener_ubicacion(){
    $codigo = $this->input->post('codigo');
    $result = $this->servicios_model->obtener_ubicacion($codigo);
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

  public function guardar_proveedores(){
    $datos_proveedores = $this->input->post();
    $resultado = $this->servicios_model->salvar_proveedores($datos_proveedores);
    $success = false;
    $msg = "";
    if ($resultado !== false) {
      $success = true;
      $msg = $resultado;
    }
    echo json_encode(array(
      'msg' => $msg,
      'success' => $success
));
}

  public function obtener_paises()
  {
    $paises = $this->servicios_model->obtener_paises();
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
    $resultado = $this->servicios_model->obtenter_estados($codigo_pais);
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
    $resultado = $this->servicios_model->obtener_ciudades($codigo_estado);
    $success = false;
    if (count($resultado) > 0) {
      $success = true;
    }
    echo json_encode(array(
      'success' => $success,
      'ciudades' => $resultado
    ));
  }

  public function obtener_barrios()
  {
    $codigo_ciudad = $this->input->post('codigo_ciudad');
    $resultado = $this->servicios_model->obtener_barrios($codigo_ciudad);
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
    $resultado = $this->servicios_model->guardar_barrio($datos);
    $success = false;
    if ($resultado !== false) {
      $success = true;
    }
    echo json_encode(array(
      'success' => $success,
      'barrios' => $resultado
    ));
  }

  public function guardar_ubicacion(){
    $datos = $this->input->post();
    $result = $this->servicios_model->guardar_ubicacion($datos);
    if ($result !== false) {
        $success = true;
      }
      echo json_encode(array(
        'success' => $success,
        'msg' => $msg
      ));
  }

  public function inactivar_ubicacion(){
    $codigo = $this->input->post();
    $result = $this->servicios_model->inactivar_ubicacion($codigo);
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
}
