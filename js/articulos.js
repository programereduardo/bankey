//Llamado al modal ingreso de cliente
var data;
$('#registrar').on('click', function(){
  var invalidCreate = true;
  for (var i = 0; i < acciones.length; i++) {
    if (acciones[i]['mod_nombre'] == 'Articulos') {
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
    $('[name=pais]').removeAttr('disabled')
    $('[name=estado]').removeAttr('disabled')
    $('[name=ciudad]').removeAttr('disabled')
    $('[name=barrio]').removeAttr('disabled')
    limpiar_formulario()
    obtener_lineas(data)
    obtener_grupos(data)
    obtener_marcas(data)
    obtener_familias(data)
    obtener_unidades(data)
    $('[name=modalClientes]').modal();
  }
})
//Fin llamado al modal ingreso cliente

//Generar archivo excel
$('#excel').on('click', function(){
  window.open('articulos_controller/reporte_articulos')
})
//Fin generar archivo excel
$('#btnBarrio').on('click', function(){
  obtener_paises($('[name=modalBarrio]'))
  $('[name=modalBarrio]').modal();
})

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
          url: 'articulos_controller/guardar_barrio',
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

//Obtener lineas
function obtener_lineas(data) {
  var combo=$('[name=linea]');
  $.ajax({
      url: "articulos_controller/obtener_lineas",
      success: function(response) {
          var respuesta = $.parseJSON(response);
          if (respuesta.success === true) {
            combo.empty();
            combo.append('<option value="1">No aplica</option>')
            for (var i = 0; i < respuesta.lineas.length; i++) {
              var item = respuesta.lineas[i];
              combo.append('<option value="'+item["tipcodigo"]+'">'+item["tipdetalle"]+'</option>');
            }
            if (data.length > 1) {
              combo.val(data)
            }
          }
      }
  });
}
//Fin obtener lineas

//Obtener unidades
function obtener_unidades(data) {
  var combo=$('[name=unidad]');
  $.ajax({
      url: "articulos_controller/obtener_unidades",
      success: function(response) {
          var respuesta = $.parseJSON(response);
          if (respuesta.success === true) {
            combo.empty();
            combo.append('<option value="1">No aplica</option>')
            for (var i = 0; i < respuesta.unidades.length; i++) {
              var item = respuesta.unidades[i];
              combo.append('<option value="'+item["tipcodigo"]+'">'+item["tipdetalle"]+'</option>');
            }
            if (data.length > 1) {
              combo.val(data)
            }
          }
      }
  });
}
//Fin unidades

//Obtener familias
function obtener_familias(data) {
  var combo=$('[name=familia]');
  $.ajax({
      url: "articulos_controller/obtener_familias",
      success: function(response) {
          var respuesta = $.parseJSON(response);
          if (respuesta.success === true) {
            combo.empty();
            combo.append('<option value="1">No aplica</option>')
            for (var i = 0; i < respuesta.familias.length; i++) {
              var item = respuesta.familias[i];
              combo.append('<option value="'+item["tipcodigo"]+'">'+item["tipdetalle"]+'</option>');
            }
            if (data.length > 1) {
              combo.val(data)
            }
          }
      }
  });
}
//Fin obtener familias

//Obtener marcas
function obtener_marcas(data){
  var combo=$('[name=marca]');
  $.ajax({
      url: "articulos_controller/obtener_marcas",
      success: function(response) {
          var respuesta = $.parseJSON(response);
          if (respuesta.success === true) {
            combo.empty();
            combo.append('<option value="1">No aplica</option>')
            for (var i = 0; i < respuesta.marcas.length; i++) {
              var item = respuesta.marcas[i];
              combo.append('<option value="'+item["tipcodigo"]+'">'+item["tipdetalle"]+'</option>');
            }
            if (data.length > 1) {
              combo.val(data)
            }
          }
      }
  });
}
//Fin obtener marcas

//Obtener grupos
function obtener_grupos(data){
  var combo=$('[name=grupo]');
  $.ajax({
      url: "articulos_controller/obtener_grupos",
      success: function(response) {
          var respuesta = $.parseJSON(response);
          if (respuesta.success === true) {
            combo.empty();
            combo.append('<option value="1">No aplica</option>')
            for (var i = 0; i < respuesta.grupos.length; i++) {
              var item = respuesta.grupos[i];
              combo.append('<option value="'+item["tipcodigo"]+'">'+item["tipdetalle"]+'</option>');
            }
            if (data.length > 1) {
              combo.val(data)
            }
          }
      }
  });
}
//Fin obtener grupos

//Mostrar ayuda Iva
function mostrarAyudaIva() {
  $.notify({
    message: 'Ingrese el valor del Iva sin el signo de porcentaje (%).'
  }, {
    type: 'info',
    delay: 3000,
    placement: {
      align: 'center'
    },
    z_index: 99999,
  });
}
//Fin ayuda Iva

//Mostrar ayuda valor
function mostrarAyudaValor() {
  $.notify({
    message: 'Ingrese el valor del articulo sin el signo peso ($).'
  }, {
    type: 'info',
    delay: 3000,
    placement: {
      align: 'center'
    },
    z_index: 99999,
  });
}
//Fin ayuda valor



//Funcion verifica tipo de ubicacion
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

//Funcion limpiar formulario
var limpiar_formulario = function(){
  $('[name=modalClientes]').modal()
  $('[name=modalClientes]').find('.modal-title').text("Registrar articulo");
  $('[name=modalClientes]').find('[name=codigo_cliente]').val("");
  $('[name=modalClientes]').find('[name=nombrearticulo]').val("");
  $('[name=modalClientes]').find('[name=tipo]').val("1");
  $('[name=modalClientes]').find('[name=descripcion]').val("");
  $('[name=modalClientes]').find('[name=nombrecorto]').val("");
  $('[name=modalClientes]').find('[name=grupo]').val("");
  $('[name=modalClientes]').find('[name=familia]').val("");
  $('[name=modalClientes]').find('[name=linea]').val("");
  $('[name=modalClientes]').find('[name=unidad]').val("");
  $('[name=modalClientes]').find('[name=referencia]').val("");
  $('[name=modalClientes]').find('[name=codigobarra]').val("");
  $('[name=modalClientes]').find('[name=cantidad]').val("0");
  $('[name=modalClientes]').find('[name=cantidadmin]').val("0");
  $('[name=modalClientes]').find('[name=valor]').val("0");
  $('[name=modalClientes]').find('[name=iva]').val("19");
  $('[name=modalClientes]').find('[name=marca]').val("");
  $('#correo').css('display', 'block')
  $('#pais').css('display', 'block')
  $('#ciudad').css('display', 'block')
  $('#fecha_nacimiento').css('display', 'block')
}


//Fin funcion limpiar formulario

//Inicio funcion eliminar cliente
var accionEliminar = function(){
  var invalidDelete = true;
  for (var i = 0; i < acciones.length; i++) {
    if (acciones[i]['mod_nombre'] == 'Articulos') {
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
      z_index: 1000
    })
  } else {
    var codigo = $(this).attr("codigo");
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
            url: "articulos_controller/eliminar_articulo",
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
                    obtener_articulos();
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
//Fin funcion eliminar cliente

//Inicio funcion modificar cliente
var accionModificar = function(){
  var invalidChange = true;
  for (var i = 0; i < acciones.length; i++) {
    if (acciones[i]['mod_nombre'] == 'Articulos') {
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
      z_index: 1000
    })
  } else {
    $('[name=modalClientes]').modal()
    var familia = $(this).attr("familia");
    var nombrearticulo = $(this).attr("nombrearticulo");
    var descripcion = $(this).attr("descripcion");
    var nombrecorto = $(this).attr("nombrecorto");
    var grupo = $(this).attr("grupo");
    var linea = $(this).attr("linea");
    var marca = $(this).attr("marca");
    var unidad = $(this).attr("unidad");
    var referencia = $(this).attr("referencia");
    var codigobarra = $(this).attr("codigobarra");
    var cantidad = $(this).attr("cantidad");
    var cantidadmin = $(this).attr("cantidadmin");
    var iva = $(this).attr("iva");
    var valor = $(this).attr("valor");
    var codigo = $(this).attr("codigo");
    obtener_lineas(linea)
    obtener_marcas(marca)
    obtener_grupos(grupo)
    obtener_unidades(unidad)
    obtener_familias(familia)
    $('[name=modalClientes]').find('.modal-title').text("Modificar datos del articulo");
    var btnGuardar=$('[name=modalClientes]').find('[name=btnGuardar]');
    $('[name=modalClientes]').find('[name=tipo]').val("2");
    $('[name=modalClientes]').find('[name=codigo_cliente]').val(codigo);
    $('[name=modalClientes]').find('[name=nombrearticulo]').val(nombrearticulo);
    $('[name=modalClientes]').find('[name=descripcion]').val(descripcion);
    $('[name=modalClientes]').find('[name=nombrecorto]').val(nombrecorto);
    $('[name=modalClientes]').find('[name=grupo]').val(grupo);
    $('[name=modalClientes]').find('[name=familia]').val(familia);
    $('[name=modalClientes]').find('[name=linea]').val(linea);
    $('[name=modalClientes]').find('[name=unidad]').val(unidad);
    $('[name=modalClientes]').find('[name=referencia]').val(referencia);
    $('[name=modalClientes]').find('[name=codigobarra]').val(codigobarra);
    $('[name=modalClientes]').find('[name=cantidad]').val(cantidad);
    $('[name=modalClientes]').find('[name=cantidadmin]').val(cantidadmin);
    $('[name=modalClientes]').find('[name=valor]').val(valor);
    $('[name=modalClientes]').find('[name=iva]').val(iva);
    $('[name=modalClientes]').find('[name=marca]').val(marca);
    $('#correo').css('display', 'none')
    $('#pais').css('display', 'none')
    $('#ciudad').css('display', 'none')
    $('#fecha_nacimiento').css('display', 'none')
    $('#estado').css('display', 'none')
  }
}
//Fin funcion modificar cliente

var componenteListado = $('[name=listado_articulos]');


$('[name=listar]').on('click', function(){
  obtener_articulos();
 })

 /*$('[name="fecha"]').daterangepicker({
  locale: {
  },
  minDate: '1900-01-01',
  maxDate: '3000-12-31',
  singleDatePicker: true
});*/

//Funcion calcular fecha nacimiento
$('[name="fecha"]').daterangepicker({
  singleDatePicker: true,
  showDropdowns: true,
  locale: {
    format: 'YYYY-MM-DD'
  },
  singleDatePicker: true
});
//Fin fecha nacimineto

//Inicio funcion guardar cliente
var guardarCliente = function(){
   function validar_documento() {
     $.ajax({
       url: 'articulos_controller/validar_documento',
       type: 'POST',
       data: {
         numero: numero
       },
       success: function(response) {
         var respuesta = $.parseJSON(response);
         if (respuesta.success === true) {
           mensajeError = 'El número de documento ya esta registrado';
           error = true;
           compItem.focus();
           compItem.parent('div').addClass("has-error");
         }
       }
    })
   }

  var btnGuardar = $(this);
  var datos_articulos = $('[name=formAgregarArticulo]').serializeArray();
  var error = false;
  var mensajeError;
  for (var i = 0; i < datos_articulos.length; i++) {
    var label = datos_articulos[i]["name"];
    var valor = datos_articulos[i]["value"];
    var compItem = $('[name=' + label + ']');
    $(".has-error").removeClass("has-error");
    switch (label) {
      case 'nombrearticulo':
        if (valor.trim() == "") {
          mensajeError = 'El nombre del articulo es necesario.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_articulos.length + 1;
          break;
        }
      break;
      case 'codigobarra':
          if (valor.trim() == "") {
            mensajeError = 'El codigo de barra del articulo es necesario.';
            error = true;
            compItem.focus();
            compItem.parent('div').addClass("has-error");
            i = datos_articulos.length + 1;
            break;
          }
        break;
      case 'referencia':
        if (valor.trim() == "") {
          mensajeError = 'La referencia del articulo es necesaria.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_articulos.length + 1;
          break;
        }
        break;
      case 'descripcion':
        if (valor.trim() == "") {
          mensajeError = 'La descripción del articulo es necesaria.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_articulos.length + 1;
          break;
        }
        break;
      case 'nombrecorto':
        var numero = valor.trim()
        if (valor.trim() == "") {
          mensajeError = 'El nombre corto del articulo es necesario.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_articulos.length + 1;
          break;
        }/* else {
          validar_documento();
        }*/
        break;
      case 'unidad':
        var numero = valor.trim()
        if (valor.trim() == "") {
          mensajeError = 'la unidad del articulo es necesaria.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_articulos.length + 1;
          break;
        }
      case 'linea':
        if (valor.trim() == "") {
          mensajeError = 'La linea del articulo es necesaria.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_articulos.length + 1;
          break;
        }
      break;
      case 'familia':
        if (valor.trim() == "") {
          mensajeError = 'La familia del articulo es necesaria.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_articulos.length + 1;
          break;
        }
        break;
    case 'marca':
      if (valor.trim() == "") {
        mensajeError = 'La marca del articulo es necesaria.';
        error = true;
        compItem.focus();
        compItem.parent('div').addClass("has-error");
        i = datos_articulos.length + 1;
        break;
      }
      break;
      case 'grupo':
        if (valor.trim() == "") {
          mensajeError = 'El grupo del articulo es necesario.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_articulos.length + 1;
          break;
        }
        break;
      case 'iva':
        if (valor.trim() == "") {
          mensajeError = 'El porcentaje Iva del articulo es necesario.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_articulos.length + 1;
          break;
        }
        break;
      case 'cantidad':
        if (valor.trim() == "") {
          mensajeError = 'La cantidad del articulo es necesaria.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_articulos.length + 1;
          break;
        }
        break;
      case 'cantidadmin':
        if (valor.trim() == "") {
          mensajeError = 'La cantidad minima del articulo es necesaria.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_articulos.length + 1;
          break;
        }
        break;
        case 'valor':
          if (valor.trim() == "") {
            mensajeError = 'El valor del articulo es necesario.';
            error = true;
            compItem.focus();
            compItem.parent('div').addClass("has-error");
            i = datos_articulos.length + 1;
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
    var fd = new FormData(document.getElementById("formAgregarArticulo"));
        waitingDialog.show('Guardando los cambios, por favor espere...', {dialogSize: 'm', progressType: ''});
        btnGuardar.attr("disabled", "disabled");
        $.ajax({
          url: 'articulos_controller/guardar_articulo',
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
                    obtener_articulos();
                }
            });
        });
  }
}
//Fin funcion guardar clientes

var obtener_articulos = function(){
    waitingDialog.show('Cargando, por favor espere...', {dialogSize: 'm', progressType: ''});
    var modelFila = '<tr>'+
        '         <th scope="row">'+
        '            <span name="btnEditar"'+
        '              codigo="{0}" nombrearticulo="{2}" descripcion="{3}" nombrecorto="{4}" grupo="{16}" familia="{15}" linea="{17}"'+
        '              marca="{18}" unidad="{19}" referencia="{1}" codigobarra="{6}" cantidad="{12}" cantidadmin="{13}" iva="{11}" valor="{20}"'+
        '              class="text-info" style="width: 32px; padding-left: 0px; padding-right: 0px;" title="Editar" role="button">'+
        '                <span class="icon icon-pencil" style="font-size: 18px;"/></span>'+
        '            <span name="btnEliminarCli" codigo="{0}" title="Eliminar" '+
        '               class="text-danger" style="width: 32px; padding-left: 0px; padding-right: 0px;" role="button">'+
        '                <span class="icon icon-bin" style="font-size: 18px;"/></span>'+
        '        </th>'+
        '        <td id="codigo">{0}</td>'+
        '        <td style="width: 300px">{1}</td>'+
        '        <td style="width: 300px">{2}</td>'+
        '        <td style="width: 300px">{3}</td>'+
        '        <td style="width: 300px">{4}</td>'+
        '        <td style="width: 300px">{5}</td>'+
        '        <td style="width: 300px">{6}</td>'+
        '        <td style="width: 300px">{7}</td>'+
        '        <td style="width: 300px">{8}</td>'+
        '        <td style="width: 300px">{9}</td>'+
        '        <td style="width: 300px">{10}</td>'+
        '        <td style="width: 300px">{11}</td>'+
        '        <td style="width: 300px">{12}</td>'+
        '        <td style="width: 300px">{13}</td>'+
        '        <td style="width: 300px">{14}</td>'+
        '    </tr>';
    $.ajax({
        url: "articulos_controller/obtener_articulos",
        success: function(response) {
            var respuesta = $.parseJSON(response);
            componenteListado.empty();
            if (respuesta.success === true) {
              var datos = respuesta.articulos;
              console.log(datos);
              for (var i = 0; i < datos.length; i++) {
                componenteListado.append(modelFila.format(
                  datos[i]["artcodigo"],//0
                  datos[i]["artreferencia"],//1
                  datos[i]["artnombre"],//2
                  datos[i]["artdescripcion"],//3
                  datos[i]["artresumen"],//4
                  datos[i]["unidad"],//5
                  datos[i]["artbarcode"],//6
                  datos[i]["familia"],//7
                  datos[i]["linea"],//8
                  datos[i]["marca"],//9
                  datos[i]["grupo"],//10
                  datos[i]["artporcentajeiva"],//11
                  datos[i]["artexistencias"],//12
                  datos[i]["artstock"],//13
                  formatMoney(datos[i]["artvalor"]),//14
                  datos[i]["artfamilia"],//15
                  datos[i]["artgrupo"],//16
                  datos[i]["artlinea"],//17
                  datos[i]["artmarca"],//18
                  datos[i]["artunidad"],//19
                  datos[i]["artvalor"]//20
                ));
              }

              $('[name=btnEditar]').on('click', accionModificar);
              $('[name=btnEliminarCli]').on('click', accionEliminar);
              $('[name=btnUbicacion]').on('click', accionUbicacion);
            }
            waitingDialog.hide();
        }
    });
};

//
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
obtener_articulos();

var btnGuardar = $('[name=modalClientes]').find('[name=btnGuardar]');
btnGuardar.on('click', guardarCliente);

$('#editar').on('click', function(){
 $(".has-error").removeClass("has-error");
 $('[name=modalClientes]').modal();
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
          url: 'articulos_controller/obtener_ubicacion',
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
              if(result === true){
                  $.ajax({
                      url: "articulos_controller/inactivar_ubicacion",
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

  var guardarUbicacion= function(){
    //var btnGuardarUbi = $(this);
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
        url: 'articulos_controller/guardar_ubicacion',
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


  var accionUbicacionForm = function(){
    obtener_tiposubi()
    verifica_tipo()
    $('[name=formularioUbicacionesAgregar]').modal()
    limpiar_ubicaciones()
    $('[name=formularioUbicaciones]').css('opacity', '0')
    var codigo = $(this).attr('codigo')
    $('[name=btnGuardarUbi]').on('click', guardarUbicacion);
    $('[name=formularioUbicacionesAgregar]').on('hidden.bs.modal', function(e){
      $('[name=formularioUbicaciones]').css('opacity', '1')
    })
//FIN UBICACIONES
  }

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
}
