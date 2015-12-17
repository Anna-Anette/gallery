(function (global) {
    'use strict';
    function EntriesModel() {
        this.isSorted = false;
        this.entriesNumber = 0;
        this.dataObject = {};
    }

    EntriesModel.prototype = {

        /**
         * Add an entry
         * @param  rowData {array}  - an array with data for entry
         *
         */
        addEntry: function (rowData) {
            this.dataObject[this.entriesNumber] = rowData;
            this.entriesNumber += 1;
        },

        /**
         * Delete an entry
         * @param  index {number}  - an index of an entry in the object
         *
         */
        deleteEntry: function (index) {
            delete this.dataObject[index];
            this.entriesNumber -= 1;
        },

        /**
         * Clear data
         */
        clearData: function () {
            this.dataObject = {};
            this.entriesNumber = 0;
            this.isSorted = false;
        },

        /**
         * Import data
         */
        importTableData: function (data) {
            var self = this;

            Object.keys(data).map(function (val, index) {
                self.addEntry(data[index]);
            });
        },

        /**
         * Add random data
         */
        addRandomEntries: function () {
            var randomRowIndex = 0,
                addedRandomRows = 0,
                randomRows = [],
                randomRowsLength,
                rowsCount = this.entriesNumber,
                randomNumberOfRows = Math.floor(Math.random() * 10) + 1,
                generateRandomName = this.generateRandomName;

            for (; addedRandomRows < randomNumberOfRows; addedRandomRows++) {
                randomRows.push([
                    rowsCount + addedRandomRows,
                    generateRandomName(),
                    Math.floor(Math.random() * 1000) + 1,
                    Math.floor(Math.round(Math.random())) ? 'yes' : 'no'
                ]);
            }

            for (randomRowsLength = randomRows.length; randomRowIndex < randomRowsLength; randomRowIndex++) {
                this.addEntry(randomRows[randomRowIndex]);
            }

            return randomRows;
        },

        /**
         * Generates random name for random data
         */
        generateRandomName: function () {
            var result = "",
                letterNumber = 0,
                wordLength = Math.floor(Math.random() * 10) + 2,
                possibleSymbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (; letterNumber < wordLength; letterNumber++) {
                result += possibleSymbols.charAt(Math.floor(Math.random() * possibleSymbols.length));
            }
            return result;
        },

        /**
         * Sorts table according to sort type
         *
         * @param {String} type - type of sort
         * @returns {Object} - data object
         */
        sortByType: function (type) {
            var self = this,
                sortResult = [],
                entries = this.dataObject,
                sortedEntry = 0,
                entruesCount = this.entriesNumber,
                sortOrderCallback;

            for (; sortedEntry < entruesCount; sortedEntry++) {
                sortResult.push(entries[sortedEntry]);
            }
            if (type === 'name') {
                sortOrderCallback = function (a, b) {
                    if (a[1].toLowerCase() > b[1].toLowerCase()) {
                        return 1;
                    }
                    if (a[1].toLowerCase() < b[1].toLowerCase()) {
                        return -1;
                    }
                    return 0;
                };
            } else if (type === 'id') {
                sortOrderCallback = function (a, b) {
                    return a[0] - b[0];
                };
            } else if (type === 'qty') {
                sortOrderCallback = function (a, b) {
                    return a[2] - b[2];
                };
            }

            sortResult.sort(sortOrderCallback);

            this.clearData();

            sortResult.forEach(function (el) {
                self.addEntry(el);
            });

            this.isSorted = true;

            return this.dataObject;
        },

        /**
         * Exports Table data to text area
         *
         * @returns {boolean|Object} holder  - an object with exported data
         */
        exportTableData: function () {
            var data = this.dataObject,
                entry;
            for (entry in data) {
                if (!data.hasOwnProperty(entry)) {
                    return false;
                }
            }
            return this.dataObject;
        }
    };
    global.EntriesModel = EntriesModel;
})(this);
