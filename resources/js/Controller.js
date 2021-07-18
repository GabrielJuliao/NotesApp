let globalCurrentNoteID;
let globalEditSelection;
const Controller = {
  initColors: function () {
    const colorButtons = document.getElementsByClassName("colorButton");
    for (let i = 0; i < colorButtons.length; i++) {
      colorButtons[i].style.backgroundColor = baseColors[i];
      colorButtons[i].value = lightColors[i];
      colorButtons[i].setAttribute("data-color", baseColors[i]);
    }
  },
  setColor: function (element) {
    document.getElementById("note").style.backgroundColor = element.value;
    try {
      document.getElementById(
        globalCurrentNoteID + "_colorI"
      ).style.backgroundColor = element.dataset.color;
    } catch (e) {}
    Controller.updateNote();
  },
  addNewNote: function () {
    let newNote = JSON.parse(JSON.stringify(NoteModel));
    newNote.id = "noteId_" + NotesDao.genId();
    newNote.dateOfCreation = Utils.getDate();
    newNote.noteColor = lightColors[0];
    newNote.indicatorColor = lightColors[0];
    NotesDao.set(newNote);
    NoteCard.loadCard(newNote);
    Controller.loadNoteIntoView(newNote);
  },
  deleteNote: function () {
    try {
      if (confirm("The current note will be deleted.")) {
        let localCurrentNoteID = globalCurrentNoteID;
        let currentCard = document.getElementById(globalCurrentNoteID);
        if (currentCard.nextElementSibling !== null) {
          Controller.loadNoteIntoView(currentCard.nextElementSibling);
        } else if (currentCard.previousElementSibling !== null) {
          Controller.loadNoteIntoView(currentCard.previousElementSibling);
        } else Controller.clearView();

        NotesDao.delete(localCurrentNoteID);
        document.getElementById(localCurrentNoteID).remove();
        globalEditSelection = "";
      }
    } catch (e) {
      alert("There are no notes to be deleted!");
    }
  },
  updateNote: function () {
    let updatedNote = JSON.parse(JSON.stringify(NoteModel));
    updatedNote.id = globalCurrentNoteID;
    updatedNote.title = document.getElementById("note-title").innerHTML;
    updatedNote.description =
      document.getElementById("note-description").innerHTML;
    updatedNote.content = document.getElementById("note-body").innerHTML;

    try {
      updatedNote.dateOfCreation = document.getElementById(
        globalCurrentNoteID + "_date"
      ).innerHTML;
      updatedNote.indicatorColor = document.getElementById(
        globalCurrentNoteID + "_colorI"
      ).style.backgroundColor;
    } catch (e) {}
    updatedNote.noteColor =
      document.getElementById("note").style.backgroundColor;
    NotesDao.update(globalCurrentNoteID, updatedNote);
  },
  updateCardView: async function () {
    let liveCard = NotesDao.get(globalCurrentNoteID);
    document.getElementById(globalCurrentNoteID + "_title").innerHTML =
      liveCard.title;
    document.getElementById(globalCurrentNoteID + "_desc").innerHTML =
      liveCard.description;
  },
  clearView: function () {
    document.getElementById("note-title").innerHTML = " ";
    document.getElementById("note-description").innerHTML = " ";
    document.getElementById("note-body").innerHTML = " ";
    document.getElementById("note").style.backgroundColor = lightColors[0];
  },

  loadNoteIntoView: function (element) {
    globalCurrentNoteID = element.id;
    let cards = document.getElementsByClassName("note-card");
    for (let i = 0; i < cards.length; i++) {
      if (cards[i].classList.contains("note-card-selected")) {
        cards[i].classList.remove("note-card-selected");
      }
    }
    document
      .getElementById(globalCurrentNoteID)
      .classList.add("note-card-selected");
    let selectedNote = NotesDao.get(globalCurrentNoteID);
    document.getElementById("note-title").innerHTML = selectedNote.title;
    document.getElementById("note-description").innerHTML =
      selectedNote.description;
    document.getElementById("note-body").innerHTML = selectedNote.content;
    document.getElementById("note").style.backgroundColor =
      selectedNote.noteColor;
  },

  loadNotesCards: function () {
    let notes = NotesDao.getAll();

    //load notes by chronological order
    if (notes.length > 0) {
      for (let i = 0; i < notes.length; i++) {
        NoteCard.loadCard(notes[i]);
      }
      //loads last element into the view
      Controller.loadNoteIntoView(notes[notes.length - 1]);
    }
  },
  formatAs: function (element) {
    if (globalEditSelection === "note-body") {
      let command = element.dataset["command"];
      if (command === "createlink") {
        let url = prompt("Enter your link here: ", "https://");
        if (url && url !== "https://") {
          Controller.updateNote();
          document.execCommand(command, false, url);
        }
      }
    }
  },
  setEditSelection(el) {
    if (document.getElementById("scroll-list").children.length !== 0) {
      globalEditSelection = el.id;
      el.setAttribute("contenteditable", true);
    } else {
      el.setAttribute("contenteditable", false);
    }
  },
};

const Utils = {
  getDate: function () {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();

    if (hours < 10) {
      hours = "0" + hours;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }

    return (
      months[date.getMonth()] +
      " " +
      date.getDate() +
      ", " +
      date.getFullYear() +
      " at " +
      hours +
      ":" +
      minutes
    );
  },
};
