<title>Clientes</title>
<link rel="stylesheet" href="<?php echo base_url(); ?>css/ocultar_codigo.css">
<link rel="stylesheet" href="<?php echo base_url(); ?>css/estilo_modal.css">
<div class="col-xs-12 col-sm-12 col-md-10" id="panelHome" name="cuerpo">
  <div class="panel panel-success">
    <div class="panel-heading">
      <h3 class="panel-title">Clientes</h3>
    </div>
    <div style="clear: both"></div>
    <div id="estudiantes" class="tab-pane fade in active">
      <div class="panel-body" autoCal="true" formulacal="height-100">
        <p id="total_terceros"><strong>Total de Clientes: </strong></p><br>
        <!-- Inicio. Año - Periodo -->
        <form class="noprint" name="formBusqueda" id="formBusqueda">
          <div class="row">
            <div class="col-xs-8">
              <label style="font-size: 20px;">Traer clientes por su localidad.</label>
            </div>
            <div class="col-xs-2">
              <label style="font-size: 20px;">Traer clientes por su tipo.</label>
            </div>
            <!--<div class="col-xs-2">
              <label style="font-size: 20px;">Traer clientes por saldo.</label>
            </div>-->
          </div><br>
          <div class="row">
            <div class="col-xs-2" id="fecha_entrada">
              <label for="pais">País :</label>
              <select id="pais" class="form-control" onchange="obtener_estados();" name="pais">
                <option value="NA">Seleccione</option>
              </select>
            </div>
            <div class="col-xs-2" id="fecha_entrada">
              <label for="estado">Estado :</label>
              <select id="estado" onchange="obtener_ciudades();" class="form-control" name="estado">
                <option value="NA">Seleccione</option>
              </select>
            </div>
            <div class="col-xs-2" id="fecha_entrada">
              <label for="ciudad">Ciudad :</label>
              <input type="hidden" name="generar_excel" value="false">
              <select id="ciudad" onchange="obtener_barrios();" class="form-control" name="ciudad">
                <option value="NA">Seleccione</option>
              </select>
            </div>
            <div class="col-xs-2" id="fecha_entrada">
              <label for="barrio">Barrio :</label>
              <select id="barrio" class="form-control" name="barrio">
                <option value="NA">Seleccione</option>
              </select>
            </div>
            <div class="col-xs-2">
              <label for="tipo">Tipo :</label>
              <select class="form-control" name="tipo" id="tipo">
                <option value="NA">Seleccione</option>
                <option value="1">Persona juridica</option>
                <option value="2">Persona natural</option>
              </select>
            </div>
            <!--<div class="col-xs-2">
              <label for="tipo">Saldo :</label>
              <select class="form-control" name="tipo" id="tipo">
                <option value="NA">Seleccione</option>
                <option value="1">Igual a cero (0)</option>
                <option value="2">Mayor a cero (0)</option>
              </select>
            </div>-->
          </div><br>
          <div class="row">
                <!-- <input type="hidden" name="controller" value="<?php //echo $controller; ?>"> -->
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
        <div class="content" autoCal="true" formulaCal="height-400" style="height: 500px; overflow-y: auto; overflow-y: auto;">
          <table class="table table-hover"  id="datos">
            <thead>
              <tr class="info">
                <th id="codigo">Codigo</th>
                <th>Tip. Doc</th>
                <th>Identificación</th>
                <th>D.V</th>
                <th>Nombre</th>
                <th>Tipo</th>
                <th id="asoc">Nombre Asociación</th>
                <th>Contributivo</th>
                <th>Retenedor</th>
                <th>Dirección</th>
                <th>Correo</th>
                <th>Telefono</th>
                <th>Celular</th>
                <th>Barrio</th>
                <th>Ciudad</th>
                <th>Departamento</th>
                <th>País</th>
              </tr>
            </thead>
            <tbody name="listado_clientes">

            </tbody>
          </table>
        </div>
      </div>
    </div>

    <script type="text/javascript">
        $.getScript('<?php echo base_url(); ?>js/reportescli.js');
    </script>
