<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

if(!function_exists('obtener_codigo_glotipos'))
{
 function obtener_codigo_glotipos($clave, $grupo)
 {
   $ci =& get_instance();
   $ci->db->select('tipcodigo');
   $ci->db->select('tipdetalle');
   $ci->db->select('tipabreviatura');
   $ci->db->from('glotipos');
   $ci->db->where('tipclave', $clave);
   $ci->db->where('tipgrupo', $grupo);
   $ci->db->where('tipactivo', 'S');
   $result = $ci->db->get();
   return $result->result_array();
 }
}

if(!function_exists('obtener_codigo_parametro'))
{
 function obtener_codigo_parametro($nombre)
 {
   $ci =& get_instance();
   $ci->db->select('parcodigo');
   $ci->db->select('parvalor');
   $ci->db->from('gloparametros');
   $ci->db->where('parnombre', $nombre);
   $ci->db->where('paractivo', 'S');
   $result = $ci->db->get();
   return $result->result_array();   
 }
}
