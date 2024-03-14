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

class TaskController extends Task {
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

}