function heightPanel() {
    var panel = ($(window).height() - $('[name=cabeceraApp]').outerHeight() - $('[name=separadorHeader]').outerHeight());
    return panel;
}

$(document).ready(function() {
  $(window).resize(function() {
    var height = heightPanel();
    var componentAuto=$('[autoCal=true]');
    for (var i = 0; i < componentAuto.length; i++) {
      var formu=$(componentAuto[i]).attr("formulaCal");
      var resultado=height;
      eval("resultado="+formu.replace("height", height));
      $(componentAuto[i]).css({
          height: resultado
      });
    }
  });
  $(window).resize();
});

function showInfo(mensaje) {
    $.bootstrapGrowl(mensaje, {
        align: 'center',
        type: 'success',
        width: 'auto'
    });

}


if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined'
                    ? args[number]
                    : match
                    ;
        });
    };
}
if (!String.prototype.formatArray) {
    String.prototype.formatArray = function() {
        var args = arguments[0];
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined'
                    ? args[number]
                    : match
                    ;
        });
    };
}

function showLoadingButton(id) {
    $('#' + id).data('loading-text', 'Procesando...');
    $('#' + id).button('loading');
    $('#' + id).attr("disabled", true);
    //$('#pleaseWaitDialog').modal('show');
//    waitingDialog.show();
}

function resetLoadingButton(id) {
    $('#' + id).button('reset');
    $('#' + id).attr("disabled", false);
    //$('#pleaseWaitDialog').modal('hide');
//    waitingDialog.hide();
}

function loadingComponent(id) {
    $(id).html('<span style="font-size:20px;"  class="glyphicon glyphicon-refresh glyphicon-refresh-animate">Cargando...</span>');
    //$(id).html('<img src="' + BASE_URL2 + '/assets/img/shared/loading.gif">');
}

function showLoading() {
    waitingDialog.show('Cargando, por favor espere...', {dialogSize: 'm', progressType: 'success'});
}

function hideLoading() {
    waitingDialog.hide();
}

function mostrarPaginador(totalRegistros) {
    if (typeof(totalRegistros) === 'undefined' || totalRegistros === null || totalRegistros === 0) {
        totalRegistros = 1;
    }
    var p = new Paginador(
            document.getElementById('paginador'), totalRegistros);
    p.Mostrar();
}

function mostrarError(mensaje) {
    //$('#mensaje-error').html(mensaje);
    //$('#error-modal').modal('show');
    $.bootstrapGrowl(mensaje, {
        align: 'center',
        type: 'danger',
        width: 'auto',
        allow_dismiss: true,
        delay: 10000

    });

//    $.alert({
//        title: 'Error',
//        content: mensaje,
//        confirmButton: 'Cerrar'
//    });

}

function containts(text, substring) {
    return text.indexOf(substring) >= 0;
}



function validarDecimal(value, decimales, min, max) {
    value = parseFloat(value).toFixed(decimales);
    if (!$.isNumeric(value)) {
        value = min;
    }
    if (parseFloat(value) > max) {
        value = max;
    }
    if (parseFloat(value) === "0.00") {
        value = min;
    }
    return value;
}

function validarEntero(value, min, max) {
    value = parseInt(value);
    if (!$.isNumeric(value)) {
        value = min;
    }
    if (value < 1) {
        value = min;
    }
    if (value > max) {
        value = max;
    }
    return value;
}

function fechaActual() {
    var f = new Date();
    return f.getDate() + "/" + (f.getMonth() + 1) + "/" + f.getFullYear();
}

function imprimir(html) {
    hideLoading();
    var win = window.open('', 'imprimir', '');
    if (typeof win == 'undefined') {
        mostrarError("Por favor habilite las ventanas emergentes.");
    } else {
        win.document.body.innerHTML = html;
        win.focus();
        win.print();
        win.close();
    }

}

function __validEmail(v) {
    var r = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");
    return (v.match(r) == null) ? false : true;
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
    return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, " "));
}
