const NoteCard = {
    loadCard: function (note) {
        //necessary elements to create a side panel card...
        let card = document.createElement("div");
        let title = document.createElement("h2");
        let description = document.createElement("p");
        let timeColor = document.createElement("div");
        let date = document.createElement("datetime");
        let indicator = document.createElement("div");

        //adding classes for style and functionality
        card.classList.add("note-card", "shadowy");
        title.classList.add("note-card-title");
        description.classList.add("note-card-description");
        timeColor.classList.add("time-color");
        date.classList.add("note-card-date");
        indicator.classList.add("color");

        //id of elements
        card.id = note.id;
        title.id = note.id + "_title";
        description.id = note.id + "_desc";
        timeColor.id = note.id + "_timeColor";
        indicator.id = note.id + "_colorI";
        date.id = note.id + "_date";

        //filling with data
        title.innerHTML = note.title;
        description.innerHTML = note.description;
        date.setAttribute("datetime", note.dateOfCreation);
        date.innerHTML = note.dateOfCreation;
        indicator.style.backgroundColor = note.indicatorColor;

        //assembling component
        card.appendChild(title);
        card.appendChild(description);
        timeColor.appendChild(indicator);
        timeColor.appendChild(date);
        card.appendChild(timeColor);

        //necessary listener, when clicked loads note into view!
        card.addEventListener("click", () => {
            Controller.loadNoteIntoView(card);
        });
        //loads into side panel
        document.getElementById("scroll-list").prepend(card);
    },
}