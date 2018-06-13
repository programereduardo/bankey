<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

require_once APPPATH . '/libraries/pdf/tcpdf.php';
class pdf extends TCPDF {
        public function Header() {
                $this->setJPEGQuality(90);

        }
        public function Footer() {
                $this->SetY(-15);
                $this->SetFont('courier', 'I', 8);
                $this->Cell(0, 10, 'Syntax Company', 0, false, 'C');
        }
        public function CreateTextBox($textval, $x = 0, $y, $width = 0, $height = 10, $fontsize = 10, $fontstyle = '', $align = 'L') {
                $this->SetXY($x+20, $y); // 20 = margin left
                $this->SetFont(PDF_FONT_NAME_MAIN, $fontstyle, $fontsize);
                //$this->Cell($width, $height, $textval, 0, false, $align);
                return $this->MultiCell($width, $height, $textval, $border = 0, $align, $fill = 0, $ln = 1, $x = '', $y = '', $reseth = true, $stretch = 0, $ishtml = false, $autopadding = true, $maxh = 0);
        }
}
