/* global moment */
$(document).ready(() => {
  $('#datePickerStartDate').daterangepicker({
    autoUpdateInput: false,
    timePicker: true,
    maxYear: parseInt(moment().format('YYYY'), 10),
    locale: {
      format: 'DD-MM-YYYY',
      applyLabel: 'Save',
    },
    title: 'Date Range',
    checkboxhidden: false,
    checkboxlabel: 'All day',
  });

  $('#datePickerStartDate').on('apply.daterangepicker', (_, picker) => {
    $('#datePickerStartDate').val(picker.startDate.format('DD-MM-YYYY'));
    $('#datePickerEndDate').val(picker.endDate.format('DD-MM-YYYY'));
  });

  $('#datePickerStartDate').on('cancel.daterangepicker', () => {
    $('#datePickerStartDate').val('');
    $('#datePickerEndDate').val('');
  });

  $('#datePickerEndDate').daterangepicker({
    autoUpdateInput: false,
    timePicker: true,
    maxYear: parseInt(moment().format('YYYY'), 10),
    locale: {
      format: 'DD-MM-YYYY',
      applyLabel: 'Save',
    },
    title: 'Date Range',
    checkboxhidden: false,
    checkboxlabel: 'All day',
  });

  $('#datePickerEndDate').on('apply.daterangepicker', (_, picker) => {
    $('#datePickerStartDate').val(picker.startDate.format('DD-MM-YYYY'));
    $('#datePickerEndDate').val(picker.endDate.format('DD-MM-YYYY'));
  });

  $('#datePickerEndDate').on('cancel.daterangepicker', () => {
    $('#datePickerStartDate').val('');
    $('#datePickerEndDate').val('');
  });

  $('#singleDatePickerDate').daterangepicker({
    singleDatePicker: true,
    autoUpdateInput: false,
    timePicker: true,
    maxYear: parseInt(moment().format('YYYY'), 10),
    locale: {
      format: 'DD-MM-YYYY',
      applyLabel: 'Save',
    },
    title: 'Date Range',
    checkboxhidden: false,
    checkboxlabel: 'All day',
  });

  $('#singleDatePickerDate').on('apply.daterangepicker', (_, picker) => {
    $('#singleDatePickerDate').val(picker.startDate.format('DD-MM-YYYY'));
  });

  $('#singleDatePickerDate').on('cancel.daterangepicker', () => {
    $('#singleDatePickerDate').val('');
  });

  $('[data-toggle="tooltip"]').tooltip();

  $('#example').DataTable({
    info: false,
  });

  $('.selectpicker').selectpicker('refresh');

  $('.dataTables_filter input').attr('placeholder', 'Find an item by name');
});
