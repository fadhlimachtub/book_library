document.addEventListener('DOMContentLoaded', function(){
    const submitBook = document.getElementById('inputBook');
    submitBook.addEventListener('submit', function (event){
        event.preventDefault();
        addBook();
    });

    if(isStorageExist()){
      loadDAtaFromStorage()
  }
});

const todos=[];
const RENDER_EVENT='render-todo';

function addBook() {
    const authorStamp = document.getElementById('inputBookAuthor').value;
    const title = document.getElementById('inputBookTitle').value;
    const yearBook = document.getElementById('inputBookYear').value;
    const isComplete = document.getElementById('inputBookIsComplete').checked;

    const generatedID = generateId();

    const todoObject = generateTodoObject(generatedID, title, authorStamp, yearBook, isComplete);
    todos.push(todoObject);
   
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function generateId() {
    return +new Date();
  }
   
  function generateTodoObject(id, title, author, year, isCompleted) {
    return {
      id,
      title,
      author,
      year,
      isCompleted
    }
  }

  document.addEventListener(RENDER_EVENT, function () {
    console.log(todos);

    const uncompletedTODOList = document.getElementById('incompleteBookshelfList');
    uncompletedTODOList.innerHTML = '';

    const completedTODOList = document .getElementById('completeBookshelfList');
    completedTODOList.innerHTML = '';


  
    for (const todoItem of todos) {
      const todoElement = makeTodo(todoItem);

      if (!todoItem.isCompleted) {
        uncompletedTODOList.append(todoElement);
      } else{
        completedTODOList.append(todoElement);
      }
    }
  });

//maketodo function

function makeTodo(todoObject) {
  const textBookTitle = document.createElement('h2');
  textBookTitle.innerText = todoObject.title;
  
  const textAuthorBook = document.createElement('p');
  textAuthorBook.innerText = todoObject.author;

  const textYearBook = document.createElement('p');
  textYearBook.innerText = todoObject.year;
 
  const textContainer = document.createElement('article');
  textContainer.classList.add('book_item');
  textContainer.append(textBookTitle, textAuthorBook, textYearBook);
 
  const container = document.createElement('div');
  container.classList.add('item', 'shadow');
  container.append(textContainer);
  container.setAttribute('id', 'todo-${todoObject.id}');

  if (todoObject.isCompleted) {
    const undoButton = document.createElement('button');
    undoButton.innerText = 'Belum selesai di Baca';
    undoButton.classList.add('green');
 
    undoButton.addEventListener('click', function () {
      undoTaskFromCompleted(todoObject.id);
    });
 
    const trashButton = document.createElement('button');
    trashButton.innerText = 'Hapus buku';
    trashButton.classList.add('red');
 
    trashButton.addEventListener('click', function () {
      removeTaskFromCompleted(todoObject.id);
    });
 
    textContainer.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement('button');
    checkButton.innerText = 'Selesai dibaca';
    checkButton.classList.add('green');
    
    checkButton.addEventListener('click', function () {
        addTaskCompleted(todoObject.id);
    });
    
    const trashButton = document.createElement('button');
    trashButton.innerText = 'Hapus buku';
    trashButton.classList.add('red');
 
    trashButton.addEventListener('click', function () {
      removeTaskFromCompleted(todoObject.id);
    });
    
    textContainer.append(checkButton, trashButton);
  };
 
  return container;
};

// memasukkan fungsi tombol buku selesai dibaca
function addTaskCompleted(todoId){
  const todoTarget=findTodo(todoId);

  if(todoTarget==null) return;

  todoTarget.isCompleted=true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findTodo(todoId){
  for(const todoItem of todos){
      if(todoItem.id===todoId){
          return todoItem;
      }
  }
  return null;
}

// memasukkan fungsi tombol hapus buku
function removeTaskFromCompleted(todoId){
  const todoTarget=findTodoIndex(todoId);

  if(todoTarget===-1)return;

  todos.splice(todoTarget,1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// memasukkan fungsi tombol buku belum selesai dibaca
function undoTaskFromCompleted(todoId){
  const todoTarget=findTodo(todoId);

  if(todoTarget==null) return;

  todoTarget.isCompleted=false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// menambahkan fungsi findtodoindex
function findTodoIndex(todoId){
  for (const index in todos){
      if (todos[index].id===todoId){
          return index;
      }
  } 

  return -1;
}

// mambuat local storage

function saveData(){
  if(isStorageExist()){
      const parsed = JSON.stringify(todos);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

const SAVED_EVENT='saved-todo';
const STORAGE_KEY='TODO_APPS';

function isStorageExist() {
  if(typeof (Storage)===undefined){
      alert('Browser kamu tidak mendukung local storage');
      return false;
  } 
  return true;
}

// memperbarui data pada storage
document.addEventListener(SAVED_EVENT,function(){
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDAtaFromStorage(){
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if(data !== null) {
      for (const todo of data){
          todos.push(todo);
      }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

// fungsi fitur pencarian

const searchButton =document.getElementById('searchSubmit');
searchButton.addEventListener('click', function (event){
  event.preventDefault();
  
  const searchBook = document.getElementById('searchBookTitle').value.toLowerCase();
  const bookList = document.querySelectorAll('.book_item > h2');

  for (book of bookList) {
    if (book.innerText.toLowerCase().includes(searchBook)) {
      book.parentElement.style.display = 'block';
    } else {
      book.parentElement.style.display = 'none';
    }
  }
});
