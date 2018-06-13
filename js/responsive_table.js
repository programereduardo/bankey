if (screen.width <= 1024 && screen.width > 768) {
  for (var i = 1; i < 7; i++) {
    $('#modal').find('#div_button'+i).removeClass('col-xs-6')
    $('#modal').find('#div_button'+i).removeClass('col-sm-4')
    $('#modal').find('#div_button'+i).removeClass('col-md-2')

    $('#modal').find('#div_button'+i).addClass('col-xs-2')
    $('#modal').find('#div_button'+i).addClass('col-sm-2')
    $('#modal').find('#div_button'+i).addClass('col-md-1')

    $('#modal').find('#changeClass'+i).removeClass('col-xs-2')

    $('#modal').find('#changeClass'+i).addClass('col-xs-4')
  }

  $('#modal').find('#fecven').html('F. Vencimiento :')
  $('#modal').find('#forpag').html('F. Pago :<span class="required"> *</span>')
  $('#modal').find('#numfac').html('N. Factura :<span class="required"> *</span>')
  $('#modal').find('#fecent').html('F. Entrada :<span class="required"> *</span>')
  $('#modal').find('#cuoini').html('C. Inicial :<span class="required"> *</span>')
  $('#modal').find('#forpag').html('F. Pago :<span class="required"> *</span>')

  $('#modal').find('#tip_doc_ter').html('T. Documento :<span class="required"> *</span>')
  $('#modal').find('#num_doc_ter').html('T. Documento :<span class="required"> *</span>')
  $('#modal').find('#dv_ter').html('D.V:<span class="required"> *</span>')
  $('#modal').find('#pai_nac').html('P. Nacimiento:<span class="required"> *</span>')
  $('#modal').find('#est_nac').html('E. Nacimiento:<span class="required"> *</span>')
  $('#modal').find('#ciu_nac').html('C. nacimiento:<span class="required"> *</span>')
  $('#modal').find('#fec_nac').html('F. nacimiento:<span class="required"> *</span>')



  $('#modal').find('[name=div_dv_ter]').removeClass('col-xs-1')
  $('#modal').find('[name=div_dv_ter]').addClass('col-xs-2')
}
