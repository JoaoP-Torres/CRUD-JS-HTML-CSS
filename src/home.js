function logout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      window.location.href = "../index.html";
    })
    .catch(() => {
      alert("Erro ao fazer logout");
    });
}
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    findTransactions(user);
  }
});
function newTransaction() {
  window.location.href = "../views/transactions.html";
}
function findTransactions(user) {
  showLoading();
  transactionService
    .findByUser(user)
    .then((transaction) => {
      hideLoading();
      addTransactionsToScreen(transaction);
    })
    .catch((error) => {
      hideLoading();
      console.log(error);
      alert("Erro ao recuperar transacoes");
    });
}
function addTransactionsToScreen(transactions) {
  const orderedList = document.getElementById("transactions");

  transactions.forEach((transaction) => {
    const li = creationTransactionListItem(transaction);

    li.appendChild(createDeleteButton(transaction));

    li.appendChild(createParagraph(formatDate(transaction.date)));
    li.appendChild(createParagraph(formatMoney(transaction.money)));
    li.appendChild(createParagraph(transaction.transactionType));
    if (transaction.description) {
      li.appendChild(createParagraph(transaction.description));
    }
    orderedList.appendChild(li);
  });
}

function creationTransactionListItem(transaction) {
  const li = document.createElement("li");
  li.classList.add(transaction.type);
  li.id = transaction.uid;
  li.addEventListener("click", () => {
    window.location.href = "transactions.html?uid=" + transaction.uid;
  });
  return li;
}

function createDeleteButton(transaction) {
  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = "Remover";
  deleteButton.classList.add("outline", "danger");
  deleteButton.addEventListener("click", (event) => {
    event.stopPropagation();
    askRemoveTransaction(transaction);
  });
  return deleteButton;
}

function createParagraph(value) {
  const element = document.createElement("p");
  element.innerHTML = value;
  return element;
}

function askRemoveTransaction(transaction) {
  const shouldRemove = confirm("Deseja remover a transa??ao?");
  if (shouldRemove) {
    removeTransaction(transaction);
  }
}

function removeTransaction(transaction) {
  showLoading();

  transactionService
    .remove(transaction)
    .then(() => {
      hideLoading();
      document.getElementById(transaction.uid).remove();
    })
    .catch((error) => {
      hideLoading();
      console.log(error);
      alert("Erro ao remover transa??ao");
    });
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("pt-br");
}
function formatMoney(money) {
  return `${money.currency} ${money.value.toFixed(2)}`;
}
