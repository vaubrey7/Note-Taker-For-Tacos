let tacoTitle;
let tacoText;
let saveTacoNoteBtn;
let newTacoNoteBtn;
let tacoNoteList;

if (window.location.pathname === '/notes') {
  tacoTitle = document.querySelector('.taco-title');
  tacoText = document.querySelector('.taco-textarea');
  saveTacoNoteBtn = document.querySelector('.save-taco-note');
  newTacoNoteBtn = document.querySelector('.new-note');
  tacoNoteList = document.querySelectorAll('.taco-container .taco-group');
}

// Shows the element and sets display to inline
const show = (elem) => {
  elem.style.display = 'inline';
};

// !this is hiding an element
const hide = (elem) => {
  elem.style.display = 'none';
};

// the activeNote here is used to keep track of the taco note in the taco textarea
let activeNote = {};

// this retrieves the notes using the GET request
const getNotes = () =>
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
// this saves the note you enter using a POST method 
const saveNote = (note) =>
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });
//this can delete a note using the DELETE method
const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
// this displays all active notes in the list and allows editability depending on readonly status
const renderActiveNote = () => {
  hide(saveTacoNoteBtn);

  if (activeNote.id) {
    tacoTitle.setAttribute('readonly', true);
    tacoText.setAttribute('readonly', true);
    tacoTitle.value = activeNote.title;
    tacoText.value = activeNote.text;
  } else {
    tacoTitle.removeAttribute('readonly');
    tacoText.removeAttribute('readonly');
    tacoTitle.value = '';
    tacoText.value = '';
  }
};

const handleNoteSave = () => {
  const newNote = {
    title: tacoTitle.value,
    text: tacoText.value,
  };
  saveNote(newNote).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Delete the clicked note
const handleNoteDelete = (e) => {
  // Prevents the click listener for the list from being called when the button inside of it is clicked
  e.stopPropagation();

  const note = e.target;
  const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

  if (activeNote.id === noteId) {
    activeNote = {};
  }

  deleteNote(noteId).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Sets the activeNote and displays it
const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderActiveNote();
};

// Sets the activeNote to and empty object and allows the user to enter a new note
const handleNewNoteView = (e) => {
  activeNote = {};
  renderActiveNote();
};

const handleRenderSaveBtn = () => {
  if (!tacoTitle.value.trim() || !tacoText.value.trim()) {
    hide(saveTacoNoteBtn);
  } else {
    show(saveTacoNoteBtn);
  }
};

// Render a list of taco note titles
const rendertacoNoteList = async (notes) => {
  let jsonNotes = await notes.json();
  if (window.location.pathname === '/notes') {
    tacoNoteList.forEach((el) => (el.innerHTML = ''));
  }

  let tacoNoteListItems = [];

  // Returns HTML elements in list with or without a delete button attached
  const createLi = (text, delBtn = true) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');

    const spanEl = document.createElement('span');
    spanEl.classList.add('list-item-title');
    spanEl.innerText = text;
    spanEl.addEventListener('click', handleNoteView);

    liEl.append(spanEl);

    if (delBtn) {
      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );
      delBtnEl.addEventListener('click', handleNoteDelete);

      liEl.append(delBtnEl);
    }

    return liEl;
  };

  if (jsonNotes.length === 0) {
    tacoNoteListItems.push(createLi('No saved Notes', false));
  }

  jsonNotes.forEach((note) => {
    const li = createLi(note.title);
    li.dataset.note = JSON.stringify(note);

    tacoNoteListItems.push(li);
  });

  if (window.location.pathname === '/notes') {
    tacoNoteListItems.forEach((note) => tacoNoteList[0].append(note));
  }
};

// creates the notes from the db and places them into the sidebar
const getAndRenderNotes = () => getNotes().then(rendertacoNoteList);

if (window.location.pathname === '/notes') {
  saveTacoNoteBtn.addEventListener('click', handleNoteSave);
  newTacoNoteBtn.addEventListener('click', handleNewNoteView);
  tacoTitle.addEventListener('keyup', handleRenderSaveBtn);
  tacoText.addEventListener('keyup', handleRenderSaveBtn);
}

getAndRenderNotes();