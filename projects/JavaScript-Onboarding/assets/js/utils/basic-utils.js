function formsToJson(primaryForm = [], secondaryForm = []) {
  if (primaryForm && secondaryForm) {
    return {
      id: uuidv4(),
      ...formToJson(primaryForm),
      ...formToJson(secondaryForm),
    }
  }
  return {};
}

function formToJson(form = []) {
  let content = {};
  if (form && form.length) {
    form.forEach(({ name, value }) => {
      content[name] = value;
    });
  }
  return content;
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function history(url) {
	$(location).attr('href', url);
}
