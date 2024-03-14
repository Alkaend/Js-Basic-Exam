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

class TaskController  {
    #tasks = [];
    #doneTasks = [];
    // [1,2,3,4]
    addTasks(...tasks) {
        for (let i = 0; i < tasks.length; i++) {
            const targetId = tasks[i].id;
            const targetTask = this.#tasks.find(task => task.id === targetId);

            if (typeof targetTask !== 'undefined') continue;

            this.#tasks.push(tasks[i]);
        }
    }

    deleteTask(task) {
        const targetId = task.id;
        const targetTaskIndex = this.#tasks.findIndex(task => task.id === targetId);

        if (targetTaskIndex === -1) return;

        this.#tasks.splice(targetTaskIndex, 1);
    }

    getTasks() {
        // spread operator
        return [...this.#tasks];

    }


    getTasksSortedBy(sortBy) {
        const tasks = this.getTasks();
        let sortFn;

        switch (sortBy) {
            case 'description':
                sortFn = (a, b) => a.description.localCompare(b.description);
                break;

            case 'status':
                sortFn = (a, b) => {
                    const isADone = this.#doneTasks.includes(a);
                    const isBDone = this.#doneTasks.includes(b);
                    return isBDone - isADone;
                };
                break;

            case 'cost':
                sortFn = (a, b) => b.cost - a.cost;
                break;

        }

        return tasks.sort(sortFn);

    }

    getFilteredTasks(filters) {
        /* 
        filters = {
            description:
            isIncome:
            isCompleted:
        }

         */

        let tasks = this.#tasks;

        if ('description' in filters) {
            tasks = tasks.filter(task => task.description.includes(filters.description));

        }

        if ('isIncome' in filters) {
            tasks = tasks.filter(task => {
                if (filters.isIncome) {
                    return task instanceof IncomeTask;
                } else {
                    return task instanceof ExpenseTask;
                }
            });
        }


        if ('isCompleted' in filters) {
            tasks = tasks.filter(task => {
               /*  if (this.#doneTasks.indexOf(task) === -1) {
                    if (filters.isCompleted) {
                        return false;
                    } else return true;
                } else {
                    if (filters.isCompleted) {
                        return true;
                    } else {
                        return false;
                    }
                } */

                if (this.#doneTasks.indexOf(task) === -1) {
                    return !filters.isCompleted;
                        
                } else {
                     return filters.isCompleted;
                    
                }

            }
            );
        }

        return tasks;
    }

    hasInTasks(task){
        return this.#tasks.includes(task);
    }

    hasInDoneTasks(task){
        return this.#doneTasks.includes(task)
    }

    addToDoneTasks(task){
        this.#doneTasks.push(task);
    }

    deleteFromDoneTasks(task){
        const targetId = task.id;
        const targetTaskIndex = this.#doneTasks.findIndex(task => task.id === targetId);

        if (targetTaskIndex === -1) return;

        this.#doneTasks.splice(targetTaskIndex, 1);
    }

    

}

class BudgetController {
    #tasksControler = new TasksController();
    #budget = {
        balance:0,
        income:0,
        expenses:0
    };

    constructor (initialBalance = 0){
        this.#budget.balance = initialBalance;
    }

    get balance (){
        return this.#budget.balance;
    }

    get income (){
        return this.#budget.income;
    }

    get expenses(){
        return this.#budget.expenses;
    }

    calculateBalance(){
        return this.balance + this.income - this.expenses;
    }

    getTasks(){
        return this.#tasksControler.getTasks();
    }

    addTasks(...tasks){
        this.#tasksControler.addTasks(...tasks);
    }

    deleteTask(task){
        if (!this.#tasksControler.hasInTasks(task)){
            console.log(`Task ${task.id} isn't recognized`);
            return;
        } 
        if(this.#tasksControler.hasInDoneTasks(task)){
            task.makeUnDone(this.#budget);
        }
        this.#tasksControler.deleteTask(task);
    }

    doneTask(task){
        if (!this.#tasksControler.hasInTasks(task)){
            console.log(`Task ${task.id} isn't recognized`);
            return;
        } 
        if (this.#tasksControler.hasInDoneTasks(task)){
            console.log('Task is already done');
            return;
        } 
        task.makeDone(this.#budget);
        this.#tasksControler.addToDoneTasks(task);
    }

    unDoneTask(task){
        if (!this.#tasksControler.hasInTasks(task)){
            console.log(`Task ${task.id} isn't recognized`);
            return;
        } 
        if (!this.#tasksControler.hasInDoneTasks(task)){
            console.log("Task isn't done before");
            return;
        } 
        task.makeUnDone(this.#budget);
        this.#tasksControler.deleteFromDoneTasks(task);
    }
}