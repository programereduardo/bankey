var componenteListado = $('[name=listar_facturas]');
var modelFila = '<tr>'+
    '        <td id="codigo">{0}</td>'+
    '        <td style="width: 300px">{1}</td>'+
    '        <td style="width: 300px">{2}</td>'+
    '        <td style="width: 300px">{3}</td>'+
    '        <td style="width: 300px">{4}</td>'+
    '        <td style="width: 300px">{5}</td>'+
    '        <td style="width: 300px">{6}</td>'+
    '        <td style="width: 300px">{7}</td>'+
    '        <td style="width: 300px">{8}</td>'+
    '        <td style="width: 300px">{9}</td>'+
    '        <td style="width: 300px">{10}</td>'+
    '        <td style="width: 300px">{11}</td>'+
    '        <td style="width: 300px">{12}</td>'+
    '        <td style="width: 300px">{13}</td>'+
    '        <td style="width: 300px">{14}</td>'+
    '        <td style="width: 300px">{21}</td>'+
    '    </tr>';
var limpiar_listado = function(){
  componenteListado.empty();
}

function limpiar() {
  $('[name=grupo]').val('');
  $('[name=unidad]').val('');
  $('[name=linea]').val('');
  $('[name=familia]').val('');
  $('[name=marca]').val('');
}

$('#limpiar').on('click', function(){
  limpiar()
})

//SECCION AYUDAS
function mostrarAyuda() {
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
    url: 'reporteinventario_controller/cargar_articulos',
    success: function(response) {
      var respuesta = $.parseJSON(response)
      var datos = respuesta.data;
      limpiar_listado()
      for (var i = 0; i < datos.length; i++) {
        componenteListado.append(modelFila.format(
          datos[i]["artcodigo"],//0
          datos[i]["artreferencia"],//1
          datos[i]["artnombre"],//2
          datos[i]["artdescripcion"],//3
          datos[i]["artresumen"],//4
          datos[i]["unidad"],//5
          datos[i]["artbarcode"],//6
          datos[i]["familia"],//7
          datos[i]["linea"],//8
          datos[i]["marca"],//9
          datos[i]["grupo"],//10
          datos[i]["artporcentajeiva"],//11
          datos[i]["artexistencias"],//12
          datos[i]["artstock"],//13
          formatMoney(datos[i]["artvalor"]),//14
          datos[i]["artfamilia"],//15
          datos[i]["artgrupo"],//16
          datos[i]["artlinea"],//17
          datos[i]["artmarca"],//18
          datos[i]["artunidad"],//19
          datos[i]["artvalor"],//20
          formatMoney(datos[i]["total"]),//21
        ));
      }
    }
  })
}

var busqueda = function(){
  var linea = $('[name=linea]').val()
  var marca = $('[name=marca]').val()
  var familia = $('[name=familia]').val()
  var grupo = $('[name=grupo]').val()
  var unidad = $('[name=unidad]').val()
  var excel = $('[name=generar_excel]').val()
  var existencias = $('[name=existencias]').val()
  $.ajax({
    url: 'reporteinventario_controller/busqueda',
    type: 'POST',
    data: {
      linea: linea,
      marca: marca,
      familia: familia,
      grupo: grupo,
      unidad: unidad,
      excel: excel,
      existencias: existencias,
    },
    success: function(response){
      var respuesta = $.parseJSON(response);
      var datos = respuesta.data;
      limpiar_listado()
      for (var i = 0; i < datos.length; i++) {
        componenteListado.append(modelFila.format(
          datos[i]["artcodigo"],//0
          datos[i]["artreferencia"],//1
          datos[i]["artnombre"],//2
          datos[i]["artdescripcion"],//3
          datos[i]["artresumen"],//4
          datos[i]["unidad"],//5
          datos[i]["artbarcode"],//6
          datos[i]["familia"],//7
          datos[i]["linea"],//8
          datos[i]["marca"],//9
          datos[i]["grupo"],//10
          datos[i]["artporcentajeiva"],//11
          datos[i]["artexistencias"],//12
          datos[i]["artstock"],//13
          formatMoney(datos[i]["artvalor"]),//14
          datos[i]["artfamilia"],//15
          datos[i]["artgrupo"],//16
          datos[i]["artlinea"],//17
          datos[i]["artmarca"],//18
          datos[i]["artunidad"],//19
          datos[i]["artvalor"],//20
          formatMoney(datos[i]["total"]),//21
        ));
      }
      //limpiar()
    }
  })
}


$('#excel').on('click', function(){
  var clave = 'CLI'
  $('[name=generar_excel]').val('true')
  var linea = $('[name=linea]').val()
  var marca = $('[name=marca]').val()
  var familia = $('[name=familia]').val()
  var grupo = $('[name=grupo]').val()
  var unidad = $('[name=unidad]').val()
  var excel = $('[name=generar_excel]').val()
  var existencias = $('[name=existencias]').val()
  data = {}
  data = {
    linea: linea,
    marca: marca,
    familia: familia,
    grupo: grupo,
    unidad: unidad,
    excel: excel,
    existencias: existencias,
  }
  descargarPostArchivo('reporteinventario_controller/busqueda', data)
})

$('#buscar').on('click', function() {
  $('[name=generar_excel]').val("false")
  busqueda()
})
cargar_facturas();

function obtener_lineas(data) {
  var combo=$('[name=linea]');
  $.ajax({
      url: "articulos_controller/obtener_lineas",
      success: function(response) {
          var respuesta = $.parseJSON(response);
          if (respuesta.success === true) {
            combo.empty();
            combo.append('<option value="">Seleccione</option>')
            combo.append('<option value="1">No aplica</option>')
            for (var i = 0; i < respuesta.lineas.length; i++) {
              var item = respuesta.lineas[i];
              combo.append('<option value="'+item["tipcodigo"]+'">'+item["tipdetalle"]+'</option>');
            }
            if (data.length > 1) {
              combo.val(data)
            }
          }
      }
  });
}
//Fin obtener lineas

//Obtener unidades
function obtener_unidades(data) {
  var combo=$('[name=unidad]');
  $.ajax({
      url: "articulos_controller/obtener_unidades",
      success: function(response) {
          var respuesta = $.parseJSON(response);
          if (respuesta.success === true) {
            combo.empty();
            combo.append('<option value="">Seleccione</option>')
            combo.append('<option value="1">No aplica</option>')
            for (var i = 0; i < respuesta.unidades.length; i++) {
              var item = respuesta.unidades[i];
              combo.append('<option value="'+item["tipcodigo"]+'">'+item["tipdetalle"]+'</option>');
            }
            if (data.length > 1) {
              combo.val(data)
            }
          }
      }
  });
}
//Fin unidades

//Obtener familias
function obtener_familias(data) {
  var combo=$('[name=familia]');
  $.ajax({
      url: "articulos_controller/obtener_familias",
      success: function(response) {
          var respuesta = $.parseJSON(response);
          if (respuesta.success === true) {
            combo.empty();
            combo.append('<option value="">Seleccione</option>')
            combo.append('<option value="1">No aplica</option>')
            for (var i = 0; i < respuesta.familias.length; i++) {
              var item = respuesta.familias[i];
              combo.append('<option value="'+item["tipcodigo"]+'">'+item["tipdetalle"]+'</option>');
            }
            if (data.length > 1) {
              combo.val(data)
            }
          }
      }
  });
}
//Fin obtener familias

//Obtener marcas
function obtener_marcas(data){
  var combo=$('[name=marca]');
  $.ajax({
      url: "articulos_controller/obtener_marcas",
      success: function(response) {
          var respuesta = $.parseJSON(response);
          if (respuesta.success === true) {
            combo.empty();
            combo.append('<option value="">Seleccione</option>')
            combo.append('<option value="1">No aplica</option>')
            for (var i = 0; i < respuesta.marcas.length; i++) {
              var item = respuesta.marcas[i];
              combo.append('<option value="'+item["tipcodigo"]+'">'+item["tipdetalle"]+'</option>');
            }
            if (data.length > 1) {
              combo.val(data)
            }
          }
      }
  });
}
//Fin obtener marcas

//Obtener grupos
function obtener_grupos(data){
  var combo=$('[name=grupo]');
  $.ajax({
      url: "articulos_controller/obtener_grupos",
      success: function(response) {
          var respuesta = $.parseJSON(response);
          if (respuesta.success === true) {
            combo.empty();
            combo.append('<option value="">Seleccione</option>')
            combo.append('<option value="1">No aplica</option>')
            for (var i = 0; i < respuesta.grupos.length; i++) {
              var item = respuesta.grupos[i];
              combo.append('<option value="'+item["tipcodigo"]+'">'+item["tipdetalle"]+'</option>');
            }
            if (data.length > 1) {
              combo.val(data)
            }
          }
      }
  });
}
//Fin obtener grupos

obtener_familias('')
obtener_grupos('')
obtener_lineas('')
obtener_marcas('')
obtener_unidades('')
