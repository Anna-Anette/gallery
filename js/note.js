(function (global) {
    var note;

    function NewNote(data) {
        this.data = data;
        return data;
    }

    NewNote.prototype.getNote = function (note) {
        console.log(note);
        return note;
    };
    NewNote.prototype.addNote = function (note) {
        return note;
    };

    NewNote.prototype.removeNote = function (note) {
        return note;
    };
    NewNote.prototype.setNoteAsCompleted = function (note) {

    };
    NewNote.prototype.saveNote = function (note) {
        return note;
    };

    note = function (data) {
        return new NewNote(data);
    };
    global.note = note;

})(this);
