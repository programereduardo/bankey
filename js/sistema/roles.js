
var entrada = " <p> Usted acaba de acceder al modulo de <strong> Roles del Sistema. </strong> </p> <br> <strong><p> - Tenga extremo cuidado con los cambios que desea hacer.</p><br> <p>- Puede averiar el sistema.</p> </strong>"

$.notify({
  icon: 'glyphicon glyphicon-warning-sign',
  message: entrada
},{
  type: 'info',
  delay: 10000,
  placement: {
    align: 'center'
  },
  z_index: 1000
})

$('#registrar').on('click', function(){
  var invalidCreate = true;
  for (var i = 0; i < acciones.length; i++) {
    if (acciones[i]['mod_nombre'] == 'Roles') {
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
    limpiar_formulario()
    $('[name=modalRoles]').find(".has-error").removeClass("has-error");
    $('[name=modalRoles]').modal()
  }
})

var limpiar_formulario = function(){
  $('[name=modalRoles]').find('.modal-title').text("Registrar Rol");
  $('[name=modalRoles]').find('[name=rol]').val('');
  $('[name=modalRoles]').find('[name=tipo]').val('1');
  $('[name=modalRoles]').find('[name=estado]').val('');
  $('[name=modalRoles]').find('[name=estado]').attr('disabled', 'disabled');
  $('[name=modalRoles]').find('#status').css('display', 'none');
}
 
var componenteListado = $('[name=listado_roles]');
var obtener_roles = function(){
    //waitingDialog.show('Cargando, por favor espere...', {dialogSize: 'm', progressType: ''});
    var modelFila = '<tr>'+
        '         <th scope="row">'+
        '            <span name="btnEditar"'+
        '              codigo="{0}" estado="{2}" rol="{1}"'+
        '              class="text-info" style="width: 32px; padding-left: 0px; padding-right: 0px;" title="Editar" role="button">'+
        '                <span class="fa fa-edit" style="font-size: 18px;"/></span>'+
        '            <span name="btnEliminarCli" codigo="{0}" title="Eliminar" '+
        '               class="text-danger" style="width: 32px; padding-left: 0px; padding-right: 0px;" role="button">'+
        '                <span class="fa fa-trash" style="font-size: 18px;"/></span>'+
        '            <span name="btnUbicacion" codigo="{0}" nombre="{1}" title="Acciones" '+
        '               class="text-info" style="width: 32px; padding-left: 0px; padding-right: 0px;" role="button">'+
        '                <span class="icon icon-home" style="font-size: 18px;"/></span>'+
        '        </th>'+
        '        <td id="codigo">{0}</td>'+
        '        <td>{1}</td>'+
        '        <td>{2}</td>'+
        '    </tr>';

    $.ajax({
        url: 'sistema/roles_controller/obtener_roles',
        type: 'POST',
        success: function(response) {
            var respuesta = $.parseJSON(response);
            var datos = respuesta.data;
            componenteListado.empty();
            if (respuesta.success === true) {
              for (var i = 0; i < datos.length; i++) {
                componenteListado.append(modelFila.format(
                  datos[i]["rol_codigo"],//0
                  datos[i]["rol_nombre"],//1
                  datos[i]["rol_estado"],//2
                ));
              }
              $('[name=btnEditar]').on('click', accionModificar);
              $('[name=btnEliminarCli]').on('click', accionEliminar);
              $('[name=btnUbicacion]').on('click', accionModulos);
            }
            //waitingDialog.hide();
        }
    });
};

obtener_roles();

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

var accionModificar = function()
{
  
  var invalidChange = true;
 
  if (user_rol === 'Administrador')
  {
    
        invalidChange = false;
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
    var rol = $(this).attr('rol')
    var rol_codigo = $(this).attr('codigo')
    var estado = $(this).attr('estado')
    if (estado == "Activo") {
      estado = "1"
    } else {
      estado = "2"
    }
    if (rol == 1 && user_rol !== "Administrador") {
      $.notify({
        message: 'Error! Usted no posee permisos para modificar este rol.'
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
      $('[name=modalRoles]').modal()
      $('[name=modalRoles]').find('.modal-title').text("Modificar datos del Rol");
      $('[name=modalRoles]').find('[name=estado]').removeAttr('disabled');
      $('[name=modalRoles]').find('#status').css('display', 'block');
      $('[name=modalRoles]').find('[name=rol]').val(rol);
      $('[name=modalRoles]').find('[name=estado]').val(estado);
      $('[name=modalRoles]').find('[name=codigo_rol]').val(rol_codigo);
      $('[name=modalRoles]').find('[name=tipo]').val('2');
    }
  }
}

var accionEliminar = function(){
  var invalidDelete = true;
  for (var i = 0; i < acciones.length; i++) {
    if (acciones[i]['mod_nombre'] == 'Roles') {
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
    
    if (codigo == '1') {
      $.notify({
        message: 'Error! Usted no posee permisos para modificar este rol.'
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
              url: "sistema/roles_controller/eliminar_rol",
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
                      obtener_roles();
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
//Fin funcion eliminar rol


function validar_rol() {
  var data = $('[name=modalRoles]').find('[name=rol]').val()
  retorno = false;
  $.ajax({
    async: false,
    url: "sistema/roles_controller/validar_rol",
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

function validar_modulo(data) {
  var data = $('[name=modalModulos]').find('[name=modulo]').val()
  retorno = false;
  $.ajax({
    async: false,
    url: "sistema/roles_controller/validar_modulo",
    type: 'POST',
    data: {
      modulo: data,
      rol: data
    },
    success: function(response) {
      var respuesta = $.parseJSON(response);
      retorno = respuesta.success
    }
  })
  return (retorno)
}

var guardarRoles = function(){
  var btnGuardar = $(this);
  var datos_roles = $('[name=formRoles]').serializeArray();
  var error = false;
  var mensajeError;
  for (var i = 0; i < datos_roles.length; i++) {
    var label = datos_roles[i]["name"];
    var valor = datos_roles[i]["value"];
    var compItem = $('[name=' + label + ']');
    $(".has-error").removeClass("has-error");
    switch (label) {
      case 'rol':
        if (valor.trim() == "") {
          mensajeError = 'Ingrese el nombre del rol.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_roles.length + 1;
          break;
        }
        break;
      case 'estado':
        if (valor.trim() == "") {
          mensajeError = 'Seleccione el estado del rol.';
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
    var val = $('[name=modalRoles]').find('[name=tipo]').val()
    if (val == "1") {
      var estado = validar_rol();
      if (estado === true) {
        $.notify({
          message: 'El rol que intenta registrar ya se encuentra registrado.'
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
      var new_contrase = $('[name=modalRoles]').find('[name=new_password]').val()
      var confirmacion = $('[name=modalRoles]').find('[name=confirmacion]').val()
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
        var fd = new FormData(document.getElementById("formRoles"));
        //waitingDialog.show('Guardando los cambios, por favor espere...', {dialogSize: 'm', progressType: ''});
        btnGuardar.attr("disabled", "disabled");
        $.ajax({
          url: 'sistema/roles_controller/guardar_rol',
          type: 'POST',
          data: fd,
          processData: false, // tell jQuery not to process the data
          contentType: false, //tell jQuery not to set contentType
          success: function(response){
            var respuesta = $.parseJSON(response)
            if (respuesta.success === true) {
              $('[name=modalRoles]').modal('hide');
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
                obtener_roles();
              }
            });
          }
        });
      }
    }
    }
}

var btnGuardar = $('[name=modalRoles]').find('[name=btnSavingRol]');
btnGuardar.on('click', guardarRoles);

//Modulos

var accionModulos = function(){
  var codigo_rol = $(this).attr('codigo')
  var nombre = $(this).attr('nombre')
  obtener_modulos = function(){
      //waitingDialog.show('Cargando, por favor espere...', {dialogSize: 'm', progressType: ''});
      var modelFila = '<tr>'+
          '         <th scope="row">'+
          '            <span name="btnEditar"'+
          '              codigo="{1}" nombre="{0}" rol="'+codigo+'"'+
          '              class="text-info" style="width: 32px; padding-left: 0px; padding-right: 0px;" title="Editar" role="button">'+
          '                <span class="icon icon-pencil" style="font-size: 18px;"/></span>'+
          '        </th>'+
          '        <td id="codigo">{0}</td>'+
          '        <td>{0}</td>'+
          //'        <td>{5}</td>'+
          '    </tr>';
      $.ajax({
          url: 'sistema/roles_controller/obtener_modulos',
          type: 'POST',
          data: {
              codigo: codigo_rol
          },
          success: function(response) {
              var respuesta = $.parseJSON(response);
              componenteModulos.empty();
              if (respuesta.success === true) {
                var datos = respuesta.data;
                for (var i = 0; i < datos.length; i++) {
                  componenteModulos.append(modelFila.format(
                    datos[i]["mod_nombre"],//0
                    datos[i]["mod_codigo"]//1
                  ));
                }
                var btnEditar = $('[name=modalModulos]').find('[name=btnEditar]')
                btnEditar.on('click', obtener_acciones);
                var btnAgrModulo = $('[name=modalModulos]').find('[name=btnAgrModulo]')
                btnAgrModulo.on('click', accionAgregarModulo);
              } else {
                $.notify({
                  message: "Este rol no posee permisos en ningún modulo."
                }, {
                  type: 'danger',
                  delay: 1000,
                  placement: {
                      align: 'center'
                  },
                  z_index: 99999,
                });
              }
              //waitingDialog.hide();
              $('#nombre_rol').html('<p> <strong> Rol : ' + nombre + ' </strong> </p>')
          }
      });
  };

  $('[name=modalModulos]').modal()
  var componenteModulos = $('[name=listado_modulos]');
  var codigo = $(this).attr('codigo')
  $('[name=formularioAgregarModulo]').find('[name=codigof]').val(codigo)
  // AQUI VAS A HACER TOD0 AFUERA DE ESTO NO


    obtener_acciones = function(){
      var componenteAcciones = $('[name=listado_acciones]');
        $('[name=modalModulos]').hide()
        $('[name=modalAcciones]').modal()
        var codigo = $(this).attr('codigo')
        var nombre = $(this).attr('nombre')
        var rol = $(this).attr('rol')
        var componenteModulos = $('[name=listado_modulos]');
        //waitingDialog.show('Cargando, por favor espere...', {dialogSize: 'm', progressType: ''});
        var modelFila = '<tr>'+
            '         <th scope="row">'+
            '            <span name="btnEliminarAcc" codigo="{1}" title="Eliminar" '+
            '               class="text-danger" style="width: 32px; padding-left: 0px; padding-right: 0px;" role="button">'+
            '                <span class="icon icon-bin" style="font-size: 18px;"/></span>'+
            '        </th>'+
            '        <td id="codigo">{0}</td>'+
            '        <td>{0}</td>'+
            //'        <td>{5}</td>'+
            '    </tr>';
        $.ajax({
            url: 'sistema/roles_controller/obtener_acciones',
            type: 'POST',
            data: {
                modulo: codigo,
                rol: rol
            },
            success: function(response) {
                var respuesta = $.parseJSON(response);
                componenteAcciones.empty();
                if (respuesta.success === true) {
                  var datos = respuesta.data;
                  for (var i = 0; i < datos.length; i++) {
                    componenteAcciones.append(modelFila.format(
                      datos[i]["acc_descripcion"],//0
                      datos[i]["acc_codigo"]//1
                    ));
                  }
                  var btnEliminarAcc = $('[name=modalAcciones]').find('[name=btnEliminarAcc]')
                  btnEliminarAcc.on('click', accionEliminarAccion);;
                } else {
                  $.notify({
                    message: "Este rol no posee permisos en ningún modulo."
                  }, {
                    type: 'danger',
                    delay: 1000,
                    placement: {
                        align: 'center'
                    },
                    z_index: 99999,
                  });
                }
                //waitingDialog.hide();
                $('#nombre_modulo').html('<p> <strong> Modulo : ' + nombre + ' </strong> </p>')
                var cerrar = $('[name=modalAcciones]').find('[name=cerrar_acciones]')
                cerrar.on('click', function(){
                  $('[name=modalModulos]').show()
                })
            }
        });
    };

  var accionEliminarAccion = function(){
    
    var invalidDelete = true;
    for (var i = 0; i < acciones.length; i++) {
      if (acciones[i]['mod_nombre'] == 'Roles') {
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
                      obtener_modulos();
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
      if (acciones[i]['mod_nombre'] == 'Roles') {
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
      accionAgregarModulo(ubitipo)
      $('[name=formularioAgregarModulo]').find('[name=tipoU]').val('2');
      $('[name=formularioAgregarModulo]').find('[name=codigoU]').val(codigo);
      $('[name=formularioAgregarModulo]').find('[name=descripcion]').val(valor);
      $('[name=formularioAgregarModulo]').find('[name=tipo_ubicacion]').val(ubitipo);
      if (paicodigo !== "" && paicodigo !== "0" && paicodigo !== undefined) {
        $('[name=formularioAgregarModulo]').find('#paisU').removeAttr('disabled');
        $('[name=formularioAgregarModulo]').find('#estadoU').removeAttr('disabled');
        $('[name=formularioAgregarModulo]').find('#ciudadU').removeAttr('disabled');
        $('[name=formularioAgregarModulo]').find('#barrioU').removeAttr('disabled');
        var componente = $('[name=formularioAgregarModulo]')
      }
    }
  }
  obtener_modulos()
  //$('#barrio').css('display', 'none')
  //Ubicaciones
  var accionAgregarModulo = function(data){
    var invalidCreate = true;
    for (var i = 0; i < acciones.length; i++) {
      if (acciones[i]['mod_nombre'] == 'Roles') {
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
      obtener_modulos(false)
      limpiar_ubicaciones()
      $('[name=formularioAgregarModulo]').modal()
      $('[name=formularioAgregarModulo]').find('[name=descripcion]').val('');
      $('[name=formularioAgregarModulo]').find('[name=tipo_ubicacion]').removeAttr('disabled');
      $('[name=formularioAgregarModulo]').find('#pais').css('display', 'block');
      $('[name=formularioAgregarModulo]').find('#estado').css('display', 'block');
      $('[name=formularioAgregarModulo]').find('#ciudad').css('display', 'block');
      $('[name=formularioAgregarModulo]').find('#barrio').css('display', 'block');
      $('[name=formularioAgregarModulo]').find('#aggBarrio').css('display', 'block');
      $('[name=formularioAgregarModulo]').find('#tipo_ubicacion').css('display', 'block');
      $('[name=formularioUbicaciones]').css('opacity', '0')
      var codigo = $(this).attr('codigo')
      $('[name=formularioAgregarModulo]').on('hidden.bs.modal', function(e){
        $('[name=formularioUbicaciones]').css('opacity', '1')
      })
    }
}

//Obtener modulos
var obtener_modulos = function(data){
  var combo = $('[name=formularioAgregarModulo]').find('[name=modulo]');
  $.ajax({
      url: "sistema/roles_controller/obtener_smodulos",
      success: function(response) {
        var respuesta = $.parseJSON(response);
        if (respuesta.success === true) {
          combo.empty();
          combo.append('<option value="">Seleccione</option>')
          
          for (var i = 0; i < respuesta.data.length; i++) {
            var item = respuesta.data[i];
            combo.append('<option value="'+item["mod_codigo"]+'">'+item["mod_nombre"]+'</option>');
          }
          if (data !== false) {
            if (data.length > 0) {
              combo.val(data)
            }
          }
        }
      }
  });
}
//Fin obtener modulos
//FIN UBICACIONES

  //Limpiar formulario UBICACIONES
  var limpiar_ubicaciones = function(){
    $('[name=formularioAgregarModulo]').find('[name=tipo_agregar]').val('1');
    $('[name=formularioAgregarModulo]').find('[name=modulo]').val("")
  }
} //Fin Accion

$('[name=btnGuardarModulo]').on('click', function() {
  var btnGuardar = $(this);
  var datos_roles = $('[name=formModulo]').serializeArray();
  var error = false;
  var mensajeError;
  for (var i = 0; i < datos_roles.length; i++) {
    var label = datos_roles[i]["name"];
    var valor = datos_roles[i]["value"];
    var compItem = $('[name=' + label + ']');
    $(".has-error").removeClass("has-error");
    switch (label) {
      case 'modulo':
      if (valor.trim() == "") {
        mensajeError = 'Seleccione un modulo.';
        error = true;
        compItem.focus();
        compItem.parent('div').addClass("has-error");
        i = datos_roles.length + 1;
        break;
      }
      break;
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
      var val = $('[name=formModulo]').find('[name=tipo_agregar]').val()
      if (val == "1") {
        var estado = validar_modulo();
        if (estado === true) {
          $.notify({
            message: 'El modulo que intenta registrar ya se encuentra registrado.'
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
    }
  }
})
