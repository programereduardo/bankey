<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

if(!function_exists('contar_facturas'))
{
 function contar_facturas()
 {
   $ci =& get_instance();
   $year = date('Y');
   $mivar = $year.'-01-01';
   $fecha = new DateTime($mivar);
   $year = $fecha->format('Y-m-d');   
   $sql = "SELECT COUNT(facnumero) as cantidad_facturas,
                  SUM(factotal) AS total_historico,
                  SUM(facdescuento) as descuento_historico,
                  SUM(faciva) as iva_historico
           FROM contabilidad.confacturas
           WHERE facestado = 'A'
           AND facfecent >= '".$year."'
           ";

   $result = $ci->db->query($sql);
   return $result->result_array();
 }
}
