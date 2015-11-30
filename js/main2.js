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
    tetragonsClassName: 'mini-square',

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
        var fragment = document.createDocumentFragment(),
            container = this.tetraWrapper,
            rowsNum = this.rangeSettings.rowsNum,
            cellsNum = this.rangeSettings.cellsInRowNum,
            tr,
            td,
            k,
            i = 0;

        for ( ; i < rowsNum; i++) {
           tr = document.createElement('tr');
            for (k = 0; k < cellsNum; k++) {
                td = document.createElement('td');
                td.setAttribute('class', this.tetragonsClassName);

                tr.appendChild(td);
            }
            fragment.appendChild(tr);
        }
        container.appendChild(fragment);
    },

    /**
     * Creates an object holder for squares elements
     *
     * @returns {object} holder - an object with squares data
     */
    generateTetraHolder: function () {
        var self = this,
            holder = [];
        Object.keys(this.tetragonsArray).forEach(function(index) {
            this[index].setAttribute('data-index', index);
            holder.push({
                elem: this[index],
                index: index,
                clicked: 0,
                color: self.colors.defColor,
                isClicked: false
            });
        }, this.tetragonsArray);
        return holder;
    },

    /**
     * Listens for clicks on square elements
     */
    listenTetrasClick: function () {
        var target,
            self = this;

        this.tetraWrapper.addEventListener('click', function (e) {
            for (target = e.target; target && target != this; target = target.parentNode) {
                if (target.matches('td')) {
                    self.paintedTetragonsArray[e.target.getAttribute('data-index')].clicked += 1;
                    self.paintedTetragonsArray[e.target.getAttribute('data-index')].isClicked = true;
                    break;
                }
            }
        }, false);
    },

    /**
     * Generates random clicks on the squares basing on settings
     */
    generateRandomClicks: function () {
        var self = this,
            button = this.buttons.generate,
            elements = this.tetragonsArray,
            i,
            range;

        button[0].addEventListener('click', function () {
            elements.forEach(function (el) {
                   range = self.getRandomClicksNumber(self.rangeSettings.from, self.rangeSettings.to);
                    for (i = 0; i <= range; i++) {
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
            elements.forEach(function (el, index) {
                    if (self.paintedTetragonsArray[index].isClicked) {
                        self.indicateTetragonColor(index);
                    }
                }
            );
            self.resetClicks();
        });
    },

    /**
     * Resets isClicked value to false, to indicate if click was made
     */
    resetClicks: function () {
        var self = this;

        this.tetragonsArray.forEach(function (el, index) {
                self.paintedTetragonsArray[index].isClicked = false;
            }
        );
    },
    /**
     * Reset results for each square, by clicking on a button "Reset"
     */
    resetResults: function () {
        var self = this,
            button = this.buttons.reset,
            elements = this.tetragonsArray;

        button[0].addEventListener('click', function () {
            elements.forEach(function (el, index) {
                    self.paintedTetragonsArray[index].clicked = 0;
                    self.paintedTetragonsArray[index].isClicked = false;

                    if (self.paintedTetragonsArray[index].color.toUpperCase() !== self.colors.defColor.toUpperCase()) {
                        self.paintedTetragonsArray[index].color = self.colors.defColor;
                    }
                    self.fillTetragonWithTextAndColor(index, '');
                }
            );
        });
    },

    /**
     * Adds  a color and a number for each square
     *
     * @param {number} index - an index of current element
     * @param {string/number} [num] - a number of clicks or empty string for reset
     */
    fillTetragonWithTextAndColor: function (index, num) {
        var elementData = this.paintedTetragonsArray[index];

        elementData.elem.style.backgroundColor = elementData.color;
        elementData.elem.innerHTML = (num === '') ? num : elementData.clicked;
    },

    /**
     * Indicates square color to fill
     *
     * @param {number} index -  an index of a square element
     */
    indicateTetragonColor: function (index) {
        var element = this.paintedTetragonsArray[index],
            clicked = element.clicked,
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

        element.color = color;
        this.fillTetragonWithTextAndColor(index);
    }
};
