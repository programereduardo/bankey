function tipo_registro() {
  var tipo_reg = $('[name=tipo_registro]').val()
  if (tipo_reg == 'TIPGAS') {
    $('[name=modalViaticos]').find('[name=vendedor]').attr('disabled', 'disabled')
    $('[name=modalViaticos]').find('[name=vendedor-id]').attr('disabled', 'disabled')
    $('[name=modalViaticos]').find('#vendedor').css('display', 'none')
    $('[name=modalViaticos]').find('#vendedor-id').css('display', 'none')
  }
  if (user_rol == 'Vendedor') {
    $('[name=modalViaticos]').find('[name=vendedor]').attr('disabled', 'disabled')
    $('[name=modalViaticos]').find('[name=vendedor-id]').attr('disabled', 'disabled')
    $('[name=modalViaticos]').find('#vendedor').css('display', 'none')
    $('[name=modalViaticos]').find('#vendedor-id').css('display', 'none')
  }
}

function validar_estado(data) {
  if (data !== '') {
    retorno = '';
    $.ajax({
      async: false,
      url: "viaticos_controller/validar_estado",
      type: 'POST',
      data: {
        codigo: data
      },
      success: function(response) {
        var respuesta = $.parseJSON(response);
        var item = respuesta.data
        if (item[0]['gasestado'] == 'E') {
          retorno = true
        } else {
          retorno = false
        }
      }
    })
    return (retorno)
  }
}
//Autocompletado vendedores
$(function() {
  $.ajax({
    url: 'facturacion_controller/obtener_vendedores',
    success: function(response){
      var respuesta = $.parseJSON(response);
      var data = respuesta.data
      var text = $('[name=modalViaticos]').find('[name=vendedor]')
      text.autocomplete({
        lookup: data,
        onSelect: function(event) {
          $('[name=modalViaticos]').find("#vendedor").val(event.value);
          $('[name=modalViaticos]').find("#vendedor-id").val(event.id);
        }
      });
    }
  })
});
//Fin autocompletado vendedores

//Inicio mostrar modal registro familias
$('#registrar').on('click', function(){
  var invalidCreate = true;
  for (var i = 0; i < acciones.length; i++) {
    if (acciones[i]['mod_nombre'] == titulo) {
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
    $('[name=modalViaticos]').modal();
    $('[name=modalViaticos]').find('.modal-title').text('Registrar '+ titulo);
    limpiar_viaticos();
    obtener_viaticos(false);
    mostrarAyuda('En caso de que el tipo de viatico sea Otro especifiquelo en la observacion.')
    tipo_registro()
  }
})
//Fin mostrar modal registro familias

//Obtener tipos de viaticos
var obtener_viaticos = function(data){
  var combo = $('[name="tipo_viatico"]');
  var dt = $('[name="tipo_registro"]').val();
  $.ajax({
      url: "viaticos_controller/obtener_viaticos",
      type: 'POST',
      data: {
        grupo: dt
      },
      success: function(response) {
        var respuesta = $.parseJSON(response);
        if (respuesta.success === true)
          combo.empty();
          combo.append('<option value="">Seleccione</option>')
          var cantidad = respuesta.data.length
          for (var i = 0; i < cantidad; i++) {
            var item = respuesta.data[i];
            combo.append('<option value="'+item["tipcodigo"]+'">'+item["tipdetalle"]+'</option>');
          }
          if (data !== undefined && data !== '' && data !== false) {
            if (data.length > 0) {
              combo.val(data)
            }
          }
        }
  });
}
//Fin obtener tipos de viaticos

//Obtener proveedores
var obtener_proveedores = function(data){
  var combo = $('[name="proveedor"]');
  $.ajax({
      url: "viaticos_controller/obtener_proveedores",
      success: function(response) {
        var respuesta = $.parseJSON(response);
        if (respuesta.success === true)
          combo.empty();
          combo.append('<option value="">Seleccione</option>')
          var cantidad = respuesta.data.length
          for (var i = 0; i < cantidad; i++) {
            var item = respuesta.data[i];
            combo.append('<option value="'+item["tercodigo"]+'">'+item["ternombre"]+'</option>');
          }
          if (data !== undefined && data !== '' && data !== false) {
            if (data.length > 0) {
              combo.val(data)
            }
          }
        }
  });
}
obtener_proveedores(false);
//Fin obtener proveedores

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

//Inicio funcion guardar familia
var guardarViatico = function(){
  var btnSavingViatico = $(this);
  var datos = $('[name=formSaveViatico]').serializeArray();
  var error = false;
  var mensajeError = 'Guardado correctamente.';
  for (var i = 0; i < datos.length; i++) {
    var label = datos[i]['name'];
    var valor = datos[i]['value'];
    var compItem = $('[name=' + label + ']');
    $('.has-error').removeClass('has-error');
    switch (label) {
      case 'proveedor':
        if (valor.trim() == ''){
          mensajeError = 'El proveedor es necesario.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos.length + 100;
          break;
        }
        break;
      case 'tipo_viatico':
        if (valor.trim() == ''){
          mensajeError = 'El tipo de viatico es necesario.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos.length + 100;
          break;
        }
        break;
      case 'total':
        if (valor.trim() == ''){
          mensajeError = 'El valor total del viatico es necesario.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos.length + 100;
          break;
        }
        break;
      case 'factura':
        if (valor.trim() == ''){
          mensajeError = 'La factura es necesaria.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos.length + 100;
          break;
        }
        break;
      case 'vendedor':
        if (valor.trim() == ''){
          mensajeError = 'El vendedor es necesario.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos.length + 100;
          break;
        }
        break;
      case 'vendedor-id':
        if (valor.trim() == ''){
          mensajeError = 'Error! El vendedor no se encuentra registrado.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos.length + 100;
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
    var codigo_viatico = $('[name=modalViaticos]').find('[name=codigo_viatico]').val()
    var estado = validar_estado(codigo_viatico)
    if (estado) {
      var fd = new FormData(document.getElementById('formSaveViatico'));
      $('[name=modalViaticos]').modal('hide');
      waitingDialog.show('Guardando los datos, por favor espere...',
      {dialogSize: 'm', progressType:''});
      btnSavingViatico.attr('disabled', 'disabled');
      $.ajax({
        url: 'viaticos_controller/guardar_viatico',
        type: 'POST',
        data: fd,
        processData: false,
        contentType: false
      }).done(function(data){
        waitingDialog.hide();
        btnSavingViatico.removeAttr('disabled');
        $.notify({
          message: mensajeError
        }, {
          type: 'success',
          delay: 1000,
          placement: {
            align: 'center'
          },
          z_index: 99999,
          onClosed: function(){
            listar_viaticos()
          }
        })
      })
    } else {
      $.notify({
        message: 'Este registro ya ha sido finalizado, no se puede editar.'
      },{
        type: 'danger',
        delay: 1000,
        placement: {
          align: 'center'
        },
        z_index: 99999,
      })
    }
  }
}
//fin funcion guardar familia
//Llamado a funcion guardar familia.
$('[name=btnSavingViatico]').on('click', guardarViatico);
//fin llamar funcion guardar familia
var id = ''
if (user_rol == "Vendedor") {
  $('#ide').css('display', 'none')
  $('#name').css('display', 'none')
  id = "codigo"
}
//Inicio obtener familias
var componenteListarViaticos = $('[name=listar_viaticos]');
var listar_viaticos = function(){
  var display = '';
  if (user_rol == 'Vendedor') {
    display = 'none';
  }
  waitingDialog.show('Cargando, por favor espere...', {dialogSize: 'm', progressType: ''});
  var dt = $('[name="tipo_registro"]').val();
  var modelFila = '<tr class="{14}">'+
                  '   <th scope="row" style="display:'+display+'">'+
                  '            <span name="btnEditar"'+
                  '             codigo_viatico="{0}" vendedor="{2}" vendedor-id="{16}" proveedor="{17}" tipo="{15}" fecha="{11}" iva="{19}"'+
                  '             reteiva="{20}" reteica="{21}" retefuente="{22}" subtotal="{18}" total="{23}" observacion="{12}" factura="{24}"'+
                  '              class="text-info" style="width: 32px; padding-left: 0px; padding-right: 0px;" title="Editar" role="button">'+
                  '                <span class="icon icon-pencil" style="font-size: 18px;"/></span>'+
                  '     <span name="btnEliminar" codigo_viatico="{0}" title="Eliminar" '+
                  '       class="text-danger" style="width: 32px; padding-left: 0px; padding-right: 0px;" role="button">'+
                  '     <span class="icon icon-bin" style="font-size: 18px;"/></span>'+
                  '     <span name="btnFinalizar" codigo_viatico="{0}" title="Finalizar" '+
                  '       class="text-success" style="width: 32px; padding-left: 0px; padding-right: 0px;" role="button">'+
                  '     <span class="glyphicon glyphicon-ok" style="font-size: 18px;"/></span>'+
                  '   </th>'+
                  '   <td>{1}</td>'+
                  '   <td>{2}</td>'+
                  '   <td>{3}</td>'+
                  '   <td>{4}</td>'+
                  '   <td>{24}</td>'+
                  '   <td>{5}</td>'+
                  '   <td>{6}</td>'+
                  '   <td>{7}</td>'+
                  '   <td>{8}</td>'+
                  '   <td>{9}</td>'+
                  '   <td>{10}</td>'+
                  '   <td>{11}</td>'+
                  '   <td>{12}</td>'+
                  '   <td>{13}</td>'+
                  '</tr>';

      $.ajax({
        url: 'viaticos_controller/listar_viaticos',
        type: 'POST',
        data: {
          grupo: dt
        },
        success: function(response){
          var respuesta = $.parseJSON(response);
          componenteListarViaticos.empty();
          if (respuesta.success === true) {
            var datos = respuesta.data;
            for (var i = 0; i < datos.length; i++) {
              componenteListarViaticos.append(modelFila.format(
                datos[i]['gascodigo'], //0
                datos[i]['terdocnum'], //1
                datos[i]['ternombre'], //2
                datos[i]['nombre_proveedor'], //3
                datos[i]['tipdetalle'], //4
                formatMoney(datos[i]['gassubtotal']),//5
                formatMoney(datos[i]['gasiva']),//6
                formatMoney(datos[i]['gasreteiva']),//7
                formatMoney(datos[i]['gasreteica']),//8
                formatMoney(datos[i]['gasretefuente']),//9
                formatMoney(datos[i]['gastotal']),//10
                datos[i]['gasfecha'],//11
                datos[i]['gasobservacion'],//12
                datos[i]['gasestado'],//13
                clase = datos[i]['gasestado'] == 'Anulado'? clase = 'danger': datos[i]['gasestado'] == 'Finalizado'? clase = 'success': datos[i]['gasestado'] == 'En revisión'? clase = 'warning': clase = '',//14
                datos[i]['tipcodigo'],//15
                datos[i]['tercodigo'],//16
                datos[i]['codigo_proveedor'],//17
                datos[i]['gassubtotal'],//18
                datos[i]['gasiva'],//19
                datos[i]['gasreteiva'],//20
                datos[i]['gasreteica'],//21
                datos[i]['gasretefuente'],//22
                datos[i]['gastotal'],//23
                datos[i]['gasfactura'],//24
            ))
          }
          $('[name=btnEliminar]').on('click', accion);
          $('[name=btnEditar]').on('click', modificar);
          $('[name=btnFinalizar]').on('click', accion);
        }
        waitingDialog.hide();
      }
    })
}
//Fin obtener familias

//Llamado a la funcion obtener familias
listar_viaticos();
//Fin llamado a la funcion obtener familias

//Inicio mostrar ayuda
//Seccion ayuda fecha
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
//Fin seccion ayuda fecha
//Fin mostrar ayuda

//Inicio funcion convertir a mayusculas
function aMayusculas(obj,id){
  obj = obj.toUpperCase();
  document.getElementById(id).value = obj;
}
//Fin funcion convertir a mayusculas

//Inicio funcion buscar
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

//Fin funcion buscar

//Inicio funcion accion

var accion = function(){
  var invalidDelete = true;
  for (var i = 0; i < acciones.length; i++) {
    if (acciones[i]['mod_nombre'] == titulo) {
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
    var codigo_viatico = $(this).attr("codigo_viatico");
    var name = $(this).attr('name')
    if (name == 'btnEliminar') {
      msg = "¿Está seguro que desea eliminar el registro?"
      data = 'N'
    } else if (name == 'btnFinalizar') {
      msg = "¿Está seguro que desea finalizar el registro?"
      data = 'F'
    }
    var estado = validar_estado(codigo_viatico)
    if (estado) {
      bootbox.confirm({
        title: 'Confirmación',
        message: msg,
        buttons: {
          confirm: {
            label: "Si",
            className: "btn-"
          },
          cancel: {
            label: "No",
            className: "btn-danger"
          }
        },
        callback: function(result){
          if (result === true) {
            $.ajax({
              url: 'viaticos_controller/accion',
              type: 'POST',
              data:{
                codigo_viatico: codigo_viatico,
                data: data
              },
              success: function(response){
                var respuesta = $.parseJSON(response);
                if (respuesta.success === true) {
                  $.notify({
                    message: respuesta.msg
                  },{
                    type: 'success',
                    delay: 1000,
                    placement: {
                      align: 'center'
                    },
                    z_index: 99999,
                    onClosed: function(){
                      listar_viaticos()
                    }
                  })
                }
              }
            })
          }
        }
      })
    } else {
      $.notify({
        message: 'Este registro ya ha sido finalizado, no se puede editar.'
      },{
        type: 'danger',
        delay: 1000,
        placement: {
          align: 'center'
        },
        z_index: 99999,
      })
    }
  }
}
//Fin funcion accion


//Inicio funcion modificar familia

var modificar = function() {
  var invalidChange = true;
  for (var i = 0; i < acciones.length; i++) {
    if (acciones[i]['mod_nombre'] == titulo) {
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
    var codigo_viatico = $(this).attr("codigo_viatico");
    var vendedor = $(this).attr("vendedor");
    var vendedor_id = $(this).attr("vendedor-id");
    var proveedor = $(this).attr("proveedor");
    var tipo = $(this).attr("tipo");
    var fecha = $(this).attr("fecha");
    var iva = $(this).attr("iva");
    var reteiva = $(this).attr("reteiva");
    var reteica = $(this).attr("reteica");
    var retefuente = $(this).attr("retefuente");
    var subtotal = $(this).attr("subtotal");
    var total = $(this).attr("total");
    var observacion = $(this).attr("observacion");
    var factura = $(this).attr("factura");
    if (observacion == 'Información no suministrada.' ) {
      observacion = '';
    }
    obtener_viaticos(tipo);
    obtener_proveedores(proveedor);
    $('[name=modalViaticos]').modal();
    $('[name=modalViaticos]').find('.modal-title').text('Modificar '+ titulo);
    $('[name=modalViaticos]').find('[name=codigo_viatico]').val(codigo_viatico);
    $('[name=modalViaticos]').find('[name=vendedor]').val(vendedor);
    $('[name=modalViaticos]').find('[name=vendedor-id]').val(vendedor_id);
    $('[name=modalViaticos]').find('[name=fecha]').val(fecha);
    $('[name=modalViaticos]').find('[name=iva]').val(iva);
    $('[name=modalViaticos]').find('[name=reteiva]').val(reteiva);
    $('[name=modalViaticos]').find('[name=retefuente]').val(retefuente);
    $('[name=modalViaticos]').find('[name=reteica]').val(reteica);
    $('[name=modalViaticos]').find('[name=subtotal]').val(subtotal);
    $('[name=modalViaticos]').find('[name=total]').val(total);
    $('[name=modalViaticos]').find('[name=factura]').val(factura);
    $('[name=modalViaticos]').find('[name=observacion]').val(observacion);
    $('[name=modalViaticos]').find('[name=tipo]').val('2');
  }
}

//Fin funcion modificar familia

//Inicio funcion limpiar familia

var limpiar_viaticos = function(){
  var hoy = new Date().toJSON().slice(0,10)
  $('[name=modalViaticos]').find('[name=codigo_viatico]').val("");
  $('[name=modalViaticos]').find('[name=tipo_viatico]').val("");
  $('[name=modalViaticos]').find('[name=fecha]').val(hoy);
  $('[name=modalViaticos]').find('[name=observacion]').val("");
  $('[name=modalViaticos]').find('[name=proveedor]').val("");
  $('[name=modalViaticos]').find('[name=factura]').val("");
  $('[name=modalViaticos]').find('[name=vendedor-id]').val("");
  $('[name=modalViaticos]').find('[name=vendedor]').val("");
  $('[name=modalViaticos]').find('[name=total]').val("");
  $('[name=modalViaticos]').find('[name=iva]').val("0");
  $('[name=modalViaticos]').find('[name=reteiva]').val("0");
  $('[name=modalViaticos]').find('[name=reteica]').val("0");
  $('[name=modalViaticos]').find('[name=retefuente]').val("0");
  $('[name=modalViaticos]').find('[name=subtotal]').val("0");
  $('[name=modalViaticos]').find('[name=tipo]').val('1');
}

//Fin funcion limpiar familia
