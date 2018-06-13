
var parametro = $('[name=parametro]').val() 
var titulo = $('[name=titulo]').val()
accMod = $('[name=accMod]').val();
var tip = $('[name=tip]').val(); 
var aux = parametro+'_controller';
var controller = aux.replace(/\s/g,"")
var controlador = controller

function aMayusculas(obj,id){
  obj = obj.toUpperCase();
  document.getElementById(id).value = obj;
}

function ocultar_asoc() {
  if (controlador == 'vendedores_controller') {
    $('#asoc').css('display', 'none')
    $('td#asoc').css('display', 'none')
  }
}


 
var data = '';
$('[name=btnAgregarCliente]').on('click', function(){
  //debugger
  
    limpiar_formulario()
    $('[name=modalClientes]').modal();
    
})
//Fin llamado al modal ingreso cliente


//metodo para obtener los clientes y mostrarlos en la tabla

  var obtener_clientes = function(){
    //debugger
    var tip = $('[name=tip]').val(); 
    var componenteListado = $('[name=listado_clientes]');
  //var clave = $('[name=modalClientes]').find('[name=tip]').val();
   //waitingDialog.show('Cargando, por favor espere...', {dialogSize: 'm', progressType: ''});
    var modelFila = '<tr>'+
        '         <th scope="row">'+
        '            <span name="btnEditar"'+
        '              codigo="{0}" correo="{8}" telefono="{9}" celular={10} residencia="{6}" trabajo="{7}" nombre1="{2}" nombre2="{3}" apellido1="{4}" apellido2="{5}" numero_documento="{1}" '+
        '         estado="{10}"'+
        '              class="text-info" style="width: 32px; padding-left: 0px; padding-right: 0px;" title="Editar" role="button">'+
        '                <span class="fa fa-edit" style="font-size: 18px;"/></span>'+
        '            <span name="btnEliminarCli" codigo="{0}" title="Eliminar" '+
        '               class="text-danger" style="width: 32px; padding-left: 0px; padding-right: 0px;" role="button">'+
        '                <span class="fa fa-trash" style="font-size: 18px;"/></span>'+
        '        </th>'+
        '        <td id="codigo">{0}</td>'+
        '        <td>{1}</td>'+
        '        <td>{2} {3} {4} {5}</td>'+
        '        <td>{6}</td>'+
        '        <td>{7}</td>'+
        '        <td>{8}</td>'+
        '        <td>{9}</td>'+
        '        <td>{10}</td>'+
        '    </tr>';

    $.ajax({
        url: 'terceros_controller/listar_tercero',
        type : 'POST',
        data : {
          tip : tip
        },        
        success: function(response) {
            var respuesta = $.parseJSON(response);
            var datos = respuesta.clientes;
            var cant = respuesta.cantidad
            var clave = $('[name=modalClientes]').find('[name=tip]').val();
            
            $('#total_terceros').html('Total de '+ titulo + ' : ' +cant)
            $('#total_terceros').css('font-weight', 'bold')
            componenteListado.empty();
            if (respuesta.success === true) {

              for (var i = 0; i < cant; i++) {
                
                componenteListado.append(modelFila.format(
                  datos[i]["ter_id"],//0
                  datos[i]["ter_identificacion"],//1
                  datos[i]["ter_pnombre"],//2
                  datos[i]["ter_snombre"],//3
                  datos[i]["ter_papellido"],//4
                  datos[i]["ter_sapellido"],//5
                  datos[i]["ter_direccionreside"],//6
                  datos[i]["ter_direcciontrabajo"],//7
                  datos[i]["ter_correo"],//8
                  datos[i]["ter_telefono1"],//9
                  datos[i]["ter_telefono2"]//10
                ));
              }
              }
              
            
              $('[name=btnEditar]').on('click', accionModificar);
              $('[name=btnEliminarCli]').on('click', accionEliminar);
              $('[name=btnUbicacion]').on('click', accionUbicacion);
            

            }
            
        
    });
}
obtener_clientes();

//fin del metodo



$('[id=btnGuardar]').on('click',function()
{
  
  
  
  //Inicio funcion guardar client

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
      /*case 'nombre2':
        if (valor.trim() == "") {
          mensajeError = 'Su segundo nombre es necesario.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_clientes.length + 1;
          break;
        }
        break;*/
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
      /*case 'apellido2':
        if (valor.trim() == "") {
          mensajeError = 'Su segundo apellido es necesario.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_clientes.length + 1;
          break;
        }
        break;*/
      case 'numero_documento':
        var numero = valor.trim()
        if (valor.trim() == "") {
          var compItem = $('[name=numero_documento]');
          mensajeError = 'Su numero de documento es necesario.';
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
      var val = $('[name=modalClientes]').find('[name=tipo]').val()
    if (val == '1') {
      var estado = validar_documento();
      if (estado === false) {
        $.notify({
          message: 'El número de documento que intenta registrar ya se encuentra registrado.'
        }, {
          type: 'danger',
          delay: 3000,
          placement: {
            align: 'center'
          },
          z_index: 99999,
        });
      } else {
        
                $('[name=modalClientes]').modal('hide');
        var fd = new FormData(document.getElementById("formAgregarCliente"));
        //waitingDialog.show('Guardando los cambios, por favor espere...', {dialogSize: 'm', progressType: ''});
       

        $.ajax({
          url: controlador+'/guardar_tercero',
          type: 'POST',
          data: fd,
          processData: false, // tell jQuery not to process the data
          contentType: false,
          success : function(response)
          {
             var respuesta = $.parseJSON(response);
             if (respuesta.success === true)
             {
                $.notify(
                {
                  message : 'Guardado Exitosamente.'
                },{
                  type : 'success',
                  delay : 100,
                  placement : {
                    align : 'center'
                  },
                  z_index : 9999
                });
                var mostrado = true;
                obtener_clientes();
             }
          }
        })
        if (mostrado === true)
        {
          $('[name=modalClientes]').modal('hide');
        }
      }
    } else {
      $('#nombre1').attr('name', 'nombre1')
      $('#apellido1').attr('name', 'apellido1')
     
      var fd = new FormData(document.getElementById("formAgregarCliente"));
      //waitingDialog.show('Guardando los cambios, por favor espere...', {dialogSize: 'm', progressType: ''});
      btnGuardar.attr("disabled", "disabled");
      $.ajax({
        url: controlador+'/guardar_tercero',
        type: 'POST',
        data: fd,
        processData: false, // tell jQuery not to process the data
        contentType: false   // tell jQuery not to set contentType
      }).done(function(data) {
        btnGuardar.removeAttr("disabled");
        btnGuardar.text('Guardar');
        $('[name=modalClientes]').modal('hide');
        $('#nombre1').attr('name', 'nombre1')
        $('#apellido1').attr('name', 'apellido1')
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
            obtener_clientes();
        //waitingDialog.hide()
          }
        });
      });
    }
  }

//Fin funcion guardar clientes
  
})


$('#excel').on('click', function(){
  var clave = $('[name=modalClientes]').find('[name=tip]').val();
  window.open('terceros_controller/reporte_clientes?data='+clave)
})

function mostrarAyudaFecha(){
  $.notify({
      message: 'El valor por defecto es no aplica'
  }, {
      type: 'info',
      delay: 3000,
      placement: {
          align: 'center'
      },
      z_index: 99999,
  })
}

function change_name() {
  var tipoTer = $('[name=tipo_tercero]').val()
  if (tipoTer == '2') {
    $('#nombre1').attr('name', 'nombre1')
    $('#apellido1').attr('name', 'apellido1')
    $('#nombre').attr('name', 'nom')
  }
  if (tipoTer == '1') {
    $('#nombre1').attr('name', 'nom')
    $('#apellido1').attr('name', 'ape')
    $('#nombre').attr('name', 'nombre')
  }
  if (tipoTer !== '1' && tipoTer !== '2') {
    $('#nombre1').attr('name', 'nombre1')
    $('#apellido1').attr('name', 'apellido1')
    $('#nombre').attr('name', 'nombre')
  }
}

//Default function
function tipoTercero() {
  var tipoTer = $('[name=tipo_tercero]').val()
  if (tipoTer == "0") {
    $('[name=modalClientes]').find('[name=estado]').attr('disabled', 'disabled')
    $('[name=modalClientes]').find('[name=ciudad]').attr('disabled', 'disabled')
    $('[name=modalClientes]').find('[name=genero]').attr('disabled', 'disabled')
    $('[name=modalClientes]').find('[name=fecha]').attr('disabled', 'disabled')
    $('[name=modalClientes]').find('[name=pais]').attr('disabled', 'disabled')
    $('[name=modalClientes]').find('[name=contributivo]').attr('disabled', 'disabled')
    $('[name=modalClientes]').find('[name=retenedor]').attr('disabled', 'disabled')
    $('[name=modalClientes]').find('[name=regimen]').attr('disabled', 'disabled')
  }
  if (tipoTer == "2") {
    $('#quitar1').html('*')
    $('#quitar2').html('*')
    controlador = 'terceros_controller'
    $('[name=modalClientes]').find('[name=contributivo]').attr('disabled', 'disabled')
    $('[name=modalClientes]').find('[name=contributivo]').val('N')
    $('[name=modalClientes]').find('[name=retenedor]').attr('disabled', 'disabled')
    $('[name=modalClientes]').find('[name=retenedor]').val('N')
    $('[name=modalClientes]').find('[name=regimen]').attr('disabled', 'disabled')
    $('[name=modalClientes]').find('[name=regimen]').val('')
    $('[name=modalClientes]').find('[name=pais]').removeAttr('disabled')
    $('[name=modalClientes]').find('[name=estado]').removeAttr('disabled')
    $('[name=modalClientes]').find('[name=ciudad]').removeAttr('disabled')
    $('[name=modalClientes]').find('[name=genero]').removeAttr('disabled')
    $('[name=modalClientes]').find('[name=fecha]').removeAttr('disabled')
  }
  if (tipoTer == "1") {
    $('#quitar1').html('')
    $('#quitar2').html('')
    controlador = 'terceros_controller' //Si alguna vaina el error es aqui "empresas_controller"
    $('[name=modalClientes]').find('[name=estado]').attr('disabled', 'disabled')
    $('[name=modalClientes]').find('[name=ciudad]').attr('disabled', 'disabled')
    $('[name=modalClientes]').find('[name=genero]').attr('disabled', 'disabled')
    $('[name=modalClientes]').find('[name=fecha]').attr('disabled', 'disabled')
    $('[name=modalClientes]').find('[name=pais]').attr('disabled', 'disabled')
    $('[name=modalClientes]').find('[name=contributivo]').removeAttr('disabled')
    $('[name=modalClientes]').find('[name=retenedor]').removeAttr('disabled')
    $('[name=modalClientes]').find('[name=regimen]').removeAttr('disabled')
  }
  if (tipoTer == "29") {
    $('[name=modalClientes]').find('[name=estado]').removeAttr('disabled')
    $('[name=modalClientes]').find('[name=ciudad]').removeAttr('disabled')
    $('[name=modalClientes]').find('[name=genero]').removeAttr('disabled')
    $('[name=modalClientes]').find('[name=fecha]').removeAttr('disabled')
    $('[name=modalClientes]').find('[name=pais]').removeAttr('disabled')
    $('[name=modalClientes]').find('[name=regimen]').attr('disabled', 'disabled')
  }
  change_name();
  obtener_paises($('[name=modalClientes]'), data)
  obtener_generos(data)
  obtener_documentos(data)
}

//Fin default function

$('#btnBarrio').on('click', function(){
  obtener_paises($('[name=modalBarrio]'), data)
  $('[name=modalBarrio]').modal();
})

$('[name=btnGuardarBarrio]').on('click', function(){
  guardar_barrio()
})

//Obtener documentos
function obtener_documentos(data) {
  var combo=$('[name=tipo_documento]');
  $.ajax({
      url: "terceros_controller/obtener_documentos",
      success: function(response) {
          var respuesta = $.parseJSON(response);
          if (respuesta.success === true) {
            combo.empty();
            combo.append('<option value="">Seleccione</option>')
            for (var i = 0; i < respuesta.documentos.length; i++) {
              var item = respuesta.documentos[i];
              combo.append('<option value="'+item["tipcodigo"]+'">'+item["tipdetalle"]+'</option>');
            }
            if (data.length > 0) {
              combo.val(data)
            }
          }
      }
  });
}
//Fin obtener documentos

//Obtener documentos
function obtener_tertip(data) {
  var combo = $('[name=tipo_tercero]');
  $.ajax({
    async: false,
      url: controlador+"/obtener_tertip",
      success: function(response) {
          var respuesta = $.parseJSON(response);
          if (respuesta.success === true) {
            combo.empty();
            combo.append('<option value="">Seleccione</option>')
            if (controlador == 'terceros_controller') {
              combo.append('<option value="2">Persona Natural</option>')
              combo.append('<option value="1">Persona Juridica</option>')
            }
            if (controlador == 'proveedores_controller') {
              combo.empty()
              combo.append('<option value="3">Proveedor</option>')
            }
            if (controlador == 'vendedores_controller') {
              combo.empty()
              combo.append('<option value="4">Vendedor</option>')
            }
            if (controlador == 'servicios_controller') {
              combo.empty();
              combo.append('<option value="5">Proveedor de Servicio</opction>')
            }
            /*for (var i = 0; i < respuesta.data.length; i++) {
              var item = respuesta.data[i];
              combo.append('<option value="'+item["tipcodigo"]+'">'+item["tipdetalle"]+'</option>');
            }*/
            if (data.length > 0) {
              combo.val(data)
            }
          }
      }
  });
}
//Fin obtener documentos





//Obtener estados
function obtener_estados(componente, dpto, ciudad, barrio) {
  var combo = componente.find('[name=estado]');
  var codigo_pais = componente.find('[name=pais]').val();
  var codigop = $('#paisU').val()
  var codigop2 = $('#paisB').val()
  if (codigop !== '') {
    codigo_pais = codigop
  }
  if (codigop2 !== '') {
    codigo_pais = codigop2
  }
  $.ajax({
    url: "terceros_controller/obtener_estados",
    type: 'POST',
    data: {
      codigo_pais: codigo_pais
    },
    success: function(response) {
      var respuesta = $.parseJSON(response);
      if (respuesta.success === true) {
        combo.empty();
        combo.append('<option value="">Seleccione</option>')
        var cantidad = respuesta.estados.length
        item = respuesta.estados[cantidad-1]
        combo.append('<option value="'+item["depcodigo"]+'">'+item["depnombre"]+'</option>');
        for (var i = 0; i < cantidad-1; i++) {
          var item = respuesta.estados[i];
          combo.append('<option value="'+item["depcodigo"]+'">'+item["depnombre"]+'</option>');
        }
        if (dpto.length > 0) {
          combo.val(dpto)
          obtener_ciudades(componente, ciudad, barrio)
        }
      }
    }
  });
}
//Obtener estados

//obtener ciudades
function obtener_ciudades(componente, ciudad, barrio){
  var combo = $('[name=ciudad]');
  var codigo_estado = componente.find('[name=estado]').val();
  var codigoe = $('#estadoU').val()
  if (codigoe !== '') {
    codigo_estado = codigoe
  }
  var codigoe2 = $('#estadoB').val()
  if (codigoe2 !== '') {
    codigo_estado = codigoe2
  }
  $.ajax({
    url: "terceros_controller/obtener_ciudades",
    type: 'POST',
    data: {
      codigo_estado: codigo_estado
    },
    success: function(response) {
      var respuesta = $.parseJSON(response);
      if (respuesta.success === true) {
        combo.empty();
        combo.append('<option value="">Seleccione</option>')
        var cantidad = respuesta.ciudades.length
        item = respuesta.ciudades[cantidad-1]
        combo.append('<option value="'+item["muncodigo"]+'">'+item["munnombre"]+'</option>');
        for (var i = 0; i < cantidad-1; i++) {
          var item = respuesta.ciudades[i];
          combo.append('<option value="'+item["muncodigo"]+'">'+item["munnombre"]+'</option>');
        }
        if (ciudad.length > 0) {
          combo.val(ciudad)
          obtener_barrios(barrio)
        }
      }
    }
  });
}
//fin obtener ciudades

//Funcion limpiar formulario
var limpiar_formulario = function(){
  $('[name=modalClientes]').modal()
  $('[name=modalClientes]').find('.modal-title').text("Registrar "+titulo);
  $('[name=modalClientes]').find('[name=tipo]').val("1");
  $('[name=modalClientes]').find('[name=codigo_cliente]').val("");
  $('[name=modalClientes]').find('#nombre1').val("");
  $('[name=modalClientes]').find('#nombre2').val("");
  $('[name=modalClientes]').find('#apellido1').val("");
  $('[name=modalClientes]').find('#apellido2').val("");
  $('[name=modalClientes]').find('[name=numero_documento]').val("");
  $('[name=modalClientes]').find('[name=tipo_documento]').val("");
  $('[name=modalClientes]').find('[name=telefono]').val("");
  $('[name=modalClientes]').find('[name=celular]').val("");
  $('[name=modalClientes]').find('[name=dir_res]').val("");
  $('[name=modalClientes]').find('[name=fecha]').val("");
  $('[name=modalClientes]').find('[name=dir_trab]').val("");
  $('[name=modalClientes]').find('[name=correo]').val("");
}


//Fin funcion limpiar formulario

//Inicio funcion eliminar cliente
var accionEliminar = function(){
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
      z_index: 99999
    })
  } else {
  
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
            url: controlador+"/eliminar_cliente",
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
                    obtener_clientes();
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
    limpiar_formulario()
    var codigo = $(this).attr("codigo");
    var nombre1 = $(this).attr("nombre1");
    var nombre2 = $(this).attr("nombre2");
    var apellido1 = $(this).attr("apellido1");
    var apellido2 = $(this).attr("apellido2");
    var numero_documento = $(this).attr("numero_documento");

    var correo = $(this).attr("correo");
    var telefono = $(this).attr("telefono");
    var celular = $(this).attr("celular");
    var residencia = $(this).attr("residencia");
    var trabajo = $(this).attr("trabajo");


    
    $('[name=modalClientes]').modal()
    $('[name=modalClientes]').find('.modal-title').text("Modificar datos del "+accMod);
    var btnGuardar=$('[name=modalClientes]').find('[name=btnGuardar]');
    $('[name=modalClientes]').find('[name=tipo]').val('2');
    $('[name=modalClientes]').find('[name=codigo_cliente]').val(codigo);
    $('[name=modalClientes]').find('#nombre1').val(nombre1);
    $('[name=modalClientes]').find('#nombre2').val(nombre2);
    $('[name=modalClientes]').find('#apellido1').val(apellido1);
    $('[name=modalClientes]').find('#apellido2').val(apellido2);
    $('[name=modalClientes]').find('[name=numero_documento]').val(numero_documento);
    $('[name=modalClientes]').find('[name=correo]').val(correo);
    $('[name=modalClientes]').find('[name=telefono]').val(telefono);
    $('[name=modalClientes]').find('[name=celular]').val(celular);
    $('[name=modalClientes]').find('[name=dir_res]').val(residencia);
    $('[name=modalClientes]').find('[name=dir_trab]').val(trabajo);
    
    
  }
}
//Fin funcion modificar cliente




$('[name=listar]').on('click', function(){
  obtener_clientes();
 })

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

function validar_documento() {
  var data = $('[name=modalClientes]').find('[name=numero_documento]').val()
  retorno = '';
  $.ajax({
    async: false,
    url: "terceros_controller/validar_documento",
    type: 'POST',
    data: {
      codigo: data
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






var btnGuardar = $('[name=modalClientes]').find('[name=btnGuardar]');





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



$('#editar').on('click', function(){
 $(".has-error").removeClass("has-error");
 $('[name=modalClientes]').modal();
})


//Obtener regimenes
var obtener_regimenes = function(componente, dt){
  var select = $('#regimen');
  var name = select.attr('name');
  var combo = componente.find('[name="regimen"]');
  $.ajax({
      url: "terceros_controller/obtener_regimenes",
      success: function(response) {
        var respuesta = $.parseJSON(response);
        if (respuesta.success === true) {
          combo.empty();
          combo.append('<option value="">Seleccione</option>')
          var cantidad = respuesta.data.length
          item = respuesta.data[cantidad-1]
          combo.append('<option value="'+item["tipcodigo"]+'">'+item["tipdetalle"]+'</option>');
          for (var i = 0; i < cantidad-1; i++) {
            var item = respuesta.data[i];
            combo.append('<option value="'+item["tipcodigo"]+'">'+item["tipdetalle"]+'</option>');
          }
          if (dt !== false) {
            if (dt.length > 0) {
              combo.val(dt)
            }
          }
        }
      }
  });
}
//Fin obtener regimenes
