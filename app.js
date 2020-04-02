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

    var data = {
        allItems: {
            exp: [],
            inc: []
        },

        totals: {
            exp: 0,
            inc: 0
        }
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

        getBalance: function() {
            var balance;

            balance = 0;

            data.allItems.inc.forEach(function (current, index, array) {
                balance += parseInt(current.value) ;
            });

            data.allItems.exp.forEach(function (current, index, array) {
                balance -= parseInt(current.value) ;
            });

            console.log(balance);

            return balance;
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
        balanceUI: '.budget__value'
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                desctiption: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
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

        updateBalance: function(bal) {

           document.querySelector(DOMStrings.balanceUI).textContent = bal;

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


    var ctrlAddItem = function () {
        var input, newItem, balance;

        // 1. Get the input data
        input = UICtrl.getInput();

        // 2. Add the item to budget
        newItem = budgetCtrl.addItem(input.type, input.desctiption, input.value);

        // 3. Add the item to UI
        UICtrl.addListItem(newItem, input.type);

        // 4. Clear Fields
        UICtrl.clearField();

        // 4. Calculate budget
        balance = budgetCtrl.getBalance();
        UICtrl.updateBalance(balance);

        // 5. Display budget on UI
    };

    return {
        init: function () {
            setupEventListeners();
        }
    };

})(budgetController, UIController);


controller.init();