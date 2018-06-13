//Inicio mostrar modal registro familias
$('#registrar').on('click', function(){
  var invalidCreate = true;
  for (var i = 0; i < acciones.length; i++) {
    if (acciones[i]['mod_nombre'] == 'Grupos') {
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
    $('[name=modalGrupo]').modal();
    limpiar_grupo();
  }
})
//Fin mostrar modal registro familias

//Inicio funcion guardar Grupo
var guardarGrupo = function(){
  var btnSavingGrupo = $(this);
  var datos_grupo = $('[name=formSaveGrupo]').serializeArray();
  var error = false;
  var mensajeError = 'Guardado correctamente.';
  for (var i = 0; i < datos_grupo.length; i++) {
    var label = datos_grupo[i]['name'];
    var valor = datos_grupo[i]['value'];
    var compItem = $('[name=' + label + ']');
    $('.has-error').removeClass('has-error');
    switch (label) {
      case 'clave':
        if (valor.trim() == ''){
          mensajeError = 'La clave es necesaria.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_grupo.length + 100;
          break;
        }
        break;
      case 'abreviatura':
        if (valor.trim() == ''){
          mensajeError = 'La abreviatura es necesaria.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_grupo.length + 100;
          break;
        }
        break;
      case 'detalle':
      if (valor.trim() == ''){
        mensajeError = 'El detalle es necesario.';
        error = true;
        compItem.focus();
        compItem.parent('div').addClass("has-error");
        i = datos_grupo.length + 100;
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
    var fd = new FormData(document.getElementById('formSaveGrupo'));
    $('[name=modalGrupo]').modal('hide');
    waitingDialog.show('Guardando los datos, por favor espere...',
    {dialogSize: 'm', progressType:''});
    btnSavingGrupo.attr('disabled', 'disabled');
    $.ajax({
      url: 'grupos_controller/guardar_grupo',
      type: 'POST',
      data: fd,
      processData: false,
      contentType: false
    }).done(function(data){
      waitingDialog.hide();
      btnSavingGrupo.removeAttr('disabled');
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
          obtener_grupos()
        }
      })
    })
  }
}
//fin funcion guardar familia

//Llamado a la funcion guardar grupos
$('[name=btnSavingGrupo]').on('click', guardarGrupo);
//Fin llamar funcion guardar Grupo

//Inicio obtener Grupos
var componenteListarGrupos = $('[name=listar_grupos]');
var obtener_grupos = function(){
  waitingDialog.show('Cargando, por favor espere...', {dialogSize: 'm', progressType: ''});
  var modelFila = '<tr>'+
      '         <th scope="row">'+
      '            <span name="btnEditar" id="editar_grupo"'+
      '              codigo_grupo="{0}" clave_grupo="{1}" abreviatura_grupo="{2}" detalle_grupo="{3}"'+
      '              class="text-info" style="width: 32px; padding-left: 0px; padding-right: 0px;" title="Editar" role="button">'+
      '                <span class="icon icon-pencil" style="font-size: 18px;"/></span>'+
      '            <span name="btnEliminar" codigo_grupo="{0}" title="Eliminar" '+
      '               class="text-danger" style="width: 32px; padding-left: 0px; padding-right: 0px;" role="button">'+
      '                <span class="icon icon-bin" style="font-size: 18px;"/></span>'+
      '        </th>'+
      '        <td id="codigo">{0}</td>'+
      '        <td>{1}</td>'+
      '        <td>{2}</td>'+
      '        <td>{3}</td>'+
      '    </tr>';

      $.ajax({
        url: 'grupos_controller/obtener_grupos',
        success: function(response){
          var respuesta = $.parseJSON(response);
          componenteListarGrupos.empty();
          if (respuesta.success === true) {
            var datos = respuesta.grupos;
            console.log(datos)
            for (var i = 0; i < datos.length; i++) {
              componenteListarGrupos.append(modelFila.format(
                datos[i]['tipcodigo'], //0
                datos[i]['tipclave'], //1
                datos[i]['tipabreviatura'], //2
                datos[i]['tipdetalle'] //3
              ));
            }
            $('[name=btnEliminar]').on('click', eliminar_grupo);
            $('[name=btnEditar]').on('click', modificar_grupo);
          }
          waitingDialog.hide();
        }
      })
}
//Fin obtener familias

//Llamado a la funcion obtener grupos
obtener_grupos();
//Fin llamado a la funcion obtener grupos

//Inicio mostrar ayuda
//Seccion ayuda clave
function mostrarAyudaClave() {
  $.notify({
    message: 'Ingrese tres caracteres. Esto le ayudara a diferenciar un grupo de otro.'
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
var eliminar_grupo = function(){
  var invalidDelete = true;
  for (var i = 0; i < acciones.length; i++) {
    if (acciones[i]['mod_nombre'] == 'Grupos') {
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
    var codigo_grupo = $(this).attr("codigo_grupo");
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
            url: 'grupos_controller/inactivar_grupo',
            type: 'POST',
            data:{
              codigo_grupo: codigo_grupo
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
                    obtener_grupos()
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

//Inicio funcion modificar grupo

var modificar_grupo = function() {
  var invalidChange = true;
  for (var i = 0; i < acciones.length; i++) {
    if (acciones[i]['mod_nombre'] == 'Grupos') {
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
    var codigo_grupo = $(this).attr("codigo_grupo");
    var clave_grupo = $(this).attr("clave_grupo");
    var abreviatura_grupo = $(this).attr("abreviatura_grupo");
    var detalle_grupo = $(this).attr("detalle_grupo");
    $('[name=modalGrupo]').modal();
    $('[name=modalGrupo]').find('.modal-title').text('Modificar grupos');
    $('[name=modalGrupo]').find('[name=codigo_grupo]').val(codigo_grupo);
    $('[name=modalGrupo]').find('[name=clave]').val(clave_grupo);
    $('[name=modalGrupo]').find('[name=abreviatura]').val(abreviatura_grupo);
    $('[name=modalGrupo]').find('[name=detalle]').val(detalle_grupo);
    $('[name=modalGrupo]').find('[name=tipo]').val('2');
  }
}

//Fin funcion modificar grupo

//Inicio funcion limpiar grupo

var limpiar_grupo = function(){
  $('[name=modalGrupo]').find('[name=codigo_grupo]').val("");
  $('[name=modalGrupo]').find('[name=clave]').val("");
  $('[name=modalGrupo]').find('[name=abreviatura]').val("");
  $('[name=modalGrupo]').find('[name=detalle]').val("");
  $('[name=modalGrupo]').find('[name=tipo]').val('1');
}

//Fin funcion limpiar grupo
