function onChangeDate() {
  const date = form.date().value;
  form.dateRequired().style.display = !date ? "block" : "none";
  toggleSaveButton();
}

function onChangeValue() {
  const value = form.value().value;
  form.valueRequired().style.display = !value ? "block" : "none";
  form.valueInvalid().style.display = value <= 0 ? "block" : "none";
  toggleSaveButton();
}

function onChangeTransaction() {
  const transaction = form.transaction().value;
  form.transactionRequired().style.display = !transaction ? "block" : "none";
  toggleSaveButton();
}

function toggleSaveButton() {
  form.saveButton().disabled = !isFormValid();
}

function isFormValid() {
  const date = form.date().value;
  if (!date) {
    return false;
  }

  const value = form.value().value;
  if (!value || value <= 0) {
    return false;
  }

  const transaction = form.transaction().value;
  if (!transaction) {
    return false;
  }
  return true;
}

const form = {
  date: () => document.getElementById("date"),
  dateRequired: () => document.getElementById("date-required-error"),
  value: () => document.getElementById("value"),
  valueRequired: () => document.getElementById("value-required-error"),
  valueInvalid: () => document.getElementById("value-invalid-error"),
  transaction: () => document.getElementById("transaction"),
  transactionRequired: () =>
    document.getElementById("transaction-required-error"),
  saveButton: () => document.getElementById("save-button"),
};
