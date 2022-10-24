function showLoading() {
  const div = document.createElement("div");
  div.classList.add("loading", "centralize");
  document.body.appendChild(div);

  const label = document.createElement("label");
  label.innerText = "Carregando...";

  div.appendChild(label);
}

function hideLoading() {
  const loadings = document.getElementsByClassName("loading");
  if (loadings.length) {
    loadings[0].remove();
  }
}
