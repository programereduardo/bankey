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
