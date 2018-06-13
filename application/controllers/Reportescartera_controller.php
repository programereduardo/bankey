<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class reportescartera_controller extends CI_controller {
  public function __construct()
  {
    parent::__construct();
    $this->load->model('reportescartera_model');
  }
  //Cargando Vistas
  public function index() {
    $resultado = $this->reportescartera_model->validar_session();
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
        $this->load->view('Reportescartera_view');
        $this->load->view('shared/footer');
      } else {
        header("Location: inicio");
      }
    }
  }

  public function facturas(){
    $this->index('categorias_controller');
  }

  public function cargar_facturas()
  {
    $result = $this->reportescartera_model->cargar_facturas(true);
    $retorno = array();
    for ($i=0; $i < count($result); $i++) {
      if ($result[$i]['tipo'] == '2') {
        $result[$i]['cliente'] = $result[$i]['primernombrecliente'].' '.$result[$i]['segundonombrecliente'].' '.$result[$i]['primerapellidocliente'].' '.$result[$i]['segundoapellidocliente'];
      }
      $dato = $result[$i]['factotal'] - $result[$i]['facabonos'];
      if ($dato > 0) {
        array_push($retorno, $result[$i]);
      }
    }
    $success = false;
    if (count($result) > 0) {
      $success = true;
    }
    echo json_encode(array(
      'success' => $success,
      'data' => $retorno
    ));
  }

  public function busqueda()
  {
    $data = $this->input->post();
    $result = $this->reportescartera_model->busqueda($data);
    $success = false;
    $retorno = array();
    if (count($result) > 0) {
      $success = true;
    }
    for ($i=0; $i < count($result); $i++) {
      if ($result[$i]['tipo'] == '2') {
        $result[$i]['cliente'] = $result[$i]['primernombrecliente'].' '.$result[$i]['segundonombrecliente'].' '.$result[$i]['primerapellidocliente'].' '.$result[$i]['segundoapellidocliente'];
      }
      $dato = $result[$i]['factotal'] - $result[$i]['facabonos'];
      if ($dato > 0) {
        array_push($retorno, $result[$i]);
      }
    }
    if ($data['excel'] === "true") {
      $this->generar_excel($retorno);
    } else {
      echo json_encode(array(
        'success' => $success,
        'data' => $retorno
      ));
    }
  }

  public function generar_excel($datos)
    {
      //$datos = $this->reportescartera_model->cargar_facturas(false);
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

      $objPHPExcel->setActiveSheetIndex(0)->setSharedStyle($styleCabecera, "A1:K1");
      $objPHPExcel->setActiveSheetIndex(0)
              ->setCellValue ('A1','ID')
              ->setCellValue ('B1','Identificación')
              ->setCellValue ('C1','Cliente')
              ->setCellValue ('D1','Vendedor')
              ->setCellValue ('E1','Número Factura')
              ->setCellValue ('F1','Fecha Entrada')
              ->setCellValue ('G1','Fecha Vencimiento')
              ->setCellValue ('H1','Total')
              ->setCellValue ('I1','Saldo Inicial')
              ->setCellValue ('J1','Abonos')
              ->setCellValue ('K1','Deuda');

      $total_total = 0;
      $total_saldo = 0;
      $total_abonos = 0;
      $total_deuda = 0;
      for ($i=0; $i < count($datos) ; $i++) {
        $aux = $i + 2;
        if ($datos[$i]['tipo'] == "2") {
          $datos[$i]['cliente'] = $datos[$i]['primernombrecliente'].' '.$datos[$i]['segundonombrecliente'].' '.$datos[$i]['primerapellidocliente'].' '.$datos[$i]['segundoapellidocliente'];
        }

        $objPHPExcel->setActiveSheetIndex(0)->setSharedStyle($styleCuerpo, "A".$aux.":"."K".$aux);
        $objPHPExcel->setActiveSheetIndex(0)
                ->setCellValue ('A'.$aux, $i+1)
                ->setCellValue ('B'.$aux, $datos[$i]["numdoc"])
                ->setCellValue ('C'.$aux, $datos[$i]["cliente"])
                ->setCellValue ('D'.$aux, $datos[$i]["vendedor"])
                ->setCellValue ('E'.$aux, $datos[$i]["facnumero"])
                ->setCellValue ('F'.$aux, $datos[$i]["facfecvenci"])
                ->setCellValue ('G'.$aux, $datos[$i]["facfecvenci"])
                ->setCellValue ('H'.$aux, '$'.number_format($datos[$i]["factotal"]))
                ->setCellValue ('I'.$aux, '$'.number_format($datos[$i]["facsaldo"]))
                ->setCellValue ('J'.$aux, '$'.number_format($datos[$i]["facabonos"]))
                ->setCellValue ('K'.$aux, '$'.number_format($datos[$i]['factotal'] - $datos[$i]["facabonos"]));

        $total_saldo = $total_saldo + $datos[$i]["facsaldo"];
        $total_abonos = $total_abonos + $datos[$i]["facabonos"];
        $total_deuda = $total_deuda + ($datos[$i]['factotal'] - $datos[$i]["facabonos"]);
        $total_total = $total_total + $datos[$i]['factotal'];

        $objPHPExcel->setActiveSheetIndex(0)->setSharedStyle($styleCentrar, "A".$aux.":"."K".$aux);
        $objPHPExcel->setActiveSheetIndex(0)->setSharedStyle($styleCentrar, "A".$aux.":"."K".$aux);
    }
    $row = $aux + 1;
    $hoja->setSharedStyle($styleCentrar, 'A'.$row.":".'G'.$row);
    $objPHPExcel->setActiveSheetIndex(0)
            ->setCellValue ('A'.$row,'TOTAL')
            ->setCellValue ('B'.$row,'')
            ->setCellValue ('C'.$row,'')
            ->setCellValue ('D'.$row,'')
            ->setCellValue ('E'.$row,'')
            ->setCellValue ('F'.$row,'')
            ->setCellValue ('G'.$row,'')
            ->setCellValue ('H'.$row, '$'.number_format($total_total))
            ->setCellValue ('I'.$row, '$'.number_format($total_saldo))
            ->setCellValue ('J'.$row, '$'.number_format($total_abonos))
            ->setCellValue ('K'.$row, '$'.number_format($total_deuda));

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

      $hoja->mergeCells('A'.$row.":".'G'.$row);
      $hoja->setSharedStyle($styleCentrar, 'A'.$row.":".'K'.$row);
      $hoja->setSharedStyle($styleCuerpo, "A".$row.":"."K".$row);
      $hoja->setSharedStyle($stylePie, 'A'.$row.":".'K'.$row);

      $fecha = date('Y-m-d-h-s');
      header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      header('Content-Disposition: attachment;filename="cartera'.$fecha.'.xlsx"');
      header('Cache-Control: max-age=0');
      $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
      $objWriter->save('php://output');
      return true;
    }

}
