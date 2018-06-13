<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class gastos_controller extends CI_controller {
  public function __construct()
  {
    parent::__construct();
    $this->load->model('gastos_model');
  }
  //Cargando Vistas
  public function index() {
    $resultado = $this->gastos_model->validar_session();
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
        if ($data['mod_nombre'] == "Gastos" && $data['acc_descripcion'] == "Ver") {
          $next = true;
        }
      }
      if ($next === true) {
        $this->load->view('shared/header');
        $this->load->view('shared/menu', $datos);
        $this->load->view('Gastos_view');
        $this->load->view('shared/footer');
      } else {
        header("Location: inicio");
      }
    }
  }
  public function guardar_gasto()
  {
    $data = $this->input->post();
    if ($data['tipo'] === '1') {
      $realizar = $this->gastos_model->salvar_gasto($data);
    } else {
      $realizar = $this->gastos_model->actualizar_gasto($data);
    }
    $success = false;
    if ($realizar !== false) {
      $success = true;
    }
    echo json_encode(array(
      'success' => $success
    ));
  }

  public function reporte_articulos()
  {
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
            ),
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

    $objPHPExcel->setActiveSheetIndex(0)->setSharedStyle($styleCabecera, "A1:N1");
    $objPHPExcel->setActiveSheetIndex(0)
            ->setCellValue ('A1','Referencia')
            ->setCellValue ('B1','Nombre')
            ->setCellValue ('C1','Descripción')
            ->setCellValue ('D1','Nombre Corto')
            ->setCellValue ('E1','Unidad')
            ->setCellValue ('F1','Codigo de Barra')
            ->setCellValue ('G1','Familia')
            ->setCellValue ('H1','Linea')
            ->setCellValue ('I1','Marca')
            ->setCellValue ('J1','Grupo')
            ->setCellValue ('K1','Iva')
            ->setCellValue ('L1','Existencias')
            ->setCellValue ('M1','Existencia Minima')
            ->setCellValue ('N1','Valor');

    $datos = $this->gastos_model->reporteArticulos();

    for ($i=0; $i < count($datos) ; $i++) {
      $aux = $i + 2;
      $objPHPExcel->setActiveSheetIndex(0)->setSharedStyle($styleCuerpo, "A".$aux.":"."N".$aux);
      $objPHPExcel->setActiveSheetIndex(0)
              ->setCellValue ('A'.$aux, $datos[$i]["artreferencia"])
              ->setCellValue ('B'.$aux, $datos[$i]["artnombre"])
              ->setCellValue ('C'.$aux, $datos[$i]["artdescripcion"])
              ->setCellValue ('D'.$aux, $datos[$i]["artresumen"])
              ->setCellValue ('E'.$aux, $datos[$i]["unidad"])
              ->setCellValue ('F'.$aux, $datos[$i]["artbarcode"])
              ->setCellValue ('G'.$aux, $datos[$i]["familia"])
              ->setCellValue ('H'.$aux, $datos[$i]["linea"])
              ->setCellValue ('I'.$aux, $datos[$i]["marca"])
              ->setCellValue ('J'.$aux, $datos[$i]["grupo"])
              ->setCellValue ('K'.$aux, $datos[$i]["artporcentajeiva"])
              ->setCellValue ('L'.$aux, $datos[$i]["artexistencias"])
              ->setCellValue ('M'.$aux, $datos[$i]["artstock"])
              ->setCellValue ('N'.$aux, $datos[$i]["artvalor"]);
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
    header('Content-Disposition: attachment;filename="articulos'.$fecha.'.xlsx"');
    header('Cache-Control: max-age=0');
    $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
    $objWriter->save('php://output');
  }

  public function obtener_gastos()
  {
    $result = $this->gastos_model->obtener_gastos();
    $success = false;
    if (count($result) > 0) {
      for ($i=0; $i < count($result); $i++) {
        if ($result[$i]['gasestado'] == 'S') {
          $result[$i]['gasestado'] = 'Activo';
        }
        if ($result[$i]['gasestado'] == 'N') {
          $result[$i]['gasestado'] = 'Inactivo';
        }
      }
      $success = true;
    }
    echo json_encode(array(
      'success' => $success,
      'data' => $result
    ));
  }

  public function obtener_tipo_gastos()
  {
    $result = $this->gastos_model->obtener_tipo_gastos();
    $success = false;
    if ($result !== false) {
      $success = true;
    }
    echo json_encode(array(
      'success' => $success,
      'unidades' => $result
    ));
  }


  public function eliminar_gasto()
  {
    $codigo = $this->input->post('codigo');
    $result = $this->gastos_model->inactivar_gasto($codigo);
    $success = false;
    if ($result !== false) {
      $success = true;
    }
    echo json_encode(array(
      'success' => $success,
    ));
  }

  public function validar_suscripcion()
  {
    $dt = $this->input->post('numero_documento');
    $re = $this->gastos_model->validar_suscripcion($dt);
    echo json_encode(array(
      'success' => $re['success'],
      'msg' => $re['msg'],
      'type' => $re['type']
    ));
  }
}
