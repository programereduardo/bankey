//Inicio mostrar modal registro familias
$('#registrar').on('click', function(){
  var invalidCreate = true;
  for (var i = 0; i < acciones.length; i++) {
    if (acciones[i]['mod_nombre'] == 'Unidades') {
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
    $('[name=modalUnidades]').modal();
    limpiar_unidad();
  }
})
//Fin mostrar modal registro familias

//Inicio funcion guardar unidad
var guardarunidad = function(){
  var btnSavingUnidades = $(this);
  var datos_unidad = $('[name=formSaveUnidades]').serializeArray();
  var error = false;
  var mensajeError = 'Guardado correctamente.';
  for (var i = 0; i < datos_unidad.length; i++) {
    var label = datos_unidad[i]['name'];
    var valor = datos_unidad[i]['value'];
    var compItem = $('[name=' + label + ']');
    $('.has-error').removeClass('has-error');
    switch (label) {
      case 'clave':
        if (valor.trim() == ''){
          mensajeError = 'La clave es necesaria.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_unidad.length + 100;
          break;
        }
        break;
      case 'abreviatura':
        if (valor.trim() == ''){
          mensajeError = 'La abreviatura es necesaria.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_unidad.length + 100;
          break;
        }
        break;
      case 'detalle':
      if (valor.trim() == ''){
        mensajeError = 'El detalle es necesario.';
        error = true;
        compItem.focus();
        compItem.parent('div').addClass("has-error");
        i = datos_unidad.length + 100;
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
    var fd = new FormData(document.getElementById('formSaveUnidades'));
    $('[name=modalUnidades]').modal('hide');
    console.log(fd)
    waitingDialog.show('Guardando los datos, por favor espere...',
    {dialogSize: 'm', progressType:''});
    btnSavingUnidades.attr('disabled', 'disabled');
    $.ajax({
      url: 'unidades_controller/guardar_unidades',
      type: 'POST',
      data: fd,
      processData: false,
      contentType: false
    }).done(function(data){
      waitingDialog.hide();
      btnSavingUnidades.removeAttr('disabled');
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
          obtener_unidades()
        }
      })
    })
  }
}
//fin funcion guardar familia

//Llamado a la funcion guardar unidades
$('[name=btnSavingUnidades]').on('click', guardarunidad);
//Fin llamar funcion guardar unidad

//Inicio obtener unidades
var componenteListarUnidades = $('[name=listar_unidades]');
var obtener_unidades = function(){
  waitingDialog.show('Cargando, por favor espere...', {dialogSize: 'm', progressType: ''});
  var modelFila = '<tr>'+
      '         <th scope="row">'+
      '            <span name="btnEditar" id="editar_unidad"'+
      '              codigo_unidades="{0}" clave_unidad="{1}" abreviatura_unidad="{2}" detalle_unidad="{3}"'+
      '              class="text-info" style="width: 32px; padding-left: 0px; padding-right: 0px;" title="Editar" role="button">'+
      '                <span class="icon icon-pencil" style="font-size: 18px;"/></span>'+
      '            <span name="btnEliminar" codigo_unidades="{0}" title="Eliminar" '+
      '               class="text-danger" style="width: 32px; padding-left: 0px; padding-right: 0px;" role="button">'+
      '                <span class="icon icon-bin" style="font-size: 18px;"/></span>'+
      '        </th>'+
      '        <td id="codigo">{0}</td>'+
      '        <td>{1}</td>'+
      '        <td>{2}</td>'+
      '        <td>{3}</td>'+
      '    </tr>';

      $.ajax({
        url: 'unidades_controller/obtener_unidades',
        success: function(response){
          var respuesta = $.parseJSON(response);
          componenteListarUnidades.empty();
          if (respuesta.success === true) {
            var datos = respuesta.unidades;
            console.log(datos)
            for (var i = 0; i < datos.length; i++) {
              componenteListarUnidades.append(modelFila.format(
                datos[i]['tipcodigo'], //0
                datos[i]['tipclave'], //1
                datos[i]['tipabreviatura'], //2
                datos[i]['tipdetalle'] //3
              ));
            }
            $('[name=btnEliminar]').on('click', eliminar_unidad);
            $('[name=btnEditar]').on('click', modificar_unidad);
          }
          waitingDialog.hide();
        }
      })
}
//Fin obtener familias

//Llamado a la funcion obtener unidades
obtener_unidades();
//Fin llamado a la funcion obtener unidades

//Inicio mostrar ayuda
//Seccion ayuda clave
function mostrarAyudaClave() {
  $.notify({
    message: 'Ingrese tres caracteres. Esto le ayudara a diferenciar una unidad de otra.'
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

//Inicio funcion eliminar familia
var eliminar_unidad = function(){
  var invalidDelete = true;
  for (var i = 0; i < acciones.length; i++) {
    if (acciones[i]['mod_nombre'] == 'Unidades') {
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
    var codigo_unidades = $(this).attr("codigo_unidades");
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
            url: 'unidades_controller/inactivar_unidades',
            type: 'POST',
            data:{
              codigo_unidades: codigo_unidades
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
                    obtener_unidades()
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

//Inicio funcion modificar unidad

var modificar_unidad = function() {
  var invalidChange = true;
  for (var i = 0; i < acciones.length; i++) {
    if (acciones[i]['mod_nombre'] == 'Unidades') {
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
    var codigo_unidades = $(this).attr("codigo_unidades");
    var clave_unidad = $(this).attr("clave_unidad");
    var abreviatura_unidad = $(this).attr("abreviatura_unidad");
    var detalle_unidad = $(this).attr("detalle_unidad");
    $('[name=modalUnidades]').modal();
    $('[name=modalUnidades]').find('.modal-title').text('Modificar Unidades');
    $('[name=modalUnidades]').find('[name=codigo_unidades]').val(codigo_unidades);
    $('[name=modalUnidades]').find('[name=clave]').val(clave_unidad);
    $('[name=modalUnidades]').find('[name=abreviatura]').val(abreviatura_unidad);
    $('[name=modalUnidades]').find('[name=detalle]').val(detalle_unidad);
    $('[name=modalUnidades]').find('[name=tipo]').val('2');
  }
}

//Fin funcion modificar unidad

//Inicio funcion limpiar unidad

var limpiar_unidad = function(){
  $('[name=modalUnidades]').find('[name=codigo_unidades]').val("");
  $('[name=modalUnidades]').find('[name=clave]').val("");
  $('[name=modalUnidades]').find('[name=abreviatura]').val("");
  $('[name=modalUnidades]').find('[name=detalle]').val("");
  $('[name=modalUnidades]').find('[name=tipo]').val('1');
}

//Fin funcion limpiar unidad
