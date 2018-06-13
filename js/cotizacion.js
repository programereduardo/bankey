controlador = $('[name=controller]').val()
//Obtener forma de pago
function obtener_numerofactura(){
  $.ajax({
    url: "cotizacion_controller/obtener_numerofactura",
    success: function(response){
      respuesta = $.parseJSON(response)
      $('[name=facnumero]').val(respuesta.data)
    }
  })
}
obtener_numerofactura()

function obtener_formapago(data) {
  var combo = $('[name=modalFacturacion]').find('[name=formpago]');
  $.ajax({
      url: "cotizacion_controller/obtener_formapago",
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
    url: 'cotizacion_controller/validar_cliente',
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
      '              fecha_entrada="{5}" total_factura={19} cuota_inicial="{23}" fecha_vencimiento="{6}" estado_factura="{7}" fecha_entrada="{8}"'+
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
      '        <td>{8}</td>'+
      '        <td>{19}</td>'+
      '    </tr>';
      $.ajax({
        url: 'cotizacion_controller/obtener_facturas',
        success: function(response){
          var respuesta = $.parseJSON(response);
          var cantidad = respuesta.cant
          componenteListarFacturas.empty();
          if (respuesta.success === true) {
            var datos = respuesta.data;
            for (var i = 0; i < datos.length; i++) {
              componenteListarFacturas.append(modelFila.format(
                datos[i]['cotcodigo'], //0
                datos[i]['cotprefijo'], //1
                datos[i]['cotnumero'], //2
                datos[i]['cotcliente'], //3
                datos[i]['cotvendedor'], //4
                datos[i]['cotfecent'], //5
                datos[i]['cotfecvenci'], //6
                datos[i]['cotestado'], //7
                datos[i]['cotfecent'], //8
                datos[i]['cotformapago'],//9
                datos[i]['cotfletes'], //10
                datos[i]['cotretefuente'], //11
                datos[i]['cotreteica'], //12
                datos[i]['cotcomision'], //13
                datos[i]['cotobservacion'], //14
                datos[i]['tercodigo'], //15
                datos[i]['codigo_vendedor'], //16
                formatMoney(datos[i]['cotdescuento']), //17
                datos[i]['cottipodescuento'], //18
                formatMoney(datos[i]['cottotal']), //19
                formatMoney(datos[i]['cotiva']), //20
                datos[i]['terdocnum'],//21,
                formatMoney(datos[i]['cotsaldo']),//22
                datos[i]['cotpagoinicial'],//23,
                formatMoney(datos[i]['cotpagoinicial']),//24
                clase = datos[i]['cotestado'] == 'Anulado'? clase = 'danger': datos[i]['cotestado'] == 'Finalizado'? clase = 'success': datos[i]['cotestado'] == 'Edición'? clase = 'warning': clase = '',//25
                datos[i]['cotsaldo'],//26
              ));
              //var saldo = obtener_saldo()
            }
            $('[name=btnEliminar]').on('click', eliminar_factura);
            $('[name=btnEditar]').on('click', modificar_factura);
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
    url: 'cotizacion_controller/obtener_clientes',
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
    url: 'cotizacion_controller/obtener_vendedores',
    success: function(response){
      var respuesta = $.parseJSON(response);
      var data = respuesta.data
      $('[name=modalFacturacion]').find("#vendedor").val(data[0]['value']);
      $('[name=modalFacturacion]').find("#vendedor-id").val(data[0]['id']);
    }
  })
});
//Fin autocompletado vendedores

//Inicio mostrar modal registro familias
$('#registrar').on('click', function(){
  var invalidCreate = true;
  for (var i = 0; i < acciones.length; i++) {
    if (acciones[i]['mod_nombre'] == 'Cotizacion') {
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
    /*$.notify({
      message: 'El valor de la fecha de entrada y la fecha de vencimiento se han agregado automaticamente con treinta (30) días de diferencia.'
    },{
      type: 'info',
      placement: {
        align: 'center'
      },
      z_index: 99999
    })*/
    $(".has-error").removeClass("has-error");
    $('[name=modalFacturacion]').find('.modal-title').text('Cotizar');
    $('[name=modalFacturacion]').modal();
    $('[name=modalFacturacion]').find('[name=btnAbonar]').attr('disabled', 'disabled')
    $('[name=modalFacturacion]').find('[name=btnAbonar]').css('display', 'none')
    var num = $('[name=facnumero]').val()
    $('[name=numero_real]').val(num)
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
  var componenteListarProductos = $('[name=listado_articulos]');
  var num = $('[name=modalFacturacion]').find('[name=numfac]').val();
  var numero_real = $('[name=modalAgregarProducto]').find('[name=numero_real]').val();
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
      //'        <td>{6}</td>'+
      //'        <td>{7}</td>'+
      '        <td>{8}</td>'+
      '    </tr>';

      $.ajax({
        url: 'cotizacion_controller/obtener_productos',
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
            $('#descuentofactura').html('DESCUENTO : '+formatMoney(datos[0]['cotdescuento']))
            $('#ivafactura').html('IVA : '+formatMoney(datos[0]['cotiva']))
            $('#totalfactura').html('TOTAL : '+formatMoney(datos[0]['cottotal']))
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
          url: 'cotizacion_controller/eliminar_articulo',
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
                $('#totalfactura').html('TOTAL : '+respuesta.total)
                obtener_productos(num, prefijo, false);
                obtener_facturas()
              }
            })
          }
        })
      }
    }
  })
}
//Fin funcion eliminar

var eliminar_factura = function(){
  var invalidDelete = true;
  for (var i = 0; i < acciones.length; i++) {
    if (acciones[i]['mod_nombre'] == 'Cotizacion') {
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
    estado = validar_estado(numero);
    var seguir = true;
    if (estado === false) {
      seguir = false;
      $.notify({
        message: 'Esta cotización esta anulada y no se puede modificar.'
      }, {
        type: 'danger',
        delay: 3000,
        placement: {
          align: 'center'
        },
        z_index: 99999,
      })
    }
    if (seguir === true) {
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
              url: 'cotizacion_controller/eliminar_factura',
              type: 'POST',
              data:{
                prefijo: prefijo,
                numero: numero
              },
              success: function(response){
                var respuesta = $.parseJSON(response);
                $.notify({
                  message: 'Acción realizada con exíto.'
                },{
                  type: 'success',
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
}

//Inicio funcion modificar categoria

var modificar_factura = function() {
  var invalidChange = true;
  for (var i = 0; i < acciones.length; i++) {
    if (acciones[i]['mod_nombre'] == 'Cotizacion') {
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
    var saldo = $(this).attr('fac_saldo')
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
    $('[name=modalAgregarProducto]').find('[name=saldo_pro]').val(saldo);
    $('[name=modalFacturacion]').find('.modal-title').text('Modificar factura');
    $('[name=modalFacturacion]').find('[name=prefijo]').val(prefijo_factura);
    $('[name=modalFacturacion]').find('[name=prefijo_real]').val(prefijo_real);
    $('[name=modalFacturacion]').find('[name=numero_factura]').val(numero_factura);
    $('[name=modalFacturacion]').find('[name=facnumero]').val(numero_factura);
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
  $('[name=modalFacturacion]').find('#saldofactura').html('SALDO :');
  $('[name=modalFacturacion]').find('#descuentofactura').html('DESCUENTO :');
  $('[name=modalFacturacion]').find('#ivafactura').html('IVA :');
  $('[name=modalFacturacion]').find('#totalfactura').html('TOTAL :');

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
  estado = true;
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
      var tipo = $('[name=modalFacturacion]').find('[name=tipo]').val()
      var aux = true;
      if (aux === true) {
          var fd = new FormData(document.getElementById("formDetalle"));
          var datos_detalle = $('[name=formDetalle]').serializeArray();
          waitingDialog.show('Guardando los cambios, por favor espere...', {dialogSize: 'm', progressType: ''});
          $.ajax({
            url: 'cotizacion_controller/anular_factura',
            type: 'POST',
            data: datos_detalle,
            success: function(response){
              var respuesta = $.parseJSON(response)
              var msg = 'Se produjo un error inesperado, intentelo más tarde. Si no funciona pongase en contacto con el Departamento de Sistemas (ERROR: ANUFAC001).'
              var tipo = 'danger'
              if (respuesta.success === true) {
                msg = 'Acción realizada con exíto.'
                tipo = 'success'
              }
              $.notify({
                message: msg
              }, {
                type: tipo,
                delay: 3000,
                placement: {
                  align: 'center'
                },
                z_index: 99999,
                onClosed: function(){
                  obtener_facturas()
                  obtener_numerofactura()
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
  var msg = ''
  var type = ''
  var btnAgrPro = $(this);
  var datos_detalle = $('[name=formDetalle]').serializeArray();
  var mensajeError = 'Guardado correctamente.';
  var tipo = $('[name=modalFacturacion]').find('[name=tipo]').val()
  if (tipo == '1') {
    //var estado = validar_numfac();
    estado = validar_estado(false);
    var seguir = true;
    if (estado === false) {
      seguir = false;
      $.notify({
        message: 'Esta cotización esta anulada y no se puede modificar.'
      }, {
        type: 'danger',
        delay: 3000,
        placement: {
          align: 'center'
        },
        z_index: 99999,
      })
    }
    if (seguir === true) {
      var numero_factura = $('[name=modalFacturacion]').find('[name=facnumero]').val()
      var observacion = $('[name=modalFacturacion]').find('[name=observacion]').val()
      var numero_real = $('[name=modalFacturacion]').find('[name=numero_real]').val()
      var vendedor = $('[name=modalFacturacion]').find('[name=vendedor-id]').val()
      if (numero_real !== undefined && numero_real !== '') {
        $('[name=modalAgregarProducto]').find('[name=numero_real]').val(numero_real)
      }
      $('[name=modalAgregarProducto]').find('[name=observacion]').val(observacion)
      $('[name=modalAgregarProducto]').find('[name=vendedor]').val(vendedor)
      $(".has-error").removeClass("has-error");
      $('[name=modalAgregarProducto]').modal();
      limpiar_formulario()
      obtener_articulos()
    }
  } else {
    estado = validar_estado(false);
    var seguir = true;
    if (estado === false) {
      seguir = false;
      $.notify({
        message: 'Esta cotización esta anulada y no se puede modificar.'
      }, {
        type: 'danger',
        delay: 3000,
        placement: {
          align: 'center'
        },
        z_index: 99999,
      })
    }
    if (seguir === true) {
      var numero_factura = $('[name=modalFacturacion]').find('[name=facnumero]').val()
      var observacion = $('[name=modalFacturacion]').find('[name=observacion]').val()
      var numero_real = $('[name=modalFacturacion]').find('[name=numero_real]').val()
      var vendedor = $('[name=modalFacturacion]').find('[name=vendedor-id]').val()
      if (numero_real !== undefined && numero_real !== '') {
        $('[name=modalAgregarProducto]').find('[name=numero_real]').val(numero_real)
      }
      $('[name=modalAgregarProducto]').find('[name=observacion]').val(observacion)
      $('[name=modalAgregarProducto]').find('[name=vendedor]').val(vendedor)
      $(".has-error").removeClass("has-error");
      $('[name=modalAgregarProducto]').modal();
      limpiar_formulario()
      obtener_articulos()
    }
  }
})
//Obtener articulos
obtener_articulos = function(){
    var combo=$('[name=modalAgregarProducto]').find('[name=producto]');
    $.ajax({
        url: "cotizacion_controller/obtener_articulos",
        success: function(response) {
            var respuesta = $.parseJSON(response);
            if (respuesta.success === true) {
              combo.empty();
              combo.append('<option value="">Seleccione</option>')
              for (var i = 0; i < respuesta.articulos.length; i++) {
                var item = respuesta.articulos[i];
                combo.append('<option value="'+item["artcodigo"]+'" valor_iva="'+item['artporcentajeiva']+'" valor_art="'+item['artvalor']+'">'+item["artreferencia"]+' - '+item['artdescripcion']+'</option>');
              }
              /*if (data.length > 0) {
                combo.val(data)
              }*/
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
      url: 'cotizacion_controller/validar_existencias',
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
    /*  case 'valor':
        if (valor.trim() == ''){
          mensajeError = 'El valor del producto es necesario.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_factura.length + 100;
          break;
        }
        break;*/
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
      /*case 'descuento_art':
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
      break;*/
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
          url: 'cotizacion_controller/guardar_producto',
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
                    $('[name=modalAgregarProducto]').modal('hide');
                    //var x = $('[name=modalFacturacion]').find('[name=numero_factura]').val();
                    var x = $('[name=facnumero]').val();
                    //$('[name=modalFacturacion]').find('[name=numero_factura]').val(x);
                    var num = $('[name=modalAgregarProducto]').find('[name=numero_real]').val();
                    var pre = $('[name=modalFacturacion]').find('[name=prefijo]').val();
                    $('[name=modalFacturacion]').find('[name=numfac]').val(num);
                    var saldo = $('[name=modalAgregarProducto]').find('[name=saldo_pro]').val();
                    var precio = $('[name=modalAgregarProducto]').find('[name=valor]').val();
                    var t = saldo;
                    t = parseInt(saldo) + parseInt(precio)
                    obtener_productos(num, pre, t);
                    $('[name=modalFacturacion]').find('[name=tipo]').val('2')
                    $('[name=modalAgregarProducto]').find('[name=tipo]').val('2')
                    obtener_facturas()
                    obtener_numerofactura()
                    $('[name=modalFacturacion]').find('[name=numero_real]').val(num)
                }
            });
        });
  }
}

btnAgregarPro = $('[name=modalAgregarProducto]').find('#btnAgregarPro')
btnAgregarPro.on('click', agregar_producto)

function validar_estado(dt) {
  if (dt !== '' && dt !== undefined && dt !== false) {
    data = dt;
  } else {
    data = $('[name=modalFacturacion]').find('[name=numero_real]').val()
  }
  if (data !== '') {
    retorno = '';
    $.ajax({
      async: false,
      url: "cotizacion_controller/validar_estado",
      type: 'POST',
      data: {
        codigo: data
      },
      success: function(response) {
        var respuesta = $.parseJSON(response);
        var item = respuesta.data
        if (item[0]['cotestado'] == 'E') {
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
    if (acciones[i]['mod_nombre'] == 'Cotizacion') {
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
      '              class="text-danger" style="width: 32px; padding-left: 0px; padding-right: 0px;" role="button">'+
      '            <span class="icon icon-bin" style="font-size: 18px;"/></span>'+
      '        </th>'+
      '        <td id="codigo">{3}</td>'+
      '        <td>{2}</td>'+
      '        <td>{1}</td>'+
      '        <td>{3}</td>'+
      '    </tr>';

      $.ajax({
        url: 'cotizacion_controller/obtener_pagos',
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
        url: "cotizacion_controller/obtener_tipos_abonos",
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

$('#btnSalvarFactura').on('click', function(){
  estado = validar_estado(false);
  var seguir = true;
  if (estado === false) {
    seguir = false;
    $.notify({
      message: 'Esta cotización esta anulada y no se puede modificar.'
    }, {
      type: 'danger',
      delay: 3000,
      placement: {
        align: 'center'
      },
      z_index: 99999,
    })
  }
  var numero_real = $('[name=modalFacturacion]').find('[name=numero_real]').val()
  if (numero_real == "" || numero_real == undefined) {
    $.notify({
      message: 'Para guardar una cotización primero debe agregar un producto.'
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
    if (datos_detalle[3]['value'].length > 0){
      var error = false;
      var mensajeError = 'Guardado correctamente.';
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
        var estado = true;
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
              url: "cotizacion_controller/salvar_factura",
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

function validar_numfac() {
  var data = $('[name=modalFacturacion]').find('[name=numero_factura]').val()
  retorno = '';
  $.ajax({
    async: false,
    url: "cotizacion_controller/validar_numfac",
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
          url: "cotizacion_controller/agregar_abono",
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
                  var t = saldo;
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
