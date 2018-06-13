<style type="text/css">
  .required{
    color: red;
  }
</style> 
<?php $titulo = 'Creditos'; ?>
<title>Bankey 1.0 | <?php echo $titulo ?></title>
<?php
  $disabled = '';
  $display = '';
  if ($titulo == 'Creditos') {
    $disabled = 'disabled';
    $display = 'codigo';
  } 
?>
<link rel="stylesheet" href="<?php echo base_url(); ?>css/estilo_modal.css">
<link rel="stylesheet" href="<?php echo base_url(); ?>css/ocultar_codigo.css">
<link rel="stylesheet" media="screen and (max-width: 1024px)" href="<?php echo base_url(); ?>css/Responsive_table.css">


  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper" >
    <!-- Content Header (Page header) -->
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1>Creditos</h1>
          </div>
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><a href="inicio">Home</a></li>
              <li class="breadcrumb-item active">Creditos</li>
            </ol>
          </div>
        </div>
      </div><!-- /.container-fluid -->
    </section>

    <!-- Main content -->
    <section class="content">

      <!-- Default box -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Información de Creditos</h3>

          <div class="card-tools">
            <button type="button" class="btn btn-tool" data-widget="collapse" data-toggle="tooltip" title="Collapse">
              <i class="fa fa-minus"></i></button>
            <button type="button" class="btn btn-tool" data-widget="remove" data-toggle="tooltip" title="Remove">
              <i class="fa fa-times"></i></button>
          </div>
        </div>
        <div class="card-body">
          <p id="total_terceros"><strong>Total de <?php echo $titulo; ?>: </strong></p><br>
        <div class="row">
          <form class="noprint" id="form_per_aca">
            <input type="hidden" name="parametro" value="<?php echo $tipo; ?>">
            <input type="hidden" name="titulo" value="<?php echo $titulo; ?>">
            <input type="hidden" name="accMod" value="<?php echo $accMod; ?>">
            <div class="form-group col-xs-12 col-sm-4 col-md-2" name="registrar">
              <button type="button" class="btn btn-default btn-sm btn-primary"  id="registrar" name="btnAgregarCliente" title="Registrar cliente">
                <span class="glyphicon glyphicon-plus"></span>&nbsp;&nbsp;Registrar
              </button>
              
            </div>
            <div class="input-group" id="busqueda" name="busqueda" style="margin-top: -48px;margin-bottom: 22px;margin-left: 103px;width: 167px">
              <input id="searchTerm" onkeyup="doSearch()" type="text" class="form-control" placeholder="Busqueda rapida....">
              <span class="input-group-addon"><span class="glyphicon glyphicon-search"></span></span>
            </div>
          </form>
        </div>

        <div class="content" autoCal="true" formulaCal="height-220" style="height: 208px; overflow-x: auto; overflow-y: auto;">
          <div class="table-responsive">
            <table class="table table-hover"  id="datos">
              <thead>
                <tr class="info">
                  <th style="width: 90px">Acciones</th>
                  <th id="codigo">Codigo</th>
                  <th>Nombre Cliente</th>
                  <th>Valor Credito</th>
                  <th>Valor Deuda</th>
                  <th>Fecha de Credito</th>
                  </tr>
              </thead>
              <tbody name="listado_creditos">

              </tbody>
            </table>
          </div>
        </div>

        </div>
        <!-- /.card-body -->
        <div class="card-footer">
          Footer
        </div>
        <!-- /.card-footer-->
      </div>
      <!-- /.card -->

    </section>
    <!-- /.content -->
  </div>
  <!-- /.content-wrapper -->



<!-- Modal creditos clientes -->
    <div class="modal fade" id="modal" tabindex="-1" role="dialog" name="modalCreditos" data-backdrop="static" data-keyboard="true">
      <div class="modal-dialog" id="cuerpo" role="document">
        <div class="modal-content" id="newCliente" style="width: 337px;margin: 8px;">
          <div class="modal-header">
            <h4 class="modal-title"><center>Registrar Credito</center></h4>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span name="btn-warning" aria-hidden="true">&times;</span></button>
          </div>
          <div class="modal-body">
            <form name="formAgregarCredito" id="formAgregarCredito">
              <hr id="hr" name="hr">
              <input type="hidden" name="codigo_credito">
              <input type="hidden" name="controlador" value="creditos_controller">
              <input type="hidden" name="tipo" value="1">
              <input type="hidden" name="tip" value="<?php echo $tip; ?>">
              <div class="form-group">
                
                  
                    <div class="form-group" id="clientediv">
                      <label for="numero_documento" > Nombre de Cliente:<span id="quitar1" class="required"> *</span></label>
                      
                      <select class="form-control" id="cliente" name="cliente">
                        <option value="0">Seleccionar</option>
                      </select>
                    </div>
                
                 
                    <div class="form-group" id="valor_prestado">
                      <label for="valor_prestado" id="valor_prestado">Valor Prestado :<span id="quitar1" class="required"> *</span></label>
                      <input type="number" id="valor_prestado" maxlength="50" class="form-control" name="valor_prestado" placeholder="Valor Prestado">
                    </div>
                    
              </div>
                  
                  
                </form>
              </div>
              <div class="modal-footer">
                <center>
                  <button type="button" class="btn btn-danger" data-dismiss="modal" aria-label="Close" name="btn-warning">Cancelar</button>
                  <button type="button" class="btn btn-primary" id="btnGuardarCredito" name="btnGuardarCredito">Registrar</button>
                </center>
              </div>
          </div>
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



<script type="text/javascript">
    $.getScript('<?php echo base_url(); ?>js/creditos.js');
    $.getScript('<?php echo base_url(); ?>js/responsive_table.js');
</script>
