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
        this.importDataBtn = data.buttons.importDataBtn;

        this.sortingRow = data.sortBtns.sortingRow;
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
        this.rowsPerPage = 4;
        this.currentPage = 1;
    }

    TableEditor.prototype = {

        extendOptions: function () {
            for (var i = 1; i < arguments.length; i++) {
                for (var key in arguments[i]) {
                    if (arguments[i].hasOwnProperty(key)) {
                        arguments[0][key] = arguments[i][key];
                    }
                }
            }
            return arguments[0];
        },

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
                var data = self.getRowDataFormTheForm();

                e.preventDefault();

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
                deleteEl = document.createElement('input'),
                editEl = document.createElement('span'),
                tr,
                td,
                i = 0,
                j;

            deleteEl.type = 'checkbox';

            editEl.setAttribute('class', 'glyphicon glyphicon-pencil');
            editEl.setAttribute('data-edit', 'true');

            for (; i < rowsToAdd; i++) {
                tr = document.createElement('tr');

                for (j = 0; j <= cellsNumber; j++) {
                    td = document.createElement('td');
                    if (j === 0 || j === cellsNumber - 1 || j === cellsNumber) {
                        td.setAttribute('contenteditable', 'false');
                    } else {
                        td.setAttribute('contenteditable', 'true');
                    }

                    td.setAttribute('data-index', j + '');

                    td.innerHTML = rowData[j] ? rowData[j] : '';

                    if (j === cellsNumber - 1) {
                        td.appendChild(editEl);
                    }
                    if (j === cellsNumber) {
                        td.appendChild(deleteEl);
                    }

                    tr.appendChild(td);
                }
                //add to DOM
                fragment.appendChild(tr);
            }
            this.tableBody.appendChild(fragment);
            this.updatePagination();
        },

        editContentHandler: function () {
            var content = this.tableBody,
                target;

            content.addEventListener('click', function (e) {
                e = e || event;
                target = e.target || e.srcElement;

                if (!target.getAttribute('data-edit')) {
                    return;
                }

                return false;
            });
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
                self.updatePagination();
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
            return [
                this.model.entriesNumber + 1,
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
            });
        },

        /**
         * Handles event for table data clearing
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
         * Clears table data
         */
        clearTable: function () {
            while (this.tableBody.firstChild) {
                this.tableBody.removeChild(this.tableBody.firstChild);
            }

            this._clearPagerContainer();
            this.currentPage = 1;

            this._clearSortingMarks();
        },

        /**
         * Imports Table data from the text area
         */
        importTableDataHandler: function () {
            var self = this,
                data;

            this.importDataBtn.addEventListener('click', function () {
                if (self.importDataHolder.value) {
                    try {
                        JSON.parse(self.importDataHolder.value);
                    } catch (e) {
                        self._showExportedTableData('Data is not valid ' + e);
                        return;
                    }
                    data = JSON.parse(self.importDataHolder.value);
                } else {
                    return;
                }

                self.model.importTableData(data);

                for (var index in data) {
                    if (data.hasOwnProperty(index)) {
                        self.addRow(data[index]);
                    }
                }
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
            var self = this,
                target;

            this.sortingRow.addEventListener('click', function (e) {
                if (!self.model.entriesNumber) {
                    return;
                }

                e = e || event;
                target = e.target || e.srcElement;

                if (target.nodeName !== 'TD') {
                    target = target.parentNode;
                }

                if (!target.getAttribute('data-sort')) {
                    return;
                }

                self._clearSortingMarks();

                self._toggleSortingIcon(target.firstChild.nextSibling);

                self.sortCellsByType(target);
                target.setAttribute('data-is-sorted', 'true');
            });
        },
        /**
         * Clears sorting indicators
         */
        _clearSortingMarks: function () {
            var sortingRow = Array.prototype.slice.call(this.sortingRow.children);

            sortingRow.forEach(function (el) {
                if (el.getAttribute('data-is-sorted')) {
                    el.setAttribute('data-is-sorted', 'false');
                }
            });
        },

        /**
         * Changes sorting arrow icon
         * @params el - an icon element
         */
        _toggleSortingIcon: function (el) {
            var classNameDown = 'glyphicon glyphicon-arrow-down',
                classNameUp = 'glyphicon glyphicon-arrow-up';

            if (el.getAttribute('class') === classNameUp) {
                el.setAttribute('class', classNameDown);
                this.model.direction = true;
                return;
            }
            el.setAttribute('class', classNameUp);
            this.model.direction = false;
        },

        /**
         * Sorts table according to sort type
         * @param  target - type of sort
         */
        sortCellsByType: function (target) {
            var self = this,
                index,
                sortResult = this.model.sortByType(target.getAttribute('data-sort'), +target.getAttribute('data-index'));

            this.clearTable();
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
            var rows,
                filterInput,
                filteredValue,
                i,
                rowsLength,
                self = this;

            this.filterOnFlyBtn.addEventListener('keyup', function () {
                if (!self.tableBody.children) {
                    return;
                }

                rows = self.tableBody.children;
                filterInput = this.value.toUpperCase();

                for (i = 0, rowsLength = rows.length; i < rowsLength; i++) {

                    filteredValue = rows[i].children[1].innerHTML.toUpperCase();

                    if (filteredValue.indexOf(filterInput) > -1) {
                        rows[i].setAttribute('class', 'visible');
                    } else {
                        rows[i].setAttribute('class', 'hidden');
                    }
                }
                if (this.value === '') {
                    self.updatePagination();
                }
            });
        },

        /**
         * Show/hide rows handler
         */
        toggleRowsHandler: function () {
            var self = this, target;

            this.pagerContainer.addEventListener('click', function (e) {

                e = e || event;
                target = e.target || e.srcElement;
                if (target.nodeName !== 'A' ||self.currentPage === +target.innerHTML) {
                    return;
                }

                self.currentPage = +target.innerHTML;

                self.toggleRows();
            });
        },
        _createPaginationElements: function (elements) {
            var pager = this.pagerContainer,
                fragment = document.createDocumentFragment(),
                i,
                pagerElement,
                pagerLink;

            for (i = 0; i < elements; i++) {
                pagerLink = document.createElement('a');
                pagerLink.innerHTML = i + 1;

                pagerElement = document.createElement('li');
                pagerElement.appendChild(pagerLink);

                fragment.appendChild(pagerElement);
            }
            pager.appendChild(fragment);
        },

        /**
         * Adds pagination for table
         */
        updatePagination: function () {
            var rowsNumber = this.tableBody.children.length,
                rowsPerPage = this.rowsPerPage,
                rowsModule = rowsNumber % rowsPerPage,
                rowsRatio = rowsNumber / rowsPerPage,
                pagesNumber = rowsModule ? Math.ceil(rowsRatio) : rowsRatio;
            this._clearPagerContainer();

            if (rowsNumber <= rowsPerPage) {
                this.currentPage = 1;
                this.toggleRows();
                return;
            }

            this._clearPagerContainer();
            this._createPaginationElements(pagesNumber);

            if (Math.ceil(rowsRatio) <= this.currentPage) {
                this.currentPage -=1;
            }

            this.toggleRows();
        },
        /**
         * Shows/hides rows
         */
        toggleRows: function () {
            var elementsArr = Array.prototype.slice.call(this.tableBody.children),
                perPage =  this.rowsPerPage,
                startPage = (this.currentPage - 1) * perPage ;

            elementsArr.forEach(function (el) {
                el.setAttribute('class', 'hidden');
            });

            for (var k = startPage; k < startPage + perPage; k++) {
                if (elementsArr[k] !== undefined) {
                    elementsArr[k].setAttribute('class', '');
                }
            }
            this._makePaginationActive();
        },

        /**
         * Makes Pagination active
         */
        _makePaginationActive: function () {
            var pagerElements = Array.prototype.slice.call(this.pagerContainer.children);

            if (!pagerElements.length) {
                return;
            }

            pagerElements.forEach(function (element) {
                element.setAttribute('class', '');
            });

            this.pagerContainer.children[this.currentPage - 1].setAttribute('class', 'active');
        },

        /**
         * Clears Pagination Container
         */
        _clearPagerContainer: function () {
            this.pagerContainer.innerHTML = '';
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
            this.toggleRowsHandler();
            this.editContentHandler();
        }
    };

    global.TableEditor = TableEditor;
})(this);
