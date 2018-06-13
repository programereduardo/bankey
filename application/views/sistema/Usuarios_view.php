<style type="text/css">
  .required{
    color: red;
  }
</style> 


<title>Bankey 1.0 | Usuarios</title>
<link rel="stylesheet" href="<?php echo base_url(); ?>css/ocultar_codigo.css">
<div class="col-xs-12 col-sm-12 col-md-10" id="panelHome" name="cuerpo">
  <div class="panel panel-success">
    <div class="panel-heading">
      <h3 class="panel-title">Usuarios</h3> 
    </div>
    <div style="clear: both"></div>

     <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper" style="width: 94%">
    <!-- Content Header (Page header) -->
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1>Usuarios</h1>
          </div>
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><a href="inicio">Home</a></li>
              <li class="breadcrumb-item active">Control de Usuarios</li>
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
          <h3 class="card-title">Usuarios</h3>

          <div class="card-tools">
            <button type="button" class="btn btn-tool" data-widget="collapse" data-toggle="tooltip" title="Collapse">
              <i class="fa fa-minus"></i></button>
            <button type="button" class="btn btn-tool" data-widget="remove" data-toggle="tooltip" title="Remove">
              <i class="fa fa-times"></i></button>
          </div>
        </div>
        <div class="card-body" style="margin-bottom: : -270px">
          <div class="row">
            <form id="formDocumentos" name="formDocumentos">
                  <div class="form-group col-xs-12 col-sm-4 col-md-2" id="registrar" name="registrar">
                    <button type="button" class="btn btn-default btn-sm btn-primary" name="btnSaveDocumentos" title="Registrar cliente">
                    <span class="glyphicon glyphicon-plus"></span>&nbsp;&nbsp;Registrar
                    </button>
                  </div>
                  <div class="input-group" id="busqueda" name="busqueda" style="padding-right: 15px; padding-left: 15px">
                  <input id="searchTerm" onkeyup="doSearch()" style="margin-left: 94px;margin-top: -46px;margin-bottom: 9px;" type="text" class="form-control" placeholder="Busqueda rapida....">
                  <span class="input-group-addon"><span class="glyphicon glyphicon-search"></span></span>
                </div>
            </form>
          </div>

          <?php
            $id = "";
            if ($this->session->userdata('rol') !== "Administrador") {
              $id = "codigo";
            }
          ?>
          <div class="content" autoCal="true" formulaCal="height-180" style="height: 500px; overflow: auto;">
            <table class="table table-hover"  id="datos">
              <thead>
                <tr class="info">
                  <th id="<?php echo $id; ?>" style="width: 90px">Acciones</th>
                  <th id="codigo">Codigo</th>
                  <th style="width: 300px;">Nombres</th>
                  <th style="width: 300px;">Usuario</th>
                  <th style="width: 200px">Rol</th>
                  <th>Tipo de Usuario</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody name="listado_usuarios">
                <!-- Contenido de la tabla es cargado por medio de jQuery -->
              </tbody>
            </table>
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



    <!-- Inicio Modal Registro Documentos -->
    <div class="modal fade" id="modal" tabindex="-1" role="dialog" name="modalUsuarios" data-backdrop="static" data-keyboard="true">
      <div class="modal-dialog" id="cuerpo" role="document">
        <div class="modal-content" id="newCliente">
          <div class="modal-header">
            <h4 class="modal-title"><center>Registrar Usuario</h4>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span name="btn-warning" aria-hidden="true">&times;</span></button>
          </div>
          <div class="modal-body">
            <form name="formUsuario" id="formUsuario">
              <hr id="hr" name="hr">
              <div class="form-group">
                  <div class="row">
                    <div class="col-xs-0">
                      <input type="hidden" value="1" name="tipo">
                      <input type="hidden" name="codigo_user">
                    </div>
                    <div class="col-xs-12">
                      <label for="usuario">Usuario :<span class="required"> *</span></label>
                      <input type="text" id="usuario" minlength="4" class="form-control" name="usuario" placeholder="Usuario">
                    </div>
                  </div><br>
                  <div class="row" id="status">
                    <div class="col-xs-12">
                      <label for="estado">Estado :<span class="required"> *</span></label>
                      <select class="form-control" id="estado" name="estado">
                        <option value="">Seleccione</option>
                        <option value="1">Activo</option>
                        <option value="2">Inactivo</option>
                      </select>
                    </div>
                  </div></br>
                  <!--
                  <div class="row" id="actual">
                    <div class="col-xs-9">
                      <label for="password">Contraseña Actual :<span class="required"> *</span></label>
                      <input type="password" id="password" class="form-control" name="password" placeholder="Contraseña Actual">
                    </div>
                  </div><br>
                  -->
                  <div class="row">
                    <div class="col-xs-9">
                      <label for="new_password">Nueva Contraseña :<span class="required"> *</span></label>
                      <input type="password" id="new_password" class="form-control" name="new_password" placeholder="Nueva Contraseña">
                    </div>
                  </div><br>
                  <div class="row">
                    <div class="col-xs-9">
                      <label for="confirmacion">Confirme Nueva Contraseña :<span class="required"> *</span></label>
                      <input type="password" id="confirmacion" class="form-control" name="confirmacion" placeholder="Confirme Nueva Contraseña">
                    </div>
                  </div><br>
                  <div class="row">
                    <div class="col-xs-12">
                      <label for="rol">Rol :<span class="required"> *</span></label>
                      <select class="form-control" id="rol" name="rol">
                        <option value="0">Seleccione</option>
                      </select>
                    </div>
                  </div></br>
                </div>
              </form>
            </div>
          <div class="modal-footer">
            <center>
              <button type="button" class="btn btn-danger" data-dismiss="modal" aria-label="Close" name="btn-warning">Cancelar</button>
              <button type="button" class="btn btn-primary" id="btnSavingUsuario" name="btnSavingUsuario"  >Registrar</button>
            </center>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  <!-- Fin Modal Documentos -->


    <script type="text/javascript">
        $.getScript('<?php echo base_url(); ?>js/sistema/usuarios.js');
        acciones = $.parseJSON('<?php echo json_encode($acciones); ?>');
        user_rol = $.parseJSON('<?php echo json_encode($this->session->userdata('rol')); ?>');
    </script>
