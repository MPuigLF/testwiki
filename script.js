let articles = [];

// Añadir artículo
function addArticle() {
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;

  if (!title || !content) {
    alert("Completa todos los campos");
    return;
  }

  const article = {
    id: Date.now(),
    title,
    content
  };

  articles.push(article);
  renderArticles();

  document.getElementById("title").value = "";
  document.getElementById("content").value = "";
}

// Renderizar artículos
function renderArticles() {
  const container = document.getElementById("articles");
  container.innerHTML = "";

  articles.forEach(article => {
    const div = document.createElement("div");
    div.classList.add("article");

    div.innerHTML = `
      <h3>${article.title}</h3>
      <p>${article.content}</p>
      <button class="delete-btn" onclick="deleteArticle(${article.id})">Eliminar</button>
    `;

    container.appendChild(div);
  });
}

// Eliminar artículo
function deleteArticle(id) {
  articles = articles.filter(a => a.id !== id);
  renderArticles();
}

// Buscar artículos
document.getElementById("searchInput").addEventListener("input", function(e) {
  const value = e.target.value.toLowerCase();
  const filtered = articles.filter(a =>
    a.title.toLowerCase().includes(value) ||
    a.content.toLowerCase().includes(value)
  );

  renderFiltered(filtered);
});

function renderFiltered(list) {
  const container = document.getElementById("articles");
  container.innerHTML = "";

  list.forEach(article => {
    const div = document.createElement("div");
    div.classList.add("article");

    div.innerHTML = `
      <h3>${article.title}</h3>
      <p>${article.content}</p>
    `;

    container.appendChild(div);
  });
}

// Datos iniciales
for (let i = 1; i <= 5; i++) {
  articles.push({
    id: i,
    title: "Artículo " + i,
    content: "Contenido de ejemplo número " + i
  });
}

renderArticles();
