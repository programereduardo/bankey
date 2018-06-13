controlador = $('[name=controller]').val()
//Obtener forma de pago

function obtener_formapago(data) {
  var combo = $('[name=modalFacturacion]').find('[name=formpago]');
  $.ajax({
      url: "facturacion_controller/obtener_formapago",
      success: function(response) {
          var respuesta = $.parseJSON(response);
          if (respuesta.success === true) {
            combo.empty();
            combo.append('<option value="">Seleccione</option>')
            for (var i = 0; i < respuesta.data.length; i++) {
              var item = respuesta.data[i];
              combo.append('<option value="'+item["tipcodigo"]+'">'+item["tipdetalle"]+'</option>');
            }
            if (data.length > 0) {
              combo.val(data)
            }
          }
      }
  });
}
//Fin obtener forma de pago

function validar_cliente() {
  var cliente = $('[name=modalFacturacion]').find('[name=cliente-id]').val();
  var retorno = '';
  $.ajax({
    url: 'facturacion_controller/validar_cliente',
    data:{
      cliente: cliente
    },
    type: 'POST',
    success: function(response){
      var respuesta = $.parseJSON(response)
      if (respuesta.success === false) {
        $.notify({
          message: 'Advertencia! Este cliente posee una deuda de $'+formatMoney(respuesta.total)+' en un total de '+respuesta.cant+' facturas.'
        },{
          type: respuesta.type,
          delay: 5000,
          placement: {
            align: 'center'
          },
          z_index: 9999
        })
      }
    }
  })
}

//Obtener facturas
var obtener_facturas = function() {
  var componenteListarFacturas = $('[name=listar_facturas]');
  waitingDialog.show('Cargando, por favor espere...', {dialogSize: 'm', progressType: ''});
  var modelFila = '<tr class="{25}">'+
      '         <th scope="row">'+
      '            <span name="btnEditar" id="accionEditar"'+
      '              prefijo_factura="{1}" descuento_fac="{17}" tipo_descuento="{18}" numero_factura="{2}" cliente_factura="{3}" vendedor_factura="{4}"'+
      '              fecha_entrada="{5}" total="{28}" iva="{29}" descuento="{30}" total_factura={19} cuota_inicial="{23}" fecha_vencimiento="{6}" estado_factura="{7}" fecha_entrada="{8}"'+
      '              forma_pago="{9}" faciva="{20}" codigo_cliente="{15}" codigo_vendedor="{16}" factura_fletes="{10}" factura_retefuente="{11}" factura_reteica="{12}"'+
      '              factura_comision="{13}" factura_observacion="{14}" fac_saldo="{26}"'+
      '              class="text-info" style="width: 32px; padding-left: 0px; padding-right: 0px;" title="Editar" role="button">'+
      '                <span class="icon icon-pencil" style="font-size: 18px;"/></span>'+
      '            <span name="btnEliminar" id="accionEliminar" facprefijo="{1}" facnumero="{2}" title="Eliminar" '+
      '               class="text-danger" style="width: 32px; padding-left: 0px; padding-right: 0px;" role="button">'+
      '                <span class="icon icon-bin" style="font-size: 18px;"/></span>'+
      '        </th>'+
      '        <td id="codigo">{0}</td>'+
      '        <td id="codigo">{1}</td>'+
      '        <td>{2}</td>'+
      '        <td>{21}</td>'+
      '        <td>{3}</td>'+
      '        <td>{4}</td>'+
      '        <td>{5}</td>'+
      '        <td>{6}</td>'+
      '        <td>{24}</td>'+
      '        <td>{22}</td>'+
      '        <td>{27}</td>'+
      '        <td>{17}</td>'+
      '        <td>{20}</td>'+
      '        <td>{19}</td>'+
      '        <td>{7}</td>'+
      '    </tr>';
      $.ajax({
        url: 'facturacion_controller/obtener_facturas',
        success: function(response){
          var respuesta = $.parseJSON(response);
          var cantidad = respuesta.cant
          var htotal = respuesta.htotal
          var hiva = respuesta.hiva
          var hdesc = respuesta.hdesc
          componenteListarFacturas.empty();
          if (respuesta.success === true) {
            var datos = respuesta.data;
            for (var i = 0; i < datos.length; i++) {
              componenteListarFacturas.append(modelFila.format(
                datos[i]['faccodigo'], //0
                datos[i]['facprefijo'], //1
                datos[i]['facnumero'], //2
                datos[i]['faccliente'], //3
                datos[i]['facvendedor'], //4
                datos[i]['facfecent'], //5
                datos[i]['facfecvenci'], //6
                datos[i]['facestado'], //7
                datos[i]['facfecent'], //8
                datos[i]['facformapago'],//9
                datos[i]['facfletes'], //10
                datos[i]['facretefuente'], //11
                datos[i]['facreteica'], //12
                datos[i]['faccomision'], //13
                datos[i]['facobservacion'], //14
                datos[i]['tercodigo'], //15
                datos[i]['codigo_vendedor'], //16
                formatMoney(datos[i]['facdescuento']), //17
                datos[i]['factipodescuento'], //18
                formatMoney(datos[i]['factotal']), //19
                formatMoney(datos[i]['faciva']), //20
                datos[i]['terdocnum'],//21,
                formatMoney(datos[i]['facsaldo']),//22
                datos[i]['facpagoinicial'],//23,
                formatMoney(datos[i]['facpagoinicial']),//24
                clase = datos[i]['facestado'] == 'Anulado'? clase = 'danger': datos[i]['facestado'] == 'Finalizado'? clase = 'success': datos[i]['facestado'] == 'Edición'? clase = 'warning': clase = '',//25
                datos[i]['facsaldo'],//26
                formatMoney(datos[i]['facsubtotal']),//27
                datos[i]['factotal'], //28
                datos[i]['faciva'], //29
                datos[i]['facdescuento'], //30
              ));
              //var saldo = obtener_saldo()
            }
            $('[name=btnEliminar]').on('click', eliminar_factura);
            $('[name=btnEditar]').on('click', modificar_factura);
            $('#total_facturas').css('font-weight', 'bold')
            var fecha = new Date();
            var year = fecha.getFullYear();
            $('#total_facturas').html('TOTAL DE FACTURAS '+year+' : ' + cantidad + '&emsp;&emsp;&emsp;&emsp;&emsp;' + 'DESCUENTO '+year+' : ' + formatMoney(hdesc) + '&emsp;&emsp;&emsp;&emsp;&emsp;' + 'IVA '+year+' : ' + formatMoney(hiva) + '&emsp;&emsp;&emsp;&emsp;&emsp;' + 'TOTAL '+year+' : ' + formatMoney(htotal))
            if (screen.width <= 1024) {
              $('#total_facturas').html('T.FACTURAS '+year+': ' + cantidad + '&emsp;&emsp;&emsp;&emsp;&emsp;' + 'DESCUENTO '+year+' : ' + formatMoney(hdesc) + '&emsp;&emsp;&emsp;&emsp;&emsp;' + 'IVA '+year+' : ' + formatMoney(hiva) + '&emsp;&emsp;&emsp;&emsp;&emsp;' + 'TOTAL '+year+' : ' + formatMoney(htotal))
            }
          }
          waitingDialog.hide();
        }
      });
}
//Fin obtener facturas

obtener_facturas();

//Funcion calcular fecha nacimiento
$('[name=fecha]').daterangepicker({
  singleDatePicker: true,
  showDropdowns: true,
  startDate: moment(),
  locale: {
    format: 'YYYY-MM-DD'
  },
  singleDatePicker: true
});

$('[name=fecha_vencimiento]').daterangepicker({
  singleDatePicker: true,
  showDropdowns: true,
  startDate: moment().add(30, 'day'),
  locale: {
    format: 'YYYY-MM-DD'
  },
  singleDatePicker: true
});
//Fin fecha nacimineto

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
          $('[name=modalFacturacion]').find("#cliente").val(event.value);
          $('[name=modalFacturacion]').find("#cliente-id").val(event.id);
          validar_cliente()
          return false;
        }
      });
    }
  })
});
//Fin Autocompletado clientes

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
          $('[name=modalFacturacion]').find("#vendedor").val(event.value);
          $('[name=modalFacturacion]').find("#vendedor-id").val(event.id);
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
    if (acciones[i]['mod_nombre'] == 'Facturacion') {
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
      z_index: 9999
    })
  } else {
    $.notify({
      message: 'El valor de la fecha de entrada y la fecha de vencimiento se han agregado automaticamente con treinta (30) días de diferencia.'
    },{
      type: 'info',
      placement: {
        align: 'center'
      },
      z_index: 99999
    })
    $(".has-error").removeClass("has-error");
    $('[name=modalFacturacion]').find('.modal-title').text('Registrar factura');
    $('[name=modalFacturacion]').modal();
    $('[name=modalFacturacion]').find('[name=btnAbonar]').attr('disabled', 'disabled')
    $('[name=modalFacturacion]').find('[name=btnAbonar]').css('display', 'none')
    limpiar_factura();
    limpiar_listado();
    obtener_formapago(data = '');
  }
})
//Fin mostrar modal registro familias

/* Habilitar boton de agregar producto
$('#btnSalvarFactura').on('click', function(){
  $('#btnAgrPro').removeAttr('disabled', 'enabled')
})*/

var limpiar_listado = function(){
  $('[name=listado_articulos]').empty()
}


var obtener_productos = function(numero, prefijo, saldo){
  var numero = '';
  var componenteListarProductos = $('[name=modalFacturacion]').find('[name=listado_articulos]');
  var num = $('[name=modalFacturacion]').find('[name=numfac]').val();
  var numero_real = $('[name=modalFacturacion]').find('[name=numero_real]').val();
  if (num !== '') {
    numero = num
  }
  if (numero_real !== '') {
    numero = numero_real
  }
  if (numero_real == '') {
    numero = $('[name=modalFacturacion]').find('[name=numero_factura]').val();
  }
  waitingDialog.show('Cargando, por favor espere...', {dialogSize: 'm', progressType: ''});
  var modelFila = '<tr>'+
      '         <th scope="row">'+
      '            <span name="btnEliminarArt" codigo="{3}" title="Eliminar" '+
      '               class="text-danger" style="width: 32px; padding-left: 0px; padding-right: 0px;" role="button">'+
      '                <span class="icon icon-bin" style="font-size: 18px;"/></span>'+
      '        </th>'+
      '        <td id="codigo">{3}</td>'+
      '        <td>{0}</td>'+
      '        <td>{1}</td>'+
      '        <td>{2}</td>'+
      '        <td>{4}</td>'+
      '        <td>{5}</td>'+
      '        <td>{6}</td>'+
      '        <td>{7}</td>'+
      '        <td>{8}</td>'+
      '    </tr>';

      $.ajax({
        url: 'facturacion_controller/obtener_productos',
        type: 'POST',
        data: {
          numero_real: numero,
          prefijo_factura: prefijo
        },
        success: function(response){
          var respuesta = $.parseJSON(response);
          componenteListarProductos.empty();
          if (respuesta.success === true) {
            var datos = respuesta.articulos;
            var total = 0;
            for (var i = 0; i < datos.length; i++) {
              componenteListarProductos.append(modelFila.format(
                datos[i]['artreferencia'], //0
                datos[i]['artdescripcion'], //1
                datos[i]['detcantidad'], //2
                datos[i]['detcodigo'], //3
                datos[i]['tipdetalle'], //4
                formatMoney(datos[i]['detprecio']), //5
                formatMoney(datos[i]['detiva']), //6
                formatMoney(datos[i]['detdescuento']), //7
                formatMoney(datos[i]['detvalor']), //8
                datos[i]['detarticulo']//9
              ));
            }
            if (saldo !== false) {
              $('#saldofactura').html('SALDO : '+formatMoney(saldo))
            }
            $('#ivafactura').empty()
            $('#totalfactura').empty()
            $('#descuentofactura').empty()
            $('#descuentofactura').html('DESCUENTO : '+formatMoney(datos[0]['facdescuento']))
            $('#ivafactura').html('IVA : '+formatMoney(datos[0]['faciva']))
            $('#totalfactura').html('TOTAL : '+formatMoney(datos[0]['factotal']))
            if (screen.width <= 1024) {
              $('#descuentofactura').html(formatMoney(datos[0]['facdescuento']))
              $('#ivafactura').html(formatMoney(datos[0]['faciva']))
              $('#totalfactura').html(formatMoney(datos[0]['factotal']))
              $('#saldofactura').html(formatMoney(saldo))
            }
            $('[name=btnEliminarArt]').on('click', eliminar_articulo);
            $('[name=btnEditar]').on('click', modificar_factura);
          }
          waitingDialog.hide();
        }
      })
}
//Fin obtener familias


//Inicio mostrar ayuda
//Seccion ayuda
function mostrarAyuda() {
  $.notify({
    message: 'Ingrese el valor del Descuento, Iva y Articulo sin signos pesos ($) ni porcentajes (%).'
  }, {
    type: 'info',
    delay: 3000,
    placement: {
      align: 'center'
    },
    z_index: 99999,
  });
}

function ayudaDescuento() {
  $.notify({
    message: 'El valor del descuento solo se aplicará al guardar y finalizar la factura.'
  }, {
    type: 'info',
    delay: 3000,
    placement: {
      align: 'center'
    },
    z_index: 99999,
  });
}

function ayudaIva() {
  $.notify({
    message: 'El valor del IVA solo se aplicará al guardar y finalizar la factura.'
  }, {
    type: 'info',
    delay: 3000,
    placement: {
      align: 'center'
    },
    z_index: 99999,
  });
}

function mostrarAyudaCliente() {
  $.notify({
    message: 'Ingrese el nombre o el número de documento del cliente .'
  }, {
    type: 'info',
    delay: 3000,
    placement: {
      align: 'center'
    },
    z_index: 99999,
  });
}

function mostrarAyudaVendedor() {
  $.notify({
    message: 'Ingrese el nombre o el número de documento del vendedor.'
  }, {
    type: 'info',
    delay: 3000,
    placement: {
      align: 'center'
    },
    z_index: 99999,
  });
}
//Fin seccion ayuda

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
var eliminar_articulo = function(){
  var estado = validar_estado();
  if (estado === false) {
    $.notify({
      message: 'Esta factura ya ha sido guardada y finalizada, no se puede eliminar el articulo.'
    }, {
      type: 'danger',
      delay: 3000,
      placement: {
        align: 'center'
      },
      z_index: 99999,
    });
  } else {
    var codigo = $(this).attr("codigo");
    var num = $('[name=modalFacturacion]').find('[name=numero_real]').val();
    var prefijo = $('[name=modalFacturacion]').find('[name=prefijo]').val();
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
            url: 'facturacion_controller/eliminar_articulo',
            type: 'POST',
            data:{
              codigo: codigo
            },
            success: function(response){
              var respuesta = $.parseJSON(response);
              $.notify({
                message: 'Eliminado correctamente.'
              },{
                type: 'success',
                delay: 3000,
                placement: {
                  align: 'center'
                },
                z_index: 99999,
                onClosed: function(){
                  obtener_productos(num, prefijo, false);
                }
              })
            }
          })
        }
      }
    })
  }
}
//Fin funcion eliminar

var eliminar_factura = function(){
  var invalidDelete = true;
  for (var i = 0; i < acciones.length; i++) {
    if (acciones[i]['mod_nombre'] == 'Facturacion') {
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
      z_index: 9999
    })
  } else {
    var prefijo = $(this).attr("facprefijo");
    var numero = $(this).attr("facnumero");
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
            url: 'facturacion_controller/eliminar_factura',
            type: 'POST',
            data:{
              prefijo: prefijo,
              numero: numero
            },
            success: function(response){
              var respuesta = $.parseJSON(response);
              var tipo = respuesta.tipo
              var msg = respuesta.msg
              $.notify({
                message: msg
              },{
                type: tipo,
                delay: 1000,
                placement: {
                  align: 'center'
                },
                z_index: 9999,
                onClosed: function(){
                  obtener_facturas();
                }
              })
            }
          })
        }
      }
    })
  }
}

//Inicio funcion modificar categoria

var modificar_factura = function() {
  var invalidChange = true;
  for (var i = 0; i < acciones.length; i++) {
    if (acciones[i]['mod_nombre'] == 'Facturacion') {
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
      z_index: 9999
    })
  } else {
    $(".has-error").removeClass("has-error");
    var numero_factura = $(this).attr("numero_factura");
    var numero_real = $(this).attr("numero_factura");
    var prefijo_real = $(this).attr("prefijo_factura");
    var prefijo_factura = $(this).attr("prefijo_factura");
    var vendedor_factura = $(this).attr("vendedor_factura");
    var cliente_factura = $(this).attr("cliente_factura");
    var forma_pago = $(this).attr("forma_pago");
    var factura_fletes = $(this).attr("factura_fletes");
    var factura_retefuente = $(this).attr("factura_retefuente");
    var factura_reteica = $(this).attr("factura_reteica");
    var factura_comision = $(this).attr("factura_comision");
    var factura_observacion = $(this).attr("factura_observacion");
    var fecha_entrada = $(this).attr("fecha_entrada");
    var estado_factura = $(this).attr("estado_factura");
    var codigo_cliente = $(this).attr("codigo_cliente");
    var codigo_vendedor = $(this).attr("codigo_vendedor");
    var descuento_fac = $(this).attr("descuento_fac");
    var tipo_descuento = $(this).attr("tipo_descuento");
    var total_factura = $(this).attr("total_factura");
    var cuota_inicial = $(this).attr("cuota_inicial");
    var faciva = $(this).attr("faciva");
    var fecha_vencimiento = $(this).attr("fecha_vencimiento");
    var saldo = $(this).attr('fac_saldo');
    var total = $(this).attr("total");
    var iva = $(this).attr("iva");
    var descuento = $(this).attr("descuento");
    $('#saldofactura').html('SALDO : '+formatMoney(saldo))
    limpiar_listado();
    obtener_formapago(forma_pago)
    $('[name=modalFacturacion]').modal();
    if (estado_factura == "Finalizado") {
      $('[name=modalFacturacion]').find('[name=btnAbonar]').removeAttr('disabled')
      $('[name=modalFacturacion]').find('[name=btnAbonar]').css('display', 'block')
    } else {
      $('[name=modalFacturacion]').find('[name=btnAbonar]').attr('disabled', 'disabled')
      $('[name=modalFacturacion]').find('[name=btnAbonar]').css('display', 'none')
    }
    $('[name=modalAgregarAbono]').find('[name=saldo]').val(saldo);
    $('[name=modalFacturacion]').find('.modal-title').text('Modificar factura');
    $('[name=modalFacturacion]').find('[name=total]').val(total);
    $('[name=modalFacturacion]').find('[name=iva]').val(iva);
    $('[name=modalFacturacion]').find('[name=descuento]').val(descuento);
    $('[name=modalFacturacion]').find('[name=prefijo]').val(prefijo_factura);
    $('[name=modalFacturacion]').find('[name=prefijo_real]').val(prefijo_real);
    $('[name=modalFacturacion]').find('[name=numero_factura]').val(numero_factura);
    $('[name=modalFacturacion]').find('[name=numero_real]').val(numero_factura);
    $('[name=modalFacturacion]').find('[name=descuento]').val(descuento_fac);
    $('[name=modalFacturacion]').find('[name=iva]').val(faciva);
    $('[name=modalFacturacion]').find('[name=cliente]').val(cliente_factura);
    $('[name=modalFacturacion]').find('[name=vendedor]').val(vendedor_factura);
    $('[name=modalFacturacion]').find('[name=fletes]').val(factura_fletes);
    $('[name=modalFacturacion]').find('[name=retefuente]').val(factura_retefuente);
    $('[name=modalFacturacion]').find('[name=reteica]').val(factura_reteica);
    $('[name=modalFacturacion]').find('[name=comision]').val(factura_comision);
    $('[name=modalFacturacion]').find('[name=total_factura]').val(total_factura);
    $('[name=modalFacturacion]').find('[name=observacion]').val(factura_observacion);
    $('[name=modalFacturacion]').find('[name=fecha]').val(fecha_entrada);
    $('[name=modalFacturacion]').find('[name=fecha_vencimiento]').val(fecha_vencimiento);
    $('[name=modalFacturacion]').find('[name=cuota_inicial]').val(cuota_inicial);
    $('[name=modalFacturacion]').find('#cliente-id').val(codigo_cliente);
    $('[name=modalFacturacion]').find('#vendedor-id').val(codigo_vendedor);
    $('[name=modalFacturacion]').find('[name=tipo_descuento]').val();
    $('[name=modalFacturacion]').find('[name=tipo]').val('2');
    $('[name=modalAgregarProducto]').find('[name=tipo]').val('2');
    obtener_productos(numero_real, prefijo_factura, saldo);
    $('#descuentofactura').empty()
    $('#ivafactura').empty()
    $('#totalfactura').empty()
    $('#descuentofactura').html('DESCUENTO : '+descuento_fac)
    $('#ivafactura').html('IVA : '+faciva)
    $('#totalfactura').html('TOTAL : '+total_factura)
    if (screen.width <= 1024) {
      $('#descuentofactura').html(descuento_fac)
      $('#ivafactura').html(faciva)
      $('#totalfactura').html(total_factura)
    }
    $('[name=btnEliminarArt]').on('click', eliminar_articulo);
    $('[name=btnEditar]').on('click', modificar_factura);
  }
}

//Fin funcion modificar categoria

//Inicio funcion limpiar categoria
var limpiar_factura = function(){
  $('[name=modalFacturacion]').find('[name=formpago]').val("");
  $('[name=modalFacturacion]').find('[name=descuento]').val("0");
  $('[name=modalFacturacion]').find('[name=fletes]').val("0");
  $('[name=modalFacturacion]').find('[name=iva]').val("0");
  $('[name=modalFacturacion]').find('[name=total_factura]').val("0");
  $('[name=modalFacturacion]').find('[name=reteica]').val("0");
  $('[name=modalFacturacion]').find('[name=retefuente]').val("0");
  $('[name=modalFacturacion]').find('[name=comision]').val("0");
  $('[name=modalFacturacion]').find('[name=cliente]').val("");
  $('[name=modalFacturacion]').find('[name=vendedor]').val("");
  $('[name=modalFacturacion]').find('[name=numero_factura]').val("");
  $('[name=modalFacturacion]').find('[name=numero_real]').val("");
  $('[name=modalFacturacion]').find('[name=prefijo]').val("");
  var hoy = new Date().toJSON().slice(0,10)
  mañana = mostrarFecha(30)
  $('[name=modalFacturacion]').find('[name=fecha]').val(hoy);
  $('[name=modalFacturacion]').find('[name=fecha_vencimiento]').val(mañana);
  $('[name=modalFacturacion]').find('[name=cuota_inicial]').val("");
  $('[name=modalFacturacion]').find('[name=observacion]').val("");
  $('[name=modalFacturacion]').find('[name=codigo_categoria]').val("");
  $('[name=modalFacturacion]').find('[name=clave]').val("");
  $('[name=modalFacturacion]').find('[name=abreviatura]').val("");
  $('[name=modalFacturacion]').find('[name=detalle]').val("");
  $('[name=modalFacturacion]').find('[name=tipo]').val('1');
  $('[name=modalAgregarProducto]').find('[name=tipo]').val('1');
  $('[name=modalFacturacion]').find('#saldofactura').html('SALDO:');
  $('[name=modalFacturacion]').find('#descuentofactura').html('DESCUENTO:');
  $('[name=modalFacturacion]').find('#ivafactura').html('IVA:');
  $('[name=modalFacturacion]').find('#totalfactura').html('TOTAL:');

}
//Fin funcion limpiar categoria
$('#btnAnularFactura').on('click', function(){
  anular_factura()
})

var anular_factura = function(){
  var btnAnularFactura = $(this);
  var datos_detalle = $('[name=formDetalle]').serializeArray();
  var error = false;
  var mensajeError = 'Guardado correctamente.';
  var estado = validar_estado();
  if (estado === false) {
    $.notify({
      message: 'Esta factura ya ha sido guardada y finalizada, no se puede editar.'
    }, {
      type: 'danger',
      delay: 3000,
      placement: {
        align: 'center'
      },
      z_index: 99999,
    });
  } else {
    for (var i = 0; i < datos_detalle.length; i++) {
      var label = datos_detalle[i]['name'];
      var valor = datos_detalle[i]['value'];
      var compItem = $('[name=' + label + ']');
      $('.has-error').removeClass('has-error');
      switch (label) {
        case 'cliente':
          if (valor.trim() == ''){
            mensajeError = 'El cliente es necesario.';
            error = true;
            compItem.focus();
            compItem.parent('div').addClass("has-error");
            i = datos_detalle.length + 100;
            break;
          }
          break;
        case 'cliente-id':
          if (valor.trim() == ''){
            mensajeError = 'Error! Ese cliente no ha sido registrado.';
            error = true;
            compItem.focus();
            compItem.parent('div').addClass("has-error");
            i = datos_detalle.length + 100;
            break;
          }
          break;
        case 'vendedor':
          if (valor.trim() == ''){
            mensajeError = 'El vendedor es necesario.';
            error = true;
            compItem.focus();
            compItem.parent('div').addClass("has-error");
            i = datos_detalle.length + 100;
            break;
          }
          break;
        case 'formpago':
        if (valor.trim() == ''){
          mensajeError = 'La forma de pago es necesaria.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_detalle.length + 100;
          break;
        }
        break;
        case 'prefijo':
        if (valor.trim() == ''){
          mensajeError = 'El prefijo de la factura es necesario.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_detalle.length + 100;
          break;
        }
        break;
        case 'numero_factura':
        if (valor.trim() == ''){
          mensajeError = 'El número de la factura es necesario.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_detalle.length + 100;
          break;
        }
        break;
        case 'fecha':
        if (valor.trim() == ''){
          mensajeError = 'La fecha de entrada de  la factura es necesaria.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_detalle.length + 100;
          break;
        }
        break;
        case 'cuota_inicial':
        if (valor.trim() == ''){
          mensajeError = 'Ingrese la cuota inicial.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_detalle.length + 100;
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
      //AQUIII
      tipo = $('[name=modalFacturacion]').find('[name=tipo]').val()
      var aux = true;
      if (tipo == '1') {
        var estado = validar_numfac();
        if (estado === false) {
          aux = false;
          $.notify({
            message: 'El número de factura que intenta registrar ya se encuentra registrado.'
          }, {
            type: 'danger',
            delay: 3000,
            placement: {
              align: 'center'
            },
            z_index: 99999,
          });
        }
      }
      if (aux === true) {
          var fd = new FormData(document.getElementById("formDetalle"));
          var datos_detalle = $('[name=formDetalle]').serializeArray();
          waitingDialog.show('Guardando los cambios, por favor espere...', {dialogSize: 'm', progressType: ''});
          $.ajax({
            url: 'facturacion_controller/anular_factura',
            type: 'POST',
            data: datos_detalle,
            success: function(response){
              var respuesta = $.parseJSON(response)
              var msg = 'Se produjo un error inesperado, intentelo más tarde. Si no funciona pongase en contacto con el Departamento de Sistemas (ERROR: ANUFAC001).'
              var type = 'danger'
              if (respuesta.success === true) {
                msg = 'Acción realizada con exíto.'
                type = 'success'
              }
              $.notify({
                message: msg
              }, {
                type: type,
                delay: 3000,
                placement: {
                  align: 'center'
                },
                z_index: 99999,
                onClosed: function(){
                  obtener_facturas()
                  waitingDialog.hide();
                }
              })
            }
          })
        }
      }
  }
}


//Todo lo que tiene que ver con el formulario agregar producto a la factura

var limpiar_formulario = function(){
  $('[name=modalAgregarProducto]').find('[name=producto]').val('');
  $('[name=modalAgregarProducto]').find('[name=valor]').val('');
  $('[name=modalAgregarProducto]').find('[name=cantidad]').val('');
  $('[name=modalAgregarProducto]').find('[name=descuento_art]').val('');
  //$('[name=modalAgregarProducto]').find('[name=iva]').val('');
  $('[name=modalAgregarProducto]').find('[name=codigo_producto]').val('')
}

btnAgrPro = $('[name=modalFacturacion]').find('#btnAgrPro')
btnAgrPro.on('click', function(){
  var btn = $('[name=modalAgregarProducto]').find('[name=btnAgregarPro]')
  btn.removeAttr('disabled')
  var estado = validar_estado();
  var msg = ''
  var type = ''
  var datos_detalle = $('[name=formDetalle]').serializeArray();
  if (estado === false) {
    $.notify({
      message: 'Esta factura ya ha sido finalizada, no se puede editar.'
    }, {
      type: 'danger',
      delay: 3000,
      placement: {
        align: 'center'
      },
      z_index: 99999,
    });
  } else {
  var btnAgrPro = $(this);
  var datos_detalle = $('[name=formDetalle]').serializeArray();
  var error = false;
  var mensajeError = 'Guardado correctamente.';
  for (var i = 0; i < datos_detalle.length; i++) {
    var label = datos_detalle[i]['name'];
    var valor = datos_detalle[i]['value'];
    var compItem = $('[name=' + label + ']');
    $('.has-error').removeClass('has-error');
    switch (label) {
      case 'cliente':
        if (valor.trim() == ''){
          mensajeError = 'El cliente es necesario.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_detalle.length + 100;
          break;
        }
        break;
      case 'cliente-id':
        if (valor.trim() == ''){
          mensajeError = 'Error! Ese cliente no ha sido registrado.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_detalle.length + 100;
          break;
        }
        break;
      case 'vendedor':
        if (valor.trim() == ''){
          mensajeError = 'El vendedor es necesario.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_detalle.length + 100;
          break;
        }
        break;
      case 'formpago':
      if (valor.trim() == ''){
        mensajeError = 'La forma de pago es necesaria.';
        error = true;
        compItem.focus();
        compItem.parent('div').addClass("has-error");
        i = datos_detalle.length + 100;
        break;
      }
      break;
      case 'prefijo':
      if (valor.trim() == ''){
        mensajeError = 'El prefijo de la factura es necesario.';
        error = true;
        compItem.focus();
        compItem.parent('div').addClass("has-error");
        i = datos_detalle.length + 100;
        break;
      }
      break;
      case 'numero_factura':
      if (valor.trim() == ''){
        mensajeError = 'El número de la factura es necesario.';
        error = true;
        compItem.focus();
        compItem.parent('div').addClass("has-error");
        i = datos_detalle.length + 100;
        break;
      }
      break;
      case 'fecha':
      if (valor.trim() == ''){
        mensajeError = 'La fecha de entrada de  la factura es necesaria.';
        error = true;
        compItem.focus();
        compItem.parent('div').addClass("has-error");
        i = datos_detalle.length + 100;
        break;
      }
      break;
      case 'cuota_inicial':
      if (valor.trim() == ''){
        mensajeError = 'Ingrese la cuota inicial.';
        error = true;
        compItem.focus();
        compItem.parent('div').addClass("has-error");
        i = datos_detalle.length + 100;
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
    var tipo = $('[name=modalFacturacion]').find('[name=tipo]').val()
    if (tipo == '1') {
      var estado = validar_numfac();
      if (estado === false) {
        $.notify({
          message: 'El número de factura que intenta registrar ya se encuentra registrado.'
        }, {
          type: 'danger',
          delay: 3000,
          placement: {
            align: 'center'
          },
          z_index: 99999,
        });
      } else {
        var prefijo = $('[name=modalFacturacion]').find('[name=prefijo]').val()
        var numero_factura = $('[name=modalFacturacion]').find('[name=numero_factura]').val()
        var fecha_entrada = $('[name=modalFacturacion]').find('[name=fecha]').val()
        var cliente = $('[name=modalFacturacion]').find('#cliente-id').val()
        var vendedor = $('[name=modalFacturacion]').find('#vendedor-id').val()
        var formpago = $('[name=modalFacturacion]').find('[name=formpago]').val()
        var fletes = $('[name=modalFacturacion]').find('[name=fletes]').val()
        var retefuente = $('[name=modalFacturacion]').find('[name=retefuente]').val()
        var reteica = $('[name=modalFacturacion]').find('[name=reteica]').val()
        var comision = $('[name=modalFacturacion]').find('[name=comision]').val()
        var observacion = $('[name=modalFacturacion]').find('[name=observacion]').val()
        var descuento = $('[name=modalFacturacion]').find('[name=descuento]').val()
        var tipo_descuento = $('[name=modalFacturacion]').find('[name=tipo_descuento]').val()
        var numero_real = $('[name=modalFacturacion]').find('[name=numero_real]').val()
        var iva = $('[name=modalFacturacion]').find('[name=iva]').val()
        var total = $('[name=modalFacturacion]').find('[name=total_factura]').val()
        var cuota_inicial = $('[name=modalFacturacion]').find('[name=cuota_inicial]').val()
        var fecha_vencimiento = $('[name=modalFacturacion]').find('[name=fecha_vencimiento]').val()
        $('[name=modalAgregarProducto]').find('[name=numero_real]').val(numero_real)
        $('[name=modalAgregarProducto]').find('[name=prefijo]').val(prefijo)
        $('[name=modalAgregarProducto]').find('[name=numero_factura]').val(numero_factura)
        $('[name=modalAgregarProducto]').find('[name=fecha]').val(fecha_entrada)
        $('[name=modalAgregarProducto]').find('[name=cliente]').val(cliente)
        $('[name=modalAgregarProducto]').find('[name=vendedor]').val(vendedor)
        $('[name=modalAgregarProducto]').find('[name=formpago]').val(formpago)
        $('[name=modalAgregarProducto]').find('[name=fletes]').val(fletes)
        $('[name=modalAgregarProducto]').find('[name=retefuente]').val(retefuente)
        $('[name=modalAgregarProducto]').find('[name=reteica]').val(reteica)
        $('[name=modalAgregarProducto]').find('[name=comision]').val(comision)
        $('[name=modalAgregarProducto]').find('[name=observacion]').val(observacion)
        $('[name=modalAgregarProducto]').find('[name=descuento]').val(descuento)
        $('[name=modalAgregarProducto]').find('[name=tipo_descuento]').val(tipo_descuento)
        $('[name=modalAgregarProducto]').find('[name=iva]').val(iva)
        $('[name=modalAgregarProducto]').find('[name=total]').val(total)
        $('[name=modalAgregarProducto]').find('[name=cuota_inicial]').val(cuota_inicial)
        $('[name=modalAgregarProducto]').find('[name=fecha_vencimiento]').val(fecha_vencimiento)
        $(".has-error").removeClass("has-error");
        $('[name=modalAgregarProducto]').modal();
        limpiar_formulario()
        obtener_articulos()
      }
    } else {
      var prefijo = $('[name=modalFacturacion]').find('[name=prefijo]').val()
      var numero_factura = $('[name=modalFacturacion]').find('[name=numero_factura]').val()
      var fecha_entrada = $('[name=modalFacturacion]').find('[name=fecha]').val()
      var cliente = $('[name=modalFacturacion]').find('#cliente-id').val()
      var vendedor = $('[name=modalFacturacion]').find('#vendedor-id').val()
      var formpago = $('[name=modalFacturacion]').find('[name=formpago]').val()
      var fletes = $('[name=modalFacturacion]').find('[name=fletes]').val()
      var retefuente = $('[name=modalFacturacion]').find('[name=retefuente]').val()
      var reteica = $('[name=modalFacturacion]').find('[name=reteica]').val()
      var comision = $('[name=modalFacturacion]').find('[name=comision]').val()
      var observacion = $('[name=modalFacturacion]').find('[name=observacion]').val()
      var descuento = $('[name=modalFacturacion]').find('[name=descuento]').val()
      var tipo_descuento = $('[name=modalFacturacion]').find('[name=tipo_descuento]').val()
      var numero_real = $('[name=modalFacturacion]').find('[name=numero_real]').val()
      var iva = $('[name=modalFacturacion]').find('[name=iva]').val()
      var total = $('[name=modalFacturacion]').find('[name=total]').val()
      var cuota_inicial = $('[name=modalFacturacion]').find('[name=cuota_inicial]').val()
      var fecha_vencimiento = $('[name=modalFacturacion]').find('[name=fecha_vencimiento]').val()
      $('[name=modalAgregarProducto]').find('[name=total]').val(total)
      $('[name=modalAgregarProducto]').find('[name=iva]').val(iva)
      $('[name=modalAgregarProducto]').find('[name=numero_real]').val(numero_real)
      $('[name=modalAgregarProducto]').find('[name=prefijo]').val(prefijo)
      $('[name=modalAgregarProducto]').find('[name=numero_factura]').val(numero_factura)
      $('[name=modalAgregarProducto]').find('[name=fecha]').val(fecha_entrada)
      $('[name=modalAgregarProducto]').find('[name=cliente]').val(cliente)
      $('[name=modalAgregarProducto]').find('[name=vendedor]').val(vendedor)
      $('[name=modalAgregarProducto]').find('[name=formpago]').val(formpago)
      $('[name=modalAgregarProducto]').find('[name=fletes]').val(fletes)
      $('[name=modalAgregarProducto]').find('[name=retefuente]').val(retefuente)
      $('[name=modalAgregarProducto]').find('[name=reteica]').val(reteica)
      $('[name=modalAgregarProducto]').find('[name=comision]').val(comision)
      $('[name=modalAgregarProducto]').find('[name=observacion]').val(observacion)
      $('[name=modalAgregarProducto]').find('[name=descuento]').val(descuento)
      $('[name=modalAgregarProducto]').find('[name=tipo_descuento]').val(tipo_descuento)
      $('[name=modalAgregarProducto]').find('[name=cuota_inicial]').val(cuota_inicial)
      $('[name=modalAgregarProducto]').find('[name=fecha_vencimiento]').val(fecha_vencimiento)
      $(".has-error").removeClass("has-error");
      $('[name=modalAgregarProducto]').modal();
      limpiar_formulario()
      obtener_articulos()
    }
  }
}
})

var enviar_articulo = function()
{
  
    debugger
  //var art = boton.parent('<tr>').find('[name=art]').val()
  var boton = $(this);
  var articulo = boton.data('id')
  var valor = $('[name=modalAgregarProducto]').find('[name=valor][data-id='+articulo+']').val()
  var cantidad = $('[name=modalAgregarProducto]').find('[name=cantidad][data-id='+articulo+']').val()
  var msg = "Accion realizada éxitosamente.";
  var type = "success";
  var next = true;

  var numero_factura = $('[name=modalAgregarProducto]').find('[name=numero_factura]').val()
  var prefijo = $('[name=modalAgregarProducto]').find('[name=prefijo]').val()
  var numero_real = $('[name=modalAgregarProducto]').find('[name=numero_real]').val()
  var fecha = $('[name=modalAgregarProducto]').find('[name=fecha]').val()
  var cliente = $('[name=modalAgregarProducto]').find('[name=cliente]').val()
  var vendedor = $('[name=modalAgregarProducto]').find('[name=vendedor]').val()
  var formpago = $('[name=modalAgregarProducto]').find('[name=formpago]').val()
  var fletes = $('[name=modalAgregarProducto]').find('[name=fletes]').val()
  var retefuente = $('[name=modalAgregarProducto]').find('[name=retefuente]').val()
  var reteica = $('[name=modalAgregarProducto]').find('[name=reteica]').val()
  var comision = $('[name=modalAgregarProducto]').find('[name=comision]').val()
  var observacion = $('[name=modalAgregarProducto]').find('[name=observacion]').val()
  var descuento = $('[name=modalAgregarProducto]').find('[name=descuento]').val()
  var iva = $('[name=modalAgregarProducto]').find('[name=iva]').val()
  var tipo_descuento = $('[name=modalAgregarProducto]').find('[name=tipo_descuento]').val()
  var iva_producto = $('[name=modalAgregarProducto]').find('[name=iva_producto]').val()
  var total = $('[name=modalAgregarProducto]').find('[name=total]').val()
  var fecha_vencimiento = $('[name=modalAgregarProducto]').find('[name=fecha_vencimiento]').val()
  var cuota_inicial = $('[name=modalAgregarProducto]').find('[name=cuota_inicial]').val()
  var tipo = $('[name=modalAgregarProducto]').find('[name=tipo]').val()
  if (tipo == "1") {
    $('[name=modalAgregarProducto]').find('[name=numero_real]').val(numero_factura)
  }
  $('[name=modalAgregarProducto]').find('[name=tipo]').val('2')
  $('[name=modalFacturacion]').find('[name=tipo]').val('2')
  if (numero_real == "") {
    //$('[name=modalAgregarProducto]').find('[name=numero_real]').val(numero_factura)
    $('[name=modalFacturacion]').find('[name=numero_real]').val(numero_factura)
  }

  if (valor == "") {
    msg = 'Ingrese un valor valido.';
    type = 'danger';
    next = false;
  }
  if (next) {
    if (cantidad == "" || cantidad == "0" || cantidad == 0) {
      msg = 'Ingrese una cantidad valida.';
      type = 'danger';
      next = false;
    }
  }
  if (next) {
    $.ajax({
      url: 'facturacion_controller/guardar_producto',
      type: 'POST',
      data: {
        codigo_producto: articulo,
        valor: valor,
        cantidad: cantidad,
        numero_factura: numero_factura,
        prefijo: prefijo,
        numero_real: numero_real,
        fecha: fecha,
        cliente: cliente,
        vendedor: vendedor,
        formpago: formpago,
        fletes: fletes,
        retefuente: retefuente,
        reteica: reteica,
        comision: comision,
        observacion: observacion,
        descuento: descuento,
        iva: iva,
        tipo_descuento: tipo_descuento,
        iva_producto: iva_producto,
        total: total,
        fecha_vencimiento: fecha_vencimiento,
        cuota_inicial: cuota_inicial,
        tipo: tipo
      },
      success: function(response){
        var resp = $.parseJSON(response)
        if (resp.success) {
          generarNotify('Accion realizada éxitosamente.', 'success');
          obtener_productos(numero_factura, prefijo, false)
          obtener_facturas();
          factura = $('[name=modalFacturacion]').find('[name=numero_factura]').val()
          get_location(factura);

        }
      }
    })
  } else {
    generarNotify(msg, type);
  }


}





//Obtener articulos
obtener_articulos = function(){
    var componente = $('[name=modalAgregarProducto]').find('[name=listar_productos_agg]');
    var modelFila = '<tr>'+
        '        <td data-id="{0}">{2} {3}</td>'+
        '        <td><input type="number" data-id="{0}" id="valor" maxlength="20" value="{1}" class="form-control" name="valor" placeholder="Valor"></td>'+
        '        <td><input type="number" data-id="{0}" id="cantidad" maxlength="20" value="0" class="form-control" name="cantidad" placeholder="Cantidad"></td>'+
        '         <th scope="row">'+
        '          <button type="button" data-id="{0}" articulo="{0}" valor="{1}" cantidad="03" class="btn btn-primary" id="btnAgregarPro" name="btnEnviarPro">Agregar</button>'+
        '        </th>'+
        '    </tr>';
    $.ajax({
        url: "facturacion_controller/obtener_articulos",
        success: function(response) {
            componente.empty();
            var respuesta = $.parseJSON(response);
            var datos = respuesta.articulos
            if (respuesta.success) {
              for (var i = 0; i < datos.length; i++) {
                componente.append(modelFila.format(
                  datos[i]['artcodigo'], //0
                  datos[i]['artvalor'], //1
                  datos[i]['artreferencia'], //2
                  datos[i]['artdescripcion'], //3
                ));
              }
              $('[name=modalAgregarProducto]').find('[name=btnEnviarPro]').on('click', enviar_articulo);
            } else {
              generarNotify('Ingrese unos articulos para poder agregarlos a la factura.', 'info');
            }
        }
    });
}
//Fin obtener articulos
//Obtener valor
function valor_articulo() {
  var valor_articulo = $('[name=modalAgregarProducto]').find('[name=producto]').val();
  valor_articulo = $('[name=modalAgregarProducto]').find('[name=producto]').find('[value='+valor_articulo+']').attr('valor_art')
  $('[name=modalAgregarProducto]').find('[name=valor]').val(valor_articulo)

  var value = $('[name=modalAgregarProducto]').find('[name=producto]').val();
  value = $('[name=modalAgregarProducto]').find('[name=producto]').find('[value='+value+']').attr('value')
  $('[name=modalAgregarProducto]').find('[name=codigo_producto]').val(value)

  //AQUÍ SE DEBE HACER FUNCIÖN QUE VALIDE EXISTENCIAS DEL ARTICULO A VENDER EN INVENTARIO
}


function validar_existencias() {
  var producto = $('[name=modalAgregarProducto]').find('[name=codigo_producto]').val();
  var cantidad = $('[name=modalAgregarProducto]').find('[name=cantidad]').val();
  var btn = $('[name=modalAgregarProducto]').find('[name=btnAgregarPro]')
  var seguir = true;
  if (cantidad == '') {
    seguir = false;
  }
  if (seguir === true) {
    $.ajax({
      url: 'facturacion_controller/validar_existencias',
      type: 'POST',
      data: {
        producto: producto,
        cantidad: cantidad
      },
      success: function(response) {
        var respuesta = $.parseJSON(response);
        if (respuesta.success === false) {
          btn.attr('disabled', 'disabled')
        } else {
          btn.removeAttr('disabled')
        }
        $.notify({
          message: respuesta.msg
        }, {
          type: respuesta.type,
          delay: 3000,
          placement: {
            align: 'center'
          },
          z_index: 99999
        });
      }
    })
  }
}

var agregar_producto = function(){
  var datos_factura = $('[name=formAggProducto]').serializeArray();
  var error = false;
  var mensajeError = 'Guardado correctamente.';
  for (var i = 0; i < datos_factura.length; i++) {
    var label = datos_factura[i]['name'];
    var valor = datos_factura[i]['value'];
    var compItem = $('[name=' + label + ']');
    $('.has-error').removeClass('has-error');
    switch (label) {
      case 'producto':
        if (valor.trim() == ''){
          mensajeError = 'El producto es necesario.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_factura.length + 100;
          break;
        }
        break;
      case 'valor':
        if (valor.trim() == ''){
          mensajeError = 'El valor del producto es necesario.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_factura.length + 100;
          break;
        }
        break;
      case 'cantidad':
      if (valor.trim() == ''){
        mensajeError = 'La cantidad del articulo es necesaria.';
        error = true;
        compItem.focus();
        compItem.parent('div').addClass("has-error");
        i = datos_factura.length + 100;
        break;
      }
      break;
      case 'descuento_art':
      if (valor.trim() == ''){
        mensajeError = 'El descuento del arituclo es necesario.';
        error = true;
        compItem.focus();
        compItem.parent('div').addClass("has-error");
        i = datos_factura.length + 100;
        break;
      }
      break;
      case 'iva':
      if (valor.trim() == ''){
        mensajeError = 'El porcentaje de iva es necesario.';
        error = true;
        compItem.focus();
        compItem.parent('div').addClass("has-error");
        i = datos_factura.length + 100;
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
    var fd = new FormData(document.getElementById("formAggProducto"));
        waitingDialog.show('Guardando los cambios, por favor espere...', {dialogSize: 'm', progressType: ''});
        $.ajax({
          url: 'facturacion_controller/guardar_producto',
          type: 'POST',
          data: fd,
          processData: false, // tell jQuery not to process the data
          contentType: false   // tell jQuery not to set contentType
        }).done(function(data) {
            waitingDialog.hide();
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
                  var tipo = $('[name=modalFacturacion]').find('[name=tipo]').val()
                  //TRABAJAR EN GRABADO DE LOCALIZACIÓN
                  /*factura = $('[name=modalFacturacion]').find('#numero_factura').val()
                  save_location(factura);*/
                  $('[name=modalAgregarProducto]').modal('hide');
                  var x = $('[name=modalFacturacion]').find('[name=numero_factura]').val();
                  $('[name=modalFacturacion]').find('[name=numero_real]').val(x);
                  var num = $('[name=modalFacturacion]').find('[name=numero_real]').val();
                  var pre = $('[name=modalFacturacion]').find('[name=prefijo]').val();
                  $('[name=modalFacturacion]').find('[name=numfac]').val(num);
                  obtener_productos(num, pre, false);
                  $('[name=modalFacturacion]').find('[name=tipo]').val('2')
                  $('[name=modalAgregarProducto]').find('[name=tipo]').val('2')
                  obtener_facturas()
                }
            });
        });
  }
}

btnAgregarPro = $('[name=modalAgregarProducto]').find('#btnAgregarPro')
//btnAgregarPro.on('click', agregar_producto)

function validar_estado() {
  var data = $('[name=modalFacturacion]').find('[name=numero_real]').val()
  if (data !== '') {
    retorno = '';
    $.ajax({
      async: false,
      url: "facturacion_controller/validar_estado",
      type: 'POST',
      data: {
        codigo: data
      },
      success: function(response) {
        var respuesta = $.parseJSON(response);
        var item = respuesta.data
        if (item[0]['facestado'] == 'E') {
          retorno = true
        } else {
          retorno = false
        }
      }
    })
    return (retorno)
  }
}

$('#btnAbonar').on('click', function(){
  var invalidPay = true;
  for (var i = 0; i < acciones.length; i++) {
    if (acciones[i]['mod_nombre'] == 'Facturacion') {
      if (acciones[i]['acc_descripcion'] == 'Abonar') {
        invalidPay = false;
      }
    }
  }
  if (invalidPay === true) {
    $.notify({
      message: 'Error! Usted no posee permisos para ejecutar esta acción.'
    },{
      type: 'danger',
      delay: 1000,
      placement: {
        align: 'center'
      },
      z_index: 9999
    })
  } else {
    var num_fac = $('[name=modalFacturacion]').find('[name=numero_real]').val()
    $('[name=modalAgregarAbono]').find('[name=numero_real]').val(num_fac)
    cargar_abonos()
  }
})

var cargar_abonos = function(){
  var componenteListarAbonos = $('[name=listado_abonos]');
  var numero_real = $('[name=modalFacturacion]').find('[name=numero_real]').val();
  var modelFila = '<tr>'+
      '         <th scope="row">'+
      '            <span name="btnEliminarPago" codigo="{0}" title="Eliminar" '+
      '               class="text-danger" style="width: 32px; padding-left: 0px; padding-right: 0px;" role="button">'+
      '                <span class="icon icon-bin" style="font-size: 18px;"/></span>'+
      '        </th>'+
      '        <td id="codigo">{3}</td>'+
      '        <td>{2}</td>'+
      '        <td>{1}</td>'+
      '        <td>{3}</td>'+
      '    </tr>';

      $.ajax({
        url: 'facturacion_controller/obtener_pagos',
        type: 'POST',
        data: {
          numero: numero_real
        },
        success: function(response){
          var respuesta = $.parseJSON(response);
          componenteListarAbonos.empty();
          if (respuesta.success === true) {
            var datos = respuesta.data;
            var total = 0;
            for (var i = 0; i < datos.length; i++) {
              componenteListarAbonos.append(modelFila.format(
                datos[i]['pagcodigo'], //0
                formatMoney(datos[i]['pagabono']), //1
                datos[i]['tipdetalle'], //2
                datos[i]['pagfechacreacion'], //3
              ));
            }
          }
        }
      })
  $('[name=modalAgregarAbono]').modal();
  obtener_tipos_abono();
}
obtener_tipos_abono = function(){
    var combo=$('[name=modalAgregarAbono]').find('[name=tipo_abono]');
    $.ajax({
        url: "facturacion_controller/obtener_tipos_abonos",
        success: function(response) {
            var respuesta = $.parseJSON(response);
            if (respuesta.success === true) {
              combo.empty();
              combo.append('<option value="">Seleccione</option>')
              for (var i = 0; i < respuesta.data.length; i++) {
                var item = respuesta.data[i];
                combo.append('<option value="'+item["tipcodigo"]+'">'+item["tipdetalle"]+'</option>');
              }
              /*if (data.length > 0) {
                combo.val(data)
              }*/
            }
        }
    });
}

$('[name=modalFacturacion]').find('#btnSalvarFactura').on('click', function(){
  var numero_real = $('[name=modalFacturacion]').find('[name=numero_real]').val()
  var seguir = true;
  if (numero_real == "" || numero_real == undefined) {
    $.notify({
      message: 'Para guardar una factura primero debe agregar un producto.'
    }, {
      type: 'danger',
      delay: 3000,
      placement: {
        align: 'center'
      },
      z_index: 99999,
    })
     seguir = false;
  }  
  if (seguir === true) {
    var prefijo_factura = $('[name=modalFacturacion]').find('[name=prefijo_real]').val()
    var datos_detalle = $('[name=formDetalle]').serializeArray();
    if (datos_detalle.length > 0){
      var error = false;
      var mensajeError = 'Guardado correctamente.';
      for (var i = 0; i < datos_detalle.length; i++) {
        var label = datos_detalle[i]['name'];
        var valor = datos_detalle[i]['value'];
        var compItem = $('[name=' + label + ']');
        $('.has-error').removeClass('has-error');
        switch (label) {
          case 'cliente':
            if (valor.trim() == ''){
              mensajeError = 'El cliente es necesario.';
              error = true;
              compItem.focus();
              compItem.parent('div').addClass("has-error");
              i = datos_detalle.length + 100;
              break;
            }
            break;
          case 'cliente-id':
            if (valor.trim() == ''){
              mensajeError = 'Error! Ese cliente no ha sido registrado.';
              error = true;
              compItem.focus();
              compItem.parent('div').addClass("has-error");
              i = datos_detalle.length + 100;
              break;
            }
            break;
          case 'vendedor':
            if (valor.trim() == ''){
              mensajeError = 'El vendedor es necesario.';
              error = true;
              compItem.focus();
              compItem.parent('div').addClass("has-error");
              i = datos_detalle.length + 100;
              break;
            }
            break;
          case 'formpago':
          if (valor.trim() == ''){
            mensajeError = 'La forma de pago es necesaria.';
            error = true;
            compItem.focus();
            compItem.parent('div').addClass("has-error");
            i = datos_detalle.length + 100;
            break;
          }
          break;
          case 'prefijo':
          if (valor.trim() == ''){
            mensajeError = 'El prefijo de la factura es necesario.';
            error = true;
            compItem.focus();
            compItem.parent('div').addClass("has-error");
            i = datos_detalle.length + 100;
            break;
          }
          break;
          case 'numero_factura':
          if (valor.trim() == ''){
            mensajeError = 'El número de la factura es necesario.';
            error = true;
            compItem.focus();
            compItem.parent('div').addClass("has-error");
            i = datos_detalle.length + 100;
            break;
          }
          break;
          case 'fecha':
          if (valor.trim() == ''){
            mensajeError = 'La fecha de entrada de  la factura es necesaria.';
            error = true;
            compItem.focus();
            compItem.parent('div').addClass("has-error");
            i = datos_detalle.length + 100;
            break;
          }
          break;
          case 'cuota_inicial':
          if (valor.trim() == ''){
            mensajeError = 'Ingrese la cuota inicial.';
            error = true;
            compItem.focus();
            compItem.parent('div').addClass("has-error");
            i = datos_detalle.length + 100;
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
      } else {
        var estado = validar_estado();
        var msg = ''
        var type = ''
        var datos_detalle = $('[name=formDetalle]').serializeArray();
        if (estado === false) {
          $.notify({
            message: 'Esta factura ya ha sido guardada y finalizada, no se puede editar.'
          }, {
            type: 'danger',
            delay: 3000,
            placement: {
              align: 'center'
            },
            z_index: 99999,
          });
        } else {
          $.ajax({
              url: "facturacion_controller/salvar_factura",
              type: 'POST',
              data: datos_detalle,
              success: function(response) {
                  var respuesta = $.parseJSON(response);
                  if (respuesta.success === true) {
                    msg = 'Acción realizada con exíto.'
                    type = 'success'
                  } else {
                    msg = 'La acción no se a realizado con exíto, intentelo más tarde.'
                    type = 'danger'
                  }
                  $.notify({
                    message: msg
                  }, {
                    type: type,
                    delay: 3000,
                    placement: {
                      align: 'center'
                    },
                    z_index: 99999,
                    onClosed: function(){
                      $('[name=modalFacturacion]').find('[name=tipo]').val('2')
                      obtener_facturas()
                      obtener_productos(numero_real, prefijo_factura, false);
                    }
                  });
              }
          });
        }
      }
    }
  }
})


$('#btnFinalizarFactura').on('click', function() {
  var numero_real = $('[name=modalFacturacion]').find('[name=numero_real]').val()
  var prefijo_factura = $('[name=modalFacturacion]').find('[name=prefijo_real]').val()
  var numero_factura = $('[name=modalFacturacion]').find('[name=numero_factura]').val()
  var seguir = true;
  if (numero_real == "" || numero_real == undefined) {
    $.notify({
      message: 'Para guardar una factura primero debe agregar un producto.'
    }, {
      type: 'danger',
      delay: 3000,
      placement: {
        align: 'center'
      },
      z_index: 99999,
    })
     seguir = false;
  }
  if (seguir === true) {
    var estado = validar_estado();
    if (estado === false) {
      $.notify({
        message: 'Esta factura ya ha sido guardada y finalizada, no se puede editar.'
      }, {
        type: 'danger',
        delay: 3000,
        placement: {
          align: 'center'
        },
        z_index: 99999,
      });
    } else {
      var datos_detalle = $('[name=formDetalle]').serializeArray();
      //if (datos_detalle[3]['value'].length > 0){
      if (datos_detalle.length > 0){
        var error = false;
        var mensajeError = 'Guardado correctamente.';
        for (var i = 0; i < datos_detalle.length; i++) {
          var label = datos_detalle[i]['name'];
          var valor = datos_detalle[i]['value'];
          var compItem = $('[name=' + label + ']');
          $('.has-error').removeClass('has-error');
          switch (label) {
            case 'cliente':
              if (valor.trim() == ''){
                mensajeError = 'El cliente es necesario.';
                error = true;
                compItem.focus();
                compItem.parent('div').addClass("has-error");
                i = datos_detalle.length + 100;
                break;
              }
              break;
            case 'cliente-id':
              if (valor.trim() == ''){
                mensajeError = 'Error! Ese cliente no ha sido registrado.';
                error = true;
                compItem.focus();
                compItem.parent('div').addClass("has-error");
                i = datos_detalle.length + 100;
                break;
              }
              break;
            case 'vendedor':
              if (valor.trim() == ''){
                mensajeError = 'El vendedor es necesario.';
                error = true;
                compItem.focus();
                compItem.parent('div').addClass("has-error");
                i = datos_detalle.length + 100;
                break;
              }
              break;
            case 'formpago':
            if (valor.trim() == ''){
              mensajeError = 'La forma de pago es necesaria.';
              error = true;
              compItem.focus();
              compItem.parent('div').addClass("has-error");
              i = datos_detalle.length + 100;
              break;
            }
            break;
            case 'prefijo':
            if (valor.trim() == ''){
              mensajeError = 'El prefijo de la factura es necesario.';
              error = true;
              compItem.focus();
              compItem.parent('div').addClass("has-error");
              i = datos_detalle.length + 100;
              break;
            }
            break;
            case 'numero_factura':
            if (valor.trim() == ''){
              mensajeError = 'El número de la factura es necesario.';
              error = true;
              compItem.focus();
              compItem.parent('div').addClass("has-error");
              i = datos_detalle.length + 100;
              break;
            }
            break;
            case 'fecha':
            if (valor.trim() == ''){
              mensajeError = 'La fecha de entrada de  la factura es necesaria.';
              error = true;
              compItem.focus();
              compItem.parent('div').addClass("has-error");
              i = datos_detalle.length + 100;
              break;
            }
            break;
            case 'cuota_inicial':
            if (valor.trim() == ''){
              mensajeError = 'Ingrese la cuota inicial.';
              error = true;
              compItem.focus();
              compItem.parent('div').addClass("has-error");
              i = datos_detalle.length + 100;
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
        } else {
          $.ajax({
              url: "facturacion_controller/finalizar_factura",
              type: 'POST',
              data: datos_detalle,
              success: function(response) {
                  var respuesta = $.parseJSON(response);
                  if (respuesta.success === true) {
                      msg = 'Acción realizada con exíto.'
                      type = 'success'
                  } else {
                    msg = 'La acción no se a realizado con exíto, intentelo más tarde.'
                    type = 'danger'
                  }
                  $.notify({
                    message: msg
                  }, {
                    type: type,
                    delay: 3000,
                    placement: {
                      align: 'center'
                    },
                    z_index: 99999,
                    onClosed: function(){
                      obtener_facturas()
                      obtener_productos(numero_real, prefijo_factura, false);
                      $('[name=modalFacturacion]').find('[name=btnAbonar]').removeAttr('disabled')
                      $('[name=modalFacturacion]').find('[name=btnAbonar]').css('display', 'block')
                      send();
                    }
                  });
              }
          });
        }
      } /*else {
        $.notify({
          message: 'Para guardar y finalizar una factura primero debe agregar un producto.'
        }, {
          type: 'info',
          delay: 3000,
          placement: {
            align: 'center'
          },
          z_index: 99999,
        });
      }*/
    }
  }
})


function validar_numfac() {
  var data = $('[name=modalFacturacion]').find('[name=numero_factura]').val()
  retorno = '';
  $.ajax({
    async: false,
    url: "facturacion_controller/validar_numfac",
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

$('[name=btnAgregarAbono]').on('click', function(){
  var error = false;
  var mensajeError = 'Guardado correctamente.';
  var compItem = $('[name=valor]');
  var item = $('[name=modalAgregarAbono]').find('[name=valor]').val();
  $('.has-error').removeClass('has-error');
  if (item == ''){
    mensajeError = 'El valor del abono es necesario';
    error = true;
    compItem.focus();
    compItem.parent('div').addClass("has-error");
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
    } else {
      var valor = $('[name=modalAgregarAbono]').find('[name=valor]').val()
      var numero_factura = $('[name=modalAgregarAbono]').find('[name=numero_real]').val()
      $.ajax({
          url: "facturacion_controller/agregar_abono",
          type: 'POST',
          data: {
            valor: valor,
            factura: numero_factura
          },
          success: function(response) {
            var respuesta = $.parseJSON(response);
            $.notify({
              message: respuesta.msg
            }, {
              type: respuesta.type,
              delay: 3000,
              placement: {
                align: 'center'
              },
              z_index: 99999,
              onClosed: function(){
                var saldo = $('[name=modalAgregarAbono]').find('[name=saldo]').val();
                var t = saldo
                if (respuesta.success == 0) {
                  t = saldo-valor
                }
                cargar_abonos();
                obtener_productos(0,0,t);
                compItem.val('')
              }
            });
        }
      });
    }
})

$('[name=btnImprimir]').on('click', function(){
  var num = $('[name=modalFacturacion]').find('[name=numero_real]').val()
  var send = false;
  var ver = 'I';
  data = {}
  data = {
    num: num,
    send: send,
    ver: ver
  }
  descargarPostArchivo('facturacion_controller/imprimir', data)
})

function send() {
  var num = $('[name=modalFacturacion]').find('[name=numero_real]').val()
  var send = true;
  var ver = 'F';
  data = {}
  data = {
    num: num,
    send: send,
    ver: ver
  }
  descargarPostArchivo('facturacion_controller/imprimir', data)
}

$('[name=send]').on('click', function(){
  send();
})

function validar_descuento() {
  data = $('[name=modalFacturacion]').find('[name=tipo_descuento]').val()
  componente = $('[name=modalFacturacion]').find('[name=descuento]')
  if (data == "2") {
    componente.attr('disabled', 'disabled')
  } else {
    componente.removeAttr('disabled')
  }
}
