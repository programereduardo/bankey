<title>Inventario</title>
<link rel="stylesheet" href="<?php echo base_url(); ?>css/ocultar_codigo.css">
<link rel="stylesheet" href="<?php echo base_url(); ?>css/estilo_modal.css">
<div class="col-xs-12 col-sm-12 col-md-10" id="panelHome" name="cuerpo">
  <div class="panel panel-success">
    <div class="panel-heading">
      <h3 class="panel-title">Inventario</h3>
    </div>
    <div style="clear: both"></div>
    <div id="estudiantes" class="tab-pane fade in active">
      <div class="panel-body" autoCal="true" formulacal="height-100">
        <!-- Inicio. Año - Periodo -->
        <form class="noprint" name="formBusqueda" id="formBusqueda">
          <input type="hidden" name="generar_excel" value="false">
          <div class="row">
            <div class="col-xs-4" id="codigo">
              <label style="font-size: 20px;">Traer las cuentas por cobrar entre dos fechas.</label>
            </div>
            <div class="col-xs-10">
              <label style="font-size: 20px;">Traer articulos asociados a una categoria.</label>
            </div>
            <div class="col-xs-2" id="codigo">
              <label style="font-size: 20px;">Traer articulos por existencias.</label>
            </div>
          </div><br>
          <div class="row" >
            <div class="col-xs-2" id="codigo">
              <label for="desde">Desde :<span class="required"> *</span></label>
              <input type="text" name="fecha" id="desde" class="form-control" placeholder="Desde">
            </div>
            <div class="col-xs-2" id="codigo">
              <label for="hasta">Hasta :<span class="required"> *</span></label>
              <input type="text" name="fecha" id="hasta" class="form-control" placeholder="Hasta">
            </div>
            <div class="col-xs-2">
              <label for="familia">Familia : <span class="icon icon-notification" onmouseover="mostrarAyuda()"></span></label>
              <select class="form-control" name="familia">
                <option value="">Seleccione</option>
              </select>
            </div>
            <div class="col-xs-2">
              <label for="linea">Linea :<span class="required"> *</span></label>
              <select class="form-control" id="linea" name="linea" placeholder="Tipo de Identificación">
                <option value="">Seleccione</option>
              </select>
            </div>
            <div class="col-xs-2" id="marca">
              <label for="marca">Marca :<span class="required"> *</span></label>
              <select class="form-control" name="marca">
                <option value="">Seleccione</option>
              </select>
            </div>
            <div class="col-xs-2" id="grupo">
              <label for="grupo">Grupo :<span class="required"> *</span></label>
              <select class="form-control" name="grupo">
                <option value="">Seleccione</option>
              </select>
            </div>
            <div class="col-xs-2"  id="unidad">
              <label for="unidad">Unidad :<span class="required"> *</span></label>
              <select class="form-control" name="unidad">
                <option value="">Seleccione</option>
              </select>
            </div>
            <div class="col-xs-2" id="codigo">
              <label for="existencias">Existencias</label>
              <input class="form-control" type="number" id="existencias" name="existencias" placeholder="Existencias">
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
        <div class="content" autoCal="true" formulaCal="height-320" style="height: 500px; overflow: auto;">
          <table class="table table-hover"  id="datos">
            <thead>
              <tr class="info">
                <!-- <th style="width: 90px">Acciones</th> -->
                <th style="width: 300px;">Referencia</th>
                <th style="width: 700px;">Nombre</th>
                <th style="width: 700px;">Descripción</th>
                <th style="width: 700px;">Nombre corto</th>
                <th style="width: 300px;">Unidad</th>
                <th style="width: 300px;">Codigo de barra</th>
                <th style="width: 300px;">Familia</th>
                <th style="width: 300px;">Linea</th>
                <th style="width: 300px;">Marca</th>
                <th style="width: 300px;">Grupo</th>
                <th style="width: 300px;">Iva</th>
                <th style="width: 300px;">Existencias</th>
                <th style="width: 300px;">Existencia minima</th>
                <th style="width: 300px;">Valor</th>
                <th style="width: 300px;">Total</th>
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
        $.getScript('<?php echo base_url(); ?>js/reporteinventario.js');
    </script>
