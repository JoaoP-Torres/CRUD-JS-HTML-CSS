if (!isNewTransaction()) {
  const uid = getTransactionUid();
  findTransactionByUid(uid);
}

function getTransactionUid() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("uid");
}

function isNewTransaction() {
  return getTransactionUid() ? false : true;
}

function findTransactionByUid(uid) {
  showLoading();

  transactionService
    .findByUid(uid)
    .then((transaction) => {
      hideLoading();
      if (transaction) {
        fillTransactionsScreen(transaction);
        toggleSaveButton();
      } else {
        alert("doc não encontrado");
        window.location.href = "home.html";
      }
    })
    .catch(() => {
      hideLoading();
      alert("Erro ao recuperar documento");
      window.location.href = "home.html";
    });
}

function fillTransactionsScreen(transaction) {
  if (transaction.type == "expense") {
    form.typeExpense().checked = true;
  } else {
    form.typeIncome().checked = true;
  }

  form.date().value = transaction.date;
  form.currency().value = transaction.money.currency;
  form.value().value = transaction.money.value;
  form.transactionType().value = transaction.transactionType;
  form.description().value = transaction.description;
}

function saveTransaction() {
  showLoading();

  const transaction = createTransaction();

  if (isNewTransaction()) {
    save(transaction);
  } else {
    update(transaction);
  }
}

function update(transaction) {
  showLoading();
  transactionService
    .update(transaction)
    .then(() => {
      hideLoading();
      window.location.href = "home.html";
    })
    .catch(() => {
      hideLoading();
      alert("Error ao atualizar transação");
    });
}

function save(transaction) {
  transactionService
    .save(transaction)
    .then(() => {
      hideLoading();
      window.location.href = "home.html";
    })
    .catch(() => {
      hideLoading();
      alert("Error ao Salvar");
    });
}

function createTransaction() {
  return {
    type: form.typeExpense().checked ? "expense" : "income",
    date: form.date().value,
    money: {
      currency: form.currency().value,
      value: parseFloat(form.value().value),
    },
    transactionType: form.transactionType().value,
    description: form.description().value,
    user: {
      uid: firebase.auth().currentUser.uid,
    },
  };
}

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
  const transaction = form.transactionType().value;
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

  const transaction = form.transactionType().value;
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
  transactionType: () => document.getElementById("transaction"),
  transactionRequired: () =>
    document.getElementById("transaction-required-error"),
  saveButton: () => document.getElementById("save-button"),
  typeExpense: () => document.getElementById("expense"),
  typeIncome: () => document.getElementById("income"),
  currency: () => document.getElementById("currency"),
  description: () => document.getElementById("description"),
};
