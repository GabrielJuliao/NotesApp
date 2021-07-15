let globalCurrentNoteID;
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
        document.getElementById(globalCurrentNoteID + "_colorI").style.backgroundColor = element.dataset.color;
        Controller.updateNote();
    },
    addNewNote: function () {
        let newNote = JSON.parse(JSON.stringify(NoteModel));
        newNote.id = "noteId_" + NotesDao.genId();
        newNote.dateOfCreation = Utils.getDate();
        NotesDao.set(newNote);
        NoteCard.loadCard(newNote);
        Controller.loadNoteIntoView(newNote);
    },
    deleteNote: function () {
        //resets the element in the view whether or not there's a next or previous element
        let localCurrentNoteID = globalCurrentNoteID;
        let currentCard = document.getElementById(globalCurrentNoteID);
        if (currentCard.nextElementSibling !== null) {
            console.log("next is: ");
            console.log(currentCard.nextElementSibling);
            Controller.loadNoteIntoView(currentCard.nextElementSibling);
        } else if (currentCard.previousElementSibling !== null) {
            console.log("previous is: ");
            console.log(currentCard.previousElementSibling);
            Controller.loadNoteIntoView(currentCard.previousElementSibling);
        }
        // deletes note from the local storage
        NotesDao.delete(localCurrentNoteID);
        // remove element from the dom
        document.getElementById(localCurrentNoteID).remove();
    },
    updateNote: function () {
        let updatedNote = JSON.parse(JSON.stringify(NoteModel));
        updatedNote.id = globalCurrentNoteID;
        updatedNote.title = document.getElementById("note-title").innerHTML;
        updatedNote.description = document.getElementById("note-description").innerHTML;
        updatedNote.content = document.getElementById("note-body").innerHTML;
        updatedNote.dateOfCreation = document.getElementById(globalCurrentNoteID + "_date").innerHTML;
        updatedNote.indicatorColor = document.getElementById(globalCurrentNoteID + "_colorI").style.backgroundColor;
        updatedNote.noteColor = document.getElementById("note").style.backgroundColor;
        NotesDao.update(globalCurrentNoteID, updatedNote);
    },
    updateCardView: async function () {
        let liveCard = NotesDao.get(globalCurrentNoteID);
        console.log(liveCard.title);
        document.getElementById(globalCurrentNoteID + "_title").innerHTML = liveCard.title;
        document.getElementById(globalCurrentNoteID + "_desc").innerHTML = liveCard.description;
    },

    loadNoteIntoView: function (element) {
        globalCurrentNoteID = element.id;
        console.log("set the current to: " + globalCurrentNoteID);
        let cards = document.getElementsByClassName("note-card");
        for (let i = 0; i < cards.length; i++) {
            if (cards[i].classList.contains("note-card-selected")) {
                cards[i].classList.remove("note-card-selected");
            }
        }
        document.getElementById(globalCurrentNoteID).classList.add("note-card-selected");
        let selectedNote = NotesDao.get(globalCurrentNoteID);
        document.getElementById("note-title").innerHTML = selectedNote.title;
        document.getElementById("note-description").innerHTML = selectedNote.description;
        document.getElementById("note-body").innerHTML = selectedNote.content;
        document.getElementById("note").style.backgroundColor = selectedNote.noteColor;
    },

    loadNotesCards: function () {
        let notes = NotesDao.getAll();

        //load notes by chronological order
        console.log("loading all the notes... total of " + notes.length);
        if (notes.length > 0) {
            for (let i = 0; i < notes.length; i++) {
                NoteCard.loadCard(notes[i]);
            }
            //loads last element into the view
            Controller.loadNoteIntoView(notes[notes.length - 1]);
        }
    },
    formatAs: function (element) {
        let command = element.dataset["command"];
        if (command === 'createlink') {
            let url = prompt("Enter the link here: ", "https:\/\/");
            document.execCommand(command, false, url);
        } else {
            document.execCommand(command, false, null);
        }
        Controller.updateNote();
    },
}

const Utils = {
    getDate: function () {
        let date = new Date();
        return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + " at " + date.getHours() + ":" + date.getMinutes();
    },
}