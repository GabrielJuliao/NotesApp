function formatAs(element) {
    let command = element.dataset["command"];
    if (command === 'createlink') {
        let url = prompt("Enter the link here: ", "https:\/\/");
        document.execCommand(command, false, url);
    } else {
        document.execCommand(command, false, null);
    }
}