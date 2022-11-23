/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable func-names */
/* eslint-disable no-tabs */
/* eslint-disable no-use-before-define */
/* global _, Sortable, moment */
// basic utils - start

const DEFAULT_TIME = 1610562600;
let exportMenuStatus = 0;
var oaiMenus;
var viewGrid;
var viewList;
var categoryItemsDND;
var mdOptionsBody;
var overviewDocument;
let menuPage = 1;
var navigationLink;
var navigationModal;
var unSavedPage = false;

// Overview Pagination Settings
const MENUS_PER_PAGE = 3;
const CATEGORIES_PER_PAGE__GRID = 10;
const CATEGORIES_PER_PAGE__LIST = 10;
const ITEMS_PER_PAGE__GRID = 11;
const ITEMS_PER_PAGE__LIST = 11;
const MORE_ITEMS__GRID = 2;
const MORE_ITEMS__LIST = 3;

function uuidv4() {
  const l = 10;
  const date = Date.now();
  const extra = Math.floor((10 ** l - 1) + Math.random() * 9 * (10 ** l - 1));
  return date + extra;
}

function capitalize(s) {
  if (typeof s !== 'string') {
    return '';
  }
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function onHistory(url) {
  $(window.location).attr('href', url);
}

function getSession(key) {
  return sessionStorage.getItem(key) || null;
}

function setSession(key, value) {
  sessionStorage.setItem(key, value);
}

function removeSession(key) {
  sessionStorage.removeItem(key);
}

function removeFalsy(obj) {
  const newObj = {};
  Object.keys(obj).forEach((prop) => {
    if (obj[prop]) {
      newObj[prop] = obj[prop];
    }
  });
  return newObj;
}

function getSortableIDs(data) {
  const ids = [];
  if (!_.isEmpty(data)) {
    const content = data[0] || [];
    content.forEach(({
      id,
    }) => {
      ids.push(id);
    });
  }
  return ids;
}

function getSortableMDOptionsIDs(data) {
  const context = {};
  if (!_.isEmpty(data)) {
    data.forEach((option) => {
      if (option && option.length) {
        option.forEach(({
          optionId,
          mdId,
        }) => {
          if (context[parseInt(mdId, 10)] && context[parseInt(mdId, 10)].length > 0) {
            context[parseInt(mdId, 10)].push(optionId);
          } else {
            context[parseInt(mdId, 10)] = [optionId];
          }
        });
      }
    });
  }
  return context;
}

function getSortableMenuCategoryIDs(data) {
  const context = {};
  if (!_.isEmpty(data)) {
    data.forEach((menuCategory) => {
      if (menuCategory && menuCategory.length) {
        menuCategory.forEach(({
          menuId,
          id,
        }) => {
          if (context[parseInt(menuId, 10)] && context[parseInt(menuId, 10)].length > 0) {
            context[parseInt(menuId, 10)].push(id);
          } else {
            context[parseInt(menuId, 10)] = [id];
          }
        });
      }
    });
  }
  return context;
}

function getSortableMenuCategoryItemIDs(data) {
  const context = {};
  if (!_.isEmpty(data)) {
    data.forEach((category) => {
      if (category && category.length) {
        category.forEach(({
          categoryId,
          id,
        }) => {
          if (context[parseInt(categoryId, 10)] && context[parseInt(categoryId, 10)].length > 0) {
            context[parseInt(categoryId, 10)].push(id);
          } else {
            context[parseInt(categoryId, 10)] = [id];
          }
        });
      }
    });
  }
  return context;
}

function mapOrder(collection, order) {
  collection.sort((a, b) => {
    if (order.indexOf(a.id) > order.indexOf(b.id)) {
      return 1;
    }
    return -1;
  });

  return collection;
}

function showOnStorefront(group) {
  $(group).find('.md-day-range, .md-date-range, .md-day-time-range').addClass('d-none');
}

function onWeekdayRadioButton(el) {
  const option = $(el).val();
  const group = `.${$(el).data('group')}`;
  showOnStorefront(group);
  switch (option) {
    case 'Specific days and times':
      $(group).find('.md-day-range, .md-day-time-range').removeClass('d-none');
      break;

    case 'Specific date':
      $(group).find('.md-date-range, .md-day-time-range').removeClass('d-none');
      break;

    default:
      break;
  }
}

function updateRadioButton(name, value, status = true, group = true) {
  const radio = $(`input:radio[name="${name}"]`).filter(`[value="${value}"]`);
  radio.prop('checked', status);

  if (group) {
    onWeekdayRadioButton(radio);
  }
}

function loadCategories() {
  const categories = localStorage.getItem('categories');
  if (!_.isEmpty(categories)) {
    return JSON.parse(categories);
  }
  return [];
}

function loadCategory(id) {
  const categories = loadCategories();
  return categories.find((c) => parseInt(c.id, 10) === parseInt(id, 10));
}

function saveCategory(form = {}) {
  const defaultCategory = {
    id: uuidv4(),
    categoryName: 'Salads',
    categoryDescription: 'Salads',
    numberOfSizes: '1',
    sizeNames: 'One size',
    categoryDropzone: 'src/images/generic-item.jpg',
    storefront: 'Yes',
  };
  const category = {
    ...defaultCategory,
    ...removeFalsy(form),
  };
  const categories = loadCategories();
  const {
    id,
  } = category;
  const content = categories.filter((c) => parseInt(c.id, 10) !== parseInt(id, 10));
  content.unshift(category);
  const addItemPageInEdit = getSession('add_Item_InEdit') || null;
  if (addItemPageInEdit) {
    let addItemDetails = localStorage.getItem('add_item_sessionstorage');

    addItemDetails = JSON.parse(addItemDetails);

    if (addItemDetails.categories.includes(category.id) === false) {
      addItemDetails.categories.unshift(category.id);
    }

    localStorage.setItem('add_item_sessionstorage', JSON.stringify(addItemDetails));
  }
  try {
    localStorage.setItem('categories', JSON.stringify(content));
  } catch (error) {
    alert('Data wasn\'t successfully saved due to browser local storage quota exceeded');
  }
}

function lockUnlockCategory(id) {
  const category = loadCategory(id);
  category.isLocked = !category.isLocked;
  saveCategory(category);
}

function deleteCategory(id) {
  const categories = loadCategories();
  const content = categories.filter((c) => parseInt(c.id, 10) !== parseInt(id, 10));
  localStorage.setItem('categories', JSON.stringify(content));
}

function makeWeekdaysLabel(isAvailableAllWeek, weekdays = []) {
  let weekdaysLabel = '';
  if (isAvailableAllWeek) {
    weekdaysLabel = 'every day';
  } else {
    weekdaysLabel = weekdays.join(', ');
  }
  return weekdaysLabel;
}

function makeWeekdaysHour(businessHour) {
  if (businessHour) {
    const {
      weekdays,
      isAvailableAllWeek,
      fromHour,
      fromMinute,
      fromMeridiem,
      toHour,
      toMinute,
      toMeridiem,
    } = businessHour;
    const weekdaysLabel = makeWeekdaysLabel(isAvailableAllWeek, weekdays);
    return `${weekdaysLabel} ${fromHour}:${fromMinute} ${fromMeridiem} - ${toHour}:${toMinute} ${toMeridiem}`;
  }
  return 'every day 9:00 am – 10:00 pm';
}

function makeWeekdays(businessHoursType, businessHours = []) {
  if (businessHoursType === 'different' && businessHours && businessHours.length) {
    return makeWeekdaysHour(businessHours[0]);
  }
  return 'every day 9:00 am – 10:00 pm';
}

function loadItems() {
  const items = localStorage.getItem('items');
  if (!_.isEmpty(items)) {
    return JSON.parse(items);
  }
  return [];
}

function loadItem(id) {
  const items = loadItems();
  return items.find((i) => parseInt(i.id, 10) === parseInt(id, 10));
}

function deleteItem(id) {
  const items = loadItems();
  const content = items.filter((i) => parseInt(i.id, 10) !== parseInt(id, 10));
  localStorage.setItem('items', JSON.stringify(content));
}

function saveItem(form = {}) {
  const defaultItem = {
    id: uuidv4(),
    itemName: 'House Salad',
    itemDescription: 'Black bean patty made fresh to order.',
    itemPrice: '12.00',
    itemPosId: '275765',
    minimumPerOrder: '1',
    maximumPerOrder: '3',
    storefront: 'always',
    itemAvailable: 'always',
    lavuPosSync: 'lavu-pos',
    thumbnail: 'src/images/img-salad-1.png',
    isMultipleOptions: false,
    isLeaveNotes: false,
    isMakeUpsell: false,
    isSpecialOffer: false,
    isLocked: false,
    menus: [],
    categories: [],
    thumbnails: [],
    weekdateAvailable: [],
    weekdateStorefront: [],
    weekdayAvailable: [],
    weekdayStorefront: [],
  };
  const item = {
    ...defaultItem,
    ...removeFalsy(form),
  };
  const items = loadItems();
  const {
    id,
  } = item;

  const content = items.filter((i) => parseInt(i.id, 10) !== parseInt(id, 10));
  content.unshift(item);

  try {
    localStorage.setItem('items', JSON.stringify(content));
    setSession('items', JSON.stringify(content));
  } catch (error) {
    alert('Data wasn\'t successfully saved due to browser local storage quota exceeded');
  }
  return item;
}

function lockUnlockItem(id) {
  const item = loadItem(id) || {};
  item.isLocked = !item.isLocked;
  saveItem(item);
}

function makeCategoryItems(categories = []) {
  const content = {};
  $.each(categories, (_, categoryId) => {
    const category = loadCategory(categoryId);
    if (category) {
      const {
        categoryName,
      } = category;
      const categoryItemsIDs = category.items || [];
      const categoryItems = [];
      categoryItemsIDs.forEach((categoryItemsID) => {
        const item = loadItem(categoryItemsID);
        if (item) {
          categoryItems.push(item);
        }
      });
      content[parseInt(categoryId, 10)] = {
        categoryName,
        categoryItems,
      };
    }
  });
  return content;
}

function makeCategoriesWithItems(categories = []) {
  if (!_.isEmpty(categories)) {
    return makeCategoryItems(categories);
  }
  return {};
}

function sizeValue(size) {
  if (size === 'None') {
    return 0;
  }
  return '';
}

function sizeStatus(size) {
  if (size === 'None') {
    return 'disabled';
  }
  return '';
}

function getChips(container) {
  const chips = [];
  $(container).each(function () {
    chips.push($(this).data('id'));
  });
  return chips;
}

function toAmount(amount = 0.00) {
  const value = parseFloat(amount);
  if (typeof value === 'number') {
    return value.toFixed(2);
  }
  return value;
}

function makeOptions(option) {
  let content = [];
  if (option) {
    const {
      id, modifierOptionName, modifierOptionPrice, thumbnail, sizes,
    } = option;
    if (sizes && sizes.length) {
      sizes.forEach((size) => {
        const sizeName = Object.keys(size)[0];
        const { price } = size[sizeName];

        content.push({
          optionID: id,
          modifierOptionName,
          sizeName,
          price: toAmount(price),
          thumbnail,
        });
      });

      content = _.groupBy(content, 'price');
    } else {
      content.push({
        optionID: id,
        modifierOptionName,
        price: modifierOptionPrice,
        thumbnail,
      });
    }
  }
  return content;
}

function loadModifierGroups() {
  const modifierGroups = localStorage.getItem('modifierGroups');
  if (modifierGroups) {
    return JSON.parse(modifierGroups);
  }
  return [];
}

function basicItemCustomization(modifierGroups = [], checkboxID) {
  let content = '';
  if (!_.isEmpty(modifierGroups)) {
    $.each(modifierGroups, (_, {
      id,
      modifierGroupName,
    }) => {
      const mgID = `item-customization-${id}-${checkboxID}`;
      content += `<li class="pick-modifier-item-customization" data-dropdown="pick-modifier-list-${checkboxID}" data-target="${mgID}" data-value="${id}">${modifierGroupName}</li>`;
    });
  }

  return `<tr>
    <td>
      <div class="add-textfield">
        <div class="textfield-search">
          <input type="text" placeholder="Add modifier group">
          <!--<img alt="search" class="search-icon" src="src/images/icn-search-m.svg">--->
          <img alt="search" class="dropdown-icon md-toggle" data-target="pick-modifier-list-${checkboxID}"
            src="src/images/icon-dropdown.svg">
        </div>
        <div class="pick-menu d-none" id="pick-modifier-list-${checkboxID}">
          <h2>Pick Modifier Group</h2>
          <ul>${content}</ul>
          <button class="md-btn-primary border-radius-4 add-modifier-group" type="button">+ Create Modifier Group</button>
        </div>
      </div>
    </td>
  </tr>`;
}

function makeCustomizationRow(mgID, modifierGroupName, id, options = []) {
  let content = '';

  if (options && options.length) {
    options.forEach((option) => {
      const groups = makeOptions(option);
      Object.keys(groups).forEach((group) => {
        content += `
          <div class="md-modifier-group-value">
            <div class="md-option-list modifier-group-item">
        `;
        const groupOptions = groups[group];
        if (groupOptions && groupOptions.length > 0) {
          groupOptions.forEach((groupOption) => {
            const { modifierOptionName, thumbnail, sizeName } = groupOption;
            content += `
              <div class="md-chip-option" data-price="${group}">
                <span class="chip-images">
                  <img alt="option" src="${thumbnail}" />
                </span>
                <div class="chip-name-image">
                  <span>${modifierOptionName}</span>
                  <span class="size-label-name">${sizeName}</span>
                </div>
              </div>
              </div>
              <div class="modifier-group-item">
                <div class="md-option-price">
                  <ul><li>$${group}</li></ul>
                </div>
              </div>
            </div>
            `;
          });
        } else {
          const { modifierOptionName, thumbnail, price } = groupOptions;
          content += `
              <div class="md-chip-option" data-price="${group}">
                <span class="chip-images">
                  <img alt="option" src="${thumbnail}" />
                </span>
                <div class="chip-name-image">
                  <span>${modifierOptionName}</span>
                </div>
              </div>
              </div>
              <div class="modifier-group-item">
                <div class="md-option-price">
                  <ul><li>$${price}</li></ul>
                </div>
              </div>
            </div>
            `;
        }
        // content += `
        //     </div>
        //     <div class="modifier-group-item">
        //       <div class="md-option-price">
        //         <ul><li>$${group}</li></ul>
        //       </div>
        //     </div>
        //   </div>
        // `;
      });
    });
  }

  return `<tr id="${mgID}" class="d-none mdg-item-customization" data-id="${id}">
    <td>
      <div class="modifier-group-item">
        <div class="modifier-label modifier-group-item">
          <span class="close-btn pick-modifier-item-customization-close" data-target="${mgID}">
            <img alt="close" src="src/images/icon-close.svg">
          </span>
          <span class="label">${modifierGroupName}</span>
          <span class="edit edit-modifier-group" data-id="${id}">Edit</span>
        </div>
      </div>
    </td>
    <td>
      ${content}
    </td>
  </tr>`;
}

function makeItemCustomization(modifierGroups = [], checkboxID) {
  let content = '';
  $.each(modifierGroups, (_, {
    id,
    modifierGroupName,
    options,
  }) => {
    const mgID = `item-customization-${id}-${checkboxID}`;
    content += makeCustomizationRow(mgID, modifierGroupName, id, options);
  });
  return content;
}

function displayItemCustomization(checkboxID) {
  const defaultModifierGroups = [{
    id: uuidv4(),
    modifierGroupName: 'Salad Dressing',
  },
  {
    id: uuidv4(),
    modifierGroupName: 'Modifier group name',
  },
  ];
  const modifierGroups = loadModifierGroups();
  const node = `#item-customization-${checkboxID}`;
  let content = '';
  if (!_.isEmpty(modifierGroups)) {
    content += basicItemCustomization(modifierGroups, checkboxID);
    content += makeItemCustomization(modifierGroups, checkboxID);
  } else {
    content += basicItemCustomization(defaultModifierGroups, checkboxID);
    content += makeItemCustomization(defaultModifierGroups, checkboxID);
  }
  $(node).html(content);
}

function makeCategotySizes(sizes = [], categoryName, categoryClass, section = '#price-per-category-section') {
  $(section).append(`<p class="font-size-16 ${categoryClass} font-semibold">${categoryName}</p>`);
  if (sizes && sizes.length) {
    sizes.forEach((size) => {
      const valueID = categoryName.toLowerCase().replace(/\s+/g, '');
      const value = size.toLowerCase().replace(/\s+/g, '');
      const sizeID = `price-par-size-${value}-${valueID}`;
      const inputID = `item-price--${value}-${valueID}`;
      const posID = `item-pos-id--${value}-${valueID}`;
      const disabled = sizeStatus(size);
      const disabledClass = sizeStatus(size);
      const checkboxID = `${value}-${valueID}`;

      $(section).append(`
        <div class="md-price-par-size" data-checkboxID="${checkboxID}" id="${sizeID}" data-size="${size}">
          <div class="per-category-size-row price-par-size">
            <div class="md-price-pos-size">${size}</div>
            <div class="md-price-pos">
              <div class="md-price-block md-form-group">
                <h2>Price</h2>
                <div class="price-tag">
                  <div class="price">$</div>
                  <input type="text" class="md-form-field md-input md-form-input ${disabledClass}" value="${sizeValue(size)}" id="${inputID}" ${disabled}>
                </div>
                <div class="error">Can't be empty</div>
              </div>
              <div class="md-pos-block">
                <div class="tool-tip-div">
                  <p class="pos-label">Size POS ID</p>
                  <div class="tool-wrap">
                    <div class="tool-parent">
                      <img src="./src/images/icon-info-lightgrey.svg">
                      <div class="tool-show-wrap">
                        <div class="tool-show">
                          <p>Required only if you are integrating MenuDrive with a POS system. The Size POS ID is the Name or ID of the item size on the POS system.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="pos-tag">
                  <input type="text" class="md-pos" placeholder="275765" id="${posID}">
                </div>

                <p class="pos-tag-label">Edit this field only if you have a POS integration, the Size POS ID should match the Size Name of the Item in your POS.</p>
              </div>
            </div>
          </div>
          <div class="form-group md-checkbox margin-top-30 margin-bottom-70">
            <input class="modifier-group-checkbox" type="checkbox" id="is-item-customization-${checkboxID}" data-id="${checkboxID}" value="checkbox">
            <span class="md-checkbox-icon"></span>
            <label for="checkbox" class="margin-left-15 padding-left-15 padding-right-15">
              This item has multiple options like sides, toppings, or dressings
            </label>
          </div>
          <div class="modifier-group-table table-responsive d-none" id="item-customization-zone-${checkboxID}">
            <h2>Item Customization</h2>
            <table>
              <thead>
                <tr>
                  <th class="modifier-group">MODIFIER GROUP</th>
                  <th class="option">
                    <div class="md-label-customization">
                      <span>OPTIONS</span><span>price</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody id="item-customization-${checkboxID}"></tbody>
            </table>
          </div>
        </div>
      `);
      displayItemCustomization(checkboxID);
    });
  } else {
    const value = categoryName.toLowerCase().replace(/\s+/g, '');
    const size = 'size 1:';
    const sizeID = `price-par-size-1-${value}`;
    const inputID = `item-price--1-${value}`;
    const posID = `item-pos-id--1-${value}`;
    const checkboxID = `1-${value}`;

    $(section).append(`
      <div class="md-price-par-size" data-checkboxID="${checkboxID}" id="${sizeID}" data-size="size-1">
        <div class="per-category-size-row price-par-size">
          <div class="md-price-pos-size">${size}</div>
          <div class="md-price-pos">
            <div class="md-price-block md-form-group">
              <h2>Price</h2>
              <div class="price-tag">
                <div class="price">$</div>
                <input type="text" class="md-form-field md-input md-form-input" value="${sizeValue(size)}" id="${inputID}" />
              </div>
              <div class="error">Can't be empty</div>
            </div>
            <div class="md-pos-block">
              <div class="tool-tip-div">
                <p class="pos-label">POS ID</p>
                <div class="tool-wrap">
                  <div class="tool-parent">
                    <img src="./src/images/icon-info-lightgrey.svg">
                    <div class="tool-show-wrap">
                      <div class="tool-show">
                        <p>If you use Lavu POS, you can choose where you want to edit your items.</p>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
            <div class="pos-tag">
              <input type="text" class="md-pos" placeholder="275765" id="${posID}">
            </div>
          </div>
        </div>
        </div>
        <div class="form-group md-checkbox margin-top-30 margin-bottom-70">
          <input class="modifier-group-checkbox" type="checkbox" id="is-item-customization-${checkboxID}" data-id="${checkboxID}" value="checkbox">
          <span class="md-checkbox-icon"></span>
          <label for="checkbox" class="margin-left-15 padding-left-15 padding-right-15">
            This item has multiple options like sides, toppings, or dressings
          </label>
        </div>
        <div class="modifier-group-table table-responsive d-none" id="item-customization-zone-${checkboxID}">
          <h2>Item Customization</h2>
          <table>
            <thead>
              <tr>
                <th class="modifier-group">MODIFIER GROUP</th>
                <th class="option">
                  <div class="md-label-customization">
                    <span>OPTIONS</span><span>price</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody id="item-customization-${checkboxID}"></tbody>
          </table>
        </div>
      </div>
    `);
    displayItemCustomization(checkboxID);
  }
}

// function makeCategotySizeForm(sizes = {}, section = '#price-per-category-section') {
//   if (sizes && sizes.length) {
//     const categories = getChips('.pick-categories-list-chips .md-chips');
//     categories.forEach((categoryID) => {
//       const category = loadCategory(categoryID);
//       if (category.sizes.length > 1) {
//         $('#pick-category-div').removeClass('d-none');
//       }
//     });
//     $(section).empty();
//     sizes.forEach((size) => {
//       const sizeName = Object.keys(size)[0];
//       const { price, posID } = size[sizeName];
//       const value = sizeName.toLowerCase().replace(/\s+/g, '');
//       const sizeID = `price-par-size-${value}`;
//       const inputID = `item-price--${value}`;
//       const posInputID = `item-pos-id--${value}`;
//       const checkboxID = `${value}`;

//       if ($(`#${sizeID}`).length === 0) {
//         $(section).append(`
//           <div class="per-category-size-row price-par-size" data-checkboxID="${checkboxID}" id="${sizeID}" data-size="${sizeName}">
//             <div class="md-price-pos-size">
//               ${sizeName}
//             </div>
//             <div class="md-price-pos">
//               <div class="md-price-block md-form-group">
//                 <h2>Price</h2>
//                 <div class="price-tag">
//                   <div class="price">$</div>
//                   <input type="text" class="md-form-field md-input md-form-input" id="${inputID}" value="${price}">
//                 </div>
//                 <div class="error">Can't be empty</div>
//               </div>
//               <div class="md-pos-block">
//               <div class="tool-tip-div">
//               <p class="pos-label">POS ID</p>
//               <div class="tool-wrap">
//                 <div class="tool-parent">
//                    <img src="./src/images/icon-info-lightgrey.svg">
//                    <div class="tool-show-wrap">
//                       <div class="tool-show">
//                          <p>If you use Lavu POS, you can choose where you want to edit your items.
//                          </p>
//                       </div>
//                    </div>
//                 </div>
//              </div>
//             </div>
//                 <div class="pos-tag">
//                   <input type="text" class="md-pos" placeholder="275765" value="${posID}" id="${posInputID}">
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div class="form-group md-checkbox margin-top-30 margin-bottom-70">
//             <input class="modifier-group-checkbox" type="checkbox" id="is-item-customization-${checkboxID}" data-id="${checkboxID}" value="checkbox">
//                         <span class="md-checkbox-icon"></span>
//                         <label for="checkbox" class="margin-left-15 padding-left-15 padding-right-15">
//                           This item has multiple options like sides, toppings, or dressings
//                         </label>
//             </div>
//           <div class="modifier-group-table table-responsive d-none" id="item-customization-zone-${checkboxID}">
//           <h2>Item Customization</h2>
//           <table>
//             <thead>
//               <tr>
//                 <th class="modifier-group">MODIFIER GROUP</th>
//                 <th class="option"><div class="md-label-customization"><span>OPTIONS</span><span>price</span></div></th>
//               </tr>
//             </thead>
//             <tbody id="item-customization-${checkboxID}"></tbody>
//           </table>
//         </div>
//         `);
//         displayItemCustomization(checkboxID);
//       }
//     });
//   }
// }

function withModifierGroupCheckbox(el) {
  const tableID = $(el).data('id');
  $(`#item-customization-zone-${tableID}`).toggleClass('d-none', !$(el).is(':checked'));
}

function makeCategotySizeFormEditPage(
  sizes = [],
  categoryName = '',
  section = '#price-per-category-section-editpage',
) {
  if (sizes && sizes.length) {
    const category = loadCategory(categoryName);
    if (category.sizes.length > 1) {
      $('#pick-category-div').removeClass('d-none');
    }
    $(section).empty();

    sizes.forEach((size) => {
      const sizeName = Object.keys(size)[0];
      const {
        price,
        posID,
        checkBoxValue,
        modifierGroups,
      } = size[sizeName];
      const value = sizeName.toLowerCase().replace(/\s+/g, '');
      const sizeID = `price-par-size-${value}-${categoryName}`;
      const inputID = `item-price--${value}-${categoryName}`;
      const posInputID = `item-pos-id--${value}-${categoryName}`;
      const checkboxID = `${value}-${categoryName}`;
      const checked = checkBoxValue ? 'checked' : '';

      if ($(`#${sizeID}`).length === 0) {
        $(section).append(`
          <div class="md-price-par-size" data-checkboxID="${checkboxID}" id="${sizeID}" data-size="${sizeName}">
            <div class="per-category-size-row price-par-size">
              <div class="md-price-pos-size">
                ${sizeName}
              </div>
              <div class="md-price-pos">
                <div class="md-price-block md-form-group">
                  <h2>Price</h2>
                  <div class="price-tag">
                    <div class="price">$</div>
                    <input type="text" class="md-form-field md-input md-form-input" id="${inputID}" value="${price}">
                  </div>
                  <div class="error">Can't be empty</div>
                </div>
                <div class="md-pos-block">
                  <div class="tool-tip-div">
                    <p class="pos-label">Size POS ID</p>
                    <div class="tool-wrap">
                      <div class="tool-parent">
                        <img src="./src/images/icon-info-lightgrey.svg">
                        <div class="tool-show-wrap">
                          <div class="tool-show">
                            <p>Required only if you are integrating MenuDrive with a POS system. The Size POS ID is the Name or ID of the item size on the POS system.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="pos-tag">
                    <input type="text" class="md-pos" placeholder="275765" value="${posID}" id="${posInputID}">
                  </div>
                  <p class="pos-tag-label">Edit this field only if you have a POS integration, the Size POS ID should match the Size Name of the Item in your POS.</p>
                </div>
              </div>
            </div>
            <div class="form-group md-checkbox margin-top-30 margin-bottom-70">
              <input class="modifier-group-checkbox" type="checkbox" ${checked} id="is-item-customization-${checkboxID}" data-id="${checkboxID}" value="checkbox">
                <span class="md-checkbox-icon"></span>
                <label for="checkbox" class="margin-left-15 padding-left-15 padding-right-15">
                  This item has multiple options like sides, toppings, or dressings
                </label>
            </div>
            <div class="modifier-group-table table-responsive d-none" id="item-customization-zone-${checkboxID}">
              <h2>Item Customization</h2>
              <table>
                <thead>
                  <tr>
                    <th class="modifier-group">MODIFIER GROUP</th>
                    <th class="option">
                      <div class="md-label-customization">
                        <span>OPTIONS</span>
                        <span>price</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody id="item-customization-${checkboxID}"></tbody>
              </table>
            </div>
          </div>
        `);
        displayItemCustomization(checkboxID);

        if (checked) {
          withModifierGroupCheckbox(`item-customization-zone-${checkboxID}`);
        }
      }

      if (modifierGroups) {
        modifierGroups.forEach((modifierGroup) => {
          const modifierGroupID = `#item-customization-${modifierGroup}-${checkboxID}`;
          $(modifierGroupID).removeClass('d-none');
        });
      }
    });
  }
}

function makeCategotySizeModifierForm(sizes = {}, section = '') {
  if (sizes && sizes.length) {
    $(section).empty();
    sizes.forEach((size) => {
      const sizeName = Object.keys(size)[0];
      const { price, posID } = size[sizeName];
      const value = sizeName.toLowerCase().replace(/\s+/g, '');
      const sizeID = `price-par-size-${value}`;
      const inputID = `item-price--${value}`;
      const posInputID = `item-pos-id--${value}`;
      const disabled = sizeStatus(sizeName);
      const disabledClass = sizeStatus(sizeName);

      if ($(`#${sizeID}`).length === 0) {
        $(section).append(`
          <div class="md-price-par-size" id="${sizeID}" data-size="${sizeName}">
            <div class="per-category-size-row price-par-size">
              <div class="md-price-pos-size">
                ${sizeName}
              </div>
              <div class="md-price-pos">
                <div class="md-price-block md-form-group">
                  <h2>Price</h2>
                  <div class="price-tag">
                    <div class="price">$</div>
                    <input type="text" class="md-form-field md-input md-form-input ${disabledClass}" id="${inputID}" ${disabled} value="${price}">
                  </div>
                  <div class="error">Can't be empty</div>
                </div>
                <div class="md-pos-block">
                  <div class="tool-tip-div">
                    <p class="pos-label">POS ID</p>
                    <div class="tool-wrap">
                      <div class="tool-parent">
                        <img src="./src/images/icon-info-lightgrey.svg">
                        <div class="tool-show-wrap">
                          <div class="tool-show">
                            <p>If you use Lavu POS, you can choose where you want to edit your items.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="pos-tag">
                    <input type="text" class="md-pos" placeholder="275765" value="${posID}" id="${posInputID}">
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        `);
      }
    });
  }
}

function loadMenus() {
  const menus = localStorage.getItem('menus');
  if (!_.isEmpty(menus)) {
    return JSON.parse(menus);
  }
  return [];
}

function loadMenusByPage(page = 1) {
  const menus = loadMenus();
  return menus.slice(0, page * MENUS_PER_PAGE);
}

function pager(content = {}, end = 1) {
  return Object.fromEntries(Object.entries(content).slice(0, end));
}

function menuPager(content = [], end = 1) {
  return content.slice(0, end);
}

function loadMenu(id) {
  const menus = loadMenus();
  return menus.find((m) => parseInt(m.id, 10) === parseInt(id, 10));
}

function deleteMenu(id) {
  const menus = loadMenus();
  const content = menus.filter((m) => parseInt(m.id, 10) !== parseInt(id, 10));
  localStorage.setItem('menus', JSON.stringify(content));
}

function makeLockItemDialog(id, dialogID, actionID = 'item') {
  const actionLabel = actionID === 'modifier-group' ? 'modifier' : actionID;
  return `
		<span class="lock-status">
			<img src="./src/images/icon-lock.svg" data-dialog-id="${dialogID}" data-id="${id}" data-label="${actionLabel}" class="md-lock-unlock-status-tool" alt="lock">
			<div class="alert-error lock-unlock-dialog d-none" id="${dialogID}">
				<div class="error-body padding-left-15 padding-top-15 padding-bottom-15 padding-right-15">
					<div class="error-icon">
						<img alt="error" src="./src/images/icon-error.svg">
					</div>
					<div class="error-text margin-left-20">
						<h3 class="error-label">Unlock this item</h3>
						<p>If you unlock this ${actionLabel}, any updates will be reflected in MenuDrive only, not your
						POS. Please, make menu changes directly in your POS to have them reflected in both locations.</p>
					</div>
				</div>
				<div class="error-footer font-bold">
					<button class="error-close font-size-14 font-semibold close-lock-unlock-dialog" data-dialog-id="${dialogID}" type="button">Close</button>
					<button class="Unlock font-size-14 font-semibold md-lock-unlock-status-${actionID}" data-id="${id}" data-dialog-id="${dialogID}" type="button">Unlock</button>
				</div>
			</div>
    </span>
	`;
}

function makeUnlockItemDialog(id, dialogID, actionID = 'item') {
  const actionLabel = actionID === 'modifier-group' ? 'modifier' : actionID;

  return `
		<span class="lock-status">
			<img src="./src/images/icon-unlock.svg" data-dialog-id="${dialogID}" data-id="${id}" data-label="${actionLabel}" class="md-lock-unlock-status-tool" alt="unlock">
			<div class="alert-error lock-unlock-dialog d-none" id="${dialogID}">
				<div class="error-body padding-left-15 padding-top-15 padding-bottom-15 padding-right-15">
					<div class="error-icon">
						<img alt="error" src="./src/images/icon-error.svg">
					</div>
					<div class="error-text margin-left-20">
						<h3 class="error-label">Lock this item</h3>
						<p>If you lock this ${actionLabel}, any updates will be reflected in MenuDrive only, not your
						POS. Please, make menu changes directly in your POS to have them reflected in both locations.</p>
					</div>
				</div>
				<div class="error-footer font-bold">
					<button class="error-close font-size-14 font-semibold close-lock-unlock-dialog" data-dialog-id="${dialogID}" type="button">Close</button>
					<button class="Unlock font-size-14 font-semibold md-lock-unlock-status-${actionID}" data-id="${id}" data-dialog-id="${dialogID}" type="button">Lock</button>
				</div>
			</div>
		</span>
	`;
}

function makeMenuActions(isLocked, id, dialogID) {
  if (isLocked) {
    return `<div class="action"><ul><li>${makeLockItemDialog(id, dialogID, 'menu-item')}</li></ul></div>`;
  }
  return `
  <span data-id="actions-items-${id}" class="table-more-actions">...</span>
                            <div class="actions-dropdown d-none" id="actions-items-${id}">
                            <ul class="actions-dropdown-list">
                                <li>
                                  <a href="javascript:void(0)" data-id="${id}" class="edit-menu-item">
                                  Edit
                                </a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)" data-id="${id}" class="delete-menu-item">
                                  Delete
                                </a>
                                </li>
                            </ul>
                            </div>
  `;
}

function makePriceCloudList(itemPriceType, itemPrice, sizes = []) {
  let prices = '';
  if (itemPriceType === 'category' && sizes && sizes.length > 0) {
    const initPrices = [];
    const iSizes = [...sizes];
    const initData = iSizes.splice(0, MORE_ITEMS__LIST);
    initData.forEach((initPrice) => {
      const initKey = Object.keys(initPrice)[0];
      const { price: iPrice } = initPrice[initKey];
      initPrices.push(`${initKey} $${toAmount(iPrice)}`);
    });
    prices += `<span class="price">${initPrices.join(', ')}</span>`;
    const count = iSizes && iSizes.length;
    if (count) {
      let jPrice = '';
      const kPrices = [];
      iSizes.forEach((size) => {
        const key = Object.keys(size)[0];
        const { price } = size[key];
        kPrices.push(`${key} $${toAmount(price)}`);
      });
      jPrice = `<span class="price">${kPrices.join(', ')}</span>`;

      const apID = `price-list-${uuidv4()}`;
      prices += `<span data-toggle="collapse" data-target="#${apID}" data-parent="#oai-menus" class="more-price">+${count} More</span>
      <div class="collapse more-data" data-parent="#oai-menus" id="${apID}">${jPrice}</div></span>`;
    }
  } else {
    prices = `<span class="price">$${toAmount(itemPrice)}</span>`;
  }
  return prices;
}

function makeCategoryItemActions(
  isLocked,
  itemPrice,
  itemPriceType,
  sizes,
  categoryItemID,
  categoryDialogID,
  itemVisibleClass,
) {
  let actions;
  let status = '';
  const price = makePriceCloudList(itemPriceType, itemPrice, sizes);

  if (isLocked) {
    actions = `<div class="menu-grid-action">
		    <ul><li>${price}</li></ul>
	    </div>`;
    status = makeLockItemDialog(categoryItemID, categoryDialogID, 'menu-item');
  } else {
    actions = `<div class="menu-grid-action">
		    <ul>
		      <li class="${itemVisibleClass}">${price}</li>
		      <li>
          <span data-id="actions-items-list-${categoryItemID}" class="table-more-actions">...</span>
          <div class="actions-dropdown d-none" id="actions-items-list-${categoryItemID}">
          <ul class="actions-dropdown-list">
              <li>
                <a href="javascript:void(0)" data-id="${categoryItemID}" class="edit-menu-item">
                Edit
              </a>
              </li>
              <li>
                <a href="javascript:void(0)" data-id="${categoryItemID}" class="delete-menu-item">
                Delete
              </a>
              </li>
          </ul>
          </div>
		      </li>
		      
		    </ul>
	    </div>`;
    status = makeUnlockItemDialog(categoryItemID, categoryDialogID, 'menu-item');
  }

  return {
    actions,
    status,
  };
}

function makePriceCloudGrid(itemPriceType, itemPrice, sizes = []) {
  let prices = '';
  if (itemPriceType === 'category' && sizes && sizes.length > 0) {
    const iSizes = [...sizes];
    const initData = iSizes.splice(0, MORE_ITEMS__GRID);
    initData.forEach((initPrice) => {
      const initKey = Object.keys(initPrice)[0];
      const { price: iPrice } = initPrice[initKey];
      prices += `<span class="price">${initKey} $${toAmount(iPrice)}</span>`;
    });
    const count = iSizes && iSizes.length;
    if (count) {
      let jPrice = '';
      iSizes.forEach((size) => {
        const key = Object.keys(size)[0];
        const { price } = size[key];
        jPrice += `<span class="price">${key} $${toAmount(price)}</span>`;
      });

      const apID = `price-grid-${uuidv4()}`;
      prices += `<span data-toggle="collapse" data-target="#${apID}" class="more-price">+${count} More</span>
      <div class="collapse more-data" data-parent="#oai-menus" id="${apID}">${jPrice}</div></span>`;
    }
  } else {
    prices = `<span class="price">$${toAmount(itemPrice)}</span>`;
  }
  return prices;
}

function makeItemsGridView(
  categoryItems = [],
  menuID = '',
  menuContainerID = '',
  categoryID = '',
  paginate = false,
) {
  let content = '';
  let totalItems = 0;
  if (categoryItems) {
    totalItems = categoryItems.length;
  }

  const categoryContainerID = `#collapse-grid-accordion-${categoryID}`;
  const itemsIN = $(menuContainerID).find(categoryContainerID).find('.md-menu-item').length;
  let nextItems = itemsIN || ITEMS_PER_PAGE__GRID;
  if (paginate) {
    nextItems += ITEMS_PER_PAGE__GRID;
  }
  const itemsOUT = totalItems - nextItems;
  const isItems = totalItems > nextItems;
  const items = menuPager(categoryItems, nextItems);

  $.each(items, (_, categoryItem) => {
    const {
      id,
      isLocked,
      itemName,
      itemPrice,
      thumbnail,
      itemPriceType,
      sizes,
      storefront,
    } = categoryItem;
    const dialogID = `item-${id}`;
    const itemVisibleClass = storefront.toLowerCase() === 'never' ? 'fade-item' : '';
    const visibleText = storefront.toLowerCase() === 'never' ? 'visible-text' : 'd-none';
    const actions = makeMenuActions(isLocked, id, dialogID);
    const price = makePriceCloudGrid(itemPriceType, itemPrice, sizes);
    content += `
      <div class="col-md-4 md-menu-item">
	      <div class="item">
	        <div class="items-images ${itemVisibleClass}">
            <span></span>
            <img src="${thumbnail}" alt="${itemName}" />
          </div>
          <div class="items-name">
            <p class="${visibleText}">Not Visible on storefront</p>
	          <div class="${itemVisibleClass}">
              <span class="item-label">${itemName}</span>
	            ${price}
	          </div>
	          ${actions}
	        </div>
	      </div>
	    </div>`;
  });

  if (isItems) {
    content += `
      <div class="col-md-3">
        <div class="item">
          <div class="grid-more-btn">
            <button
              class="button-primary font-semibold font-size-14 border-radius-4 margin-left-15 more-item--grid"
              type="button"
              data-menu-id="${menuID}"
              data-category-id="${categoryID}"
            >
              <span>+</span> ${itemsOUT} More Item
            </button>
          </div>
        </div>
      </div>
    `;
  }

  return content;
}

function makeItemsListView(
  categoryItems = [],
  menuID = '',
  menuContainerID = '',
  categoryID = '',
  paginate = false,
) {
  let content = '';
  let totalItems = 0;
  if (categoryItems) {
    totalItems = categoryItems.length;
  }

  const categoryContainerID = `#collapse-list-accordion-${categoryID}`;
  const itemsIN = $(menuContainerID).find(categoryContainerID).find('.md-menu-item').length;
  let nextItems = itemsIN || ITEMS_PER_PAGE__LIST;
  if (paginate) {
    nextItems += ITEMS_PER_PAGE__LIST;
  }
  const itemsOUT = totalItems - nextItems;
  const isItems = totalItems > nextItems;
  const items = menuPager(categoryItems, nextItems);

  $.each(items, (_, categoryItem) => {
    const {
      id: categoryItemID,
      isLocked,
      itemName,
      itemPrice,
      itemPriceType,
      sizes,
      storefront,
    } = categoryItem;
    const itemVisibleClass = storefront.toLowerCase() === 'never' ? 'fade-item' : '';
    const visibleText = storefront.toLowerCase() === 'never' ? 'storefront-text' : 'd-none';
    const categoryDialogID = `category-${categoryID}-item-${categoryItemID}`;
    const {
      actions,
      status,
    } = makeCategoryItemActions(
      isLocked,
      itemPrice,
      itemPriceType,
      sizes,
      categoryItemID,
      categoryDialogID,
      itemVisibleClass,
    );

    content += `
      <div class="menu-grid-item menu-category-item md-menu-item" data-id="${categoryItemID}" data-category-id="${categoryID}">
	      <div class="menu-grid-item-info">
	        <div class="menu-grid-item-name ${itemVisibleClass}">
	          <img alt="up" class="menu-category-item-sort-handle" src="src/images/icon-menu-small.svg" />
            <span>${itemName}</span>
	          ${status}
          </div>
          <p class="${visibleText}">Not Visible on storefront</p>
	        ${actions}
	      </div>
	    </div>`;
  });

  if (isItems) {
    content += `
     <div class="more-btn">
        <button
          class="button-primary font-semibold font-size-14 border-radius-4 margin-left-15 margin-top-15 more-item--list"
          type="button"
          data-menu-id="${menuID}"
          data-category-id="${categoryID}"
        >
          <span>+</span>${itemsOUT} More Item
        </button>
      </div>
    `;
  }

  return content;
}

function makeMenuList(
  id,
  menuName,
  businessHours,
  collapseID,
  isShow,
  isCollapsed,
  viewOptionsGrid,
  viewOptionsList,
  viewOptionsID,
  menuContainerID,
) {
  return `
				<div class="card-large-text oai-menu" data-id="${id}" id="${menuContainerID}">
					<div class="card-large-text-header">
					  <div class="overview-nav-block">
						  <div class="overview-nav-left">
							  <ul>
								  <li>
								    <div class="overview-menu-label">
									    <img src="src/images/icon-menu.svg" class="sort-handle">
									    <span id="menu-name">${menuName}</span>
								    </div>
								  </li>
                  <div class="overview-subnav-left">
                   <ul>
    								  <li>
    								    <a href="#" class="edit-menu" data-id="${id}">
                          <img class="edit-blue" src="src/images/icon-edit-blue.svg">
                          <img class="edit-grey" src="src/images/icon-edit-grey.svg">
    								    </a>
    								  </li>
    								  <li>
    								    <a href="#" class="delete-menu" data-id="${id}">
    									    <img class="remove-red" src="src/images/icon-delete-red.svg">
    									    <img class="remove-grey" src="src/images/icon-delete-grey.svg">
    								    </a>
    								  </li>
                    </ul>
                  </div>
							  </ul>
							  <div class="menu-hours">Menu hours: ${makeWeekdays(businessHours)}</div>
						  </div>
						  <div class="overview-nav-right">
							  <ul>
								  <li>
								    <div class="on-off-block">
									    <label class="switch">
                        <input type="checkbox">
                        <span class="slider round">
                        <span class="switch-on font-normal">off</span></span>
									    </label>
									    <div class="label">Display this menu on storefront</div>
								   </div>
								  </li>
                  <div class="overview-subnav-right">
                   <ul>
  								  <li>
                      <div class="export-btn-block export-menu">
                        <img alt="export" src="src/images/icon-export.svg" />
                        <span>export menu</span>
                      </div>
                    </li>
                    <li>
                      <a class="dropdown-arrow ${isCollapsed}" data-toggle="collapse" href="#${collapseID}" aria-expanded="false" aria-controls="${collapseID}">
                        <img alt="down" class="down-arow" src="src/images/icon-down-arrow.svg" />
                        <img alt="up" class="up-arow" src="src/images/icon-up-arrow.svg" />
                      </a>
                    </li>
                  </ul>
                  </div>
							  </ul>
						  </div>
					  </div>
					</div>
					<div class="overview-menu-content menu-collapse collapse ${isShow}" id="${collapseID}">
					  <div class="overview-add-menu-items">
						  <div class="add-tems-header">
							  <div class="view-button">
                  <div class="box-view view-options ${viewOptionsGrid}" data-option="${viewOptionsID}" data-view="view-grid" data-menu="${menuContainerID}">
                    <img alt="grid" class="grid-active" src="src/images/icon-grid-view.svg" />
                    <img alt="grid" class="grid" src="src/images/icon-grid-view-black.svg" />
                  </div>
                  <div class="box-list view-options ${viewOptionsList}" data-option="${viewOptionsID}" data-view="view-list" data-menu="${menuContainerID}">
                    <img alt="list" class="list-active" src="src/images/icon-list-view.svg" />
                    <img alt="list" class="list" src="src/images/icon-list-view-black.svg" />
                  </div>
							  </div>
						  </div>
						  <div class="add-items">
							  <div class="plus-add-items" class="create-post">
								  <div class="add-itesm-menu-icon">
								    <img src="src/images/cafe.jpg">
								  </div>
								  <div class="add-itesm-menu-label add-item" data-id="${id}"><span>+ Add Item</span></div>
							 </div>
						  </div>
              `;
}

function makeCategoryGridView(
  menuCategoriesItems = {},
  id = '',
  menuID = '',
  paginate = false,
) {
  let content = '';
  let totalMenuCategories = 0;
  if (menuCategoriesItems) {
    totalMenuCategories = Object.keys(menuCategoriesItems).length;
  }

  const menuCategoriesIN = $(menuID).find('#view-grid').find('.md-category').length;
  let nextCategories = menuCategoriesIN || CATEGORIES_PER_PAGE__GRID;
  if (paginate) {
    nextCategories += CATEGORIES_PER_PAGE__GRID;
  }
  const menuCategoriesOUT = totalMenuCategories - nextCategories;
  const isCategories = totalMenuCategories > nextCategories;
  const menuCategories = pager(menuCategoriesItems, nextCategories);

  let i = 0;

  $.each(menuCategories, (menuCategoryID, menuCategoriesItem) => {
    const {
      categoryName,
    } = menuCategoriesItem;
    const categoryItems = menuCategoriesItem.categoryItems || [];
    const count = categoryItems.length || 0;
    const accordion = `grid-accordion-${menuCategoryID}`;
    const accordionID = `collapse-${accordion}`;
    let isShow = '';
    let isCollapsed = 'collapsed';

    if (i === 0 || $(`#${accordionID}`).hasClass('show')) {
      isShow = 'show';
      isCollapsed = '';
    }

    content += `
      <div class="menu-item md-category menu-category-view-grid" id="${accordion}" data-id="${menuCategoryID}" data-menu-id="${id}">
        <div class="menu-item-row">
          <div class="menu-list-header">
            <h2>
              <a href="javascript:void(0)" class="mcvg-sort-handle"><img src="src/images/icon-items-menu.svg"></a>
              <span>${categoryName}</span>
              <span class="samll-icon small-up-arrow">
                <a class="dropdown-arrow ${isCollapsed}" data-toggle="collapse" href="#${accordionID}">
                  <img alt="up" class="up-arow" src="src/images/icon-small-up-arrow.svg">
                  <img alt="down" class="down-arow" src="src/images/icon-small-down-arrow.svg">
                </a>
              </span>
            </h2>
            <div class="label">This category contains ${count} items</div>
          </div>
          <div class="item-added-list collapse ${isShow}" id="${accordionID}" data-parent="#${accordion}">
            <div class="row">
    `;
    content += makeItemsGridView(categoryItems, id, menuID, menuCategoryID);
    content += `
            </div>
          </div>
        </div>
      </div>
    `;

    i += 1;
  });

  if (isCategories) {
    content += `
    <div class="more-category">
      <button
        class="button-primary font-semibold font-size-14 border-radius-4 margin-left-15 more-category--grid"
        type="button"
        data-menu-id="${id}"
      >
        <span>+</span> ${menuCategoriesOUT} More Category
      </button>
    </div>
    `;
  }

  return content;
}

function makeCategoryListView(
  menuCategoriesItems = {},
  id = '',
  menuID = '',
  paginate = false,
) {
  let content = '';
  let totalMenuCategories = 0;
  let i = 0;
  if (menuCategoriesItems) {
    totalMenuCategories = Object.keys(menuCategoriesItems).length;
  }

  const menuCategoriesIN = $(menuID).find('#view-list').find('.md-category').length;
  let nextCategories = menuCategoriesIN || CATEGORIES_PER_PAGE__LIST;
  if (paginate) {
    nextCategories += CATEGORIES_PER_PAGE__LIST;
  }
  const menuCategoriesOUT = totalMenuCategories - nextCategories;
  const isCategories = totalMenuCategories > nextCategories;
  const menuCategories = pager(menuCategoriesItems, nextCategories);

  $.each(menuCategories, (menuCategoryID, menuCategoriesItem) => {
    const {
      categoryName,
    } = menuCategoriesItem;
    const categoryItems = menuCategoriesItem.categoryItems || [];
    const count = categoryItems.length || 0;
    const accordion = `list-accordion-${menuCategoryID}`;
    const accordionID = `collapse-${accordion}`;
    let isShow = '';
    let isCollapsed = 'collapsed';

    if (i === 0 || $(`#${accordionID}`).hasClass('show')) {
      isShow = 'show';
      isCollapsed = '';
    }

    content += `
      <div class="col-md-6 col-xs-12 menu-item md-category menu-category-view-list" id="${accordion}" data-id="${menuCategoryID}" data-menu-id="${id}">
        <div class="menu-grid-items-box">
          <div class="menu-grid-header">
            <h2>
              <a href="javascript:void(0)"><img class="mcvl-sort-handle" src="src/images/icon-items-menu.svg"></a>
              <span class="items-name">${categoryName}</span>
              <span class="samll-icon small-up-arrow">
                <a class="dropdown-arrow ${isCollapsed}" data-toggle="collapse" href="#${accordionID}">
                  <img alt="up" class="up-arow" src="src/images/icon-small-up-arrow.svg">
                  <img alt="down" class="down-arow" src="src/images/icon-small-down-arrow.svg">
                </a>
              </span>
            </h2>
            <div class="label">This category contains ${count} items</div>
          </div>
          <div class="menu-grid-items ${isShow} collapse menu-category-items" id="${accordionID}" data-parent="#${accordion}">
    `;

    content += makeItemsListView(categoryItems, id, menuID, menuCategoryID);

    content += `
          </div>
        </div>
      </div>
   `;
    i += 1;
  });

  if (isCategories) {
    content += `
    <div class="more-category">
      <button
        class="button-primary font-semibold font-size-14 border-radius-4 margin-left-15 more-category--list"
        type="button"
        data-menu-id="${id}"
      >
        <span>+</span> ${menuCategoriesOUT} More Category
      </button>
    </div>
    `;
  }

  return content;
}

function displayMenus(page, isMounted = false) {
  const SECTION = '#oai-menus';
  const menus = loadMenusByPage(page || menuPage);
  if (!_.isEmpty(menus)) {
    $('#overview-wrapper').removeClass('d-none');
    $('#empty-overview-wrapper').addClass('d-none');

    $.each(menus, (index, menu) => {
      const {
        id,
        menuName,
        businessHours,
        categories,
      } = menu;
      const menuID = `#menu-${id}`;

      const collapseID = `collapse-${index}`;
      const menuContainerID = `menu-${id}`;

      if ($(SECTION).find(`#${menuContainerID}`).length > 0) {
        return;
      }

      const menuCategoriesItems = makeCategoriesWithItems(categories);
      const viewOptionsID = `view-options-${id}`;
      const optionView = getSession(viewOptionsID);

      let content = '';
      let viewOptionsGrid = '';
      let viewOptionsList = '';
      let isShow = '';
      let isCollapsed = 'collapsed';

      if (optionView === 'view-list') {
        viewOptionsList = 'active';
      } else {
        viewOptionsGrid = 'active';
      }

      if (isMounted && index === 0) {
        isShow = 'show';
        isCollapsed = '';
      }

      content += makeMenuList(
        id,
        menuName,
        businessHours,
        collapseID,
        isShow,
        isCollapsed,
        viewOptionsGrid,
        viewOptionsList,
        viewOptionsID,
        menuContainerID,
      );

      content += '<div class="menu-item-list views menu-category-view-grids" id="view-grid">';

      content += makeCategoryGridView(menuCategoriesItems, id, menuID, false, isMounted);

      content += `
          </div>
        </div>
			`;
      content += `
        <div class="menu-grid views d-none" id="view-list">
          <div class="row menu-category-view-lists">
      `;

      content += makeCategoryListView(menuCategoriesItems, id, menuID, false, isMounted);

      content += `
						    </div>
						  </div>
					  </div>
				  </div>
			  </div>
			`;

      $(SECTION).append(content);
      $(`#${menuContainerID}`).find('.views').addClass('d-none');
      const menuContainerView = `#${$(`#${menuContainerID}`).find('.view-options.active').data('view')}`;
      $(`#${menuContainerID}`).find(menuContainerView).removeClass('d-none');
    });
  } else {
    $('#overview-wrapper').addClass('d-none');
    $('#empty-overview-wrapper').removeClass('d-none');
  }
}

function mapMeridiem(status) {
  if (status) {
    return 'PM';
  }
  return 'AM';
}

function addWeekdayPickers(index) {
  const SECTION = '.weekday-pickers';
  const pickerID = `weekday-picker-${index}`;
  const closeIcon = index !== 1 ? `<div class="picker-close"><img src="src/images/icon-remove.svg" class="remove-weekday-picker" data-picker-id="${pickerID}" /></div>` : '';

  $(SECTION).append(`
			<div class="weekday-picker" id="${pickerID}">
				<div class="week-day-picker">
					<div class="menu-week-day">
						<ul>
							<li class="week-days" id="weekday-monday" data-weekday="Monday">M</li>
							<li class="week-days" id="weekday-tuesday" data-weekday="Tuesday">TU</li>
							<li class="week-days" id="weekday-wednesday" data-weekday="Wednesday">W</li>
							<li class="week-days" id="weekday-thursday" data-weekday="Thursday">TH</li>
							<li class="week-days" id="weekday-friday" data-weekday="Friday">F</li>
							<li class="week-days" id="weekday-saturday" data-weekday="Saturday">SA</li>
							<li class="week-days" id="weekday-sunday" data-weekday="Sunday">SU</li>
						</ul>
					</div>
					<div class="menu-week-checkmark">
						<div class="form-group md-checkbox margin-bottom-40">
							<input type="checkbox" class="available-all-week" value="checkbox">
							<span class="md-checkbox-icon"></span>
							<label for="checkbox"
							class="margin-left-15 padding-left-15 padding-right-15">Available everyday?
							</label>
							<div class="time-error d-none">You've already selected this day and time. Please select another time(s).</div>
						</div>
					</div>
					<div class="menu-from-to">
						<div class="from-to-block">
							<label>From:</label>
							<div class="form-group-block">
								<div class="form-group select-white">
									<select class="selectpicker from-hour" title="00">
										<option>01</option>
										<option>02</option>
										<option>03</option>
										<option>04</option>
										<option>05</option>
										<option>06</option>
										<option>07</option>
										<option>08</option>
										<option>09</option>
										<option>10</option>
										<option>11</option>
										<option>12</option>
									</select>
								</div>
								<div class="form-group select-white">
									<select class="selectpicker from-minute" title="00">
										<option>01</option>
										<option>02</option>
										<option>03</option>
										<option>04</option>
										<option>05</option>
										<option>06</option>
										<option>07</option>
										<option>08</option>
										<option>09</option>
										<option>10</option>
										<option>11</option>
										<option>12</option>
										<option>13</option>
										<option>14</option>
										<option>15</option>
										<option>16</option>
										<option>17</option>
										<option>18</option>
										<option>19</option>
										<option>20</option>
										<option>21</option>
										<option>22</option>
										<option>23</option>
										<option>24</option>
										<option>25</option>
										<option>26</option>
										<option>27</option>
										<option>28</option>
										<option>29</option>
										<option>30</option>
										<option>31</option>
										<option>32</option>
										<option>33</option>
										<option>34</option>
										<option>35</option>
										<option>36</option>
										<option>37</option>
										<option>38</option>
										<option>39</option>
										<option>40</option>
										<option>41</option>
										<option>42</option>
										<option>43</option>
										<option>44</option>
										<option>45</option>
										<option>46</option>
										<option>47</option>
										<option>48</option>
										<option>49</option>
										<option>50</option>
										<option>51</option>
										<option>52</option>
										<option>53</option>
										<option>54</option>
										<option>56</option>
										<option>57</option>
										<option>58</option>
										<option>59</option>
										<option>60</option>
									</select>
								</div>
								<div class="form-toggle">
									<button type="button" class="btn btn-sm btn-toggle timing from-meridiem"
										data-toggle="button" aria-pressed="false" autocomplete="off">
										<div class="handle"></div>
									</button>
								</div>
							</div>
						</div>
						<div class="from-to-block">
							<label>To:</label>
							<div class="form-group-block">
								<div class="form-group select-white">
									<select class="selectpicker to-hour" title="00">
										<option>01</option>
										<option>02</option>
										<option>03</option>
										<option>04</option>
										<option>05</option>
										<option>06</option>
										<option>07</option>
										<option>08</option>
										<option>09</option>
										<option>10</option>
										<option>11</option>
										<option>12</option>
									</select>
								</div>
								<div class="form-group select-white">
									<select class="selectpicker to-minute" title="00">
										<option>01</option>
										<option>02</option>
										<option>03</option>
										<option>04</option>
										<option>05</option>
										<option>06</option>
										<option>07</option>
										<option>08</option>
										<option>09</option>
										<option>10</option>
										<option>11</option>
										<option>12</option>
										<option>13</option>
										<option>14</option>
										<option>15</option>
										<option>16</option>
										<option>17</option>
										<option>18</option>
										<option>19</option>
										<option>20</option>
										<option>21</option>
										<option>22</option>
										<option>23</option>
										<option>24</option>
										<option>25</option>
										<option>26</option>
										<option>27</option>
										<option>28</option>
										<option>29</option>
										<option>30</option>
										<option>31</option>
										<option>32</option>
										<option>33</option>
										<option>34</option>
										<option>35</option>
										<option>36</option>
										<option>37</option>
										<option>38</option>
										<option>39</option>
										<option>40</option>
										<option>41</option>
										<option>42</option>
										<option>43</option>
										<option>44</option>
										<option>45</option>
										<option>46</option>
										<option>47</option>
										<option>48</option>
										<option>49</option>
										<option>50</option>
										<option>51</option>
										<option>52</option>
										<option>53</option>
										<option>54</option>
										<option>56</option>
										<option>57</option>
										<option>58</option>
										<option>59</option>
										<option>60</option>
									</select>
								</div>
								<div class="form-toggle">
									<button type="button" class="btn btn-sm btn-toggle timing to-meridiem"
										data-toggle="button" aria-pressed="false" autocomplete="off">
										<div class="handle"></div>
									</button>
								</div>
							</div>
						</div>
					</div>
					<div class="menu-week-checkmark">
						<div class="form-group md-checkbox margin-bottom-40">
							<input type="checkbox" class="all-day" name="all-day" value="checkbox">
							<span class="md-checkbox-icon"></span>
							<label for="checkbox"
							class="margin-left-15 padding-left-15 padding-right-15">All day</label>
						</div>
					</div>
				</div>
				${closeIcon}
			</div>
		`);

  $('.selectpicker').selectpicker('refresh');
}

function setBusinessHoursType(businessHoursType) {
  if (businessHoursType === 'same') {
    $('#aem-business-hours-radio-same').trigger('click');
  } else if (businessHoursType === 'different') {
    $('#aem-business-hours-radio-different').trigger('click');
    $('#aem-different-business-hours').removeClass('d-none');
  }
}

function setWeekdays(weekdays = [], pickerID = '') {
  $.each(weekdays, (_, weekday) => {
    const day = weekday || '';
    const id = `#weekday-${day.toLowerCase()}`;
    $(pickerID).find(id).addClass('active');
  });
}

function setHours(
  hours,
  mainContainer,
  pickerIndex,
  businessHours,
  isSpecialOffers,
  noOfSpecialOffers,
) {
  if (hours) {
    $(mainContainer).empty();
    $.each(businessHours, (_, businessHour) => {
      addWeekdayPickers(pickerIndex);
      const {
        weekdays,
        isAvailableAllWeek,
        fromHour,
        fromMinute,
        fromMeridiem,
        toHour,
        toMinute,
        toMeridiem,
        isAllDay,
      } = businessHour;
      const pickerID = `#weekday-picker-${pickerIndex}`;
      setWeekdays(weekdays, pickerID);
      $(pickerID).find('.from-meridiem').toggleClass('active', fromMeridiem === 'PM');
      $(pickerID).find('.to-meridiem').toggleClass('active', toMeridiem === 'PM');
      $(pickerID).find('.available-all-week').prop('checked', isAvailableAllWeek);
      $(pickerID).find('.all-day').prop('checked', isAllDay);
      $(pickerID).find('.selectpicker.from-hour').selectpicker('val', fromHour);
      $(pickerID).find('.selectpicker.from-minute').selectpicker('val', fromMinute);
      $(pickerID).find('.selectpicker.to-hour').selectpicker('val', toHour);
      $(pickerID).find('.selectpicker.to-minute').selectpicker('val', toMinute);
      $('#different-items-section').toggleClass('d-none', isSpecialOffers);
      $('#special-offers').prop('checked', isAvailableAllWeek);
      $('#special-offers').prop('checked', isSpecialOffers);
      $('#no-of-special-offers').val(noOfSpecialOffers);
      $('.selectpicker').selectpicker('refresh');
      // eslint-disable-next-line no-param-reassign
      pickerIndex += 1;
    });
  }
}

function loadEditMenu() {
  const SECTION = '.weekday-pickers';
  const pickerIndex = 1;
  const editMenuID = getSession('editMenuID');
  const menu = loadMenu(editMenuID);
  if (!_.isEmpty(menu)) {
    const {
      menuName,
      businessHoursType,
      businessHours,
      isSpecialOffers,
      noOfSpecialOffers,
    } = menu;
    const hours = businessHours && businessHours.length;
    $('#aem-menu-name').val(menuName);
    setBusinessHoursType(businessHoursType);
    setHours(hours, SECTION, pickerIndex, businessHours, isSpecialOffers, noOfSpecialOffers);
  }
}

function saveMenu(menu = {}) {
  const menus = loadMenus();
  const {
    id,
  } = menu;
  const addItemPageInEdit = getSession('add_Item_InEdit') || null;
  if (addItemPageInEdit) {
    let addItemDetails = localStorage.getItem('add_item_sessionstorage');

    addItemDetails = JSON.parse(addItemDetails);

    if (addItemDetails.menus.includes(menu.id) === false) {
      addItemDetails.menus.unshift(menu.id);
    }

    localStorage.setItem('add_item_sessionstorage', JSON.stringify(addItemDetails));
  }
  const content = menus.filter((m) => parseInt(m.id, 10) !== parseInt(id, 10));
  content.unshift(menu);
  localStorage.setItem('menus', JSON.stringify(content));
}

function hookUpMenus(itemMenus = [], id = '') {
  itemMenus.forEach((menuID) => {
    const menu = loadMenu(menuID);
    if (menu) {
      const items = menu.items || [];
      const index = items.findIndex((m) => parseInt(m, 10) === parseInt(id, 10));
      if (index === -1) {
        items.push(id);
        menu.items = [...items];
        saveMenu(menu);
      }
    }
  });
}

function hookUpItemWithCategories(itemCategories = [], id = '') {
  itemCategories.forEach((categoryID) => {
    const category = loadCategory(categoryID);
    if (category) {
      const items = category.items || [];
      const index = items.findIndex((m) => parseInt(m, 10) === parseInt(id, 10));
      if (index === -1) {
        items.push(id);
        category.items = [...items];
        saveCategory(category);
      }
    }
  });
}

function hookUpCategoryWithMenus(menus = [], categoryId = '') {
  menus.forEach((menuId) => {
    const menu = loadMenu(menuId);
    if (menu) {
      const categories = menu.categories || [];
      const index = categories.findIndex((m) => parseInt(m, 10) === parseInt(categoryId, 10));
      if (index === -1) {
        categories.push(categoryId);
        menu.categories = [...categories];
        saveMenu(menu);
      }
    }
  });
}

function getModifierGroups(form) {
  const modifierGroups = [];
  form.find('.mdg-item-customization').each(function () {
    const id = $(this).data('id');
    const isSelected = $(this).hasClass('d-none');
    if (!isSelected) {
      modifierGroups.push(id);
    }
  });
  return modifierGroups;
}

function getPriceCategory() {
  const sizes = [];
  $('.md-price-par-size').each(function () {
    const key = $(this).data('size');
    const checkboxID = $(this).attr('data-checkboxID');
    const price = $(this).find('.md-input').val().trim() || 0;
    const posID = $(this).find('.md-pos').val().trim();
    const checkBoxValue = $(`#is-item-customization-${checkboxID}`).prop('checked');
    const form = $(this);
    const modifierGroups = getModifierGroups(form);

    sizes.push({
      [key]: {
        price,
        posID,
        checkBoxValue,
        modifierGroups,
      },
    });
  });
  return sizes;
}

function syncSortableMenuCategories(data) {
  const menuCategoryIDs = getSortableMenuCategoryIDs(data);
  Object.keys(menuCategoryIDs).forEach((menuCategoryID) => {
    const categoriesOrder = menuCategoryIDs[parseInt(menuCategoryID, 10)];
    const menu = loadMenu(menuCategoryID);
    if (menu) {
      menu.categories = categoriesOrder;
      saveMenu(menu);
    }
  });
}

function syncSortableMenuCategoryItems(data) {
  const menuCategoryIDs = getSortableMenuCategoryItemIDs(data);
  Object.keys(menuCategoryIDs).forEach((menuCategoryID) => {
    const itemsOrder = _.uniq(menuCategoryIDs[parseInt(menuCategoryID, 10)]);
    const category = loadCategory(menuCategoryID);
    if (category) {
      category.items = itemsOrder;
      saveCategory(category);
    }
  });
}

function loadFormMenus() {
  const MENUS_FIELD = '#pick-menus-list .list';
  const menus = loadMenus() || [];
  if (menus && menus.length) {
    $(MENUS_FIELD).empty();
    $.each(menus, (_, menu) => {
      const {
        id,
        menuName,
      } = menu;
      $(MENUS_FIELD).append(`<li class="pick-menu-item pick-item" data-group="pick-menus-list" data-id="${id}" data-name="${menuName}">${menuName}</li>`);
    });
  }
}

function loadFormCategories() {
  const CATEGORIES_FIELD = '#pick-categories-list .list';
  const categories = loadCategories() || [];
  const menus = getChips('.pick-menus-list-chips .md-chips');
  if (categories && categories.length) {
    $.each(categories, (_, category) => {
      const {
        id,
        categoryName,
      } = category;
      menus.some((menuID) => {
        if (category.menus.includes(menuID) === true && $(`li[data-id="${category.id}"]`).length === 0) {
          $(CATEGORIES_FIELD).append(`<li class="pick-category-item pick-item" data-group="pick-categories-list" data-id="${id}" data-name="${categoryName}">${categoryName}</li>`);
        }
      });
    });
  }
}

function loadForm() {
  loadFormMenus();
}

function menusChip(menuId, container) {
  const menu = loadMenu(menuId);
  if (menu) {
    const {
      menuName,
    } = menu;
    const chipID = `chip-${menuId}`;
    $(container).append(`
			<div class="md-chips" data-name="${menuName}" data-id="${menuId}" id="${chipID}">
				<span>${menuName}</span>
				<img src="src/images/icon-close-white.svg" class="remove-pick-item">
			</div>
		`);
  }
}

function menusChips(menus = [], container = '.pick-menus-list-chips') {
  $.each(menus, (_, menuId) => menusChip(menuId, container));
}

function categoriesChips(categories = [], container = '.pick-categories-list-chips') {
  $.each(categories, (_, categoryId) => {
    const category = loadCategory(categoryId);
    if (category) {
      const {
        categoryName,
      } = category;
      const chipID = `chip-${categoryId}`;
      $(container).append(`
				<div class="md-chips" data-name="${categoryName}" data-id="${categoryId}" id="${chipID}">
					<span>${categoryName}</span>
					<img src="src/images/icon-close-white.svg" class="remove-pick-item">
				</div>
			`);
    }
  });
}

function getActiveClass(activeDataUrl, dataUrl) {
  if (activeDataUrl === dataUrl) {
    return 'active';
  }
  return '';
}

function makeDropzone(zone, dataUrl, activeClass = '') {
  $(zone).append(`<div class="img-item dz-setting">
		<div class="pre-img ${activeClass}"><img alt="preview" src="${dataUrl}" data-value="${dataUrl}"></div>
		<span class="img-close-icon dz-remove"><img alt="close" src="src/images/icon-close-black.svg"></span>
	</div>`);
}

function setDropZones(zone, activeDataUrl, dataUrls = []) {
  if (dataUrls && dataUrls.length > 0) {
    $.each(dataUrls, (_, dataUrl) => {
      const activeClass = getActiveClass(activeDataUrl, dataUrl);
      makeDropzone(zone, dataUrl, activeClass);
    });
  }
}

function makeCategoriesSizes(categories = []) {
  let content = [];

  if (categories && categories.length) {
    categories.forEach((categoryID) => {
      const category = loadCategory(categoryID);
      if (category) {
        const { sizes } = category;
        content = [
          ...content,
          ...sizes,
        ];
      }
    });
  }

  return content;
}

function makeItemSizes(menuItem = {}) {
  const content = [];
  const { categories, sizes } = menuItem;
  const categorySizes = makeCategoriesSizes(categories);

  if (sizes) {
    sizes.forEach((size) => {
      const sizeName = Object.keys(size)[0];
      const isFound = categorySizes.find((c) => c === sizeName || c === 'size-1');
      if (isFound) {
        content.push(size);
      }
    });
  }

  return content;
}

function listCategotySizes() {
  const section = '#price-per-category-section';
  $(section).empty();
  const categories = getChips('.pick-categories-list-chips .md-chips');

  categories.forEach((categoryID, index) => {
    const categoryClass = index === 0 ? '' : 'category-top';
    const category = loadCategory(categoryID);
    if (category) {
      const { sizes } = category;
      const { categoryName } = category;
      if (category.sizes.length > 1) {
        $('#pick-category-div').removeClass('d-none');
      }
      makeCategotySizes(sizes, categoryName, categoryClass);
    }
  });
}

function loadFormSelectMenus() {
  const MENUS_FIELD = '#menu-selection';
  const menus = loadMenus() || [];
  if (menus && menus.length) {
    $(MENUS_FIELD).empty();
    $.each(menus, (_, menu) => {
      const {
        id,
        menuName,
      } = menu;
      $(MENUS_FIELD).append(`<option data-group="pick-menus-list" value="${id}" data-id="${id}" data-name="${menuName}">${menuName}</option>`);
    });
  }
  $('#menu-selection').selectpicker('refresh');
}

function loadFormSelectCategories(menuID) {
  const CATEGORIES_FIELD = '#category-selection';
  const categories = loadCategories() || [];
  $(CATEGORIES_FIELD).empty();
  if (categories && categories.length) {
    $.each(categories, (_, category) => {
      const {
        id,
        categoryName,
      } = category;
      if (category.menus.includes(menuID) === true && $(`option[data-id="${category.id}"]`).length === 0) {
        $(CATEGORIES_FIELD).append(`<option class="pick-category-item pick-item" data-group="pick-categories-list" data-id="${id}"  value="${id}" data-name="${categoryName}">${categoryName}</option>`);
      }
    });
  }
  $('#category-selection').selectpicker('refresh');
}

function listSelectedCategotySizes(categoryID) {
  const section = '#price-per-category-section-editpage';
  $(section).empty();
  const category = loadCategory(categoryID);
  if (category && category.sizes.length > 1) {
    $('#pick-category-div').removeClass('d-none');
  }
  if (category) {
    const { sizes } = category;
    const { categoryName } = category;
    makeCategotySizes(sizes, categoryName, 'margin-bottom-30 margin-top-30', '#price-per-category-section-editpage');
  }
}

function setSwitch(el, meridiem) {
  if (meridiem === 'PM') {
    el.addClass('active').attr('aria-pressed', true);
    return;
  }
  el.removeClass('active').attr('aria-pressed', false);
}

function setWeekdayValues(
  group,
  section,
  content = [],
) {
  if (content && content.length > 0) {
    content.forEach((context, index) => {
      const {
        fromHour,
        fromMeridiem,
        fromMinute,
        toHour,
        toMeridiem,
        toMinute,
        weekdays,
      } = context;

      const rangerID = addMdDayRange(group, section, index);

      const form = $(`#${rangerID}`);
      form.find('.selectpicker.from-hour').selectpicker('val', fromHour);
      form.find('.selectpicker.from-minute').selectpicker('val', fromMinute);
      form.find('.selectpicker.to-hour').selectpicker('val', toHour);
      form.find('.selectpicker.to-minute').selectpicker('val', toMinute);

      setSwitch(form.find('.from-meridiem'), fromMeridiem);
      setSwitch(form.find('.to-meridiem'), toMeridiem);

      if (weekdays && weekdays.length > 0) {
        const wd = form.find('.week-days');
        weekdays.forEach((weekday) => {
          wd.filter(`[data-weekday="${weekday}"]`).addClass('active');
        });
      }
    });
  }
}

function setWeekdateValues(
  group,
  section,
  content = [],
) {
  if (content && content.length > 0) {
    content.forEach((context, index) => {
      const {
        fromHour,
        fromMeridiem,
        fromMinute,
        toHour,
        toMeridiem,
        toMinute,
        startDate,
        endDate,
      } = context;

      const rangerID = addMdDateRange(group, section, index);

      const form = $(`#${rangerID}`);
      form.find('.selectpicker.from-hour').selectpicker('val', fromHour);
      form.find('.selectpicker.from-minute').selectpicker('val', fromMinute);
      form.find('.selectpicker.to-hour').selectpicker('val', toHour);
      form.find('.selectpicker.to-minute').selectpicker('val', toMinute);
      form.find('.md-start-date').val(startDate);
      form.find('.md-end-date').val(endDate);

      setSwitch(form.find('.from-meridiem'), fromMeridiem);
      setSwitch(form.find('.to-meridiem'), toMeridiem);
    });
  }
}

function loadEditItemForm() {
  const editMenuItemID = getSession('editMenuItemID') || null;
  const addItemInEdit = getSession('add_Item_InEdit') || null;
  const menuItemAdd = getSession('menu_add_item') || null;
  if (menuItemAdd) {
    const menuID = [menuItemAdd];
    menusChips(menuID);
    loadFormCategories(menuID);
  }

  if (editMenuItemID) {
    const menuItem = loadItem(editMenuItemID);
    if (menuItem) {
      const {
        isLeaveNotes,
        isMakeUpsell,
        isMultipleOptions,
        isSpecialOffer,
        itemAvailable,
        itemDescription,
        itemName,
        itemNamePOSID,
        itemPosId,
        itemPrice,
        itemPriceType,
        lavuPosSync,
        maximumPerOrder,
        menus,
        categories,
        minimumPerOrder,
        storefront,
        thumbnail,
        thumbnails,
        advancedSettingsClickedAddItem,
        weekdayStorefront,
        weekdayAvailable,
        weekdateStorefront,
        weekdateAvailable,
      } = menuItem;
      setDropZones('#idz-preview', thumbnail, thumbnails);

      $('#item-name').val(itemName);
      $('#item-posID').val(itemNamePOSID);
      $('#item-description').val(itemDescription);
      $('#item-price').val(itemPrice);
      $('#item-pos-id').val(itemPosId);
      $('#is-multiple-options').prop('checked', isMultipleOptions);
      $('#is-leave-notes').prop('checked', isLeaveNotes);
      $('#is-make-upsell').prop('checked', isMakeUpsell);
      $('#is-special-offer').prop('checked', isSpecialOffer);
      $('#minimum-per-order').selectpicker('val', minimumPerOrder);
      $('#maximum-per-order').selectpicker('val', maximumPerOrder);

      if (itemPriceType === 'category') {
        const sizes = makeItemSizes(menuItem);
        if (sizes.length !== 0) {
          makeCategotySizeFormEditPage(sizes, parseInt(categories[0], 10));
        } else {
          makeCategotySizeFormEditPage(menuItem.sizes, parseInt(categories[0], 10));
        }
      }
      if (advancedSettingsClickedAddItem === true) {
        $('#items-advanced-settings-zone').removeClass('d-none');
      }

      updateRadioButton('show-on-storefront', storefront, true, true);
      setWeekdayValues(
        '.storefront-group',
        'md-day-storefront',
        weekdayStorefront,
      );
      setWeekdateValues(
        '.storefront-group',
        'md-date-storefront',
        weekdateStorefront,
      );

      updateRadioButton('item-available', itemAvailable, true, true);
      setWeekdayValues(
        '.item-available-group',
        'md-day-available',
        weekdayAvailable,
      );
      setWeekdateValues(
        '.item-available-group',
        'md-date-available',
        weekdateAvailable,
      );

      updateRadioButton('lavu-pos-sync', lavuPosSync);

      menusChips(menus);
      categoriesChips(categories, '.pick-categories-list-chips');
      menuItem.menus.forEach((menuID) => {
        loadFormCategories(menuID);
      });
      let selectMenuVal;
      if (menus.length !== 0) {
        selectMenuVal = menus[0].toString();
      }
      loadFormSelectMenus();
      loadFormSelectCategories(parseInt(selectMenuVal, 10));
      $('#menu-selection').selectpicker('val', selectMenuVal);

      let categoryVal;
      if (categories.length !== 0) {
        categoryVal = categories[0].toString();
      }

      $('#category-selection').selectpicker('val', categoryVal);
    }
  } else if (addItemInEdit) {
    const menuItem = localStorage.getItem('add_item_sessionstorage');
    const menuUpdatedItem = JSON.parse(menuItem);
    if (menuUpdatedItem) {
      const {
        isLeaveNotes,
        isMakeUpsell,
        isMultipleOptions,
        isSpecialOffer,
        itemAvailable,
        itemDescription,
        itemName,
        itemNamePOSID,
        lavuPosSync,
        maximumPerOrder,
        menus,
        categories,
        minimumPerOrder,
        storefront,
        advancedSettingsClickedAddItem,
        weekdayStorefront,
        weekdayAvailable,
        weekdateStorefront,
        weekdateAvailable,
      } = menuUpdatedItem;
      $('#item-name').val(itemName);
      $('#item-posID').val(itemNamePOSID);
      $('#item-description').val(itemDescription);
      $('#is-multiple-options').prop('checked', isMultipleOptions);
      $('#is-leave-notes').prop('checked', isLeaveNotes);
      $('#is-make-upsell').prop('checked', isMakeUpsell);
      $('#is-special-offer').prop('checked', isSpecialOffer);
      $('#minimum-per-order').selectpicker('val', minimumPerOrder);
      $('#maximum-per-order').selectpicker('val', maximumPerOrder);

      updateRadioButton('show-on-storefront', storefront, true, true);
      setWeekdayValues(
        '.storefront-group',
        'md-day-storefront',
        weekdayStorefront,
      );
      setWeekdateValues(
        '.storefront-group',
        'md-date-storefront',
        weekdateStorefront,
      );

      updateRadioButton('item-available', itemAvailable, true, true);
      setWeekdayValues(
        '.item-available-group',
        'md-day-available',
        weekdayAvailable,
      );
      setWeekdateValues(
        '.item-available-group',
        'md-date-available',
        weekdateAvailable,
      );
      updateRadioButton('lavu-pos-sync', lavuPosSync);

      menusChips(menus);
      categoriesChips(categories, '.pick-categories-list-chips');
      listCategotySizes();
      menuUpdatedItem.menus.forEach((menuID) => {
        loadFormCategories(menuID);
      });

      let selectMenuVal;
      if (menus.length !== 0) {
        selectMenuVal = menus[0].toString();
      }
      if (advancedSettingsClickedAddItem === true) {
        $('#items-advanced-settings-zone').removeClass('d-none');
      }

      loadFormSelectMenus();
      loadFormSelectCategories(parseInt(selectMenuVal, 10));

      $('#category-selection').selectpicker('refresh');
      $('#menu-selection').selectpicker('val', selectMenuVal);

      let categoryVal;
      if (categories.length !== 0) {
        categoryVal = categories[0].toString();
      }
      $('#category-selection').selectpicker('val', categoryVal);
      // listSelectedCategotySizes(parseInt(categoryVal, 10));
    }
  }
}

function makeLabelExtended(data = []) {
  if (data && data.length) {
    return `, +${data.length}`;
  }
  return '';
}

function makeLabel(data = []) {
  let label = 'Main Menu';
  if (data && data.length) {
    label = data[0];
    data.shift();
    label += makeLabelExtended(data);
  }
  return label;
}

function makeMoreLabel(data = []) {
  let label = '';
  if (data && data.length) {
    const initData = data.shift();
    label = `<span class="data">${initData}</span>`;
    const count = data && data.length;

    if (count) {
      let jData = '';
      data.forEach((d) => {
        jData += `<span class="data">${d}</span><br />`;
      });

      const apID = `data-${uuidv4()}`;
      label += `<span data-toggle="collapse" data-target="#${apID}" class="more-data">+${count} More</span>
      <div class="collapse" data-parent="#md-items" id="${apID}">${jData}</div></span>`;
    }
  }
  return label;
}

function makeCategory(data = []) {
  if (data && data.length) {
    const categories = [];
    $.each(data, (_, categoryId) => {
      const category = loadCategory(categoryId);
      if (category) {
        const {
          categoryName,
        } = category;
        categories.push(categoryName);
      }
    });
    return makeMoreLabel(categories);
  }
  return '';
}

function makeMenu(data = []) {
  if (data && data.length) {
    const menus = [];
    $.each(data, (_, menuId) => {
      const menu = loadMenu(menuId);
      if (menu) {
        const {
          menuName,
        } = menu;
        menus.push(menuName);
      }
    });
    return makeMoreLabel(menus);
  }
  return 'Main Menu';
}

function makePriceCloud(itemPriceType, itemPrice, sizes = []) {
  let prices = '';
  if (itemPriceType === 'category' && sizes && sizes.length > 0) {
    const initPrice = sizes.shift();
    const initKey = Object.keys(initPrice)[0];
    const { price: iPrice } = initPrice[initKey];
    prices = `<span class="price">${initKey} $${toAmount(iPrice)}</span>`;
    const count = sizes && sizes.length;
    if (count) {
      let jPrice = '';
      sizes.forEach((size) => {
        const key = Object.keys(size)[0];
        const { price } = size[key];
        jPrice += `<span class="price">${key} $${toAmount(price)}</span><br />`;
      });

      const apID = `price-${uuidv4()}`;
      prices += `<span data-toggle="collapse" data-target="#${apID}" class="more-price">+${count} More</span>
      <div class="collapse more-data" data-parent="#md-items" id="${apID}">${jPrice}</div></span>`;
    }
  } else {
    prices = `<span class="price">$${toAmount(itemPrice)}</span>`;
  }
  return prices;
}

function displayItems() {
  const items = loadItems();
  const node = '#md-items';
  if (items && items.length > 0) {
    $('#items-wrapper').removeClass('d-none');
    $('#empty-items-wrapper').addClass('d-none');
    let content = '';
    $.each(items, (_, {
      id,
      itemName,
      categories,
      menus,
      itemPrice,
      itemPriceType,
      sizes,
      storefront,
      itemAvailable,
      thumbnail,
      isLocked,
    }) => {
      let itemStatus;
      let actions;
      let checkBoxItems = '';

      const prices = makePriceCloud(itemPriceType, itemPrice, sizes);
      const dialogID = `item-${id}`;
      const itemDisplayStatus = storefront.toLowerCase().includes('specific') ? 'specific' : storefront;

      if (isLocked) {
        itemStatus = makeLockItemDialog(id, dialogID);
        actions = '<div class="action"></div>';
      } else {
        itemStatus = makeUnlockItemDialog(id, dialogID);
        let itemVisibility = '';
        let itemHide = '';
        let itemVisibleClass = '';
        let itemHideClass = '';
        if (itemDisplayStatus === 'specific') {
          itemVisibility = 'Show(Always)';
          itemHide = 'Hide(Never)';
        } else if (itemDisplayStatus.toLowerCase() === 'always') {
          itemHide = 'Hide(Never)';
          itemVisibleClass = 'd-none';
        } else {
          itemVisibility = 'Show(Always)';
          itemHideClass = 'd-none';
        }
        actions = `
        <div>
            <span data-id="actions-${id}" class="table-more-actions">...</span>
            <div class="actions-dropdown d-none" id="actions-${id}">
            <ul class="actions-dropdown-list">
            <li class="${itemVisibleClass}">
              <a href="javascript:void(0)" data-id="${id}" data-visibleStatus="visible" class="table-edit visbility-items">
              ${itemVisibility}
            </a>
            </li>
            <li class="${itemHideClass}">
              <a href="javascript:void(0)" data-id="${id}" data-visibleStatus="hide" class="table-edit   visbility-items">
              ${itemHide}
            </a>
            </li>
            <li>
            <a href="javascript:void(0)" data-id="${id}" class="table-edit edit-menu-item">
            Edit
            </a>
            </li>
            <li>
              <a href="javascript:void(0)" data-id="${id}" class="table-edit delete-menu-item">
              Delete
            </a>
            </li>
              </ul>
          </div>
        </div>
        `;
        checkBoxItems = `
        <div class="form-group md-checkbox">
                            <input type="checkbox" class="md-items-checkbox" id="" name="" value="checkbox">
                            <span class="md-checkbox-icon"></span>
                            <label for="checkbox" class="margin-left-15 padding-right-15"></label>
                            </div>
        `;
      }
      content += `
        <tr>
          <td>${checkBoxItems}</td>
					<td><span class="item-img"><img class="magnific" src="${thumbnail}" alt="menu items"></span></td>
					<td class="font-semibold im-name"> <div class="name-status">${itemName} ${itemStatus}</div></td>
					<td>${makeCategory(categories)}</td>
					<td>${makeMenu(menus)}</td>
					<td>Toppings</td>
          <td>${prices}</td>
          <td class="text-capitalize">${itemAvailable}</td>
					<td class="text-capitalize">${itemDisplayStatus}</td>
					<td>${actions}</td>
				</tr>
			`;
    });
    $(node).empty();
    $(node).html(content);
  } else {
    $('#items-wrapper').addClass('d-none');
    $('#empty-items-wrapper').removeClass('d-none');
  }
}

function loadModifierGroup(id) {
  const modifierGroups = loadModifierGroups();
  return modifierGroups.find((m) => parseInt(m.id, 10) === parseInt(id, 10));
}

function loadModifierGroupByName(name) {
  const modifierGroups = loadModifierGroups();
  return modifierGroups.find((m) => m.modifierGroupName === name);
}

function saveModifierGroup(modifierGroup = {}) {
  try {
    const modifierGroups = loadModifierGroups();
    const {
      id,
    } = modifierGroup;
    const content = modifierGroups.filter((m) => parseInt(m.id, 10) !== parseInt(id, 10));
    content.unshift(modifierGroup);
    localStorage.setItem('modifierGroups', JSON.stringify(content));
  } catch (error) {
    alert('Data wasn\'t successfully saved due to browser local storage quota exceeded');
  }
}

function makeModifierGroups(data = []) {
  if (data && data.length) {
    const modifierGroups = [];
    $.each(data, (_, modifierGroupId) => {
      const modifierGroup = loadModifierGroup(modifierGroupId);
      if (modifierGroup) {
        const {
          modifierGroupName,
        } = modifierGroup;
        modifierGroups.push(modifierGroupName);
      }
    });
    return makeLabel(modifierGroups);
  }
  return 'Choice of Sides';
}

function loadEditCategory() {
  const editCategoryID = getSession('editCategoryID') || null;
  const category = loadCategory(editCategoryID);
  if (category) {
    const {
      categoryName,
      menus,
      numberOfSizes,
      sizeNames,
      categoryDropzone,
      categoryDropzones,
      categoryDescription,
      storefront,
    } = category;
    $('#category-name').val(categoryName);
    $('#category-description').val(categoryDescription);
    $('#number-of-sizes').val(numberOfSizes);
    $('#size-names').val(sizeNames);
    $('#image-upload-input').attr('data-value', categoryDropzone);
    setDropZones('#cdz-preview', categoryDropzone, categoryDropzones);
    menusChips(menus);
    const checkBoxValue = storefront.toLowerCase() !== 'never';
    $('#category-display').prop('checked', checkBoxValue);
  }
}

function getPriceValue(sizes) {
  let priceValue = '';
  sizes.forEach((size, index) => {
    const sizeName = Object.keys(size)[0];
    const {
      price,
    } = size[sizeName];
    if (index !== (sizes.length - 1)) {
      priceValue += `$${price}, `;
    } else {
      priceValue += `$${price}`;
    }
  });
  return priceValue;
}

function displayCategories() {
  const categories = loadCategories();
  const node = '#md-categories';
  if (categories && categories.length > 0) {
    $('#categories-wrapper').removeClass('d-none');
    $('#empty-categories-wrapper').addClass('d-none');
    let content = '';
    $.each(categories, (_, {
      categoryName,
      id,
      menus,
      sizeNames,
      storefront,
      isLocked,
      categoryDropzone,
    }) => {
      let itemStatus = '';
      let actions = '';
      let checkBoxCategories = '';
      const dialogID = `category-${id}`;
      if (isLocked) {
        itemStatus = makeLockItemDialog(id, dialogID, 'category');
      } else {
        itemStatus = makeUnlockItemDialog(id, dialogID, 'category');
        const itemVisible = storefront.toLowerCase() === 'never' ? 'Show(Always)' : 'Hide(Never)';
        actions = `
         <div>
         <span data-id="actions-${id}" class="table-more-actions">...</span>
         <div class="actions-dropdown d-none" id="actions-${id}">
         <ul class="actions-dropdown-list">
         <li>
         <a href="javascript:void(0)" data-id="${id}" class="table-edit visbility-category">
         ${itemVisible}
       </a>
       </li>
         <li>
         <a href="javascript:void(0)" data-id="${id}" class="table-edit edit-category">
         Edit
       </a>
       </li>
       <li>
         <a href="javascript:void(0)" data-id="${id}" class="table-edit delete-category">
         Delete
       </a>
       </li>
         </ul>
     </div>
         </div>
        `;
        checkBoxCategories = `
        <div class="form-group md-checkbox">
                              <input type="checkbox" data-id="${id}" class="md-categories-checkbox" id="" name="" value="checkbox">
                              <span class="md-checkbox-icon"></span>
                              <label for="checkbox" class="margin-left-15 padding-right-15"></label>
                              </div>
        `;
      }
      content += `
        <tr>
          <td>
          ${checkBoxCategories}
          </td>
					<td><span class="item-img"><img class="magnific" src="${categoryDropzone}" alt="menu items"></span></td>
					<td class="font-semibold im-name">${categoryName} ${itemStatus}</td>
					<td>${makeMenu(menus)}</td>
					<td>${sizeNames}</td>
					<td>${storefront}</td>
					<td>${actions}</td>
				</tr>
			`;
    });
    $(node).empty();
    $(node).html(content);
  } else {
    $('#categories-wrapper').addClass('d-none');
    $('#empty-categories-wrapper').removeClass('d-none');
  }
}

function displayModifierGroups() {
  const modifierGroups = loadModifierGroups();
  const node = '#modifier-groups';
  if (!_.isEmpty(modifierGroups)) {
    $('#modifier-wrapper').removeClass('d-none');
    $('#empty-modifier-wrapper').addClass('d-none');
    $('#modifier-dropdown ul').empty();
    let content = '';
    let table = '';
    let tableBody = '';
    $.each(modifierGroups, (index, {
      id,
      modifierGroupName,
      isLocked,
      options,
    }) => {
      let actions = '';
      let addOptions = '';
      const collapseID = `collapse-${id}`;
      const modifierGroupID = `modifier-group-${id}`;
      const isShow = index === 0 ? 'show' : '';
      const dialogID = `mdgs-${id}`;
      $('#modifier-dropdown ul').append(`<li data-id="${modifierGroupID}">${modifierGroupName}</li>`);
      if (isLocked) {
        actions = `
					<li>${makeLockItemDialog(id, dialogID, 'modifier-group')}</li>
				`;
        addOptions = 'd-none';
      } else {
        actions = `
					<li>
						<a href="javascript:void(0)" data-id="${id}" class="copy-modifier-group">
							<img class="color-icon" src="src/images/icon-copy-blue.svg">
							<img class="grey-icon" src="src/images/icon-copy-grey.svg">
						</a>
					</li>
					<li>
						<a href="javascript:void(0)" data-id="${id}" class="edit-modifier-group">
							<img class="color-icon" src="src/images/icon-edit-blue.svg">
							<img class="grey-icon" src="src/images/icon-edit-grey.svg">
						</a>
					</li>
					<li>
						<a href="javascript:void(0)" data-id="${id}" class="delete-modifier-group">
							<img class="color-icon" src="src/images/icon-delete-red.svg">
							<img class="grey-icon" src="src/images/icon-delete-grey.svg">
						</a>
					</li>
				`;
      }

      const filterBtnClass = !_.isEmpty(options) ? '' : 'd-none';

      if (!_.isEmpty(options)) {
        $.each(options, (_, {
          id: optionID,
          modifierOptionName,
          modifierOptionPrice,
          modifierGroups: optionModifierGroups,
          thumbnail,
          sizes,
          storefront,
        }) => {
          let mdoName = modifierOptionName;
          let optionActions = '';
          let optionSortHandler = '';
          const optionPrice = modifierOptionPrice === '15' ? getPriceValue(sizes) : `$${modifierOptionPrice}`;
          let checkBoxOptions = '';

          if (isLocked) {
            mdoName += `
								<span class="lock-status">
									<img src="./src/images/icon-lock.svg" alt="lock">
								</span>
							`;
          } else {
            const itemVisible = storefront.toLowerCase() === 'never' ? 'Show(Always)' : 'Hide(Never)';
            optionActions = `
                  <span data-id="actions-${optionID}" class="table-more-actions">...</span>
                  <div class="actions-dropdown d-none" id="actions-${optionID}">
                  <ul class="actions-dropdown-list">
                  <li>
                  <a href="javascript:void(0)" data-md-id="${id}" data-option-id="${optionID}" class="table-edit mdg-option-visible">
                  ${itemVisible}
                </a>
                </li>
                  <li>
                  <a href="javascript:void(0)" data-md-id="${id}" data-option-id="${optionID}" class="table-edit mdg-option-edit">
                  Edit
                </a>
                </li>
                <li>
                  <a href="javascript:void(0)" data-md-id="${id}" data-option-id="${optionID}" class="table-edit mdg-option-delete">
                  Delete
                </a>
                </li>
                  </ul>
              </div>
              `;
            checkBoxOptions = `
            <div class="form-group md-checkbox">
                  <input type="checkbox" class="md-options-checkbox" data-md-id="${id}" data-option-id="${optionID} id="" name="" value="checkbox">
                  <span class="md-checkbox-icon md-table-checkbox-span"></span>
                  <label for="checkbox" class="margin-left-15 padding-right-15"></label>
               </div>
            `;
            optionSortHandler = 'option-sort-handle';
          }

          tableBody += `
            <tr class="md-option" data-md-id="${id}" data-option-id="${optionID}">
              <td>
              <span class="small-menu-icon ${optionSortHandler}"><img src="./src/images/icon-menu-small.svg" alt="menu items"></span>
              ${checkBoxOptions}
              </td>
							<td>
								<span class="item-img"><img class="magnific" src="${thumbnail}" alt="md"></span>
              </td>
							<td class="font-semibold">${mdoName}</td>
							<td>${makeModifierGroups(optionModifierGroups)}</td>
              <td>${optionPrice}</td>
              <td>${storefront}</td>
							<td>${optionActions}</td>
						</tr>
					`;
        });
        table += `
					<div class="md-datatable table-responsive" id="${index}">
						<table class="table table-striped table-bordered md-options-table" style="width:100%">
							<thead>
                <tr>
                  <th>
                  <div class="form-group md-checkbox modifier-checkbox">
                  <input type="checkbox" class="md-options-table-checkbox" id="" name="" value="checkbox">
                  <span class="md-checkbox-icon"></span>
                  <label for="checkbox" class="margin-left-15 padding-right-15"></label>
                  </div>
                  </th>
									<th class="m-photo"><label>PHOTO</label></th>
									<th class="m-option"><label>OPTION</label></th>
									<th class="m-modifier-group"><label>NESTED MODIFIERS</label></th>
                  <th class="m-price"><label>price</label></th>
                  <th class="m-price"><label>VISIBILITY <img data-toggle="tooltip" data-placement="right"
                  title="" data-original-title="This setting determines whether an option is visible on your storefront."
                  src="src/images/icon-info-lightgrey.svg"></label></th>
                  <th class="table-actions">
                  <span data-id="actions-${id}" class="table-more-actions">...</span>
                  <div class="actions-dropdown d-none" id="actions-${id}">
                  <ul class="actions-dropdown-list">
                      <li>
                        <a href="javascript:void(0)" data-md-id="${id}"class="table-edit mdg-table-option-delete">
                        Delete
                      </a>
                      </li>
                      <li>
                        <a href="javascript:void(0)" data-visible="show" data-md-id="${id}"class="table-edit mdg-table-option-visible">
                        Show(Always)
                      </a>
                      </li>
                      <li>
                        <a href="javascript:void(0)" data-visible="hide" data-md-id="${id}"class="table-edit mdg-table-option-visible">
                        Hide(Never)
                      </a>
                      </li>
                  </ul>
              </div>
                  </th>
								</tr>
							</thead>
							<tbody class="md-options-body">${tableBody}</tbody>
						</table>
					</div>
				`;
        tableBody = '';
      } else {
        table += `
					<div class="modifier-nothing">
					  <h4>Nothing to show here yet.</h4>
					</div>
				`;
      }
      content += `
				<div class="card-large-text" id="${modifierGroupID}">
					<div class="modifier-table-header">
						<div class="modifier-nav">
							<h2 class="font-semibold">${modifierGroupName}</h2>
							<ul>
								${actions}
							</ul>
						</div>
						<div class="modifier-button">
							<a class="dropdown-arrow collapsed" data-toggle="collapse" href="#${collapseID}">
								<img alt="down" class="down-arow" src="src/images/icon-down-arrow.svg">
								<img alt="up" class="up-arow" src="src/images/icon-up-arrow.svg">
							</a>
						</div>
					</div>
					<div class="modifier-table-content collapse ${isShow}" id="${collapseID}" data-parent="#${modifierGroupID}">
						<div data-id="${collapseID}" class="modifier-add-options add-modifier-options ${addOptions}">
							<h3 data-id="${collapseID}">+ Add Options</h3>
            </div>
            <div class="filter-btn-div modifier-div  ${filterBtnClass}">
                    <button class="btn-inactive border-radius-4 filter-btn" data-id="modifiers-page-${collapseID}">Filters <img data-id="modifiers-page-${collapseID}" src="src/images/filter-btn.svg" /></button>
                    <div class="filter-radio-div d-none" id="modifiers-page-${collapseID}">
                      <div class="header">
                        <p>Filters</p>
                        <img class="close-filter-btn" data-id="modifiers-page-${collapseID}" src="src/images/icon-close-black.svg" />
                      </div>
                      <div class="body">
                        <p>Locked/Unlocked</p>
                        <div class="radio-button">
                          <div class="form-group">
                             <div class="radio">
                                <label>
                                   <input class="lock-unlock-radio" type="radio" value="locked" name="radio-input"> Locked
                                   <span class="checkmark"></span>
                                </label>
                             </div>
                          </div>
                          <div class="form-group">
                             <div class="radio">
                                <label>
                                   <input class="lock-unlock-radio" type="radio" value="unlocked" name="radio-input" > Unlocked
                                   <span class="checkmark"></span>
                                </label>
                             </div>
                          </div>
                       </div>
                      </div>
                      <div class="footer">
                        <button class="btn-control font-semibold clear-filter-btn" data-id="modifiers-page-${collapseID}"  type="button" id="">Clear All</button>
                        <button class="md-btn-primary border-radius-4 filter-done-btn" data-id="modifiers-page-${collapseID}" type="submit" id="">Done</button>
                     </div>
                    </div>
                  </div>
						${table}
					</div>
				</div>
	`;
      table = '';
    });
    $(node).html(content);
  } else {
    $('#modifier-wrapper').addClass('d-none');
    $('#empty-modifier-wrapper').removeClass('d-none');
  }
}

function lockUnlockModifierGroup(id) {
  const modifierGroup = loadModifierGroup(id);
  if (modifierGroup) {
    modifierGroup.isLocked = !modifierGroup.isLocked;
    saveModifierGroup(modifierGroup);
  }
}

function loadModifierGroupOption(modifierGroupID, modifierGroupOptionID) {
  const modifierGroup = loadModifierGroup(modifierGroupID);
  if (modifierGroup) {
    let options = modifierGroup.options || [];
    options = options.find((o) => {
      if (o.id.toString() === modifierGroupOptionID) {
        o.displayOption = modifierGroup.displayOption;
      }
      return o.id.toString() === modifierGroupOptionID;
    });
    return options;
  }
  return null;
}

function deleteModifierGroup(id) {
  const modifierGroups = loadModifierGroups();
  const content = modifierGroups.filter((m) => parseInt(m.id, 10) !== parseInt(id, 10));
  localStorage.setItem('modifierGroups', JSON.stringify(content));
}

function deleteModifierGroupOption(option = {}) {
  const {
    modifierGroupID,
    optionID,
  } = option;
  const modifierGroup = loadModifierGroup(modifierGroupID);
  if (modifierGroup) {
    let options = [];
    if (modifierGroup && modifierGroup.options) {
      options = modifierGroup.options;
    }
    const index = options.findIndex((i) => i.id === optionID);
    if (index !== -1) {
      options.splice(index, 1);
      modifierGroup.options = options;
      saveModifierGroup(modifierGroup);
    }
  }
}

function updateModifierGroupOption(option = {}) {
  const {
    modifierGroupID,
    optionID,
  } = option;
  const modifierGroup = loadModifierGroup(modifierGroupID);
  if (modifierGroup) {
    let options = [];
    if (modifierGroup && modifierGroup.options) {
      options = modifierGroup.options;
    }
    const index = options.findIndex((i) => i.id === optionID);
    if (index !== -1) {
      if (options[`${index}`].storefront.toLowerCase() === 'never') {
        options[`${index}`].storefront = 'Always';
        $('#success-msg-div').removeClass('d-none');
        $('#success-msg').html(`<strong>Success!</strong> This ${options[`${index}`].mdoName} is now visible on your storefront.`);
      } else {
        options[`${index}`].storefront = 'Never';
        $('#success-msg-div').removeClass('d-none');
        $('#success-msg').html(`<strong>Success!</strong> This ${options[`${index}`].mdoName} is now hidden on your storefront.`);
      }
      $('html, body').animate({
        scrollTop: 0,
      }, 300);
      modifierGroup.options = options;
      saveModifierGroup(modifierGroup);
      setTimeout(() => {
        $('#success-msg-div').addClass('d-none');
        // window.location.reload();
      }, 3000);
    }
  }
}

function loadEditModifierGroup() {
  const editModifierGroupID = getSession('editModifierGroupID') || null;
  const modifierGroup = loadModifierGroup(editModifierGroupID);

  if (modifierGroup) {
    const {
      modifierGroupName,
      displayOption,
      minimum,
      maximum,
      sizes,
      toppingsMatrixOption,
    } = modifierGroup;

    $(`input[name=md-toppings-matrix-option][value=${toppingsMatrixOption}]`).attr('checked', 'checked');
    $('#md-min-max-zone').toggleClass('d-none', ['md-radio-button-option', 'md-dropdown-option'].includes(toppingsMatrixOption));
    $(`.md-sub-group-options`).addClass('d-none');
    $(`#${toppingsMatrixOption}`).removeClass('d-none');

    if (toppingsMatrixOption === 'md-sub-group-custom-option' && sizes && sizes.length > 0) {
      sizes.forEach((size) => {
        const labelID = `custom-label-${uuidv4()}`;
        $('#md-custom-toppings-list').append(`
          <div class="none-line md-custom-topping" id="${labelID}">
            <form enctype="multipart/form-data">
              <input type="file" data-id="${labelID}" class="custom-label-preview" accept="image/gif, image/jpeg, image/png" style="display: none" />
            </form>
            <span class="none-close"><img data-id="${labelID}" class="remove-custom-label-name" alt="close" src="src/images/icon-close.svg"></span>
            <span class="none-label">${size}</span>
            <span class="image-box custom-label-preview-tool" data-id="${labelID}"><img alt="import" src="src/images/icon-import-color.svg"></span>
                  <a href="#" data-id="${labelID}" class="d-none remove-preview">Remove image</a>
          </div>
        `);
      });
    }

    $('#modifier-group-name').val(modifierGroupName);
    $('.md-group-dropdown').selectpicker('val', displayOption);
    $('#minimum').val(minimum);
    $('#maximum').val(maximum);
  }
}

function modifierGroupChips(modifierGroups = [], container = '.list-chips', formID = '#mgof-1') {
  if (!_.isEmpty(modifierGroups)) {
    $.each(modifierGroups, (_, modifierGroupID) => {
      const modifierGroup = loadModifierGroup(modifierGroupID);
      const {
        modifierGroupName,
      } = modifierGroup;
      const chipID = `chip-${modifierGroupID}`;
      $(formID).find(container).append(`
				<div class="md-chips" data-name="${modifierGroupName}" data-id="${modifierGroupID}" id="${chipID}">
					<span>${modifierGroupName}</span>
					<img src="src/images/icon-close-white.svg" class="remove-pick-item">
				</div>
			`);
    });
  }
}

function onLoadModifierGroup(modifierGroupID, container = '.list-chips', formID = '#mgof-1') {
  const modifierGroup = loadModifierGroup(modifierGroupID);
  const {
    modifierGroupName,
  } = modifierGroup;
  const chipID = `chip-${modifierGroupID}`;
  if ($(formID).find('.md-chips').attr('id') !== chipID) {
    $(formID).find(container).append(`
    <div class="md-chips" data-name="${modifierGroupName}" data-id="${modifierGroupID}" id="${chipID}">
      <span>${modifierGroupName}</span>
      <img src="src/images/icon-close-white.svg" class="remove-pick-item">
    </div>
  `);
  }
}

function loadEditModifierOptionsForm() {
  const editModifierGroupOptionID = getSession('editModifierGroupOptionID') || null;
  if (editModifierGroupOptionID) {
    const {
      modifierGroupID,
      optionID,
    } = JSON.parse(editModifierGroupOptionID);
    const modifierGroupOption = loadModifierGroupOption(modifierGroupID, optionID);
    if (modifierGroupOption) {
      const {
        id,
        modifierGroups,
        modifierOptionDescription,
        displayOption,
        modifierOptionName,
        modifierOptionPOSID,
        modifierOptionPrice,
        thumbnail,
        thumbnails,
        isAllowExtra,
        extraModiferPrice,
        isIncludedItemPrice,
        isShowPricesOptions,
        sizes,
        storefront,
      } = modifierGroupOption;
      setDropZones('#mgof-1 .modz-preview', thumbnail, thumbnails);

      if (displayOption === 'md-toppings-matrix-option') {
        $('.moae-advanced-settings').removeClass('d-none');
      }

      const form = $('.mgo-form#mgof-1');
      form.attr('data-id', id);
      form.find('#modifier-option-name').val(modifierOptionName);
      form.find('#modifier-option-description').val(modifierOptionDescription);
      modifierGroupChips(modifierGroups);
      form.find('#modifier-option-price').val(modifierOptionPrice);
      form.find('#modifier-option-pos-id').val(modifierOptionPOSID);

      form.find('#is-allow-extra').prop('checked', isAllowExtra);
      form.find('#extra-modifier-price').val(extraModiferPrice);
      form.find('#is-included-item-price').prop('checked', isIncludedItemPrice);
      form.find('#is-show-prices-options').prop('checked', isShowPricesOptions);
      const checkBoxValue = storefront.toLowerCase() !== 'never';
      form.find('#display-option').prop('checked', checkBoxValue);

      makeCategotySizeModifierForm(sizes, '#mgo-price-category');
    }
  }
}

function loadModifierSizes(form) {
  const formID = form.attr('id');
  const section = form.find('#mgo-price-category');
  const chips = form.find('.md-chips');
  $(section).empty();

  const mdos = getChips(chips);
  mdos.forEach((mdo) => {
    const modifierGroupOption = loadModifierGroup(mdo);
    if (modifierGroupOption) {
      const { sizes } = modifierGroupOption;
      if (sizes && sizes.length) {
        sizes.forEach((size) => {
          const value = size.toLowerCase().replace(/\s+/g, '');
          const sizeID = `price-par-size-${value}`;
          const inputID = `item-price--${value}`;
          const posID = `item-pos-id--${value}`;
          const disabled = sizeStatus(size);
          const disabledClass = sizeStatus(size);

          if ($(`#${formID} #${sizeID}`).length === 0) {
            $(section).append(`
              <div class="md-price-par-size" id="${sizeID}" data-size="${size}">
                <div class="per-category-size-row price-par-size">
                  <div class="md-price-pos-size">
                    ${size}
                  </div>
                  <div class="md-price-pos">
                    <div class="md-price-block md-form-group">
                      <h2>Price</h2>
                      <div class="price-tag">
                        <div class="price">$</div>
                        <input type="text" class="md-form-field md-input md-form-input ${disabledClass}" id="${inputID}" value="${sizeValue(size)}" data-form="${formID}" ${disabled}>
                      </div>
                      <div class="error">Can't be empty</div>
                    </div>
                    <div class="md-pos-block">
                      <div class="tool-tip-div">
                        <p class="pos-label">POS ID</p>
                        <div class="tool-wrap">
                          <div class="tool-parent">
                            <img src="./src/images/icon-info-lightgrey.svg">
                            <div class="tool-show-wrap">
                              <div class="tool-show">
                                <p>Required only if you are integrating MenuDrive with a POS system. POS ID represents the name or ID on the POS system.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="pos-tag">
                        <input type="text" class="md-pos" placeholder="275765" id="${posID}">
                      </div>
                      <p class="pos-tag-label">Edit this field only if you have a POS integration, the POS ID should match the PLU ID in your POS.</p>
                    </div>
                  </div>
                </div>
              </div>
            `);
          }
        });
      } else if (($(section).children('div').length === 0) && (sizes.length === 0)) {
        $(section).append(
          `<div class="md-price-pos">
          <div class="md-price-block md-form-group">
            <h2>Price</h2>
            <div class="price-tag">
              <div class="price">$</div>
              <input type="text" class="md-form-field md-input md-form-input" id="modifier-option-price" data-form="mgof-1">
            </div>
            <div class="error">Can't be empty</div>
          </div>
          <div class="md-pos-block">
          <div class="tool-tip-div">
          <p class="pos-label">POS ID</p>
          <div class="tool-wrap">
            <div class="tool-parent">
               <img src="./src/images/icon-info-lightgrey.svg">
               <div class="tool-show-wrap">
                  <div class="tool-show">
                     <p>Required only if you are integrating MenuDrive with a POS system. POS ID represents the name or ID on the POS system.
                     </p>
                  </div>
               </div>
            </div>
         </div>
        </div>
            <div class="pos-tag">
              <input type="text" placeholder="275765" id="modifier-option-pos-id">
            </div>
            <p class="pos-tag-label">Edit this field only if you have a POS integration, the POS ID should match the PLU ID in your POS.</p>
          </div>
        </div>
          `,
        );
      }
    }
  });
}

function loadModifierOptionsForm(
  container = '#mgof-1',
  section = '.pick-modifier-groups-list .list',
) {
  const modifierGroupID = localStorage.getItem('add_modifier_options');
  const addOptionSession = getSession('addModifierGroupOptionID') || null;
  let modifierGroupOption;
  if (modifierGroupID) {
    modifierGroupOption = loadModifierGroup(modifierGroupID);
  }
  const modifierGroups = loadModifierGroups();
  if (addOptionSession) {
    onLoadModifierGroup(modifierGroupOption.id);
    const form = $('#mgof-1').closest('.mgo-form');
    loadModifierSizes(form);
  }

  if (modifierGroupOption && modifierGroupOption.displayOption !== 'md-toppings-matrix-option') {
    $('.moae-advanced-settings').addClass('d-none');
  } else {
    $('.moae-advanced-settings').removeClass('d-none');
  }
  if (!_.isEmpty(modifierGroups)) {
    $(container).find(section).empty();
    $.each(modifierGroups, (_, modifierGroup) => {
      const {
        id,
        modifierGroupName,
      } = modifierGroup;
      if (modifierGroupOption && modifierGroupOption.id !== id) {
        $(container).find(section).append(`<li class="mdo-pick-list" data-group="pick-modifier-groups-list" data-id="${id}" data-name="${modifierGroupName}">${modifierGroupName}</li>`);
      }
    });
  }
}

function setDropZone(zone, dataUrl) {
  makeDropzone(zone, dataUrl);
  const NODE = `${zone} .dz-setting`;
  const PREVIEW_NODE = `${NODE} .pre-img`;
  const count = $(NODE).length;
  if (count > 1) {
    $(PREVIEW_NODE).removeClass('active');
    $(PREVIEW_NODE).last().addClass('active');
  }
}

function getDropZone(zone) {
  let thumbnail = 'src/images/generic-item.jpg';

  const INACTIVE_NODE = `${zone} .dz-setting .pre-img`;
  const ACTIVE_NODE = `${zone} .dz-setting .pre-img.active`;
  const inactiveCount = $(INACTIVE_NODE).length;
  const activeCount = $(ACTIVE_NODE).length;

  if (activeCount === 1) {
    thumbnail = $(`${ACTIVE_NODE} img`).data('value');
  } else if (inactiveCount > 0) {
    thumbnail = $(`${INACTIVE_NODE} img`).first().data('value');
  }
  return thumbnail;
}

function getDropZones(zone) {
  const thumbnails = [];
  const NODE = `${zone} .dz-setting`;

  $(NODE).each(function () {
    thumbnails.push($(this).find('img').data('value'));
  });

  return thumbnails;
}

function makeError(key, type, error = `You've already selected this day and time. Please select another time(s).`) {
  const pickerID = `#${key}`;
  $(pickerID).find('.time-error').removeClass('d-none').addClass(type)
    .text(error);
}

function isSameWeekdays(primary = [], secondary = []) {
  const duplicates = primary.filter((val) => secondary.indexOf(val) !== -1);
  return duplicates.length > 0;
}

function dayTimeOverlaps(pickers) {
  for (let i = 0; i < pickers.length; i += 1) {
    for (let j = i + 1; j < pickers.length; j += 1) {
      const isSame = (_.isEqual(pickers[i].businessHour, pickers[j].businessHour)) && _.isEqual(pickers[j].businessHour, pickers[i].businessHour);
      const isISameTime = (!_.isEqual(pickers[i].from, DEFAULT_TIME) && !_.isEqual(pickers[i].to, DEFAULT_TIME) && _.isEqual(pickers[i].from, pickers[i].to));
      const isJSameTime = (!_.isEqual(pickers[j].from, DEFAULT_TIME) && !_.isEqual(pickers[j].to, DEFAULT_TIME) && _.isEqual(pickers[j].from, pickers[j].to));
      const isTime = (pickers[i].from < pickers[j].to) && (pickers[j].from < pickers[i].to);
      const isDay = (_.isEqual(pickers[i].weekdays, pickers[j].weekdays)) && _.isEqual(pickers[j].weekdays, pickers[i].weekdays);
      const isWeekdays = (isSameWeekdays(pickers[i].weekdays, pickers[j].weekdays)) && isSameWeekdays(pickers[j].weekdays, pickers[i].weekdays);

      if (isJSameTime) {
        return {
          pickerID: pickers[j].id,
          error: 'Menu From time and To time are the same',
        };
      }

      if (isISameTime) {
        return {
          pickerID: pickers[i].id,
          error: 'Menu From time and To time are the same',
        };
      }

      const isWeekdaysIsTime = isWeekdays && isTime;
      const isTimeIsDay = isTime && isDay;
      if (isSame || isWeekdaysIsTime || isTimeIsDay) {
        return {
          pickerID: pickers[j].id,
        };
      }
    }
  }
  return null;
}

function dateRangeOverlaps(aStart, aEnd, bStart, bEnd) {
  if (!aStart || !aEnd || !bStart || !bEnd) {
    return false;
  }
  if (aStart <= bStart && bStart <= aEnd) {
    return true;
  }
  if (aStart <= bEnd && bEnd <= aEnd) {
    return true;
  }
  if (bStart < aStart && aEnd < bEnd) {
    return true;
  }
  return false;
}

function dayDateTimeOverlaps(pickers) {
  for (let i = 0; i < pickers.length; i += 1) {
    for (let j = i + 1; j < pickers.length; j += 1) {
      const isSame = (_.isEqual(pickers[i].businessHour, pickers[j].businessHour)) && _.isEqual(pickers[j].businessHour, pickers[i].businessHour);
      const isTime = (pickers[i].from < pickers[j].to) && (pickers[j].from < pickers[i].to);
      const isDates = dateRangeOverlaps(
        pickers[i].startDate,
        pickers[i].endDate,
        pickers[j].startDate,
        pickers[j].endDate,
      );
      const isISameTime = (!_.isEqual(pickers[i].from, DEFAULT_TIME) && !_.isEqual(pickers[i].to, DEFAULT_TIME) && _.isEqual(pickers[i].from, pickers[i].to));
      const isJSameTime = (!_.isEqual(pickers[j].from, DEFAULT_TIME) && !_.isEqual(pickers[j].to, DEFAULT_TIME) && _.isEqual(pickers[j].from, pickers[j].to));

      if (isJSameTime) {
        return {
          pickerID: pickers[j].id,
          error: 'Menu From time and To time are the same',
        };
      }

      if (isISameTime) {
        return {
          pickerID: pickers[i].id,
          error: 'Menu From time and To time are the same',
        };
      }

      const isTimeIsDates = isTime && isDates;
      if (isSame || isDates || isTimeIsDates) {
        return {
          pickerID: pickers[j].id,
        };
      }
    }
  }
  return null;
}

function compareOverlaps(pickers = []) {
  const context = dayTimeOverlaps(pickers);
  if (context) {
    const {
      pickerID,
      type,
      error,
    } = context;
    makeError(pickerID, type, error);
  }
}

function compareDateOverlaps(pickers = []) {
  const context = dayDateTimeOverlaps(pickers);
  if (context) {
    const {
      pickerID,
      type,
      error,
    } = context;
    makeError(pickerID, type, error);
  }
}

const DEFAULT_BUSINESS_HOUR = {
  weekdays: [],
  isAvailableAllWeek: false,
  fromHour: '',
  fromMinute: '',
  fromMeridiem: mapMeridiem(false),
  toHour: '',
  toMinute: '',
  toMeridiem: mapMeridiem(false),
  isAllDay: false,
};

const DEFAULT_MD_BUSINESS_HOUR = {
  weekdays: [],
  fromHour: '',
  fromMinute: '',
  fromMeridiem: mapMeridiem(false),
  toHour: '',
  toMinute: '',
  toMeridiem: mapMeridiem(false),
};

function makeHoursError() {
  $('.time-error').addClass('d-none');
  const pickers = [];

  $('.weekday-picker').each(function () {
    const id = $(this).attr('id');
    const pickerID = `#${id}`;

    const weekDays = [];
    $(`${pickerID} .menu-week-day ul li.active`).each(function () {
      weekDays.push($(this).data('weekday'));
    });

    const businessHour = {
      weekdays: weekDays,
      isAvailableAllWeek: $(`${pickerID} .available-all-week`).is(':checked'),
      fromHour: $(pickerID).find('.selectpicker.from-hour').selectpicker('val'),
      fromMinute: $(pickerID).find('.selectpicker.from-minute').selectpicker('val'),
      fromMeridiem: mapMeridiem($(pickerID).find('.from-meridiem').hasClass('active')),
      toHour: $(pickerID).find('.selectpicker.to-hour').selectpicker('val'),
      toMinute: $(pickerID).find('.selectpicker.to-minute').selectpicker('val'),
      toMeridiem: mapMeridiem($(pickerID).find('.to-meridiem').hasClass('active')),
      isAllDay: $(`${pickerID} .all-day`).is(':checked'),
    };

    if (_.isEqual(businessHour, DEFAULT_BUSINESS_HOUR)) {
      makeError(id, '', 'You haven\'t selected a different menu availability schedule.');
    } else if (!_.isEqual(businessHour, DEFAULT_BUSINESS_HOUR)) {
      const {
        weekdays,
        fromHour,
        fromMinute,
        fromMeridiem,
        toHour,
        toMinute,
        toMeridiem,
      } = businessHour;

      const fromTime = `${fromHour || '00'}:${fromMinute || '00'}`;
      const toTime = `${toHour || '00'}:${toMinute || '00'}`;
      const from = moment(`${fromTime} ${fromMeridiem}`, 'HH:mm A').unix();
      const to = moment(`${toTime} ${toMeridiem}`, 'HH:mm A').unix();
      pickers.push({
        id,
        weekdays,
        from,
        to,
        businessHour,
      });
    }
  });

  if ($('.time-error:not(".d-none")').length === 0) {
    compareOverlaps(pickers);
  }
}

function makeMDError(section, field, value) {
  if ($(section).length === 0 || $(`${field}:checked`).val() !== value) {
    return;
  }

  const pickers = [];
  let pickerID = '';

  $(section).each(function () {
    const id = $(this).attr('id');
    pickerID = `#${id}`;

    const weekDays = [];
    const node = $(pickerID).find('ul li.week-days.active');
    $(node).each(function () {
      weekDays.push($(this).data('weekday'));
    });
    const businessHour = {
      weekdays: weekDays,
      fromHour: $(pickerID).find('.selectpicker.from-hour').selectpicker('val'),
      fromMinute: $(pickerID).find('.selectpicker.from-minute').selectpicker('val'),
      fromMeridiem: mapMeridiem($(pickerID).find('.from-meridiem').hasClass('active')),
      toHour: $(pickerID).find('.selectpicker.to-hour').selectpicker('val'),
      toMinute: $(pickerID).find('.selectpicker.to-minute').selectpicker('val'),
      toMeridiem: mapMeridiem($(pickerID).find('.to-meridiem').hasClass('active')),
    };

    if (!_.isEqual(businessHour, DEFAULT_MD_BUSINESS_HOUR)) {
      const {
        fromHour,
        fromMinute,
        fromMeridiem,
        toHour,
        toMinute,
        toMeridiem,
        weekdays,
      } = businessHour;

      const fromTime = `${fromHour || '00'}:${fromMinute || '00'}`;
      const toTime = `${toHour || '00'}:${toMinute || '00'}`;
      const from = moment(`${fromTime} ${fromMeridiem}`, 'HH:mm A').unix();
      const to = moment(`${toTime} ${toMeridiem}`, 'HH:mm A').unix();
      pickers.push({
        id,
        from,
        to,
        weekdays,
        businessHour,
      });
    }
  });

  $(`${pickerID} .time-error`).addClass('d-none');

  compareOverlaps(pickers);
}

function makeDayHoursError() {
  makeMDError('.md-day-storefront', '#show-on-storefront', 'Specific days and times');
  makeMDError('.md-day-available', '#item-available', 'Specific days and times');
}

function makeMDDateError(section, field, value) {
  if ($(section).length === 0 || $(`${field}:checked`).val() !== value) {
    return;
  }

  const pickers = [];
  let pickerID = '';

  $(section).each(function () {
    const id = $(this).attr('id');
    pickerID = `#${id}`;

    const defaultMdDateBusinessHour = {
      startDate: '',
      endDate: '',
      fromHour: '',
      fromMinute: '',
      fromMeridiem: mapMeridiem(false),
      toHour: '',
      toMinute: '',
      toMeridiem: mapMeridiem(false),
    };
    const businessHour = {
      startDate: $(pickerID).find('.md-start-date').val(),
      endDate: $(pickerID).find('.md-end-date').val(),
      fromHour: $(pickerID).find('.selectpicker.from-hour').selectpicker('val'),
      fromMinute: $(pickerID).find('.selectpicker.from-minute').selectpicker('val'),
      fromMeridiem: mapMeridiem($(pickerID).find('.from-meridiem').hasClass('active')),
      toHour: $(pickerID).find('.selectpicker.to-hour').selectpicker('val'),
      toMinute: $(pickerID).find('.selectpicker.to-minute').selectpicker('val'),
      toMeridiem: mapMeridiem($(pickerID).find('.to-meridiem').hasClass('active')),
    };

    if (!_.isEqual(businessHour, defaultMdDateBusinessHour)) {
      const {
        fromHour,
        fromMinute,
        fromMeridiem,
        toHour,
        toMinute,
        toMeridiem,
        startDate,
        endDate,
      } = businessHour;

      const fromTime = `${fromHour || '00'}:${fromMinute || '00'}`;
      const toTime = `${toHour || '00'}:${toMinute || '00'}`;
      const from = moment(`${fromTime} ${fromMeridiem}`, 'HH:mm A').unix();
      const to = moment(`${toTime} ${toMeridiem}`, 'HH:mm A').unix();

      pickers.push({
        id,
        from,
        to,
        startDate,
        endDate,
        businessHour,
      });
    }
  });

  $(`${pickerID} .time-error`).addClass('d-none');

  compareDateOverlaps(pickers);
}

function makeDateHoursError() {
  makeMDDateError('.md-date-storefront', '#show-on-storefront', 'Specific date');
  makeMDDateError('.md-date-available', '#item-available', 'Specific date');
}

function addMdDayRange(group, section, index = -1) {
  let closer = '';
  const rangerID = `md-day-range-${uuidv4()}`;
  if (index === 0) {
    $(group).find('.md-day-rangers').empty();
  }
  if (index !== 0) {
    closer = `<div class="picker-close"><img src="src/images/icon-remove.svg" class="remove-ranger" data-ranger-id="${rangerID}" /></div>`;
  }
  $(group).find('.md-day-rangers').append(`
   <div class="menu-week-day md-day-ranger ${section}" id="${rangerID}">
      ${closer}
      <ul>
        <li class="week-days" id="week-day-monday" data-weekday="Monday">M</li>
        <li class="week-days" id="week-day-tuesday" data-weekday="Tuesday">TU</li>
        <li class="week-days" id="week-day-wednesday" data-weekday="Wednesday">W</li>
        <li class="week-days" id="week-day-thursday" data-weekday="Thursday">TH</li>
        <li class="week-days" id="week-day-friday" data-weekday="Friday">F</li>
        <li class="week-days" id="week-day-saturday" data-weekday="Saturday">SA</li>
        <li class="week-days" id="week-day-sunday" data-weekday="Sunday">SU</li>
      </ul>
    <div class="time-error d-none">You've already selected this day and time. Please select another time(s).</div>
    <div class="menu-from-to">
      <div class="from-to-block">
      <label>From:</label>
      <div class="form-group-block">
        <div class="form-group select-white">
        <select class="selectpicker from-hour" title="00">
          <option>01</option>
          <option>02</option>
          <option>03</option>
          <option>04</option>
          <option>05</option>
          <option>06</option>
          <option>07</option>
          <option>08</option>
          <option>09</option>
          <option>10</option>
          <option>11</option>
          <option selected>12</option>
        </select>
        </div>
        <div class="form-group select-white">
        <select class="selectpicker from-minute" title="00">
          <option selected>00</option>
          <option>01</option>
          <option>02</option>
          <option>03</option>
          <option>04</option>
          <option>05</option>
          <option>06</option>
          <option>07</option>
          <option>08</option>
          <option>09</option>
          <option>10</option>
          <option>11</option>
          <option>12</option>
          <option>13</option>
          <option>14</option>
          <option>15</option>
          <option>16</option>
          <option>17</option>
          <option>18</option>
          <option>19</option>
          <option>20</option>
          <option>21</option>
          <option>22</option>
          <option>23</option>
          <option>24</option>
          <option>25</option>
          <option>26</option>
          <option>27</option>
          <option>28</option>
          <option>29</option>
          <option>30</option>
          <option>31</option>
          <option>32</option>
          <option>33</option>
          <option>34</option>
          <option>35</option>
          <option>36</option>
          <option>37</option>
          <option>38</option>
          <option>39</option>
          <option>40</option>
          <option>41</option>
          <option>42</option>
          <option>43</option>
          <option>44</option>
          <option>45</option>
          <option>46</option>
          <option>47</option>
          <option>48</option>
          <option>49</option>
          <option>50</option>
          <option>51</option>
          <option>52</option>
          <option>53</option>
          <option>54</option>
          <option>56</option>
          <option>57</option>
          <option>58</option>
          <option>59</option>
        </select>
        </div>
        <div class="form-toggle">
        <button type="button" class="btn btn-sm btn-toggle timing from-meridiem"
          data-toggle="button" aria-pressed="false" autocomplete="off">
          <div class="handle"></div>
        </button>
        </div>
      </div>
      </div>
      <div class="from-to-block">
      <label>To:</label>
      <div class="form-group-block">
        <div class="form-group select-white">
        <select class="selectpicker to-hour" title="00">
          <option>01</option>
          <option>02</option>
          <option>03</option>
          <option>04</option>
          <option>05</option>
          <option>06</option>
          <option>07</option>
          <option>08</option>
          <option>09</option>
          <option>10</option>
          <option>11</option>
          <option>12</option>
        </select>
        </div>
        <div class="form-group select-white">
        <select class="selectpicker to-minute" title="00">
          <option>01</option>
          <option>02</option>
          <option>03</option>
          <option>04</option>
          <option>05</option>
          <option>06</option>
          <option>07</option>
          <option>08</option>
          <option>09</option>
          <option>10</option>
          <option>11</option>
          <option>12</option>
          <option>13</option>
          <option>14</option>
          <option>15</option>
          <option>16</option>
          <option>17</option>
          <option>18</option>
          <option>19</option>
          <option>20</option>
          <option>21</option>
          <option>22</option>
          <option>23</option>
          <option>24</option>
          <option>25</option>
          <option>26</option>
          <option>27</option>
          <option>28</option>
          <option>29</option>
          <option>30</option>
          <option>31</option>
          <option>32</option>
          <option>33</option>
          <option>34</option>
          <option>35</option>
          <option>36</option>
          <option>37</option>
          <option>38</option>
          <option>39</option>
          <option>40</option>
          <option>41</option>
          <option>42</option>
          <option>43</option>
          <option>44</option>
          <option>45</option>
          <option>46</option>
          <option>47</option>
          <option>48</option>
          <option>49</option>
          <option>50</option>
          <option>51</option>
          <option>52</option>
          <option>53</option>
          <option>54</option>
          <option>56</option>
          <option>57</option>
          <option>58</option>
          <option>59</option>
          <option>60</option>
        </select>
        </div>
        <div class="form-toggle">
        <button type="button" class="btn btn-sm btn-toggle timing to-meridiem"
          data-toggle="button" aria-pressed="false" autocomplete="off">
          <div class="handle"></div>
        </button>
        </div>
      </div>
      </div>
    </div>
       </div>
  `);

  $('.selectpicker').selectpicker('refresh');

  return rangerID;
}

function addMdDateRange(group, section, index = -1) {
  let closer = '';
  const rangerID = `md-date-range-${uuidv4()}`;
  if (index === 0) {
    $(group).find('.md-date-rangers').empty();
  }
  if (index !== 0) {
    closer = `<div class="picker-close"><img src="src/images/icon-remove.svg" class="remove-ranger" data-ranger-id="${rangerID}" /></div>`;
  }
  const datePickerStartDate = `datePickerStartDate-${uuidv4()}`;
  const datePickerEndDate = `datePickerEndDate-${uuidv4()}`;
  const datePickerStartDateID = `#${datePickerStartDate}`;
  const datePickerEndDateID = `#${datePickerEndDate}`;

  $(group).find('.md-date-rangers').append(`
    <div class="md-date-ranger ${section}" id="${rangerID}">
      <div class="date-range">
          ${closer}
          <div class="date-range-icon margin-right-15">
            <input id="${datePickerStartDate}" type="text" name="datepicker"
              class="startendpicker font-semibold md-start-date" placeholder="Start Date" readonly>
            <span class="down-arrow"></span>
          </div>
        <div class="margin-right-15">
          <p class="margin-top-8 font-size-16">></p>
        </div>
        <div class="date-range-icon">
          <input id="${datePickerEndDate}" type="text" name="datepicker"
            class="startendpicker font-semibold md-end-date" placeholder="End Date" readonly>
          <span class="down-arrow"></span>
        </div>
      </div>
      <div class="time-error d-none">You've already selected this day and time. Please select another time(s).</div>
      <div class="menu-from-to">
        <div class="from-to-block">
        <label>From:</label>
        <div class="form-group-block">
          <div class="form-group select-white">
          <select class="selectpicker from-hour" title="00">
            <option>01</option>
            <option>02</option>
            <option>03</option>
            <option>04</option>
            <option>05</option>
            <option>06</option>
            <option>07</option>
            <option>08</option>
            <option>09</option>
            <option>10</option>
            <option>11</option>
            <option>12</option>
          </select>
          </div>
          <div class="form-group select-white">
          <select class="selectpicker from-minute" title="00">
            <option>01</option>
            <option>02</option>
            <option>03</option>
            <option>04</option>
            <option>05</option>
            <option>06</option>
            <option>07</option>
            <option>08</option>
            <option>09</option>
            <option>10</option>
            <option>11</option>
            <option>12</option>
            <option>13</option>
            <option>14</option>
            <option>15</option>
            <option>16</option>
            <option>17</option>
            <option>18</option>
            <option>19</option>
            <option>20</option>
            <option>21</option>
            <option>22</option>
            <option>23</option>
            <option>24</option>
            <option>25</option>
            <option>26</option>
            <option>27</option>
            <option>28</option>
            <option>29</option>
            <option>30</option>
            <option>31</option>
            <option>32</option>
            <option>33</option>
            <option>34</option>
            <option>35</option>
            <option>36</option>
            <option>37</option>
            <option>38</option>
            <option>39</option>
            <option>40</option>
            <option>41</option>
            <option>42</option>
            <option>43</option>
            <option>44</option>
            <option>45</option>
            <option>46</option>
            <option>47</option>
            <option>48</option>
            <option>49</option>
            <option>50</option>
            <option>51</option>
            <option>52</option>
            <option>53</option>
            <option>54</option>
            <option>56</option>
            <option>57</option>
            <option>58</option>
            <option>59</option>
            <option>60</option>
          </select>
          </div>
          <div class="form-toggle">
          <button type="button" class="btn btn-sm btn-toggle timing from-meridiem"
            data-toggle="button" aria-pressed="false" autocomplete="off">
            <div class="handle"></div>
          </button>
          </div>
        </div>
        </div>
        <div class="from-to-block">
        <label>To:</label>
        <div class="form-group-block">
          <div class="form-group select-white">
          <select class="selectpicker to-hour" title="00">
            <option>01</option>
            <option>02</option>
            <option>03</option>
            <option>04</option>
            <option>05</option>
            <option>06</option>
            <option>07</option>
            <option>08</option>
            <option>09</option>
            <option>10</option>
            <option>11</option>
            <option>12</option>
          </select>
          </div>
          <div class="form-group select-white">
          <select class="selectpicker to-minute" title="00">
            <option>01</option>
            <option>02</option>
            <option>03</option>
            <option>04</option>
            <option>05</option>
            <option>06</option>
            <option>07</option>
            <option>08</option>
            <option>09</option>
            <option>10</option>
            <option>11</option>
            <option>12</option>
            <option>13</option>
            <option>14</option>
            <option>15</option>
            <option>16</option>
            <option>17</option>
            <option>18</option>
            <option>19</option>
            <option>20</option>
            <option>21</option>
            <option>22</option>
            <option>23</option>
            <option>24</option>
            <option>25</option>
            <option>26</option>
            <option>27</option>
            <option>28</option>
            <option>29</option>
            <option>30</option>
            <option>31</option>
            <option>32</option>
            <option>33</option>
            <option>34</option>
            <option>35</option>
            <option>36</option>
            <option>37</option>
            <option>38</option>
            <option>39</option>
            <option>40</option>
            <option>41</option>
            <option>42</option>
            <option>43</option>
            <option>44</option>
            <option>45</option>
            <option>46</option>
            <option>47</option>
            <option>48</option>
            <option>49</option>
            <option>50</option>
            <option>51</option>
            <option>52</option>
            <option>53</option>
            <option>54</option>
            <option>56</option>
            <option>57</option>
            <option>58</option>
            <option>59</option>
            <option>60</option>
          </select>
          </div>
          <div class="form-toggle">
          <button type="button" class="btn btn-sm btn-toggle timing to-meridiem"
            data-toggle="button" aria-pressed="false" autocomplete="off">
            <div class="handle"></div>
          </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  `);

  $(`${datePickerStartDateID}, ${datePickerEndDateID}`).daterangepicker({
    autoUpdateInput: false,
    minDate: new Date(),
    maxYear: parseInt(moment().format('YYYY'), 10),
    locale: {
      format: 'DD-MM-YYYY',
      applyLabel: 'Save',
    },
    title: 'Date Range',
  });

  $(`${datePickerStartDateID}, ${datePickerEndDateID}`).on('apply.daterangepicker', (_, picker) => {
    $(datePickerStartDateID).val(picker.startDate.format('DD-MM-YYYY'));
    $(datePickerEndDateID).val(picker.endDate.format('DD-MM-YYYY'));
    makeDateHoursError();
  });

  $(`${datePickerStartDateID}, ${datePickerEndDateID}`).on('cancel.daterangepicker', () => {
    $(datePickerStartDateID).val('');
    $(datePickerEndDateID).val('');
    makeDateHoursError();
  });

  $('.selectpicker').selectpicker('refresh');

  return rangerID;
}

let focusId = '';
let fdStatus = true;
let inputCheck = true;

function setFocus(elementId) {
  if (!focusId) {
    focusId = elementId;
  }
}

function triggerFocus() {
  if (focusId) {
    $(focusId).focus();
  }
}

function removeClasses(elementId) {
  const control = $(elementId).closest('.md-form-group');
  control.removeClass('md-valid-wrap').removeClass('md-invalid-wrap').removeClass('md-invalid-dd-wrap').removeClass('md-valid-dd-wrap');
}

function alphaNumericValidation(sizes, control) {
  let isValid = true;
  if (sizes) {
    sizes.forEach((s) => {
      const test = 	/^([a-zA-Z0-9]+\s)*[a-zA-Z0-9]+$/.test(s);
      if (test === false) {
        fdStatus = false;
        control.addClass('md-invalid-wrap');
        control.find('.error').text('Size name must be alphanumeric characters only');

        isValid = false;
      }
    });
  }
  return isValid;
}

function alphaNumericWithSplCharactersValidation(elementID, messageName) {
  let isValid = true;
  const fdValue = $(elementID).val().trim();
  const control = $(elementID).closest('.md-form-group');
  isValid = 	/^[a-zA-Z0-9@#$*+-^_&~:;]+$/.test(fdValue);

  if (isValid === false) {
    fdStatus = false;
    control.addClass('md-invalid-wrap');
    control.find('.error').text(`${messageName} must be alphanumeric characters only`);
  }
}

function validateIsEmpty(elementId, message = 'Can\'t be empty') {
  const fdValue = $(elementId).val().trim();
  const control = $(elementId).closest('.md-form-group');
  if (!fdValue) {
    control.addClass('md-invalid-wrap');
    control.find('.error').text(message);
    setFocus(elementId);
    fdStatus = false;
  } else {
    control.addClass('md-valid-wrap').removeClass('md-invalid-wrap');
  }
}

function validateIsDDEmpty(elementId, message = 'Can\'t be empty') {
  const formElement = $(elementId).find('.md-chips');
  const chips = getChips(formElement);
  const control = $(elementId).closest('.md-form-dd-group');
  if (chips && chips.length === 0) {
    control.addClass('md-invalid-dd-wrap');
    control.find('.error').text(message);
    setFocus(control.find('.md-form-dd-field'));
    fdStatus = false;
    if (elementId === '.pick-categories-list-chips') {
      $('#pick-category-div').addClass('d-none');
    }
  } else {
    control.addClass('md-valid-dd-wrap').removeClass('md-invalid-dd-wrap');
  }
}

function sortOrder(container) {
  const context = [];
  const data = [];
  $(container).each(function () {
    const id = $(this).data('id');
    const menuId = $(this).data('menu-id');
    data.push({ id, menuId });
  });
  context.push(data);
  return context;
}

// basic utils - end

$(document).ready(() => {
  // overview_page.html events - start
  $(() => {
    $('[data-toggle="tooltip"]').tooltip();
  });
  displayMenus(1, true);

  if ($('#oai-menus').length) {
    const oaiMenus = document.getElementById('oai-menus');
    Sortable.create(oaiMenus, {
      handle: '.sort-handle',
      draggable: '.oai-menu',
      animation: 0,
      easing: 'cubic-bezier(1, 0, 0, 1)',
      store: {
        set() {
          const data = sortOrder('.oai-menu');
          const ids = getSortableIDs(data);
          const menus = loadMenus();
          const content = mapOrder(menus, ids);
          localStorage.setItem('menus', JSON.stringify(content));
        },
      },
    });
  }

  if ($('.menu-category-view-grids').length) {
    $('.menu-category-view-grids').each(function () {
      Sortable.create($(this)[0], {
        handle: '.mcvg-sort-handle',
        draggable: '.menu-category-view-grid',
        animation: 0,
        easing: 'cubic-bezier(1, 0, 0, 1)',
        store: {
          set() {
            const data = sortOrder('.menu-category-view-grid');
            syncSortableMenuCategories(data);
          },
        },
      });
    });
  }

  if ($('.menu-category-view-lists').length) {
    $('.menu-category-view-lists').each(function () {
      Sortable.create($(this)[0], {
        handle: '.mcvl-sort-handle',
        draggable: '.menu-category-view-list',
        animation: 0,
        easing: 'cubic-bezier(1, 0, 0, 1)',
        store: {
          set() {
            const data = sortOrder('.menu-category-view-list');
            syncSortableMenuCategories(data);
          },
        },
      });
    });
  }

  if ($('.menu-category-items').length) {
    $('.menu-category-items').each(function () {
      Sortable.create($(this)[0], {
        handle: '.menu-category-item-sort-handle',
        draggable: '.menu-category-item',
        animation: 0,
        easing: 'cubic-bezier(1, 0, 0, 1)',
        store: {
          set() {
            const data = sortOrder('.menu-category-item');
            syncSortableMenuCategoryItems(data);
          },
        },
      });
    });
  }

  $(document).on('click', '#ovp-copy-menu-button', () => {
    $('#ovp-copy-menu-dialog').modal('hide');
  });

  $(document).on('click', '.import-csv-close', () => {
    $('#ovp-import-csv-dialog').modal('hide');
    $('#file-error-wrapper').empty();
  });

  function csvDropzoneInit() {
    this.on('addedfile', (file) => {
      // this.removeFile(file);
      $('#file-error-wrapper').empty();

      const fileType = file.name.split('.');

      if ((fileType[fileType.length - 1]).toLowerCase() === 'csv') {
        $('#dropzone-files').append(`<p class="dropzone-file">${file.name}</p>`);
      } else {
        $('#file-error-wrapper').html(`<div class="upload-file-error">Invalid format for CSV file. Please try again.</div>`);
      }
      // const errors = [
      //   'Error uploading file. Please try again.',
      //   'Invalid file type. Please upload file with .csv extention.',
      //   'Invalid format for CSV file. Please try again.',
      //   'No file sent. Please try again.',
      //   'File exceeds size limit. Please try again.',
      // ];
      // const error = errors[Math.floor(Math.random() * errors.length)];
      // $('#file-error-wrapper').html(`<div class="upload-file-error">${error}</div>`);
      // $('#file-error-wrapper').empty();
    });
  }

  if ($('#csv-dropzone').length) {
    $('#csv-dropzone').dropzone({
      url: '#',
      autoQueue: false,
      acceptedFiles: '.csv',
      init: csvDropzoneInit,
    });

    $('.choose-drag , .choose-drag a').dropzone({
      url: '#',
      autoQueue: false,
      acceptedFiles: '.csv',
      init: csvDropzoneInit,
    });

    $('.upload-icon img').dropzone({
      url: '#',
      autoQueue: false,
      acceptedFiles: '.csv',
      init: csvDropzoneInit,
    });
  }

  $(document).on('click', '#ovp-create-menu, .md-create-menu', (event) => {
    removeSession('editMenuID');
    removeSession('menu_add_item');
    const page = $(event.currentTarget).attr('data-page');
    if (page && page === 'add-item') {
      setSession('add_Item_InEdit', page);
      const itemName = $('#item-name').val().trim();
      const itemNamePOSID = $('#item-posID').val().trim();
      const itemDescription = $('#item-description').val().trim();
      const menus = getChips('.pick-menus-list-chips .md-chips');
      const categories = getChips('.pick-categories-list-chips .md-chips');
      const isMultipleOptions = $('#is-multiple-options').is(':checked');
      const isLeaveNotes = $('#is-leave-notes').is(':checked');
      const isMakeUpsell = $('#is-make-upsell').is(':checked');
      const isSpecialOffer = $('#is-special-offer').is(':checked');
      const minimumPerOrder = $('#minimum-per-order').selectpicker('val');
      const maximumPerOrder = $('#maximum-per-order').selectpicker('val');
      const storefront = $('input[name="show-on-storefront"]:checked').val();
      const itemAvailable = $('input[name="item-available"]:checked').val();
      const lavuPosSync = $('input[name="lavu-pos-sync"]:checked').val();
      const itemPriceType = 'category';
      const sizes = getPriceCategory();
      let advancedSettingsClickedAddItem = true;
      if ($('#items-advanced-settings-zone').hasClass('d-none')) {
        advancedSettingsClickedAddItem = false;
      }
      const items = {
        itemName,
        itemNamePOSID,
        itemDescription,
        menus,
        categories,
        isMultipleOptions,
        isLeaveNotes,
        isMakeUpsell,
        isSpecialOffer,
        minimumPerOrder,
        maximumPerOrder,
        storefront,
        itemAvailable,
        lavuPosSync,
        sizes,
        itemPriceType,
        advancedSettingsClickedAddItem,
      };
      const newData = JSON.stringify(items);
      localStorage.setItem('add_item_sessionstorage', newData);
    }
    onHistory('add_edit_menu.html');
  });

  $('a#csv-required-format').attr({
    href: 'src/storage/sample-demo-file-empty.csv',
  });

  $('a#csv-an-example').attr({
    href: 'src/storage/sample-demo-file.csv',
  });

  $('a#import-csv-required-format').attr({
    href: 'src/storage/md-import-menu-template-blank-roger_menu.csv',
  });

  $('a#import-csv-template').attr({
    href: 'src/storage/md-import-menu-template-example-roger-menu.csv',
  });

  $(document).on('click', '.edit-menu', function () {
    const id = $(this).data('id');
    setSession('editMenuID', id);
    onHistory('add_edit_menu.html');
  });

  $(document).on('click', '.delete-menu', function () {
    const id = $(this).data('id');
    setSession('deleteMenuID', id);
    $('#delete-menu-dialog').modal('show');
  });

  $(document).on('click', '.add-item', (event) => {
    removeSession('editMenuItemID');
    const menuID = $(event.currentTarget).attr('data-id');
    setSession('menu_add_item', menuID);
    onHistory('items_add_edit.html');
  });

  $(document).on('click', '#delete-menu-button', () => {
    const id = getSession('deleteMenuID');
    deleteMenu(id);
    removeSession('deleteMenuID');
    $('#delete-menu-dialog').modal('hide');
    window.location.reload();
  });

  $(document).on('click', '.view-options', function () {
    const viewType = $(this).data('view');
    const view = `#${viewType}`;
    const menu = `#${$(this).data('menu')}`;
    const option = $(this).data('option');
    $(menu).find('.views').addClass('d-none');
    $(menu).find('.view-options').removeClass('active');
    $(this).addClass('active');
    $(menu).find(view).removeClass('d-none');
    setSession(option, viewType);
  });

  $(document).on('click', '.edit-menu-item', function () {
    const id = $(this).data('id');
    setSession('editMenuItemID', id);
    setSession('items_add_edit_callback', 'items_page.html');
    onHistory('edit_item_page.html');
  });

  $(document).on('click', '.delete-menu-item', function () {
    const id = $(this).data('id');
    setSession('deleteMenuItemID', id);
    $('#delete-menu-item-dialog').modal('show');
  });

  $(document).on('click', '#delete-menu-item-button', () => {
    const id = getSession('deleteMenuItemID');
    deleteItem(id);
    removeSession('deleteMenuItemID');
    $('#delete-menu-item-dialog').modal('hide');
    window.location.reload();
  });

  // $(document).on('click', '#lock-menu-item-button', () => {
  //   const id = getSession('lockMenuItemID');
  //   lockUnlockItem(id);
  //   removeSession('lockMenuItemID');
  //   $('#lock-menu-item-dialog').modal('hide');
  //   window.location.reload();
  // });
  // overview_page.html events - end

  // add_edit_menu events - start
  let weekdayPickers = 1;

  loadEditMenu();

  $(document).on('change', '.all-day', function () {
    const id = $(this).closest('.weekday-picker').attr('id');
    const pickerID = `#${id}`;
    $(pickerID).find('.selectpicker').attr('disabled', $(this).prop('checked')).selectpicker('refresh');
    $(pickerID).find('.timing').attr('disabled', $(this).prop('checked'));
    makeHoursError();
  });

  $(document).on('click', '.to-meridiem, .from-meridiem', () => {
    makeHoursError();
    makeDayHoursError();
    makeDateHoursError();
  });

  $(document).on('change', '#special-offers', function () {
    $('#different-items-section').toggleClass('d-none', !$(this).is(':checked'));
  });

  $(document).on('click', '#add-weekday-picker', (event) => {
    if ($('.weekday-picker').length !== 7) {
      weekdayPickers += 1;
      addWeekdayPickers(weekdayPickers);
    }
    if ($('.weekday-picker').length === 7) {
      $(event.target).css('color', '#c7c7c7');
    }
  });

  $(document).on('click', '.md-add-edit-menu-go-back', () => {
    removeSession('editMenuID');
    window.history.go(-1);
  });

  $(document).on('click', '.remove-weekday-picker', function () {
    const pickerID = `#${$(this).data('picker-id')}`;
    $('#add-weekday-picker').css('color', '#f58025');
    if ($('.weekday-picker').length === 2) {
      $('.weekday-pickers').css('width', '');
    }
    $(pickerID).remove();
  });

  $(document).on('click', '.week-days', function () {
    $(this).toggleClass('active');
    const pickerID = $(this).closest('.weekday-picker').attr('id');
    const days = $(`#${pickerID} .menu-week-day ul li.active`).length;
    $(`#${pickerID} .available-all-week`).prop('checked', days === 7);
    makeHoursError();
    makeDayHoursError();
  });

  $('.md-date-available .startendpicker, .md-date-storefront .startendpicker').on('apply.daterangepicker', (ev, picker) => {
    const ranger = $(ev.target).closest('.md-date-ranger');
    $(ranger).find('.md-start-date').val(picker.startDate.format('DD-MM-YYYY'));
    $(ranger).find('.md-end-date').val(picker.endDate.format('DD-MM-YYYY'));
    makeDateHoursError();
  });

  $('.md-date-available .startendpicker, .md-date-storefront .startendpicker').on('cancel.daterangepicker', (ev) => {
    const ranger = $(ev.target).closest('.md-date-ranger');
    $(ranger).find('.md-start-date').val();
    $(ranger).find('.md-end-date').val();
    makeDateHoursError();
  });

  $(document).on('change', '.available-all-week', function () {
    const pickerID = $(this).closest('.weekday-picker').attr('id');
    $(`#${pickerID} .week-days`).toggleClass('active', $(this).is(':checked'));
    makeHoursError();
  });

  $(document).on('change', '.from-hour, .from-minute, .to-hour, .to-minute', () => {
    makeHoursError();
    makeDayHoursError();
    makeDateHoursError();
  });

  $(document).on('change', '#aem-business-hours-radio-same, #aem-business-hours-radio-different', function () {
    if ($(this).data('section') === 'different') {
      $('#aem-different-business-hours').removeClass('d-none');
      $('.warning-div').removeClass('d-none');
    } else {
      $('#aem-different-business-hours').addClass('d-none');
      $('.warning-div').addClass('d-none');
    }
    $('#menu-availability-error').addClass('d-none');
  });

  $('.warning-alert-close img').on('click', (event) => {
    $(event.target).parent().parent().addClass('d-none');
  });

  function readBusinessHour(pickerID) {
    const defaultSaveBusinessHour = {
      weekdays: [],
      isAvailableAllWeek: false,
      fromHour: '00',
      fromMinute: '00',
      fromMeridiem: mapMeridiem(false),
      toHour: '00',
      toMinute: '00',
      toMeridiem: mapMeridiem(false),
      isAllDay: false,
    };
    const businessHour = {
      weekdays: [],
      isAvailableAllWeek: $(`${pickerID} .available-all-week`).is(':checked'),
      fromHour: $(pickerID).find('.selectpicker.from-hour').selectpicker('val'),
      fromMinute: $(pickerID).find('.selectpicker.from-minute').selectpicker('val'),
      fromMeridiem: mapMeridiem($(pickerID).find('.from-meridiem').hasClass('active')),
      toHour: $(pickerID).find('.selectpicker.to-hour').selectpicker('val'),
      toMinute: $(pickerID).find('.selectpicker.to-minute').selectpicker('val'),
      toMeridiem: mapMeridiem($(pickerID).find('.to-meridiem').hasClass('active')),
      isAllDay: $(`${pickerID} .all-day`).is(':checked'),
    };
    return {
      ...defaultSaveBusinessHour,
      ...removeFalsy(businessHour),
    };
  }

  function readMenuBasic() {
    const defaultMenuBasic = {
      menuName: 'Main Menu',
      businessHoursType: 'same',
      isSpecialOffers: false,
      noOfSpecialOffers: '1',
    };
    const menuBasic = {
      menuName: $('#aem-menu-name').val().trim(),
      businessHoursType: $('input[name="aem-business-hours-radio"]:checked').val(),
      isSpecialOffers: $('#special-offers').is(':checked'),
      noOfSpecialOffers: $('#no-of-special-offers').val().trim(),
    };
    return {
      ...defaultMenuBasic,
      ...removeFalsy(menuBasic),
    };
  }

  function readMenuID() {
    const id = getSession('editMenuID');
    if (id) {
      return parseInt(id, 10);
    }
    return uuidv4();
  }

  function readMenu() {
    const businessHours = [];
    const {
      menuName,
      businessHoursType,
      isSpecialOffers,
      noOfSpecialOffers,
    } = readMenuBasic();
    if (businessHoursType === 'same') {
      const businessHour = {
        weekdays: [],
        isAvailableAllWeek: false,
        fromHour: '09',
        fromMinute: '00',
        fromMeridiem: 'AM',
        toHour: '10',
        toMinute: '00',
        toMeridiem: 'PM',
        isAllDay: false,
      };
      businessHours.push(businessHour);
    } else {
      $('.weekday-picker').each(function () {
        const pickerID = `#${$(this).attr('id')}`;
        const weekdays = [];
        $(`${pickerID} .menu-week-day ul li.active`).each(function () {
          weekdays.push($(this).data('weekday'));
        });
        const businessHour = readBusinessHour(pickerID);
        businessHours.push(businessHour);
      });
    }
    return {
      id: readMenuID(),
      menuName,
      businessHoursType,
      businessHours,
      storefront: false,
      isSpecialOffers,
      noOfSpecialOffers,
    };
  }

  function validateIsEmptyOption(name, errorID) {
    const status = $(`input:radio[name='${name}']`).is(':checked');
    if (!status) {
      $(errorID).removeClass('d-none');
      fdStatus = false;
    } else {
      $(errorID).addClass('d-none');
    }
  }

  function validateMenu() {
    focusId = '';
    fdStatus = true;

    validateIsEmpty('#aem-menu-name');
    validateIsEmptyOption('aem-business-hours-radio', '#menu-availability-error');

    triggerFocus();
    return fdStatus;
  }

  $(document).on('change, blur', '#aem-menu-name', () => {
    validateIsEmpty('#aem-menu-name');
  });

  $(document).on('keyup', '#aem-menu-name', () => {
    removeClasses('#aem-menu-name');
  });

  function validateWeekdays() {
    $('.weekday-picker').each(function () {
      const id = $(this).attr('id');
      const pickerID = `#${id}`;

      const isWeekdays = $(`${pickerID} .menu-week-day ul li.active`).length === 0;
      const isError = $(pickerID).find('.time-error:not(".d-none")').length === 0;

      if (isWeekdays && isError) {
        makeError(id, 'time-error-day', 'You\'ve not selected any day and time to keep your menu hours different from business hours.');
      }
    });
  }

  $(document).on('click', '#aem_save', () => {
    makeHoursError();
    validateWeekdays();

    const isHours = $('.time-error:not(.d-none)').length > 0;
    if (!validateMenu()) {
      return;
    }
    unSavedPage = false;
    const menu = readMenu();
    const {
      businessHoursType,
    } = menu;

    if (businessHoursType === 'different' && isHours) {
      return;
    }

    saveMenu(menu);
    removeSession('editMenuID');
    window.history.go(-1);
  });

  // add_edit_menu events - end

  // items_add_edit events - start
  loadForm();
  loadEditItemForm();

  function itemImagesDropzoneInit() {
    this.on('addedfile', (file) => {
      unSavedPage = true;
      this.removeFile(file);
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        if ($('#idz-preview .dz-setting').length < 3) {
          setDropZone('#idz-preview', reader.result);
        }
      }, false);

      if (file) {
        reader.readAsDataURL(file);
      }
    });
  }

  if ($('#item-images-dropzone').length) {
    $('#item-images-dropzone').dropzone({
      url: '#',
      autoQueue: false,
      acceptedFiles: 'image/*',
      maxFilesize: 2,
      maxFiles: 3,
      uploadMultiple: true,
      init: itemImagesDropzoneInit,
    });
  }

  $(document).on('click', '.back-to-menus', () => {
    const callback = getSession('items_add_edit_callback') || 'overview_page.html';
    removeSession('items_add_edit_callback');
    removeSession('add_Item_InEdit');
    onHistory(callback);
  });

  $(document).on('click', '.pick-modifier-item', () => {
    $('.modifier-group-item').toggleClass('d-none');
    $('#pick-modifier-list').addClass('d-none');
  });

  $(document).on('click', '.pick-modifier-item-customization, .pick-modifier-item-customization-close', function () {
    const mgID = `#${$(this).data('target')}`;
    $(mgID).toggleClass('d-none');
    const dropdownID = `#${$(this).data('dropdown')}`;
    $(dropdownID).toggleClass('d-none');
    $('#pick-modifier-list').addClass('d-none');
  });

  $(document).on('change', '#show-on-storefront, #item-available', function () {
    onWeekdayRadioButton(this);
  });

  function withDefaultMenu(menus = []) {
    const context = [...menus];
    const content = loadMenus();
    if (_.isEmpty(content)) {
      const menu = content[0] || [];
      context.push(menu.id);
    }
    return context;
  }

  function withDefaultCategory(categories = []) {
    const context = [...categories];
    const content = loadCategories();
    if (_.isEmpty(content)) {
      const category = content[0] || [];
      context.push(category.id);
    }
    return context;
  }

  function priceCheck(elementId, message = 'Can\'t be empty') {
    const fdValue = $(elementId).val().trim();
    const control = $(elementId).closest('.md-form-group');
    if (!fdValue) {
      control.addClass('md-invalid-wrap');
      control.find('.error').text(message);
      setFocus(elementId);
      inputCheck = false;
    } else {
      control.addClass('md-valid-wrap').removeClass('md-invalid-wrap');
    }
  }

  function validateItemPrice() {
    inputCheck = true;
    $('#price-per-category-section .md-form-input').each(function () {
      const inputID = `#${$(this).attr('id')}`;
      priceCheck(`#price-per-category-section ${inputID}`);
    });
    if (inputCheck === false) {
      fdStatus = false;
      $('#price-error').removeClass('d-none');
    }
  }

  function validateItemPriceEditpage() {
    inputCheck = true;
    $('#price-per-category-section-editpage .md-form-input').each(function () {
      const inputID = `#${$(this).attr('id')}`;
      priceCheck(`#price-per-category-section-editpage ${inputID}`);
    });
    if (inputCheck === false) {
      fdStatus = false;
      $('#price-error').removeClass('d-none');
    }
  }

  $(document).on('click', '.close-span', () => {
    $('#price-error').addClass('d-none');
  });

  function validateItem() {
    focusId = '';
    fdStatus = true;

    validateIsEmpty('#item-name');
    validateIsDDEmpty('.pick-menus-list-chips');
    validateIsDDEmpty('.pick-categories-list-chips');

    const itemPriceType = 'category';
    if (itemPriceType === 'item') {
      validateIsEmpty('#item-price');
    } else {
      validateItemPrice();
    }

    triggerFocus();
    return fdStatus;
  }

  function validateEditItem() {
    focusId = '';
    fdStatus = true;

    validateIsEmpty('#item-name');
    validateItemPriceEditpage();

    triggerFocus();
    return fdStatus;
  }

  function getNumberOfSizes() {
    const sizeNames = $('#size-names').val().trim();
    const sizes = [];
    let sizeNamesFormated = '';

    if (sizeNames) {
      const sizesContent = sizeNames.match(/[^,]+/g) || [];
      sizesContent.forEach((s) => {
        const size = capitalize(s.trim());
        sizes.push(size);
      });
      sizeNamesFormated = sizes.join(', ');
    }

    return {
      sizes,
      sizeNames,
      sizeNamesFormated,
    };
  }

  function validateIsSize() {
    const numberOfSizes = Number($('#number-of-sizes').val());
    const { sizes } = getNumberOfSizes();
    const control = $('#size-names').closest('.md-form-group');

    const alphaNumericValid = alphaNumericValidation(sizes, control);

    if (alphaNumericValid === true && numberOfSizes > 1) {
      if (sizes) {
        if (numberOfSizes !== sizes.length) {
          setFocus('#size-names');
          fdStatus = false;
          control.addClass('md-invalid-wrap');
          $('.error.size-name').text('Please add size names as per number of sizes selected.');
        } else {
          control.removeClass('md-invalid-wrap').addClass('md-valid-wrap');
        }
      } else {
        control.removeClass('md-invalid-wrap');
      }
    } else if (alphaNumericValid === true && numberOfSizes === 1) {
      if (sizes.length === 0 || sizes.length === 1) {
        control.removeClass('md-invalid-wrap');
      } else {
        fdStatus = false;
        control.addClass('md-invalid-wrap');
        $('.error.size-name').text('Please add size names as per number of sizes selected.');
      }
    }
  }

  function validateCategory() {
    focusId = '';
    fdStatus = true;

    validateIsEmpty('#category-name');
    alphaNumericWithSplCharactersValidation('#category-name', 'Category name');
    validateIsDDEmpty('.pick-menus-list-chips');
    validateIsSize();

    triggerFocus();
    return fdStatus;
  }

  $(document).on('change, blur', '#category-name', () => {
    validateIsEmpty('#category-name');
    alphaNumericWithSplCharactersValidation('#category-name', 'Category name');
  });

  $(document).on('keyup', '#category-name', () => {
    removeClasses('#category-name');
  });

  $(document).on('change, blur', '#size-names', () => {
    validateIsSize();
  });

  $(document).on('keyup', '#size-names', () => {
    removeClasses('#size-names');
  });

  $(document).on('keyup', '#number-of-sizes', () => {
    validateIsSize();
  });

  $(document).on('click', '.form-input-number-up', function () {
    const input = $(this).parent().parent().find('input');
    const value = parseInt(input.val(), 10) || 0;
    input.val(value + 1);
    validateIsSize();
  });

  $(document).on('click', '.form-input-number-down', function () {
    const input = $(this).parent().parent().find('input');
    const value = (parseInt(input.val(), 10) || 0) - 1;
    if (value > 0) {
      input.val(value);
      validateIsSize();
    }
  });

  $(document).on('click', '.pick-item', function () {
    const group = $(this).data('group');
    unSavedPage = true;
    if (group === 'pick-menus-list') {
      const menuID = $(this).data('id');
      validateIsDDEmpty('.pick-menus-list-chips');
      loadFormCategories(menuID);
    } else if (group === 'pick-categories-list') {
      validateIsDDEmpty('.pick-categories-list-chips');
      const categoryId = $(this).data('id');
      const category = loadCategory(categoryId);
      const section = '#price-per-category-section';
      $(section).empty();
      listCategotySizes();
      if (category && category.sizes.length > 1) {
        $('#pick-category-div').removeClass('d-none');
      }
    }
  });

  $(document).on('click', '.mdo-pick-list', function () {
    const form = $(this).closest('.mgo-form');
    const chips = form.find('.list-chips');
    unSavedPage = true;
    validateIsDDEmpty(chips);
    const group = $(this).data('group');
    if (group === 'pick-modifier-groups-list') {
      loadModifierSizes(form);
    }
  });

  $(document).on('click', '.remove-pick-item', function () {
    const formID = `#${$(this).data('form-id')}`;
    const form = $(formID);
    const listChips = form.find('.list-chips');
    let deletedMenuID;

    validateIsDDEmpty('.pick-menus-list-chips');
    validateIsDDEmpty('.pick-categories-list-chips');
    validateIsDDEmpty(listChips);
    listCategotySizes();
    loadModifierSizes(form);
    const categories = getChips('.pick-categories-list-chips .md-chips');
    $('#pick-category-div').addClass('d-none');

    if ($(this).parent().parent().attr('class') === 'pick-menus-list-chips') {
      deletedMenuID = $(this).parent().attr('data-id');
    }
    categories.forEach((categoryID) => {
      const category = loadCategory(categoryID);
      if (category.sizes.length > 1) {
        $('#pick-category-div').removeClass('d-none');
      }
      if (category.menus.includes(deletedMenuID)) {
        $(`.md-chips[data-id="${category.categoryID}"]`).remove();
      }
    });
    const menuDisplays = getChips('.pick-menus-list-chips .md-chips');
    $('#pick-categories-list .list').empty();
    menuDisplays.forEach((menuID) => {
      loadFormCategories(menuID);
    });
  });

  $(document).on('change, blur', '#item-name', () => {
    validateIsEmpty('#item-name');
  });

  $(document).on('keyup', '#item-name', () => {
    removeClasses('#item-name');
  });

  $(document).on('change, blur', '#item-price', () => {
    validateIsEmpty('#item-price');
  });

  $(document).on('keyup', '#item-price', () => {
    removeClasses('#item-price');
  });

  function withDayError(selector) {
    $(selector).each(function () {
      const id = $(this).attr('id');
      const pickerID = `#${id}`;

      const isWeekdays = $(`${pickerID} .week-days.active`).length === 0;
      const isError = $(pickerID).find('.time-error:not(".d-none")').length === 0;

      if (isWeekdays && isError) {
        makeError(id, 'time-error-day', 'You\'ve not selected any day and time to keep your menu hours different from business hours.');
      }
    });
  }

  function withDateError(selector) {
    $(selector).each(function () {
      const id = $(this).attr('id');
      const pickerID = `#${id}`;

      const isStartDate = $(pickerID).find('.md-start-date').val();
      const isEndDate = $(pickerID).find('.md-end-date').val();
      const isError = $(pickerID).find('.time-error:not(".d-none")').length === 0;

      if ((!isStartDate || !isEndDate) && isError) {
        makeError(id, 'time-error-day', 'You\'ve not selected any day and time to keep your menu hours different from business hours.');
      }
    });
  }

  function validateHours() {
    if ($('#show-on-storefront:checked').val() === 'Specific days and times') {
      withDayError('.md-day-storefront');
    }
    if ($('#item-available:checked').val() === 'Specific days and times') {
      withDayError('.md-day-available');
    }

    if ($('#show-on-storefront:checked').val() === 'Specific date') {
      withDateError('.md-date-storefront');
    }
    if ($('#item-available:checked').val() === 'Specific date') {
      withDateError('.md-date-available');
    }
  }

  function getWeekdayValues(el = '.menu-week-day') {
    const businessHours = [];

    $(el).each(function () {
      const id = $(this).attr('id');
      const pickerID = `#${id}`;
      const weekDays = [];
      $(`${pickerID} .week-days.active`).each(function () {
        weekDays.push($(this).data('weekday'));
      });
      businessHours.push({
        weekdays: weekDays,
        fromHour: $(pickerID).find('.selectpicker.from-hour').selectpicker('val'),
        fromMinute: $(pickerID).find('.selectpicker.from-minute').selectpicker('val'),
        fromMeridiem: mapMeridiem($(pickerID).find('.from-meridiem').hasClass('active')),
        toHour: $(pickerID).find('.selectpicker.to-hour').selectpicker('val'),
        toMinute: $(pickerID).find('.selectpicker.to-minute').selectpicker('val'),
        toMeridiem: mapMeridiem($(pickerID).find('.to-meridiem').hasClass('active')),
      });
    });

    return businessHours;
  }

  function getWeekdateValues(el = '.md-date-available') {
    const dateRange = [];
    $(el).each(function () {
      const id = $(this).attr('id');
      const pickerID = `#${id}`;
      dateRange.push({
        startDate: $(pickerID).find('.md-start-date').val(),
        endDate: $(pickerID).find('.md-end-date').val(),
        fromHour: $(pickerID).find('.selectpicker.from-hour').selectpicker('val'),
        fromMinute: $(pickerID).find('.selectpicker.from-minute').selectpicker('val'),
        fromMeridiem: mapMeridiem($(pickerID).find('.from-meridiem').hasClass('active')),
        toHour: $(pickerID).find('.selectpicker.to-hour').selectpicker('val'),
        toMinute: $(pickerID).find('.selectpicker.to-minute').selectpicker('val'),
        toMeridiem: mapMeridiem($(pickerID).find('.to-meridiem').hasClass('active')),
      });
    });
    return dateRange;
  }

  $(document).on('click', '#item-save', () => {
    makeDayHoursError();
    makeDateHoursError();
    validateHours();

    const isHours = $('.time-error:not(.d-none)').length > 0;
    if (!validateItem() || isHours) {
      return;
    }
    unSavedPage = false;
    const itemName = $('#item-name').val().trim();
    const itemNamePOSID = $('#item-posID').val().trim();
    const itemDescription = $('#item-description').val().trim();
    let menus = getChips('.pick-menus-list-chips .md-chips');
    let categories = getChips('.pick-categories-list-chips .md-chips');
    const itemPriceType = 'category';
    const isMultipleOptions = $('#is-multiple-options').is(':checked');
    const isLeaveNotes = $('#is-leave-notes').is(':checked');
    const isMakeUpsell = $('#is-make-upsell').is(':checked');
    const isSpecialOffer = $('#is-special-offer').is(':checked');
    const minimumPerOrder = $('#minimum-per-order').selectpicker('val');
    const maximumPerOrder = $('#maximum-per-order').selectpicker('val');
    const storefront = $('input[name="show-on-storefront"]:checked').val();
    const itemAvailable = $('input[name="item-available"]:checked').val();
    const lavuPosSync = $('input[name="lavu-pos-sync"]:checked').val();
    const thumbnail = getDropZone('#idz-preview');
    const thumbnails = getDropZones('#idz-preview');
    const sizes = getPriceCategory();
    const weekdayStorefront = getWeekdayValues('.md-day-storefront');
    const weekdateStorefront = getWeekdateValues('.md-date-storefront');
    const weekdayAvailable = getWeekdayValues('.md-day-available');
    const weekdateAvailable = getWeekdateValues('.md-date-available');

    let advancedSettingsClickedAddItem = true;
    if ($('#items-advanced-settings-zone').hasClass('d-none')) {
      advancedSettingsClickedAddItem = false;
    }

    menus = withDefaultMenu(menus);
    categories = withDefaultCategory(categories);

    const item = {
      id: parseInt(getSession('editMenuItemID'), 10),
      isLocked: !getSession('editMenuItemID'),
      thumbnail,
      thumbnails,
      itemName,
      itemNamePOSID,
      itemDescription,
      itemPriceType,
      sizes,
      isMultipleOptions,
      isLeaveNotes,
      isMakeUpsell,
      isSpecialOffer,
      minimumPerOrder,
      maximumPerOrder,
      storefront,
      itemAvailable,
      lavuPosSync,
      menus,
      categories,
      weekdayStorefront,
      weekdateStorefront,
      weekdayAvailable,
      weekdateAvailable,
      advancedSettingsClickedAddItem,
    };
    const savedItem = saveItem(item);
    const {
      id,
    } = savedItem;
    hookUpMenus(menus, id);
    hookUpItemWithCategories(categories, id);
    const callback = getSession('items_add_edit_callback') || 'overview_page.html';
    removeSession('items_add_edit_callback');
    removeSession('editMenuItemID');
    removeSession('menu_add_item');
    removeSession('add_item_sessionstorage');
    localStorage.removeItem('add_item_sessionstorage');
    onHistory(callback);
  });

  // edit Item page Code start
  $(document).ready(() => {
    $('#menu-selection').on('change', (event) => {
      const menuID = $(event.target).val();
      loadFormSelectCategories(parseInt(menuID, 10));
    });

    $('#category-selection').on('change', (event) => {
      const categoryID = $(event.target).val();
      listSelectedCategotySizes(parseInt(categoryID, 10));
      const category = loadCategory(categoryID);
      if (category && category.sizes.length > 1) {
        $('#pick-category-div').removeClass('d-none');
      } else {
        $('#pick-category-div').addClass('d-none');
      }
    });
  });

  $(document).on('click', '#item-save-edit', () => {
    makeDayHoursError();
    makeDateHoursError();
    validateHours();

    const isHours = $('.time-error:not(.d-none)').length > 0;
    if (!validateEditItem() || isHours) {
      return;
    }
    unSavedPage = false;
    const itemName = $('#item-name').val().trim();
    const itemNamePOSID = $('#item-posID').val().trim();
    const itemDescription = $('#item-description').val().trim();
    const menusValue = $('#menu-selection').selectpicker('val');
    let menus = [parseInt(menusValue, 10)];
    const categoryVal = $('#category-selection').selectpicker('val');
    let categories = [parseInt(categoryVal, 10)];
    const itemPriceType = 'category';
    const isMultipleOptions = $('#is-multiple-options').is(':checked');
    const isLeaveNotes = $('#is-leave-notes').is(':checked');
    const isMakeUpsell = $('#is-make-upsell').is(':checked');
    const isSpecialOffer = $('#is-special-offer').is(':checked');
    const minimumPerOrder = $('#minimum-per-order').selectpicker('val');
    const maximumPerOrder = $('#maximum-per-order').selectpicker('val');
    const storefront = $('input[name="show-on-storefront"]:checked').val();
    const itemAvailable = $('input[name="item-available"]:checked').val();
    const lavuPosSync = $('input[name="lavu-pos-sync"]:checked').val();
    const thumbnail = getDropZone('#idz-preview');
    const thumbnails = getDropZones('#idz-preview');
    const sizes = getPriceCategory();
    const weekdayStorefront = getWeekdayValues('.md-day-storefront');
    const weekdateStorefront = getWeekdateValues('.md-date-storefront');
    const weekdayAvailable = getWeekdayValues('.md-day-available');
    const weekdateAvailable = getWeekdateValues('.md-date-available');

    let advancedSettingsClickedAddItem = true;
    if ($('#items-advanced-settings-zone').hasClass('d-none')) {
      advancedSettingsClickedAddItem = false;
    }

    menus = withDefaultMenu(menus);
    categories = withDefaultCategory(categories);

    const item = {
      id: parseInt(getSession('editMenuItemID'), 10),
      isLocked: !getSession('editMenuItemID'),
      thumbnail,
      thumbnails,
      itemName,
      itemNamePOSID,
      itemDescription,
      itemPriceType,
      sizes,
      isMultipleOptions,
      isLeaveNotes,
      isMakeUpsell,
      isSpecialOffer,
      minimumPerOrder,
      maximumPerOrder,
      storefront,
      itemAvailable,
      lavuPosSync,
      menus,
      categories,
      weekdayStorefront,
      weekdateStorefront,
      weekdayAvailable,
      weekdateAvailable,
      advancedSettingsClickedAddItem,
    };
    const savedItem = saveItem(item);
    const {
      id,
    } = savedItem;
    hookUpMenus(menus, id);
    hookUpItemWithCategories(categories, id);
    const callback = getSession('items_add_edit_callback') || 'overview_page.html';
    removeSession('items_add_edit_callback');
    removeSession('editMenuItemID');
    removeSession('menu_add_item');
    removeSession('add_item_sessionstorage');
    localStorage.removeItem('add_item_sessionstorage');
    onHistory(callback);
  });
  // edit Item page Code end

  $(document).on('click', '.add-md-day-range', function () {
    const group = `.${$(this).data('group')}`;
    const section = $(this).data('section');
    if ($(group).find('.md-day-ranger').length === 7) {
      return false;
    } if ($(group).find('.md-day-ranger').length === 6) {
      $(this).find('.add-more-week').css('color', '#c7c7c7');
    }
    addMdDayRange(group, section, -1);

    return true;
  });

  $(document).on('click', '.add-md-date-range', function () {
    const group = `.${$(this).data('group')}`;
    const section = $(this).data('section');
    if ($(group).find('.md-date-ranger').length === 3) {
      return false;
    }
    addMdDateRange(group, section, -1);

    return true;
  });
  // items_add_edit events - end

  // items_page events - start
  displayItems();

  if ($('#items-table').length) {
    $('#items-table').dataTable({
      info: false,
      columnDefs: [{
        orderable: false,
        targets: [0],
      },
      { targets: 'table-actions', orderable: false },
      ],
      language: {
        lengthMenu: 'Show _MENU_ items per page',
      },
      dom: '<\'row\'<\'col-sm-6\'f>>'
      + '<\'row\'<\'col-sm-12\'tr>>'
      + '<\'row\'<\'col-sm-4\'><\'col-sm-4\'p><\'col-sm-4\'l>>',
    });
    $('.selectpicker').selectpicker('refresh');
    $('.dataTables_filter input').attr('placeholder', 'Find an item by name');
  }

  $(document).on('click', '.md-add-menu-item', function () {
    const callback = $(this).data('callback') || null;
    if (callback) {
      setSession('items_add_edit_callback', callback);
    }
    removeSession('editMenuItemID');
    onHistory('items_add_edit.html');
  });

  $(document).on('click', '.md-lock-unlock-status-tool', function () {
    // const dialogID = `#${$(this).data('dialog-id')}`;
    const dataID = $(this).data('id');
    const actionLabel = $(this).data('label');
    const item = loadItem(dataID) || loadModifierGroup(dataID) || loadCategory(dataID);
    if (item.isLocked === true) {
      $('#lock-label').html('Unlock Item');
      $('#lock-menu-item-button').html('Unlock');
      $('#lock-para').html(`If you unlock this ${actionLabel}, any updates will be reflected in MenuDrive only, not your POS. Please, make menu changes directly in your POS to have them reflected in both locations.`);
    } else {
      $('#lock-label').html('Lock Item');
      $('#lock-menu-item-button').html('Lock');
      $('#lock-para').html(`If you lock this ${actionLabel}, any updates will be reflected in MenuDrive only, not your
      POS. Please, make menu changes directly in your POS to have them reflected in both locations.`);
    }
    setSession('lockMenuItemID', dataID);
    $('#lock-menu-item-dialog').modal('show');
    // $(dialogID).removeClass('d-none');
  });

  $(document).on('click', '.close-lock-unlock-dialog', function () {
    const dialogID = `#${$(this).data('dialog-id')}`;
    $(dialogID).addClass('d-none');
  });

  $(document).on('click', '.md-lock-unlock-status-item', () => {
    // const dialogID = `#${$(this).data('dialog-id')}`;
    // getSession('lockMenuItemID');
    const id = getSession('lockMenuItemID');
    lockUnlockItem(id);
    removeSession('lockMenuItemID');
    displayItems();
    $('#lock-menu-item-dialog').modal('hide');
    // $(dialogID).addClass('d-none');
  });

  $(document).on('click', '.md-lock-unlock-status-menu-item', () => {
    // const dialogID = `#${$(this).data('dialog-id')}`;
    const id = getSession('lockMenuItemID');
    lockUnlockItem(id);
    removeSession('lockMenuItemID');
    $('#lock-menu-item-dialog').modal('hide');
    // $(dialogID).addClass('d-none');
    window.location.reload();
  });

  $(document).on('click', '.md-lock-unlock-status-modifier-group', () => {
    // const dialogID = `#${$(this).data('dialog-id')}`;
    const id = getSession('lockMenuItemID');
    lockUnlockModifierGroup(id);
    removeSession('lockMenuItemID');
    // $(dialogID).addClass('d-none');
    window.location.reload();
  });

  $(document).on('click', '.md-lock-unlock-status-category', () => {
    // const dialogID = `#${$(this).data('dialog-id')}`;
    const id = getSession('lockMenuItemID');
    lockUnlockCategory(id);
    displayCategories();
    removeSession('lockMenuItemID');
    $('#lock-menu-item-dialog').modal('hide');
    // $(dialogID).addClass('d-none');
  });

  // items_page events - end

  // categories_page events - start
  $(document).on('click', '.md-add-category', (event) => {
    removeSession('editCategoryID');
    removeSession('menu_add_item');
    const page = $(event.currentTarget).data('page');
    if (page && page === 'add-item') {
      setSession('add_Item_InEdit', page);
      const itemName = $('#item-name').val().trim();
      const itemNamePOSID = $('#item-posID').val().trim();
      const itemDescription = $('#item-description').val().trim();
      const menus = getChips('.pick-menus-list-chips .md-chips');
      const categories = getChips('.pick-categories-list-chips .md-chips');
      const isMultipleOptions = $('#is-multiple-options').is(':checked');
      const isLeaveNotes = $('#is-leave-notes').is(':checked');
      const isMakeUpsell = $('#is-make-upsell').is(':checked');
      const isSpecialOffer = $('#is-special-offer').is(':checked');
      const minimumPerOrder = $('#minimum-per-order').selectpicker('val');
      const maximumPerOrder = $('#maximum-per-order').selectpicker('val');
      const storefront = $('input[name="show-on-storefront"]:checked').val();
      const itemAvailable = $('input[name="item-available"]:checked').val();
      const lavuPosSync = $('input[name="lavu-pos-sync"]:checked').val();
      const itemPriceType = 'category';
      const sizes = getPriceCategory();
      let advancedSettingsClickedAddItem = true;
      if ($('#items-advanced-settings-zone').hasClass('d-none')) {
        advancedSettingsClickedAddItem = false;
      }
      const items = {
        itemName,
        itemNamePOSID,
        itemDescription,
        menus,
        categories,
        isMultipleOptions,
        isLeaveNotes,
        isMakeUpsell,
        isSpecialOffer,
        minimumPerOrder,
        maximumPerOrder,
        storefront,
        itemAvailable,
        lavuPosSync,
        sizes,
        itemPriceType,
        advancedSettingsClickedAddItem,
      };
      const newData = JSON.stringify(items);
      localStorage.setItem('add_item_sessionstorage', newData);
    }
    onHistory('category_add_edit.html');
  });
  // categories_page events - end

  // category_add_edit events - start
  displayCategories();
  loadEditCategory();

  function categoryDropzoneInit() {
    this.on('addedfile', (file) => {
      this.removeFile(file);
      unSavedPage = true;
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        if ($('#cdz-preview .dz-setting').length < 3) {
          setDropZone('#cdz-preview', reader.result);
        }
      }, false);

      if (file) {
        reader.readAsDataURL(file);
      }
    });
  }

  if ($('#category-dropzone').length) {
    $('#category-dropzone').dropzone({
      url: '#',
      autoQueue: false,
      acceptedFiles: 'image/*',
      maxFilesize: 2,
      maxFiles: 3,
      uploadMultiple: true,
      init: categoryDropzoneInit,
    });
  }

  if ($('#category-table').length) {
    $('#category-table').dataTable({
      info: false,
      columnDefs: [{
        orderable: false,
        targets: [0],
      },
      { targets: 'table-actions', orderable: false },
      ],
      language: {
        lengthMenu: 'Show _MENU_ categories per page',
      },
      dom: '<\'row\'<\'col-sm-6\'f>>'
      + '<\'row\'<\'col-sm-12\'tr>>'
      + '<\'row\'<\'col-sm-4\'><\'col-sm-4\'p><\'col-sm-4\'l>>',
    });
    $('.selectpicker').selectpicker('refresh');
    $('.dataTables_filter input').attr('placeholder', 'Find an category by name');
  }

  $(document).on('click', '.edit-category', function () {
    const id = $(this).data('id');
    setSession('editCategoryID', id);
    onHistory('category_add_edit.html');
  });

  $(document).on('click', '.delete-category', function () {
    const id = $(this).data('id');
    $(`actions-${id}`).addClass('d-none');
    setSession('deleteCategoryID', id);
    $('#delete-category-dialog').modal('show');
  });

  $(document).on('click', '#delete-category-button', () => {
    const id = getSession('deleteCategoryID');
    deleteCategory(id);
    removeSession('deleteCategoryID');
    displayCategories();
    $('#delete-category-dialog').modal('hide');
  });

  $(document).on('click', '.md-back-to-category', () => {
    onHistory('categories_page.html');
  });

  function saveCategoryEvent(cat, menus) {
    const category = {
      ...cat,
    };
    const editCategoryID = getSession('editCategoryID');
    const editCategory = loadCategory(editCategoryID);
    if (!_.isEmpty(editCategory)) {
      category.id = parseInt(editCategoryID, 10);
      category.items = editCategory.items;
      category.isLocked = editCategory.isLocked;
    }
    saveCategory(category);
    hookUpCategoryWithMenus(menus, category.id);
    removeSession('editCategoryID');
  }

  $(document).on('click', '#save-category', () => {
    if (!validateCategory()) {
      return;
    }
    unSavedPage = false;
    const categoryName = $('#category-name').val().trim();
    const categoryDescription = $('#category-description').val().trim();
    let menus = getChips('.pick-menus-list-chips .md-chips');
    const numberOfSizes = $('#number-of-sizes').val().trim();
    const categoryDropzone = getDropZone('#cdz-preview');
    const categoryDropzones = getDropZones('#cdz-preview');
    const storefront = $('#category-display').prop('checked') ? 'Always' : 'Never';

    menus = withDefaultMenu(menus);
    const { sizes, sizeNames, sizeNamesFormated } = getNumberOfSizes();

    const category = {
      id: uuidv4(),
      isLocked: false,
      categoryName,
      categoryDescription,
      menus,
      numberOfSizes,
      sizeNames: sizeNamesFormated || sizeNames,
      sizes,
      storefront,
      categoryDropzone,
      categoryDropzones,
      items: [],
    };
    saveCategoryEvent(category, menus);
    window.history.go(-1);
  });
  // category_add_edit events - end

  // modifier group events - start

  // function displayItemCustomization() {
  //   const defaultModifierGroups = [{
  //     id: uuidv4(),
  //     modifierGroupName: 'Salad Dressing',
  //   },
  //   {
  //     id: uuidv4(),
  //     modifierGroupName: 'Modifier group name',
  //   },
  //   ];
  //   const modifierGroups = loadModifierGroups();
  //   const node = '#item-customization';
  //   let content = '';
  //   if (!_.isEmpty(modifierGroups)) {
  //     content += basicItemCustomization(modifierGroups);
  //     content += makeItemCustomization(modifierGroups);
  //   } else {
  //     content += basicItemCustomization(defaultModifierGroups);
  //     content += makeItemCustomization(defaultModifierGroups);
  //   }
  //   $(node).html(content);
  // }

  displayModifierGroups();
  // displayItemCustomization();

  if ($('.md-options-body').length) {
    mdOptionsBody = $('.md-options-body').sortable({
      group: 'md-options-body',
      containerSelector: '.md-options-body',
      itemSelector: '.md-option',
      handle: '.option-sort-handle',
      onDrop: ($item, container, _super) => {
        const data = mdOptionsBody.sortable('serialize').get();
        const content = getSortableMDOptionsIDs(data);
        Object.keys(content).forEach((modifierGroupID) => {
          const orderOptions = content[parseInt(modifierGroupID, 10)];
          const modifierGroup = loadModifierGroup(modifierGroupID);
          const options = modifierGroup.options || [];
          modifierGroup.options = mapOrder(options, orderOptions);
          saveModifierGroup(modifierGroup);
        });
        _super($item, container);
      },
    });
  }

  if ($('.md-options-table').length) {
    $('.md-options-table').dataTable({
      info: false,
      columnDefs: [{
        orderable: false,
        targets: [0],
      },
      { targets: 'table-actions', orderable: false },
      ],
      language: {
        lengthMenu: 'Show _MENU_ options per page',
      },
      dom: '<\'row\'<\'col-sm-6\'f>>'
      + '<\'row\'<\'col-sm-12\'tr>>'
      + '<\'row\'<\'col-sm-4\'><\'col-sm-4\'p><\'col-sm-4\'l>>',
    });
    $('.selectpicker').selectpicker('refresh');
    $('.dataTables_filter input').attr('placeholder', 'Find an option by name');
  }

  $(document).on('click', '.add-modifier-group', () => {
    removeSession('editModifierGroupID');
    onHistory('modifier_group_add_edit.html');
  });

  $(document).on('change', '.selectpicker.md-group-dropdown, .toppings-matrix', function () {
    const value = $(this).val();
    const option = `#${value}`;
    $('#md-min-max-zone').toggleClass('d-none', ['md-radio-button-option', 'md-dropdown-option'].includes(value));
    const group = `.${$(this).data('group')}`;
    $(group).addClass('d-none');
    $(option).removeClass('d-none');
    $('#maximum').closest('.md-form-group').removeClass('md-invalid-wrap');
    $('#minimum').closest('.md-form-group').removeClass('md-invalid-wrap');
  });

  $(document).on('change', '#is-item-customization', function () {
    $('#item-customization-zone').toggleClass('d-none', !$(this).is(':checked'));
  });

  $(document).on('change', '.modifier-group-checkbox', function () {
    withModifierGroupCheckbox(this);
  });

  $(document).ready(() => {
    const categories = loadCategories();
    categories.forEach((category) => {
      let {
        sizeNames,
      } = category;
      const {
        numberOfSizes,
        sizes,
        id,
      } = category;
      let checkboxId;
      sizeNames = sizeNames.toLowerCase().replace(/\s+/g, '');
      if (numberOfSizes === '1' && sizeNames === 'onesize') {
        checkboxId = `size-1-${id}`;
        if ($(`#is-item-customization-${checkboxId}`).is(':checked') === true) {
          $(`#item-customization-zone-${checkboxId}`).removeClass('d-none');
        }
      } else if (numberOfSizes === '1' && sizeNames !== 'onesize') {
        checkboxId = `${sizeNames}-${id}`;
        if ($(`#is-item-customization-${checkboxId}`).is(':checked') === true) {
          $(`#item-customization-zone-${checkboxId}`).removeClass('d-none');
        }
      } else {
        sizes.forEach((size) => {
          const name = size.toLowerCase().replace(/\s+/g, '');
          checkboxId = `${name}-${id}`;
          if ($(`#is-item-customization-${checkboxId}`).is(':checked') === true) {
            $(`#item-customization-zone-${checkboxId}`).removeClass('d-none');
          }
        });
      }
    });
  });

  $(document).on('click', '#is-items-advanced-settings', () => {
    $('#items-advanced-settings-zone').toggleClass('d-none');
  });

  $(document).on('keypress', '#custom-label-name', function (event) {
    const keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode === 13) {
      const label = $(this).val().trim();
      const labelID = `custom-label-${uuidv4()}`;
      $('#md-custom-toppings-list').append(`
				<div class="none-line md-custom-topping" id="${labelID}">
					<form enctype="multipart/form-data">
						<input type="file" data-id="${labelID}" class="custom-label-preview" accept="image/gif, image/jpeg, image/png" style="display: none" />
					</form>
					<span class="none-close"><img data-id="${labelID}" class="remove-custom-label-name" alt="close" src="src/images/icon-close.svg"></span>
					<span class="none-label">${label}</span>
					<span class="image-box custom-label-preview-tool" data-id="${labelID}"><img alt="import" src="src/images/icon-import-color.svg"></span>
								<a href="#" data-id="${labelID}" class="d-none remove-preview">Remove image</a>
				</div>
			`);
      $(this).val('');
    }
  });

  $(document).on('change', '.custom-label-preview', function () {
    const files = $(this).prop('files');
    if (files && files.length) {
      const labelID = `#${$(this).data('id')}`;
      const file = files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        $(labelID).find('.custom-label-preview-tool img').attr('src', reader.result);
        $(labelID).find('.remove-preview').removeClass('d-none');
      }, false);

      if (file) {
        reader.readAsDataURL(file);
      }
    }
  });

  $(document).on('click', '.custom-label-preview-tool', function () {
    const labelID = `#${$(this).data('id')}`;
    $(labelID).find('.custom-label-preview').trigger('click');
  });

  $(document).on('click', '.remove-preview', function () {
    const labelID = `#${$(this).data('id')}`;
    $(labelID).find('.custom-label-preview-tool img').attr('src', 'src/images/icon-import-color.svg');
    $(labelID).find('.remove-preview').addClass('d-none');
  });

  $(document).on('click', '.remove-custom-label-name', function () {
    const labelID = `#${$(this).data('id')}`;
    $(labelID).remove();
    const customOptions = $('#md-custom-toppings-list').children().length;
    if (customOptions <= 3) {
      $('.md-none .error-span').text('');
    }
  });

  $(document).on('click', '.modifier-option-remove', function () {
    $(this).parent().remove();
  });

  $(document).on('click', '#cancel-modifier-group', () => {
    removeSession('editModifierGroupID');
    onHistory('modifier_page.html');
  });

  $(document).on('click', '.add-modifier-options h3', (event) => {
    let modifierGroupID = $(event.currentTarget).attr('data-id');
    modifierGroupID = modifierGroupID.split('-');
    localStorage.setItem('add_modifier_options', modifierGroupID[1]);
    setSession('addModifierGroupOptionID', 'modifier_options_add_edit.html');
    removeSession('editModifierGroupOptionID');
    onHistory('modifier_options_add_edit.html');
  });

  function saveModifierGroupEvent(modGroup = {}) {
    const modifierGroup = {
      ...modGroup,
    };
    const editModifierGroupID = getSession('editModifierGroupID');
    const editModifierGroup = loadModifierGroup(editModifierGroupID);
    if (editModifierGroup) {
      modifierGroup.id = parseInt(editModifierGroupID, 10);
      modifierGroup.options = editModifierGroup.options;
      modifierGroup.isLocked = editModifierGroup.isLocked;
    }
    saveModifierGroup(modifierGroup);
  }

  function validateCustomOptionsCheck(displayValue) {
    if (displayValue === 'md-toppings-matrix-option') {
      const toppingsMatrixOption = $('input[name="md-toppings-matrix-option"]:checked').val();
      if (toppingsMatrixOption === 'md-sub-group-custom-option') {
        const customOptions = $('#md-custom-toppings-list').children().length;
        if (customOptions > 3) {
          $('.md-none .error-span').text('Only 3 custom matrix are allowed, or 4 included None.');
          fdStatus = false;
        }
      }
    }
  }

  function validateModifierGroup(displayValue) {
    focusId = '';
    fdStatus = true;
    validateIsEmpty('#modifier-group-name');
    if (displayValue === 'md-checkbox-option' || displayValue === 'md-quantity-sign-option' || displayValue === 'md-toppings-matrix-option') {
      validateIsEmpty('#minimum');
      validateIsEmpty('#maximum');
    }
    validateCustomOptionsCheck(displayValue);

    triggerFocus();
    return fdStatus;
  }

  $(document).on('change, blur', '#modifier-group-name', () => {
    validateIsEmpty('#modifier-group-name');
  });

  $(document).on('keyup', '#modifier-group-name', () => {
    removeClasses('#modifier-group-name');
  });

  $(document).on('click', '#save-modifier-group', () => {
    const displayOption = $('.md-group-dropdown').selectpicker('val');
    if (!validateModifierGroup(displayOption)) {
      return;
    }
    unSavedPage = false;
    let sizes = ['None'];
    const modifierGroupName = $('#modifier-group-name').val().trim() || 'Choice of Sides';
    const minimum = $('#minimum').val().trim() || '1';
    const maximum = $('#maximum').val().trim() || '4';
    const toppingsMatrixOption = $('input[name="md-toppings-matrix-option"]:checked').val();

    if (displayOption === 'md-toppings-matrix-option') {
      if (toppingsMatrixOption === 'md-sub-group-custom-option') {
        $('.md-custom-topping').each(function () {
          const size = capitalize($(this).find('.none-label').text());
          if (sizes.indexOf(size) === -1) {
            sizes.push(size);
          }
        });
      } else {
        sizes = ['None', '1st Half', 'Whole', '2nd Half'];
      }
    } else {
      sizes = '';
    }

    const modifierGroup = {
      id: uuidv4(),
      modifierGroupName,
      displayOption,
      minimum,
      maximum,
      isLocked: true,
      sizes,
      toppingsMatrixOption,
    };
    saveModifierGroupEvent(modifierGroup);
    removeSession('editModifierGroupID');
    window.history.go(-1);
  });
  // modifier group events - end

  // modifier group/options add/edit events - start

  loadModifierOptionsForm();
  loadEditModifierGroup();
  loadEditModifierOptionsForm();

  $(document).on('click', '.back-to-modifier-groups', () => {
    removeSession('addModifierGroupOptionID');
    onHistory('modifier_page.html');
  });

  function makeModifierGroupName(modifierGroupName = '') {
    let name = `${modifierGroupName} - copy`;
    let counter = 1;
    while (loadModifierGroupByName(name)) {
      name = `${modifierGroupName} - copy ${counter}`;
      counter += 1;
    }
    return name;
  }

  $(document).on('click', '.copy-modifier-group', function () {
    const id = $(this).data('id');
    const modifierGroup = loadModifierGroup(id);

    if (modifierGroup) {
      modifierGroup.id = parseInt(uuidv4(), 10);
      modifierGroup.modifierGroupName = makeModifierGroupName(modifierGroup.modifierGroupName);
      const options = modifierGroup.options || [];
      const copyOptions = [];
      $.each(options, (_, option) => {
        const {
          modifierGroups,
        } = option;
        const copyModifierGroups = [...modifierGroups];
        copyModifierGroups.push(id);
        copyOptions.push({
          ...option,
          modifierGroups: copyModifierGroups,
        });
      });
      modifierGroup.options = copyOptions;
      saveModifierGroup(modifierGroup);
      window.location.reload();
    }
  });

  $(document).on('click', '.edit-modifier-group', function () {
    const id = $(this).data('id');
    setSession('editModifierGroupID', id);
    onHistory('modifier_group_add_edit.html');
  });

  $(document).on('click', '.delete-modifier-group', function () {
    const id = $(this).data('id');
    setSession('deleteModifierGroupID', id);
    $('#delete-modifier-group-dialog').modal('show');
  });

  $(document).on('click', '#delete-modifier-group-button', () => {
    const id = getSession('deleteModifierGroupID');
    deleteModifierGroup(id);
    removeSession('deleteModifierGroupID');
    $('#delete-modifier-group-dialog').modal('hide');
    window.location.reload();
  });

  $(document).on('click', '.mdg-option-delete', function () {
    const modifierGroupID = $(this).data('md-id');
    const optionID = $(this).data('option-id');
    setSession('deleteModifierGroupOptionID', JSON.stringify({
      modifierGroupID,
      optionID,
    }));

    $('#delete-modifier-group-option-dialog').modal('show');
  });

  $(document).on('click', '.mdg-option-edit', function () {
    const modifierGroupID = $(this).attr('data-md-id');
    const optionID = $(this).attr('data-option-id');
    setSession('editModifierGroupOptionID', JSON.stringify({
      modifierGroupID,
      optionID,
    }));
    onHistory('modifier_options_add_edit.html');
  });

  $(document).on('click', '#delete-modifier-group-option-button', () => {
    const option = getSession('deleteModifierGroupOptionID');
    if (option) {
      deleteModifierGroupOption(JSON.parse(option));
      removeSession('deleteModifierGroupOptionID');
      $('#delete-modifier-group-option-dialog').modal('hide');
      window.location.reload();
    }
  });

  $(document).on('click', '.option-dropzone', function () {
    const dropzoneID = `#${$(this).data('id')}`;
    $(dropzoneID).trigger('click');
  });

  $(document).on('change', '.option-preview', function () {
    const files = $(this).prop('files');
    const formID = `#${$(this).data('form-id')}`;
    if (!_.isEmpty(files)) {
      $.each(files, (_, file) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          // $(formID).find('.option-preview').attr('data-preview', reader.result);
          if ($(`${formID} .modz-preview`).children('div').length < 3) {
            setDropZone(`${formID} .modz-preview`, reader.result);
          }
        }, false);

        if (file) {
          reader.readAsDataURL(file);
        }
      });
    }
  });

  function fetchModifierGroups(nodes = []) {
    const modifierGroups = [];
    nodes.each(function () {
      modifierGroups.push($(this).data('id'));
    });
    return modifierGroups;
  }

  function fetchModifierGroupOption(modifierGroup = [], modifierOption = {}) {
    const options = modifierGroup.options || [];
    const {
      id: optionID,
    } = modifierOption;
    const content = options.filter((o) => parseInt(o.id, 10) !== parseInt(optionID, 10));
    content.unshift(modifierOption);
    return content;
  }

  function syncUPModifierGroups(modifierGroups = [], modifierOption = {}) {
    $.each(modifierGroups, (_, modifierGroupID) => {
      const modifierGroup = loadModifierGroup(modifierGroupID);
      if (modifierGroup) {
        modifierGroup.options = fetchModifierGroupOption(modifierGroup, modifierOption);
        saveModifierGroup(modifierGroup);
      }
    });
  }

  function readModifierGroupPrices(form) {
    const sizes = [];

    $(form).find('#mgo-price-category .md-price-par-size').each(function () {
      const key = $(this).data('size');
      const price = $(this).find('.md-input').val().trim() || 0;
      const posID = $(this).find('.md-pos').val().trim();

      sizes.push({
        [key]: {
          price,
          posID,
        },
      });
    });

    return sizes;
  }

  function readModifierGroupOptions(form) {
    const formID = $(form).attr('id');
    const defaultModifierGroupOption = {
      id: uuidv4(),
      modifierOptionName: 'Almond',
      modifierOptionDescription: 'Almond',
      modifierOptionPrice: '15',
      modifierOptionPOSID: '275765',
      thumbnail: 'src/images/generic-item.jpg',
    };

    const modifierOptionName = $(form).find('#modifier-option-name').val();
    const modifierOptionDescription = $(form).find('#modifier-option-description').val();
    const modifierGroups = fetchModifierGroups($(form).find('.md-chips'));
    const modifierOptionPrice = $(form).find('#modifier-option-price').val();
    const modifierOptionPOSID = $(form).find('#modifier-option-pos-id').val();
    const thumbnail = getDropZone(`#${formID} .modz-preview`);
    const thumbnails = getDropZones(`#${formID} .modz-preview`);
    const modifierOptionID = $(form).data('id');

    const isAllowExtra = $(form).find('#is-allow-extra').prop('checked');
    const extraModiferPrice = $(form).find('#extra-modifier-price').val().trim();
    const isIncludedItemPrice = $(form).find('#is-included-item-price').prop('checked');
    const isShowPricesOptions = $(form).find('#is-show-prices-options').prop('checked');
    const storefront = $(form).find('#display-option').prop('checked') ? 'Always' : 'Never';

    const sizes = readModifierGroupPrices(form);

    const modifierGroupOption = {
      id: parseInt(modifierOptionID, 10),
      modifierOptionName,
      modifierOptionDescription,
      modifierGroups,
      modifierOptionPrice,
      modifierOptionPOSID,
      thumbnail,
      thumbnails,
      isAllowExtra,
      extraModiferPrice,
      isIncludedItemPrice,
      isShowPricesOptions,
      sizes,
      storefront,
    };

    return {
      ...defaultModifierGroupOption,
      ...removeFalsy(modifierGroupOption),
    };
  }

  function validateModifierGroupInputs(formID) {
    $(`${formID} #mgo-price-category .md-form-input`).each(function () {
      const inputID = `#${$(this).attr('id')}`;
      validateIsEmpty(`${formID} #mgo-price-category ${inputID}`);
    });
  }

  function validateModifierGroupOptions() {
    focusId = '';
    fdStatus = true;

    $('.mgo-form').each(function () {
      const formID = `#${$(this).attr('id')}`;
      validateIsEmpty(`${formID} #modifier-option-name`);
      validateIsDDEmpty(`${formID} .list-chips`);

      validateModifierGroupInputs(formID);
    });

    triggerFocus();
    return fdStatus;
  }

  $(document).on('change, blur', '#modifier-option-name', (e) => {
    const formID = `#${e.target.getAttribute('data-form')}`;
    validateIsEmpty(`${formID} #modifier-option-name`);
  });

  $(document).on('keyup', '#modifier-option-name', (e) => {
    const formID = `#${e.target.getAttribute('data-form')}`;
    removeClasses(`${formID} #modifier-option-name`);
  });

  $(document).on('change, blur', '.md-form-input', (e) => {
    const form = e.target.getAttribute('data-form');
    const formID = `#${form}`;
    let input = `#${e.target.getAttribute('id')}`;
    if (form) {
      input = `${formID} ${input}`;
    }
    validateIsEmpty(input);
  });

  $(document).on('keyup', '.md-form-input', (e) => {
    const form = e.target.getAttribute('data-form');
    const formID = `#${form}`;
    let input = `#${e.target.getAttribute('id')}`;
    if (form) {
      input = `${formID} ${input}`;
    }
    removeClasses(input);
  });

  $(document).on('click', '#save-modifier-group-options', () => {
    if (!validateModifierGroupOptions()) {
      return;
    }
    $('.mgo-form').each(function () {
      const modifierGroupOption = readModifierGroupOptions(this);
      if (modifierGroupOption) {
        const {
          modifierGroups,
        } = modifierGroupOption;
        syncUPModifierGroups(modifierGroups, modifierGroupOption);
      }
    });
    removeSession('addModifierGroupOptionID');
    onHistory('modifier_page.html');
  });

  $(document).on('click', '#add-modifier-group-option-form', () => {
    // if ($('.mgo-form').length === 3) {
    //   return false;
    // }
    const formID = uuidv4();
    const dropzoneID = `mgof-dr-${uuidv4()}`;
    $('#modifier-group-option-forms').append(`
			<div class="md-items-addedit-box mgo-form" id="${formID}">
				<div class="md-field">
					<div class="menu-name-input-type">
            <div class="textfield md-form-group">
              <div class="form-group">
                <div class="modifier-group-input">
                  <input type="text" class="md-form-field md-input" id="modifier-option-name"
                    placeholder="Option name (e.g. Chips)" data-form="${formID}">
                  <img data-toggle="tooltip" data-placement="right" title=""
                    data-original-title="Add options to this modifier group. For example, if your modifier group is Choice of Side, options might be chips or coleslaw."
                    src="src/images/icon-info-lightgrey.svg">
                </div>
                <div class="error">Can't be empty</div>
              </div>
            </div>
            <div class="textfield md-form-group">
                          <div class="form-group">
                            <div class="modifier-group-input">
                              <input type="text" class="md-form-field md-input md-input-grey" id="option-posID"
                                placeholder="Main POS ID" data-form="${formID}">
                              <img data-toggle="tooltip" data-placement="right" title=""
                                data-original-title="Required only if you are integrating MenuDrive with a POS system. Main POS ID represents the name or ID of the option in your POS system."
                                src="src/images/icon-info-lightgrey.svg">
                            </div>
                            <div class="error">Can't be empty</div>
                            <p class="font-size-10 margin-top-8">Edit this field only if you have a POS integration, the POS ID should match the PLU ID in your POS.</p>
                          </div>
                        </div>
						<!-- Description -->
						<div class="form-group md-description">
							<h2>Description</h2>
							<p>Optional</p>
							<textarea id="modifier-option-description" placeholder="Bag of potato chips."></textarea>
							<p class="counter"><span class="currentValueLength">0</span>/<span class="totalValueLength">600</span></p>
						</div>
						<div class="add-textfield margin-bottom-70 md-form-dd-group">
            <div class="tool-tip-div">
            <h2>Nested Modifiers</h2>
            <div class="tool-wrap">
              <div class="tool-parent">
                  <img src="./src/images/icon-info-lightgrey.svg">
                 <div class="tool-show-wrap">
                    <div class="tool-show">
                       <p>Nested modifiers let your patrons customize their options. For example, in a modifier group called “Sides,” a “Chips” option might have a nested modifier of “Chips Flavor,” with choices like “Sour Cream and Onion” and “Bacon.”
                       </p>
                    </div>
                 </div>
              </div>
           </div>
          </div>
              <div class="textfield-search">
                <input type="text" class="md-form-dd-field" placeholder="Select nested modifiers">
                <!--<img alt="search" class="search-icon" src="src/images/icn-search-m.svg">-->
                <img alt="search" class="dropdown-icon mdo-toggle" data-target="pick-modifier-groups-list"
                  src="src/images/icon-dropdown.svg">
              </div>
              <div class="list-chips"></div>
              <div class="pick-menu pick-list d-none pick-modifier-groups-list">
                <h2>Pick Modifier Group</h2>
                <ul class="list"></ul>
                <button class="md-btn-primary border-radius-4 add-modifier-group" type="button">+ Create
                  Modifier Group</button>
              </div>
              <div class="error">Can't be empty</div>
            </div>
            <div class="md-modifier-sizes" id="mgo-price-category">
              <div class="md-price-pos">
                <div class="md-price-block md-form-group">
                  <h2>Price</h2>
                  <div class="price-tag">
                    <div class="price">$</div>
                    <input type="text" class="md-form-field md-input md-form-input" id="modifier-option-price" data-form="${formID}">
                  </div>
                  <div class="error">Can't be empty</div>
                </div>
                <div class="md-pos-block">
                <div class="tool-tip-div">
                <p class="pos-label">POS ID</p>
                <div class="tool-wrap">
                  <div class="tool-parent">
                     <img src="./src/images/icon-info-lightgrey.svg">
                     <div class="tool-show-wrap">
                        <div class="tool-show">
                           <p>Required only if you are integrating MenuDrive with a POS system. Main POS ID represents the name or ID of the option in your POS system.
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
              </div>
                  <div class="pos-tag">
                    <input type="text" placeholder="275765" id="modifier-option-pos-id">
                  </div>
                  <p class="pos-tag-label">Edit this field only if you have a POS integration, the POS ID should match the PLU ID in your POS.</p>
                </div>
              </div>
            </div>
            <div class="on-off-block margin-bottom-70">
                    <label class="switch">
                      <input type="checkbox" id="display-option">
                      <span class="slider round"><span class="switch-on font-normal">off</span></span>
                    </label>
                    <div class="label">
                      Display this option on your storefront
                    </div>
                  </div>
            <div class="md-advanced-settings">
              <h2 class="moae-advanced-settings">Advanced Settings</h2>
              <div class="md-advanced-settings-checkbox d-none" id="moae-advanced-settings-section">
                <div class="md-as-checkbox-one">
                  <div class="form-group md-checkbox">
                    <input type="checkbox" id="is-allow-extra" value="checkbox">
                    <span class="md-checkbox-icon"></span>
                    <label for="checkbox" class="margin-left-15 padding-left-15 padding-right-15">
                    Allow extra
                    </label>
                  </div>
                    <p>
                      This can be useful when customers order a pizza and they would like to add extra cheese.
                    </p>
                    <h5>A price for extra will be equal to a modifier price multiplied by:</h5>
                    <input type="text" id="extra-modifier-price" placeholder="ex.2">
                </div>
                <div class="md-as-checkbox-two">
                  <div class="form-group md-checkbox">
                    <input type="checkbox" id="is-included-item-price" value="checkbox">
                    <span class="md-checkbox-icon"></span>
                    <label for="checkbox" class="margin-left-15 padding-left-15 padding-right-15">
                    Included in the item price
                    </label>
                  </div>
                  <p>
                    Check if this modifier is already included in the item. For example, if you have a Pepperoni Pizza, then the Pepperoni modifier should be marked as Included. This modifier will then be pre-selected on the half topping matrix under the Whole option. The customer can still customize this modifier by choosing the None, Left, and Right options.
                  </p>
                </div>
                <div class="md-as-checkbox-one">
                  <div class="form-group md-checkbox">
                    <input type="checkbox" id="is-show-prices-options" value="checkbox">
                    <span class="md-checkbox-icon"></span>
                    <label for="checkbox" class="margin-left-15 padding-left-15 padding-right-15">
                    Show prices next to options
                    </label>
                  </div>
                </div>
              </div>
            </div>
					</div>
				</div>
				<div class="mdo-zone">
          <div class="d-flex justify-content-end mb-2"><img class="mg-option-remove" data-form="${formID}" alt="remove" src="src/images/icon-remove.svg" /></div>
					<div class="md-image option-dropzone" data-id="${dropzoneID}">
						<div class="popup-items-imege">
							<div class="images-upload">
								<div class="images-icon">
									<img alt="file" class="file-icon" src="src/images/icon-file-image-o.svg">
									<img alt="file" src="src/images/icon-file-upload.svg">
								</div>
								<div class="images-description">
									You can upload up to 3 images in JPEG, GIF, or PNG format. Each must be under 2 MB.
								</div>
							</div>
						</div>
					</div>
					<div class="images-preview modz-preview"></div>
				</div>
				<div class="fallback">
					<form class="images-upload modifier-option-dropzone" enctype="multipart/form-data">
						<input type="file" data-preview="src/images/generic-item.jpg" data-form-id="${formID}" class="option-preview" id="${dropzoneID}" accept="image/gif, image/jpeg, image/png" style="display: none" multiple />
					</form>
				</div>
			</div>
		`);

    loadModifierOptionsForm(`#${formID}`);
    return true;
  });
  // modifier_options_add_edit events - end

  // modifier_table events - start
  if ($('#modifier-table').length) {
    $('#modifier-table').dataTable({
      info: false,
    });
    $('.selectpicker').selectpicker('refresh');
    $('.dataTables_filter input').attr('placeholder', 'Find a modifier by name');
  }
  // modifier_table events - end

  $(document).on('click', '.export-menu', () => {
    exportMenuStatus += 1;

    $('.ems-toast').toast('hide');
    if (exportMenuStatus === 1) {
      $('#ems-confirmation').toast('show');
    } else if (exportMenuStatus > 1) {
      $('#ems-registered').toast('show');
    }
  });

  $(document).on('click', '.upload-continue', () => {
    const files = $('.dropzone-file').length;
    if (files === 0) {
      const error = 'Please upload a file with .csv extention.';
      $('#file-error-wrapper').html(`<div class="upload-file-error">${error}</div>`);
      return;
    }
    onHistory('overview_page_confirm_import_menu.html');
  });

  function loadMoreCategoryGrid(id) {
    const menuID = `#menu-${id}`;
    // loadMenu used to load data from the local storage.
    // backend developer can hit APIs here in order to fetch more data from the API server
    const menu = loadMenu(id);
    if (menu) {
      const { categories } = menu;
      const menuCategoriesItems = makeCategoriesWithItems(categories);
      const content = makeCategoryGridView(menuCategoriesItems, id, menuID, true);
      $(menuID).find('#view-grid').html(content);
    }
  }

  function loadMoreCategoryList(id) {
    const menuID = `#menu-${id}`;
    // loadMenu used to load data from the local storage.
    // backend developer can hit APIs here in order to fetch more data from the API server
    const menu = loadMenu(id);
    if (menu) {
      const { categories } = menu;
      const menuCategoriesItems = makeCategoriesWithItems(categories);
      const content = makeCategoryListView(menuCategoriesItems, id, menuID, true);
      $(menuID).find('#view-list .menu-category-view-lists').html(content);
    }
  }

  function loadMoreItemGrid(menuID, categoryID) {
    const menuContainerID = `#menu-${menuID}`;
    const categoryContainerID = `#collapse-grid-accordion-${categoryID}`;
    // loadMenu used to load data from the local storage.
    // backend developer can hit APIs here in order to fetch more data from the API server
    const menu = loadMenu(menuID);
    if (menu) {
      const { categories } = menu;
      const items = makeCategoriesWithItems(categories);
      if (items) {
        const category = items[categoryID];
        if (category) {
          const { categoryItems } = category;
          const content = makeItemsGridView(
            categoryItems,
            menuID,
            menuContainerID,
            categoryID,
            true,
          );
          $(menuContainerID).find(categoryContainerID).find('.row').html(content);
        }
      }
    }
  }

  function loadMoreItemList(menuID, categoryID) {
    const menuContainerID = `#menu-${menuID}`;
    const categoryContainerID = `#collapse-list-accordion-${categoryID}`;
    // loadMenu used to load data from the local storage.
    // backend developer can hit APIs here in order to fetch more data from the API server
    const menu = loadMenu(menuID);
    if (menu) {
      const { categories } = menu;
      const items = makeCategoriesWithItems(categories);
      if (items) {
        const category = items[categoryID];
        if (category) {
          const { categoryItems } = category;
          const content = makeItemsListView(
            categoryItems,
            menuID,
            menuContainerID,
            categoryID,
            true,
          );
          $(menuContainerID).find(categoryContainerID).html(content);
        }
      }
    }
  }

  $(document).on('click', '.more-category--grid', function () {
    const id = $(this).data('menu-id');
    loadMoreCategoryGrid(id);
  });

  $(document).on('click', '.more-category--list', function () {
    const id = $(this).data('menu-id');
    loadMoreCategoryList(id);
  });

  $(document).on('click', '.more-item--grid', function () {
    const menuID = $(this).data('menu-id');
    const categoryID = $(this).data('category-id');
    loadMoreItemGrid(menuID, categoryID);
  });

  $(document).on('click', '.more-item--list', function () {
    const menuID = $(this).data('menu-id');
    const categoryID = $(this).data('category-id');
    loadMoreItemList(menuID, categoryID);
  });

  $(document).on('click', '.md-item-price', function () {
    const section = `#price-per-${$(this).val()}-section`;
    $('.price-per-sections').addClass('d-none');
    $(section).removeClass('d-none');
  });

  $('.more-data').on('hidden.bs.collapse', function () {
    $(this).parent().find('.more-price').removeClass('d-none');
  });

  $(document).on('click', '.more-price', function () {
    $(this).addClass('d-none');
  });

  $(document).on('click', '.moae-advanced-settings', function () {
    $(this).next('#moae-advanced-settings-section').toggleClass('d-none');
  });

  $(document).on('click', '.mg-option-remove', function () {
    const form = `#${$(this).data('form')}`;
    $(form).remove();
  });

  const browserZoomLevel = Math.round((window.devicePixelRatio * 100) / 2);

  overviewDocument = $(window);
  overviewDocument.scroll(() => {
    if (browserZoomLevel === 100) {
      if ($(document).height() - overviewDocument.height() === overviewDocument.scrollTop()) {
        menuPage += 1;
        displayMenus();
      }
    } else if (browserZoomLevel !== 100) {
      if (overviewDocument.scrollTop() > 300) {
        menuPage += 1;
        displayMenus();
      }
    }
  });
});

$(':input, textarea').keyup(() => {
  unSavedPage = true;
});

$('.selectpicker').change(() => {
  unSavedPage = true;
});

$(document).on('click', '.nav-tabs', (event) => {
  navigationLink = $(event.target).data('link');
  navigationModal = $(event.target).data('target');
  removeSession('add_Item_InEdit');
  removeSession('editMenuItemID');
  if (unSavedPage === true) {
    $(navigationModal).removeClass('d-none');
    $(navigationModal).modal('show');
  } else {
    onHistory(navigationLink);
  }
});

$(document).on('click', '#navigate-away-continue', () => {
  removeSession('add_Item_InEdit');
  removeSession('editMenuItemID');
  onHistory(navigationLink);
});

$(document).on('keyup', '.md-description textarea, .md-input', (event) => {
  const incrementLength = $(event.currentTarget).val().length;
  $(event.currentTarget).parent().find('.currentValueLength').text(incrementLength);
});

function ascendingSort(a, b) {
  return ($(b).text().toUpperCase()) < ($(a).text().toUpperCase()) ? 1 : -1;
}

$('.md-form-dd-field').keyup(function (event) {
  const mdoToggle = $(this).parent().find('img').hasClass('mdo-toggle');
  const mdToggle = $(this).parent().find('img').hasClass('md-toggle');
  const fieldID = $(this).attr('id');
  if (mdToggle && fieldID !== 'modifier-search-field') {
    const target = `#${$(this).parent().find('img').data('target')}`;
    if ($(target).hasClass('d-none')) {
      $(target).removeClass('d-none');
    }
  } else if (mdoToggle) {
    if ($(this).closest('.add-textfield').find('.pick-list').hasClass('d-none')) {
      $(this).closest('.add-textfield').find('.pick-list').removeClass('d-none');
    }
  } else if (fieldID === 'modifier-search-field') {
    const target = `#${$(this).parent().find('img').data('target')}`;
    const value = $(this).val().toLowerCase();
    if ($(target).hasClass('d-none')) {
      $(target).removeClass('d-none');
    }
    $('#modifier-dropdown ul li').addClass('d-none');
    $('#modifier-groups .card-large-text').addClass('d-none');
    if (value === '') {
      $('#modifier-dropdown ul li').removeClass('d-none');
      $('#modifier-groups .card-large-text').removeClass('d-none');
    } else {
      $('#modifier-dropdown ul li').each((index, item) => {
        const name = $(item).text().toLowerCase();
        if (name.indexOf(value) > -1) {
          $(item).removeClass('d-none');
        } else {
          $(item).addClass('d-none');
        }
      });
      $('#modifier-dropdown ul li').sort(ascendingSort).appendTo('#modifier-dropdown ul');
      $('#modifier-groups .card-large-text').each((index, item) => {
        const name = $(item).find('.modifier-nav h2').text().toLowerCase();
        if (name.indexOf(value) > -1) {
          $(item).removeClass('d-none');
        } else {
          $(item).addClass('d-none');
        }
      });
    }
    const code = (event.keyCode ? event.keyCode : event.which);
    if (code === 13) {
      $(target).addClass('d-none');
      event.preventDefault();
    }
  }
});

$(document).on('click', '#modifier-dropdown ul li', (event) => {
  const dataID = $(event.target).attr('data-id');
  const name = $(event.target).text();
  $('#modifier-search-field').val(name);
  $('#modifier-groups .card-large-text').addClass('d-none');
  $(`#${dataID}`).removeClass('d-none');
  $('#modifier-dropdown').addClass('d-none');
});

$(document).on('click', '.table-more-actions', (event) => {
  $('.actions-dropdown').addClass('d-none');
  const id = $(event.target).attr('data-id');
  $(`#${id}`).removeClass('d-none');
});

$(document).on('click', '.visbility-category', (event) => {
  const id = $(event.target).data('id');
  $(`actions-${id}`).addClass('d-none');
  const categoryItem = loadCategory(id);
  if (categoryItem.storefront.toLowerCase() === 'never') {
    $('#visibility-heading').html('Show on storefront');
    $('#visibility-para').html('Are you sure you want to make this category(s) visible on your storefront?');
  } else {
    $('#visibility-heading').html('Hide on storefront');
    $('#visibility-para').html('Are you sure you want to hide this category(s) on your storefront?');
  }
  setSession('visibleCategoryID', id);
  $('#visibility-dialog').modal('show');
});

$(document).on('click', '.visbility-items', (event) => {
  const id = $(event.target).data('id');
  const visibleBtn = $(event.target).attr('data-visibleStatus');
  $(`actions-${id}`).addClass('d-none');

  if (visibleBtn.toLowerCase() === 'visible') {
    $('#visibility-heading').html('Show on storefront');
    $('#visibility-para').html('Are you sure you want to make this item(s) visible on your storefront?');
  } else {
    $('#visibility-heading').html('Hide on storefront');
    $('#visibility-para').html('Are you sure you want to hide this item(s) on your storefront?');
  }
  setSession('visibleItemID', id);
  setSession('visibleStatusItem', visibleBtn);
  $('#visibility-dialog').modal('show');
});

$(document).on('click', '.visible-category-btn', () => {
  const categoryID = getSession('visibleCategoryID');
  const categoryItem = loadCategory(categoryID);
  if (categoryItem.storefront.toLowerCase() === 'never') {
    categoryItem.storefront = 'Always';
    $('#success-msg-div').removeClass('d-none');
    $('#success-msg').html(`<strong>Success!</strong> This ${categoryItem.categoryName} is now visible on your storefront.`);
  } else {
    categoryItem.storefront = 'Never';
    $('#success-msg-div').removeClass('d-none');
    $('#success-msg').html(`<strong>Success!</strong> This ${categoryItem.categoryName} is now hidden on your storefront.`);
  }
  $('html, body').animate({
    scrollTop: 0,
  }, 300);
  saveCategory(categoryItem);
  removeSession('visibleCategoryID');
  displayCategories();
  $('#visibility-dialog').modal('hide');
  setTimeout(() => {
    $('#success-msg-div').addClass('d-none');
  }, 5000);
});

$(document).on('click', '.mdg-option-visible', (event) => {
  const modifierGroupID = $(event.target).data('md-id');
  const optionID = $(event.target).data('option-id');
  const modifierGroup = loadModifierGroup(modifierGroupID);
  if (modifierGroup) {
    let options = [];
    if (modifierGroup && modifierGroup.options) {
      options = modifierGroup.options;
    }
    const index = options.findIndex((i) => i.id === optionID);
    if (index !== -1) {
      if (options[`${index}`].storefront.toLowerCase() === 'never') {
        $('#visibility-heading').html('Show on storefront');
        $('#visibility-para').html('Are you sure you want to make this option(s) visible on your storefront?');
      } else {
        $('#visibility-heading').html('Hide on storefront');
        $('#visibility-para').html('Are you sure you want to hide this option(s) on your storefront?');
      }
    }
  }
  setSession('visibleModifierGroupOptionID', JSON.stringify({
    modifierGroupID,
    optionID,
  }));
  $('#visibility-dialog').modal('show');
});

$(document).on('click', '.visibile-options-btn', () => {
  const option = getSession('visibleModifierGroupOptionID');
  if (option) {
    updateModifierGroupOption(JSON.parse(option));
    removeSession('visibleModifierGroupOptionID');
    $('#visibility-dialog').modal('hide');
    displayModifierGroups();
  }
});

$(document).on('click', '.visibility-item-btn', () => {
  const itemID = getSession('visibleItemID');
  const itemVisibility = getSession('visibleStatusItem');
  const item = loadItem(itemID);
  if (itemVisibility.toLowerCase() === 'visible') {
    item.storefront = 'always';
    $('#success-msg-div').removeClass('d-none');
    $('#success-msg').html(`<strong>Success!</strong> This ${item.itemName} is now visible on your storefront.`);
  } else {
    item.storefront = 'never';
    $('#success-msg-div').removeClass('d-none');
    $('#success-msg').html(`<strong>Success!</strong> This ${item.itemName} is now hidden on your storefront.`);
  }
  $('html, body').animate({
    scrollTop: 0,
  }, 300);
  saveItem(item);
  removeSession('visibleItemID');
  removeSession('visibleStatusItem');
  displayItems();
  $('#visibility-dialog').modal('hide');
  setTimeout(() => {
    $('#success-msg-div').addClass('d-none');
  }, 5000);
});

$('.md-categories-table-checkbox').on('click', (event) => {
  if ($(event.target).prop('checked')) {
    $('.md-categories-checkbox').each((index, checkbox) => {
      $(checkbox).prop('checked', true);
    });
  } else {
    $('.md-categories-checkbox').each((index, checkbox) => {
      $(checkbox).prop('checked', false);
    });
  }
});

$('.md-items-table-checkbox').on('click', (event) => {
  if ($(event.target).prop('checked')) {
    $('.md-items-checkbox').each((index, checkbox) => {
      $(checkbox).prop('checked', true);
    });
  } else {
    $('.md-items-checkbox').each((index, checkbox) => {
      $(checkbox).prop('checked', false);
    });
  }
});

$(document).on('click', '.md-options-table-checkbox', (event) => {
  if ($(event.target).prop('checked')) {
    $('.md-options-checkbox').each((index, checkbox) => {
      $(checkbox).prop('checked', true);
    });
  } else {
    $('.md-options-checkbox').each((index, checkbox) => {
      $(checkbox).prop('checked', false);
    });
  }
});

$(document).on('click', '.filter-btn, .filter-btn .btn-inactive img', (event) => {
  const divId = $(event.target).attr('data-id');
  $(`#${divId}`).removeClass('d-none');
});

$(document).on('click', '.clear-filter-btn', () => {
  $('.lock-unlock-radio').each((index, element) => {
    $(element).prop('checked', false);
  });
});

$(document).on('click', '.close-filter-btn', (event) => {
  const divId = $(event.target).attr('data-id');
  $(`#${divId}`).addClass('d-none');
});
