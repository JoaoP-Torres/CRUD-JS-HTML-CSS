function logout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      window.location.href = "../index.html";
    })
    .catch(() => {
      alert("Erro ao fazer Logout");
    });
}

function newTransaction() {
  window.location.href = "../views/transactions.html";
}

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    findTransactions(user);
  }
});

function findTransactions(user) {
  showLoading();
  firebase
    .firestore()
    .collection("transactions")
    .where("user.uid", "==", user.uid)
    .orderBy("date", "desc")
    .get()
    .then((snapshot) => {
      hideLoading();
      const transactions = snapshot.docs.map((doc) => doc.data());
      addTransactionsToScreen(transactions);
    })
    .catch((error) => {
      hideLoading();
      console.log(error.message);
    });
}

function addTransactionsToScreen(transactions) {
  const orderedList = document.getElementById("transactions");

  transactions.forEach((transaction) => {
    const li = document.createElement("li");
    li.classList.add(transaction.type);

    const date = document.createElement("p");
    date.innerHTML = formatDate(transaction.date);
    li.appendChild(date);

    const money = document.createElement("p");
    money.innerHTML = formatMoney(transaction.money);
    li.appendChild(money);

    const type = document.createElement("p");
    type.innerHTML = transaction.transactionType;
    li.appendChild(type);

    if (transaction.description) {
      const description = document.createElement("p");
      description.innerHTML = transaction.description;
      li.appendChild(description);
    }

    orderedList.appendChild(li);
  });
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("pt-br");
}

function formatMoney(money) {
  return `${money.currency} ${money.value.toFixed(2)}`;
}
