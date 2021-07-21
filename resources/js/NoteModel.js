let NoteModel = {
  id: "",
  title: "",
  description: "",
  content: "",
  dateOfCreation: "",
  indicatorColor: "",
  noteColor: "",
};

function welcome() {
  return {
    id: "",
    title: "Hi, welcome to the Notes App",
    description: "this is a sample note.",
    content: "<h2>Here you can:</h2><ul><li>Manage, create, delete and edit your notes.</li> <li>Choose the colors within a given palette.</li><li>Format your text.</li> </ul><h2>Formatting options:</h2><ol><li><b>Bold.</b></li><li><em>Italic.</em> </li><li><u>Underline.</u></li><li><a href=\"/\">Link/Unlink.</a></li><li>Bullet Lists. </li><li>Numbered Lists.</li></ol><br><b>Note: browser support may vary!!</b>",
    dateOfCreation: "",
    indicatorColor: "",
    noteColor: "",
  };
}
