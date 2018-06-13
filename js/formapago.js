//Inicio mostrar modal registro familias
$('#registrar').on('click', function(){
  var invalidCreate = true;
  for (var i = 0; i < acciones.length; i++) {
    if (acciones[i]['mod_nombre'] == 'Pagos') {
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
      case 'clave':
        if (valor.trim() == ''){
          mensajeError = 'La clave es necesaria.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_documento.length + 100;
          break;
        }
        break;
      case 'abreviatura':
        if (valor.trim() == ''){
          mensajeError = 'La abreviatura es necesaria.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_documento.length + 100;
          break;
        }
        break;
      case 'detalle':
      if (valor.trim() == ''){
        mensajeError = 'El detalle es necesario.';
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
    var fd = new FormData(document.getElementById('formSaveFamily'));
    $('[name=modalDocumentos]').modal('hide');
    waitingDialog.show('Guardando los datos, por favor espere...',
    {dialogSize: 'm', progressType:''});
    btnSavingDocumentos.attr('disabled', 'disabled');
    $.ajax({
      url: 'formapago_controller/guardar_tipodocumentos',
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
  }
}
//fin funcion guardar familia
//Llamado a funcion guardar familia.
$('[name=btnSavingDocumentos]').on('click', guardarDocumento);
//fin llamar funcion guardar familia


//Inicio obtener familias
var componenteListarDocumentos = $('[name=listar_documentos]');
var obtener_documentos = function(){
  waitingDialog.show('Cargando, por favor espere...', {dialogSize: 'm', progressType: ''});
  var modelFila = '<tr>'+
      '         <th scope="row">'+
      '            <span name="btnEditar" id="editar_familia"'+
      '              codigo_documento="{0}" clave_documento="{1}" abreviatura_documento="{2}" detalle_documento="{3}"'+
      '              class="text-info" style="width: 32px; padding-left: 0px; padding-right: 0px;" title="Editar" role="button">'+
      '                <span class="icon icon-pencil" style="font-size: 18px;"/></span>'+
      '            <span name="btnEliminar" codigo_documento="{0}" title="Eliminar" '+
      '               class="text-danger" style="width: 32px; padding-left: 0px; padding-right: 0px;" role="button">'+
      '                <span class="icon icon-bin" style="font-size: 18px;"/></span>'+
      '        </th>'+
      '        <td id="codigo">{0}</td>'+
      '        <td>{1}</td>'+
      '        <td>{2}</td>'+
      '        <td>{3}</td>'+
      '    </tr>';

      $.ajax({
        url: 'formapago_controller/obtener_tipodocumentos',
        success: function(response){
          var respuesta = $.parseJSON(response);
          componenteListarDocumentos.empty();
          if (respuesta.success === true) {
            var datos = respuesta.tipodocumentos;
            console.log(datos)
            for (var i = 0; i < datos.length; i++) {
              componenteListarDocumentos.append(modelFila.format(
                datos[i]['tipcodigo'], //0
                datos[i]['tipclave'], //1
                datos[i]['tipabreviatura'], //2
                datos[i]['tipdetalle'] //3
              ));
            }
            $('[name=btnEliminar]').on('click', eliminar_documento);
            $('[name=btnEditar]').on('click', modificar_documento);
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
function mostrarAyudaClave() {
  $.notify({
    message: 'Ingrese tres caracteres. Esto le ayudara a diferenciar un tipo de documento de otro.'
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

//Seccion ayuda abreviatura
function mostrarAyudaAbreviatura() {
  $.notify({
    message: 'Ingrese una abreviatura de maximo 30 caracteres.'
  }, {
    type: 'info',
    delay: 3000,
    placement: {
      align: 'center'
    },
    z_index: 99999,
  });
}
//Fin seccion ayuda abreviatura

//Seccion ayuda detalle
function mostrarAyudaDetalle() {
  $.notify({
    message: 'Ingrese un detalle de maximo 30 caracteres.'
  }, {
    type: 'info',
    delay: 3000,
    placement: {
      align: 'center'
    },
    z_index: 99999,
  });
}
//Fin seccion ayuda detalle

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
    if (acciones[i]['mod_nombre'] == 'Pagos') {
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
    var codigo_documento = $(this).attr("codigo_documento");
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
            url: 'formapago_controller/inactivar_tipodocumentos',
            type: 'POST',
            data:{
              codigo_documento: codigo_documento
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
    if (acciones[i]['mod_nombre'] == 'Pagos') {
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
    var codigo_documento = $(this).attr("codigo_documento");
    var clave_documento = $(this).attr("clave_documento");
    var abreviatura_documento = $(this).attr("abreviatura_documento");
    var detalle_documento = $(this).attr("detalle_documento");
    $('[name=modalDocumentos]').modal();
    $('[name=modalDocumentos]').find('.modal-title').text('Modificar familias');
    $('[name=modalDocumentos]').find('[name=codigo_documento]').val(codigo_documento);
    $('[name=modalDocumentos]').find('[name=clave]').val(clave_documento);
    $('[name=modalDocumentos]').find('[name=abreviatura]').val(abreviatura_documento);
    $('[name=modalDocumentos]').find('[name=detalle]').val(detalle_documento);
    $('[name=modalDocumentos]').find('[name=tipo]').val('2');
  }
}

//Fin funcion modificar familia

//Inicio funcion limpiar familia

var limpiar_documento = function(){
  $('[name=modalDocumentos]').find('[name=codigo_documento]').val("");
  $('[name=modalDocumentos]').find('[name=clave]').val("");
  $('[name=modalDocumentos]').find('[name=abreviatura]').val("");
  $('[name=modalDocumentos]').find('[name=detalle]').val("");
  $('[name=modalDocumentos]').find('[name=tipo]').val('1');
}

//Fin funcion limpiar familia
