var componenteListado = $('[name=listar_facturas]');
var modelFila = '<tr>'+
    '        <td>{4}</td>'+
    '        <td>{9}</td>'+
    '        <td>{0}</td>'+
    '        <td>{5}</td>'+
    '        <td>{6}</td>'+
    '        <td>{8}</td>'+
    '        <td>{7}</td>'+
    '        <td>{3}</td>'+
    '        <td>{1}</td>'+
    '    </tr>';
var limpiar_listado = function(){
  componenteListado.empty();
}

function limpiar() {
  $('[name=fecha]').val('');
  $('[name=cliente]').val('');
  $('[name=vendedor]').val('');
  $('#desde').val('')
  $('#hasta').val('')
  $('#cliente-id').val('')
  $('#vendedor-id').val('')
  $('#estado').val('')
}

$('#limpiar').on('click', function(){
  limpiar()
})

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
          $("#cliente").val(event.value);
          $("#cliente-id").val(event.id);
          return false;
        }
      });
    }
  })
});
//Fin Autocompletado clientes

//SECCION AYUDAS
function mostrarAyudaCliente() {
  $.notify({
    message: 'Ingrese el nombre o el número de documento del proveedor.'
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

var cargar_facturas = function(){
  $.ajax({
    url: 'reportescompras_controller/cargar_facturas',
    success: function(response) {
      var respuesta = $.parseJSON(response)
      var item = respuesta.data;
      limpiar_listado()
      for (var i = 0; i < item.length; i++) {
        if (item[i]['comestado'] == 'E') {
          item[i]['comestado'] = 'En Edición'
        }
        if (item[i]['comestado'] == 'A') {
          item[i]['comestado'] = 'Finalizado'
        }
        if (item[i]['comestado'] == 'N') {
          item[i]['comestado'] = 'Anulado'
        }
        componenteListado.append(modelFila.format(
          item[i]["cliente"],//0
          item[i]["comestado"],//1
          item[i]["vendedor"],//2
          formatMoney(item[i]["comtotal"]),//3
          item[i]["comnumero"], //4
          item[i]["comfecent"], //5
          item[i]["comfecvenci"], //6
          formatMoney(item[i]["comiva"]),//7
          formatMoney(item[i]["comdescuento"]),//8
          item[i]["numdoc"]//9
        ));
      }
    }
  })
}

var busqueda = function(){
  var cliente = $('#cliente-id').val()
  var vendedor = $('#vendedor-id').val()
  var desde = $('#desde').val()
  var hasta = $('#hasta').val()
  var estado = $('#estado').val()
  var excel = $('[name=generar_excel]').val()
  $.ajax({
    url: 'reportescompras_controller/busqueda',
    type: 'POST',
    data: {
      cliente: cliente,
      vendedor: vendedor,
      desde: desde,
      hasta: hasta,
      estado: estado,
      excel: excel
    },
    success: function(response){
      var respuesta = $.parseJSON(response);
      var item = respuesta.data;
      limpiar_listado()
      for (var i = 0; i < item.length; i++) {
        if (item[i]['comestado'] == 'E') {
          item[i]['comestado'] = 'En Edición'
        }
        if (item[i]['comestado'] == 'A') {
          item[i]['comestado'] = 'Finalizado'
        }
        if (item[i]['comestado'] == 'N') {
          item[i]['comestado'] = 'Anulado'
        }
        componenteListado.append(modelFila.format(
          item[i]["cliente"],//0
          item[i]["comestado"],//1
          item[i]["vendedor"],//2
          formatMoney(item[i]["comtotal"]),//3
          item[i]["comnumero"], //4
          item[i]["comfecent"], //5
          item[i]["comfecvenci"], //6
          formatMoney(item[i]["comiva"]),//7
          formatMoney(item[i]["comdescuento"]),//8
          item[i]["numdoc"]//9
        ));
      }
      //limpiar()
    }
  })
}

$('#excel').on('click', function(){
  var clave = 'CLI'
  $('[name=generar_excel]').val('true')
  var excel = $('[name=generar_excel]').val()
  var desde = $('#desde').val();
  var hasta = $('#hasta').val();
  var estado = $('[name=estado]').val();
  var cliente = $('[name=cliente-id]').val();
  data = {}
  data = {
    data: clave,
    desde: desde,
    hasta: hasta,
    estado: estado,
    cliente: cliente,
    excel: excel
  }
  descargarPostArchivo('reportescompras_controller/busqueda', data)
})

$('#buscar').on('click', function() {
  $('[name=generar_excel]').val("false")
  busqueda()
})
cargar_facturas();
