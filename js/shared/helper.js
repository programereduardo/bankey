$.notifyDefaults ({
    animate: {
      enter: 'animated zoomInDown',
      exit: 'animated zoomOutUp'
    }
});

$(document).ajaxSuccess(function(event, xhr, settings) {
  if(xhr.status==200 && settings.url.indexOf(".js")==-1){
    var respuesta=$.parseJSON(xhr.responseText);
    if(respuesta.success === false && respuesta.session === false){
      window.location = 'login';
      return;
    }
  }
});

var chartHelper = {
  createChart: function (canvasId, chartType, data, options) {
  var ctx = $("#" + canvasId).get(0).getContext("2d");
  return new Chart(ctx)[chartType](data, options);
  }
}

function mostrarFecha(days){
  milisegundos=parseInt(35*24*60*60*1000);
  fecha=new Date();
  day=fecha.getDate();
  // el mes es devuelto entre 0 y 11
  month=fecha.getMonth()+1;
  year=fecha.getFullYear();
  //Obtenemos los milisegundos desde media noche del 1/1/1970
  tiempo=fecha.getTime();
  //Calculamos los milisegundos sobre la fecha que hay que sumar o restar...
  milisegundos=parseInt(days*24*60*60*1000);
  //Modificamos la fecha actual
  total=fecha.setTime(tiempo+milisegundos);
  day=fecha.getDate();
  month=fecha.getMonth()+1;
  year=fecha.getFullYear();
  return (year+'-'+month+'-'+day)
}

function descargarPostArchivo(url, parametros){
  $("<div id='downloadFormPoster' style='display: none;'></div>").appendTo('body');
  var html="<form target='_blank' action='"+url+"' method='post'>";
  $.each(parametros, function(key, value) {
    html+="<input type='hidden' name='"+key+"' value='" + value + "'/>";
  });
  html+="</form>";
  $(html).appendTo("#downloadFormPoster").submit();
  $("#downloadFormPoster").remove();
}

var formatMoney = function(value, separadorMiles, signo, separadorDecimal, cantidadDecimal){
  if(separadorMiles == undefined){
    separadorMiles = ".";
  }
  if(separadorDecimal == undefined){
    separadorDecimal = ",";
  }
  if(cantidadDecimal == undefined){
    cantidadDecimal = 4;
  }
  if(signo == undefined){
    signo="$";
  }
  if(value == null || value === ""){
    return "-";
  }
  var retorno = "";
  var con = 1;
  var value2 = parseFloat(value).toFixed(0)+"";
  var value3 = (parseFloat(value).toFixed(cantidadDecimal))+"";
  value3 = (value3).substring(value2.length+1, value3.length);
  var value4 = value3;
  for (var i = value3.length - 1; i >= 0; i--) {
    if(value3[i] == "0"){
      value4 = value3.substring(0, i-1);
    }else{
      break;
    }
  }
  for (var i = value2.length - 1; i >= 0; i--) {
    retorno = (con == 3 && i > 0 && value2[i-1] !== "-" ? separadorMiles:"") + value2[i] + retorno;
    if(con == 3){
      con = 1;
    }else{
      con++;
    }
  }
  return signo + retorno + (value4 != "" && parseFloat(value4) > 0 ? separadorDecimal + value4:"");
}


var obtener_nombre_pais = function(data){
  var seguir = true;
  if (data == undefined || data == null || data == "" || data == "NA") {
    seguir = false;
  }
  var retorno = "";
  if (seguir === true) {
    $.ajax({
      async: false,
      url: 'reportescli_controller/obtener_nombre_pais',
      type: 'POST',
      data: {
        codigo_pais: data
      },
      success: function(response){
        var respuesta = $.parseJSON(response)
        if (respuesta.success === true) {
          retorno = respuesta.data
        }
      }
    })
  }
  return (retorno)
}

var obtener_nombre_estado = function(data){
  var seguir = true;
  if (data == undefined || data == null || data == "" || data == "NA") {
    seguir = false;
  }
  var retorno = "";
  if (seguir === true) {
    $.ajax({
      async: false,
      url: 'reportescli_controller/obtener_nombre_estado',
      type: 'POST',
      data: {
        codigo_estado: data
      },
      success: function(response){
        var respuesta = $.parseJSON(response)
        if (respuesta.success === true) {
          retorno = respuesta.data
        }
      }
    })
  }
  return (retorno)
}

var obtener_nombre_ciudad = function(data){
  var seguir = true;
  if (data == undefined || data == null || data == "" || data == "NA") {
    seguir = false;
  }
  var retorno = "";
  if (seguir === true) {
    $.ajax({
      async: false,
      url: 'reportescli_controller/obtener_nombre_ciudad',
      type: 'POST',
      data: {
        codigo_ciudad: data
      },
      success: function(response){
        var respuesta = $.parseJSON(response)
        if (respuesta.success === true) {
          retorno = respuesta.data
        }
      }
    })
  }
  return (retorno)
}

var obtener_nombre_barrio = function(data){
  var seguir = true;
  if (data == undefined || data == null || data == "" || data == "NA") {
    seguir = false;
  }
  var retorno = "";
  if (seguir === true) {
    $.ajax({
      async: false,
      url: 'reportescli_controller/obtener_nombre_barrio',
      type: 'POST',
      data: {
        codigo_barrio: data
      },
      success: function(response){
        var respuesta = $.parseJSON(response)
        if (respuesta.success === true) {
          retorno = respuesta.data
        }
      }
    })
  }
  return (retorno)
}

var obtener_saldo = function(){
  var total = 0;
  var numero_real = $('[name=modalFacturacion]').find('[name=numero_real]').val()
  $.ajax({
    async: false,
    url: 'facturacion_controller/obtener_pagos',
    type: 'POST',
    data: {
      numero: numero_real
    },
    success: function(response){
      var respuesta = $.parseJSON(response);
      if (respuesta.success === true) {
        var datos = respuesta.data;
        for (var i = 0; i < datos.length; i++) {
          total = parseInt(datos[i]['pagabono']) + total
        }
      }
    }
  })
  return (total)
}

get_location = function(dt){
  var data = {};
  debugger
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      data = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        factura: dt,
        proximidad: position.coords.accuracy
      };
    }, function(error) {
      switch(error.code) {
        case error.PERMISSION_DENIED:
            debugger
            generarNotify('ERROR! ACTIVE Y PERMITA USAR SU GPS PARA OBTENER SU UBICACIÓN.', 'danger')
            break;
        /*case error.POSITION_UNAVAILABLE:
            // La ubicación no está disponible.
            break;
        case error.TIMEOUT:
            // Se ha excedido el tiempo para obtener la ubicación.
            break;
        case error.UNKNOWN_ERROR:
            // Un error desconocido.
            break;*/
      }
    });
  } else {
    $.getJSON("http://freegeoip.net/json/", function(data) {
      data = {
        country_code: data.country_code,
        country: data.country_name,
        ip: data.ip,
        time_zone: data.time_zone,
        latitude: data.latitude,
        longitude: data.longitude,
        factura: dt
      }
    })
  }
  send_location(data);
}
//get_location('999')

function send_location(data){
  $.ajax({
    url: 'facturacion_controller/save_location',
    type: 'POST',
    data: data/*,
    success: function(response){
      resp = $.parseJSON(response)
      if (respuesta.success === false) {

      }
    }*/
  })
}

function generarNotify(msg, type) {
  $.notify({
    message: msg
  }, {
    type: type,
    delay: 3000,
    placement: {
      align: 'center'
    },
    z_index: 99999,
  });
}
