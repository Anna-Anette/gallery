(function (global) {
    'use strict';
    function TableEditor(data) {
        this.data = data;

        this.model = new EntriesModel();

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
        this.pagerContainer = data.pagerContainer;

        this.randomData = data.randomData;

        this.rowInfo = data.rowInfo;
        this.numCells = data.rowInfo.numCells;

        this.rowsPerPage = 5;

    }

    TableEditor.prototype = {

        /**
         * Toggle "Add row" form handler
         */
        toggleFormHandler: function () {
            var self = this;

            this.showAddRowBtn.addEventListener('click', function (e) {
                e.preventDefault();
                if (self.addRowContainer.style.display !== 'block') {
                    self.addRowContainer.style.display = 'block';
                } else {
                    self.addRowContainer.style.display = 'none';
                }
            });
        },

        /**
         * A handler for "Add row" form
         */
        addNewRowHandler: function () {
            var self = this,
                data;

            this.addRowBtn.addEventListener('click', function (e) {
                e.preventDefault();

                data = self.getRowDataFormTheForm();

                self.model.addEntry(data);
                self.addRow(data);
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
                rowsToAdd = rows ? +rows : 1,
                cellsNumber = this.numCells,
                rowEditCheckbox = document.createElement('input'),
                tr,
                td,
                addedRows = 0,
                addedCells;

            rowEditCheckbox.type = 'checkbox';

            for (; addedRows < rowsToAdd; addedRows++) {
                tr = document.createElement('tr');

                for (addedCells = 0; addedCells <= cellsNumber; addedCells++) {
                    td = document.createElement('td');
                    td.setAttribute('contenteditable', 'true');
                    td.innerHTML = (addedCells === 0) ? (rowData[addedCells] + 1) : rowData[addedCells];

                    if (addedCells === cellsNumber) {
                        td.innerHTML = '';
                        td.appendChild(rowEditCheckbox);
                        td.setAttribute('contenteditable', 'false');
                    }

                    tr.appendChild(td);
                }
                //add to DOM
                fragment.appendChild(tr);
            }
            this.tableBody.appendChild(fragment);
        },

        deleteRowHandler: function () {
            var self = this;

            this.deleteRowBtn.addEventListener('click', function (e) {
                e.preventDefault();

                self.deleteRow();
            });
        },

        deleteRow: function () {
            var self = this,
                tableRows = this.tableBody.children,
                rowsArray = Array.prototype.slice.call(tableRows);

            rowsArray.forEach(function (row, index) {
                if (row.lastChild.childNodes[0].checked) {

                    self.model.deleteEntry(index);

                    //remove from DOM
                    self.tableBody.removeChild(row);
                }
            });
        },

        /**
         * Adds new row from the form data
         */
        getRowDataFormTheForm: function () {
            var rowsCount = this.model.entriesNumber;
            return [
                rowsCount,
                document.getElementById('name').value,
                +document.getElementById('qtySelect').value,
                document.getElementById('available').checked ? 'yes' : 'no'
            ];
        },

        /**
         * A handler to generate random data
         */
        addRandomDataHandler: function () {
            var self = this,
                data;
            this.randomDataBtn.addEventListener('click', function (e) {
                e.preventDefault();
                data = self.model.addRandomEntries();

                Object.keys(data).map(function (val, index) {
                    self.addRow(data[index]);
                });
                // self.addTablePagination();
            });
        },

        /**
         *
         * Clears table data
         */
        clearTable: function () {
            while (this.tableBody.firstChild) {
                this.tableBody.removeChild(this.tableBody.firstChild);
            }
            this.pagerContainer.innerHTML = '';
        },

        /**
         * Handles event for table data clear
         */
        clearTableHandler: function () {
            var self = this;

            this.clearDataBtn.addEventListener('click', function (e) {
                e.preventDefault();
                self.clearTable();
                self.model.clearData();
            });
        },


        /**
         * Imports Table data from the text area
         */
        importTableDataHandler: function () {
            var self = this,
                tableData;

            this.importDataBtn.addEventListener('click', function () {
                tableData = self.importDataHolder.value ? JSON.parse(self.importDataHolder.value) : '';

                self.model.importTableData(tableData);

                Object.keys(tableData).map(function (val, index) {
                    self.addRow(tableData[index]);
                });
                //self.addTablePagination();
            });
        },

        /**
         * Export Table data handler
         */
        exportTableDataHandler: function () {
            var self = this,
                data;

            this.importDataHolder.value = '';

            this.exportDataBtn.addEventListener('click', function (e) {
                e.preventDefault();
                data = self.model.exportTableData();
                if (data) {
                    self.showExportedTableData(data);
                }
            });
        },

        /**
         * Shows Exported table data in the text area
         * @params {object) data - an object with data
         */
        showExportedTableData: function (data) {
            this.importDataHolder.value = JSON.stringify(data);
        },

        /**
         * Sorting handler
         */
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

        /**
         * Sorts table according to sort type
         * @param {String} type - type of sort
         */
        sortByType: function (type) {
            var self = this,
                sortResult = this.model.sortByType(type);

            this.clearTable();

            Object.keys(sortResult).map(function (val, index) {
                self.addRow(sortResult[index]);
            });
        },

        /**
         * Filters table by name on fly
         */
        filterOnFly: function () {
            var tableRows,
                filterInputValue,
                filteredValue,
                filteredRows,
                tableRowsLength,
                self = this;

            this.filterOnFlyBtn.addEventListener('keyup', function () {
                if (!self.tableBody.children) {
                    return;
                }

                tableRows = self.tableBody.children;
                filterInputValue = this.value.toUpperCase();

                for (filteredRows = 0, tableRowsLength = tableRows.length; filteredRows < tableRowsLength; filteredRows++) {

                    filteredValue = tableRows[filteredRows].children[1].innerHTML.toUpperCase();

                    if (filteredValue.indexOf(filterInputValue) > -1) {
                        tableRows[filteredRows].setAttribute('class', 'visible');
                    } else {
                        tableRows[filteredRows].setAttribute('class', 'hidden');
                    }
                }
            });
        },

        showHideRowsHandler: function (link) {
            var self = this;
            link.addEventListener('click', function (e) {
                e.preventDefault();
                self.showHideRows(this);
            });
        },

        showHideRows: function (link, rowsPerPage) {
            var elemsArr = Array.prototype.slice.call(this.tableBody.children),
                perPage = rowsPerPage ? rowsPerPage : this.rowsPerPage,
                startPage;
            startPage = (+link.innerHTML - 1) * perPage;
            elemsArr.forEach(function (el) {
                el.setAttribute('class', 'hidden');
            });
            for (var k = startPage; k < startPage + perPage; k++) {
                if (elemsArr[k] !== undefined) {
                    elemsArr[k].setAttribute('class', 'visible');
                }
            }
        },

        paginationHandler: function () {
            var self = this;

            this.paginateDataBtn.addEventListener('click', function (e) {
                e.preventDefault();
                self.addTablePagination();
            });
        },
        /**
         * Adds pagination for table
         */
        addTablePagination: function () {
            var container = this.pagerContainer,
                fragment = document.createDocumentFragment(),
                rowsNumber = this.tableBody.children.length,
                numberOfPages = 0,
                rowsPerPage = this.rowsPerPage,
                createdPaginationElement,
                createdPagesNumber,
                listElement,
                paginationLink;

            if (rowsNumber <= rowsPerPage) {
                container.innerHTML = '';
                return;
            }

            createdPagesNumber = rowsNumber % rowsPerPage ? Math.ceil(rowsNumber / rowsPerPage) : rowsNumber / rowsPerPage;

            if (createdPagesNumber === numberOfPages) {
                return;
            }

            for (createdPaginationElement = 0; createdPaginationElement < createdPagesNumber; createdPaginationElement++) {
                paginationLink = document.createElement('a');
                paginationLink.innerHTML = createdPaginationElement + 1;

                this.showHideRowsHandler(paginationLink);


                listElement = document.createElement('li');
                listElement.appendChild(paginationLink);

                fragment.appendChild(listElement);
                numberOfPages += 1;
            }


            container.innerHTML = '';
            container.appendChild(fragment);
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
            this.paginationHandler();
        }
    };

    global.TableEditor = TableEditor;
})(this);
