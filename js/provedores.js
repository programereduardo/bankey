$('#registrar').on('click', function(){
  var invalidCreate = true;
  for (var i = 0; i < acciones.length; i++) {
    if (acciones[i]['mod_nombre'] == 'Proveedores') {
      if (acciones[i]['acc_descripcion'] == 'Crear') {
        invalidCreate = false;
      }
    }
  }
  if (invalidCreate === true) {
    $.notify({
      message: 'Error! Usted no posee permisos para ejecutar esta acción.'
    },{
      type: 'danger',
      delay: 1000,
      placement: {
        align: 'center'
      },
      z_index: 1000
    })
  } else {
    $(".has-error").removeClass("has-error");
    $('[name=formularioEs]').modal();
    limpiar_formulario1()
    obtener_paises()
  }
})

function verifica_tipo(){
  var tipo = $('[name=tipo]').val()
  $('#oculto').css('display', 'none')
  $('#aggbarrio').css('display', 'none')
  $('[name=pais]').attr('disabled', 'disabled')
  $('[name=estado]').attr('disabled', 'disabled')
  $('[name=ciudad]').attr('disabled', 'disabled')
  $('[name=barrio]').attr('disabled', 'disabled')
  var valor = $('[name="tipo_ubicacion"]').val()
  if (valor == 2 || valor == 3 || valor == 4) {
    obtener_paises($('[name=formularioUbicacionesAgregar]'))
    $('[name=pais]').removeAttr('disabled')
    $('[name=estado]').removeAttr('disabled')
    $('[name=ciudad]').removeAttr('disabled')
    $('[name=barrio]').removeAttr('disabled')
    $('[name=pais]').css('display', 'block')
    $('[name=estado]').css('display', 'block')
    $('[name=ciudad]').css('display', 'block')
    $('[name=barrio]').css('display', 'block')
  } else {
    $('[name=formularioUbicacionesAgregar]').find('[name=pais]').attr('disabled', 'disabled')
    $('[name=formularioUbicacionesAgregar]').find('[name=estado]').attr('disabled', 'disabled')
    $('[name=formularioUbicacionesAgregar]').find('[name=ciudad]').attr('disabled', 'disabled')
    $('[name=formularioUbicacionesAgregar]').find('[name=barrio]').attr('disabled', 'disabled')
    $('[name=formularioUbicacionesAgregar]').find('[name=pais]').val("")
    $('[name=formularioUbicacionesAgregar]').find('[name=estado]').val("")
    $('[name=formularioUbicacionesAgregar]').find('[name=ciudad]').val("")
    $('[name=formularioUbicacionesAgregar]').find('[name=barrio]').val("")
  }
}
//Fin funcion verififca tipo de ubicacion


//Obtener barrios
function obtener_barrios(){
  var combo = $('[name=barrio]')
  var codigo_ciudad = $('[name=ciudad]').val()
  var codigoc = $('#ciudadU').val()
  if (codigoc !== '') {
    codigo_ciudad = codigoc
  }
  $.ajax({
    url: "provedores_controller/obtener_barrios",
    type: 'POST',
    data: {
      codigo_ciudad: codigo_ciudad
    },
    success: function(response) {
      var respuesta = $.parseJSON(response);
      combo.empty();
      combo.append('<option value="">Seleccione</option>')
      combo.append('<option value="0">No se encuentra</option>')
      if (respuesta.success === true) {
        for (var i = 0; i < respuesta.barrios.length; i++) {
          var item = respuesta.barrios[i];
          combo.append('<option value="'+item["barcodigo"]+'">'+item["barnombre"]+'</option>');
        }
      }else{
        combo.empty();
        combo.append('<option value="">Seleccione</option>')
        combo.append('<option value="0">No se encuentra</option>')
      }
    }
  });
}
//Fin obtener barrios



//mostrar casita de barrios
function agregar_barrio() {
  var barrio = $('#barrioU').val()
  if (barrio === "0") {
    $('#aggbarrio').css('display', 'block')
    var pais = $('#paisU').val()
    var estado = $('#estadoU').val()
    var ciudad = $('#ciudadU').val()
    $('[name=formularioUbicacionesAgregar]').find('#paisB').val(pais);
    $('[name=formularioUbicacionesAgregar]').find('#estadoB').val(estado)
    $('[name=formularioUbicacionesAgregar]').find('#ciudadB').val(ciudad)
    $('[name=formularioUbicacionesAgregar]').find('#ciudadBa').val(ciudad)
    $('[name=formularioUbicacionesAgregar]').find('[name=ciudad]').val(ciudad)
    $('[name=formularioUbicacionesAgregar]').find('[name=pais]').attr('disabled', 'disabled')
    $('[name=formularioUbicacionesAgregar]').find('[name=estado]').attr('disabled', 'disabled')
    $('[name=formularioUbicacionesAgregar]').find('[name=ciudad]').attr('disabled', 'disabled')
  } else {
    $('[name=formularioUbicacionesAgregar]').find('#aggbarrio').css('display', 'none')
    $('[name=formularioUbicacionesAgregar]').find('#paisB').val("")
    $('[name=formularioUbicacionesAgregar]').find('#estadoB').val("")
    $('[name=formularioUbicacionesAgregar]').find('#ciudadB').val("")
    $('[name=formularioUbicacionesAgregar]').find('[name=pais]').removeAttr('disabled')
    $('[name=formularioUbicacionesAgregar]').find('[name=estado]').removeAttr('disabled')
    $('[name=formularioUbicacionesAgregar]').find('[name=ciudad]').removeAttr('disabled')
  }
}
//fin mostrar casita de barrios
//Obtener paises
var obtener_paises = function(){
  var combo=$('[name=pais]');
  $.ajax({
      url: "provedores_controller/obtener_paises",
      success: function(response) {
          var respuesta = $.parseJSON(response);
          if (respuesta.success === true) {
            combo.empty();
            combo.append('<option value="">Seleccione</option>')
            for (var i = 0; i < respuesta.paises.length; i++) {
              var item = respuesta.paises[i];
              combo.append('<option value="'+item["paicodigo"]+'">'+item["painombre"]+'</option>');
            }
          }
      }
  });
}
//Fin obtener paises

//Obtener estados
function obtener_estados() {
  var combo = $('[name=estado]');
  var codigo_pais = $('[name=pais]').val();
  $.ajax({
    url: "provedores_controller/obtener_estados",
    type: 'POST',
    data: {
      codigo_pais: codigo_pais
    },
    success: function(response) {
      var respuesta = $.parseJSON(response);
      if (respuesta.success === true) {
        combo.empty();
        combo.append('<option value="">Seleccione</option>')
        for (var i = 0; i < respuesta.estados.length; i++) {
          var item = respuesta.estados[i];
          combo.append('<option value="'+item["depcodigo"]+'">'+item["depnombre"]+'</option>');
        }
      }
    }
  });
}
//Obtener estados

//obtener ciudades
function obtener_ciudades(){
  var combo = $('[name=ciudad]');
  var codigo_estado = $('[name=estado]').val();
  $.ajax({
    url: "provedores_controller/obtener_ciudades",
    type: 'POST',
    data: {
      codigo_estado: codigo_estado
    },
    success: function(response) {
      var respuesta = $.parseJSON(response);
      if (respuesta.success === true) {
        combo.empty();
        combo.append('<option value="">Seleccione</option>')
        for (var i = 0; i < respuesta.ciudades.length; i++) {
          var item = respuesta.ciudades[i];
          combo.append('<option value="'+item["muncodigo"]+'">'+item["munnombre"]+'</option>');
        }
      }
    }
  });
}
//fin obtener ciudades


function verifica_barrio(){
  var valor = $('[name="barrio"]').val()
  if (valor == 0) {
    $('#aggbarrio').css('display', 'block')
  } else {
    $('#aggbarrio').css('display', 'none')
  }
}

function limpiar_formulario1(){
    $('[name=formularioEs]').find('[name=nombre]').val("");
    $('[name=formularioEs]').find('[name=digito_verificacion]').val("");
    $('[name=formularioEs]').find('[name=nit]').val("");
    $('[name=formularioEs]').find('[name=correo]').val("");
    $('[name=formularioEs]').find('[name=contributivo]').val("N");
    $('[name=formularioEs]').find('[name=retenedor]').val("N");
    $('#correo').css('display', 'block')
};

var accionEliminar = function(){
    var codigo=$(this).attr("codigo");
    bootbox.confirm({
        title: "Confirmación",
        message: "¿Está seguro que desea eliminar el registro?",
        buttons: {
            confirm: {
            label: 'Si',
            className: 'btn-'
        },
        cancel: {
            label: 'No',
            className: 'btn-danger'
        }
        },
        callback: function (result) {
            if(result===true){
                $.ajax({
                    url: "provedores_controller/eliminar_provedor",
                    type:"POST",
                    data: {
                        codigo: codigo
                    },
                    success: function(response) {
                        var respuesta = $.parseJSON(response);
                        if (respuesta.success === true) {

                            $.notify({
                                message: "Eliminado correctamente."
                            },{
                                type: 'success',
                                delay: 1000,
                                placement: {
                                    align: 'center'
                                },
                                z_index: 1000,
                                onClosed: function(){
                                  obtener_proveedores();
                                }
                            });
                        }
                    }
                });
            }
        }
    });
}

var accionModificar = function(){
    var nit = $(this).attr("nit");
    var pais = $(this).attr("pais");
    var estado = $(this).attr("estado");
    var correo = $(this).attr("correo");
    var retenedor = $(this).attr("retenedor");
    var contributivo = $(this).attr("contributivo");
    var digito_verificacion = $(this).attr("digito_verificacion");
    var nombre = $(this).attr("nombre");
    var barrio = $(this).attr("barrio");
    $('[name=formularioEs]').modal()
    $('[name=formularioEs]').find('.modal-title').text("Modificar datos del proveedor");
    var btnGuardar=$('[name=formularioEs]').find('[name=btnGuardar]');
    $('[name=formularioEs]').find('[name=nit]').val(nit);
    $('[name=formularioEs]').find('[name=nombre]').val(nombre);
    $('[name=formularioEs]').find('[name=digito_verificacion]').val(digito_verificacion);
    $('[name=formularioEs]').find('[name=correo]').val(correo);
    $('[name=formularioEs]').find('[name=retenedor]').val(retenedor);
    $('[name=formularioEs]').find('[name=contributivo]').val(contributivo);
    $('#correo').css('display', 'none')
}


var componenteListado = $('[name=listado_proveedores]');

var guardarBarrio = function(){

}

$('[name=listar]').on('click', function(){
  obtener_proveedores();
})

 /*$('[name="fecha"]').daterangepicker({
  locale: {
  },
  minDate: '1900-01-01',
  maxDate: '3000-12-31',
  singleDatePicker: true
});*/


$('[name="fecha"]').daterangepicker({
  singleDatePicker: true,
  showDropdowns: true,
  locale: {
    format: 'YYYY-MM-DD'
  },
  singleDatePicker: true
});
/*  $('[name="fecha"]').daterangepicker({
      singleDatePicker: true,
      showDropdowns: true,
      dateFormat: 'yyyy/mm/dd'
  }
).val();*/

  var guardarProveedor = function(){
    var btnGuardar = $(this);
    var datos_clientes = $('[name=formModal]').serializeArray();
    var error = false;
    var mensajeError;
    for (var i = 0; i < datos_clientes.length; i++) {
      var label = datos_clientes[i]["name"];
      var valor = datos_clientes[i]["value"];
      var compItem = $('[name=' + label + ']');
      $(".has-error").removeClass("has-error");
      switch (label) {
        case 'nombre':
            if (valor.trim() == "") {
              mensajeError = 'El nombre del proveedor es necesario.';
              error = true;
              compItem.focus();
              compItem.parent('div').addClass("has-error");
              i = datos_clientes.length + 1;
              break;
            }
          break;
        case 'nit':
          if (valor.trim() == "") {
            mensajeError = 'El nit del proveedor es necesario.';
            error = true;
            compItem.focus();
            compItem.parent('div').addClass("has-error");
            i = datos_clientes.length + 1;
            break;
          }
          break;
        case 'digito_verificacion':
          if (valor.trim() == "") {
            mensajeError = 'El digito de verificación del proveedor es necesario.';
            error = true;
            compItem.focus();
            compItem.parent('div').addClass("has-error");
            i = datos_clientes.length + 1;
            break;
          }
        break;
        case 'correo':
          if (valor.trim() == "") {
            mensajeError = 'El correo del proveedor es necesario.';
            error = true;
            compItem.focus();
            compItem.parent('div').addClass("has-error");
            i = datos_clientes.length + 1;
            break;
          }
          break;
      }
    }
    if (error === true) {
      $.notify({
          message: mensajeError
      }, {
          type: 'danger',
          delay: 3000,
          placement: {
              align: 'center'
          },
          z_index: 99999,
      });
      return;
    } else {
      var fd = new FormData(document.getElementById("formModal"));
          waitingDialog.show('Guardando los cambios, por favor espere...', {dialogSize: 'm', progressType: ''});
          btnGuardar.attr("disabled", "disabled");
          $.ajax({
            url: 'guardarproveedor',
            type: 'POST',
            data: fd,
            processData: false, // tell jQuery not to process the data
            contentType: false   // tell jQuery not to set contentType
          }).done(function(data) {
              waitingDialog.hide();
              btnGuardar.removeAttr("disabled");
              btnGuardar.text('Guardar');
              $('[name=formularioEs]').modal('hide');
              $.notify({
                  message: "Guardado correctamente."
              }, {
                  type: 'success',
                  delay: 1000,
                  placement: {
                      align: 'center'
                  },
                  z_index: 99999,
                  onClosed: function() {
                      obtener_proveedores();
                  }
              });
          });
    }
  }
var obtener_proveedores = function(){
    waitingDialog.show('Cargando, por favor espere...', {dialogSize: 'm', progressType: ''});
    var modelFila = '<tr>'+
        '         <th scope="row">'+
        '            <span name="btnEditar"'+
        '              codigo="{0}" nombre="{2}" digito_verificacion="{4}"'+
        '              nit="{1}" pais="{4}" correo="{3}" terdatretenedor="{5}" terdatcontributivo="{6}"'+
        '              class="text-info" style="width: 32px; padding-left: 0px; padding-right: 0px;" title="Editar" role="button">'+
        '                <span class="icon icon-pencil" style="font-size: 18px;"/></span>'+
        '            <span name="btnEliminar" codigo="{0}" title="Eliminar" '+
        '               class="text-danger" style="width: 32px; padding-left: 0px; padding-right: 0px;" role="button">'+
        '                <span class="icon icon-bin" style="font-size: 18px;"/></span>'+
        '            <span name="btnUbicacion" codigo="{0}" title="Ubicación" '+
        '               class="text-info" style="width: 32px; padding-left: 0px; padding-right: 0px;" role="button">'+
        '                <span class="icon icon-home" style="font-size: 18px;"/></span>'+
        '        </th>'+
        '        <td>{0}</td>'+
        '        <td>{1}</td>'+
        '        <td>{2}</td>'+
        '    </tr>';

    $.ajax({
        url: "provedores_controller/obtener_proveedores",
        success: function(response) {
            var respuesta = $.parseJSON(response);
            componenteListado.empty();
            if (respuesta.success === true) {
                var datos = respuesta.clientes;
                //var activo = respuesta.actv;

                for (var i = 0; i < datos.length; i++) {
                    componenteListado.append(modelFila.format(
                        datos[i]["tercodigo"],//0
                        datos[i]["terdocnum"],//1
                        datos[i]["ternombre"],//2
                        datos[i]["terubivalor"],//3
                        datos[i]['terdigver'],//4
                        datos[i]['terdatretenedor'],//5
                        datos[i]['terdatcontributivo']//6
                    ));
                }

                $('[name=btnEditar]').on('click', accionModificar);
                $('[name=btnEliminar]').on('click', accionEliminar);
                $('[name=btnUbicacion]').on('click', accionUbicacion);
            }
            waitingDialog.hide();
        }
    });
};

function doSearch(){
    var tableReg = document.getElementById('datos');
    var searchText = document.getElementById('searchTerm').value.toLowerCase();
    var cellsOfRow="";
    var found=false;
    var compareWith="";

    // Recorremos todas las filas con contenido de la tabla
    for (var i = 1; i < tableReg.rows.length; i++)
    {
        cellsOfRow = tableReg.rows[i].getElementsByTagName('td');
        found = false;
        // Recorremos todas las celdas
        for (var j = 0; j < cellsOfRow.length && !found; j++)
        {
            compareWith = cellsOfRow[j].innerHTML.toLowerCase();
            // Buscamos el texto en el contenido de la celda
            if (searchText.length == 0 || (compareWith.indexOf(searchText) > -1))
            {
                found = true;
            }
        }
        if(found)
        {
            tableReg.rows[i].style.display = '';
        } else {
            // si no ha encontrado ninguna coincidencia, esconde la
            // fila de la tabla
            tableReg.rows[i].style.display = 'none';
        }
    }
}

obtener_proveedores();

$('[name=btnRegest]').on('click', function(){
    $('[name=formularioEs]').modal()
    $('[name=formularioEs]').find('.modal-title').text("Registrar cliente");
    $('[name=formularioEs]').find('[name=nombre1]').val("");
    $('[name=formularioEs]').find('[name=nombre2]').val("");
    $('[name=formularioEs]').find('[name=apellido1]').val("");
    $('[name=formularioEs]').find('[name=apellido2]').val("");
    $('[name=formularioEs]').find('[name=numero_documento]').val("");
    $('[name=formularioEs]').find('[name=tipo_documento]').val("");
    $('[name=formularioEs]').find('[name=pais_nacimiento]').val("");
    $('[name=formularioEs]').find('[name=ciudad_nacimiento]').val("");
    $('[name=formularioEs]').find('[name=ciudad_nacimiento]').val("");
    $('[name=formularioEs]').find('[name=fecha]').val("");
    $('[name=formularioEs]').find('[name=genero]').val("");
    $('[name=formularioEs]').find('[name=correo]').val("");
});

var btnGuardar = $('[name=formularioEs]').find('[name=btnGuardar]');
btnGuardar.on('click', guardarProveedor);

$('#editar').on('click', function(){
 $(".has-error").removeClass("has-error");
 $('[name=formularioEs]').modal();
})

var modalUbicaciones = function(){
  //$('[name=formularioUbicacionesAgregar]').modal()
  $('[name=formularioUbicaciones]').css('opacity', '0')
}

//Todo lo que tiene que ver con barrio
$('#btnBarrio').on('click', function(){
  obtener_paises($('[name=modalBarrio]'))
  $('[name=modalBarrio]').modal();
})


var guardar_barrio = function(){
  var btnGuardar = $(this);
  $('[name=ciudadB]').removeAttr("disabled");
  var datos_barrio = $('[name=formBarrio]').serializeArray();
  var error = false;
  var mensajeError;
  for (var i = 0; i < datos_barrio.length; i++) {
    var label = datos_barrio[i]["name"];
    var valor = datos_barrio[i]["value"];
    var compItem = $('[name=' + label + ']');
    $(".has-error").removeClass("has-error");
    switch (label) {
      case 'nombrebarrio':
        if (valor.trim() == "") {
          mensajeError = 'El nombre del barrio es necesario.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_barrio.length + 1;
          break;
        }
      break;
    }
  }
  if (error === true) {
    $.notify({
        message: mensajeError
    }, {
        type: 'danger',
        delay: 3000,
        placement: {
            align: 'center'
        },
        z_index: 99999,
    });
    return;
  } else {
    var fd = new FormData(document.getElementById("formBarrio"));
        waitingDialog.show('Guardando los cambios, por favor espere...', {dialogSize: 'm', progressType: ''});
        btnGuardar.attr("disabled", "disabled");
        $.ajax({
          url: 'provedores_controller/guardar_barrio',
          type: 'POST',
          data: fd,
          processData: false, // tell jQuery not to process the data
          contentType: false   // tell jQuery not to set contentType
        }).done(function(data) {
            waitingDialog.hide();
            btnGuardar.removeAttr("disabled");
            btnGuardar.text('Guardar');
            $('[name=modalBarrio]').modal('hide');
            $.notify({
                message: "Guardado correctamente."
            }, {
                type: 'success',
                delay: 1000,
                placement: {
                    align: 'center'
                },
                z_index: 99999,
                onClosed: function() {
                  obtener_barrios();
                }
            });
        });
  }
}

//Fin barrio

$('[name=btnGuardarBarrio]').on('click', function(){
  guardar_barrio()
})

var guardar_barrio = function(){
  var btnGuardar = $(this);
  $('[name=ciudadB]').removeAttr("disabled");
  var datos_barrio = $('[name=formBarrio]').serializeArray();
  var error = false;
  var mensajeError;
  for (var i = 0; i < datos_barrio.length; i++) {
    var label = datos_barrio[i]["name"];
    var valor = datos_barrio[i]["value"];
    var compItem = $('[name=' + label + ']');
    $(".has-error").removeClass("has-error");
    switch (label) {
      case 'nombrebarrio':
        if (valor.trim() == "") {
          mensajeError = 'El nombre del barrio es necesario.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_barrio.length + 1;
          break;
        }
      break;
    }
  }
  if (error === true) {
    $.notify({
        message: mensajeError
    }, {
        type: 'danger',
        delay: 3000,
        placement: {
            align: 'center'
        },
        z_index: 99999,
    });
    return;
  } else {
    var fd = new FormData(document.getElementById("formBarrio"));
        waitingDialog.show('Guardando los cambios, por favor espere...', {dialogSize: 'm', progressType: ''});
        btnGuardar.attr("disabled", "disabled");
        $.ajax({
          url: 'clientes_controller/guardar_barrio',
          type: 'POST',
          data: fd,
          processData: false, // tell jQuery not to process the data
          contentType: false   // tell jQuery not to set contentType
        }).done(function(data) {
            waitingDialog.hide();
            btnGuardar.removeAttr("disabled");
            btnGuardar.text('Guardar');
            $('[name=modalBarrio]').modal('hide');
            $.notify({
                message: "Guardado correctamente."
            }, {
                type: 'success',
                delay: 1000,
                placement: {
                    align: 'center'
                },
                z_index: 99999,
                onClosed: function() {
                  obtener_barrios();
                }
            });
        });
  }
}



var btnGuardarBarrio = $('[name=formularioBarrio]').find('[name=btnGuardarBarrio]')
btnGuardarBarrio.on('click', accionBarrio);
var accionBarrio = function() {
  $('[name=formularioBarrio]').modal()
  $('[name=formularioEs]').css('opacity', '0')
  var btnGuardarBarr = $(this);
  var error = false;

  var datos = $('[name=formBarrio]').serializeArray();
  var codigo = $(this).attr('codigo')
  var compItem = $('[name=' + label + ']');
  $(".has-error").removeClass("has-error");
  for (var i = 0; i < datos.length; i++) {
    var label = datos[i]["name"];
    var valor = datos[i]["value"];
    var compItem = $('[name=' + label + ']');
    $(".has-error").removeClass("has-error");
    switch (label) {
      case 'nombrebarrio':
        if (valor.trim() == "") {
          mensajeError = 'El nombre del barrio es necesario.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos.length + 1;
          break;
        }

        break;
      }
  }
  if (error === true) {
    $.notify({
      message: mensajeError
    }, {
      type: 'danger',
      delay: 3000,
      placement: {
        align: 'center'
      },
      z_index: 99999,
    });
    return;
  } else {
    var fd = new FormData(document.getElementById("formBarrio"));
        waitingDialog.show('Guardando los cambios, por favor espere...', {dialogSize: 'm', progressType: ''});
        btnGuardarBarr.attr("disabled", "disabled");
        $.ajax({
          url: 'provedores_controller/guardar_barrio',
          type: 'POST',
          data: fd,
          processData: false, // tell jQuery not to process the data
          contentType: false   // tell jQuery not to set contentType
        }).done(function(data) {
            waitingDialog.hide();
            btnGuardarBarr.removeAttr("disabled");
            btnGuardarBarr.text('Guardar');
            $('[name=formularioBarrio]').modal('hide');
            $.notify({
                message: "Guardado correctamente."
            }, {
                type: 'success',
                delay: 1000,
                placement: {
                    align: 'center'
                },
                z_index: 99999,
                onClosed: function() {

                }
            });
        });
  }

  //$('[name=formularioBarrio]').css('opacity', 1)
}
$('[name=formularioBarrio]').on('hidden.bs.modal', function(e){
  $('[name=formularioEs]').css('opacity', '1')
})
//TOD0 LO DE UBICACIONES ESTA AQUI DEBAJO



var accionUbicacion = function(){
  $('[name=formularioUbicaciones]').modal()

  var componenteUbicaciones = $('[name=listado_ubicaciones]');
  var codigo = $(this).attr('codigo')
  $('[name=formularioUbicacionesAgregar]').find('[name=codigof]').val(codigo)

  // AQUI VAS A HACER TOD0 AFUERA DE ESTO NO


  var accionCargarForm = function(){
    $('[name=formularioUbicacionesAgregar]').modal()
  }

  //$('#barrio').css('display', 'none')

  var obtener_ubicacion = function(){
      waitingDialog.show('Cargando, por favor espere...', {dialogSize: 'm', progressType: ''});
      var modelFila = '<tr>'+
          '         <th scope="row">'+
          '            <span name="btnEliminar" codigo="{0}" title="Eliminar" '+
          '               class="text-danger" style="width: 32px; padding-left: 0px; padding-right: 0px;" role="button">'+
          '                <span class="icon icon-bin" style="font-size: 18px;"/></span>'+
          '        </th>'+
          '        <td>{0}</td>'+
          '        <td>{1}</td>'+
          '        <td>{2}</td>'+
          '    </tr>';
      $.ajax({
          url: 'provedores_controller/obtener_ubicacion',
          type: 'POST',
          data: {
              codigo: codigo
          },
          success: function(response) {
              var respuesta = $.parseJSON(response);
              componenteUbicaciones.empty();
              if (respuesta.success === true) {
                  var datos = respuesta.ubicaciones;
                  //var activo = respuesta.actv;
                  for (var i = 0; i < datos.length; i++) {
                      componenteUbicaciones.append(modelFila.format(
                          datos[i]["terubicodigo"],//0
                          datos[i]["tipdetalle"],//1
                          datos[i]["terubivalor"],//2
                      ));
                  }

                  //$('[name=btnEditar]').on('click', accionModificar);*/
                  $('[name=btnUbicacion]').on('click', accionUbicacion);
                  $('[name=btnEliminar]').on('click', accionEliminarUbicacion);
                  $('[name=btnAgrubi]').on('click', accionUbicacionForm);

              } else {
                $.notify({
                    message: "Este cliente no posee ninguna ubicación, por favor ingrese una."
                }, {
                    type: 'danger',
                    delay: 1000,
                    placement: {
                        align: 'center'
                    },
                    z_index: 99999,

                });

              }
              waitingDialog.hide();
          }
      });
  };

  var accionEliminarUbicacion = function(){
    var codigo_ubi = $(this).attr("codigo");
      bootbox.confirm({
          title: "Confirmación",
          message: "¿Está seguro que desea eliminar el registro?",
          buttons: {
              confirm: {
              label: 'Si',
              className: 'btn-'
          },
          cancel: {
              label: 'No',
              className: 'btn-danger'
          }
          },
          callback: function (result) {
              if(result===true){
                  $.ajax({
                      url: "provedores_controller/inactivar_ubicacion",
                      type:"POST",
                      data: {
                          codigo_ter: codigo,
                          codigo_ubi: codigo_ubi
                      },
                      success: function(response) {
                          var respuesta = $.parseJSON(response);
                          if (respuesta.success === true) {

                              $.notify({
                                  message: "Eliminado correctamente."
                              },{
                                  type: 'success',
                                  delay: 1000,
                                  placement: {
                                      align: 'center'
                                  },
                                  z_index: 1000,
                                  onClosed: function(){
                                    obtener_ubicacion();
                                  }
                              });
                          }
                      }
                  });
              }
          }
      });
  }

  obtener_ubicacion()


      //Limpiar formulario UBICACIONES
      var limpiar_ubicaciones = function(){
        $('[name=formularioUbicacionesAgregar]').find('[name=tipo_ubicacion]').val("")
        $('[name=formularioUbicacionesAgregar]').find('[name=descripcion]').val("")
        $('[name=formularioUbicacionesAgregar]').find('[name=pais]').val("")
        $('[name=formularioUbicacionesAgregar]').find('[name=estado]').val("")
        $('[name=formularioUbicacionesAgregar]').find('[name=ciudad]').val("")
        $('[name=formularioUbicacionesAgregar]').find('[name=barrio]').val("")
      }
      //Fin limpiar


  var accionUbicacionForm = function(){
    obtener_tiposubi()
    verifica_tipo()
    $('[name=formularioUbicacionesAgregar]').modal()
    limpiar_ubicaciones()
    $('[name=formularioUbicaciones]').css('opacity', '0')
    var codigo = $(this).attr('codigo')
    var guardarUbicacion= function(){
      var btnGuardarUbi = $(this);
      var error = false;
      var mensajeError;
      var datos_ubi = $('[name=formUbi]').serializeArray();
      var mensajeError;
      for (var i = 0; i < datos_ubi.length; i++) {
        var label = datos_ubi[i]["name"];
        var valor = datos_ubi[i]["value"];
        var compItem = $('[name=' + label + ']');
        $(".has-error").removeClass("has-error");
        switch (label) {
          case 'tipo_ubicacion':
              if (valor.trim() == "") {
                mensajeError = 'El tipo de ubicación es necesario.';
                error = true;
                compItem.focus();
                compItem.parent('div').addClass("has-error");
                i = datos_ubi.length + 1;
                break;
              }
          break;
          case 'descripcion':
            if (valor.trim() == "") {
              mensajeError = 'La descripción es necesaria.';
              error = true;
              compItem.focus();
              compItem.parent('div').addClass("has-error");
              i = datos_ubi.length + 1;
              break;
            }
          break;
          case 'pais':
            if (valor.trim() == "") {
              mensajeError = 'El pais es necesario.';
              error = true;
              compItem.focus();
              compItem.parent('div').addClass("has-error");
              i = datos_ubi.length + 1;
              break;
            }
            break;
          case 'estado':
            if (valor.trim() == "") {
              mensajeError = 'El estado es necesario.';
              error = true;
              compItem.focus();
              compItem.parent('div').addClass("has-error");
              i = datos_ubi.length + 1;
              break;
            }
          case '':
            if (valor.trim() == "") {
              mensajeError = 'La ciudad es necesaria.';
              error = true;
              compItem.focus();
              compItem.parent('div').addClass("has-error");
              i = datos_ubi.length + 1;
              break;
            }
          break;
          case '':
            if (valor.trim() == "") {
              mensajeError = 'El barrio es necesario.';
              error = true;
              compItem.focus();
              compItem.parent('div').addClass("has-error");
              i = datos_ubi.length + 1;
              break;
            }
          break;
        }
      }
      if (error === true) {
        $.notify({
            message: mensajeError
        }, {
            type: 'danger',
            delay: 3000,
            placement: {
                align: 'center'
            },
            z_index: 99999,
        });
        return;
      } else {
        var fd = new FormData(document.getElementById("formUbi"));
        waitingDialog.show('Guardando los cambios, por favor espere...', {dialogSize: 'm', progressType: ''});
        btnGuardar.attr("disabled", "disabled");
        $.ajax({
          url: 'provedores_controller/guardar_ubicacion',
          type: 'POST',
          data: fd,
          processData: false, // tell jQuery not to process the data
          contentType: false   // tell jQuery not to set contentType
        }).done(function(data) {
          waitingDialog.hide();
          btnGuardar.removeAttr("disabled");
          btnGuardar.text('Guardar');
          $('[name=modalClientes]').modal('hide');
          $.notify({
            message: "Guardado correctamente."
          }, {
            type: 'success',
            delay: 1000,
            placement: {
              align: 'center'
            },
            z_index: 99999,
            onClosed: function() {
              obtener_ubicacion();
            }
          });
        });
      }
    }


    //Obtener tipos de ubicaciones
    function obtener_tiposubi(){
      var combo=$('[name=tipo_ubicacion]');
      $.ajax({
          url: "clientes_controller/obtener_tiposubi",
          success: function(response) {
              var respuesta = $.parseJSON(response);
              if (respuesta.success === true) {
                combo.empty();
                combo.append('<option value="">Seleccione</option>')
                for (var i = 0; i < respuesta.ubi.length; i++) {
                  var item = respuesta.ubi[i];
                  combo.append('<option value="'+item["tipcodigo"]+'">'+item["tipdetalle"]+'</option>');
                }
              }
          }
      });
    }
    //Fin obtener tipos de ubicaciones

    //Obtener tipos de ubicaciones
    function obtener_tiposubi(){
      var combo=$('[name=tipo_ubicacion]');
      $.ajax({
          url: "provedores_controller/obtener_tiposubi",
          success: function(response) {
              var respuesta = $.parseJSON(response);
              if (respuesta.success === true) {
                combo.empty();
                combo.append('<option value="">Seleccione</option>')
                for (var i = 0; i < respuesta.ubi.length; i++) {
                  var item = respuesta.ubi[i];
                  combo.append('<option value="'+item["tipcodigo"]+'">'+item["tipdetalle"]+'</option>');
                }
              }
          }
      });
    }
    //Fin obtener tipos de ubicaciones

    $('[name=btnGuardarUbi]').on('click', guardarUbicacion);
    $('[name=formularioUbicacionesAgregar]').on('hidden.bs.modal', function(e){
      $('[name=formularioUbicaciones]').css('opacity', '1')
    })
//FIN UBICACIONES
  }
}
