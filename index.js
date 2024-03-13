console.clear();

function Task(description, cost) {
    const _id = 'id' + Math.random().toString(16).slice();
    const _description = description;
    const _cost = cost;

    Object.defineProperty(this, 'id', {
        get() {
            return _id;
        }
    });

    Object.defineProperty(this, 'description', {
        get() {
            return _description;
        }
    });

    Object.defineProperty(this, 'cost', {
        get() {
            return _cost;
        }
    });
}

class IncomeTask extends Task {

    makeDone(budget) {
        budget.income += this.cost;
    }

    makeUnDone(budget) {
        budget.income -= this.cost;
    }
}

class ExpenseTask extends Task {
    makeDone(budget) {
        budget.expenses += this.cost;
    }

    makeUnDone(budget) {
        budget.expenses -= this.cost;
    }

}




