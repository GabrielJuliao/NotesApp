const Utils = {
    getDateFormated: function () {
        let date = new Date();
        return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + " at " + date.getHours() + ":" + date.getMinutes();
    },
}