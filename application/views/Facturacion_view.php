<title>Facturación</title>
<link rel="stylesheet" href="<?php echo base_url(); ?>css/ocultar_codigo.css">
<link rel="stylesheet" href="<?php echo base_url(); ?>css/estilo_modal.css">
<link rel="stylesheet" href="<?php echo base_url(); ?>css/listado_articulos.css">
<link rel="stylesheet" media="screen and (max-width: 1024px)" href="<?php echo base_url(); ?>css/Responsive_table.css">
<div class="col-xs-12 col-sm-12 col-md-10" id="panelHome" name="cuerpo">
  <div class="panel panel-success">
    <div class="panel-heading">
      <h3 class="panel-title">Facturación</h3>
    </div>
    <div style="clear: both"></div>

    <div id="estudiantes" class="tab-pane fade in active">
      <div class="panel-body" autoCal="true" formulacal="height-100">
        <div class="row">
          <div class="col-xs-12">
            <p id="total_facturas"><strong>Total de facturas : </strong></p>
          </div>
        </div>
        <div class="row">
          <form class="noprint" id="form_per_aca">
            <div class="form-group col-xs-12 col-sm-4 col-md-2" name="registrar">
              <button type="button" class="btn btn-default btn-sm btn-primary" id="registrar" name="btnRegcli" title="Registrar factura">
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
        <div class="content" autoCal="true" formulaCal="height-200" style="height: 500px; overflow: auto;">
          <table class="table table-hover"  id="datos">
            <thead>
              <tr class="info">
                <th style="width: 60px" id="acciones">Acciones</th>
                <th id="codigo">Codigo</th>
                <th id="codigo">Prefijo</th>
                <th style="width: 50px;">N. Factura</th>
                <th >Identificación</th>
                <th>Cliente</th>
                <th>Vendedor</th>
                <th>Fecha Entrada</th>
                <th>Fecha Vencimiento</th>
                <th>Pago Inicial</th>
                <th>Saldo</th>
                <th>Subtotal</th>
                <th>Descuento</th>
                <th>Iva</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody name="listar_facturas">
              <!-- Contenido de la tabla es cargado por medio de jQuery -->
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Inicio modal registro facturas -->
    <div class="modal fade" id="modal" tabindex="-1" role="dialog" name="modalFacturacion" data-backdrop="static" data-keyboard="true" style="overflow: auto;">
      <div class="modal-dialog" id="cuerpo" role="document">
        <div class="modal-content" id="newCliente">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span name="cerrar_ubicaciones" aria-hidden="true">&times;</span></button>
            <h4 class="modal-title"><center>Nueva Factura</center></h4>
          </div>
          <div class="modal-body" id="modal_body" style="overflow-y: auto;">
            <div id="productos" class="tab-pane fade in active">
              <div class="panel-body">
                <form class="noprint" name="formDetalle" id="formDetalle">
                  <div class="row">
                        <input type="hidden" name="controller" value="<?php echo $controller; ?>">
                        <input type="hidden" name="tipo" value="1">
                        <input type="hidden" name="numfac">
                        <input type="hidden" name="prefijo_real">
                        <input type="hidden" name="numero_real">
                        <div class="form-group col-xs-6 col-sm-4 col-md-2" id="div_button">
                          <button type="button" class="btn btn-default btn-sm btn-primary" id="btnAgrPro" name="btnAgrPro" title="Agregar Producto">
                          <span class="glyphicon glyphicon-plus"></span>&nbsp;&nbsp;<div id="button_text">Agregar Producto</div>
                          </button>
                        </div>
                        <div class="form-group col-xs-6 col-sm-4 col-md-2" id="div_button1">
                          <button type="button" class="btn btn-default btn-sm btn-info" id="btnSalvarFactura" name="btnSalvarFactura" title="Guardar Factura">
                          <span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;&nbsp;<div id="button_text">Guardar Borrador</div>
                          </button>
                        </div>
                        <div class="form-group col-xs-6 col-sm-4 col-md-2" id="div_button2">
                          <button type="button" class="btn btn-default btn-sm btn-success" id="btnFinalizarFactura" name="btnFinalizarFactura" title="Finalizar Factura">
                          <span class="glyphicon glyphicon-floppy-saved"></span>&nbsp;&nbsp;<div id="button_text">Guardar y Finalizar</div>
                          </button>
                        </div>
                        <div class="form-group col-xs-6 col-sm-4 col-md-2" id="div_button3">
                          <button type="button" class="btn btn-default btn-sm btn-danger" id="btnAnularFactura" name="btnAnularFactura" title="Anular">
                          <span class="icon icon-bin"></span>&nbsp;&nbsp;<div id="button_text">Anular y Finalizar</div>
                          </button>
                        </div>
                        <div class="form-group col-xs-6 col-sm-4 col-md-2" id="div_button4">
                          <button type="button" class="btn btn-default btn-sm btn-info" id="btnImprimir" name="btnImprimir" title="Imprimir">
                          <span class="glyphicon glyphicon-print"></span>&nbsp;&nbsp;<div id="button_text">Imprimir</div>
                          </button>
                        </div>
                        <div class="form-group col-xs-6 col-sm-4 col-md-2" id="div_button5">
                          <button type="button" class="btn btn-default btn-sm btn-primary" id="send" name="send" title="Enviar por Correo">
                            <span class="glyphicon glyphicon-envelope"></span>&nbsp;&nbsp;<div id="button_text">Enviar por Correo</div>
                          </button>
                        </div>
                        <div class="form-group col-xs-6 col-sm-4 col-md-2" id="div_button6">
                          <button type="button" class="btn btn-default btn-sm btn-success" id="btnAbonar" name="btnAbonar" title="Abonos">
                          <span class="icon icon-coin-dollar"></span>&nbsp;&nbsp;<div id="button_text">Abonar</div>
                          </button>
                        </div>
                  </div>
                  <div class="row">
                    <div class="col-xs-4" id="codigo">
                      <label for="prefijo">Prefijo :<span class="required"> *</span></label>
                      <input type="text" disabled id="prefijo" name="prefijo" class="form-control" placeholder="Prefijo">
                    </div>
                    <div class="col-xs-3" id="numero_fac">
                      <label for="numero_factura" id="numfac">Número de factura :<span class="required"> *</span></label>
                      <input type="text" name="numero_factura" id="numero_factura" class="form-control" placeholder="Número de factura">
                      <input type="hidden" name="numero_factura-id" id="numero_factura-id">
                    </div>
                    <div class="col-xs-3" id="codigo">
                      <label for="total_factura">Total :<span class="required"> *</span></label>
                      <input type="number" name="total_factura" id="total_factura" class="form-control" placeholder="Total">
                    </div>
                    <div class="col-xs-3" id="ini_cuo">
                      <label for="cuota_inicial" id="cuoini">Cuota inicial :<span class="required"> *</span></label>
                      <input type="number" name="cuota_inicial" id="cuota_inicial" class="form-control" placeholder="Cuota inicial">
                    </div>
                    <div class="col-xs-3" id="fecha_entrada">
                      <label for="fecha" id="fecent">Fecha de entrada :<span class="required"> *</span></label>
                      <input type="text" name="fecha" id="fecha" class="form-control" placeholder="Fecha de entrada">
                    </div>
                    <div class="col-xs-3" id="fecha_vencimiento">
                      <label id="fecven" for="fecha_ven">Fecha de vencimiento :</label>
                      <input type="text" name="fecha_vencimiento" id="fecha_ven" class="form-control" placeholder="Fecha de vencimiento">
                    </div>
                  </div><br>
                  <div class="row">
                    <div class="col-xs-6" id="cli">
                      <label for="cliente">Cliente :<span class="required"> * </span><span class="icon icon-notification" onmouseover="mostrarAyudaCliente()"></span></label>
                      <input type="text" id="cliente" name="cliente" class="form-control" placeholder="Cliente">
                      <input type="hidden" name="cliente-id" id="cliente-id">
                    </div>
                    <div class="col-xs-6" id="ven">
                      <label for="vendedor">Vendedor :<span class="required"> * </span><span class="icon icon-notification" onmouseover="mostrarAyudaVendedor()"></span></label>
                      <input type="text" name="vendedor" id="vendedor" class="form-control" placeholder="Vendedor">
                      <input type="hidden" name="vendedor-id" id="vendedor-id">
                    </div>
                  </div><br>
                  <div class="row">
                    <div class="col-xs-6" style="display: none;">
                      <label for="tipo_descuento">Tipo de descuento :</label>
                      <select class="form-control" disabled name="tipo_descuento" id="tipodescuento" onchange="validar_descuento()">
                        <option value="0">Seleccione</option>
                        <option value="1">Manual</option>
                        <option value="2">Automatico</option>
                      </select>
                    </div>
                    <div class="col-xs-3" style="display: none;">
                      <label for="descuento">Descuento : <span class="icon icon-notification" onmouseover="ayudaDescuento()"></span></label>
                      <input type="number" disabled name="descuento" id="descuento" class="form-control" placeholder="Descuento" value="0">
                    </div>
                    <div class="col-xs-3" style="display: none;">
                      <label for="total">Total : <span class="icon icon-notification"></span></label>
                      <input type="number" disabled name="total" id="total" class="form-control" placeholder="Total" value="0">
                    </div>
                  </div><br>
                  <div class="row">
                    <div class="col-xs-2" id="changeClass1">
                      <label for="formpago" id="forpag">Forma de Pago :<span class="required"> *</span></label>
                      <select class="form-control" name="formpago" id="formpago">
                        <option value="">Seleccione</option>
                        <option value="1">Contado</option>
                        <option value="2">Credito</option>
                      </select>
                    </div>
                    <div class="col-xs-2" id="changeClass2">
                      <label for="iva">IVA : <span class="icon icon-notification" onmouseover="ayudaIva()"></span></label>
                      <input type="number" name="iva" id="iva" class="form-control" value="0" placeholder="Iva">
                    </div>
                    <div class="col-xs-2" id="changeClass3">
                      <label for="fletes">Fletes :</label>
                      <input type="number" name="fletes" id="fletes" class="form-control" value="0" placeholder="Fletes">
                    </div>
                    <div class="col-xs-2" id="changeClass4">
                      <label for="retefuente">Retefuente :</label>
                      <input type="number" name="retefuente" id="retefuente" class="form-control" value="0" placeholder="Retefuente">
                    </div>
                    <div class="col-xs-2" id="changeClass5">
                      <label for="reteica">Reteica :</label>
                      <input type="number" name="reteica" id="reteica" class="form-control" value="0" placeholder="Reteica">
                    </div>
                    <div class="col-xs-2" id="changeClass6">
                      <label for="comision">Comisión :</label>
                      <input type="number" name="comision" id="comision" class="form-control" value="0" placeholder="Comisión">
                    </div>
                  </div><br>
                  <div class="row">
                    <div class="col-xs-12">
                      <label for="observacion">Observaciones :</label>
                      <textarea class="form-control" name="observacion" rows="2" cols="80" id="observacion" placeholder="Observaciones sobre la factura"></textarea>
                    </div>

                  </div>
                </form>
                <br/>
                <div id="listado" class="content" autoCal="true" style="height: 500px; overflow-y: auto;">
                  <table class="table table-hover"  id="datos">
                    <thead>
                      <tr class="info">
                        <th style="width: 50px">Acciones</th>
                        <th id="codigo">Codigo</th>
                        <th>Ref.</th>
                        <th>Detalle</th>
                        <th>Cantidad</th>
                        <th>Unidad</th>
                        <th>Valor</th>
                        <th>Iva</th>
                        <th>Descuento</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody name="listado_articulos">

                    </tbody>
                  </table>
                </div>
              </div>
              <div class="modal-footer">
                <br>
                <br>
                <br>
                <center>
                  <div class="col-xs-3" id="sal_fac">
                    <label style="font-size: 20px;" id="saldofactura" class="form-control">SALDO</label>
                  </div>
                  <div class="col-xs-3" id="des_fac">
                    <label style="font-size: 20px;" id="descuentofactura" class="form-control">DESCUENTO</label>
                  </div>
                  <div class="col-xs-3" id="iv_fac">
                    <label style="font-size: 20px;" id="ivafactura" class="form-control">IVA</label>
                  </div>
                  <div class="col-xs-3" id="tot_fac">
                    <label style="font-size: 20px;" id="totalfactura" class="form-control">TOTAL</label>
                  </div>
                </center>
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
    <!-- Fin modal registro factura -->

    <!-- Inicio Modal Agregar Producto -->
    <div class="modal fade" id="" tabindex="-1" role="dialog" name="modalAgregarProducto" data-backdrop="static" data-keyboard="true">
      <div class="modal-dialog" id="cuerpo" role="document">
        <div class="modal-content" id="newCliente">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span name="btn-warning" aria-hidden="true">&times;</span></button>
            <h4 class="modal-title"><center>Agregar Producto</h4>
          </div>
          <div class="modal-body">
            <form name="formAggProducto" id="formAggProducto">
              <hr id="hr" name="hr">
              <div class="form-group">
                  <div class="row">
                    <div class="col-xs-0">
                      <input type="hidden" id="codigo_producto" name="codigo_producto">
                      <input type="hidden" value="1" name="tipo">
                      <input type="hidden" name="prefijo">
                      <input type="hidden" name="numero_factura">
                      <input type="hidden" name="numero_real">
                      <input type="hidden" name="fecha">
                      <input type="hidden" name="cliente">
                      <input type="hidden" name="vendedor">
                      <input type="hidden" name="formpago">
                      <input type="hidden" name="fletes">
                      <input type="hidden" name="retefuente">
                      <input type="hidden" name="reteica">
                      <input type="hidden" name="comision">
                      <input type="hidden" name="observacion">
                      <input type="hidden" name="descuento">
                      <input type="hidden" name="iva">
                      <input type="hidden" name="tipo_descuento">
                      <input type="hidden" name="iva_producto">
                      <input type="hidden" name="total">
                      <input type="hidden" name="cuota_inicial">
                      <input type="hidden" name="fecha_vencimiento">
                    </div>
                  </div>
                </form>
                    <div class="col-xs-12">
                      <div id="listado" class="content" autoCal="true" style="height: 500px; overflow-y: auto;">
                        <table class="table table-hover"  id="datos">
                          <thead>
                            <tr class="info">
                              <th style="width: 220px;">Producto</th>
                              <th style="width: 115px;">Valor</th>
                              <th style="width: 115px;">Cantidad</th>
                              <th style="width: 90px;">Acciones</th>
                            </tr>
                          </thead>
                          <tbody name="listar_productos_agg">
                            <!-- Contenido de la tabla es cargado por medio de jQuery -->
                          </tbody>
                        </table>
                      </div>
                  </div><br>
                  <div class="row">
                    <div class="col-xs-6" id="codigo">
                      <label for="descuento_art">Descuento :<span class="required"> *</span></label>
                      <input type="number" disabled id="descuento_art" maxlength="2" class="form-control" name="descuento_art" placeholder="Descuento">
                    </div>
                    <div class="col-xs-6" id="codigo">
                      <label for="iva">Iva :<span class="required"> *</span></label>
                      <input type="number" disabled id="iva" maxlength="2" class="form-control" name="iva" placeholder="Iva">
                    </div>
                  </div></br>
            </div>
          <div class="modal-footer">
            <center>
              <button type="button" class="btn btn-danger" data-dismiss="modal" aria-label="Close" name="btn-warning">Hecho</button>
            </center>
          </div>
        </div>
      </div>
    </div>
    </div>
    <!-- Fin modal agregar producto -->

    <!-- Inicio Modal Agregar abono -->
    <div class="modal fade" id="" tabindex="-1" role="dialog" name="modalAgregarAbono" data-backdrop="static" data-keyboard="true">
      <div class="modal-dialog" id="cuerpo" role="document">
        <div class="modal-content" id="newCliente">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span name="btn-warning" aria-hidden="true">&times;</span></button>
            <h4 class="modal-title"><center>Agregar Abono</h4>
          </div>
          <div class="modal-body">
            <form name="formAggAbono" id="formAggAbono">
              <hr id="hr" name="hr">
              <div class="form-group">
                  <div class="row">
                    <div class="col-xs-0">
                      <input type="hidden" id="codigo_producto" name="codigo_producto">
                      <input type="hidden" value="1" name="tipo">
                      <input type="hidden" name="prefijo_real">
                      <input type="hidden" name="numero_real">
                      <input type="hidden" name="saldo">
                    </div>
                  </div><br>
                  <div class="row">
                    <div class="col-xs-12">
                      <label for="valor">Valor :<span class="required"> *</span></label>
                      <input type="number" id="valor" maxlength="20" class="form-control" name="valor" placeholder="Valor">
                    </div>
                  </div><br>
                </div>
              </form>
              <div id="listado" class="content" autoCal="true" formulaCal="height-500" style="height: 500px; overflow: auto;">
                <table class="table table-hover"  id="datos">
                  <thead>
                    <tr class="info">
                      <th style="width: 50px">Acciones</th>
                      <th id="codigo">Codigo</th>
                      <th style="width: 100px">Tipo</th>
                      <th style="width: 100px">Valor</th>
                      <th style="width: 100px">Fecha</th>
                    </tr>
                  </thead>
                  <tbody name="listado_abonos">

                  </tbody>
                </table>
              </div>
            </div>
          <div class="modal-footer">
            <center>
              <button type="button" class="btn btn-danger" data-dismiss="modal" aria-label="Close" name="btn-warning">Cancelar</button>
              <button type="button" class="btn btn-primary" id="btnAgregarAbono" name="btnAgregarAbono"  >Registrar</button>
            </center>
          </div>
        </div>
      </div>
    </div>
    <!-- Fin modal agregar abono -->

  </div>
</div>


<script type="text/javascript">
  $.getScript('<?php echo base_url(); ?>js/facturacion.js');
  $.getScript('<?php echo base_url(); ?>js/responsive_table.js');
</script>
