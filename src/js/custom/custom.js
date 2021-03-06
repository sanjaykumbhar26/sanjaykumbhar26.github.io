function onHistory(url) {
  $(window.location).attr('href', url);
}

function getStorage(key) {
  return localStorage.getItem(key) || null;
}

function setStorage(key, value) {
  localStorage.setItem(key, value);
}

function applyTemplate() {
  if ($('.md-storefront-template').length === 0) {
    return;
  }
  $('.md-storefront-template ul').html(`
    <li id="preview-1"><img src="src/images/preview-1.png"></li>
    <li id="preview-2"><img src="src/images/preview-2.png"></li>
    <li id="preview-3"><img src="src/images/preview-3.png"></li>
    <li id="preview-4"><img src="src/images/preview-4.png"></li>
  `);
  $('.md-preview, .back-to-default').addClass('d-none');
  const id = getStorage('md-preview-id') || 'preview-1';
  const preview = `src/images/${id}.png`;
  $(`#${id}`).addClass('active').html(`<img src="${preview}"><span class="check-mark"><img src="src/images/icon-check-mark.svg"></span>`);
  $(`.${id}`).removeClass('d-none');
}

$(document).ready(() => {
  applyTemplate();

  $(document).on('click', '.edit-storefront, .view-laptop', () => {
    onHistory('customize-default-view.html');
  });

  $(document).on('click', '.view-mobile', () => {
    onHistory('customize-default-view-mobile.html');
  });

  $(document).on('click', '.view-applied-mobile', () => {
    onHistory('customize-style-mobile.html');
  });

  $(document).on('click', '.view-applied-laptop', () => {
    onHistory('customize-template-applied.html');
  });

  $(document).on('click', '.customize-templates-name', () => {
    $('.customize-templates-list').removeClass('d-none');
  });

  $(document).on('click', '.customize-templates-list ul li', function click() {
    const option = $(this).text();
    $('.customize-templates-name span').text(option);
    $('.customize-templates-list').addClass('d-none');
  });

  $(document).on('click', '.storefront-template ul li', function click() {
    const id = $(this).attr('id');
    setStorage('preview-id', id);
    $('.back-to-default').removeClass('d-none');
  });

  $(document).on('click', '.apply-template', () => {
    setStorage('md-preview-id', getStorage('preview-id'));
    applyTemplate();
  });

  $(document).on('click', '.default-apply-template', () => {
    setStorage('md-preview-id', getStorage('preview-id'));
    onHistory('customize-template-applied.html');
  });

  $(document).on('click', '#publish-changes', () => {
    onHistory('overview-template-applied.html');
  });

  $(document).on('click', '#edit-storefront-applied', () => {
    onHistory('customize-template-applied.html');
  });
});
