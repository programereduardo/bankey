<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
| -------------------------------------------------------------------------
| URI ROUTING
| -------------------------------------------------------------------------
| This file lets you re-map URI requests to specific controller functions.
|
| Typically there is a one-to-one relationship between a URL string
| and its corresponding controller class/method. The segments in a
| URL normally follow this pattern:
|
|	example.com/class/method/id/
|
| In some instances, however, you may want to remap this relationship
| so that a different class/function is called than the one
| corresponding to the URL.
|
| Please see the user guide for complete details:
|
|	https://codeigniter.com/user_guide/general/routing.html
|
| -------------------------------------------------------------------------
| RESERVED ROUTES
| -------------------------------------------------------------------------
|
| There are three reserved routes:
|
|	$route['default_controller'] = 'welcome';
|
| This route indicates which controller class should be loaded if the
| URI contains no data. In the above example, the "welcome" class
| would be loaded.
|
|	$route['404_override'] = 'errors/page_missing';
|
| This route will tell the Router which controller/method to use if those
| provided in the URL cannot be matched to a valid route.
|
|	$route['translate_uri_dashes'] = FALSE;
|
| This is not exactly a route, but allows you to automatically route
| controller and method names that contain dashes. '-' isn't a valid
| class or method name character, so it requires translation.
| When you set this option to TRUE, it will replace ALL dashes in the
| controller and method URI segments.
|
| Examples:	my-controller/index	-> my_controller/index
|		my-controller/my-method	-> my_controller/my_method
*/
$route['default_controller'] = 'login_controller';
$route['404_override'] = '';
$route['translate_uri_dashes'] = FALSE;
$route['datos'] = 'login_controller/validar_login';
$route['inicio'] = 'home_controller';
$route['articulos'] = 'articulos_controller';
$route['login'] = 'login_controller';
$route['regimen'] = 'tiporegimen_controller';
$route['clientes'] = 'terceros_controller/clientes';
$route['proveedores'] = 'terceros_controller/proveedores';
$route['guardarcliente'] = 'terceros_controller/guardar_clientes';
$route['obtener_clientes'] = 'terceros_controller/listar_clientes';
$route['obtener_ubicacion'] = 'terceros_controller/obtener_ubicacion';
$route['cerrarsesion'] = 'login_controller/cerrar_sesion';
$route['guardarproveedor'] = 'provedores_controller/guardar_proveedores';
$route['familia'] = 'familia_controller';
$route['lineas'] = 'categorias_controller';
$route['tipo_documentos'] = 'tipodocumentos_controller';
$route['tipo_ubicaciones'] = 'tipoubicaciones_controller';
$route['actividades'] = 'actividadese_controller';
$route['marcas'] = 'marcas_controller';
$route['grupos'] = 'grupos_controller';
$route['unidades'] = 'unidades_controller';
$route['vendedores'] = 'terceros_controller/vendedores';
$route['facturacion'] = 'facturacion_controller/facturas';
$route['forma_pago'] = 'formapago_controller';
$route['reportes-facturas'] = 'reportes_controller';
$route['barrios'] = 'barrios_controller';
$route['compras'] = 'compras_controller/compras';
$route['reportes-clientes'] = 'reportescli_controller';
$route['reportes-compras'] = 'reportescompras_controller';
$route['reportes-cartera'] = 'reportescartera_controller';
$route['reportes-cartera-por-edad'] = 'reportescarteraedad_controller';
$route['viaticos'] = 'viaticos_controller/viaticos';
$route['reportes-viaticos'] = 'reportesviaticos_controller/viaticos';
$route['registro-viaticos'] = 'registroviaticos_controller';
$route['control-cliente'] = 'control_controller/clientes';
$route['control-vendedor'] = 'control_controller/vendedores';
$route['reportes-control-clientes'] = 'reportescontrol_controller/clientes';
$route['reportes-control-vendedores'] = 'reportescontrol_controller/vendedores';
$route['reporte-inventario'] = 'reporteinventario_controller';
$route['cotizar'] = 'cotizacion_controller';
$route['tipo-gastos'] = 'tipogasto_controller';
$route['gastos'] = 'viaticos_controller/gastos';
$route['reporte-gastos'] = 'reportesviaticos_controller/gastos';
$route['Creditos'] = 'creditos_controller/creditos';
$route['servicios'] = 'terceros_controller/servicios';
$route['relacion-vendedores'] = 'relvendedores_controller';
$route['cliente-vendedor'] = 'relcli_ven_controller';
$route['liquidar-nomina'] = 'nomina_controller';


//Routes del modulo de sistema
$route['usuarios'] = 'sistema/usuarios_controller';
$route['roles'] = 'sistema/roles_controller';
