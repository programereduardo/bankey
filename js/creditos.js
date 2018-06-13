
//metodo para abrir el modal de registro creditos
$('#registrar').on('click',function()
{
	$('[name=modalCreditos]').modal();
  buscar_documentocli();
})
//fin del metodo

//metodo para llenar select de cliente 

var buscar_documentocli = function()
  {
  	var select = $('#cliente');
    $.ajax({
	    url: 'creditos_controller/obtener_doccliente',
	    success: function(response)
	    {
	      var respuesta = $.parseJSON(response);
	      if (respuesta.success === true)
	      {
	      	select.empty();
	      	select.append('<option value="0">Seleccione</option>');
	      	for (var i = 0; i < respuesta.data.length; i++) {
	      		var item = respuesta.data[i];
	      		select.append('<option value="'+item['ter_id']+'">'+item['ter_pnombre']+' '+item['ter_snombre']+' '+item['ter_papellido']+' </option>');
	      	}
	      	select.append('<option value="Nuevo">Agregar Nuevo Cliente</option>');
	      }
	    }
	 })
  }



//fin del metodo


//metodo para agregar nuevo cliente desde el modal de creditos

	$('#cliente').on('change',function()
	{
		if ($('#cliente').val() === 'Nuevo')
		{
			
			$('[name=modalClientes]').modal();

		}
	})

//fin del metodo



//metodo para registrar el prestamo

	$('#btnGuardarCredito').on('click',function()
	{
		var cliente = $('[name=cliente]').val();
		var valor = $('[name=valor_prestado]').val();
		var validar = $('#formAgregarCredito').serializeArray();
		var error = false;
		var mensajerror;

		for (var i = 0; i < validar.length; i++) {
			var label = validar[i]['name'];
			var valor = validar[i]['value'];
			
			switch (label)
			{
				case 'cliente':
				if (valor.trim()=== '0')
				{
					var campo = $('[id=cliente]');
					error = true;
					mensajerror = 'Seleccione Nombre del CLiente';
					campo.focus();
					campo.append('').addClass('has-error');
					i = validar.length + 1;
					break;
				}else{
					$(".has-error").removeClass("has-error");
				}
				break;
				case 'valor_prestado':
				if (valor.trim()=== '')
				{
					var campo = $('[id=valor_prestado]');
					error = true;
					mensajerror = 'Ingrese Valor de Prestamo';
					campo.focus();
					campo.append('').addClass('has-error');
					i = validar.length + 1;
					break;
				}
				break;
			}
		}
		if (error === true)
		{
			$.notify(
			{
				message : mensajerror
			},{
				type : 'danger',
				delay : 100,
				placement : {
					align: 'center'
				},
				z_index : 9999
			})
		}else{
		$.ajax(
		{
			url : 'creditos_controller/guardar_credito',
			type : 'POST',
			data : {
				cliente : cliente,
				valor : valor
			},
			success : function(response)
			{
				var respuesta = $.parseJSON(response);
				if (respuesta.success === true)
				{
					$.notify(
					{
						message : 'Guardado Exitosamente.'
					},{
						type : 'success',
						delay : 100,
						placement : {
							align : 'center'
						},
						z_index : 9999


					});
					$('[name=modalCreditos]').modal('hide');
					obtener_creditos();
				}else{
					$.notify(
					{
						message : 'Ocurrio un problema, Intentelo de nuevo.'
					},{
						type : 'danger',
						delay : 100,
						placement : {
							align : 'center'
						},
						z_index : 9999
					});
				}
			}
		})
	}
	})

// fin del metodo







//metodo para mostrar la tabla de creditos

	var obtener_creditos = function()
	{
		componenteListarcreditos =$('[name=listado_creditos]');
		//waitingDialog.show('Cargando, por favor espere...', {dialogSize: 'm', progressType: ''});
	  var modelFila = '<tr>'+
	      '        <td id="codigo">{0}</td>'+
	      '			<td>'+
	      '            <span name="btnAgregar" id="btnAgregar"'+
	      '              codigo_ficha="{0}" clave_ficha="{1}" abreviatura_ficha="{2}" detalle_ficha="{3}"'+
	      '              class="text-info" style="width: 32px; padding-left: 0px; padding-right: 0px;" title="Registrar Pago" role="button">'+
	      '                <span class="fa fa-plus-circle" style="font-size: 18px;"/></span>'+
	      '			</td>'+
	      '        <td>{1} {2} {3} {4}</td>'+
	      '        <td>{5}</td>'+
	      '        <td>{6}</td>'+
	      '        <td>{7}</td>'+
	      '        </th>'+
	      '    </tr>';

	      $.ajax(
	      {
	      	url : 'creditos_controller/obtener_creditos',
	      	success : function(response)
	      	{
	      		var respuesta = $.parseJSON(response);
	      		if (respuesta.success === true)
	      		{
	      		
	      			var datos = respuesta.data;
	            for (var i = 0; i < datos.length; i++) {
	              componenteListarcreditos.append(modelFila.format(
	                datos[i]['cre_id'], //0
	                datos[i]['ter_pnombre'], //1
	                datos[i]['ter_snombre'], //2
	                datos[i]['ter_papellido'], //3
	                datos[i]['ter_sapellido'], //4
	                datos[i]['cre_prestamo'], //5
	                datos[i]['cre_interes'], //6
	                datos[i]['cre_fechaprest']//7
	              ));
	            }
	      		}
	      	}
	      })
	}
	

	obtener_creditos();

//fin del metodo





$('[id=btnGuardar]').on('click',function()
{
  
  
  
  //Inicio funcion guardar client

  var btnGuardar = $(this);
  var datos_clientes = $('[name=formAgregarCliente]').serializeArray();
  var error = false;
  var mensajeError;
  for (var i = 0; i < datos_clientes.length; i++) {
    var label = datos_clientes[i]["name"];
    var valor = datos_clientes[i]["value"];
    var compItem = $('[name=' + label + ']');
    $(".has-error").removeClass("has-error");
    switch (label) {
      
      case 'nombre1':
        if (valor.trim() == "") {
          mensajeError = 'Su primer nombre es necesario.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_clientes.length + 1;
          break;
        }
        break;
      /*case 'nombre2':
        if (valor.trim() == "") {
          mensajeError = 'Su segundo nombre es necesario.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_clientes.length + 1;
          break;
        }
        break;*/
      case 'apellido1':
        if (valor.trim() == "") {
          mensajeError = 'Su primer apellido es necesario.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_clientes.length + 1;
          break;
        }
        break;
      /*case 'apellido2':
        if (valor.trim() == "") {
          mensajeError = 'Su segundo apellido es necesario.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_clientes.length + 1;
          break;
        }
        break;*/
      case 'numero_documento':
        var numero = valor.trim()
        if (valor.trim() == "") {
          var compItem = $('[name=numero_documento]');
          mensajeError = 'Su numero de documento es necesario.';
          error = true;
          compItem.focus();
          compItem.parent('div').addClass("has-error");
          i = datos_clientes.length + 1;
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
      var val = $('[name=modalClientes]').find('[name=tipo]').val()
    if (val == '1') {
      var estado = validar_documento();
      if (estado === false) {
        $.notify({
          message: 'El número de documento que intenta registrar ya se encuentra registrado.'
        }, {
          type: 'danger',
          delay: 3000,
          placement: {
            align: 'center'
          },
          z_index: 99999,
        });
      } else {
        
                $('[name=modalClientes]').modal('hide');
        var fd = new FormData(document.getElementById("formAgregarCliente"));
        //waitingDialog.show('Guardando los cambios, por favor espere...', {dialogSize: 'm', progressType: ''});
       

        $.ajax({
          url: 'terceros_controller/guardar_tercero',
          type: 'POST',
          data: fd,
          processData: false, // tell jQuery not to process the data
          contentType: false,
          success : function(response)
          {
             var respuesta = $.parseJSON(response);
             if (respuesta.success === true)
             {
                $.notify(
                {
                  message : 'Guardado Exitosamente.'
                },{
                  type : 'success',
                  delay : 100,
                  placement : {
                    align : 'center'
                  },
                  z_index : 9999
                });
                var mostrado = true;
                buscar_documentocli();
             }
          }
        })
        if (mostrado === true)
        {
          $('[name=modalClientes]').modal('hide');
        }
      }
    } else {
      $('#nombre1').attr('name', 'nombre1')
      $('#apellido1').attr('name', 'apellido1')
     
      var fd = new FormData(document.getElementById("formAgregarCliente"));
      //waitingDialog.show('Guardando los cambios, por favor espere...', {dialogSize: 'm', progressType: ''});
      btnGuardar.attr("disabled", "disabled");
      $.ajax({
        url: 'terceros_controller/guardar_tercero',
        type: 'POST',
        data: fd,
        processData: false, // tell jQuery not to process the data
        contentType: false   // tell jQuery not to set contentType
      }).done(function(data) {
        //waitingDialog.hide();
        btnGuardar.removeAttr("disabled");
        btnGuardar.text('Guardar');
        $('[name=modalClientes]').modal('hide');
        $('#nombre1').attr('name', 'nombre1')
        $('#apellido1').attr('name', 'apellido1')
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
            obtener_clientes();
          }
        });
      });
    }
  }

//Fin funcion guardar clientes
  
})


function validar_documento() {
  var data = $('[name=modalClientes]').find('[name=numero_documento]').val()
  retorno = '';
  $.ajax({
    async: false,
    url: "terceros_controller/validar_documento",
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