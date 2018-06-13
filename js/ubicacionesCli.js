var controller = $('[name=modalClientes]').find('[name=controlador]').val()
//TOD0 LO DE UBICACIONES ESTA AQUI DEBAJO

var accionUbicacion = function(){

  //Obtener tipos de ubicaciones
  function obtener_tiposubi(data){
    var combo = $('[name=tipo_ubicacion]');
    $.ajax({
        url: "terceros_controller/obtener_tiposubi",
        success: function(response) {
            var respuesta = $.parseJSON(response);
            if (respuesta.success === true) {
              combo.empty();
              combo.append('<option value="">Seleccione</option>')
              for (var i = 0; i < respuesta.ubi.length; i++) {
                var item = respuesta.ubi[i];
                combo.append('<option value="'+item["tipcodigo"]+'">'+item["tipdetalle"]+'</option>');
              }
              if (data.length > 0) {
                combo.val(data)
                obtener_nombre_pais(49)
              }
            }
        }
    });
  }
  //Fin obtener tipos de ubicaciones

  obtener_ubicacion = function(){
    debugger
      //waitingDialog.show('Cargando, por favor espere...', {dialogSize: 'm', progressType: ''});
      var modelFila = '<tr>'+
          '         <th scope="row">'+
          '            <span name="btnEditar"'+
          '              codigo="{0}" detalle="{1}" ubitipo="{4}" valor="{2}" paicodigo="{8}" muncodigo="{10}" depcodigo="{9}" barcodigo="{11}"'+
          '              class="text-info" style="width: 32px; padding-left: 0px; padding-right: 0px;" title="Editar" role="button">'+
          '                <span class="icon icon-pencil" style="font-size: 18px;"/></span>'+
          '            <span name="btnEliminar" codigo="{0}" title="Eliminar" '+
          '               class="text-danger" style="width: 32px; padding-left: 0px; padding-right: 0px;" role="button">'+
          '                <span class="icon icon-bin" style="font-size: 18px;"/></span>'+
          '        </th>'+
          '        <td id="codigo">{0}</td>'+
          '        <td>{1}</td>'+
          '        <td>{2}</td>'+
          '        <td>{3}</td>'+
          '        <td>{5}</td>'+
          '        <td>{6}</td>'+
          '        <td>{7}</td>'+
          '    </tr>';
      $.ajax({
          url: 'terceros_controller/obtener_ubicacion',
          type: 'POST',
          data: {
              codigo: codigo
          },
          success: function(response) {
              var respuesta = $.parseJSON(response);
              componenteUbicaciones.empty();
              if (respuesta.success === true) {
                  var datos = respuesta.ubicaciones;
                  var nombre = '';
                  for (var i = 0; i < datos.length; i++) {
                      componenteUbicaciones.append(modelFila.format(
                          datos[i]["terubicodigo"],//0
                          datos[i]["tipdetalle"],//1
                          datos[i]["terubivalor"],//2
                          datos[i]["barnombre"],//3
                          datos[i]["terubitipo"], //4
                          datos[i]["munnombre"],//5
                          datos[i]["depnombre"],//6
                          datos[i]["painombre"],//7
                          datos[i]["paicodigo"],//8
                          datos[i]["depcodigo"],//9
                          datos[i]["muncodigo"],//10
                          datos[i]["barcodigo"]//11
                      ));
                  }

                  if (datos[0]['tertipogrupo'] == '1') {
                    nombre = datos[0]["ternombre"]
                  } else {
                    nombre = datos[0]["ternom1"] + ' ' + datos[0]["ternom2"] + ' ' + datos[0]["terape1"] + ' ' + datos[0]["terape2"]
                  }

                  var btnUbicacion = $('[name=formularioUbicaciones]').find('[name=btnUbicacion]')
                  btnUbicacion.on('click', accionUbicacion);
                  var btnEditar = $('[name=formularioUbicaciones]').find('[name=btnEditar]')
                  btnEditar.on('click', accionModificarUbicacion);
                  var btnEliminar = $('[name=formularioUbicaciones]').find('[name=btnEliminar]')
                  btnEliminar.on('click', accionEliminarUbicacion);
                  var btnAgrubi = $('[name=formularioUbicaciones]').find('[name=btnAgrubi]')
                  btnAgrubi.on('click', accionUbicacionForm);


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
              $('#nombre_clienteU').html('<p> <strong> Nombre : ' + nombre + ' </strong> </p>')
          }
      });
  };
  $('[name=formularioUbicaciones]').modal()
  var componenteUbicaciones = $('[name=listado_ubicaciones]');
  var codigo = $(this).attr('codigo')
  $('[name=formularioUbicacionesAgregar]').find('[name=codigof]').val(codigo)
  // AQUI VAS A HACER TOD0 AFUERA DE ESTO NO
  var accionEliminarUbicacion = function(){
    var invalidDelete = true;
    for (var i = 0; i < acciones.length; i++) {
      if (acciones[i]['mod_nombre'] == 'Clientes') {
        if (acciones[i]['acc_descripcion'] == 'Eliminar') {
          invalidDelete = false;
        }
      }
    }
    if (invalidDelete === true) {
      $.notify({
        message: 'Error! Usted no posee permisos para ejecutar esta acción.'
      },{
        type: 'danger',
        delay: 1000,
        placement: {
          align: 'center'
        },
        z_index: 2000
      })
    } else {
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
          if(result === true){
            $.ajax({
              url: "terceros_controller/inactivar_ubicacion",
              type:"POST",
              data: {
                codigo_ubi: codigo_ubi,
                codigo_ter: codigo
              },
              success: function(response) {
                var respuesta = $.parseJSON(response);
                if (respuesta.success === true) {
                  $.notify({
                    message: "Eliminado correctamente."
                  }, {
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
  }

  var accionModificarUbicacion = function(){
    var invalidChange = true;
    for (var i = 0; i < acciones.length; i++) {
      if (acciones[i]['mod_nombre'] == 'Clientes') {
        if (acciones[i]['acc_descripcion'] == 'Modificar') {
          invalidChange = false;
        }
      }
    }
    if (invalidChange === true) {
      $.notify({
        message: 'Error! Usted no posee permisos para ejecutar esta acción.'
      },{
        type: 'danger',
        delay: 1000,
        placement: {
          align: 'center'
        },
        z_index: 2000
      })
    } else {
      var codigo = $(this).attr("codigo");
      var detalle = $(this).attr("detalle");
      var valor = $(this).attr("valor");
      var ubitipo = $(this).attr("ubitipo");
      var paicodigo = $(this).attr("paicodigo");
      var depcodigo = $(this).attr("depcodigo");
      var muncodigo = $(this).attr("muncodigo");
      var barcodigo = $(this).attr("barcodigo");
      accionUbicacionForm(ubitipo)
      $('[name=formularioUbicacionesAgregar]').find('[name=tipoU]').val('2');
      $('[name=formularioUbicacionesAgregar]').find('[name=codigoU]').val(codigo);
      $('[name=formularioUbicacionesAgregar]').find('[name=descripcion]').val(valor);
      $('[name=formularioUbicacionesAgregar]').find('[name=tipo_ubicacion]').val(ubitipo);
      if (paicodigo !== "" && paicodigo !== "0" && paicodigo !== undefined) {
        $('[name=formularioUbicacionesAgregar]').find('#paisU').removeAttr('disabled');
        $('[name=formularioUbicacionesAgregar]').find('#estadoU').removeAttr('disabled');
        $('[name=formularioUbicacionesAgregar]').find('#ciudadU').removeAttr('disabled');
        $('[name=formularioUbicacionesAgregar]').find('#barrioU').removeAttr('disabled');
        var componente = $('[name=formularioUbicacionesAgregar]')
        obtener_paises(componente, paicodigo, depcodigo, muncodigo, barcodigo)
      }
    }
  }
  obtener_ubicacion()
  //$('#barrio').css('display', 'none')
  //Ubicaciones
  var accionUbicacionForm = function(data){
    var invalidCreate = true;
    for (var i = 0; i < acciones.length; i++) {
      if (acciones[i]['mod_nombre'] == 'Clientes') {
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
        z_index: 2000
      })
    } else {
      obtener_tiposubi(data)
      verifica_tipo()
      obtener_paises($('[name=formularioUbicacionesAgregar]'))
      limpiar_ubicaciones()
      $('[name=formularioUbicacionesAgregar]').modal()
      $('[name=formularioUbicacionesAgregar]').find('[name=descripcion]').val('');
      $('[name=formularioUbicacionesAgregar]').find('[name=tipo_ubicacion]').removeAttr('disabled');
      $('[name=formularioUbicacionesAgregar]').find('#pais').css('display', 'block');
      $('[name=formularioUbicacionesAgregar]').find('#estado').css('display', 'block');
      $('[name=formularioUbicacionesAgregar]').find('#ciudad').css('display', 'block');
      $('[name=formularioUbicacionesAgregar]').find('#barrio').css('display', 'block');
      $('[name=formularioUbicacionesAgregar]').find('#aggBarrio').css('display', 'block');
      $('[name=formularioUbicacionesAgregar]').find('#tipo_ubicacion').css('display', 'block');
      $('[name=formularioUbicaciones]').css('opacity', '0')
      var codigo = $(this).attr('codigo')
      $('[name=formularioUbicacionesAgregar]').on('hidden.bs.modal', function(e){
        $('[name=formularioUbicaciones]').css('opacity', '1')
      })
    }
}
//FIN UBICACIONES

  //Limpiar formulario UBICACIONES
  var limpiar_ubicaciones = function(){
    $('[name=formularioUbicacionesAgregar]').find('[name=tipo_ubicacion]').val("")
    $('[name=formularioUbicacionesAgregar]').find('[name=tipoU]').val('1');
    $('[name=formularioUbicacionesAgregar]').find('[name=descripcion]').val("")
    $('[name=formularioUbicacionesAgregar]').find('[name=pais]').val("")
    $('[name=formularioUbicacionesAgregar]').find('[name=estado]').val("")
    $('[name=formularioUbicacionesAgregar]').find('[name=ciudad]').val("")
    $('[name=formularioUbicacionesAgregar]').find('[name=barrio]').val("")
  }
} //Fin Accion


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
          url: 'terceros_controller/guardar_barrio',
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

//Obtener barrios
function obtener_barrios(data){
  var combo = $('[name=barrio]')
  var codigo_ciudad = $('[name=ciudad]').val()
  var codigoc = $('#ciudadU').val()
  if (codigoc !== '') {
    codigo_ciudad = codigoc
  }
  $.ajax({
    url: "terceros_controller/obtener_barrios",
    type: 'POST',
    data: {
      codigo_ciudad: codigo_ciudad
    },
    success: function(response) {
      var respuesta = $.parseJSON(response);
      combo.empty();
      combo.append('<option value="">Seleccione</option>')
      //combo.append('<option value="1">No aplica</option>')
      combo.append('<option value="0">Agregar barrio</option>')
      if (respuesta.success === true) {
        for (var i = 0; i < respuesta.barrios.length; i++) {
          var item = respuesta.barrios[i];
          combo.append('<option value="'+item["barcodigo"]+'">'+item["barnombre"]+'</option>');
        }
      }else{
        combo.empty();
        combo.append('<option value="">Seleccione</option>')
        combo.append('<option value="0">Agregar barrio</option>')
      }
      if (data.length > 0) {
        combo.val(data)
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
    $('#paisB').val(pais);
    $('#estadoB').val(estado)
    $('#ciudadB').val(ciudad)
    $('#ciudadBa').val(ciudad)
    $('[name=ciudad]').val(ciudad)
    $('[name=pais]').attr('disabled', 'disabled')
    $('[name=estado]').attr('disabled', 'disabled')
    $('[name=ciudad]').attr('disabled', 'disabled')
  } else {
    $('#aggbarrio').css('display', 'none')
    $('#paisB').val("")
    $('#estadoB').val("")
    $('#ciudadB').val("")
    $('[name=pais]').removeAttr('disabled')
    $('[name=estado]').removeAttr('disabled')
    $('[name=ciudad]').removeAttr('disabled')
  }
}
//fin mostrar casita de barrios

//VALIDAR UBICACIONES PRIMARIAS
function validar_ubipri() {
  var tipo = $('[name=formularioUbicacionesAgregar]').find('[name=tipo_ubicacion]').val()
  var tercero = $('[name=formularioUbicacionesAgregar]').find('[name=codigof]').val()
  var retorno = false;
  $.ajax({
    asyc: false,
    url: 'terceros_controller/validar_ubipri',
    type: 'POST',
    data: {
      tipo: tipo,
      tercero: tercero
    },
    success: function(response){
      var respuesta = $.parseJSON(response)
      var item = respuesta.data
      if (item === false) {
        retorno = false;
      } else {
        retorno = true;
      }
    }
  })
  return (retorno)
}
//FIN VALIDAR UBICACIONES PRIMARIAS

var guardarUbicacion = function(){
  var aux = validar_ubipri()

  var btnGuardarUbi = $(this);
  var error = false;
  var mensajeError;
  var datos_ubi = $('[name=formularioUbicacionesAgregar]').find('[name=formUbi]').serializeArray();
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
      case 'ciudad':
        if (valor.trim() == "") {
          mensajeError = 'La ciudad es necesaria.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_ubi.length + 1;
          break;
        }
      break;
      case 'barrio':
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
      url: controller+'/guardar_ubicacion',
      type: 'POST',
      data: fd,
      processData: false, // tell jQuery not to process the data
      contentType: false   // tell jQuery not to set contentType
    }).done(function(data) {
      waitingDialog.hide();
      btnGuardar.removeAttr("disabled");
      btnGuardar.text('Guardar');
      $('[name=formularioUbicacionesAgregar]').modal('hide');
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
          obtener_clientes();
        }
      });
    });
  }
}
$('[name=formularioUbicacionesAgregar]').find('[name=btnGuardarUbi]').on('click', guardarUbicacion);
  //Fin limpiar
  //Funcion verifica tipo de ubicacion
  function verifica_tipo(){
    var tipo = $('[name=tipo]').val()
    $('[name=formularioUbicacionesAgregar]').find('#oculto').css('display', 'none')
    $('[name=formularioUbicacionesAgregar]').find('#aggbarrio').css('display', 'none')
    $('[name=formularioUbicacionesAgregar]').find('[name=pais]').attr('disabled', 'disabled')
    $('[name=formularioUbicacionesAgregar]').find('[name=estado]').attr('disabled', 'disabled')
    $('[name=formularioUbicacionesAgregar]').find('[name=ciudad]').attr('disabled', 'disabled')
    $('[name=formularioUbicacionesAgregar]').find('[name=barrio]').attr('disabled', 'disabled')
    var valor = $('[name="tipo_ubicacion"]').val()
    if (valor == 2 || valor == 3 || valor == 4) {
      obtener_paises($('[name=formularioUbicacionesAgregar]'))
      $('[name=formularioUbicacionesAgregar]').find('[name=pais]').removeAttr('disabled')
      $('[name=formularioUbicacionesAgregar]').find('[name=estado]').removeAttr('disabled')
      $('[name=formularioUbicacionesAgregar]').find('[name=ciudad]').removeAttr('disabled')
      $('[name=formularioUbicacionesAgregar]').find('[name=barrio]').removeAttr('disabled')
      $('[name=formularioUbicacionesAgregar]').find('[name=pais]').css('display', 'block')
      $('[name=formularioUbicacionesAgregar]').find('[name=estado]').css('display', 'block')
      $('[name=formularioUbicacionesAgregar]').find('[name=barrio]').css('display', 'block')
      $('[name=formularioUbicacionesAgregar]').find('[name=ciudad]').css('display', 'block')
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
