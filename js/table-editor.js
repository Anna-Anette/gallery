(function (global) {

    function TableEditor(data) {
        this.data = data;

        this.showAddRowBtn = data.buttons.showAddRowBtn;
        this.addRowBtn = data.buttons.addRowBtn;
        this.randomDataBtn = data.buttons.randomDataBtn;
        this.clearTableBtn = data.buttons.clearTableBtn;
        this.deleteRowBtn = data.buttons.deleteRowBtn;

        this.addRowContainer = data.addRowContainer;
        this.addRowForm = data.addRowForm;

        this.tableBody = data.tableBody;

        this.randomData = data.randomData;
        this.rowsCount = this.tableBody.children.length;
        this.rowInfo = data.rowInfo;
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
            var addRowContainer = this.addRowContainer;

            if (addRowContainer.style.display !== 'block') {
                addRowContainer.style.display = 'block';
            } else {
                addRowContainer.style.display = 'none';
            }
        },

        /**
         * A handler for "Add row" form
         */
        addNewRowHandler: function () {
            var self = this,
                btn = this.addRowBtn;

            btn.addEventListener('click', function (e) {
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
            var
                fragment = document.createDocumentFragment(),
                container = this.tableBody,
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
                    td.innerHTML = (k === 0) ? rowsCount += 1 : rowData[k];
                    tr.appendChild(td);
                    if (k === cellsNum) {
                        td.innerHTML = '';
                        td.appendChild(tdInput);
                    }
                }
                tr.setAttribute('data-index', rowsCount + '');
                fragment.appendChild(tr);
            }
            this.rowsCount = rowsCount;
            container.appendChild(fragment);
        },

        deleteRowHandler: function () {
            var self = this,
                btn = this.deleteRowBtn;

            btn.addEventListener('click', function (e) {
                e.preventDefault();
                self.deleteRows();
            });
        },

        deleteRows: function () {
            var self = this,
                tableBody = self.tableBody.children,
                rows = Array.prototype.slice.call(tableBody);

            rows.forEach(function (row) {
                if (row.childNodes[row.children.length - 1].childNodes[0].checked) {
                    self.tableBody.removeChild(row);
                }
            });
        },


        /**
         * Adds new row from the form data
         */
        getRowDataFormTheForm: function () {
            return [
                this.rowsCount,
                document.getElementById('name').value,
                document.getElementById('qtySelect').value,
                document.getElementById('available').checked ? 'yes' : 'no'
            ];
        },

        /**
         * A handler to generate random data
         */
        addRandomDataHandler: function () {
            var self = this,
                btn = this.randomDataBtn;

            btn.addEventListener('click', function (e) {
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
                        wordLength = 5,
                        possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                    for (; i < wordLength; i++)
                        text += possible.charAt(Math.floor(Math.random() * possible.length));
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
            var self = this,
                btn = this.clearTableBtn;

            btn.addEventListener('click', function (e) {
                e.preventDefault();
                self.clearTable();
            });
        },

        /**
         * Clears table data
         */
        clearTable: function () {
            var tableBody = this.tableBody;

            while (tableBody.firstChild) {
                tableBody.removeChild(tableBody.firstChild);
            }
            this.rowsCount = 0;
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
        }
    };

    var newData = {
        buttons: {
            showAddRowBtn: document.getElementById('showAddRowForm'),
            deleteRowBtn: document.getElementById('deleteRowBtn'),
            addRowBtn: document.getElementById('addNewRowBtn'),
            randomDataBtn: document.getElementById('demoData'),
            clearTableBtn: document.getElementById('clearTable')
        },
        addRowContainer: document.getElementById('addRowContainer'),
        addRowForm: document.getElementById('addRowForm'),
        tableBody: document.getElementById('rowTableBody'),
        rowInfo: {
            numCells: 4
        },
        randomData: [[
            '',
            'random1',
            1,
            'yes'
        ], [
            '',
            'random2',
            2,
            'no'
        ],
            [
                '',
                'random3',
                3,
                'yes'
            ], [
                '',
                'random4',
                4,
                'no'
            ], [
                '',
                'random5',
                5,
                'yes'
            ]
        ]
    };

    var newTable = new TableEditor(newData);
    newTable.init();
})(this);
