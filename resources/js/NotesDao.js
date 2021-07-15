const NotesDao = {
    set: function (note) {
        let notes = NotesDao.getAll();
        notes.push(note)
        localStorage.setItem("notes", JSON.stringify(notes));
    },
    get: function (id) {
        let notesList = NotesDao.getAll();
        for (let i = 0; i < notesList.length; i++) {
            if (notesList[i].id === id) {
                return notesList[i];
            }
        }
    },
    getAll: function () {
        if (localStorage.getItem("notes") !== null) {
            return JSON.parse(localStorage.getItem("notes"));
        } else
            return [];
    },
    delete: function (id) {
        let notesList = NotesDao.getAll();
        let filteredList = [];
        for (let i = 0; i < notesList.length; i++) {
            if (notesList[i].id !== id) {
                filteredList.push(notesList[i]);
            }
        }
        localStorage.setItem("notes", JSON.stringify(filteredList));
    },

    update: function (id, updatedNote) {
        let notesList = NotesDao.getAll();
        for (let i = 0; i < notesList.length; i++) {
            if (notesList[i].id === id) {
                notesList[i] = updatedNote;
            }
        }
        localStorage.setItem("notes", JSON.stringify(notesList));
    },
    genId: function () {
        // fancy stupid algorithm
        // let notesList = NotesDao.getAll();
        // if (Array.isArray(notesList) && notesList.length > 0) {
        //     let i = 0;
        //     let current;
        //     let next;
        //
        //     while (i < notesList.length) {
        //         current = parseFloat(notesList[i].id.substring(notesList[i].id.length, 7));
        //         next = parseFloat(notesList[i].id.substring(notesList[i].id.length, 7));
        //         if (current > next) {
        //             current = next;
        //         }
        //         i++;
        //     }
        //     return current + .0001;
        // }
        // return 0;
        return new Date().getTime();
    },
}