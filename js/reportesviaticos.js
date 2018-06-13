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

var limpiar = function(){
  $('#desde').val('')
  $('#hasta').val('')
  $('#cliente').val('')
  $('#cliente-id').val('')
  $('#vendedor').val('')
  $('#vendedor-id').val('')
  $('#generar_excel').val('false')
  $('[name=tipo_viatico]').val('');
}

$('#limpiar').on('click', function(){
  limpiar()
})

var obtener_viaticos_combo = function(){
  var combo = $('[name="tipo_viatico"]');
  var grupo = $('[name=tipo_registro]').val()
  $.ajax({
      url: "reportesviaticos_controller/obtener_viaticos_combo",
      type: 'POST',
      data: {
        grupo: grupo
      },
      success: function(response) {
        var respuesta = $.parseJSON(response);
        if (respuesta.success === true) {
          combo.empty();
          var cantidad = respuesta.data.length
          combo.append('<option value="">Seleccione</option>')
          for (var i = 0; i < cantidad; i++) {
            var item = respuesta.data[i];
            combo.append('<option value="'+item["tipcodigo"]+'">'+item["tipdetalle"]+'</option>');
          }
        }
      }
  });
}
obtener_viaticos_combo()


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
//FIN AYUDAS
limpiar()

var id = ''
if (user_rol == "Vendedor") {
  $('#ide').css('display', 'none')
  $('#name').css('display', 'none')
  id = "codigo"
}
//Inicio obtener familias
var componenteListarViaticos = $('[name=listar_viaticos]');
var modelFila = '<tr class="{14}">'+
                '  <td>{1}</td>'+
                '  <td>{2}</td>'+
                '  <td>{3}</td>'+
                '  <td>{4}</td>'+
                '  <td>{24}</td>'+
                '  <td>{5}</td>'+
                '  <td>{6}</td>'+
                '  <td>{7}</td>'+
                '  <td>{8}</td>'+
                '  <td>{9}</td>'+
                '  <td>{10}</td>'+
                '  <td>{11}</td>'+
                '  <td>{12}</td>'+
                '  <td>{13}</td>'+
                '</tr>';

var limpiar_listado = function(){
  componenteListarViaticos.empty();
}


var listar_viaticos = function(){
      waitingDialog.show('Cargando, por favor espere...', {dialogSize: 'm', progressType: ''});
      var dt = $('[name="tipo_registro"]').val();
      $.ajax({
        url: 'reportesviaticos_controller/listar_viaticos',
        type: 'POST',
        data: {
          grupo: dt
        },
        success: function(response){
          var respuesta = $.parseJSON(response);
          componenteListarViaticos.empty();
          if (respuesta.success === true) {
            var datos = respuesta.data;
            for (var i = 0; i < datos.length; i++) {
              componenteListarViaticos.append(modelFila.format(
                datos[i]['gascodigo'], //0
                datos[i]['terdocnum'], //1
                datos[i]['ternombre'], //2
                datos[i]['nombre_proveedor'], //3
                datos[i]['tipdetalle'], //4
                formatMoney(datos[i]['gassubtotal']),//5
                formatMoney(datos[i]['gasiva']),//6
                formatMoney(datos[i]['gasreteiva']),//7
                formatMoney(datos[i]['gasreteica']),//8
                formatMoney(datos[i]['gasretefuente']),//9
                formatMoney(datos[i]['gastotal']),//10
                datos[i]['gasfecha'],//11
                datos[i]['gasobservacion'],//12
                datos[i]['gasestado'],//13
                clase = datos[i]['gasestado'] == 'Anulado'? clase = 'danger': datos[i]['gasestado'] == 'Finalizado'? clase = 'success': datos[i]['gasestado'] == 'En revisión'? clase = 'warning': clase = '',//14
                datos[i]['tipcodigo'],//15
                datos[i]['tercodigo'],//16
                datos[i]['codigo_proveedor'],//17
                datos[i]['gassubtotal'],//18
                datos[i]['gasiva'],//19
                datos[i]['gasreteiva'],//20
                datos[i]['gasreteica'],//21
                datos[i]['gasretefuente'],//22
                datos[i]['gastotal'],//23
                datos[i]['gasfactura'],//24
              ));
            }
          }
          waitingDialog.hide();
        }
      })
}
//Fin obtener familias

//Llamado a la funcion obtener familias
listar_viaticos();
//Fin llamado a la funcion obtener familias

//Inicio funcion buscar
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

$('#excel').on('click', function(){
  $('[name=generar_excel]').val('true')
  var excel = $('[name=generar_excel]').val()
  var desde = $('#desde').val();
  var hasta = $('#hasta').val();
  var estado = $('[name=estado]').val();
  var cliente = $('[name=cliente-id]').val();
  var vendedor = $('[name=vendedor-id]').val();
  var tipo = $('[name=tipo_viatico]').val();
  var grupo = $('[name=tipo_registro]').val();
  data = {}
  data = {
    desde: desde,
    hasta: hasta,
    estado: estado,
    cliente: cliente,
    vendedor: vendedor,
    excel: excel,
    tipo: tipo,
    grupo: grupo
  }
  descargarPostArchivo('reportesviaticos_controller/busqueda', data)
})

$('#buscar').on('click', function() {
  $('[name=generar_excel]').val("false")
  busqueda()
})

var busqueda = function(){
  var cliente = $('#cliente-id').val()
  var vendedor = $('#vendedor-id').val()
  var desde = $('#desde').val()
  var hasta = $('#hasta').val()
  var estado = $('#estado').val()
  var excel = $('#generar_excel').val()
  var tipo = $('[name=tipo_viatico]').val();
  var grupo = $('[name=tipo_registro]').val();
  $.ajax({
    url: 'reportesviaticos_controller/busqueda',
    type: 'POST',
    data: {
      cliente: cliente,
      vendedor: vendedor,
      desde: desde,
      hasta: hasta,
      excel: excel,
      tipo: tipo,
      grupo: grupo
    },
    success: function(response){
      var respuesta = $.parseJSON(response);
      var datos = respuesta.data;
      limpiar_listado()
      for (var i = 0; i < datos.length; i++) {
        componenteListarViaticos.append(modelFila.format(
          datos[i]['gascodigo'], //0
          datos[i]['terdocnum'], //1
          datos[i]['ternombre'], //2
          datos[i]['nombre_proveedor'], //3
          datos[i]['tipdetalle'], //4
          formatMoney(datos[i]['gassubtotal']),//5
          formatMoney(datos[i]['gasiva']),//6
          formatMoney(datos[i]['gasreteiva']),//7
          formatMoney(datos[i]['gasreteica']),//8
          formatMoney(datos[i]['gasretefuente']),//9
          formatMoney(datos[i]['gastotal']),//10
          datos[i]['gasfecha'],//11
          datos[i]['gasobservacion'],//12
          datos[i]['gasestado'],//13
          clase = datos[i]['gasestado'] == 'Anulado'? clase = 'danger': datos[i]['gasestado'] == 'Finalizado'? clase = 'success': datos[i]['gasestado'] == 'En revisión'? clase = 'warning': clase = '',//14
          datos[i]['tipcodigo'],//15
          datos[i]['tercodigo'],//16
          datos[i]['codigo_proveedor'],//17
          datos[i]['gassubtotal'],//18
          datos[i]['gasiva'],//19
          datos[i]['gasreteiva'],//20
          datos[i]['gasreteica'],//21
          datos[i]['gasretefuente'],//22
          datos[i]['gastotal'],//23
          datos[i]['gasfactura'],//24
        ));
      }
      //limpiar()
    }
  })
}
