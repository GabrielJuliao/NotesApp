let current;
let previous;
const NotesController = {

    addNewNote: function () {
        let newNote = NoteModel;
        newNote.id = "noteId_" + NotesDao.genId();
        NotesDao.store(newNote);
        location.reload();
        return false;
    },
    deleteNote: function (element) {
        console.log("the current element is: " + current);
        NotesDao.deleteById(current);
        location.reload();
        return false;
    },

    loadNote: function (element) {
        previous = current;
        current = element.id;
        console.log("set the current to: " + current);
        let cards = document.getElementsByClassName("note-card");
        for (let i = 0; i < cards.length; i++) {
            if (cards[i].classList.contains("note-card-selected")) {
                cards[i].classList.remove("note-card-selected");
            }
        }
        document.getElementById(current).classList.add("note-card-selected");
        // do other stuff here
        console.log(NotesDao.getById(current));
        let selectedNote = NotesDao.getById(current);
        console.log(selectedNote);
        document.getElementById("note-title").innerHTML = selectedNote.title;
        document.getElementById("note-description").innerHTML = selectedNote.description;
        document.getElementById("note-body").innerHTML = selectedNote.content;
        document.getElementById("note").style = selectedNote.noteColor;
    },

    loadNotesCards: function () {
        let notes = NotesDao.getAll();
        let scrollList = document.getElementById("scroll-list");

        for (let i = 0; i < notes.length; i++) {
            let card = document.createElement("div");
            let title = document.createElement("h2");
            let desc = document.createElement("p");
            let timeColor = document.createElement("div");
            let noteDate = document.createElement("datetime");
            let noteColorIndicator = document.createElement("div");

            card.classList.add("note-card");
            title.classList.add("note-card-title");
            desc.classList.add("note-card-description");
            timeColor.classList.add("time-color");
            noteDate.classList.add("note-card-date");
            noteColorIndicator.classList.add("color");

            card.id = notes[i].id;
            title.innerHTML = notes[i].title;
            desc.innerHTML = notes[i].description;
            noteDate.setAttribute("datetime", notes[i].dateOfCreation);
            noteDate.innerHTML = notes[i].dateOfCreation;
            noteColorIndicator.style.backgroundColor = notes[i].indicatorColor;

            card.appendChild(title);
            card.appendChild(desc);
            timeColor.appendChild(noteDate);
            timeColor.appendChild(noteColorIndicator);
            card.appendChild(timeColor);
            scrollList.appendChild(card);
        }
    }
}