//BUDGET MODULE
var budgetController = (function () {

    var Expenses = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },

        totals: {
            exp: 0,
            inc: 0
        },

        budget: 0,
        percentage: -1
    };

    return {
        addItem: function (type, des, val) {
            var newItem;
            var ID;

            //Create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            //Create new item based on "inc" or "exp" type
            if (type === 'exp') {
                newItem = new Expenses(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            //Push it into data
            data.allItems[type].push(newItem);

            //Return new element
            return newItem;
        },

        calculateBudget: function () {

            //Calculate total
            calculateTotal('exp');
            calculateTotal('inc');

            //Calculate the budget
            data.budget = data.totals.inc - data.totals.exp;

            //Calculate the percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);

            } else {
                data.percentage = -1;
            }
        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        }
    };

})();



//UI MODULE
var UIController = (function () {

    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage'
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                desctiption: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },

        getDOMStrings: function () {
            return DOMStrings;
        },

        addListItem: function (obj, type) {
            var html, newHtml, element;
            // Create HTML string with placeholder text

            if (type === 'inc') {
                element = DOMStrings.incomeContainer;

                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMStrings.expensesContainer;

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);


        },

        clearField: function () {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function (current, index, array) {
                current.value = "";
            });

            fields[0].focus();
        },

        displayBudget: function (obj) {

            document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExp;

            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';

            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';

            }

        }
    };

})();



//Global APP MODULE
var controller = (function (budgetCtrl, UICtrl) {

    var setupEventListeners = function () {
        var DOMStrings = UICtrl.getDOMStrings();

        document.querySelector(DOMStrings.inputBtn).addEventListener("click", ctrlAddItem);

        document.addEventListener("keypress", function (event) {

            if (event.keycode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    };

    var updateBudget = function () {

        // 1. Calculate budget
        budgetCtrl.calculateBudget();

        // 2. Return the budget
        var budget = budgetCtrl.getBudget();

        // 3. Display budget on UI
        UICtrl.displayBudget(budget);

    };

    var ctrlAddItem = function () {
        var input;
        var newItem;

        // 1. Get the input data
        input = UICtrl.getInput();

        if (input.desctiption !== "" && !isNaN(input.value) && input.value > 0) {

            // 2. Add the item to budget
            newItem = budgetCtrl.addItem(input.type, input.desctiption, input.value);

            // 3. Add the item to UI
            UICtrl.addListItem(newItem, input.type);

            // 4. Clear Fields
            UICtrl.clearField();

            // 5. Calculate budget
            updateBudget();

        }
    };

    return {
        init: function () {
            setupEventListeners();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0
            });
        }
    };

})(budgetController, UIController);


controller.init();