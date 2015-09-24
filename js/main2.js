/**
 * Created by a.sablina on 9/23/2015.
 */
var squares = squares || {};
squares.square = {

    /**
     * Square elements
     */
    tetraWrapper: 'tetraWrapper',
    tetragons: document.getElementsByClassName('mini-square'),

    /**
     * Array holders for elements
     */
    tetragonsArray: [],
    paintedTetragonsArray: [],

    /**
     * Color Examples
     */
    colors: {
        defColor: '#fff',
        color1: '#FCF6A9',
        color2: '#FCCF05',
        color3: '#FC8505',
        color4: '#F50202'
    },

    /**
     * Squares ranges
     */
    rangeSettings: {
        from: 0,
        to: 100,
        rowsNum: 10,
        cellsInRowNum: 10,
        tetrasNum: 50
    },

    /**
     * Squares ranges
     */
    buttons: {
        generate: document.getElementsByClassName('js-generate-button'),
        reset: document.getElementsByClassName('js-reset-button'),
        show: document.getElementsByClassName('js-show-button')
    },

    /**
     * Initialize function
     */
    init: function () {
        this.tetraWrapper = document.getElementById(this.tetraWrapper);

        this.generateTetras();

        this.tetragonsArray = [].slice.call(this.tetragons);
        this.paintedTetragonsArray = this.generateTetraHolder();

        this.listenTetrasClick();

        this.generateRandomClicks();
        this.showResults();
        this.resetResults();
    },

    /**
     * Generates HTML elements basing on settings
     */
    generateTetras: function () {
        var container = this.tetraWrapper,
            rowsNum = this.rangeSettings.rowsNum,
            cellsNum = this.rangeSettings.cellsInRowNum;

        for (var i = 0; i < rowsNum; i++) {
            var tr = document.createElement('tr');
            for (var k = 0; k < cellsNum; k++) {
                var td = document.createElement('td');
                td.setAttribute('class', 'mini-square');

                tr.appendChild(td);
            }
            container.appendChild(tr);
        }
    },

    /**
     * Creates an array holder for squares elements
     * @returns {array} holder - an array with squares data
     */
    generateTetraHolder: function () {
        var elements = this.tetragonsArray,
            holder = [];

        elements.forEach(function (el, index) {
            el.setAttribute('data-index', index);

            holder.push({
                elem: el,
                index: index,
                clicked: 0
            })
        });
        return holder;
    },

    /**
     * Listens for clicks on square elements
     */
    listenTetrasClick: function () {
        var self = this,
            element = this.tetraWrapper;

        element.addEventListener('click', function (e) {
            var tetraIndex = e.target.getAttribute('data-index');
            self.paintedTetragonsArray[tetraIndex].clicked += 1;
        });
    },

    /**
     * Generates random clicks on the squares basing on settings
     */
    generateRandomClicks: function () {
        var self = this,
            button = this.buttons.generate,
            elements = this.tetragonsArray;

        button[0].addEventListener('click', function () {
            elements.forEach(function (el) {
                    var range = self.getRandomClicksNumber(self.rangeSettings.from, self.rangeSettings.to);
                    for (var i = 0; i <= range; i++) {
                        el.click();
                    }
                }
            )
        });
    },

    /**
     * Listens for clicks on square elements
     *
     * @param {number} min -  a minimal value of a range
     * @param {number} max -  a maximum value of a range
     * @returns {number} - a random number
     */
    getRandomClicksNumber: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * Shows results for each square, by clicking on a button "Show"
     */
    showResults: function () {
        var self = this,
            button = this.buttons.show,
            elements = this.tetragonsArray;

        button[0].addEventListener('click', function () {
            elements.forEach(function (el, ind) {
                    self.indicateTetragonColor(ind);
                }
            )
        });
    },

    /**
     * Reset results for each square, by clicking on a button "Reset"
     */
    resetResults: function () {
        var self = this,
            button = this.buttons.reset,
            els = this.tetragonsArray;

        button[0].addEventListener('click', function () {
            els.forEach(function (el, index) {
                    self.paintedTetragonsArray[index].clicked = 0;
                    self.fillTetragonWithTextAndColor(index, self.colors.defColor, '');
                }
            )
        });
    },

    /**
     * Adds  a color and a number for each square
     *
     * @param {number} index - an index of current element
     * @param {string} color -  a color to fill the square
     * @param {string/number} [num] - a number of clicks or empty string for reset
     */
    fillTetragonWithTextAndColor: function (index, color, num) {
        var elementData = this.paintedTetragonsArray[index];

        elementData.elem.style.backgroundColor = color;
        elementData.elem.innerHTML = (num === '') ? num : elementData.clicked;
    },

    /**
     * Indicates square color to fill
     *
     * @param {number} index -  an index of a square element
     */
    indicateTetragonColor: function (index) {
        var clicked = this.paintedTetragonsArray[index].clicked,
            color;

        switch (true) {
            case (clicked > 25 && clicked < 50):
                color = this.colors.color1;
                break;
            case (clicked >= 50 && clicked < 75):
                color = this.colors.color2;
                break;
            case (clicked >= 75 && clicked < 100):
                color = this.colors.color3;
                break;
            case (clicked > 100):
                color = this.colors.color4;
                break;
            default:
                color = this.colors.defColor;
                break;
        }

        this.fillTetragonWithTextAndColor(index, color);
    }
};
