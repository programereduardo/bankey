<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class reporteGastos_controller extends CI_controller {
  public function __construct()
  {
    parent::__construct();
    $this->load->model('reporteGastos_model');
  }
  //Cargando Vistas
  public function index() {
    $resultado = $this->reporteGastos_model->validar_session();
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
        if ($data['mod_nombre'] == "Cartera" && $data['acc_descripcion'] == "Ver") {
          $next = true;
        }
      }
      if ($next === true) {
        $this->load->view('shared/header');
        $this->load->view('shared/menu', $datos);
        $this->load->view('Reportegastos_view');
        $this->load->view('shared/footer');
      } else {
        header("Location: inicio");
      }
    }
  }

  public function facturas(){
    $this->index('categorias_controller');
  }

  public function cargar_gastos()
  {
    $result = $this->reporteGastos_model->cargar_gastos(true);
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

  public function busqueda()
  {
    $data = $this->input->post();
    $result = $this->reporteGastos_model->busqueda($data);
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
    if ($data['excel'] === "true") {
      $this->generar_excel($result);
    } else {
      echo json_encode(array(
        'success' => $success,
        'data' => $result
      ));
    }
  }

  public function generar_excel($datos)
    {
      $this->load->library('excel/excel');
      $objPHPExcel = new excel();
      $hoja = $objPHPExcel->setActiveSheetIndex(0);
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

      $stylePie = new PHPExcel_Style();
      $stylePie->applyFromArray(
              array(
                  'fill' => array(
                      'type' => PHPExcel_Style_Fill::FILL_SOLID,
                      'color' => array('argb' => 'FF46dcf7')
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
            ),
            'borders' => array(
                'bottom' => array('style' => PHPExcel_Style_Border::BORDER_THIN),
                'right' => array('style' => PHPExcel_Style_Border::BORDER_THIN),
                'left' => array('style' => PHPExcel_Style_Border::BORDER_THIN),
                'top' => array('style' => PHPExcel_Style_Border::BORDER_THIN)
            )
        )
      );

      $objPHPExcel->setActiveSheetIndex(0)->setSharedStyle($styleCabecera, "A1:E1");
      $objPHPExcel->setActiveSheetIndex(0)
                  ->setCellValue ('A1','ID')
                  ->setCellValue ('B1','Tipo de Gasto')
                  ->setCellValue ('C1','Fecha')
                  ->setCellValue ('D1','Valor')
                  ->setCellValue ('E1','Estado');

      $total_total = 0;
      for ($i=0; $i < count($datos) ; $i++) {
        $aux = $i + 2;

        $objPHPExcel->setActiveSheetIndex(0)->setSharedStyle($styleCuerpo, "A".$aux.":"."E".$aux);
        $objPHPExcel->setActiveSheetIndex(0)
                    ->setCellValue ('A'.$aux, $i+1)
                    ->setCellValue ('B'.$aux, $datos[$i]["tipdetalle"])
                    ->setCellValue ('C'.$aux, $datos[$i]["gasfecha"])
                    ->setCellValue ('D'.$aux, '$'.number_format($datos[$i]["gasvalor"]))
                    ->setCellValue ('E'.$aux, $datos[$i]["gasestado"]);
        if ($datos[$i]['gasestado'] !== 'Inactivo') {
          $total_total = $total_total + $datos[$i]['gasvalor'];
        }

        $objPHPExcel->setActiveSheetIndex(0)->setSharedStyle($styleCentrar, "A".$aux.":"."E".$aux);
        $objPHPExcel->setActiveSheetIndex(0)->setSharedStyle($styleCentrar, "A".$aux.":"."E".$aux);
    }
    $row = $aux + 1;
    $hoja->setSharedStyle($styleCentrar, 'A'.$row.":".'E'.$row);
    $objPHPExcel->setActiveSheetIndex(0)
            ->setCellValue ('A'.$row,'TOTAL')
            ->setCellValue ('B'.$row,'')
            ->setCellValue ('C'.$row,'')
            ->setCellValue ('D'.$row, '$'.number_format($total_total))
            ->setCellValue ('E'.$row,'');

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

      $hoja->mergeCells('A'.$row.":".'C'.$row);
      $hoja->setSharedStyle($styleCentrar, 'A'.$row.":".'E'.$row);
      $hoja->setSharedStyle($styleCuerpo, "A".$row.":"."E".$row);
      $hoja->setSharedStyle($stylePie, 'A'.$row.":".'E'.$row);

      $fecha = date('Y-m-d-h-s');
      header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      header('Content-Disposition: attachment;filename="gastos'.$fecha.'.xlsx"');
      header('Cache-Control: max-age=0');
      $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
      $objWriter->save('php://output');
    }

}
