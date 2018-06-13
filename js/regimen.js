//Inicio mostrar modal registro Regimen
$('#registrar').on('click', function(){
  var invalidCreate = true;
  for (var i = 0; i < acciones.length; i++) {
    if (acciones[i]['mod_nombre'] == 'Regimen') {
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
    $('[name=modalRegimen]').modal();
    limpiar_actividad();
  }
})
//Fin mostrar modal registro Regimen

//Inicio funcion guardar Regimen
var guardarRegimen = function(){
  var btnSavingRegimen = $(this);
  var datos_documento = $('[name=formSaveActividad]').serializeArray();
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
    var fd = new FormData(document.getElementById('formSaveActividad'));
    $('[name=modalRegimen]').modal('hide');
    waitingDialog.show('Guardando los datos, por favor espere...',
    {dialogSize: 'm', progressType:''});
    btnSavingRegimen.attr('disabled', 'disabled');
    $.ajax({
      url: 'tiporegimen_controller/guardar_regimen',
      type: 'POST',
      data: fd,
      processData: false,
      contentType: false
    }).done(function(data){
      waitingDialog.hide();
      btnSavingRegimen.removeAttr('disabled');
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
          obtener_regimen()
        }
      })
    })
  }
}
//fin funcion guardar regimen
//Llamado a funcion guardar regimen.
$('[name=btnSavingRegimen]').on('click', guardarRegimen);
//fin llamar funcion guardar Regimen


//Inicio obtener Regimen
var componenteListarRegimen = $('[name=listar_regimen]');
var obtener_regimen = function(){
  waitingDialog.show('Cargando, por favor espere...', {dialogSize: 'm', progressType: ''});
  var modelFila = '<tr>'+
      '         <th scope="row">'+
      '            <span name="btnEditar" id="editar_regimen"'+
      '              codigo_regimen="{0}" clave_actividad="{1}" abreviatura_actividad="{2}" detalle_actividad="{3}"'+
      '              class="text-info" style="width: 32px; padding-left: 0px; padding-right: 0px;" title="Editar" role="button">'+
      '                <span class="icon icon-pencil" style="font-size: 18px;"/></span>'+
      '            <span name="btnEliminar" codigo_regimen="{0}" title="Eliminar" '+
      '               class="text-danger" style="width: 32px; padding-left: 0px; padding-right: 0px;" role="button">'+
      '                <span class="icon icon-bin" style="font-size: 18px;"/></span>'+
      '        </th>'+
      '        <td id="codigo">{0}</td>'+
      '        <td>{1}</td>'+
      '        <td>{2}</td>'+
      '        <td>{3}</td>'+
      '    </tr>';

      $.ajax({
        url: 'tiporegimen_controller/obtener_regimen',
        success: function(response){
          var respuesta = $.parseJSON(response);
          componenteListarRegimen.empty();
          if (respuesta.success === true) {
            var datos = respuesta.regimen;
            console.log(datos)
            for (var i = 0; i < datos.length; i++) {
              componenteListarRegimen.append(modelFila.format(
                datos[i]['tipcodigo'], //0
                datos[i]['tipclave'], //1
                datos[i]['tipabreviatura'], //2
                datos[i]['tipdetalle'] //3
              ));
            }
            $('[name=btnEliminar]').on('click', eliminar_actividad);
            $('[name=btnEditar]').on('click', modificar_actividad);
          }
          waitingDialog.hide();
        }
      })
}
//Fin obtener Regimen

//Llamado a la funcion obtener Regimen
obtener_regimen();
//Fin llamado a la funcion obtener regimen

//Inicio mostrar ayuda
//Seccion ayuda clave
function mostrarAyudaClave() {
  $.notify({
    message: 'Ingrese tres caracteres. Esto le ayudara a diferenciar un tipo de actividad de otra.'
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
    message: 'Ingrese una abreviatura de maximo 20 caracteres.'
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

//Inicio funcion eliminar_actividad

var eliminar_actividad = function(){
  var invalidDelete = true;
  for (var i = 0; i < acciones.length; i++) {
    if (acciones[i]['mod_nombre'] == 'Regimen') {
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
    var codigo_regimen = $(this).attr("codigo_regimen");
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
            url: 'tiporegimen_controller/inactivar_regimen',
            type: 'POST',
            data:{
              codigo_regimen: codigo_regimen
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
                    obtener_regimen()
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


//Inicio funcion modificar regimen

var modificar_actividad = function() {
  var invalidChange = true;
  for (var i = 0; i < acciones.length; i++) {
    if (acciones[i]['mod_nombre'] == 'Regimen') {
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
    var codigo_regimen = $(this).attr("codigo_regimen");
    var clave_actividad = $(this).attr("clave_actividad");
    var abreviatura_actividad = $(this).attr("abreviatura_actividad");
    var detalle_actividad = $(this).attr("detalle_actividad");
    $('[name=modalRegimen]').modal();
    $('[name=modalRegimen]').find('.modal-title').text('Modificar regimen');
    $('[name=modalRegimen]').find('[name=codigo_regimen]').val(codigo_regimen);
    $('[name=modalRegimen]').find('[name=clave]').val(clave_actividad);
    $('[name=modalRegimen]').find('[name=abreviatura]').val(abreviatura_actividad);
    $('[name=modalRegimen]').find('[name=detalle]').val(detalle_actividad);
    $('[name=modalRegimen]').find('[name=tipo]').val('2');
  }
}

//Fin funcion modificar regimen

//Inicio funcion limpiar regimen

var limpiar_actividad = function(){
  $('[name=modalRegimen]').find('[name=codigo_regimen]').val("");
  $('[name=modalRegimen]').find('[name=clave]').val("");
  $('[name=modalRegimen]').find('[name=abreviatura]').val("");
  $('[name=modalRegimen]').find('[name=detalle]').val("");
  $('[name=modalRegimen]').find('[name=tipo]').val('1');
}

//Fin funcion limpiar regimen
