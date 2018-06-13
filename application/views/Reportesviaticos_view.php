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
        <form class="noprint" name="formBusqueda" id="formBusqueda">
          <div class="row">
            <div class="col-xs-6">
              <label style="font-size: 20px;">Traer <?php echo $titulo; ?> entre dos fechas.</label>
            </div>
            <div class="col-xs-3">
              <label style="font-size: 20px;">Traer <?php echo $titulo; ?> asociados a un vendedor.</label>
            </div>
            <div class="col-xs-3">
              <label style="font-size: 20px;">Traer <?php echo $titulo; ?> por su tipo.</label>
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
              <label for="vendedor">Vendedor : <span class="icon icon-notification" onmouseover="mostrarAyuda('Ingrese el nombre o el número de documento del vendedor.')"></span></label>
              <input type="text" name="vendedor" id="vendedor" class="form-control" placeholder="Vendedor">
              <input type="hidden" name="vendedor-id" id="vendedor-id">
              <input type="hidden" name="generar_excel" id="generar_excel" value="false">
              <input type="hidden" name="tipo_registro" value="<?php echo $grupo; ?>">
            </div>
            <div class="col-xs-3">
              <label for="vendedor">Tipo :</label>
              <select class="form-control" name="tipo_viatico">
                <option value="">Seleccione</option>
              </select>
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
                  <button type="button" class="btn btn-default btn-sm btn-success" id="excel" name="excel" title="Generar reporte">
                  <span class="glyphicon glyphicon-save-file"></span>&nbsp;&nbsp;Excel
                </div>
          </div>
        </form>
        <br/>
        <div class="content" autoCal="true" formulaCal="height-180" style="height: 500px; overflow: auto;">
          <table class="table table-hover"  id="datos">
            <thead>
              <tr class="info">                
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
    <script type="text/javascript">
        $.getScript('<?php echo base_url(); ?>js/reportesviaticos.js');
    </script>
