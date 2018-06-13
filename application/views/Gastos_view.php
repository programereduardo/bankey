<title>Gastos</title>
<!--<link rel="stylesheet" href="<?php echo base_url(); ?>css/estilo_modal.css">-->
<link rel="stylesheet" href="<?php echo base_url(); ?>css/ocultar_codigo.css">
<div class="col-xs-12 col-sm-12 col-md-10" id="panelHome" name="cuerpo">
  <div class="panel panel-success">
    <div class="panel-heading">
      <h3 class="panel-title">Gastos</h3>
    </div>
    <div style="clear: both"></div>

    <div id="estudiantes" class="tab-pane fade in active">
      <div class="panel-body" autoCal="true" formulacal="height-100">
        <div class="row">
          <form class="noprint" id="form_per_aca">
                <div class="form-group col-xs-12 col-sm-4 col-md-3" name="registrar">
                  <button type="button" class="btn btn-default btn-sm btn-primary" id="registrar" name="btnAgregarCliente" title="Registrar Suscripción">
                  <span class="glyphicon glyphicon-plus"></span>&nbsp;&nbsp;Registrar
                  </button>
                  <!--<button type="button" class="btn btn-default btn-sm btn-success" id="excel" name="btnAgregarCliente" title="Generar Reporte">
                  <span class="glyphicon glyphicon-save-file"></span>&nbsp;&nbsp;Excel
                </button>-->
                  <!--<button type="button" class="btn btn-default btn-sm btn-success" id="usar_suscripcion" name="usar_suscripcion" title="Usar Suscripción">
                  <span class="icon icon-coin-dollar"></span>&nbsp;&nbsp;Usar Suscripción
                </button>-->
                </div>
                <div class="input-group" id="busqueda" name="busqueda" style="padding-right: 15px; padding-left: 15px">
                  <input id="searchTerm" onkeyup="doSearch()" type="text" class="form-control" placeholder="Busqueda rapida....">
                  <span class="input-group-addon"><span class="glyphicon glyphicon-search"></span></span>
                </div>
          </form>
        </div>
        <br/>
        <div class="content" autoCal="true" formulaCal="height-180" style="height: 500px; overflow-y: auto; overflow-x: auto;">
          <table class="table table-hover"  id="datos">
            <thead>
              <tr class="info">
                <th style="width: 90px">Acciones</th>
                <th id="codigo">Codigo</th>
                <th style="width: 700px;">Tipo de Gasto</th>
                <th style="width: 700px;">Fecha</th>
                <th style="width: 300px;">Valor</th>
                <th style="width: 300px;">Estado</th>
              </tr>
            </thead>
            <tbody name="listado_articulos">

            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal registro clientes -->
    <div class="modal fade" id="modal" tabindex="-1" role="dialog" name="modalClientes" data-backdrop="static" data-keyboard="true">
      <div class="modal-dialog" id="cuerpo" role="document">
        <div class="modal-content" id="newCliente">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span name="btn-warning" aria-hidden="true">&times;</span></button>
            <h4 class="modal-title"><center>Registrar Gasto</center></h4>
          </div>
          <div class="modal-body">
            <form name="formAgregarArticulo" id="formAgregarArticulo">
              <hr id="hr" name="hr">
              <input type="hidden" name="tipo" value="1">
              <div class="form-group">
                  <div class="row">
                    <!--<div class="col-xs-12">
                      <label for="cliente">Cliente: <span class="required"> *</span></label>
                      <span class="icon icon-notification" onmouseover="mostrarAyuda('Ingrese el nombre o el número de documento del cliente.')"></span>
                      <input type="text" id="cliente" class="form-control" name="cliente" placeholder="Cliente">
                      <input type="hidden" id="cliente-id" name="cliente-id">
                    </div>-->
                  </div></br>
                  <div class="row">
                    <div class="col-xs-12"  id="tipo_gasto">
                      <label for="tipo_gasto">Tipo de Gasto :<span class="required"> *</span></label>
                      <select class="form-control" name="tipo_gasto">
                        <option value="">Seleccione</option>
                      </select>
                    </div>
                  </div><br>
                  <div class="row">
                    <div class="col-xs-12">
                      <label for="fecha">Fecha :<span class="required"> *</span></label>
                      <input type="text" id="fecha" class="form-control" name="fecha" placeholder="Fecha Inicio">
                    </div>
                  </div><br>
                  <div class="row">
                    <div class="col-xs-12">
                      <label for="valor">Valor :<span class="required"> *</span></label>
                      <input type="text" value="0" id="valor" class="form-control" name="valor" placeholder="Valor">
                    </div>
                  </div><br>
                </form>
              </div>
              <div class="modal-footer">
                <center>
                  <button type="button" class="btn btn-danger" data-dismiss="modal" aria-label="Close" name="btn-warning">Cancelar</button>
                  <button type="button" class="btn btn-primary" name="btnGuardar">Registrar</button>
                </center>
              </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Fin modal registro clientes -->

    <!-- Modal validar pin -->
    <div class="modal fade" id="modalPin" tabindex="-1" role="dialog" name="modalPin" data-backdrop="static" data-keyboard="true">
      <div class="modal-dialog" id="" role="document">
        <div class="modal-content" id="newCliente">
          <div class="modal-header">
            <h4 class="modal-title"><center>Usar Suscripción</center></h4>
          </div>
          <div class="modal-body">
            <form name="formPin" id="formPin">
              <hr id="hr" name="hr">
              <div class="form-group">
                <center>
                  <div class="row">
                    <div class="col-xs-12" id="pin">
                      <center>
                        <label for="numero_documento">Número de identificación :<span class="required"> *</span></label>
                        <input class="form-control" id="numero_documento" type="text" name="numero_documento" placeholder="Número de identificación">
                      </center>
                    </div>
                  </div>
                </center>
                </div>
              </div>
            </form>
              <br>
              <br>
              <div class="modal-footer">
                <center>
                  <button type="button" class="btn btn-danger" data-dismiss="modal" aria-label="Close" name="btnCancelPin">Cancelar</button>
                  <button type="button" class="btn btn-primary" name="btnValidarPin">Continuar</button>
                </center>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Fin modal validar pin -->
</div>
<script type="text/javascript">
    $.getScript('<?php echo base_url(); ?>js/gastos.js');
</script>
