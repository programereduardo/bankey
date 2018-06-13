

$('#registrar').on('click', function(){
  var invalidCreate = true;
  for (var i = 0; i < acciones.length; i++) {
    if (acciones[i]['mod_nombre'] == 'Usuarios') {
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
    $('[name=modalUsuarios]').find(".has-error").removeClass("has-error");
    $('[name=modalUsuarios]').modal()
    $('[name=modalUsuarios]').find('[name=password]').attr('disabled', 'disabled');
    $('[name=modalUsuarios]').find('[name=estado]').attr('disabled', 'disabled');
    $('[name=modalUsuarios]').find('#actual').css('display', 'none');
    $('[name=modalUsuarios]').find('#status').css('display', 'none');
    limpiar_formulario()
    obtener_roles(null);
  }
})

var limpiar_formulario = function(){
  $('[name=modalusuarios]').find('.modal-title').text("Registrar Usuario");
  $('[name=modalUsuarios]').find('[name=usuario]').val('');
  $('[name=modalUsuarios]').find('[name=rol]').val('');
  $('[name=modalUsuarios]').find('[name=password]').val('');
  $('[name=modalUsuarios]').find('[name=new_password]').val('');
  $('[name=modalUsuarios]').find('[name=confirmacion]').val('');
  $('[name=modalUsuarios]').find('[name=estado]').val('');
}

function obtener_roles(data) {
  var combo = $('[name=rol]');
  $.ajax({
    async: false,
      url: "sistema/usuarios_controller/obtener_roles",
      success: function(response) {
          var respuesta = $.parseJSON(response);
          if (respuesta.success === true) {
            combo.empty();
            combo.append('<option value="">Seleccione</option>')
            for (var i = 0; i < respuesta.data.length; i++) {
              var item = respuesta.data[i];
              if (user_rol == 'Administrador') {
                combo.append('<option value="'+item["rol_codigo"]+'">'+item["rol_nombre"]+'</option>');
              } else {
                if (item["rol_nombre"] !== "Administrador") {
                  combo.append('<option value="'+item["rol_codigo"]+'">'+item["rol_nombre"]+'</option>');
                }
              }
            }
            if (data !== null) {
              if (data.length > 0) {
                combo.val(data)
              }
            }
          }
      }
  });
}

var componenteListado = $('[name=listado_usuarios]');
var obtener_usuarios = function(){
    var id = ""
    if (user_rol !== "Administrador") {
      id = "codigo"
    }
    //waitingDialog.show('Cargando, por favor espere...', {dialogSize: 'm', progressType: ''});
    var modelFila = '<tr>'+
        '         <th scope="row" id="'+id+'">'+
        '            <span id="'+id+'" name="btnEditar"'+
        '              codigo="{4}" estado="{6}" usuario="{1}" tipo="{5}" rol="{3}"'+
        '              class="text-info" style="width: 32px; padding-left: 0px; padding-right: 0px;" title="Editar" role="button">'+
        '                <span class="fa fa-edit" style="font-size: 18px;"/></span>'+
        '            <span id="'+id+'" name="btnEliminarCli" codigo="{4}" rol="{3}" title="Eliminar" '+
        '               class="text-danger" style="width: 32px; padding-left: 0px; padding-right: 0px;" role="button">'+
        '                <span class="fa fa-trash" style="font-size: 18px;"/></span>'+
        /*'            <span name="btnUbicacion" codigo="{0}" title="Ubicación" '+
        '               class="text-info" style="width: 32px; padding-left: 0px; padding-right: 0px;" role="button">'+
        '                <span class="icon icon-home" style="font-size: 18px;"/></span>'+*/
        '        </th>'+
        '        <td id="codigo">{0}</td>'+
        '        <td>{0}</td>'+
        '        <td>{1}</td>'+
        '        <td>{2}</td>'+
        '        <td>{5}</td>'+
        '        <td>{6}</td>'+
        '    </tr>';

    $.ajax({
        url: 'sistema/usuarios_controller/obtener_usuarios',
        type: 'POST',
        data: {
          user_rol: user_rol
        },
        success: function(response) {
            var respuesta = $.parseJSON(response);
            var datos = respuesta.data;
            componenteListado.empty();
            if (respuesta.success === true) {
              for (var i = 0; i < datos.length; i++) {
                componenteListado.append(modelFila.format(
                  datos[i]["ternombre"],//0
                  datos[i]["usu_usuario"],//1
                  datos[i]["rol_nombre"],//2
                  datos[i]["rol_roles"],//3
                  datos[i]["usu_codigo"],//4
                  datos[i]["usu_tipo"],//5
                  datos[i]["usu_estado"],//6
                ));
              }
              $('[name=btnEditar]').on('click', accionModificar);
              $('[name=btnEliminarCli]').on('click', accionEliminar);
              //$('[name=btnUbicacion]').on('click', accionUbicacion);
            }
            //waitingDialog.hide();
        }
    });
};

obtener_usuarios();

//Inicio funcion buscar
function doSearch(){
  var tableReg = document.getElementById('datos');
  var searchText = document.getElementById('searchTerm').value.toLowerCase();
  var cellsOfRow="";
  var found=false;
  var compareWith="";
  // Recorremos todas las filas con contenido de la tabla
  for (var i = 1; i < tableReg.rows.length; i++){
    cellsOfRow = tableReg.rows[i].getElementsByTagName('td');
    found = false;
    // Recorremos todas las celdas
    for (var j = 0; j < cellsOfRow.length && !found; j++){
      compareWith = cellsOfRow[j].innerHTML.toLowerCase();
      // Buscamos el texto en el contenido de la celda
      if (searchText.length == 0 || (compareWith.indexOf(searchText) > -1)){
        found = true;
      }
    }
    if(found){
      tableReg.rows[i].style.display = '';
    } else {
      // si no ha encontrado ninguna coincidencia, esconde la
      // fila de la tabla
      tableReg.rows[i].style.display = 'none';
    }
  }
}
//Fin funcion buscar

var accionModificar = function functionName() {
  var invalidChange = true;
  for (var i = 0; i < acciones.length; i++) {
    if (acciones[i]['mod_nombre'] == 'Usuarios') {
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
    var usuario = $(this).attr('usuario')
    var rol = $(this).attr('rol')
    var codigo = $(this).attr('codigo')
    var estado = $(this).attr('estado')
    if (estado == "Activo") {
      estado = "1"
    } else {
      estado = "2"
    }
    if (rol == 1 && user_rol !== "Administrador") {
      $.notify({
        message: 'Error! Usted no posee permisos para modificar este usuario.'
      },{
        type: 'danger',
        delay: 1000,
        placement: {
          align: 'center'
        },
        z_index: 1000
      })
    } else {
      limpiar_formulario();
      $('[name=modalUsuarios]').modal()
      $('[name=modalUsuarios]').find('.modal-title').text("Modificar datos del Usuario");
      $('[name=modalUsuarios]').find('[name=usuario]').val(usuario);
      $('[name=modalUsuarios]').find('[name=codigo_user]').val(codigo);
      $('[name=modalUsuarios]').find('[name=estado]').val(estado);
      $('[name=modalUsuarios]').find('[name=tipo]').val('2');
      $('[name=modalUsuarios]').find('[name=password]').removeAttr('disabled');
      $('[name=modalUsuarios]').find('[name=estado]').removeAttr('disabled');
      $('[name=modalUsuarios]').find('#actual').css('display', 'block');
      $('[name=modalUsuarios]').find('#status').css('display', 'block');
      obtener_roles(rol)
    }
  }
}

var accionEliminar = function(){
  var invalidDelete = false;
  if (user_rol == 'Administrador')
  {
    
    invalidDelete = false;
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
    var rol = $(this).attr("rol");
    if (rol == 1) {
      $.notify({
        message: 'Error! Usted no posee permisos para modificar este usuario.'
      },{
        type: 'danger',
        delay: 1000,
        placement: {
          align: 'center'
        },
        z_index: 1000
      })
    } else {
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
              url: "sistema/usuarios_controller/eliminar_usuario",
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
                      obtener_usuarios();
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
}
//Fin funcion eliminar cliente


function validar_usuario() {
  var data = $('[name=modalUsuarios]').find('[name=usuario]').val()
  retorno = false;
  $.ajax({
    async: false,
    url: "sistema/usuarios_controller/validar_usuario",
    type: 'POST',
    data: {
      codigo: data
    },
    success: function(response) {
      var respuesta = $.parseJSON(response);
      retorno = respuesta.success
    }
  })
  return (retorno)
}

var guardarUsuarios = function(){
  var btnGuardar = $(this);
  var datos_usuario = $('[name=formUsuario]').serializeArray();
  var error = false;
  var mensajeError;
  for (var i = 0; i < datos_usuario.length; i++) {
    var label = datos_usuario[i]["name"];
    var valor = datos_usuario[i]["value"];
    var compItem = $('[name=' + label + ']');
    $(".has-error").removeClass("has-error");
    switch (label) {
      case 'usuario':
        if (valor.trim() == "") {
          mensajeError = 'Ingrese el Nick del Usuario.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_usuario.length + 1;
          break;
        }
        break;
      case 'contraseña':
        if (valor.trim() == "") {
          mensajeError = 'Ingrese la contraseña actual del usuario.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_usuario.length + 1;
          break;
        }
        break;
      case 'new_password':
        if (valor.trim() == "") {
          mensajeError = 'Ingrese la nueva contraseña del usuario.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_usuario.length + 1;
          break;
        }
        break;
      case 'confirmacion':
        var numero = valor.trim()
        if (valor.trim() == "") {
          mensajeError = 'Confirme la nueva contraseña del usuario.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_usuario.length + 1;
          break;
        }
        break;
      case 'rol':
        var numero = valor.trim()
        if (valor.trim() == "") {
          mensajeError = 'Seleccione un Rol para el usuario.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_usuario.length + 1;
          break;
        }
        break;
      case 'estado':
        if (valor.trim() == "") {
          mensajeError = 'Seleccione el estado del usuario.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_roles.length + 1;
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
    var next = true
    var val = $('[name=modalUsuarios]').find('[name=tipo]').val()
    if (val == "1") {
      var estado = validar_usuario();
      if (estado === true) {
        $.notify({
          message: 'El Nick de Usuario que intenta registrar ya se encuentra registrado.'
        }, {
          type: 'danger',
          delay: 3000,
          placement: {
            align: 'center'
          },
          z_index: 99999,
        });
        next = false;
      }
    }
    if (next === true) {
      var new_contrase = $('[name=modalUsuarios]').find('[name=new_password]').val()
      var confirmacion = $('[name=modalUsuarios]').find('[name=confirmacion]').val()
      if (new_contrase !== confirmacion) {
        $.notify({
          message: 'Las contraseñas no coinciden.'
        }, {
          type: 'danger',
          delay: 3000,
          placement: {
            align: 'center'
          },
          z_index: 99999,
        });
        next = false;
      }
      if (next === true) {
        var fd = new FormData(document.getElementById("formUsuario"));
        //waitingDialog.show('Guardando los cambios, por favor espere...', {dialogSize: 'm', progressType: ''});
        btnGuardar.attr("disabled", "disabled");
        $.ajax({
          url: 'sistema/usuarios_controller/guardar_usuario',
          type: 'POST',
          data: fd,
          processData: false, // tell jQuery not to process the data
          contentType: false, //tell jQuery not to set contentType
          success: function(response){
            var respuesta = $.parseJSON(response)
            if (respuesta.success === true) {
              
              $('[name=modalUsuarios]').modal('hide');
            }
            //waitingDialog.hide();
            btnGuardar.removeAttr("disabled");
            btnGuardar.text('Guardar');
            $.notify({
              message: respuesta.msg
            }, {
              type: respuesta.type,
              delay: 1000,
              placement: {
                align: 'center'
              },
              z_index: 99999,
              onClosed: function() {
                obtener_usuarios();
              }
            });
          }
        });
      }
    }
    }
}

var btnGuardar = $('[name=modalUsuarios]').find('[name=btnSavingUsuario]');
btnGuardar.on('click', guardarUsuarios);
