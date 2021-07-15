window.onload = () => {
    Controller.initColors();
    Controller.loadNotesCards();
    AddListener.byId("btn-add-new-note", "click", Controller.addNewNote);
    AddListener.byId("btn-delete-note", "click", Controller.deleteNote);
    AddListener.byClassName("format", "click", Controller.formatAs);
    AddListener.byClassName("colorButton", "click", Controller.setColor);
    AddListener.byClassName("content-editable", "click", Controller.setEditSelection)

    document.addEventListener("keydown", (evt) => {
        if (evt.key === "Enter" && document.activeElement.id !== "note-body") {
            evt.preventDefault();
        }
        const promise = new Promise(resolve => setTimeout(resolve, 250));
        promise.then(() => Controller.updateNote()).then(() => Controller.updateCardView());
    });

    let editable = document.getElementsByClassName("content-editable");
    for (let i = 0; i < editable.length; i++) {
        editable[i].addEventListener("paste", (event) => {
            let paste = (event.clipboardData || window.clipboardData).getData('text');
            const selection = window.getSelection();
            if (!selection.rangeCount) return false;
            selection.deleteFromDocument();
            selection.getRangeAt(0).insertNode(document.createTextNode(paste));
            event.preventDefault();
        });
    }
}
const AddListener = {
    byId: function (id, type, callback) {
        let el = document.getElementById(id);
        el.addEventListener(type, () => {
            callback(el);
        });
    },
    byClassName: function (className, type, callback) {
        let els = document.getElementsByClassName(className);
        for (let i = 0; i < els.length; i++) {
            els[i].addEventListener(type, () => {
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
    "#ffa500",
    "#ff3399",
    "#9933ff",];
lightColors = [
    "#F9FBFF",
    "#b3d9ff",
    "#c2f0c2",
    "#ffffb3",
    "#ffe4b3",
    "#ffb3d9",
    "#d9b3ff",
];