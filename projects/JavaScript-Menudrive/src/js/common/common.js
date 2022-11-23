/* eslint-disable linebreak-style */
/* eslint-disable func-names */
/* eslint-disable no-param-reassign */
/* eslint-disable radix */
/* global moment */

$(document).ready(() => {
  if ($('.datePickerStartDate').length > 0 || $('.startendpicker').length > 0) {
    $('.datePickerStartDate, .datePickerEndDate, .startendpicker').daterangepicker({
      autoUpdateInput: false,
      // timePicker: true,
      minDate: new Date(),
      maxYear: parseInt(moment().format('YYYY'), 10),
      locale: {
        format: 'DD-MM-YYYY',
        applyLabel: 'Save',
      },
      title: 'Date Range',
    });

    $('.datePickerStartDate, .datePickerEndDate').on('apply.daterangepicker', (_, picker) => {
      $('.datePickerStartDate').val(picker.startDate.format('DD-MM-YYYY'));
      $('.datePickerEndDate').val(picker.endDate.format('DD-MM-YYYY'));
    });

    $('.datePickerStartDate, .datePickerEndDate').on('cancel.daterangepicker', () => {
      $('.datePickerStartDate').val('');
      $('.datePickerEndDate').val('');
    });
  }

  if ($('#singleDatePickerDate').length) {
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
    });

    $('#singleDatePickerDate').on('apply.daterangepicker', (_, picker) => {
      $('#singleDatePickerDate').val(picker.startDate.format('DD-MM-YYYY'));
    });

    $('#singleDatePickerDate').on('cancel.daterangepicker', () => {
      $('#singleDatePickerDate').val('');
    });
  }
});
/* if the user clicks anywhere outside the select box,
then close all select boxes: */
$(document).ready(() => {
  $('#example').dataTable({
    info: false,
  });

  $('.dataTables_filter input').attr('placeholder', 'Find an item by name');

  $('body').tooltip({
    selector: '[data-toggle="tooltip"]',
  });

  function ascendingSort(a, b) {
    return ($(b).text().toUpperCase()) < ($(a).text().toUpperCase()) ? 1 : -1;
  }

  $(document).on('click', (event) => {
    const mdoToggle = $(event.target).hasClass('mdo-toggle');
    const mdToggle = $(event.target).hasClass('md-toggle');
    const actionsDropdown = $(event.target).hasClass('table-more-actions');
    const dataTargetId = $(event.target).attr('data-target');
    if (mdToggle) {
      const target = `#${$(event.target).data('target')}`;
      if ($(target).hasClass('d-none')) {
        $('.pick-menu').addClass('d-none');
        $(target).removeClass('d-none');
      } else {
        $(target).addClass('d-none');
      }
    } else if (mdoToggle) {
      $(event.target).closest('.add-textfield').find('.pick-list').toggleClass('d-none');
    } else {
      $('.pick-menu').addClass('d-none');
      $('#modifier-dropdown').addClass('d-none');
    }

    if (actionsDropdown === false) {
      $('.actions-dropdown').addClass('d-none');
    }

    if (dataTargetId === 'modifier-dropdown') {
      $('#modifier-dropdown ul li').sort(ascendingSort).appendTo('#modifier-dropdown ul');
    }
  });

  $(document).on('click', '.remove-pick-item', function () {
    $(this).parent().remove();
  });

  $(document).on('click', '.remove-ranger', function () {
    $(this).parent().parent().parent()
      .parent()
      .find('.add-more-week')
      .css('color', '#f58025');
    const rangerID = `#${$(this).data('ranger-id')}`;
    $(rangerID).remove();
  });

  $(document).on('click', '.dz-remove', function () {
    $(this).parent().remove();
  });

  $(document).on('click', '.dz-setting', function () {
    const NODE = $(this).parent();
    NODE.find('.dz-setting .pre-img.active').removeClass('active');
    $(this).find('.pre-img').addClass('active');
  });

  $(document).on('click', '.toast-close', function () {
    const toast = `#${$(this).parent().attr('id')}`;
    $(toast).toast('hide');
  });

  $(document).on('click', '.pick-item', function () {
    const group = $(this).data('group');
    const id = $(this).data('id');
    const name = $(this).data('name');
    const LIST = `.${group}-chips`;
    const chipID = `chip-${id}`;

    if ($(`#${chipID}`).length === 0) {
      $(LIST).append(`
        <div class="md-chips" data-id="${id}" id="${chipID}">
          <span>${name}</span>
          <img src="src/images/icon-close-white.svg" class="remove-pick-item">
        </div>
      `);
    }

    $(`#${group}`).addClass('d-none');
  });

  $(document).on('click', '.mdo-pick-list', function () {
    const id = $(this).data('id');
    const name = $(this).data('name');
    const chipID = `chip-${id}`;
    const formID = $(this).closest('.mgo-form').attr('id');

    if ($(this).closest('.add-textfield').find(`#${chipID}`).length === 0) {
      $(this).closest('.add-textfield').find('.list-chips').append(`
        <div class="md-chips" data-id="${id}" id="${chipID}">
          <span>${name}</span>
          <img src="src/images/icon-close-white.svg" class="remove-pick-item" data-form-id="${formID}">
        </div>
      `);
    }

    $(this).closest('.add-textfield').find('.pick-list').addClass('d-none');
  });

  if ($('.magnific-popup-view').length > 0) {
    $('.magnific-popup-view').magnificPopup({
      delegate: '.magnific',
      type: 'image',
      closeOnContentClick: true,
      closeBtnInside: false,
      fixedContentPos: true,
      image: {
        verticalFit: true,
      },
      zoom: {
        enabled: true,
        duration: 300,
      },
      callbacks: {
        elementParse(item) {
          item.src = item.el.attr('src');
        },
      },
    });
  }
});
/* popup */

// modal scroll issue, when open modal in modal
$('.modal')
  .on('hidden.bs.modal', () => {
    if ($('.modal:visible').length) {
      $('.modal-backdrop')
        .first()
        .css(
          'z-index',
          parseInt($('.modal:visible').last().css('z-index')) - 10,
        );
      $('body').addClass('modal-open');
    }
  })

  .on('show.bs.modal', function () {
    if ($('.modal:visible').length) {
      $('.modal-backdrop.in')
        .first()
        .css(
          'z-index',
          parseInt($('.modal:visible').last().css('z-index')) + 10,
        );
      $(this).css(
        'z-index',
        parseInt($('.modal-backdrop.in').first().css('z-index')) + 10,
      );
    }
  });
