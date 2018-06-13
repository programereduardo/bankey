<title>Cartera</title>
<link rel="stylesheet" href="<?php echo base_url(); ?>css/ocultar_codigo.css">
<link rel="stylesheet" href="<?php echo base_url(); ?>css/estilo_modal.css">
<div class="col-xs-12 col-sm-12 col-md-10" id="panelHome" name="cuerpo">
  <div class="panel panel-success">
    <div class="panel-heading">
      <h3 class="panel-title">Cartera</h3>
    </div>
    <div style="clear: both"></div>
    <div id="estudiantes" class="tab-pane fade in active">
      <div class="panel-body" autoCal="true" formulacal="height-100">
        <!-- Inicio. Año - Periodo -->
        <form class="noprint" name="formBusqueda" id="formBusqueda">
          <div class="row">
            <div class="col-xs-6">
              <label style="font-size: 20px;">Traer las cuentas por cobrar entre dos fechas.</label>
            </div>
            <div class="col-xs-6">
              <label style="font-size: 20px;">Traer las cuentas por cobrar asociadas a un cliente o a un vendedor.</label>
            </div>
          </div><br>
          <div class="row">
            <div class="col-xs-3" id="fecha_entrada">
              <label for="desde">Desde :<span class="required"> *</span></label>
              <input type="text" name="fecha" id="desde" class="form-control" placeholder="Desde">
            </div>
            <div class="col-xs-3" id="fecha_salida">
              <label for="hasta">Hasta :<span class="required"> *</span></label>
              <input type="text" name="fecha" id="hasta" class="form-control" placeholder="Hasta">
            </div>
            <div class="col-xs-3">
              <label for="cliente">Cliente : <span class="icon icon-notification" onmouseover="mostrarAyudaCliente()"></span></label>
              <input type="text" id="cliente" name="cliente" class="form-control" placeholder="Cliente">
              <input type="hidden" name="cliente-id" id="cliente-id">
            </div>
            <div class="col-xs-3">
              <label for="vendedor">Vendedor : <span class="icon icon-notification" onmouseover="mostrarAyudaVendedor()"></span></label>
              <input type="text" name="vendedor" id="vendedor" class="form-control" placeholder="Vendedor">
              <input type="hidden" name="vendedor-id" id="vendedor-id">
              <input type="hidden" name="generar_excel" id="generar_excel" value="false">
            </div>
          </div><br>
          <div class="row">
                <!-- <input type="hidden" name="controller" value="<?php echo $controller; ?>"> -->
                <div class="form-group col-xs-6 col-sm-4 col-md-2" name="registrar_ubicacion">
                  <button type="button" class="btn btn-default btn-sm btn-primary" id="buscar" name="buscar" title="Buscar">
                  <span class="glyphicon glyphicon-search"></span>&nbsp;&nbsp;Buscar
                  </button>
                </div>
                <div class="form-group col-xs-6 col-sm-4 col-md-2" name="registrar_ubicacion">
                  <button type="button" class="btn btn-default btn-sm btn-danger" id="limpiar" name="limpiar" title="Limpiar">
                  <span class="icon icon-bin"></span>&nbsp;&nbsp;Limpiar
                  </button>
                </div>
                <div class="form-group col-xs-6 col-sm-4 col-md-2">
                  <button type="button" class="btn btn-default btn-sm btn-success" id="excel" name="btnAgregarCliente" title="Generar reporte">
                  <span class="glyphicon glyphicon-save-file"></span>&nbsp;&nbsp;Excel
                </div>
          </div>
        </form>
        <!-- Fin. Año - Periodo -->
        <br/>
        <div class="content" autoCal="true" formulaCal="height-370" style="height: 500px; overflow: auto;">
          <table class="table table-hover"  id="datos">
            <thead>
              <tr class="info">
                <!-- <th style="width: 90px">Acciones</th> -->
                <th>Identificación</th>
                <th>Cliente</th>
                <th>vendedor</th>
                <th>Número Factura</th>
                <th>Fecha Entrada</th>
                <th>Fecha Vencimiento</th>
                <th>Total</th>
                <th>Saldo Inicial</th>
                <th>Abonos</th>
                <th>Deuda</th>
                <!--<th>Vendedor</th>-->
              </tr>
            </thead>
            <tbody name="listar_facturas">
              <!-- Contenido de la tabla es cargado por medio de jQuery -->
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <script type="text/javascript">
        $.getScript('<?php echo base_url(); ?>js/reportescarteras.js');
    </script>
