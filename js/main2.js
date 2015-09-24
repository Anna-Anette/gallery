/**
 * Created by a.sablina on 9/23/2015.
 */
var squares = squares || {};

(function () {
    squares.square = {

        tetragons: document.getElementsByClassName('mini-square'),

        tetragonsArray: [],

        paintedTetragonsArray: [],

        colors: {
            defColor: '#fff',
            color1: '#FCF6A9',
            color2: '#FCCF05',
            color3: '#FC8505',
            color4: '#F50202'
        },
        buttons: {
            generate: document.getElementsByClassName('js-generate-button'),
            reset: document.getElementsByClassName('js-reset-button'),
            show: document.getElementsByClassName('js-show-button')
        },

        init: function () {

            this.initializeTetras();

            this.paintedTetragonsArray = this.generateTetraHolder();

            this.addRandomClicks();
            this.listenClick();
            this.clearColors();
            this.showResults();
        },

        initializeTetras: function () {
            this.tetragonsArray = [].slice.call(this.tetragons);
            console.log(this.tetragonsArray);
        },

        generateTetraHolder: function () {
            var elements = this.tetragonsArray,
                holder = [];

            elements.forEach(function (el, index, array) {
                holder.push({
                    el: el,
                    index: index,
                    clicked: 0
                })
            });
            return holder;
        },

        listenClick: function () {
            var self = this,
                els = this.tetragonsArray;

            els.forEach(function (el, ind, arr) {
                    el.addEventListener('click', function () {
                        self.paintedTetragonsArray[ind].clicked += 1;
                    });
                }
            )
        },

        getRandomClicksNumber: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        addRandomClicks: function () {
            var self = this,
                button = this.buttons.generate,
                elements = this.tetragonsArray;

            button[0].addEventListener('click', function () {
                elements.forEach(function (el) {
                        var range = self.getRandomClicksNumber(0, 100);
                        for (var i = 0; i <= range; i++) {
                            el.click();
                        }
                    }
                )
            });
        },

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

        clearColors: function () {
            var self = this,
                button = this.buttons.reset,
                els = this.tetragonsArray;

            button[0].addEventListener('click', function () {
                els.forEach(function (el, ind) {
                        self.paintTetragonWithColor(el, '#fff');
                        self.changeNumber(el, '');
                        self.paintedTetragonsArray[ind].clicked = 0;
                    }
                )
            });
        },

        changeNumber: function (el, num) {
            el.innerHTML = num;
        },

        paintTetragonWithColor: function (el, color) {
            el.style.backgroundColor = color;
        },

        indicateTetragonColor: function (ind) {
            var clicked = this.paintedTetragonsArray[ind].clicked,
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

            this.paintTetragonWithColor(this.tetragons[ind], color);
            this.changeNumber(this.tetragons[ind], clicked);
        }

    };

})();
