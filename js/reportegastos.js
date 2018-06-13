var componenteListado = $('[name=listar_facturas]');
var modelFila = '<tr class="{5}">'+
    '        <td id="codigo">{0}</td>'+
    '        <td style="width: 300px">{1}</td>'+
    '        <td style="width: 300px">{2}</td>'+
    '        <td style="width: 300px">{3}</td>'+
    '        <td style="width: 300px">{4}</td>'+
    '    </tr>';
var limpiar_listado = function(){
  componenteListado.empty();
}

function limpiar() {
  $('[name=fecha]').val('');
  $('[name=estado]').val('');
  $('#desde').val('')
  $('#hasta').val('')
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

var cargar_gastos = function(){
  $.ajax({
    url: 'reporteGastos_controller/cargar_gastos',
    success: function(response) {
      var respuesta = $.parseJSON(response)
      var datos = respuesta.data;
      limpiar_listado()
      for (var i = 0; i < datos.length; i++) {
        componenteListado.append(modelFila.format(
          datos[i]["gascodigo"],//0
          datos[i]["tipdetalle"],//1
          datos[i]["gasfecha"],//2
          formatMoney(datos[i]["gasvalor"]),//3
          datos[i]["gasestado"],//4
          clase = datos[i]['gasestado'] == 'Inactivo'? clase = 'danger': datos[i]['gasestado'] == 'Activo'? clase = 'success': clase = '',//5
        ));
      }
    }
  })
}

var busqueda = function(){
  var desde = $('#desde').val()
  var hasta = $('#hasta').val()
  var estado = $('[name=estado]').val()
  var excel = $('#generar_excel').val()
  $.ajax({
    url: 'reporteGastos_controller/busqueda',
    type: 'POST',
    data: {
      desde: desde,
      hasta: hasta,
      excel: excel,
      estado: estado
    },
    success: function(response){
      var respuesta = $.parseJSON(response);
      var datos = respuesta.data;
      limpiar_listado()
      for (var i = 0; i < datos.length; i++) {
        componenteListado.append(modelFila.format(
            datos[i]["gascodigo"],//0
            datos[i]["tipdetalle"],//1
            datos[i]["gasfecha"],//2
            formatMoney(datos[i]["gasvalor"]),//3
            datos[i]["gasestado"],//4
            clase = datos[i]['gasestado'] == 'Inactivo'? clase = 'danger': datos[i]['gasestado'] == 'Activo'? clase = 'success': clase = '',//5
        ));
      }
      //limpiar()
    }
  })
}


$('#excel').on('click', function(){  
  $('[name=generar_excel]').val('true')
  var excel = $('[name=generar_excel]').val()
  var desde = $('#desde').val();
  var hasta = $('#hasta').val();
  var estado = $('[name=estado]').val();
  data = {}
  data = {
    desde: desde,
    hasta: hasta,
    estado: estado,
    excel: excel
  }
  descargarPostArchivo('reporteGastos_controller/busqueda', data)
})

$('#buscar').on('click', function() {
  $('[name=generar_excel]').val("false")
  busqueda()
})
cargar_gastos();
