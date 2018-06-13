//Inicio obtener familias
function limpiar() {
  $('#vendedor').val("");
  $('#vendedor-id').val("");
  $('#cliente').val("");
  $('#cliente-id').val("");
  $('#desde').val("");
  $('#hasta').val("");
}

var componente = $('[name=listar_datos]');
var limpiar_listado = function(){
  componente.empty();
}

var modelFila = '<tr>'+
'        <td id="codigo">{0}</td>'+
'        <td>{5}</td>'+
'        <td>{6}</td>'+
'        <td>{3}</td>'+
'        <td>{4}</td>'+
'        <td>{1}</td>'+
'        <td>{2}</td>'+
'        <td>{7}</td>'+
'    </tr>';
var obtener_documentos = function(){
  var tipo = $('#tipo_tercero').val();
  waitingDialog.show('Cargando, por favor espere...', {dialogSize: 'm', progressType: ''});

      $.ajax({
        url: 'reportescontrol_controller/obtener_control',
        type: 'POST',
        data: {
          tipo: tipo
        },
        success: function(response){
          var respuesta = $.parseJSON(response);
          componente.empty();
          if (respuesta.success === true) {
            var datos = respuesta.data;
            for (var i = 0; i < datos.length; i++) {
              componente.append(modelFila.format(
                datos[i]['invconcodigo'],//0
                datos[i]['invconexistencias'],//1
                datos[i]['invconpedidos'],//2
                datos[i]['artdescripcion'],//3
                datos[i]['invconfecha'],//4
                datos[i]['terdocnum'],//5
                datos[i]['ternombre'],//6
                restante = datos[i]['invconexistencias'] - datos[i]['invconpedidos']
              ));
            }
          }
          waitingDialog.hide();
          limpiar();
        }
      })
}
//Fin obtener familias

//Llamado a la funcion obtener familias
obtener_documentos();
//Fin llamado a la funcion obtener familias

$('#limpiar').on('click', function(){
  limpiar()
})

$('#buscar').on('click', function(){
  $('#generar_excel').val("false")
  busqueda()
})

//Inicio mostrar ayuda
//Seccion ayuda clave
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
//Fin seccion ayuda clave

//Fin mostrar ayuda

//Inicio funcion convertir a mayusculas
function aMayusculas(obj,id){
  obj = obj.toUpperCase();
  document.getElementById(id).value = obj;
}
//Fin funcion convertir a mayusculas

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

$('[name=fecha]').daterangepicker({
  singleDatePicker: true,
  showDropdowns: true,
  startDate: moment(),
  locale: {
    format: 'YYYY-MM-DD'
  },
  singleDatePicker: true
});

var busqueda = function(){
  var cliente = $('#cliente-id').val()
  var vendedor = $('#vendedor-id').val()
  var desde = $('#desde').val()
  var hasta = $('#hasta').val()
  var estado = $('#estado').val()
  var excel = $('#generar_excel').val()
  var tipo_tercero = $('#tipo_tercero').val()
  $.ajax({
    url: 'reportescontrol_controller/busqueda',
    type: 'POST',
    data: {
      cliente: cliente,
      vendedor: vendedor,
      desde: desde,
      hasta: hasta,
      excel: excel,
      tipo_tercero: tipo_tercero
    },
    success: function(response){
      var respuesta = $.parseJSON(response);
      var datos = respuesta.data;
      limpiar_listado()
      for (var i = 0; i < datos.length; i++) {
        componente.append(modelFila.format(
          datos[i]['invconcodigo'],//0
          datos[i]['invconexistencias'],//1
          datos[i]['invconpedidos'],//2
          datos[i]['artdescripcion'],//3
          datos[i]['invconfecha'],//4
          datos[i]['terdocnum'],//5
          datos[i]['ternombre'],//6
          restante = datos[i]['invconexistencias'] - datos[i]['invconpedidos']
        ));
      }
      //limpiar()
    }
  })
}



$('#excel').on('click', function(){
  $('#generar_excel').val('true')
  var cliente = $('#cliente-id').val()
  var vendedor = $('#vendedor-id').val()
  var desde = $('#desde').val()
  var hasta = $('#hasta').val()
  var estado = $('#estado').val()
  var excel = $('#generar_excel').val()
  var tipo_tercero = $('#tipo_tercero').val()
  var titulo = $('#titulo').val()
  data = {}
  data = {
    cliente: cliente,
    vendedor: vendedor,
    desde: desde,
    hasta: hasta,
    excel: excel,
    tipo_tercero: tipo_tercero,
    titulo: titulo
  }
  descargarPostArchivo('reportescontrol_controller/busqueda', data)
})
