//Llamado al modal ingreso de cliente
$(function() {
  $.ajax({
    url: 'facturacion_controller/obtener_clientes',
    success: function(response){
      var respuesta = $.parseJSON(response);
      var data = respuesta.data
      $("#cliente").autocomplete({
        lookup: data,
        onSelect: function(event) {
          $('[name=modalClientes]').find("#cliente").val(event.value);
          $('[name=modalClientes]').find("#cliente-id").val(event.id);
          validar_cliente()
          return false;
        }
      });
    }
  })
});
//Fin Autocompletado clientes

function validar_cliente() {
  var cliente = $('[name=modalClientes]').find('[name=cliente-id]').val();
  var retorno = '';
  $.ajax({
    url: 'facturacion_controller/validar_cliente',
    data:{
      cliente: cliente
    },
    type: 'POST',
    success: function(response){
      var respuesta = $.parseJSON(response)
      if (respuesta.success === false) {
        
        $.notify({
          message: 'Advertencia! Este cliente posee una deuda de $'+formatMoney(respuesta.total)+' en un total de '+respuesta.cant+' facturas.'
        },{
          type: respuesta.type,
          delay: 5000,
          placement: {
            align: 'center'
          },
          z_index: 9999
        })
      }
    }
  })
}

var data;
$('#registrar').on('click', function(){
  var invalidCreate = true;
  for (var i = 0; i < acciones.length; i++) {
    if (acciones[i]['mod_nombre'] == 'Gastos') {
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
    limpiar_formulario()
    obtener_tipo_suscripcion(data)
    $('[name=modalClientes]').modal();
  }
})
//Fin llamado al modal ingreso cliente

//Generar archivo excel
$('#excel').on('click', function(){
  window.open('gastos_controller/reporte_articulos')
})

//Obtener unidades
function obtener_tipo_suscripcion(data) {
  var combo=$('[name=tipo_gasto]');
  $.ajax({
      url: "gastos_controller/obtener_tipo_gastos",
      success: function(response) {
          var respuesta = $.parseJSON(response);
          if (respuesta.success === true) {
            combo.empty();
            combo.append('<option value="">Seleccione</option>')
            for (var i = 0; i < respuesta.unidades.length; i++) {
              var item = respuesta.unidades[i];
              combo.append('<option value="'+item["tipcodigo"]+'">'+item["tipdetalle"]+'</option>');
            }
            if ( data !== undefined && data.length > 1 && data !== '') {
              combo.val(data)
            }
          }
      }
  });
}
//Fin unidades

//Mostrar ayuda Iva
function mostrarAyuda(msg) {
  $.notify({
    message: msg
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
  $('[name=modalClientes]').find('.modal-title').text("Registrar Gasto");
  $('[name=modalClientes]').find('[name=dias_cantidad]').val("0");
  $('[name=modalClientes]').find('[name=cliente]').val("");
  $('[name=modalClientes]').find('[name=cliente-id]').val("");
  $('[name=modalClientes]').find('[name=fecha]').val("");
  $('[name=modalClientes]').find('[name=tipo_gasto]').val("");
  $('[name=modalClientes]').find('[name=valor]').val("");
}


//Fin funcion limpiar formulario

//Inicio funcion eliminar cliente
var accionEliminar = function(){
  var invalidDelete = true;
  for (var i = 0; i < acciones.length; i++) {
    if (acciones[i]['mod_nombre'] == 'Gastos') {
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
            url: "gastos_controller/eliminar_gasto",
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
                    obtener_gastos();
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
    if (acciones[i]['mod_nombre'] == 'Gastos') {
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
    var tiposus = $(this).attr("tiposus");
    var cantidad = $(this).attr("cantidad");
    var cantidadmin = $(this).attr("cantidadmin");
    var iva = $(this).attr("iva");
    var valor = $(this).attr("valor");
    var codigo = $(this).attr("codigo");
    obtener_tipo_suscripcion(tiposus)
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
  obtener_gastos();
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
       url: 'gastos_controller/validar_documento',
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
      case 'cliente':
        if (valor.trim() == "") {
          mensajeError = 'El cliente es necesario.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_articulos.length + 1;
          break;
        }
        break;
      case 'tipo_gasto':
        if (valor.trim() == "") {
          mensajeError = 'El tipo de gasto es necesario.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_articulos.length + 1;
          break;
        }
        break;
        case 'fecha':
          if (valor.trim() == "") {
            mensajeError = 'La fecha es necesaria.';
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
          url: 'gastos_controller/guardar_gasto',
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
                    obtener_gastos();
                }
            });
        });
  }
}
//Fin funcion guardar clientes

var obtener_gastos = function(){
    waitingDialog.show('Cargando, por favor espere...', {dialogSize: 'm', progressType: ''});
    var modelFila = '<tr class="{5}">'+
        '         <th scope="row">'+
      /*  '            <span name="btnEditar"'+
        '              codigo="{0}" nombrearticulo="{2}" descripcion="{3}" nombrecorto="{4}" grupo="{16}" familia="{15}" linea="{17}"'+
        '              marca="{18}" unidad="{19}" referencia="{1}" codigobarra="{6}" cantidad="{12}" cantidadmin="{13}" iva="{11}" valor="{20}"'+
        '              class="text-info" style="width: 32px; padding-left: 0px; padding-right: 0px;" title="Editar" role="button">'+
        '                <span class="icon icon-pencil" style="font-size: 18px;"/></span>'+*/
        '            <span name="btnEliminar" codigo="{0}" title="Eliminar" '+
        '               class="text-danger" style="width: 32px; padding-left: 0px; padding-right: 0px;" role="button">'+
        '                <span class="icon icon-bin" style="font-size: 18px;"/></span>'+
        '        </th>'+
        '        <td id="codigo">{0}</td>'+
        '        <td style="width: 300px">{1}</td>'+
        '        <td style="width: 300px">{2}</td>'+
        '        <td style="width: 300px">{3}</td>'+
        '        <td style="width: 300px">{4}</td>'+
        '    </tr>';
    $.ajax({
        url: "gastos_controller/obtener_gastos",
        success: function(response) {
            var respuesta = $.parseJSON(response);
            componenteListado.empty();
            if (respuesta.success === true) {
              var datos = respuesta.data;
              for (var i = 0; i < datos.length; i++) {
                componenteListado.append(modelFila.format(
                  datos[i]["gascodigo"],//0
                  datos[i]["tipdetalle"],//1
                  datos[i]["gasfecha"],//2
                  formatMoney(datos[i]["gasvalor"]),//3
                  datos[i]["gasestado"],//4
                  clase = datos[i]['gasestado'] == 'Inactivo'? clase = 'danger': datos[i]['gasestado'] == 'Activo'? clase = 'success': clase = '',//5
                ));
              }
              $('[name=btnEditar]').on('click', accionModificar);
              $('[name=btnEliminar]').on('click', accionEliminar);
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
obtener_gastos();

var btnGuardar = $('[name=modalClientes]').find('[name=btnGuardar]');
btnGuardar.on('click', guardarCliente);

$('#usar_suscripcion').on('click', function(){
 $(".has-error").removeClass("has-error");
 $('[name=modalPin]').modal();
 $('[name=modalPin]').find('[name=numero_documento]').val("");
})

$('[name=btnValidarPin]').on('click', function(){
  var datos_articulos = $('[name=formPin]').serializeArray();
  var error = false;
  var mensajeError;
  for (var i = 0; i < datos_articulos.length; i++) {
    var label = datos_articulos[i]["name"];
    var valor = datos_articulos[i]["value"];
    var compItem = $('[name=' + label + ']');
    $(".has-error").removeClass("has-error");
    switch (label) {
      case 'numero_documento':
        if (valor.trim() == "") {
          mensajeError = 'El número de documento es necesario.';
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
    var numero_documento = $('[name=modalPin]').find('[name=numero_documento]').val()
    $.ajax({
      url: 'gastos_controller/validar_suscripcion',
      type: 'POST',
      data: {
        numero_documento: numero_documento
      },
      success: function(response){
        var respuesta = $.parseJSON(response)
        $.notify({
            message: respuesta.msg
        }, {
            type: respuesta.type,
            delay: 3000,
            placement: {
                align: 'center'
            },
            z_index: 99999,
            onClosed: function() {
              $('[name=modalPin]').modal('hide');
            }
        });
      }
    })
  }
})
