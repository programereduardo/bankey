var componenteListado = $('[name=listar_facturas]');
var modelFila = '<tr>'+
'        <td>{4}</td>'+
'        <td>{9}</td>'+
'        <td>{0}</td>'+
'        <td id="codigo">{2}</td>'+
'        <td>{5}</td>'+
'        <td>{6}</td>'+
'        <td>{10}</td>'+
'        <td>{8}</td>'+
'        <td>{11}</td>'+
'        <td>{7}</td>'+
'        <td>{3}</td>'+
'        <td>{1}</td>'+
                '</tr>';
var limpiar_listado = function(){
  componenteListado.empty();
}

function limpiar() {
  limpiar_listado()
  $('[name=fecha]').val('');
  $('[name=cliente]').val('');
  $('[name=vendedor]').val('');
  $('#desde').val('')
  $('#hasta').val('')
  $('#cliente-id').val('')
  $('#vendedor-id').val('')
  $('#estado').val('')
  $('#id_vendedor').html('Identificación : ')
  $('#vendedor_name').html('Nombre : ')
  $('#porcentaje').html('Porcentaje : ')
  $('#monto').html('Comisión : ')
  $('#subtotal').html('Subtotal : ')
}

$('#limpiar').on('click', function(){
  limpiar()
})

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
          $("#cliente").val(event.value);
          $("#cliente-id").val(event.id);
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
          $("#vendedor").val(event.value);
          $("#vendedor-id").val(event.id);
        }
      });
    }
  })
});
//Fin autocompletado vendedores

//SECCION AYUDAS
function mostrarAyuda(msg) {
  $.notify({
    message: msg
  }, {
    type: 'info',
    delay: 3000,
    placement: {
      align: 'center'
    },
    z_index: 99999,
  });
}
//FIN SECCION AYUDAS

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
limpiar();

var busqueda = function(){
  var vendedor = $('#vendedor-id').val()
  var desde = $('#desde').val()
  var hasta = $('#hasta').val()
  var excel = $('#generar_excel').val()
  if (vendedor == "") {
    $.notify({
      message: 'Ingrese un vendedor valido.'
    }, {
      type: 'danger',
      delay: 3000,
      placement: {
        align: 'center'
      },
      z_index: 99999,
    });
  } else {
    if (desde == "" && hasta == "") {
      $.notify({
        message: 'Ingrese un filtro de fechas para la busqueda.'
      }, {
        type: 'info',
        delay: 3000,
        placement: {
          align: 'center'
        },
        z_index: 99999,
      });
    }
    $.ajax({
      url: 'nomina_controller/busqueda',
      type: 'POST',
      data: {
        vendedor: vendedor,
        desde: desde,
        hasta: hasta,
        excel: excel
      },
      success: function(response){
        var respuesta = $.parseJSON(response);
        var item = respuesta.data
        var aux = item.length
        if (aux == 0) {
          $.notify({
            message: 'Sin resultados'
          }, {
            type: 'warning',
            delay: 3000,
            placement: {
              align: 'center'
            },
            z_index: 99999,
          });
        }
        $('#id_vendedor').html('Identificación : '+respuesta.idvendedor)
        $('#vendedor_name').html('Nombre : '+respuesta.vendedor)
        $('#porcentaje').html('Porcentaje : '+respuesta.porcentaje)
        $('#monto').html('Comisión : '+formatMoney(respuesta.monto))
        $('#subtotal').html('Subtotal : '+formatMoney(respuesta.subtotal))
        limpiar_listado()
        for (var i = 0; i < item.length; i++) {
          componenteListado.append(modelFila.format(
            item[i]["cliente"],//0
            item[i]["facestado"],//1
            item[i]["vendedor"],//2
            formatMoney(item[i]["factotal"]),//3
            item[i]["facnumero"], //4
            item[i]["facfecent"], //5
            item[i]["facfecvenci"], //6
            formatMoney(item[i]["faciva"]),//7
            formatMoney(item[i]["facdescuento"]),//8
            item[i]["numdoc"],//9
            formatMoney(item[i]['facsubtotal']),//10
            formatMoney(item[i]['liquidar']),//11
          ));
        }
        //limpiar()
      }
    })
  }
}


$('#excel').on('click', function(){
  var clave = 'CLI'
  $('[name=generar_excel]').val('true')
  var excel = $('[name=generar_excel]').val()
  var desde = $('#desde').val();
  var hasta = $('#hasta').val();
  var vendedor = $('[name=vendedor-id]').val();
  data = {}
  data = {
    data: clave,
    desde: desde,
    vendedor: vendedor,
    excel: excel
  }
  descargarPostArchivo('nomina_controller/busqueda', data)
})

$('#buscar').on('click', function() {
  $('[name=generar_excel]').val("false")
  busqueda()
})

function validar_vendedor() {
  var vendedor = $('[name=vendedor]').val()
  if (vendedor == "") {
    $('[name=vendedor-id]').val("")
  }
}
