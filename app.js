//BUDGET MODULE
var budgetController = (function () {

    //Some code

})();



//UI MODULE
var UIController = (function () {

    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    }

    return {
        getInput : function () {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                desctiption: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
            };
        },

        getDOMStrings : function () {
            return DOMStrings;
        }
    }

})();



//Global APP MODULE

var controller = (function (budgetCtrl, UICtrl) {

    var DOMStrings = UICtrl.getDOMStrings();

    var ctrlAddItem = function () {

        // 1. Get the input data

        // 2. Add the item to budget

        // 3. Add the item to UI

        // 4. Calculate budget

        // 5. Display budget on UI
    }

    document.querySelector(DOMStrings.inputBtn).addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", function (event) {

        if (event.keycode === 13 || event.which === 13) {
            ctrlAddItem();
        }
    });

})(budgetController, UIController);