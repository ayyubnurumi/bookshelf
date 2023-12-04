document.addEventListener("DOMContentLoaded", function () {
    const submitForm = document.getElementById("inputBook");
    submitForm.addEventListener("submit", function (event) {
      event.preventDefault();
      addBook();
    });
    
    if (isStorageExist()) {
      loadDataFromStorage();
    }
  });
  
  const books = [];
  const RENDER_EVENT = 'render-book';
  
  function addBook() {
    const bookTitle = document.getElementById('inputBookTitle').value;
    const bookAuthor = document.getElementById('inputBookAuthor').value;
    const bookYear = document.getElementById('inputBookYear').value;
    const bookIsComplete = document.getElementById('inputBookIsComplete').checked;

    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, bookYear, bookIsComplete);
    books.push(bookObject);
   
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
  
  function generateId() {
    return +new Date();
  }
   
  function generateBookObject(id, title, author, year, isCompleted) {
    return {
      id,
      title,
      author,
      year,
      isCompleted
    }
  }
  
  document.addEventListener(RENDER_EVENT, function () {
    console.log(books);
  });
  
  function makeBook(bookObject) {
    const textTitle = document.createElement('h3');
    textTitle.innerText = bookObject.title;
   
    const textAuthor = document.createElement('p');
    textAuthor.innerText = bookObject.author;

    const textYear = document.createElement('p');
    textYear.innerText = bookObject.year;
    
    const action = document.createElement('div');
    action.classList.add('action');

    const container = document.createElement('article');
    container.classList.add('book_item');
    container.append(textTitle, textAuthor, textYear, action);
   
    container.setAttribute('id', `book-${bookObject.id}`);
  
    if (bookObject.isCompleted) {
      const undoButton = document.createElement('button');
      undoButton.classList.add('green');
      undoButton.innerText = 'Belum Dibaca'
   
      undoButton.addEventListener('click', function () {
        undoBookFromCompleted(bookObject.id);
      });
   
      const trashButton = document.createElement('button');
      trashButton.classList.add('red');
      trashButton.innerText = 'Hapus'
   
      trashButton.addEventListener('click', function () {
        removeBookFromCompleted(bookObject.id);
      });
   
      action.append(undoButton, trashButton);
    } else {
      const checkButton = document.createElement('button');
      checkButton.classList.add('green');
      checkButton.innerText = 'Selesai Dibaca'
      
      checkButton.addEventListener('click', function () {
        addBookToCompleted(bookObject.id);
      });
      
      action.append(checkButton);
    }
   
    return container;
  }
  
  document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBOOKList = document.getElementById('incompleteBookshelfList');
    uncompletedBOOKList.innerHTML = '';
   
    const completedBOOKList = document.getElementById('completeBookshelfList');
    completedBOOKList.innerHTML = '';
   
    for (const bookItem of books) {
      const bookElement = makeBook(bookItem);
      if (!bookItem.isCompleted)
        uncompletedBOOKList.append(bookElement);
      else
        completedBOOKList.append(bookElement);
    }
  });
  
  function addBookToCompleted (bookId) {
    const bookTarget = findBook(bookId);
   
    if (bookTarget == null) return;
   
    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
  
  function findBook(bookId) {
    for (const bookItem of books) {
      if (bookItem.id === bookId) {
        return bookItem;
      }
    }
    return null;
  }
  
  function removeBookFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);
   
    if (bookTarget === -1) return;
   
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
   
   
  function undoBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);
   
    if (bookTarget == null) return;
   
    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
  
  function findBookIndex(bookId) {
    for (const index in books) {
      if (books[index].id === bookId) {
        return index;
      }
    }
   
    return -1;
  }
  
  function saveData() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
  }
  
  const SAVED_EVENT = 'saved-book';
  const STORAGE_KEY = 'BOOKSHELF_APPS';
   
  function isStorageExist() /* boolean */ {
    if (typeof (Storage) === undefined) {
      alert('Browser kamu tidak mendukung local storage');
      return false;
    }
    return true;
  }
  
  document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
  });
  
  function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
   
    if (data !== null) {
      for (const book of data) {
        books.push(book);
      }
    }
   
    document.dispatchEvent(new Event(RENDER_EVENT));
  }