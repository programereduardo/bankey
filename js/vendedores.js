//Llamado al modal ingreso de cliente
$('#registrar').on('click', function(){
  $(".has-error").removeClass("has-error");
  $('[name=pais]').removeAttr('disabled')
  $('[name=estado]').removeAttr('disabled')
  $('[name=ciudad]').removeAttr('disabled')
  $('[name=barrio]').removeAttr('disabled')
  limpiar_formulario()
  obtener_paises($('[name=modalClientes]'))
  obtener_documentos()
  obtener_generos()
 	$('[name=modalClientes]').modal();
})
//Fin llamado al modal ingreso cliente

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
  console.log(datos_barrio);
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
          url: 'vendedores_controller/guardar_barrio',
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

//Obtener documentos
function obtener_documentos() {
  var combo=$('[name=tipo_documento]');
  $.ajax({
      url: "vendedores_controller/obtener_documentos",
      success: function(response) {
          var respuesta = $.parseJSON(response);
          if (respuesta.success === true) {
            combo.empty();
            combo.append('<option value="">Seleccione</option>')
            for (var i = 0; i < respuesta.documentos.length; i++) {
              var item = respuesta.documentos[i];
              combo.append('<option value="'+item["tipcodigo"]+'">'+item["tipdetalle"]+'</option>');
            }
          }
      }
  });
}
//Fin obtener documentos

//Obtener genero
function obtener_generos() {
  var combo=$('[name=genero]');
  $.ajax({
      url: "vendedores_controller/obtener_generos",
      success: function(response) {
          var respuesta = $.parseJSON(response);
          if (respuesta.success === true) {
            combo.empty();
            combo.append('<option value="">Seleccione</option>')
            for (var i = 0; i < respuesta.generos.length; i++) {
              var item = respuesta.generos[i];
              combo.append('<option value="'+item["tipcodigo"]+'">'+item["tipdetalle"]+'</option>');
            }
          }
      }
  });
}
//Fin obtener genero

//Obtener tipos de ubicaciones
function obtener_tiposubi(){
  var combo=$('[name=tipo_ubicacion]');
  $.ajax({
      url: "vendedores_controller/obtener_tiposubi",
      success: function(response) {
          var respuesta = $.parseJSON(response);
          if (respuesta.success === true) {
            combo.empty();
            combo.append('<option value="">Seleccione</option>')
            for (var i = 0; i < respuesta.ubi.length; i++) {
              var item = respuesta.ubi[i];
              combo.append('<option value="'+item["tipcodigo"]+'">'+item["tipdetalle"]+'</option>');
            }
          }
      }
  });
}
//Fin obtener tipos de ubicaciones

//Obtener paises
var obtener_paises = function(componente){
  var select = $('#pais');
  var name = select.attr('name');
  var combo = componente.find('[name="pais"]');
  $.ajax({
      url: "vendedores_controller/obtener_paises",
      success: function(response) {
          var respuesta = $.parseJSON(response);
          if (respuesta.success === true) {
            combo.empty();
            combo.append('<option value="">Seleccione</option>')
            for (var i = 0; i < respuesta.paises.length; i++) {
              var item = respuesta.paises[i];
              combo.append('<option value="'+item["paicodigo"]+'">'+item["painombre"]+'</option>');
            }
          }
      }
  });
}
//Fin obtener paises

//Obtener estados
function obtener_estados() {
  var combo = $('[name=estado]');
  var codigo_pais = $('[name=pais]').val();
  var codigop = $('#paisU').val()
  var codigop2 = $('#paisB').val()
  if (codigop !== '') {
    codigo_pais = codigop
  }
  if (codigop2 !== '') {
    codigo_pais = codigop2
  }
  $.ajax({
    url: "vendedores_controller/obtener_estados",
    type: 'POST',
    data: {
      codigo_pais: codigo_pais
    },
    success: function(response) {
      var respuesta = $.parseJSON(response);
      if (respuesta.success === true) {
        combo.empty();
        combo.append('<option value="">Seleccione</option>')
        for (var i = 0; i < respuesta.estados.length; i++) {
          var item = respuesta.estados[i];
          combo.append('<option value="'+item["depcodigo"]+'">'+item["depnombre"]+'</option>');
        }
      }
    }
  });
}
//Obtener estados

//obtener ciudades
function obtener_ciudades(){
  var combo = $('[name=ciudad]');
  var codigo_estado = $('[name=estado]').val();
  var codigoe = $('#estadoU').val()
  if (codigoe !== '') {
    codigo_estado = codigoe
  }
  var codigoe2 = $('#estadoB').val()
  if (codigoe2 !== '') {
    codigo_estado = codigoe2
  }
  $.ajax({
    url: "vendedores_controller/obtener_ciudades",
    type: 'POST',
    data: {
      codigo_estado: codigo_estado
    },
    success: function(response) {
      var respuesta = $.parseJSON(response);
      if (respuesta.success === true) {
        combo.empty();
        combo.append('<option value="">Seleccione</option>')
        for (var i = 0; i < respuesta.ciudades.length; i++) {
          var item = respuesta.ciudades[i];
          combo.append('<option value="'+item["muncodigo"]+'">'+item["munnombre"]+'</option>');
        }
      }
    }
  });
}
//fin obtener ciudades

//Obtener barrios
function obtener_barrios(){
  var combo = $('[name=barrio]')
  var codigo_ciudad = $('[name=ciudad]').val()
  var codigoc = $('#ciudadU').val()
  if (codigoc !== '') {
    codigo_ciudad = codigoc
  }
  $.ajax({
    url: "vendedores_controller/obtener_barrios",
    type: 'POST',
    data: {
      codigo_ciudad: codigo_ciudad
    },
    success: function(response) {
      var respuesta = $.parseJSON(response);
      combo.empty();
      combo.append('<option value="">Seleccione</option>')
      combo.append('<option value="0">No se encuentra</option>')
      if (respuesta.success === true) {
        for (var i = 0; i < respuesta.barrios.length; i++) {
          var item = respuesta.barrios[i];
          combo.append('<option value="'+item["barcodigo"]+'">'+item["barnombre"]+'</option>');
        }
      }else{
        combo.empty();
        combo.append('<option value="">Seleccione</option>')
        combo.append('<option value="0">No se encuentra</option>')
      }
    }
  });
}
//Fin obtener barrios

//mostrar casita de barrios
function agregar_barrio() {
  var barrio = $('#barrioU').val()
  if (barrio === "0") {
    $('#aggbarrio').css('display', 'block')
    var pais = $('#paisU').val()
    var estado = $('#estadoU').val()
    var ciudad = $('#ciudadU').val()
    $('#paisB').val(pais);
    $('#estadoB').val(estado)
    $('#ciudadB').val(ciudad)
    $('#ciudadBa').val(ciudad)
    $('[name=ciudad]').val(ciudad)
    $('[name=pais]').attr('disabled', 'disabled')
    $('[name=estado]').attr('disabled', 'disabled')
    $('[name=ciudad]').attr('disabled', 'disabled')
  } else {
    $('#aggbarrio').css('display', 'none')
    $('#paisB').val("")
    $('#estadoB').val("")
    $('#ciudadB').val("")
    $('[name=pais]').removeAttr('disabled')
    $('[name=estado]').removeAttr('disabled')
    $('[name=ciudad]').removeAttr('disabled')
  }
}
//fin mostrar casita de barrios

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
  $('[name=modalClientes]').find('.modal-title').text("Registrar vendedor");
  $('[name=modalClientes]').find('[name=tipo]').val("1");
  $('[name=modalClientes]').find('[name=codigo_cliente]').val("");
  $('[name=modalClientes]').find('[name=nombre1]').val("");
  $('[name=modalClientes]').find('[name=nombre2]').val("");
  $('[name=modalClientes]').find('[name=apellido1]').val("");
  $('[name=modalClientes]').find('[name=apellido2]').val("");
  $('[name=modalClientes]').find('[name=numero_documento]').val("");
  $('[name=modalClientes]').find('[name=tipo_documento]').val("");
  $('[name=modalClientes]').find('[name=pais]').val("");
  $('[name=modalClientes]').find('[name=estado]').val("");
  $('[name=modalClientes]').find('[name=ciudad]').val("");
  $('[name=modalClientes]').find('[name=ciudad]').val("");
  $('[name=modalClientes]').find('[name=fecha]').val("");
  $('[name=modalClientes]').find('[name=genero]').val("");
  $('[name=modalClientes]').find('[name=correo]').val("");
  $('#correo').css('display', 'block')
  $('#pais').css('display', 'block')
  $('#ciudad').css('display', 'block')
  $('#fecha_nacimiento').css('display', 'block')
}


//Fin funcion limpiar formulario

//Inicio funcion eliminar cliente
var accionEliminar = function(){
    var codigo=$(this).attr("codigo");
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
                    url: "vendedores_controller/eliminar_cliente",
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
                                  obtener_vendedores();
                                }
                            });
                        }
                    }
                });
            }
        }
    });
}
//Fin funcion eliminar cliente

//Inicio funcion modificar cliente
var accionModificar = function(){
    var codigo = $(this).attr("codigo");
    var nombre1 = $(this).attr("nombre1");
    var nombre2 = $(this).attr("nombre2");
    var apellido1 = $(this).attr("apellido1");
    var apellido2 = $(this).attr("apellido2");
    var numero_documento = $(this).attr("numero_documento");
    var tipo_documento = $(this).attr("tipo_documento");
    var pais = $(this).attr("pais");
    var estado = $(this).attr("estado");
    var ciudad = $(this).attr("ciudad");
    var fecha=$(this).attr("fecha");
    var genero=$(this).attr("genero");
    var correo=$(this).attr("correo");
    obtener_documentos()
    obtener_generos()
    $('[name=modalClientes]').modal()
    $('[name=modalClientes]').find('.modal-title').text("Modificar datos del vendedor");
    var btnGuardar=$('[name=modalClientes]').find('[name=btnGuardar]');
    $('[name=modalClientes]').find('[name=codigo_cliente]').val(codigo);
    $('[name=modalClientes]').find('[name=tipo]').val('2');
    $('[name=modalClientes]').find('[name=nombre1]').val(nombre1);
    $('[name=modalClientes]').find('[name=nombre2]').val(nombre2);
    $('[name=modalClientes]').find('[name=apellido1]').val(apellido1);
    $('[name=modalClientes]').find('[name=apellido2]').val(apellido2);
    $('[name=modalClientes]').find('[name=numero_documento]').val(numero_documento);
    $('[name=modalClientes]').find('[name=tipo_documento]').val(tipo_documento);
    $('[name=modalClientes]').find('[name=pais]').val(pais);
    $('[name=modalClientes]').find('[name=estado]').val(estado);
    $('[name=modalClientes]').find('[name=ciudad]').val(ciudad);
    $('[name=modalClientes]').find('[name=fecha]').val(fecha);
    $('[name=modalClientes]').find('[name=genero]').val(genero);
    $('[name=modalClientes]').find('[name=correo]').val("no me importas");
    $('#correo').css('display', 'none')
    $('#pais').css('display', 'none')
    $('#ciudad').css('display', 'none')
    $('#fecha_nacimiento').css('display', 'none')
    $('#estado').css('display', 'none')
}
//Fin funcion modificar cliente

var componenteListado = $('[name=listado_clientes]');


$('[name=listar]').on('click', function(){
  obtener_vendedores();
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
       url: 'vendedores_controller/validar_documento',
       type: 'POST',
       data: {
         numero: numero
       },
       success: function(response) {
         var respuesta = $.parseJSON(response);
         console.log(respuesta);
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
  var datos_clientes = $('[name=formAgregarCliente]').serializeArray();
  var error = false;
  var mensajeError;
  for (var i = 0; i < datos_clientes.length; i++) {
    var label = datos_clientes[i]["name"];
    var valor = datos_clientes[i]["value"];
    var compItem = $('[name=' + label + ']');
    $(".has-error").removeClass("has-error");
    switch (label) {
      case 'nombre1':
        if (valor.trim() == "") {
          mensajeError = 'Su primer nombre es necesario.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_clientes.length + 1;
          break;
        }
      break;
      case 'nombre2':
          if (valor.trim() == "") {
            valor.trim() == ''
            break;
          }
        break;
      case 'apellido1':
        if (valor.trim() == "") {
          mensajeError = 'Su primer apellido es necesario.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_clientes.length + 1;
          break;
        }
        break;
      case 'apellido2':
        if (valor.trim() == "") {
          mensajeError = 'Su segundo apellido es necesario.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_clientes.length + 1;
          break;
        }
        break;
      case 'numero_documento':
        var numero = valor.trim()
        if (valor.trim() == "") {
          mensajeError = 'Su numero de documento es necesario.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_clientes.length + 1;
          break;
        }/* else {
          validar_documento();
        }*/
        break;
      case 'tipo_documento':
        if (valor.trim() == "") {
          mensajeError = 'Su tipo de documento es necesario.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_clientes.length + 1;
          break;
        }
      break;
      case 'pais':
        if (valor.trim() == "") {
          mensajeError = 'Su pais de nacimiento es necesario.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_clientes.length + 1;
          break;
        }
        break;
    case 'estado':
      if (valor.trim() == "") {
        mensajeError = 'Su estado de nacimiento es necesario.';
        error = true;
        compItem.focus();
        compItem.parent('div').addClass("has-error");
        i = datos_clientes.length + 1;
        break;
      }
      break;
      case 'ciudad':
        if (valor.trim() == "") {
          mensajeError = 'Su ciudad de nacimiento es necesaria.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_clientes.length + 1;
          break;
        }
        break;
      case 'fecha':
        if (valor.trim() == "") {
          mensajeError = 'Su fecha de nacimiento es necesaria.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_clientes.length + 1;
          break;
        }
        break;
      case 'genero':
        if (valor.trim() == "") {
          mensajeError = 'Su genero es necesario.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_clientes.length + 1;
          break;
        }
        break;
      case 'correo':
        if (valor.trim() == "") {
          mensajeError = 'Su correo es necesario.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_clientes.length + 1;
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
    var fd = new FormData(document.getElementById("formAgregarCliente"));
        waitingDialog.show('Guardando los cambios, por favor espere...', {dialogSize: 'm', progressType: ''});
        btnGuardar.attr("disabled", "disabled");
        $.ajax({
          url: 'vendedores_controller/',
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
                    obtener_vendedores();
                }
            });
        });
  }
}
//Fin funcion guardar clientes

var obtener_vendedores = function(){
    waitingDialog.show('Cargando, por favor espere...', {dialogSize: 'm', progressType: ''});
    var modelFila = '<tr>'+
        '         <th scope="row">'+
        '            <span name="btnEditar"'+
        '              codigo="{0}" nombre1="{3}" nombre2="{4}" apellido1="{5}" apellido2="{6}" numero_documento="{1}" tipo_documento="{7}"'+
        '              genero="{10}" pais="{11}" fecha="{9}" estado="{}" ciudad="{11}" '+
        '              class="text-info" style="width: 32px; padding-left: 0px; padding-right: 0px;" title="Editar" role="button">'+
        '                <span class="icon icon-pencil" style="font-size: 18px;"/></span>'+
        '            <span name="btnEliminarCli" codigo="{0}" title="Eliminar" '+
        '               class="text-danger" style="width: 32px; padding-left: 0px; padding-right: 0px;" role="button">'+
        '                <span class="icon icon-bin" style="font-size: 18px;"/></span>'+
        '            <span name="btnUbicacion" codigo="{0}" title="Ubicación" '+
        '               class="text-info" style="width: 32px; padding-left: 0px; padding-right: 0px;" role="button">'+
        '                <span class="icon icon-home" style="font-size: 18px;"/></span>'+
        '        </th>'+
        '        <td id="codigo">{0}</td>'+
        '        <td>{1}</td>'+
        '        <td>{2}</td>'+
        '    </tr>';

    $.ajax({
        url: "vendedores_controller/listar_vendedores",
        success: function(response) {
            var respuesta = $.parseJSON(response);
            componenteListado.empty();
            if (respuesta.success === true) {
              var datos = respuesta.vendedores;
              //var activo = respuesta.actv;
              for (var i = 0; i < datos.length; i++) {
                componenteListado.append(modelFila.format(
                  datos[i]["tercodigo"],//0
                  datos[i]["terdocnum"],//1
                  datos[i]["ternombre"],//2
                  datos[i]["ternom1"],//3
                  datos[i]["ternom2"],//4
                  datos[i]["terape1"],//5
                  datos[i]["terape2"],//6
                  datos[i]["tertipdoc"],//7
                  datos[i]["terubivalor"],//8                        $this->db->select('terape2');
                  datos[i]["terdatfecnac"],//9
                  datos[i]["terdattipsex"],//10
                  datos[i]["terdattipnac"],//11
                  datos[i]["terdatciunac"]//12
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
obtener_vendedores();

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
          url: 'vendedores_controller/obtener_ubicacion',
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
                      url: "vendedores_controller/inactivar_ubicacion",
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
        url: 'vendedores_controller/guardar_ubicacion',
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
