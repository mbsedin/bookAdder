class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  //Add book to list
  addBookToList(book) {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="delete">X</a></td>
    `;
    const list = document.getElementById("book-list");
    list.appendChild(row);
  }

  // Clear input fields
  clearFields() {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("isbn").value = "";
  }

  // Show alert
  showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert ${className}`;
    div.appendChild(document.createTextNode(message));

    const form = document.querySelector("#book-form");
    form.insertAdjacentElement("beforebegin", div);

    setTimeout(function () {
      document.querySelector(".alert").remove();
    }, 3000);
  }

  // Delete book on page
  deleteBook(target) {
    if (target.className === "delete") {
      target.parentElement.parentElement.remove();
    }
  }
}

// LOCAL STORAGE
class Store {
  // Get from localStorage
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  // Add to localStorage
  static addBooks(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  // Display book
  static displayBooks() {
    const books = Store.getBooks();
    const ui = new UI();
    books.forEach((book) => {
      ui.addBookToList(book);
    });
  }

  // Delete from localStorage
  static removeBook(isbn) {
    const books = Store.getBooks();
    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}

// DOM LOAD EVENT
document.addEventListener("DOMContentLoaded", Store.displayBooks());

// FORM SUBMIT
document.getElementById("book-form").addEventListener("submit", function (e) {
  e.preventDefault();

  //get inputs' values
  const title = document.getElementById("title").value,
    author = document.getElementById("author").value,
    isbn = document.getElementById("isbn").value;

  // Instantiate book interface
  const ui = new UI();

  // input fields validation
  if (title === "" || author === "" || isbn === "") {
    // Show alert
    ui.showAlert("Please fill in all fields", "error");
  } else {
    // Instantiate a book
    const book = new Book(title, author, isbn);

    // Add book to list
    ui.addBookToList(book);

    // clear input fields
    ui.clearFields();

    // Show alert
    ui.showAlert("Book Added!!", "success");

    // Add to localStorage
    Store.addBooks(book);
  }
});

document.getElementById("book-list").addEventListener("click", function (e) {
  e.preventDefault();
  const ui = new UI();
  ui.deleteBook(e.target);
  ui.showAlert("Book removed!", "success");
});
