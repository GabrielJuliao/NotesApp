window.onload = () => {
    Controller.initColors();
    Controller.loadNotesCards();
    AddOnClickListener.byId("btn-add-new-note", Controller.addNewNote);
    AddOnClickListener.byId("btn-delete-note", Controller.deleteNote);
    AddOnClickListener.byClassName("format", Controller.formatAs);
    AddOnClickListener.byClassName("colorButton", Controller.setColor);
    document.addEventListener("keydown", () => {
        const promise = new Promise(resolve => setTimeout(resolve, 250));
        promise.then(r => Controller.updateNote()).then(r => Controller.updateCardView());
    });
}
const AddOnClickListener = {
    byId: function (id, callback) {
        let el = document.getElementById(id);
        el.addEventListener("click", () => {
            callback(el);
        });
    },
    byClassName: function (className, callback) {
        let els = document.getElementsByClassName(className);
        for (let i = 0; i < els.length; i++) {
            els[i].addEventListener("click", () => {
                callback(els[i]);
            });
        }
    },
}

//colors
baseColors = [
    "#F9FBFF",
    "#3399ff",
    "#33cc33",
    "#ffff00",
    "#ff3399",];
lightColors = [
    "#F9FBFF",
    "#b3d9ff",
    "#c2f0c2",
    "#ffffb3",
    "#ffb3d9",
];