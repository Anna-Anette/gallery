(function (global) {
    'use strict';
    function EntriesModel() {
        this.entriesNumber = 0;
        this.dataObject = {};
        this.direction = '';
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
        },

        /**
         * Import data
         */
        importTableData: function (data) {
            var self = this, index;

            for (index in data) {
                if (data.hasOwnProperty(index)) {
                    self.addEntry(data[index]);
                }
            }
        },

        /**
         * Add random data
         */
        addRandomEntries: function () {
            var i = 0,
                j = 0,
                randomRows = [],
                randomRowsLength,
                rowsCount = this.entriesNumber,
                randomNumberOfRows = Math.floor(Math.random() * 10) + 1,
                generateRandomName = this._generateRandomName;

            for (; j < randomNumberOfRows; j++) {
                randomRows.push([
                    rowsCount + j + 1,
                    generateRandomName(),
                    Math.floor(Math.random() * 1000) + 1,
                    Math.floor(Math.round(Math.random())) ? 'yes' : 'no'
                ]);
            }

            for (randomRowsLength = randomRows.length; i < randomRowsLength; i++) {
                this.addEntry(randomRows[i]);
            }

            return randomRows;
        },

        /**
         * Generates random name for random data
         */
        _generateRandomName: function () {
            var result = "",
                i = 0,
                wordLength = Math.floor(Math.random() * 10) + 2,
                possibleSymbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (; i < wordLength; i++) {
                result += possibleSymbols.charAt(Math.floor(Math.random() * possibleSymbols.length));
            }
            return result;
        },

        /**
         * Sorts table according to sort type
         *
         * @param {String} type - type of sort
         * @param {Number} sortCell - sorting cell
         * @returns {Object} - data object
         */
        sortByType: function (type, sortCell) {
            var self = this,
                sortResult = [],
                entries = this.dataObject,
                sortedEntry,
                dir = this.direction,

                sortOrderCallback;

            for (sortedEntry in entries) {
                if (entries.hasOwnProperty(sortedEntry)) {
                    sortResult.push(entries[sortedEntry]);
                }
            }

            sortOrderCallback = function (a, b) {

                if (type === 'string') {
                    if (dir) {
                        if (a[sortCell].toLowerCase() > b[sortCell].toLowerCase()) {
                            return 1;
                        }
                        if (a[sortCell].toLowerCase() < b[sortCell].toLowerCase()) {
                            return -1;
                        }
                    } else {
                        if (a[sortCell].toLowerCase() > b[sortCell].toLowerCase()) {
                            return -1;
                        }
                        if (a[sortCell].toLowerCase() < b[sortCell].toLowerCase()) {
                            return 1;
                        }
                    }
                    return 0;
                } else if (type === 'number') {
                    if (dir) {
                        return a[sortCell] - b[sortCell];
                    }
                    return b[sortCell] - a[sortCell];
                }
            };

            sortResult.sort(sortOrderCallback);

            this.clearData();

            sortResult.forEach(function (el) {
                self.addEntry(el);
            });

            return this.dataObject;
        },

        /**
         * Exports Table data to text area
         *
         * @returns {boolean|Object} holder  - an object with exported data
         */
        exportTableData: function () {
            if (!this.entriesNumber) {
                return false;
            }
            return this.dataObject;
        }
    };
    global.EntriesModel = EntriesModel;
})(this);
