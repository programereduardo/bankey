<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

if(!function_exists('contar'))
{
 function contar($tipo)
 {
   $ci =& get_instance();
   $sql = "SELECT COUNT(tertipo)
           FROM gloterceros
           WHERE tertipo = $tipo
           AND teractivo = 'S'
           GROUP BY (tertipo)";

   $result = $ci->db->query($sql);
   return $result->result_array();
 }
}
