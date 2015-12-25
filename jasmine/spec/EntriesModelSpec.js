/*jshint jasmine:true */
describe("EntriesModel", function () {
    'use strict';
    var tableEditor,
        row0 = [0, 'zero', 10, 'yes'],
        row1 = [1, 'one', 12, 'no'];

    beforeEach(function () {
        tableEditor = new EntriesModel();
        tableEditor.addEntry(row0);
        tableEditor.addEntry(row1);
    });

    it("should be able to add an entry to the data", function () {
        expect(tableEditor.dataObject).toEqual({0: row0, 1: row1});
        expect(tableEditor.entriesNumber).toEqual(2);
    });

    it("should be able to delete an entry from the data", function () {
        tableEditor.deleteEntry(0);
        expect(tableEditor.dataObject).toEqual({1: row1});
        expect(tableEditor.entriesNumber).toEqual(1);
        tableEditor.deleteEntry(1);
        expect(tableEditor.dataObject).toEqual({});
        expect(tableEditor.entriesNumber).toEqual(0);
    });

    it("should be able to clear entries", function () {
        tableEditor.clearData();

        expect(tableEditor.dataObject).toEqual({});
        expect(tableEditor.entriesNumber).toEqual(0);
    });

    it("should export entries", function () {
        var data = tableEditor.exportTableData();

        expect(tableEditor.dataObject).toEqual(data);
    });

    it("should import entries", function () {
        var data = tableEditor.exportTableData();

        tableEditor.importTableData(data);
        expect(tableEditor.dataObject).toEqual(data);
    });

    it("should sort data by name", function () {
        var data = tableEditor.sortByType('name');

        expect(tableEditor.dataObject).toEqual(data);

        expect(tableEditor.isSorted).toBeTruthy();
    });

    it("should sort data by ID", function () {
        tableEditor.sortByType('id');

        expect(tableEditor.dataObject).toEqual({0: row0, 1: row1});

        expect(tableEditor.isSorted).toBeTruthy();
    });

    it("should sort data by qty", function () {
        tableEditor.sortByType('qty');

        expect(tableEditor.dataObject).toEqual({0: row0, 1: row1});

        expect(tableEditor.isSorted).toBeTruthy();
    });

    it("should be able to add random data", function () {
        var entriesNumber = tableEditor.entriesNumber,
            data = tableEditor.addRandomEntries();
        expect(tableEditor.entriesNumber === entriesNumber + data.length).toBeTruthy();
    });
});
