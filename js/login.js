var solo_numeros = function(data){//Solo numeros
  var out = '';
  var filtro = '1234567890';//Caracteres validos
  //Recorrer el texto y verificar si el caracter se encuentra en la lista de validos
  for (var i=0; i<data.length; i++)
  if (filtro.indexOf(data.charAt(i)) != -1)
  //Se añaden a la salida los caracteres validos
  out += data.charAt(i);
  //Retornar valor filtrado
  return out;
}



var usuario, pass, session, result;
$('#submit').on('click', function(){
  usuario = $('#usuario').val();
  pass = $('#password').val();
  result = true;

  if (usuario == '' || pass == '') {
    result = false;
    $.notify({
      message: 'Ingrese un usuario y una contraseña.'
    }, {
      type: 'danger',
      delay: 3000,
      placement: {
        align: 'center'
      },
      z_index: 99999,
    });
  }

  session = usuario.length * pass.length;

  if (session > 0){
    $.ajax({
      url: 'login_controller/validar_login',
      type: 'POST',
      data: {
        usuario: usuario,
        password: pass,
      },
      success: function(resp){
        var respuesta = $.parseJSON(resp);
        if (respuesta.success === true) {
          if (respuesta.rol == 'Vendedor') {
            $('[name=modalPin]').find('[name=user]').val(respuesta.cod_user);
            $('[name=modalPin]').modal();
            var pin = $('[name=modalPin]').find('[name=pin]').val('');
          } else {
            location.href = './inicio';
          }
        } else {
          $.notify({
            message: respuesta.msg
          }, {
            type: 'danger',
            delay: 3000,
            placement: {
              align: 'center'
            },
            z_index: 99999,
          });
        }
      },
      error: function(resp){
        $.notify({
          message: 'Se produjo un error inesperado, intentelo más tarde. Si no funciona comuniquese con el Departamento de Sistemas (ERROR: LOG001).'
        }, {
          type: 'danger',
          delay: 3000,
          placement: {
            align: 'center'
          },
          z_index: 99999,
        });
      }
    })
  }
})
$('#mostrarError').on('click', function() {
  $('#mostrarError').html('<div></div>');
});

$('[name=btnValidarPin]').on('click', function() {
  validar_pin();
})


var validar_pin = function(){
  var user = $('[name=modalPin]').find('[name=user]').val();
  var pin = $('[name=modalPin]').find('[name=pin]').val();
  if (pin == "") {
    $.notify({
      message: 'Ingrese un PIN'
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
      url: 'login_controller/validar_pin_vendedor',
      type: 'POST',
      data: {
        user: user,
        pin: pin
      },
      success: function(resp){
        var respuesta = $.parseJSON(resp);
        if (respuesta.success === true) {
          location.href = './inicio';
        } else {
          $.notify({
            message: respuesta.msg
          }, {
            type: 'danger',
            delay: 3000,
            placement: {
              align: 'center'
            },
            z_index: 99999,
            onClosed: function(){
              $('[name=modalPin]').modal('hide');
            }
          });
        }
      },
      error: function(resp){
        $.notify({
          message: 'Error 002ALogin comuniquese con el Departamento de Sistemas'
        }, {
          type: 'danger',
          delay: 3000,
          placement: {
            align: 'center'
          },
          z_index: 99999,
        });
      }
    })
  }
}

$('[name=btnCancelPin]').on('click', function(){
  cerrar_sess()
})

var cerrar_sess = function(){
  $.ajax({
    url: 'login_controller/cerrar_ses'
  })
}
