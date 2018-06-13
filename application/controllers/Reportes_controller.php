<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class reportes_controller extends CI_controller {
  public function __construct()
  {
    parent::__construct();
    $this->load->model('reportes_model');
  }
  //Cargando Vistas
  public function index() {
    $resultado = $this->reportes_model->validar_session();
    if ($resultado === false) {
      header('Location: login');
    } else {
      $this->load->model('sistema/permisos_model');
      $acciones = $this->permisos_model->obtener_acciones();
      $datos = array(
        'acciones' => $acciones
      );
      $this->load->view('shared/header');
      $this->load->view('shared/menu', $datos);
      $this->load->view('Reportes_view');
      $this->load->view('shared/footer');
    }
  }

  public function facturas(){
    $this->index('categorias_controller');
  }

  public function cargar_facturas()
  {
    $result = $this->reportes_model->cargar_facturas(true);
    $success = false;
    if (count($result) > 0) {
      $success = true;
      for ($i=0; $i < count($result); $i++) {
        if ($result[$i]['facestado'] == "A") {
          $result[$i]['facestado'] = 'Finalizado';
        }
        if ($result[$i]['facestado'] == "N") {
          $result[$i]['facestado'] = 'Anulado';
        }
        if ($result[$i]['facestado'] == "E") {
          $result[$i]['facestado'] = 'Edición';
        }
        if ($result[$i]['tipo'] == "2") {
          $result[$i]['cliente'] = $result[$i]['primernombrecliente'].' '.$result[$i]['segundonombrecliente'].' '.$result[$i]['primerapellidocliente'].' '.$result[$i]['segundoapellidocliente'];
        } else {
          $result[$i]['cliente'] = $result[$i]['cliente'];
          $result[$i]['numdoc'] = $result[$i]['numdoc'].'-'.$result[$i]['dv'];
        }
      }
    }
    echo json_encode(array(
      'success' => $success,
      'data' => $result
    ));
  }

  public function busqueda()
  {
    #$retorno = array();
    $data = $this->input->post();
    $result = $this->reportes_model->busqueda($data);
    $success = false;
    if (count($result) > 0) {
      for ($i=0; $i < count($result); $i++) {
        if ($result[$i]['facestado'] == "A") {
          $result[$i]['facestado'] = 'Finalizado';
        }
        if ($result[$i]['facestado'] == "N") {
          $result[$i]['facestado'] = 'Anulado';
        }
        if ($result[$i]['facestado'] == "E") {
          $result[$i]['facestado'] = 'Edición';
        }
        if ($result[$i]['tipo'] == "2") {
          $result[$i]['cliente'] = $result[$i]['primernombrecliente'].' '.$result[$i]['segundonombrecliente'].' '.$result[$i]['primerapellidocliente'].' '.$result[$i]['segundoapellidocliente'];
        } else {
          $result[$i]['cliente'] = $result[$i]['cliente'];
          $result[$i]['numdoc'] = $result[$i]['numdoc'].'-'.$result[$i]['dv'];
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
      //$datos = $this->reportes_model->cargar_facturas(false);
      //set_time_limit(0);
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

      $objPHPExcel->setActiveSheetIndex(0)->setSharedStyle($styleCabecera, "A1:L1");
      $objPHPExcel->setActiveSheetIndex(0)
              ->setCellValue('A1','ID')
              ->setCellValue('B1','Número Factura')
              ->setCellValue('C1','Identificación')
              ->setCellValue('D1','Cliente')
              ->setCellValue('E1','Vendedor')
              ->setCellValue('F1','Fecha Entrada')
              ->setCellValue('G1','Fecha Vencimiento')
              ->setCellValue('H1', 'Subtotal')
              ->setCellValue('I1','Descuento')
              ->setCellValue('J1','Iva')
              ->setCellValue('K1','Total')
              ->setCellValue('L1','Estado');

      $total_facturado = 0;
      $total_descontado = 0;
      $total_subtotal = 0;
      $total_iva = 0;
      for ($i=0; $i < count($datos) ; $i++) {
        $aux = $i + 2;
        if ($datos[$i]['tipo'] == "2") {
          $datos[$i]['cliente'] = $datos[$i]['primernombrecliente'].' '.$datos[$i]['segundonombrecliente'].' '.$datos[$i]['primerapellidocliente'].' '.$datos[$i]['segundoapellidocliente'];
        }
        if ($datos[$i]['facestado'] == 'E') {
          $datos[$i]['facestado'] = 'En Edición';
        }
        if ($datos[$i]['facestado'] == 'A') {
          $datos[$i]['facestado'] = 'Finalizado';
        }
        if ($datos[$i]['facestado'] == 'N') {
          $datos[$i]['facestado'] = 'Anulado';
        }
        $objPHPExcel->setActiveSheetIndex(0)->setSharedStyle($styleCuerpo, "A".$aux.":"."L".$aux);
        $objPHPExcel->setActiveSheetIndex(0)
                ->setCellValue ('A'.$aux, $i+1)
                ->setCellValue ('B'.$aux, $datos[$i]["facnumero"])
                ->setCellValue ('C'.$aux, $datos[$i]["numdoc"])
                ->setCellValue ('D'.$aux, $datos[$i]["cliente"])
                ->setCellValue ('E'.$aux, $datos[$i]["vendedor"])
                ->setCellValue ('F'.$aux, $datos[$i]["facfecent"])
                ->setCellValue ('G'.$aux, $datos[$i]["facfecvenci"])
                ->setCellValue ('H'.$aux, '$'.number_format($datos[$i]["facsubtotal"]))
                ->setCellValue ('I'.$aux, '$'.number_format($datos[$i]["facdescuento"]))
                ->setCellValue ('J'.$aux, '$'.number_format($datos[$i]["faciva"]))
                ->setCellValue ('K'.$aux, '$'.number_format($datos[$i]["factotal"]))
                ->setCellValue ('L'.$aux, $datos[$i]["facestado"]);

        if ($datos[$i]['facestado'] == 'Finalizado') {
          $total_facturado = $total_facturado + $datos[$i]["factotal"];
          $total_descontado = $total_descontado + $datos[$i]["facdescuento"];
          $total_subtotal = $total_subtotal + $datos[$i]["facsubtotal"];
          $total_iva = $total_iva + $datos[$i]["faciva"];
        }
        $objPHPExcel->setActiveSheetIndex(0)->setSharedStyle($styleCentrar, "A".$aux.":"."L".$aux);
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
              ->setCellValue ('H'.$row, '$'.number_format($total_subtotal))
              ->setCellValue ('I'.$row, '$'.number_format($total_descontado))
              ->setCellValue ('J'.$row, '$'.number_format($total_iva))
              ->setCellValue ('K'.$row, '$'.number_format($total_facturado))
              ->setCellValue ('L'.$row,'');

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
      $hoja->setSharedStyle($styleCentrar, 'A'.$row.":".'L'.$row);
      $hoja->setSharedStyle($styleCuerpo, "A".$row.":"."L".$row);
      $hoja->setSharedStyle($stylePie, 'A'.$row.":".'L'.$row);
      $fecha = date('Y-m-d-h-s');
      header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      header('Content-Disposition: attachment;filename="facturas'.$fecha.'.xlsx"');
      header('Cache-Control: max-age=0');
      $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
      $objWriter->save('php://output');
      return true;
    }

}
