//Inicio mostrar modal registro familias
$('#registrar').on('click', function(){
  var invalidCreate = true;
  for (var i = 0; i < acciones.length; i++) {
    if (acciones[i]['mod_nombre'] == modulo) {
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
    $('[name=modalDocumentos]').modal();
    limpiar_documento();
    obtener_articulos();
    $('[name=modalDocumentos]').find('[name=cliente]').removeAttr('disabled')
    $('[name=modalDocumentos]').find('[name=cliente-id]').removeAttr('disabled')
    $('[name=modalDocumentos]').find('[name=vendedor]').removeAttr('disabled')
    $('[name=modalDocumentos]').find('[name=vendedor-id]').removeAttr('disabled')
    $('[name=modalDocumentos]').find('[name=producto]').removeAttr('disabled')
    $('[name=modalDocumentos]').find('#pro').css('display', 'block')
    $('[name=modalDocumentos]').find('#ven').css('display', 'block')
    $('[name=modalDocumentos]').find('#cli').css('display', 'block')
  }
})
//Fin mostrar modal registro familias

//Inicio funcion guardar familia
var guardarDocumento = function(){
  var btnSavingDocumentos = $(this);
  var datos_documento = $('[name=formSaveFamily]').serializeArray();
  var error = false;
  var mensajeError = 'Guardado correctamente.';
  for (var i = 0; i < datos_documento.length; i++) {
    var label = datos_documento[i]['name'];
    var valor = datos_documento[i]['value'];
    var compItem = $('[name=' + label + ']');
    $('.has-error').removeClass('has-error');
    switch (label) {
      case 'cliente':
        if (valor.trim() == ''){
          mensajeError = 'El cliente es necesario.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_documento.length + 100;
          break;
        }
        break;
      case 'vendedor':
        if (valor.trim() == ''){
          mensajeError = 'El vendedor es necesario.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_documento.length + 100;
          break;
        }
        break;
      case 'producto':
      if (valor.trim() == ''){
        mensajeError = 'El producto es necesario.';
        error = true;
        compItem.focus();
        compItem.parent('div').addClass("has-error");
        i = datos_documento.length + 100;
        break;
      }
      break;
      case 'existencia_actual':
      if (valor.trim() == ''){
        mensajeError = 'La existencia actual es necesario.';
        error = true;
        compItem.focus();
        compItem.parent('div').addClass("has-error");
        i = datos_documento.length + 100;
        break;
      }
      break;
      case 'pedidos':
      if (valor.trim() == ''){
        mensajeError = 'El valor de pedidos es necesario.';
        error = true;
        compItem.focus();
        compItem.parent('div').addClass("has-error");
        i = datos_documento.length + 100;
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
    next = validar_registro();
    var tip = $('[name=modalDocumentos]').find('[name=tipo]').val();
    if (tip == '2') {
      next = true;
    }
    if (next === true) {
      var fd = new FormData(document.getElementById('formSaveFamily'));
      $('[name=modalDocumentos]').modal('hide');
      waitingDialog.show('Guardando los datos, por favor espere...',
      {dialogSize: 'm', progressType:''});
      btnSavingDocumentos.attr('disabled', 'disabled');
      $.ajax({
        url: 'control_controller/guardar_control',
        type: 'POST',
        data: fd,
        processData: false,
        contentType: false
      }).done(function(data){
        waitingDialog.hide();
        btnSavingDocumentos.removeAttr('disabled');
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
            obtener_documentos()
          }
        })
      })
    } else {
      $.notify({
        message: 'Este registro ya ha sido ingresado, busquelo y actualicelo.'
      }, {
        type: 'danger',
        delay: 1000,
        placement: {
          align: 'center'
        },
        z_index: 99999
      })
    }
  }
}
//fin funcion guardar familia
//Llamado a funcion guardar familia.
$('[name=btnSavingDocumentos]').on('click', guardarDocumento);
//fin llamar funcion guardar familia

var validar_registro = function(){
  var producto = $('[name=modalDocumentos]').find('[name=producto]').val()
  var vendedor = $('[name=modalDocumentos]').find('[name=vendedor-id]').val()
  var cliente = $('[name=modalDocumentos]').find('[name=cliente-id]').val()
  var tercero = '';
  if (cliente !== '' && cliente !== '') {
    tercero = cliente;
  } else {
    tercero = vendedor;
  }
  retorno = '';
  $.ajax({
    async: false,
    url: "control_controller/validar_registro",
    type: 'POST',
    data: {
      producto: producto,
      tercero: tercero
    },
    success: function(response) {
      var respuesta = $.parseJSON(response);
      var item = respuesta.data
      if (item === 2) {
        retorno = false
      } else {
        retorno = true
      }
    }
  })
  return (retorno)
}
//Inicio obtener familias
var componente = $('[name=listar_datos]');
var obtener_documentos = function(){
  var tipo = $('[name=modalDocumentos]').find('[name=tipo_tercero]').val();
  waitingDialog.show('Cargando, por favor espere...', {dialogSize: 'm', progressType: ''});
  var modelFila = '<tr>'+
      '         <th scope="row">'+
      '            <span name="btnEditar" id="btnEditar"'+
      '              codigo="{0}" entran="{1}" salen="{2}"'+
      '              class="text-info" style="width: 32px; padding-left: 0px; padding-right: 0px;" title="Editar" role="button">'+
      '                <span class="icon icon-pencil" style="font-size: 18px;"/></span>'+
      '            <span name="btnEliminar" codigo="{0}" title="Eliminar" '+
      '               class="text-danger" style="width: 32px; padding-left: 0px; padding-right: 0px;" role="button">'+
      '                <span class="icon icon-bin" style="font-size: 18px;"/></span>'+
      '        </th>'+
      '        <td id="codigo">{0}</td>'+
      '        <td>{5}</td>'+
      '        <td>{6}</td>'+
      '        <td>{3}</td>'+
      '        <td>{4}</td>'+
      '        <td>{1}</td>'+
      '        <td>{2}</td>'+
      '        <td>{7}</td>'+
      '    </tr>';

      $.ajax({
        url: 'control_controller/obtener_control',
        type: 'POST',
        data: {
          tipo: tipo
        },
        success: function(response){
          var respuesta = $.parseJSON(response);
          componente.empty();
          if (respuesta.success === true) {
            var datos = respuesta.data;
            for (var i = 0; i < datos.length; i++) {
              componente.append(modelFila.format(
                datos[i]['invconcodigo'],//0
                datos[i]['invconexistencias'],//1
                datos[i]['invconpedidos'],//2
                datos[i]['artdescripcion'],//3
                datos[i]['invconfecha'],//4
                datos[i]['terdocnum'],//5
                datos[i]['ternombre'],//6
                restante = datos[i]['invconexistencias'] + datos[i]['invconpedidos']
              ));
            }
            $('[name=btnEditar]').on('click', modificar_documento);
            $('[name=btnEliminar]').on('click', eliminar_documento);
          }
          waitingDialog.hide();
        }
      })
}
//Fin obtener familias

//Llamado a la funcion obtener familias
obtener_documentos();
//Fin llamado a la funcion obtener familias

//Inicio mostrar ayuda
//Seccion ayuda clave
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
//Fin seccion ayuda clave

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

//Inicio funcion eliminar_documento

var eliminar_documento = function(){
  var invalidDelete = true;
  for (var i = 0; i < acciones.length; i++) {
    if (acciones[i]['mod_nombre'] == modulo) {
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
      title: 'Confirmación',
      message: "¿Está seguro que desea eliminar el registro?",
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
            url: 'control_controller/inactivar_control',
            type: 'POST',
            data:{
              codigo: codigo
            },
            success: function(response){
              var respuesta = $.parseJSON(response);
              if (respuesta.success === true) {
                $.notify({
                  message: 'Eliminado correctamente.'
                },{
                  type: 'success',
                  delay: 1000,
                  placement: {
                    align: 'center'
                  },
                  z_index: 1000,
                  onClosed: function(){
                    obtener_documentos()
                  }
                })
              }
            }
          })
        }
      }
    })
  }
}

//Fin funcion eliminar


//Inicio funcion modificar familia

var modificar_documento = function() {
  var invalidChange = true;
  for (var i = 0; i < acciones.length; i++) {
    if (acciones[i]['mod_nombre'] == modulo) {
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
    limpiar_documento();
    var codigo = $(this).attr("codigo");
    var entran = $(this).attr("entran");
    var salen = $(this).attr("salen");
    $('[name=modalDocumentos]').find('.modal-title').text('Modificar Control');
    $('[name=modalDocumentos]').find('[name=codigo_control]').val(codigo);
    $('[name=modalDocumentos]').find('[name=tipo]').val('2');
    $('[name=modalDocumentos]').find('[name=cliente]').attr('disabled', 'disabled')
    $('[name=modalDocumentos]').find('[name=cliente-id]').attr('disabled', 'disabled')
    $('[name=modalDocumentos]').find('[name=vendedor]').attr('disabled', 'disabled')
    $('[name=modalDocumentos]').find('[name=vendedor-id]').attr('disabled', 'disabled')
    $('[name=modalDocumentos]').find('[name=producto]').attr('disabled', 'disabled')
    $('[name=modalDocumentos]').find('#pro').css('display', 'none')
    $('[name=modalDocumentos]').find('#ven').css('display', 'none')
    $('[name=modalDocumentos]').find('#cli').css('display', 'none')
    $('[name=modalDocumentos]').find('[name=entran]').val(entran);
    $('[name=modalDocumentos]').find('[name=salen]').val(salen)
    $('[name=modalDocumentos]').modal();
  }
}

//Fin funcion modificar familia

//Inicio funcion limpiar familia

var limpiar_documento = function(){
  $('[name=modalDocumentos]').find('#vendedor').val("");
  $('[name=modalDocumentos]').find('#vendedor-id').val("");
  $('[name=modalDocumentos]').find('#cliente').val("");
  $('[name=modalDocumentos]').find('#cliente-id').val("");
  $('[name=modalDocumentos]').find('[name=producto]').val("");
  //$('[name=modalDocumentos]').find('[name=fecha]').val("");
  $('[name=modalDocumentos]').find('[name=entran]').val("0");
  $('[name=modalDocumentos]').find('[name=salen]').val("0")
  $('[name=modalDocumentos]').find('[name=codigo_control]').val("");
}

//Fin funcion limpiar familia

//Autocompletado vendedores
$(function() {
  $.ajax({
    url: 'facturacion_controller/obtener_vendedores',
    success: function(response){
      var respuesta = $.parseJSON(response);
      var data = respuesta.data
      $("#vendedor").autocomplete({
        lookup: data,
        onSelect: function(event) {
          $("#vendedor").val(event.value);
          $("#vendedor-id").val(event.id);
        }
      });
    }
  })
});
//Fin autocompletado vendedores

//Autocompletado clientes
$(function() {
  $.ajax({
    url: 'facturacion_controller/obtener_clientes',
    success: function(response){
      var respuesta = $.parseJSON(response);
      var data = respuesta.data
      $("#cliente").autocomplete({
        lookup: data,
        onSelect: function(event) {
          $("#cliente").val(event.value);
          $("#cliente-id").val(event.id);
          return false;
        }
      });
    }
  })
});
//Fin Autocompletado clientes

//Obtener articulos
obtener_articulos = function(){
  var combo = $('[name=modalDocumentos]').find('#producto');
  $.ajax({
      url: "facturacion_controller/obtener_articulos",
      success: function(response) {
          var respuesta = $.parseJSON(response);
          if (respuesta.success === true) {
            combo.empty();
            combo.append('<option value="">Seleccione</option>')
            for (var i = 0; i < respuesta.articulos.length; i++) {
              var item = respuesta.articulos[i];
              combo.append('<option value="'+item["artcodigo"]+'">'+item["artreferencia"]+' - '+item['artdescripcion']+'</option>');
            }
          }
      }
  });
}
//Fin obtener articulos

$('[name=fecha]').daterangepicker({
  singleDatePicker: true,
  showDropdowns: true,
  startDate: moment(),
  locale: {
    format: 'YYYY-MM-DD'
  },
  singleDatePicker: true
});
