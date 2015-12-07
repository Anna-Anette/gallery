(function (global) {
    'use strict';
    function TableEditor(data) {
        this.data = data ? data : {};

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
                rowsToAdd = rows ? +rows : 1,
                cellsNumber = this.rowInfo.numCells,
                rowsNumber = (this.rowsCount < this.tableBody.children.length) ? this.tableBody.children.length : this.rowsCount,
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
                    td.innerHTML = (rowData[addedCells] === '' && addedCells === 0) ? rowsNumber += 1 : rowData[addedCells];

                    if (addedCells === cellsNumber) {
                        td.innerHTML = '';
                        td.appendChild(rowEditCheckbox);
                        td.setAttribute('contenteditable', 'false');
                    }

                    tr.appendChild(td);
                }
                fragment.appendChild(tr);
            }

            this.rowsCount = rowsNumber;
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
                tableRows = this.tableBody.children,
                rowsArray = Array.prototype.slice.call(tableRows);

            rowsArray.forEach(function (row) {
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
                self.addTablePagination();
            });
        },

        /**
         * Adds random data to a table
         */
        addRandomData: function () {
            var randomRowIndex = 0,
                addedRandomRows = 0,
                randomRows = [],
                randomRowsLength,
                randomNumberOfRows = Math.floor(Math.random() * 10) + 1,
                generateRandomName = function () {
                    var result = "",
                        letterNumber = 0,
                        wordLength = 7,
                        possibleSymbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                    for (; letterNumber < wordLength; letterNumber++) {
                        result += possibleSymbols.charAt(Math.floor(Math.random() * possibleSymbols.length));
                    }
                    return result;
                };

            for (; addedRandomRows < randomNumberOfRows; addedRandomRows++) {
                randomRows.push([
                    '',
                    generateRandomName(),
                    Math.floor(Math.random() * 100) + 1,
                    Math.floor(Math.round(Math.random())) ? 'yes' : 'no'
                ]);
            }
            for (randomRowsLength = randomRows.length; randomRowIndex < randomRowsLength; randomRowIndex++) {
                this.addRow(randomRows[randomRowIndex]);
            }
            randomRows = null;
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
            this.pagerContainer.innerHTML = '';
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
                self.addTablePagination();
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

        /**
         * Shows Exported table data in the text area
         */
        showExportedTableData: function () {
            var exportedData = this.exportTableData();
            this.importDataHolder.value = JSON.stringify(exportedData);
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
                sortResult = [],
                exportedTableData = this.exportTableData(),
                rowsCount = this.rowsCount,
                rows = this.tableBody.children,
                sortedRow = 0,
                rowsLength = rows.length,
                sortOrderCallback;

            for (; sortedRow < rowsLength; sortedRow++) {
                sortResult.push(exportedTableData[sortedRow]);
            }

            if (type === 'name') {
                sortOrderCallback = function (a, b) {
                    if (a[1].toLowerCase() > b[1].toLowerCase()) {
                        return -1;
                    }
                    if (a[1].toLowerCase() < b[1].toLowerCase()) {
                        return 1;
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

            this.clearTable();

            this.rowsCount = rowsCount;

            sortResult.forEach(function (el) {
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
            var exportedResult = {},
                exportedItem = [],
                tableRows = this.tableBody.children,
                resultIndex = 0,
                exportedTableRowsLength = tableRows.length,
                exportedCellsLength,
                cellsLength,
                rowsData;

            for (; resultIndex < exportedTableRowsLength; resultIndex++) {
                rowsData = tableRows[resultIndex].children;
                for (exportedCellsLength = 0, cellsLength = rowsData.length; exportedCellsLength < cellsLength - 1; exportedCellsLength++) {
                    exportedItem.push(rowsData[exportedCellsLength].innerHTML);
                }
                exportedResult[resultIndex] = exportedItem;
                exportedItem = [];
            }
            return exportedResult;
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

                    if (filteredValue.length < filterInputValue) {
                        return;
                    }

                    if (filteredValue.indexOf(filterInputValue) > -1) {
                        tableRows[filteredRows].style.display = 'table-row';
                    } else {
                        tableRows[filteredRows].style.display = 'none';
                    }
                }
            });
        },

        showHideRows: function (link, perPage, elems, start) {
            link.addEventListener('click', function () {
                for (var i = 0; i < perPage; i++) {

                    //for (var k = 0; k < perPage; k++) {
                    elems[start + i].setAttribute('class', 'red');
                    //}
                    console.log(elems[start + i]);
                }

            });
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
                rows = this.tableBody.children,
                rowsNumber = this.tableBody.children.length,
                numberOfPages = 0,
                rowsPerPage = 5,
                createdPaginationElement,
                createdPagesNumber,
                listElement,
                paginationLink;

            if (rowsNumber <= rowsPerPage) {
                return;
            }

            createdPagesNumber = rowsNumber % rowsPerPage ? Math.ceil(rowsNumber / rowsPerPage) : rowsNumber / rowsPerPage;

            if (createdPagesNumber === numberOfPages) {
                return;
            }

            for (createdPaginationElement = 0; createdPaginationElement < createdPagesNumber; createdPaginationElement++) {
                paginationLink = document.createElement('a');
                paginationLink.innerHTML = createdPaginationElement + 1;

                this.showHideRows(paginationLink, rowsPerPage, rows, createdPaginationElement);


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
