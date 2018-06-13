<style type="text/css">
  .required{
    color: red;
  }
</style>  

<title>Bankey 1.0 | Home</title>
<?php
  $disabled = '';
  $display = '';
  if ($titulo == 'Vendedores') {
    $disabled = 'disabled';
    $display = 'codigo';
  }
?>  
<!DOCTYPE html>
<html>
<head>
  
<link rel="stylesheet" href="<?php echo base_url(); ?>css/ocultar_codigo.css">

</head>
<body>

<!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper" style="min-height: 792px">
    <!-- Content Header (Page header) -->
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0 text-dark">Clientes</h1>
          </div><!-- /.col -->
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><a href="#">Home</a></li>
              <li class="breadcrumb-item active">Clientes</li>
            </ol>
          </div><!-- /.col -->
        </div><!-- /.row -->
      </div><!-- /.container-fluid -->
    </div>
    <!-- /.content-header -->

    <!-- Main content -->
    <div class="content">
      <div class="container-fluid">
        <div class="row">
          
          <!-- /.col-md-6 -->
          <div class="col-lg-12">
            
 
        <p id="total_terceros"><strong>Total de <?php echo $titulo; ?>: </strong></p><br>
        <div class="row">
          <form class="noprint" id="form_per_aca">
            <input type="hidden" name="parametro" value="<?php echo $tipo; ?>">
            <input type="hidden" name="titulo" value="<?php echo $titulo; ?>">
            <input type="hidden" name="accMod" value="<?php echo $accMod; ?>">
            <input type="hidden" name="tip" value="CLI">
            
            <div class="form-group col-lg-4 " name="registrar">
              <button type="button" class="btn btn-default btn-sm btn-primary"  id="registrar" name="btnAgregarCliente" title="Registrar cliente">
                <span class="glyphicon glyphicon-plus"></span>&nbsp;&nbsp;Registrar
              </button>
              
            </div>
            <div class="input-group" id="busqueda" name="busqueda" >
              <input id="searchTerm" onkeyup="doSearch()" type="text" class="form-control" placeholder="Busqueda rapida...." style="margin-top: -52px;margin-left: 122px;margin-bottom: 14px;">
              <span class="input-group-addon"><span class="glyphicon glyphicon-search"></span></span>
            </div>
          </form>
        </div>
        <br/>
        <div class="content" autoCal="true" formulaCal="height-220" style="height: 500px; overflow-x: auto; overflow-y: auto;">
          <div class="table-responsive">
            <table class="table table-hover"  id="datos">
              <thead>
                <tr class="info">
                  <th style="width: 90px">Acciones</th>
                  <th id="codigo">Codigo</th>
                  <th>Identificación</th>
                  <th>Nombre</th>
                  <th>Dirección Residencia</th>
                  <th>Lugar de Trabajo</th>
                  <th>Correo</th>
                  <th>Telefono</th>
                  <th>Celular</th>
                  </tr>
              </thead>
              <tbody name="listado_clientes">

              </tbody>
            </table>
          </div>
        </div>

        <!-- Modal registro clientes -->
    <div class="modal fade" id="modal" tabindex="-1" role="dialog" name="modalClientes" data-backdrop="static" data-keyboard="true">
      <div class="modal-dialog" id="cuerpo" role="document">
        <div class="modal-content" id="newCliente" >
          <div class="modal-header">
            <h4 class="modal-title"><center>Registrar Cliente</center></h4>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span name="btn-warning" aria-hidden="true">&times;</span></button>
          </div>
          <div class="modal-body">
            <form name="formAgregarCliente" id="formAgregarCliente">
              <hr id="hr" name="hr">
              <input type="hidden" name="codigo_cliente">
              <input type="hidden" name="controlador" value="terceros_controller">
              <input type="hidden" name="tipo" value="1">
              <input type="hidden" name="tip" value="<?php echo $tip; ?>">
              <div class="form-group">
                
                    <div class="form-group" >
                      <label for="numero_documento">Número de documento :<span class="required"> *</span></label>
                      <input type="number" id="nit" maxlength="50" class="form-control" onkeyup="aMayusculas(this.value,this.id)" name="numero_documento" placeholder="Número de documento">
                    </div>
                
                 
                    <div class="form-group">
                      <label for="nombre1" id="label1">Primer nombre :<span id="quitar1" class="required"> *</span></label>
                      <input type="text" id="nombre1" maxlength="50" class="form-control" name="nombre1" placeholder="Primer Nombre">
                    </div>
                  <div class="col-lg-4"></div>
                    <div class="form-group">
                        <label for="nombre2">Segundo nombre :<span class=""></span></label>
                        <input type="text" id="nombre2" maxlength="50" class="form-control" name="nombre2" placeholder="Segundo Nombre">
                    </div>
                    <div class="form-group">
                      <label for="apellido1" id="label2">Primer apellido :<span id="quitar2" class="required"> *</span></label>
                      <input type="text" id="apellido1" maxlength="50" class="form-control" name="apellido1" placeholder="Primer Apellido">
                    </div>
                    <div class="form-group">
                      <label for="apellido2">Segundo apellido :</label>
                      <input type="text" id="apellido2" maxlength="50" class="form-control" name="apellido2" placeholder="Segundo Apellido">
                    </div>
                 
                    <div class="form-group" id="correo">
                      <label for="correo">Correo :</label>
                      <input type="email" id="correo" maxlength="70" class="form-control" name="correo" placeholder="Correo">
                    </div>

                    <div class="form-group" id="telefono">
                      <label for="telefono">Telefono :</label>
                      <input type="text" id="telefono" maxlength="70" class="form-control" name="telefono" placeholder="telefono">
                    </div>

                    <div class="form-group" id="celular">
                      <label for="celular">Celular :</label>
                      <input type="number" id="celular" maxlength="70" class="form-control" name="celular" placeholder="Numero de Whatsapp">
                    </div>

                    <div class="form-group" id="dir_res">
                      <label for="dir_res">Dirección de Residencia :</label>
                      <input type="text" id="dir_res" maxlength="80" class="form-control" name="dir_res" placeholder="Dirección de Residencia">
                    </div>

                    <div class="form-group" id="dir_trab">
                      <label for="dir_trab">Lugar de Trabajo :</label>
                      <input type="text" id="dir_trab" maxlength="80" class="form-control" name="dir_trab" placeholder="Lugar de Trabajo">
                    </div>
              </div>
                  
                  
                </form>
              </div>
              <div class="modal-footer">
                <div align="center">
                  <button type="button" class="btn btn-danger" data-dismiss="modal" aria-label="Close" name="btn-warning">Cancelar</button>
                  <button type="button" class="btn btn-primary" id="btnGuardar" name="btnGuardar">Registrar</button>
                </div>
              </div>
          </div>
        </div>
      </div>
      
            
          </div>
          <!-- /.col-md-6 -->
        </div>
        <!-- /.row -->
      </div>
      <!-- /.container-fluid -->
    </div>
    <!-- /.content -->
  </div>
  <!-- /.content-wrapper -->






 

<script type="text/javascript">
    $.getScript('<?php echo base_url(); ?>js/terceros.js');
   // $.getScript('<?php echo base_url(); ?>js/responsive_table.js');
   acciones = $.parseJSON('<?php echo json_encode($acciones); ?>');
</script>
