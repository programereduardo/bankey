<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class reportesCli_controller extends CI_controller {
  public function __construct()
  {
    parent::__construct();
    $this->load->model('reportescli_model');
  }
  //Cargando Vistas
  public function index() {
    $resultado = $this->reportescli_model->validar_session();
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
      $this->load->view('Reportescli_view');
      $this->load->view('shared/footer');
    }
  }

  public function buscar()
  {
    $retorno = array();
    $this->load->model('terceros_model');
    $data = $this->input->post();    
    $clave = $data['data'];
    $result = $this->terceros_model->obtener_clientes($clave);
    foreach ($result as $datos) {
      $push = true;
      if ($data['tipo'] !== "" && $data['tipo'] !== "NA") {
        if ($data['tipo'] !== $datos['tertipogrupo']) {
          $push = false;
        }
      }
      if ($push === true) {
        if ($data['pais'] !== "" && $data['pais'] !== "NA") {
          if ($data['pais'] !== $datos['pais']) {
            $push = false;
          }
        }
      }
      if ($push === true) {
        if ($data['estado'] !== "" && $data['estado'] !== "NA") {
          if ($data['estado'] !== $datos['dpto']) {
            $push = false;
          }
        }
      }
      if ($push === true) {
        if ($data['ciudad'] !== "" && $data['ciudad'] !== "NA") {
          if ($data['ciudad'] !== $datos['municipio']) {
            $push = false;
          }
        }
      }
      if ($push === true) {
        if ($data['barrio'] !== "" && $data['barrio'] !== "NA") {
          if ($data['barrio'] !== $datos['barrio']) {
            $push = false;
          }
        }
      }
      if ($push === true) {
        array_push($retorno, $datos);
      }
    }
    $success = false;
    if ($data['excel'] === "true") {
      $this->reporte_clientes($retorno);
    } else {
      $success = false;
      if (count($retorno) > 0) {
        $success = true;
      }
      echo json_encode(
        array(
          'success' => $success,
          'data' => $retorno
        )
      );
    }
  }

  public function obtener_nombre_pais()
  {
    $data = $this->input->post('codigo_pais');
    $result = $this->reportescli_model->obtener_nombre_pais($data);
    $success = false;
    if ($result !== '' && $result !== NULL) {
      $success = true;
    }
    echo json_encode(
      array(
        'success' => $success,
        'data' => $result
      )
    );
  }

  public function obtener_nombre_estado()
  {
    $data = $this->input->post('codigo_estado');
    $result = $this->reportescli_model->obtener_nombre_estado($data);
    $success = false;
    $success = false;
    if ($result !== '' && $result !== NULL) {
      $success = true;
    }
    echo json_encode(
      array(
        'success' => $success,
        'data' => $result
      )
    );
  }

  public function obtener_nombre_ciudad()
  {
    $data = $this->input->post('codigo_ciudad');
    $result = $this->reportescli_model->obtener_nombre_ciudad($data);
    $success = false;
    $success = false;
    if ($result !== '' && $result !== NULL) {
      $success = true;
    }
    echo json_encode(
      array(
        'success' => $success,
        'data' => $result
      )
    );
  }


  public function obtener_nombre_barrio()
  {
    $data = $this->input->post('codigo_barrio');
    $result = $this->reportescli_model->obtener_nombre_barrios($data);
    $success = false;
    $success = false;
    if ($result !== '' && $result !== NULL) {
      $success = true;
    }
    echo json_encode(
      array(
        'success' => $success,
        'data' => $result
      )
    );
  }

  public function reporte_clientes($datos)
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

}
