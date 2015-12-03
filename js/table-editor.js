(function (global) {
    'use strict';
    function TableEditor(data) {
        this.data = data;

        this.showAddRowBtn = data.buttons.showAddRowBtn;

        this.addRowBtn = data.buttons.addRowBtn;
        this.deleteRowBtn = data.buttons.deleteRowBtn;

        this.randomDataBtn = data.buttons.randomDataBtn;
        this.exportDataBtn = data.buttons.exportDataBtn;

        this.clearDataBtn = data.buttons.clearDataBtn;
        this.paginateDataBtn = data.buttons.paginateDataBtn;

        this.importDataBtn = data.buttons.importDataBtn;

        this.sortByNameBtn = data.sortBtns.sortByNameBtn;
        this.sortByIdBtn = data.sortBtns.sortByIdBtn;
        this.sortByQtyBtn = data.sortBtns.sortByQtyBtn;
        this.filterOnFlyBtn = data.sortBtns.filterOnFlyBtn;

        this.addRowContainer = data.addRowContainer;
        this.addRowForm = data.addRowForm;

        this.tableBody = data.tableBody;

        this.importDataHolder = data.importDataHolder;

        this.randomData = data.randomData;
        this.rowsCount = this.tableBody.children.length;
        this.rowInfo = data.rowInfo;
        this.numCells = data.rowInfo.numCells;

        this.isSorted = false;
    }

    TableEditor.prototype = {

        /**
         * Toggle "Add row" form handler
         */
        toggleFormHandler: function () {
            var self = this;

            this.showAddRowBtn.addEventListener('click', function (e) {
                e.preventDefault();
                self.toggleForm();
            });
        },
        /**
         * Shows/hides "Add row" form
         */
        toggleForm: function () {
            if (this.addRowContainer.style.display !== 'block') {
                this.addRowContainer.style.display = 'block';
            } else {
                this.addRowContainer.style.display = 'none';
            }
        },

        /**
         * A handler for "Add row" form
         */
        addNewRowHandler: function () {
            var self = this;

            this.addRowBtn.addEventListener('click', function (e) {
                e.preventDefault();
                self.addRow(self.getRowDataFormTheForm());
            });
        },

        /**
         * Adds a row
         * @param  rowData {array}  - an array with data for row
         * @param [rows] {number} - optional number of rows to generate
         *
         */
        addRow: function (rowData, rows) {
            var fragment = document.createDocumentFragment(),
                rowsNum = rows ? +rows : 1,
                cellsNum = this.rowInfo.numCells,
                rowsCount = this.rowsCount,
                tdInput = document.createElement('input'),
                tr,
                td,
                i = 0,
                k;

            tdInput.type = 'checkbox';

            for (; i < rowsNum; i++) {
                tr = document.createElement('tr');

                for (k = 0; k <= cellsNum; k++) {
                    td = document.createElement('td');
                    td.setAttribute('contenteditable', 'true');
                    td.innerHTML = (rowData[k] === '' && k === 0) ? rowsCount += 1 : rowData[k];

                    if (k === cellsNum) {
                        td.innerHTML = '';
                        td.appendChild(tdInput);
                        td.setAttribute('contenteditable', 'false');
                    }

                    tr.appendChild(td);
                }
                fragment.appendChild(tr);
            }

            this.rowsCount = rowsCount;
            this.tableBody.appendChild(fragment);
        },

        deleteRowHandler: function () {
            var self = this;

            this.deleteRowBtn.addEventListener('click', function (e) {
                e.preventDefault();
                self.deleteRows();
            });
        },

        deleteRows: function () {
            var self = this,
                tableBody = this.tableBody.children,
                rows = Array.prototype.slice.call(tableBody);

            rows.forEach(function (row) {
                if (row.lastChild.childNodes[0].checked) {
                    self.tableBody.removeChild(row);
                }
            });
        },

        /**
         * Adds new row from the form data
         */
        getRowDataFormTheForm: function () {
            return [
                '',
                document.getElementById('name').value,
                document.getElementById('qtySelect').value,
                document.getElementById('available').checked ? 'yes' : 'no'
            ];
        },

        /**
         * A handler to generate random data
         */
        addRandomDataHandler: function () {
            var self = this;

            this.randomDataBtn.addEventListener('click', function (e) {
                e.preventDefault();
                self.addRandomData();
            });
        },

        /**
         * Adds random data to a table
         */
        addRandomData: function () {
            var i = 0,
                k = 0,
                l,
                randomData = [],
                randomRowsNum = Math.floor(Math.random() * 10) + 1,
                generateRandomName = function () {
                    var text = "",
                        i = 0,
                        wordLength = 7,
                    //possible = "ABCDEF";
                        possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                    for (; i < wordLength; i++) {
                        text += possible.charAt(Math.floor(Math.random() * possible.length));
                    }
                    return text;
                };

            for (; k < randomRowsNum; k++) {
                randomData.push([
                    '',
                    generateRandomName(),
                    Math.floor(Math.random() * 100) + 1,
                    Math.floor(Math.round(Math.random())) ? 'yes' : 'no'
                ]);
            }
            for (l = randomData.length; i < l; i++) {
                this.addRow(randomData[i]);
            }
            randomData = null;
        },

        /**
         * Handles event for table data clear
         */
        clearTableHandler: function () {
            var self = this;

            this.clearDataBtn.addEventListener('click', function (e) {
                e.preventDefault();
                self.clearTable();
            });
        },

        /**
         * Clears table data
         */
        clearTable: function () {
            while (this.tableBody.firstChild) {
                this.tableBody.removeChild(this.tableBody.firstChild);
            }
            this.rowsCount = 0;
            this.isSorted = false;
        },

        /**
         * Imports Table data from the text area
         */
        importTableDataHandler: function () {
            var self = this,
                tableData;

            this.importDataBtn.addEventListener('click', function () {
                tableData = self.importDataHolder.value ? JSON.parse(self.importDataHolder.value) : '';
                Object.keys(tableData).map(function (val, index) {
                    self.addRow(tableData[index]);
                });
            });
        },

        /**
         * Export Table data handler
         */
        exportTableDataHandler: function () {
            var self = this;

            this.importDataHolder.value = '';


            this.exportDataBtn.addEventListener('click', function (e) {
                e.preventDefault();
                if (!self.tableBody.children.length) {
                    return;
                }
                self.exportTableData();
                self.showExportedTableData();
            });
        },

        showExportedTableData: function () {
            var data = this.exportTableData();
            this.importDataHolder.value = JSON.stringify(data);
        },

        sortByHandler: function () {
            var self = this;

            this.sortByNameBtn.addEventListener('click', function (e) {
                e.preventDefault();
                self.sortByType('name');
            });

            this.sortByIdBtn.addEventListener('click', function (e) {
                e.preventDefault();
                self.sortByType('id');
            });

            this.sortByQtyBtn.addEventListener('click', function (e) {
                e.preventDefault();
                self.sortByType('qty');
            });
        },

        sortByType: function (type) {

            var self = this,
                holder = [],
                data = this.exportTableData(),
                rowsCount = this.rowsCount,
                rows = this.tableBody.children,
                i = 0,
                l = rows.length,
                callback;

            for (; i < l; i++) {
                holder.push(data[i]);
            }

            if (type === 'name') {
                callback = function (a, b) {
                    if (a[1].toLowerCase() > b[1].toLowerCase()) {
                        return -1;
                    }
                    if (a[1].toLowerCase() < b[1].toLowerCase()) {
                        return 1;
                    }
                    return 0;
                };
            } else if (type === 'id') {
                callback = function (a, b) {
                    return a[0] - b[0];
                };
            } else if (type === 'qty') {
                callback = function (a, b) {
                    return a[2] - b[2];
                };
            }

            holder.sort(callback);

            this.clearTable();

            this.rowsCount = rowsCount;

            holder.forEach(function (el) {
                self.addRow(el);
            });
            this.isSorted = true;
        },

        /**
         * Exports Table data to text area
         *
         * @returns {Object} holder  - an object with exported data
         */
        exportTableData: function () {
            var holder = {},
                holderItem = [],
                rows = this.tableBody.children,
                i = 0,
                rowsLength = rows.length,
                l,
                cellsLength,
                rowsData;

            for (; i < rowsLength; i++) {
                rowsData = rows[i].children;
                for (l = 0, cellsLength = rowsData.length; l < cellsLength - 1; l++) {
                    holderItem.push(rowsData[l].innerHTML);
                }
                holder[i] = holderItem;
                holderItem = [];
            }
            return holder;
        },

        filterOnFly: function () {
            var data,
                inputValue,
                dataValue,
                i,
                self = this;

            this.filterOnFlyBtn.addEventListener('keyup', function () {
                if (!self.tableBody.children) {
                    return;
                }

                data = self.tableBody.children;
                inputValue = this.value.toUpperCase();

                for (i = 0; i < data.length; i++) {

                    dataValue = data[i].children[1].innerHTML.toUpperCase();

                    if (dataValue.indexOf(inputValue) > -1) {
                        data[i].style.display = 'table-row';
                    } else {
                        data[i].style.display = 'none';
                    }
                }
            });
        },

        pagination: function () {
            var container = document.getElementById('pagination'),
                fragment = document.createDocumentFragment(),
                tableRows = this.tableBody.children,
                rowsPerPage = 5,
                i,
                listEl,
                link,
                paginated = false,
                self = this;

            this.paginateDataBtn.addEventListener('click', function (e) {
                e.preventDefault();

                if (paginated) {
                    return;
                }

                for (i = 0; i < (Math.floor(tableRows.length / rowsPerPage)); i++) {

                    link = document.createElement('a');
                    link.innerHTML = i + 1;

                    listEl = document.createElement('li');
                    listEl.appendChild(link);

                    fragment.appendChild(listEl);
                }
                container.appendChild(fragment);
                paginated = true;
            });
        },

        /**
         * Initialize handlers
         */
        init: function () {
            this.toggleFormHandler();
            this.addRandomDataHandler();
            this.addNewRowHandler();
            this.clearTableHandler();
            this.deleteRowHandler();
            this.exportTableDataHandler();
            this.importTableDataHandler();

            this.sortByHandler();
            this.filterOnFly();
            this.pagination();
        }
    };

    var newData = {
        buttons: {
            showAddRowBtn: document.getElementById('showAddRowForm'),
            deleteRowBtn: document.getElementById('deleteRowBtn'),
            addRowBtn: document.getElementById('addNewRowBtn'),
            randomDataBtn: document.getElementById('demoData'),
            exportDataBtn: document.getElementById('exportTable'),
            importDataBtn: document.getElementById('importDataBtn'),
            clearDataBtn: document.getElementById('clearTable'),
            paginateDataBtn: document.getElementById('paginate')
        },
        sortBtns: {
            sortByNameBtn: document.getElementById('sortByName'),
            sortByIdBtn: document.getElementById('sortById'),
            sortByQtyBtn: document.getElementById('sortByQty'),
            filterOnFlyBtn: document.getElementById('filter')
        },
        addRowContainer: document.getElementById('addRowContainer'),
        addRowForm: document.getElementById('addRowForm'),
        tableBody: document.getElementById('rowTableBody'),
        importDataHolder: document.getElementById('importData'),
        rowInfo: {
            numCells: 4
        }
    };

    var newTable = new TableEditor(newData);
    newTable.init();

})(this);
