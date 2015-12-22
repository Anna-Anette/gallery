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

        this.rowsPerPage = 10;
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

                    td.innerHTML = (addedCells === 0) ? (rowData[addedCells]) : rowData[addedCells];
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
            this.addTablePagination();
        },
        /**
         * Delete row handler
         *
         */
        deleteRowHandler: function () {
            var self = this;

            this.deleteRowBtn.addEventListener('click', function (e) {
                e.preventDefault();

                self.deleteRow();
                self.addTablePagination();
            });
        },
        /**
         * Deletes row from DOM and updates data
         *
         */
        deleteRow: function () {
            var self = this,
                rowsArray = Array.prototype.slice.call(this.tableBody.children);

            rowsArray.forEach(function (row, index) {
                if (row.lastChild.childNodes[0].checked) {

                    self.model.deleteEntry(index);

                    //remove from DOM
                    self.tableBody.removeChild(row);
                }
            });
        },

        /**
         * Adds new row from the form
         */
        getRowDataFormTheForm: function () {
            var rowsCount = this.model.entriesNumber;
            return [
                rowsCount + 1,
                document.getElementById('name').value ? document.getElementById('name').value : 'Empty',
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

                for (var index in data) {
                    if (data.hasOwnProperty(index)) {
                        self.addRow(data[index]);
                    }
                }
                self.addTablePagination();
            });
        },

        /**
         * Clears table data
         */
        _clearTable: function () {
            while (this.tableBody.firstChild) {
                this.tableBody.removeChild(this.tableBody.firstChild);
            }
            this.pagerContainer.innerHTML = '';
        },

        /**
         * Handles event for table data clearing
         */
        clearTableHandler: function () {
            var self = this;

            this.clearDataBtn.addEventListener('click', function (e) {
                e.preventDefault();
                self._clearTable();
                self.model.clearData();
            });
        },

        /**
         * Imports Table data from the text area
         */
        importTableDataHandler: function () {
            var self = this,
                data;

            this.importDataBtn.addEventListener('click', function () {
                data = self.importDataHolder.value ? JSON.parse(self.importDataHolder.value) : '';

                self.model.importTableData(data);

                for (var index in data) {
                    if (data.hasOwnProperty(index)) {
                        self.addRow(data[index]);
                    }
                }

                self.addTablePagination();
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
                    self._showExportedTableData(data);
                }
            });
        },

        /**
         * Shows Exported table data in the text area
         * @params {object) data - an object with data
         */
        _showExportedTableData: function (data) {
            this.importDataHolder.value = JSON.stringify(data);
        },

        /**
         * Sorting handlers
         */
        sortByHandler: function () {
            var self = this;

            this.sortByNameBtn.addEventListener('click', function (e) {
                e.preventDefault();
                self._sortByType('name');
            });

            this.sortByIdBtn.addEventListener('click', function (e) {
                e.preventDefault();
                self._sortByType('id');
            });

            this.sortByQtyBtn.addEventListener('click', function (e) {
                e.preventDefault();
                self._sortByType('qty');
            });
        },

        /**
         * Sorts table according to sort type
         * @param {String} type - type of sort
         */
        _sortByType: function (type) {
            var self = this,
                index,
                sortResult = this.model._sortByType(type);

            this._clearTable();

            for (index in sortResult) {
                if (sortResult.hasOwnProperty(index)) {
                    self.addRow(sortResult[index]);
                }
            }
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

        /**
         * Makes Pagination active
         * @param [pagerElement] - a pager element
         */
        _makePaginationActive: function (pagerElement) {
            var page = pagerElement ? +pagerElement.innerHTML - 1 : 0,
                pagerElements = Array.prototype.slice.call(this.pagerContainer.children);

            pagerElements.forEach(function (element) {
                element.setAttribute('class', '');
            });

            this.pagerContainer.children[page].setAttribute('class', 'active');
        },

        /**
         * Show/hide rows handler
         * @param link - pagination link
         */
        toggleRowsHandler: function (link) {
            var self = this;

            link.addEventListener('click', function (e) {
                e.preventDefault();

                self.toggleRows(this.innerHTML);
                self._makePaginationActive(this);
            });
        },

        /**
         * Shows/hides rows
         * @param {number} page - a page number
         * @param {number} [rowsPerPage] - a number of rows per page
         */
        toggleRows: function (page, rowsPerPage) {
            var elementsArr = Array.prototype.slice.call(this.tableBody.children),
                perPage = rowsPerPage ? rowsPerPage : this.rowsPerPage,
                startPage = (+page - 1) * perPage;

            elementsArr.forEach(function (el) {
                el.setAttribute('class', 'hidden');
            });

            for (var k = startPage; k < startPage + perPage; k++) {
                if (elementsArr[k] !== undefined) {
                    elementsArr[k].setAttribute('class', 'visible');
                }
            }
        },

        /**
         * A handler for "Paginate" button
         */
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

                this.toggleRowsHandler(paginationLink);


                listElement = document.createElement('li');
                listElement.appendChild(paginationLink);

                fragment.appendChild(listElement);
                numberOfPages += 1;
            }

            container.innerHTML = '';
            container.appendChild(fragment);

            this.toggleRows(1);
            this._makePaginationActive();
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
