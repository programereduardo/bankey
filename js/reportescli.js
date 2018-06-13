var componenteListado = $('[name=listado_clientes]');
var modelFila = '<tr>'+
    '        <td id="codigo">{0}</td>'+
    '        <td>{1}</td>'+
    '        <td>{2}</td>'+
    '        <td>{3}</td>'+
    '        <td>{4} {6} {7} {8}</td>'+
    '        <td>{16}</td>'+
    '        <td id="asoc">{5}</td>'+
    '        <td>{14}</td>'+
    '        <td>{15}</td>'+
    '        <td>{17}</td>'+
    '        <td>{18}</td>'+
    '        <td>{19}</td>'+
    '        <td>{27}</td>'+
    '        <td>{23}</td>'+
    '        <td>{24}</td>'+
    '        <td>{25}</td>'+
    '        <td>{26}</td>'+
    '    </tr>';

var obtener_clientes = function(){
  var clave = 'CLI'
    waitingDialog.show('Cargando, por favor espere...', {dialogSize: 'm', progressType: ''});
    $.ajax({
        url: 'terceros_controller/listar_clientes',
        type: 'POST',
        data: {
          data: clave
        },
        success: function(response) {
            var respuesta = $.parseJSON(response);
            var datos = respuesta.clientes;
            var cant = respuesta.cantidad
            componenteListado.empty();
            if (respuesta.success === true) {
              for (var i = 0; i < datos.length; i++) {
                if (datos[i]["terdatcontributivo"] == 'S') {
                  datos[i]["terdatcontributivo"] = 'Si';
                } else {
                  datos[i]["terdatcontributivo"] = 'No';
                }
                if (datos[i]["terdatretenedor"] == 'S') {
                  datos[i]["terdatretenedor"] = 'Si';
                } else {
                  datos[i]["terdatretenedor"] = 'No';
                }
                componenteListado.append(modelFila.format(
                  datos[i]["tercodigo"],//0
                  datos[i]["detalle"],//1
                  datos[i]["terdocnum"],//2
                  datos[i]["terdigver"],//3
                  datos[i]["ternom1"],//4
                  datos[i]["ternombre"],//5
                  datos[i]["ternom2"],//6
                  datos[i]["terape1"],//7
                  datos[i]["terape2"],//8
                  datos[i]["terubivalor"],//9
                  datos[i]["terdatfecnac"],//10
                  datos[i]["terdattipsex"],//11
                  datos[i]["terdattipnac"],//12
                  datos[i]["terdatciunac"],//13
                  datos[i]['terdatcontributivo'],//14
                  datos[i]["terdatretenedor"],//15
                  datos[i]["clave"],//16
                  datos[i]["direccion"],//17
                  datos[i]["correo"],//18
                  datos[i]["telefono"],//19
                  datos[i]["tertipdoc"],//20
                  datos[i]["tertipo"],//21
                  datos[i]['tertipogrupo'], //22
                  datos[i]['barrio'], //23
                  datos[i]['municipio'], //24
                  datos[i]['dpto'], //25
                  datos[i]['pais'], //26
                  datos[i]['celular'] //27
                ));
              }
              $('#total_terceros').html('Total de Clientes : ' + (cant - 1))
              $('#total_terceros').css('font-weight', 'bold')
              /*$('[name=btnEditar]').on('click', accionModificar);
              $('[name=btnEliminarCli]').on('click', accionEliminar);
              $('[name=btnUbicacion]').on('click', accionUbicacion);*/
            }
            waitingDialog.hide();
        }
    });
};
obtener_clientes();

$('#excel').on('click', function(){
  var clave = 'CLI'
  $('[name=generar_excel]').val('true')
  var excel = $('[name=generar_excel]').val()
  var pais = $('[name=pais]').val();
  var pais = obtener_nombre_pais(pais)
  var estado = $('[name=estado]').val();
  var estado = obtener_nombre_estado(estado)
  var ciudad = $('[name=ciudad]').val();
  var ciudad = obtener_nombre_ciudad(ciudad)
  var barrio = $('[name=barrio]').val();
  var barrio = obtener_nombre_barrio(barrio)
  var tipo = $('[name=tipo]').val();
  data = {}
  data = {
    data: clave,
    pais: pais,
    estado: estado,
    ciudad: ciudad,
    barrio: barrio,
    tipo: tipo,
    excel: excel
  }
  descargarPostArchivo('reportescli_controller/buscar', data)
})

var obtener_paises = function(){
  var select = $('#pais');
  var name = select.attr('name');
  var combo = $('[name="pais"]');
  $.ajax({
      url: "terceros_controller/obtener_paises",
      success: function(response) {
        var respuesta = $.parseJSON(response);
        if (respuesta.success === true) {
          combo.empty();
          combo.append('<option value="">Seleccione</option>')
          var cantidad = respuesta.paises.length
          item = respuesta.paises[cantidad-1]
          combo.append('<option value="'+item["paicodigo"]+'">'+item["painombre"]+'</option>');
          for (var i = 0; i < cantidad-1; i++) {
            var item = respuesta.paises[i];
            combo.append('<option value="'+item["paicodigo"]+'">'+item["painombre"]+'</option>');
          }
        }
      }
  });
}
obtener_paises()
//Fin obtener paises

//Obtener estados
function obtener_estados() {
  var combo = $('[name=estado]');
  var codigo_pais = $('[name=pais]').val();
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
      }
    }
  });
}
//Obtener estados

//obtener ciudades
function obtener_ciudades(){
  var combo = $('[name=ciudad]');
  var codigo_estado = $('[name=estado]').val();
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
      }
    }
  });
}
//fin obtener ciudades

function obtener_barrios(){
  var combo = $('[name=barrio]')
  var codigo_ciudad = $('[name=ciudad]').val()
  $.ajax({
    url: "terceros_controller/obtener_barrios",
    type: 'POST',
    data: {
      codigo_ciudad: codigo_ciudad
    },
    success: function(response) {
      var respuesta = $.parseJSON(response);
      combo.empty();
      combo.append('<option value="">Seleccione</option>')
      if (respuesta.success === true) {
        for (var i = 0; i < respuesta.barrios.length; i++) {
          var item = respuesta.barrios[i];
          combo.append('<option value="'+item["barcodigo"]+'">'+item["barnombre"]+'</option>');
        }
      }else{
        combo.empty();
        combo.append('<option value="">Seleccione</option>')
      }
    }
  });
}

var buscar = function(){
  var generar_excel = $('[name=generar_excel]').val();
  var clave = 'CLI'
  var pais = $('[name=pais]').val();
  var pais = obtener_nombre_pais(pais)
  var estado = $('[name=estado]').val();
  var estado = obtener_nombre_estado(estado)
  var ciudad = $('[name=ciudad]').val();
  var ciudad = obtener_nombre_ciudad(ciudad)
  var barrio = $('[name=barrio]').val();
  var barrio = obtener_nombre_barrio(barrio)
  var tipo = $('[name=tipo]').val();
  $.ajax({
    url: 'reportescli_controller/buscar',
    type: 'POST',
    data: {
      data: clave,
      pais: pais,
      estado: estado,
      ciudad: ciudad,
      barrio: barrio,
      tipo: tipo,
      excel: generar_excel
    },
    success: function(response){
      var respuesta = $.parseJSON(response);
      var datos = respuesta.data
      
      componenteListado.empty()
      if (respuesta.success === true) {
        for (var i = 0; i < datos.length; i++) {
          if (datos[i]["terdatcontributivo"] == 'S') {
            datos[i]["terdatcontributivo"] = 'Si';
          } else {
            datos[i]["terdatcontributivo"] = 'No';
          }
          if (datos[i]["terdatretenedor"] == 'S') {
            datos[i]["terdatretenedor"] = 'Si';
          } else {
            datos[i]["terdatretenedor"] = 'No';
          }
          componenteListado.append(modelFila.format(
            datos[i]["tercodigo"],//0
            datos[i]["detalle"],//1
            datos[i]["terdocnum"],//2
            datos[i]["terdigver"],//3
            datos[i]["ternom1"],//4
            datos[i]["ternombre"],//5
            datos[i]["ternom2"],//6
            datos[i]["terape1"],//7
            datos[i]["terape2"],//8
            datos[i]["terubivalor"],//9
            datos[i]["terdatfecnac"],//10
            datos[i]["terdattipsex"],//11
            datos[i]["terdattipnac"],//12
            datos[i]["terdatciunac"],//13
            datos[i]['terdatcontributivo'],//14
            datos[i]["terdatretenedor"],//15
            datos[i]["clave"],//16
            datos[i]["direccion"],//17
            datos[i]["correo"],//18
            datos[i]["telefono"],//19
            datos[i]["tertipdoc"],//20
            datos[i]["tertipo"],//21
            datos[i]['tertipogrupo'], //22
            datos[i]['barrio'], //23
            datos[i]['municipio'], //24
            datos[i]['dpto'], //25
            datos[i]['pais'], //26
            datos[i]['celular'] //27
          ));
        }
      }
    }
  })
}

$('#buscar').on('click', function(){
  $('[name=generar_excel]').val("false")
  buscar();
})

$('#limpiar').on('click', function(){
  $('#pais').val('')
  $('#estado').val('NA')
  $('#ciudad').val('NA')
  $('#barrio').val('NA')
  $('#tipo').val('NA')
})
