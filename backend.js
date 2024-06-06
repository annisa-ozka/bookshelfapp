const kunciStorage = "BOOK_STORAGE_KEY";
let rakBuku = [];
const renderBuku = "render_book";
const eventSimpan = "saved_book";

function cekStorage() {
  if (typeof Storage === undefined) {
    alert("Maaf Aplikasi Ini Tidak Dapat Dijalankan Karena Browser Anda Tidak Memiliki Web Storage");
    return false;
  }
  return true;
}

function simpanData() {
  if (cekStorage()) {
    localStorage.setItem(kunciStorage, JSON.stringify(rakBuku));
    document.dispatchEvent(new Event(eventSimpan));
  }
}

function masukkanBuku(event) {
  event.preventDefault();
  const id_buku = +new Date();
  const namaBuku = document.getElementById("inputBookTitle").value;
  const penulis = document.getElementById("inputBookAuthor").value;
  const tahun_str = document.getElementById("inputBookYear").value;
  const tahun = parseInt(tahun_str);
  const selesaiAtauBelum = document.getElementById("inputBookIsComplete");
  const sudahdiCeklist = selesaiAtauBelum.checked;

  let objekBuku = {
    id: id_buku,
    title: namaBuku,
    author: penulis,
    year: tahun,
    isComplete: sudahdiCeklist,
  };

  rakBuku.push(objekBuku);
  simpanData();
  render_rakBuku();
  document.getElementById("inputBook").reset();
}

function loadData() {
  const listData = localStorage.getItem(kunciStorage);
  if (listData) {
    rakBuku = JSON.parse(listData) || [];
  }
  render_rakBuku();
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", masukkanBuku);

  loadData();
});

function tampilkanData(book) {
  const { id, title, author, year, isComplete } = book;

  const namaBuku = document.createElement("h3");
  namaBuku.innerText = title;

  const penulis = document.createElement("p");
  penulis.innerText = author;

  const tahun = document.createElement("p");
  tahun.innerText = year;

  const button1 = document.createElement("button");
  button1.setAttribute("class", "green");
  if (isComplete) {
    button1.innerText = "Belum selesai dibaca";
    button1.addEventListener("click", function () {
      pindahRak(id, isComplete);
    });
  } else {
    button1.innerText = "Sudah selesai dibaca";
    button1.addEventListener("click", function () {
      pindahRak(id, isComplete);
    });
  }

  const button2 = document.createElement("button");
  button2.setAttribute("class", "red");
  button2.innerText = "Hapus buku";

  button2.addEventListener("click", function () {
    hapusBuku(id);
  });

  const buttonContainer = document.createElement("div");
  buttonContainer.setAttribute("class", "action");
  buttonContainer.append(button1, button2);

  const container = document.createElement("article");
  container.append(namaBuku, penulis, tahun, buttonContainer);
  container.setAttribute("class", "book_item");

  return container;
}

function hapusBuku(id) {
  rakBuku = rakBuku.filter((buku) => buku.id !== id);
  alert("Buku berhasil dihapus dari list");
  simpanData();
  render_rakBuku();
}

function render_rakBuku() {
  const unRead = document.getElementById("incompleteBookshelfList");
  const Read = document.getElementById("completeBookshelfList");

  unRead.innerHTML = "";
  Read.innerHTML = "";

  rakBuku.forEach((book) => {
    const bookElement = tampilkanData(book);
    if (book.isComplete) {
      Read.appendChild(bookElement);
    } else {
      unRead.appendChild(bookElement);
    }
  });
}

document.addEventListener(renderBuku, function () {
  render_rakBuku();
});

function pindahRak(id, isComplete) {
  const book = rakBuku.find((buku) => buku.id === id);
  if (book) {
    book.isComplete = !isComplete;
    simpanData();
    render_rakBuku();
  }
}
