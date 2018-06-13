<style type="text/css">
  .required{
    color: red;
  }
</style> 
<title>Bankey 1.0 | Roles</title>
<link rel="stylesheet" href="<?php echo base_url(); ?>css/ocultar_codigo.css">
<link rel="stylesheet" href="<?php echo base_url(); ?>css/sistema/modal_sistema.css">

 <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1>Roles</h1>
          </div>
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><a href="home">Home</a></li>
              <li class="breadcrumb-item active">Roles</li>
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
          <h3 class="card-title">Roles</h3>

          <div class="card-tools">
            <button type="button" class="btn btn-tool" data-widget="collapse" data-toggle="tooltip" title="Collapse">
              <i class="fa fa-minus"></i></button>
            <button type="button" class="btn btn-tool" data-widget="remove" data-toggle="tooltip" title="Remove">
              <i class="fa fa-times"></i></button>
          </div>
        </div>
        <div class="card-body">
          <div class="row">
          <form id="formDocumentos" name="formDocumentos">
                <div class="form-group col-xs-12 col-sm-4 col-md-2" id="registrar" name="registrar">
                  <button type="button" class="btn btn-default btn-sm btn-primary" name="btnSaveDocumentos" title="Registrar cliente">
                  <span class="glyphicon glyphicon-plus"></span>&nbsp;&nbsp;Registrar
                  </button>
                </div>
                <div class="input-group" id="busqueda" name="busqueda" style="padding-right: 15px; padding-left: 15px">
                <input id="searchTerm" onkeyup="doSearch()" style="margin-left: 82px;margin-top: -46px;margin-bottom: 29px;" type="text" class="form-control" placeholder="Busqueda rapida....">
                <span class="input-group-addon"><span class="glyphicon glyphicon-search"></span></span>
              </div>
          </form>
        </div>
        <div class="content" autoCal="true" formulaCal="height-180" style="height: 500px; overflow: auto;">
          <table class="table table-hover"  id="datos">
            <thead>
              <tr class="info">
                <th style="width: 90px">Acciones</th>
                <th id="codigo">Codigo</th>
                <th style="width: 300px;">Nombre</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody name="listado_roles">
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


    <!-- Modal roles -->
    <div class="modal fade" id="modal" tabindex="-1" role="dialog" name="modalRoles" data-backdrop="static" data-keyboard="true">
      <div class="modal-dialog" id="cuerpo" role="document">
        <div class="modal-content" id="newCliente">
          <div class="modal-header">
            <h4 class="modal-title"><center>Registrar Rol</h4>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span name="btn-warning" aria-hidden="true">&times;</span></button>
          </div>
          <div class="modal-body">
            <form name="formRoles" id="formRoles">
              <hr id="hr" name="hr">
              <div class="form-group">
                  <div class="row">
                    <div class="col-xs-0">
                      <input type="hidden" value="1" name="tipo">
                      <input type="hidden" name="codigo_rol">
                    </div>
                    <div class="col-xs-12">
                      <label for="rol">Nombre del Rol :<span class="required"> *</span></label>
                      <input type="text" id="rol" minlength="4" class="form-control" name="rol" placeholder="Nombre del rol">
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
                </div>
              </form>
            </div>
          <div class="modal-footer">
            <center>
              <button type="button" class="btn btn-danger" data-dismiss="modal" aria-label="Close" name="btn-warning">Cancelar</button>
              <button type="button" class="btn btn-primary" id="btnSavingRol" name="btnSavingRol"  >Registrar</button>
            </center>
          </div>
        </div>
      </div>
    </div>
    <!-- Fin modal roles -->

    <!-- Modal listar modulos -->
    <div class="modal fade" id="modalModulos" tabindex="-1" role="dialog" name="modalModulos" data-backdrop="static" data-keyboard="true">
      <div class="modal-dialog" id="cuerpo" role="document">
        <div class="modal-content" id="newCliente">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span name="cerrar_ubicaciones" aria-hidden="true">&times;</span></button>
            <h4 class="modal-title"><center>Modulos</center></h4>
          </div>
          <div class="modal-body">
            <div id="estudiantes" class="tab-pane fade in active">
              <div class="panel-body" autoCal="true" formulacal="height-100">
                <p id="nombre_rol">Nombre Rol</p>
                <div class="row">
                  <form class="noprint" id="form_per_aca">
                        <div class="form-group col-xs-12 col-sm-4 col-md-2" name="registrar_modulo">
                          <button type="button" class="btn btn-default btn-sm btn-primary" id="registrar" name="btnAgrModulo" title="Registrar ubicacion">
                          <span class="glyphicon glyphicon-plus"></span>&nbsp;&nbsp;Agregar
                          </button>
                        </div>
                        <div class="input-group" id="busqueda" name="busqueda" style="padding-right: 15px; padding-left: 15px">
                        <input id="searchTerm" onkeyup="doSearch()" type="text" class="form-control" placeholder="Busqueda rapida....">
                        <span class="input-group-addon"><span class="glyphicon glyphicon-search"></span></span>
                      </div>
                  </form>
                </div>
                <br/>
                <div class="content" autoCal="true" formulaCal="height-180" style="height: 500px; overflow: auto;">
                  <table class="table table-hover"  id="datos">
                    <thead>
                      <tr class="info">
                        <th style="width: 90px">Acciones</th>
                        <th id="codigo">Codigo</th>
                        <th style="width: 200px;">Modulo</th>
                      </tr>
                    </thead>
                    <tbody name="listado_modulos">

                    </tbody>
                  </table>
                </div>
              </div>
              <div class="modal-footer">
                <center>
                </center>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Fin modal listar modulos -->


    <!-- Modal acciones -->
    <div class="modal fade" id="modalAcciones" tabindex="-1" role="dialog" name="modalAcciones" data-backdrop="static" data-keyboard="true">
      <div class="modal-dialog" id="cuerpo" role="document">
        <div class="modal-content" id="newCliente">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span name="cerrar_acciones" aria-hidden="true">&times;</span></button>
            <h4 class="modal-title"><center>Acciones</center></h4>
          </div>
          <div class="modal-body">
            <div id="estudiantes" class="tab-pane fade in active">
              <div class="panel-body" autoCal="true" formulacal="height-100">
                <p id="nombre_modulo">Nombre Modulo</p>
                <div class="row">
                  <form class="noprint" id="form_per_aca">
                        <div class="form-group col-xs-12 col-sm-4 col-md-2" name="registrar_modulo">
                          <button type="button" class="btn btn-default btn-sm btn-primary" id="registrar" name="btnAgr" title="Registrar ubicacion">
                          <span class="glyphicon glyphicon-plus"></span>&nbsp;&nbsp;Agregar
                          </button>
                        </div>
                        <div class="input-group" id="busqueda" name="busqueda" style="padding-right: 15px; padding-left: 15px">
                        <input id="searchTerm" onkeyup="doSearch()" type="text" class="form-control" placeholder="Busqueda rapida....">
                        <span class="input-group-addon"><span class="glyphicon glyphicon-search"></span></span>
                      </div>
                  </form>
                </div>
                <br/>
                <div class="content" autoCal="true" formulaCal="height-180" style="height: 500px; overflow: auto;">
                  <table class="table table-hover"  id="datos">
                    <thead>
                      <tr class="info">
                        <th style="width: 90px">Acciones</th>
                        <th id="codigo">Acción</th>
                        <th style="width: 200px;">Acción</th>
                      </tr>
                    </thead>
                    <tbody name="listado_acciones">

                    </tbody>
                  </table>
                </div>
              </div>
              <div class="modal-footer">
                <center>
                </center>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- fin modal acciones -->
    <!-- Modal agregar modulos -->
    <div class="modal fade" id="" tabindex="-1" role="dialog" name="formularioAgregarModulo" data-backdrop="static" data-keyboard="true">
      <div class="modal-dialog" id="" role="document">
        <div class="modal-content" id="newCliente">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span name="cerrar_agregar_ubi" aria-hidden="true">&times;</span></button>
            <h4 class="modal-title"><center>Registrar Modulo</center></h4>
          </div>
          <div class="modal-body">
            <form name="formModulo" id="formModulo">
              <hr id="hr" name="hr">
              <input type="hidden" name="codigo_modulo">
              <input type="hidden" name="tipo_agregar" value="1">
              <div class="form-group">
                  <div class="row">
                    <div class="col-xs-12" id="modulo">
                      <label for="">Modulo :<span class="required"> *</span></label>
                      <select  id="modulo" class="form-control"  name="modulo">
                        <option value="">No disponible</option>
                      </select>
                    </div>
                  </div>
                </form>
              </div>
              <br>
              <br>
              <div class="modal-footer">
                <center>
                  <button type="button" class="btn btn-danger" data-dismiss="modal" aria-label="Close" name="btnCancelModulo">Cancelar</button>
                  <button type="button" class="btn btn-primary" name="btnGuardarModulo">Registrar</button>
                </center>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Fin modal agregar modulos -->

    <!-- Inicio modal agregar acciones -->
    <div class="modal fade" id="" tabindex="-1" role="dialog" name="modalBarrio" data-backdrop="static" data-keyboard="true">
      <div class="modal-dialog" id="" role="document">
        <div class="modal-content" id="newBarrio">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span name="cerrar_barrio" aria-hidden="true">&times;</span></button>
            <h4 class="modal-title"><center>Registrar Barrio</center></h4>
          </div>
          <div class="modal-body">
            <form name="formBarrio" id="formBarrio">
              <hr id="hr" name="hr">
              <div class="form-group">
                  <div class="row" id="ocultar">
                    <div class="col-xs-6" id="pais">
                      <label for="">Pais :<span class="required"> *</span></label>
                      <select  id="paisB" onchange="obtener_estados()" class="form-control"  name="pais">
                        <option value="">No disponible</option>
                      </select>
                    </div>
                    <div class="col-xs-6" id="estado">
                      <label for="pais">Estado :<span class="required"> *</span></label>
                      <select id="estadoB" class="form-control" onchange="obtener_ciudades()" name="estado">
                        <option value="">No disponible</option>
                      </select>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-xs-6" id="ciudad">
                      <label for="pais">Ciudad :<span class="required"> *</span></label>
                      <select class="form-control" id="ciudadB" name="ciudad">
                        <option value="">No disponible</option>
                      </select>
                      <input type="hidden" id="ciudadBa" name="ciudadBa">
                    </div>
                    <div class="col-xs-6">
                      <label for="nombrebarrio">Nombre del nuevo barrio :<span class="required"> *</span></label>
                      <input type="text" id="nombrebarrio" maxlength="50" class="form-control" name="nombrebarrio" placeholder="Nombre del nuevo barrio">
                    </div>
                  </div></br>
                </form>
              </div>
              <br>
              <br>
              <div class="modal-footer">
                <center>
                  <button type="button" class="btn btn-danger" data-dismiss="modal" aria-label="Close" name="btnCancelBarr">Cancelar</button>
                  <button type="button" class="btn btn-primary" name="btnGuardarBarrio">Registrar</button>
                </center>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Fin modal agregar acciones -->


  </div>
</div>
<script type="text/javascript">
    $.getScript('<?php echo base_url(); ?>js/sistema/roles.js');
    acciones = $.parseJSON('<?php echo json_encode($acciones); ?>');
    user_rol = $.parseJSON('<?php echo json_encode($this->session->userdata('rol')); ?>');
</script>
