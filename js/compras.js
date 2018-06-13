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

//Obtener facturas
var obtener_facturas = function() {
  var componenteListarCompras = $('[name=listar_compras]');
  waitingDialog.show('Cargando, por favor espere...', {dialogSize: 'm', progressType: ''});
  var modelFila = '<tr>'+
      '         <th scope="row">'+
      '            <span name="btnEditar" id="editar_categoria"'+
      '              prefijo_compra="{1}" descuento_com="{16}" tipo_descuento="{17}" numero_compra="{2}" proveedor_compra="{3}"'+
      '              fecha_entrada="{4}" total_compra={18} fecha_vencimiento="{5}" estado_compra="{6}" fecha_entrada="{7}"'+
      '              forma_pago="{8}" dv="{21}" comiva="{19}" codigo_proveedor="{14}" compra_fletes="{9}" compra_retefuente="{10}" compra_reteica="{11}"'+
      '              compra_comision="{12}" compra_observacion="{13}" proveedor_nombre="{20}"'+
      '              class="text-info" style="width: 32px; padding-left: 0px; padding-right: 0px;" title="Editar" role="button">'+
      '                <span class="icon icon-pencil" style="font-size: 18px;"/></span>'+
      '            <span name="btnEliminar" facprefijo="{1}" facnumero="{2}" title="Eliminar" '+
      '               class="text-danger" style="width: 32px; padding-left: 0px; padding-right: 0px;" role="button">'+
      '                <span class="icon icon-bin" style="font-size: 18px;"/></span>'+
      '        </th>'+
      '        <td id="codigo">{0}</td>'+
      '        <td id="codigo">{1}</td>'+
      '        <td>{2}</td>'+
      '        <td>{20}</td>'+
      '        <td>{4}</td>'+
      '        <td>{5}</td>'+
      '        <td>{18}</td>'+
      '        <td>{6}</td>'+
      '    </tr>';
      $.ajax({
        url: 'compras_controller/obtener_compras',
        success: function(response){
          var respuesta = $.parseJSON(response);
          componenteListarCompras.empty();
          if (respuesta.success === true) {
            var datos = respuesta.data;
            var cantidad = respuesta.cant
            var htotal = respuesta.htotal
            var hiva = respuesta.hiva
            var hdesc = respuesta.hdesc
            for (var i = 0; i < datos.length; i++) {
              if (datos[i]['comestado'] == 'E') {
                datos[i]['comestado'] = 'En Edición'
              }
              if (datos[i]['comestado'] == 'A') {
                datos[i]['comestado'] = 'Finalizado'
              }
              componenteListarCompras.append(modelFila.format(
                datos[i]['comcodigo'], //0
                datos[i]['comprefijo'], //1
                datos[i]['comnumero'], //2
                datos[i]['comproveedor'], //3
                datos[i]['comfecent'], //4
                datos[i]['comfecvenci'], //5
                datos[i]['comestado'], //6
                datos[i]['comfecent'], //7
                datos[i]['comformapago'],//8
                datos[i]['comfletes'], //9
                datos[i]['comretefuente'], //10
                datos[i]['comreteica'], //11
                datos[i]['comcomision'], //12
                datos[i]['comobservacion'], //13
                datos[i]['tercodigo'], //14
                datos[i]['codigo_vendedor'], //15
                datos[i]['comdescuento'], //16
                datos[i]['comtipodescuento'], //17
                datos[i]['comtotal'], //18
                datos[i]['comiva'], //19
                datos[i]['ternombre'], //20
                datos[i]['terdigver'] //21
              ));
            }
            $('[name=btnEliminar]').on('click', eliminar_factura);
            $('[name=btnEditar]').on('click', modificar_factura);
            $('#total_facturas').html('TOTAL DE COMPRAS : ' + cantidad + '&emsp;&emsp;&emsp;&emsp;&emsp;' + 'DESCUENTO HISTORICO : ' + formatMoney(hdesc) + '&emsp;&emsp;&emsp;&emsp;&emsp;' + 'IVA HISTORICO : ' + formatMoney(hiva) + '&emsp;&emsp;&emsp;&emsp;&emsp;' + 'TOTAL HISTORICO : ' + formatMoney(htotal))
            $('#total_facturas').css('font-weight', 'bold')
          }
          waitingDialog.hide();
        }
      })
}
//Fin obtener facturas

obtener_facturas();

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

//Autocompletado clientes
$(function() {
  $.ajax({
    url: 'compras_controller/obtener_clientes',
    success: function(response){
      var respuesta = $.parseJSON(response);
      var data = respuesta.data

      $("#cliente").autocomplete({
        lookup: data,
        onSelect: function(event) {
          $('[name=modalFacturacion]').find("#cliente").val(event.value);
          $('[name=modalFacturacion]').find("#cliente-id").val(event.id);
          $('[name=modalFacturacion]').find("#dv").html("<b> D.V : " + event.dv + " </b>");
          $('[name=modalFacturacion]').find("#dv-id").val(event.dv)
          return false;
        }
      });
    }
  })
});
//Fin Autocompletado clientes


//Inicio mostrar modal registro familias
$('#registrar').on('click', function(){
  var invalidCreate = true;
  for (var i = 0; i < acciones.length; i++) {
    if (acciones[i]['mod_nombre'] == 'Compras') {
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
    $('[name=modalFacturacion]').modal();
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


var obtener_productos = function(numero, prefijo){
  var numero = '';
  var componenteListarProductos = $('[name=listado_articulos]');
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
        url: 'compras_controller/obtener_productos',
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
                datos[i]['detprecio'], //5
                datos[i]['detiva'], //6
                datos[i]['detdescuento'], //7
                datos[i]['detvalor'], //8
                datos[i]['detarticulo']//9
              ));
            }
            $('#ivafactura').empty()
            $('#totalfactura').empty()
            $('#descuentofactura').html('DESCUENTO : $'+datos[0]['comdescuento'])
            $('#ivafactura').html('IVA : $'+datos[0]['comiva'])
            $('#totalfactura').html('TOTAL : $'+datos[0]['comtotal'])
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
    message: 'El valor del descuento solo se aplicará al guardar y finalizar la compra.'
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
    message: 'El valor del IVA solo se aplicará al guardar y finalizar la compra.'
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
    message: 'Ingrese el nombre o el número de documento del proveedor .'
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
  var invalidDelete = true;
  for (var i = 0; i < acciones.length; i++) {
    if (acciones[i]['mod_nombre'] == 'Compras') {
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
              url: 'compras_controller/eliminar_articulo',
              type: 'POST',
              data:{
                codigo: codigo
              },
              success: function(response){
                var respuesta = $.parseJSON(response);
                if (respuesta.success === true) {
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
                      obtener_productos(num, prefijo);
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
}
//Fin funcion eliminar

var eliminar_factura = function(){
  var invalidDelete = true;
  for (var i = 0; i < acciones.length; i++) {
    if (acciones[i]['mod_nombre'] == 'Compras') {
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
            url: 'compras_controller/eliminar_factura',
            type: 'POST',
            data:{
              prefijo: prefijo,
              numero: numero
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
                    obtener_facturas();
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

//Inicio funcion modificar categoria

var modificar_factura = function() {
  var invalidChange = true;
  for (var i = 0; i < acciones.length; i++) {
    if (acciones[i]['mod_nombre'] == 'Compras') {
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
    $(".has-error").removeClass("has-error");
    var numero_compra = $(this).attr("numero_compra");
    var numero_real = $(this).attr("numero_compra");
    var prefijo_real = $(this).attr("prefijo_compra");
    var prefijo_compra = $(this).attr("prefijo_compra");
    var proveedor_compra = $(this).attr("proveedor_compra");
    var forma_pago = $(this).attr("forma_pago");
    var compra_fletes = $(this).attr("compra_fletes");
    var compra_retefuente = $(this).attr("compra_retefuente");
    var compra_reteica = $(this).attr("compra_reteica");
    var compra_comision = $(this).attr("compra_comision");
    var compra_observacion = $(this).attr("compra_observacion");
    var fecha_entrada = $(this).attr("fecha_entrada");
    var estado_compra = $(this).attr("estado_compra");
    var codigo_proveedor = $(this).attr("codigo_proveedor");
    var tipo_descuento = $(this).attr("tipo_descuento");
    var descuento_com = $(this).attr("descuento_com");
    var total_compra = $(this).attr("total_compra");
    var comiva = $(this).attr("comiva");
    var proveedor_nombre = $(this).attr("proveedor_nombre");
    var dv = $(this).attr("dv");
    limpiar_listado();
    obtener_formapago(forma_pago)
    $('[name=modalFacturacion]').modal();
    $('[name=modalFacturacion]').find('#dv').html("<b> D.V : " + dv + " </b>")
    $('[name=modalFacturacion]').find('#dv').css('font-style', 'bold')
    $('[name=modalFacturacion]').find('.modal-title').text('Modificar factura');
    $('[name=modalFacturacion]').find('[name=prefijo]').val(prefijo_compra);
    $('[name=modalFacturacion]').find('[name=prefijo_real]').val(prefijo_real);
    $('[name=modalFacturacion]').find('[name=numero_factura]').val(numero_compra);
    $('[name=modalFacturacion]').find('[name=numero_real]').val(numero_real);
    $('[name=modalFacturacion]').find('[name=descuento]').val(descuento_com);
    $('[name=modalFacturacion]').find('[name=iva]').val(comiva);
    $('[name=modalFacturacion]').find('[name=cliente]').val(proveedor_nombre);
    $('[name=modalFacturacion]').find('[name=fletes]').val(compra_fletes);
    $('[name=modalFacturacion]').find('[name=retefuente]').val(compra_retefuente);
    $('[name=modalFacturacion]').find('[name=reteica]').val(compra_reteica);
    $('[name=modalFacturacion]').find('[name=comision]').val(compra_comision);
    $('[name=modalFacturacion]').find('[name=total_factura]').val(total_compra);
    $('[name=modalFacturacion]').find('[name=observacion]').val(compra_observacion);
    $('[name=modalFacturacion]').find('[name=fecha]').val(fecha_entrada);
    $('[name=modalFacturacion]').find('#cliente-id').val(proveedor_compra);
    $('[name=modalFacturacion]').find('#dv-id').val(dv);
    $('[name=modalFacturacion]').find('[name=tipo_descuento]').val();
    $('[name=modalFacturacion]').find('[name=tipo]').val('2');
    $('[name=modalAgregarProducto]').find('[name=tipo]').val('2');
    obtener_productos(numero_real, prefijo_real);
    $('#descuentofactura').empty()
    $('#ivafactura').empty()
    $('#totalfactura').empty()
    $('#descuentofactura').html('DESCUENTO : $'+descuento_com)
    $('#ivafactura').html('IVA : $'+comiva)
    $('#totalfactura').html('TOTAL : $'+total_compra)
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
  $('[name=modalFacturacion]').find('[name=fecha]').val("");
  $('[name=modalFacturacion]').find('[name=observacion]').val("");
  $('[name=modalFacturacion]').find('[name=codigo_categoria]').val("");
  $('[name=modalFacturacion]').find('[name=clave]').val("");
  $('[name=modalFacturacion]').find('[name=abreviatura]').val("");
  $('[name=modalFacturacion]').find('[name=detalle]').val("");
  $('[name=modalFacturacion]').find('[name=tipo]').val('1');
  $('[name=modalFacturacion]').find('#dv').html("<b> D.V : </b>")
  $('[name=modalFacturacion]').find('#dv-id').val("")
  $('[name=modalAgregarProducto]').find('[name=tipo]').val('1');
  $('#descuentofactura').html('DESCUENTO : ')
  $('#ivafactura').html('IVA : ')
  $('#totalfactura').html('TOTAL : ')
}
//Fin funcion limpiar categoria

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
  var estado = validar_estado();
  var msg = ''
  var type = ''
  var datos_detalle = $('[name=formDetalle]').serializeArray();
  if (estado === false) {
    $.notify({
      message: 'Esta compra ya ha sido guardada y finalizada, no se puede editar.'
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
          mensajeError = 'El Proveedor es necesario.';
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
        mensajeError = 'El prefijo de la compra es necesario.';
        error = true;
        compItem.focus();
        compItem.parent('div').addClass("has-error");
        i = datos_detalle.length + 100;
        break;
      }
      break;
      case 'numero_factura':
      if (valor.trim() == ''){
        mensajeError = 'El número de la compra es necesario.';
        error = true;
        compItem.focus();
        compItem.parent('div').addClass("has-error");
        i = datos_detalle.length + 100;
        break;
      }
      break;
      case 'fecha':
      if (valor.trim() == ''){
        mensajeError = 'La fecha de entrada de  la compra es necesaria.';
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
          message: 'El número de compra que intenta registrar ya se encuentra registrado.'
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
      $(".has-error").removeClass("has-error");
      $('[name=modalAgregarProducto]').modal();
      limpiar_formulario()
      obtener_articulos()
    }
  }
}
})
//Obtener articulos
obtener_articulos = function(){
    var combo=$('[name=modalAgregarProducto]').find('[name=producto]');
    $.ajax({
        url: "compras_controller/obtener_articulos",
        success: function(response) {
            var respuesta = $.parseJSON(response);
            if (respuesta.success === true) {
              combo.empty();
              combo.append('<option value="">Seleccione</option>')
              for (var i = 0; i < respuesta.articulos.length; i++) {
                var item = respuesta.articulos[i];
                combo.append('<option value="'+item["artcodigo"]+'" valor_iva="'+item['artporcentajeiva']+'" valor_art="'+item['artvalor']+'">'+item["artreferencia"]+'</option>');
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

  //var iva_valor = $('[name=modalAgregarProducto]').find('[name=producto]').val();
  //iva_valor = $('[name=modalAgregarProducto]').find('[name=producto]').find('[value='+iva_valor+']').attr('valor_iva')
  //$('[name=modalAgregarProducto]').find('[name=iva]').val(iva_valor)
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
          url: 'compras_controller/guardar_producto',
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
                    var x = $('[name=modalFacturacion]').find('[name=numero_factura]').val();
                    $('[name=modalFacturacion]').find('[name=numero_real]').val(x);
                    var num = $('[name=modalFacturacion]').find('[name=numero_real]').val();
                    var pre = $('[name=modalFacturacion]').find('[name=prefijo]').val();
                    $('[name=modalFacturacion]').find('[name=numfac]').val(num);
                    obtener_productos(num, pre);
                    $('[name=modalFacturacion]').find('[name=tipo]').val('2')
                    obtener_facturas()
                }
            });
        });
  }
}

btnAgregarPro = $('[name=modalAgregarProducto]').find('#btnAgregarPro')
btnAgregarPro.on('click', agregar_producto)

function validar_estado() {
  var data = $('[name=modalFacturacion]').find('[name=numero_real]').val()
  if (data !== '') {
    retorno = '';
    $.ajax({
      async: false,
      url: "compras_controller/validar_estado",
      type: 'POST',
      data: {
        codigo: data
      },
      success: function(response) {
        var respuesta = $.parseJSON(response);
        var item = respuesta.data
        if (item[0]['comestado'] == 'E') {
          retorno = true
        } else {
          retorno = false
        }
      }
    })
    return (retorno)
  }
}

$('#btnSalvarFactura').on('click', function(){
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
    if (datos_detalle[3]['value'].length > 0){
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
              url: "compras_controller/salvar_factura",
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
                      obtener_productos(numero_real, prefijo_factura);
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
    if (datos_detalle[3]['value'].length > 0){
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
            url: "compras_controller/finalizar_factura",
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
                    obtener_productos(numero_real, prefijo_factura);
                  }
                });
            }
        });
      }
    } else {
      $.notify({
        message: 'Para guardar y finalizar una compra primero debe agregar un producto.'
      }, {
        type: 'info',
        delay: 3000,
        placement: {
          align: 'center'
        },
        z_index: 99999,
      });
    }
  }
})


function validar_numfac() {
  var data = $('[name=modalFacturacion]').find('[name=numero_factura]').val()
  retorno = '';
  $.ajax({
    async: false,
    url: "compras_controller/validar_numfac",
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
