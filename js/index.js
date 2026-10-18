const BASE_URL = "http://localhost:8000";
const API_URL = `${BASE_URL}/api`;

const form = document.getElementById("form");
const booklist = document.getElementById("booklist");
const coverInput = document.getElementById("cover-input");
const coverPreview = document.getElementById("preview");

coverInput.addEventListener("change", (event) => {
  event.preventDefault();

  const file = coverInput.files[0];

  if (file) {
    coverPreview.src = URL.createObjectURL(file);
  }
});

const loadBooks = async () => {
  const response = await fetch(`${API_URL}/books`);
  const books = await response.json();

  booklist.innerHTML = "";

  for (let book of books) {
    const card = document.createElement("div");
    card.className = "book-card";

    const cover = book.cover_image
      ? `<img class="book-cover" src="${BASE_URL}${book.cover_image} ">`
      : `<div>No cover</div>`;

    card.innerHTML = `
        ${cover}
        <div>
            <p>Title: ${book.title}</p>
            <p>Author: ${book.author}</p>
            <p>Synopsis: ${book.synopsis}</p>
            <p>Price: ${Number(book.price)}</p>
            <p>Rating: ${Number(book.rating)}</p>
        </div>
        <div class="buttons">
            <a href="edit.html?id=${book.id}">Edit</a>
            <button class="delete-button">Delete</button>
        </div>
    `;

    booklist.appendChild(card);
    card.querySelector(".delete-button").addEventListener("click", () => {
      deleteBook(book.id);
    });
  }
};

const deleteBook = async (bookId) => {
  const response = await fetch(`${API_URL}/books/delete/${bookId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    alert("Book successfully deleted");
    loadBooks();
  } else {
    alert("Book deletion failed");
  }
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = new FormData(form);

  if (data.get("cover").size === 0) {
    data.delete("cover");
  }

  const response = await fetch(`${API_URL}/books/create`, {
    method: "POST",
    body: data,
  });

  if (response.ok) {
    alert("Book successfully added");
    loadBooks();
  } else {
    alert("Book creation failed");
  }
});

loadBooks();
