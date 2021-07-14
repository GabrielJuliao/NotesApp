let current;
let previous;
const NotesController = {

    addNewNote: function () {
        let newNote = NoteModel;
        newNote.id = "noteId_" + NotesDao.genId();
        newNote.dateOfCreation = Utils.getDateFormated();
        NotesDao.store(newNote);
        location.reload();
        return false;
    },
    deleteNote: function () {
        console.log("the current element is: " + current);
        NotesDao.deleteById(current);
        document.getElementById(current).remove();
    },
    updateNote: function () {
        let updatedNote = NoteModel;
        updatedNote.id = current;
        updatedNote.title = document.getElementById("note-title").innerHTML;
        updatedNote.description = document.getElementById("note-description").innerHTML;
        updatedNote.content = document.getElementById("note-body").innerHTML;
        updatedNote.dateOfCreation = document.getElementById(current + "_date").innerHTML;
        updatedNote.indicatorColor = document.getElementById(current + "_colorI").style.backgroundColor;
        updatedNote.noteColor = document.getElementById("note").style.backgroundColor;
        NotesDao.updateById(current, updatedNote);
    },
    updateView: async function () {
        let liveCard = NotesDao.getById(current);
        console.log(liveCard.title);
        document.getElementById(current + "_title").innerHTML = liveCard.title;
        document.getElementById(current + "_desc").innerHTML = liveCard.description;
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
        let selectedNote = NotesDao.getById(current);
        document.getElementById("note-title").innerHTML = selectedNote.title;
        document.getElementById("note-description").innerHTML = selectedNote.description;
        document.getElementById("note-body").innerHTML = selectedNote.content;
        document.getElementById("note").style.backgroundColor = selectedNote.noteColor;
    },

    loadNotesCards: function () {
        let notes = NotesDao.getAll();
        let scrollList = document.getElementById("scroll-list");

        //load notes by chronological order
        console.log("loading all the notes... total of "+notes.length);
        if (notes.length > 0) {
            console.log("inside notes loop");
            for (let i = notes.length - 1; i !== 0; i--) {
                let card = document.createElement("div");
                let title = document.createElement("h2");
                let desc = document.createElement("p");
                let timeColor = document.createElement("div");
                let noteDate = document.createElement("datetime");
                let noteColorIndicator = document.createElement("div");

                card.classList.add("note-card", "clickable");
                title.classList.add("note-card-title");
                desc.classList.add("note-card-description");
                timeColor.classList.add("time-color");
                noteDate.classList.add("note-card-date");
                noteColorIndicator.classList.add("color");

                title.id = notes[i].id + "_title";
                desc.id = notes[i].id + "_desc";
                noteColorIndicator.id = notes[i].id + "_colorI";
                noteDate.id = notes[i].id + "_date";
                card.setAttribute("data-call", "loadNote")

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
}