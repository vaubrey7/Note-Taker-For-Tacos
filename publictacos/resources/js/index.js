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

// the activeTacoNote here is used to keep track of the taco note in the taco textarea
let activeTacoNote = {};

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
const renderactiveTacoNote = () => {
  hide(saveTacoNoteBtn);

  if (activeTacoNote.id) {
    tacoTitle.setAttribute('readonly', true);
    tacoText.setAttribute('readonly', true);
    tacoTitle.value = activeTacoNote.title;
    tacoText.value = activeTacoNote.text;
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
    renderactiveTacoNote();
  });
};

// Delete the clicked note
const handleNoteDelete = (e) => {
  // Prevents the entire list from being deleted and only deletes the selected taco note 
  e.stopPropagation();

  const tacoNote = e.target;
  const tacoNoteId = JSON.parse(tacoNote.parentElement.getAttribute('taco-note')).id;

  if (activeTacoNote.id === tacoNoteId) {
    activeTacoNote = {};
  }

  deleteNote(tacoNoteId).then(() => {
    getAndRenderNotes();
    renderactiveTacoNote();
  });
};

// Sets the activeTacoNote and displays it
const tacoNoteView = (e) => {
  e.preventDefault();
  activeTacoNote = JSON.parse(e.target.parentElement.getAttribute('taco-note'));
  renderactiveTacoNote();
};

// Sets the activeTacoNote to and empty object and allows the user to enter a new note
const handleNewNoteView = (e) => {
  activeTacoNote = {};
  renderActiveNote();
};

const handleRenderSaveBtn = () => {
  if (!tacoTitle.value.trim() || !tacoText.value.trim()) {
    hide(saveTacoNoteBtn);
  } else {
    show(saveTacoNoteBtn);
  }
};

// This Will Render a list of Taco Note Titles
const rendertacoNoteList = async (notes) => {
  let jsonNotes = await notes.json();
  if (window.location.pathname === '/taconotes') {
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
    spanEl.addEventListener('click', tacoNoteView);

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
    tacoNoteListItems.push(createLi('You Do Not Have Any Taco Notes', false));
  }

  jsonNotes.forEach((tacoNote) => {
    const li = createLi(tacoNote.title);
    li.dataset.note = JSON.stringify(tacoNote);

    tacoNoteListItems.push(li);
  });

  if (window.location.pathname === '/taconotes') {
    tacoNoteListItems.forEach((tacoNote) => tacoNoteList[0].append(tacoNote));
  }
};

// creates the notes from the db and places them into the sidebar
const getAndRenderNotes = () => getNotes().then(rendertacoNoteList);

if (window.location.pathname === '/taconotes') {
  saveTacoNoteBtn.addEventListener('click', handleNoteSave);
  newTacoNoteBtn.addEventListener('click', handleNewNoteView);
  tacoTitle.addEventListener('keyup', handleRenderSaveBtn);
  tacoText.addEventListener('keyup', handleRenderSaveBtn);
}

getAndRenderNotes();