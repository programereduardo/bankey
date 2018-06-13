<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class reportesViaticos_controller extends CI_controller {
  public function __construct()
  {
    parent::__construct();
    $this->load->model('reportesviaticos_model');
  }
  //Cargando Vistas
  public function index($titulo, $grupo) {
    $resultado = $this->reportesviaticos_model->validar_session();
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
        if ($data['mod_nombre'] == "Reporte viaticos" && $data['acc_descripcion'] == "Ver") {
          $next = true;
        }
      }
      if ($next === true) {
        $parametros = array(
          'titulo' => $titulo,
          'grupo' => $grupo
        );
        $this->load->view('shared/header');
        $this->load->view('shared/menu', $datos);
        $this->load->view('Reportesviaticos_view', $parametros);
        $this->load->view('shared/footer');
      } else {
        header("Location: inicio");
      }
    }
  }

  public function viaticos()
  {
    $this->index('Viaticos', 'TIPVIA');
  }

  public function gastos()
  {
    $this->index('Gastos', 'TIPGAS');
  }

  public function listar_viaticos()
  {
    $grupo = $this->input->post('grupo');
    $result = $this->reportesviaticos_model->listar_viaticos($grupo);

    $success = false;
    $cantidad = count($result);
    if ($cantidad > 0) {
      for ($i=0; $i < count($result); $i++) {
        if ($result[$i]['tertipogrupo'] == "2") {
          $result[$i]['ternombre'] = $result[$i]['ternom1'].' '.$result[$i]['ternom2'].' '.$result[$i]['terape1'].' '.$result[$i]['terape2'];
        }
        if ($result[$i]['gasestado'] == 'E') {
          $result[$i]['gasestado'] = 'En revisión';
        }
        if ($result[$i]['gasestado'] == 'N') {
          $result[$i]['gasestado'] = 'Anulado';
        }
        if ($result[$i]['gasestado'] == 'F') {
          $result[$i]['gasestado'] = 'Finalizado';
        }
        if ($result[$i]['gasobservacion'] == '') {
          $result[$i]['gasobservacion'] = 'Información no suministrada.';
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
    $result = $this->reportesviaticos_model->busqueda($data);
    $success = false;
    if (count($result) > 0) {
      for ($i=0; $i < count($result); $i++) {
        if ($result[$i]['tertipogrupo'] == "2") {
          $result[$i]['ternombre'] = $result[$i]['ternom1'].' '.$result[$i]['ternom2'].' '.$result[$i]['terape1'].' '.$result[$i]['terape2'];
        }
        if ($result[$i]['gasestado'] == 'E') {
          $result[$i]['gasestado'] = 'En revisión';
        }
        if ($result[$i]['gasestado'] == 'N') {
          $result[$i]['gasestado'] = 'Anulado';
        }
        if ($result[$i]['gasestado'] == 'F') {
          $result[$i]['gasestado'] = 'Finalizado';
        }
        if ($result[$i]['gasobservacion'] == '') {
          $result[$i]['gasobservacion'] = 'Información no suministrada.';
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
    //$datos = $this->reportesCartera_model->cargar_facturas(false);
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

    $objPHPExcel->setActiveSheetIndex(0)->setSharedStyle($styleCabecera, "A1:O1");
    $objPHPExcel->setActiveSheetIndex(0)
            ->setCellValue ('A1','ID')
            ->setCellValue ('B1','Identificación')
            ->setCellValue ('C1','Nombre')
            ->setCellValue ('D1','Proveedor')
            ->setCellValue ('E1','Tipo')
            ->setCellValue ('F1','Factura')
            ->setCellValue ('G1','Subtotal')
            ->setCellValue ('H1','Iva')
            ->setCellValue ('I1','Reteiva')
            ->setCellValue ('J1','Reteica')
            ->setCellValue ('K1','Retefuente')
            ->setCellValue ('L1','Total')
            ->setCellValue ('M1','Fecha')
            ->setCellValue ('N1','observación')
            ->setCellValue ('O1','Estado');

    $total_total = 0;
    $total_subtotal = 0;
    $total_iva = 0;
    $total_reteiva = 0;
    $total_reteica = 0;
    $total_retefuente = 0;
    for ($i=0; $i < count($datos) ; $i++) {
      $aux = $i + 2;
      $objPHPExcel->setActiveSheetIndex(0)->setSharedStyle($styleCuerpo, "A".$aux.":"."O".$aux);
      $objPHPExcel->setActiveSheetIndex(0)
              ->setCellValue ('A'.$aux, $i+1)
              ->setCellValue ('B'.$aux, $datos[$i]["terdocnum"])
              ->setCellValue ('C'.$aux, $datos[$i]["ternombre"])
              ->setCellValue ('D'.$aux, $datos[$i]["nombre_proveedor"])
              ->setCellValue ('E'.$aux, $datos[$i]["tipdetalle"])
              ->setCellValue ('F'.$aux, $datos[$i]["gasfactura"])
              ->setCellValue ('G'.$aux, '$'.number_format($datos[$i]["gassubtotal"]))
              ->setCellValue ('H'.$aux, '$'.number_format($datos[$i]["gasiva"]))
              ->setCellValue ('I'.$aux, '$'.number_format($datos[$i]["gasreteiva"]))
              ->setCellValue ('J'.$aux, '$'.number_format($datos[$i]["gasreteica"]))
              ->setCellValue ('K'.$aux, '$'.number_format($datos[$i]["gasretefuente"]))
              ->setCellValue ('L'.$aux, '$'.number_format($datos[$i]["gastotal"]))
              ->setCellValue ('M'.$aux, $datos[$i]["gasfecha"])
              ->setCellValue ('N'.$aux, $datos[$i]["gasobservacion"])
              ->setCellValue ('O'.$aux, $datos[$i]["gasestado"]);

              $total_total = $total_total + $datos[$i]["gastotal"];
              $total_iva = $total_iva + $datos[$i]['gasiva'];
              $total_reteiva = $total_reteiva + $datos[$i]['gasreteiva'];
              $total_reteica = $total_reteica + $datos[$i]['gasreteica'];
              $total_retefuente = $total_retefuente + $datos[$i]['gasretefuente'];
              $total_subtotal = $total_subtotal + $datos[$i]['gasretefuente'];


      $objPHPExcel->setActiveSheetIndex(0)->setSharedStyle($styleCentrar, "A".$aux.":"."O".$aux);
      $objPHPExcel->setActiveSheetIndex(0)->setSharedStyle($styleCentrar, "A".$aux.":"."O".$aux);
    }
  $row = $aux + 1;
  $hoja->setSharedStyle($styleCentrar, 'A'.$row.":".'O'.$row);
  $objPHPExcel->setActiveSheetIndex(0)
          ->setCellValue ('A'.$row,'TOTAL')
          ->setCellValue ('B'.$row,'')
          ->setCellValue ('C'.$row,'')
          ->setCellValue ('D'.$row,'')
          ->setCellValue ('E'.$row,'')
          ->setCellValue ('F'.$row,'')
          ->setCellValue ('G'.$row,'$'.number_format($total_subtotal))
          ->setCellValue ('H'.$row,'$'.number_format($total_iva))
          ->setCellValue ('I'.$row,'$'.number_format($total_reteiva))
          ->setCellValue ('J'.$row,'$'.number_format($total_reteica))
          ->setCellValue ('K'.$row,'$'.number_format($total_retefuente))
          ->setCellValue ('L'.$row,'$'.number_format($total_total))
          ->setCellValue ('M'.$row,'')
          ->setCellValue ('N'.$row,'')
          ->setCellValue ('O'.$row,'');

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

    $hoja->mergeCells('A'.$row.":".'F'.$row);
    $hoja->setSharedStyle($styleCentrar, 'A'.$row.":".'O'.$row);
    $hoja->setSharedStyle($styleCuerpo, "A".$row.":"."O".$row);
    $hoja->setSharedStyle($stylePie, 'A'.$row.":".'O'.$row);

    $fecha = date('Y-m-d-h-s');
    header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    header('Content-Disposition: attachment;filename="viaticos'.$fecha.'.xlsx"');
    header('Cache-Control: max-age=0');
    $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
    $objWriter->save('php://output');
    return true;
  }

  public function obtener_viaticos_combo()
  {
    $dt = $this->input->post('grupo');
    $data = $this->reportesviaticos_model->obtener_viaticos_combo($dt);
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
