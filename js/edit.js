const BASE_URL = "http://localhost:8000";
const API_URL = `${BASE_URL}/api`;

const bookId = new URLSearchParams(window.location.search).get("id");

const coverInput = document.getElementById("cover-input");
const coverPreview = document.getElementById("preview");
const form = document.getElementById("form");

coverInput.addEventListener("change", (event) => {
  event.preventDefault();

  const file = coverInput.files[0];

  if (file) {
    coverPreview.src = URL.createObjectURL(file);
  }
});

const loadBooks = async () => {
  if (!bookId) {
    alert("No book selected");
    window.location.replace("index.html");
    return;
  }

  const response = await fetch(`${API_URL}/books/${Number(bookId)}`);

  const book = await response.json();

  document.getElementById("id").innerHTML = `Book Number ${book.id}`;

  document.getElementById("title").value = book.title;
  document.getElementById("author").value = book.author;
  document.getElementById("synopsis").value = book.synopsis;
  document.getElementById("price").value = book.price;
  document.getElementById("rating").value = book.rating;

  coverPreview.src = `${BASE_URL}${book.cover_image}`;
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = new FormData(form);

  if (data.get("cover").size === 0) {
    data.delete("cover");
  }

  const response = await fetch(`${API_URL}/books/edit/${bookId}`, {
    method: "PUT",
    body: data,
  });

  if (response.ok) {
    alert("Book successfully edited");
    window.location.replace("index.html");
    return;
  } else {
    alert("Book creation failed");
  }
});

loadBooks();
