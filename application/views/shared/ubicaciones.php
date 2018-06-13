<!-- Modal listar ubicaciones -->
<div class="modal fade" id="modalUbicaciones" tabindex="-1" role="dialog" name="formularioUbicaciones" data-backdrop="static" data-keyboard="true">
  <div class="modal-dialog" id="cuerpo" role="document">
    <div class="modal-content" id="newCliente">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span name="cerrar_ubicaciones" aria-hidden="true">&times;</span></button>
        <h4 class="modal-title"><center>Ubicaciones</center></h4>
      </div>
      <div class="modal-body">
        <div id="estudiantes" class="tab-pane fade in active">
          <div class="panel-body" autoCal="true" formulacal="height-100">
            <p id="nombre_clienteU">Nombre Cliente</p>
            <div class="row">
              <form class="noprint" id="form_per_aca">
                    <div class="form-group col-xs-12 col-sm-4 col-md-2" name="registrar_ubicacion">
                      <button type="button" class="btn btn-default btn-sm btn-primary" id="registrar" name="btnAgrubi" title="Registrar ubicacion">
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
                  <tr>
                    <th style="width: 90px">Acciones</th>
                    <th id="codigo">Codigo</th>
                    <th style="width: 170px;">Tipo</th>
                    <th>Descripción</th>
                    <th>Barrio</th>
                    <th>Ciudad</th>
                    <th>Departamento</th>
                    <th>País</th>
                  </tr>
                </thead>
                <tbody name="listado_ubicaciones">

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
<!-- Fin modal listar ubicaciones -->

<!-- Modal agregar ubicacion -->
<div class="modal fade" id="" tabindex="-1" role="dialog" name="formularioUbicacionesAgregar" data-backdrop="static" data-keyboard="true">
  <div class="modal-dialog" id="" role="document">
    <div class="modal-content" id="newCliente">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span name="cerrar_agregar_ubi" aria-hidden="true">&times;</span></button>
        <h4 class="modal-title"><center>Registrar Ubicacion</center></h4>
      </div>
      <div class="modal-body">
        <form name="formUbi" id="formUbi">
          <hr id="hr" name="hr">
          <input type="hidden" name="codigof">
          <input type="hidden" name="codigoU">
          <input type="hidden" name="tipoU" value="1">
          <div class="form-group">
              <div class="row">
                <div class="col-xs-6" id="tipo_ubicacion">
                  <label for="tipo_documento">Tipo :<span class="required"> *</span></label>
                  <select class="form-control" onchange="verifica_tipo()" id="tipo_documento" name="tipo_ubicacion">
                    <option value="">Seleccione</option>
                  </select>
                </div>
                <div class="col-xs-6" id="tipo_ubicacion">
                  <label for="numero_documento">Descripcion :<span class="required"> *</span></label>
                  <input type="text" id="descripcion" maxlength="50" class="form-control" name="descripcion" placeholder="Descripcion">
                </div>
              </div></br>
              <div class="row">
                <div class="col-xs-6" id="pais">
                  <label for="">Pais :<span class="required"> *</span></label>
                  <select  id="paisU" onchange="obtener_estados($('[name=formularioUbicacionesAgregar]'), data)" class="form-control"  name="pais">
                    <option value="">No disponible</option>
                  </select>
                </div>
                <div class="col-xs-6" id="estado">
                  <label for="pais">Estado :<span class="required"> *</span></label>
                  <select id="estadoU" class="form-control" onchange="obtener_ciudades($('[name=formularioUbicacionesAgregar]'), data)" name="estado">
                    <option value="">No disponible</option>
                  </select>
                </div>
              </div>
              <div class="row" id="oculto">
                <div class="col-xs-6" id="ciudad">
                  <label for="pais">Ciudad :<span class="required"> *</span></label>
                  <select class="form-control"  name="nada">
                    <option value="">No disponible</option>
                  </select>
                </div>
                <div class="col-xs-6" id="tipo_ubicacion">
                  <label for="barrio">Barrio :<span class="required"> *</span></label>
                  <select class="form-control"  name="nombrebarrio">
                    <option value="">No disponible</option>
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-xs-6" id="ciudad">
                  <label for="pais">Ciudad :<span class="required"> *</span></label>
                  <select class="form-control" id="ciudadU" onchange="obtener_barrios(data)" name="ciudad">
                    <option value="">No disponible</option>
                  </select>
                </div>
                <div class="col-xs-4" id="barrio">
                  <label for="barrio">Barrio :</label>
                  <select class="form-control" id="barrioU" onchange="agregar_barrio()" name="barrio">
                    <option value="">No disponible</option>
                  </select>
                </div>
                <div class="col-xs-2" style="display: block;" id="aggbarrio">
                  <label for=""></label><br><br>
                  <span name="btnBarrio" id="btnBarrio" title="Nuevo barrio" class="text-info" style="width: 32px; padding-left: 0px; padding-right: 0px;" role="button">
                    <span class="icon icon-home" style="font-size: 18px;"></span>
                </span></div>
              </div>
            </form>
          </div>
          <br>
          <br>
          <div class="modal-footer">
            <center>
              <button type="button" class="btn btn-danger" data-dismiss="modal" aria-label="Close" name="btnCancelUbi">Cancelar</button>
              <button type="button" class="btn btn-primary" name="btnGuardarUbi">Registrar</button>
            </center>
        </div>
      </div>
    </div>
  </div>
</div>
<!-- Fin modal agregar ubicaciones -->

<!-- Inicio modal agregar barrio -->
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
<!-- Fin modal agregar barrio -->
<script type="text/javascript">
    $.getScript('<?php echo base_url(); ?>js/ubicacionesCli.js');
</script>
