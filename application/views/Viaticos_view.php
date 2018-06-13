<?php
$rol_user = $this->session->userdata('rol');
$display = "";
if ($rol_user == "Vendedor") {
  $display = "none";
}
?>
<title><?php echo $titulo; ?></title>
<link rel="stylesheet" href="<?php echo base_url(); ?>css/ocultar_codigo.css">
<div class="col-xs-12 col-sm-12 col-md-10" id="panelHome" name="cuerpo">
  <div class="panel panel-success">
    <div class="panel-heading">
      <h3 class="panel-title"><?php echo $titulo; ?></h3>
    </div>
    <div style="clear: both"></div>
    <div id="estudiantes" class="tab-pane fade in active">
      <div class="panel-body" autoCal="true" formulacal="height-100">
        <div class="row">
          <form id="formFamilia" name="formFamilia">
                <div class="form-group col-xs-12 col-sm-4 col-md-2" id="registrar" name="registrar">
                  <button type="button" class="btn btn-default btn-sm btn-primary" name="btnSaveFamilia" title="Registrar <?php echo $titulo; ?>">
                  <span class="glyphicon glyphicon-plus"></span>&nbsp;&nbsp;Registrar
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
                <th style="width: 90px; display: <?php echo $display; ?>">Acciones</th>
                <th id="codigo">Codigo</th>
                <th>Identificación</th>
                <th>Nombre</th>
                <th>Proveedor</th>
                <th>Tipo</th>
                <th>Factura</th>
                <th>Subtotal</th>
                <th>Iva</th>
                <th>Reteiva</th>
                <th>Reteica</th>
                <th>Retefeuente</th>
                <th>Total</th>
                <th>Fecha</th>
                <th>Observación</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody name="listar_viaticos">
              <!-- Contenido de la tabla es cargado por medio de jQuery -->
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Inicio Modal Registro Viatico -->
    <div class="modal fade" id="modal" tabindex="-1" role="dialog" name="modalViaticos" data-backdrop="static" data-keyboard="true">
      <div class="modal-dialog" id="cuerpo" role="document">
        <div class="modal-content" id="newCliente">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span name="btn-warning" aria-hidden="true">&times;</span></button>
            <h4 class="modal-title"><center>Registrar <?php echo $titulo; ?></h4>
          </div>
          <div class="modal-body">
            <form name="formSaveViatico" id="formSaveViatico">
              <input type="hidden" name="tipo" value="1">
              <input type="hidden" name="codigo_viatico">
              <input type="hidden" name="tipo_registro" value="<?php echo $grupo; ?>">
              <hr id="hr" name="hr">
              <div class="form-group">
                <div class="row" id="vendedor">
                  <div class="col-xs-12">
                    <label for="Vendedor">Vendedor :<span class="required"> *</span></label>
                    <span class="icon icon-notification" style="font-size: 18px;" onmouseover="mostrarAyuda('Ingrese el nombre o el número de documento del vendedor.')"></span>
                    <input class="form-control" type="text" name="vendedor" id="vendedor" placeholder="Vendedor">
                    <input class="form-control" type="hidden" name="vendedor-id" id="vendedor-id" placeholder="Vendedor">
                  </div>
                </div> <br>
                  <div class="row">
                    <div class="col-xs-12">
                      <label for="proveedor">Proveedor :<span class="required"> *</span></label>
                      <select class="form-control" name="proveedor">
                        <option value="">Seleccione</option>
                      </select>
                    </div>
                  </div> <br>
                  <div class="row">
                    <div class="col-xs-12">
                      <label for="tipo_viatico">Tipo :<span class="required"> *</span></label>
                      <select class="form-control" name="tipo_viatico">
                        <option value="">Seleccione</option>
                      </select>
                    </div>
                  </div> <br>
                  <div class="row">
                    <div class="col-xs-12">
                      <label for="fecha">Fecha :</label>
                      <span class="icon icon-notification" style="font-size: 18px;" onmouseover="mostrarAyuda('Si no especifica una fecha se tomara la actual.')"></span>
                      <input id="fecha" class="form-control" type="text" name="fecha">
                    </div>
                  </div> <br>
                  <div class="row">
                    <div class="col-xs-3">
                      <label for="iva">Iva :</label>
                      <input type="text" id="iva" maxlength="30" class="form-control" name="iva" placeholder="Iva">
                    </div>
                    <div class="col-xs-3">
                      <label for="reteiva">Reteiva :</label>
                      <input type="text" id="reteiva" maxlength="30" class="form-control" name="reteiva" placeholder="Reteiva">
                    </div>
                    <div class="col-xs-3">
                      <label for="reteica">Reteica :</label>
                      <input type="text" id="reteica" maxlength="30" class="form-control" name="reteica" placeholder="Reteica">
                    </div>
                    <div class="col-xs-3">
                      <label for="retefuente">Retefuente :</label>
                      <input type="text" id="retefuente" maxlength="30" class="form-control" name="retefuente" placeholder="Retefuente">
                    </div>
                  </div><br>
                  <div class="row">
                    <div class="col-xs-6">
                      <label for="subtotal">Subtotal :</label>
                      <input type="text" id="subtotal" maxlength="30" class="form-control" name="subtotal" placeholder="Subtotal">
                    </div>
                    <div class="col-xs-6">
                      <label for="factura">Factura :<span class="required"> *</span></label>
                      <span class="icon icon-notification" style="font-size: 18px;" onmouseover="mostrarAyuda('Si no cuenta con una factura coloque el número cero (0).')"></span>
                      <input type="text" id="factura" maxlength="30" class="form-control" name="factura" placeholder="Factura">
                    </div>
                  </div><br>
                  <div class="row">
                    <div class="col-xs-12">
                      <label for="total">Total :<span class="required"> *</span></label>
                      <input type="text" id="total" maxlength="30" class="form-control" name="total" placeholder="Total">
                    </div>
                  </div></br>
                  <div class="row">
                    <div class="col-xs-12">
                      <label for="observacion">Observaciones :</label>
                      <span class="icon icon-notification" style="font-size: 18px;" onmouseover="mostrarAyuda('En caso de que el tipo de viatico sea Otro especifiquelo en la observacion.')"></span>
                      <textarea class="form-control" name="observacion" rows="3" cols="80" id="observacion" placeholder="Observaciones"></textarea>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          <div class="modal-footer">
            <center>
              <button type="button" class="btn btn-danger" data-dismiss="modal" aria-label="Close" name="btn-warning">Cancelar</button>
              <button type="button" class="btn btn-primary" id="btnSavingViatico" name="btnSavingViatico"  >Registrar</button>
            </center>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Fin Modal Viatico -->
    <script type="text/javascript">
        $.getScript('<?php echo base_url(); ?>js/viaticos.js');
        titulo = $.parseJSON('<?php echo json_encode($titulo); ?>')
    </script>
 
 
