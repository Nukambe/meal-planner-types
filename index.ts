// -----------------------------------------------------------------------------
// MealPlan
// -----------------------------------------------------------------------------

export enum dayOfWeek {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
}

export interface plannedMeal {
  week: string; // "m/d/yy"
  day: dayOfWeek;
  id: number;
}

export interface plannedGoal {
  week: string; // "m/d/yy"
  day: dayOfWeek;
  calories: { min: number; max: number };
  carbs: { min: number; max: number };
  fat: { min: number; max: number };
  protein: { min: number; max: number };
}

export interface plannedMeals {
  [key: string]: { [key in dayOfWeek]: number[] };
}

export interface plannedGoals {
  [key: string]: {
    [key in dayOfWeek]: {
      calories: { min: number; max: number };
      carbs: { min: number; max: number };
      fat: { min: number; max: number };
      protein: { min: number; max: number };
    };
  };
}

export class MealPlan {
  private plannedMeals: plannedMeals;
  private plannedGoals: plannedGoals;

  constructor(meals: plannedMeal[], goals: plannedGoal[]) {
    this.plannedMeals = this.constructFromArray(meals);
    this.plannedGoals = this.constructGoalsFromArray(goals);
  }

  private constructFromArray(meals: plannedMeal[]): plannedMeals {
    return meals.reduce((acc, meal) => {
      if (meal.week in acc) {
        acc[meal.week][meal.day].push(meal.id);
      } else {
        acc[meal.week] = {
          [dayOfWeek.Sunday]: [],
          [dayOfWeek.Monday]: [],
          [dayOfWeek.Tuesday]: [],
          [dayOfWeek.Wednesday]: [],
          [dayOfWeek.Thursday]: [],
          [dayOfWeek.Friday]: [],
          [dayOfWeek.Saturday]: [],
        };
        acc[meal.week][meal.day] = [meal.id];
      }
      return acc;
    }, {} as plannedMeals);
  }

  private constructGoalsFromArray(goals: plannedGoal[]): plannedGoals {
    return goals.reduce((acc, goal) => {
      if (!(goal.week in acc)) {
        acc[goal.week] = {
          [dayOfWeek.Sunday]: {
            calories: { min: 0, max: 0 },
            carbs: { min: 0, max: 0 },
            fat: { min: 0, max: 0 },
            protein: { min: 0, max: 0 },
          },
          [dayOfWeek.Monday]: {
            calories: { min: 0, max: 0 },
            carbs: { min: 0, max: 0 },
            fat: { min: 0, max: 0 },
            protein: { min: 0, max: 0 },
          },
          [dayOfWeek.Tuesday]: {
            calories: { min: 0, max: 0 },
            carbs: { min: 0, max: 0 },
            fat: { min: 0, max: 0 },
            protein: { min: 0, max: 0 },
          },
          [dayOfWeek.Wednesday]: {
            calories: { min: 0, max: 0 },
            carbs: { min: 0, max: 0 },
            fat: { min: 0, max: 0 },
            protein: { min: 0, max: 0 },
          },
          [dayOfWeek.Thursday]: {
            calories: { min: 0, max: 0 },
            carbs: { min: 0, max: 0 },
            fat: { min: 0, max: 0 },
            protein: { min: 0, max: 0 },
          },
          [dayOfWeek.Friday]: {
            calories: { min: 0, max: 0 },
            carbs: { min: 0, max: 0 },
            fat: { min: 0, max: 0 },
            protein: { min: 0, max: 0 },
          },
          [dayOfWeek.Saturday]: {
            calories: { min: 0, max: 0 },
            carbs: { min: 0, max: 0 },
            fat: { min: 0, max: 0 },
            protein: { min: 0, max: 0 },
          },
        };
      }
      acc[goal.week][goal.day] = {
        calories: goal.calories,
        carbs: goal.carbs,
        fat: goal.fat,
        protein: goal.protein,
      };
      return acc;
    }, {} as plannedGoals);
  }

  getPlannedMeals(): plannedMeals {
    return this.plannedMeals;
  }

  getPlannedGoals(): plannedGoals {
    return this.plannedGoals;
  }

  getAllPlannedMeals(): plannedMeal[] {
    const meals: plannedMeal[] = [];
    Object.entries(this.plannedMeals).forEach(([week, days]) => {
      Object.entries(days).forEach(([day, mealIds]) => {
        mealIds.forEach((id) => {
          meals.push({ week, day: parseInt(day), id });
        });
      });
    });
    return meals;
  }

  getAllPlannedGoals(): plannedGoal[] {
    const goals: plannedGoal[] = [];
    Object.entries(this.plannedGoals).forEach(([week, days]) => {
      Object.entries(days).forEach(([day, goal]) => {
        goals.push({ week, day: parseInt(day), ...goal });
      });
    });
    return goals;
  }

  getPlannedMealsByWeek(week: string) {
    if (!(week in this.plannedMeals)) return [];

    const meals: number[] = [];
    Object.values(this.plannedMeals[week]).forEach((mealIds) => {
      mealIds.forEach((id) => meals.push(id));
    });
    return meals;
  }

  getPlannedMealsByDay(week: string, day: dayOfWeek) {
    if (!(week in this.plannedMeals)) return [];

    return this.plannedMeals[week][day].map((mealId) => mealId);
  }

  addPlannedMeal(meal: plannedMeal): void {
    if (meal.week in this.plannedMeals) {
      this.plannedMeals[meal.week][meal.day].push(meal.id);
    } else {
      this.plannedMeals[meal.week] = {
        [dayOfWeek.Sunday]: [],
        [dayOfWeek.Monday]: [],
        [dayOfWeek.Tuesday]: [],
        [dayOfWeek.Wednesday]: [],
        [dayOfWeek.Thursday]: [],
        [dayOfWeek.Friday]: [],
        [dayOfWeek.Saturday]: [],
      };
      this.plannedMeals[meal.week][meal.day] = [meal.id];
    }
  }

  removePlannedMeal(week: string, day: dayOfWeek, index: number) {
    const meal = this.plannedMeals[week][day][index];
    if (meal === null) return;
    this.plannedMeals[week][day].splice(index, 1);
    return meal;
  }

  getPlannedGoalsByWeek(week: string): plannedGoal[] {
    if (!(week in this.plannedGoals)) return [];

    const goals: plannedGoal[] = [];
    Object.entries(this.plannedGoals[week]).forEach(([day, goal]) => {
      goals.push({ week, day: parseInt(day), ...goal });
    });
    return goals;
  }

  getPlannedGoalsByDay(week: string, day: dayOfWeek): plannedGoal {
    if (!(week in this.plannedGoals))
      return {
        week,
        day,
        calories: { min: 0, max: 0 },
        carbs: { min: 0, max: 0 },
        fat: { min: 0, max: 0 },
        protein: { min: 0, max: 0 },
      };

    return { week, day, ...this.plannedGoals[week][day] };
  }

  addPlannedGoal(goal: plannedGoal): void {
    if (!(goal.week in this.plannedGoals)) {
      this.plannedGoals[goal.week] = {
        [dayOfWeek.Sunday]: {
          calories: { min: 0, max: 0 },
          carbs: { min: 0, max: 0 },
          fat: { min: 0, max: 0 },
          protein: { min: 0, max: 0 },
        },
        [dayOfWeek.Monday]: {
          calories: { min: 0, max: 0 },
          carbs: { min: 0, max: 0 },
          fat: { min: 0, max: 0 },
          protein: { min: 0, max: 0 },
        },
        [dayOfWeek.Tuesday]: {
          calories: { min: 0, max: 0 },
          carbs: { min: 0, max: 0 },
          fat: { min: 0, max: 0 },
          protein: { min: 0, max: 0 },
        },
        [dayOfWeek.Wednesday]: {
          calories: { min: 0, max: 0 },
          carbs: { min: 0, max: 0 },
          fat: { min: 0, max: 0 },
          protein: { min: 0, max: 0 },
        },
        [dayOfWeek.Thursday]: {
          calories: { min: 0, max: 0 },
          carbs: { min: 0, max: 0 },
          fat: { min: 0, max: 0 },
          protein: { min: 0, max: 0 },
        },
        [dayOfWeek.Friday]: {
          calories: { min: 0, max: 0 },
          carbs: { min: 0, max: 0 },
          fat: { min: 0, max: 0 },
          protein: { min: 0, max: 0 },
        },
        [dayOfWeek.Saturday]: {
          calories: { min: 0, max: 0 },
          carbs: { min: 0, max: 0 },
          fat: { min: 0, max: 0 },
          protein: { min: 0, max: 0 },
        },
      };
    }
    this.plannedGoals[goal.week][goal.day] = {
      calories: goal.calories,
      carbs: goal.carbs,
      fat: goal.fat,
      protein: goal.protein,
    };
  }

  removePlannedGoal(week: string, day: dayOfWeek) {
    if (!(week in this.plannedGoals)) return;
    this.plannedGoals[week][day] = {
      calories: { min: 0, max: 0 },
      carbs: { min: 0, max: 0 },
      fat: { min: 0, max: 0 },
      protein: { min: 0, max: 0 },
    };
  }

  reorderPlannedMeal(
    week: string,
    day: dayOfWeek,
    oldIndex: number,
    newIndex: number
  ) {
    const meal = this.plannedMeals[week][day].find(
      (_, idx) => idx === oldIndex
    );
    if (!meal) return;
    this.plannedMeals[week][day].splice(oldIndex, 1);
    this.plannedMeals[week][day].splice(newIndex, 0, meal);
  }

  applyWeeklyTemplate(
    week: string,
    template: { meals: plannedMeals; goals: plannedGoals }
  ) {
    this.clearWeek(week);
    // add meals
    Object.entries(template.meals["0/0/00"]).forEach(([day, meals]) => {
      meals.forEach((mealId) => {
        this.addPlannedMeal({ week, day: parseInt(day), id: mealId });
      });
    });
    // add goals
    // ...
  }

  applyDailyTemplate(week: string, day: dayOfWeek, template: number[]) {
    this.clearDay(week, day);
    template.forEach((mealId) => {
      this.addPlannedMeal({ week, day, id: mealId });
    });
  }

  clearWeek(week: string) {
    delete this.plannedMeals[week];
  }

  clearWeekGoals(week: string) {
    delete this.plannedGoals[week];
  }

  clearDay(week: string, day: dayOfWeek) {
    this.plannedMeals[week][day] = [];
  }

  clearDayGoals(week: string, day: dayOfWeek) {
    this.plannedGoals[week][day] = {
      calories: { min: 0, max: 0 },
      carbs: { min: 0, max: 0 },
      fat: { min: 0, max: 0 },
      protein: { min: 0, max: 0 },
    };
  }

  clearMeals() {
    this.plannedMeals = {};
  }
  clearGoals() {
    this.plannedGoals = {};
  }
  clearPlan() {
    this.clearMeals();
    this.clearGoals();
  }
}
//------------------------------------------------------------------------------
// Meal
//------------------------------------------------------------------------------
export interface Meal {
  id: number;
  title: string;
  readyInMinutes: number;
  servings: number;
  image: string;
  imageType: string;
  nutrients: {
    name: string;
    amount: number;
    unit: string;
    percentOfDailyNeeds: number;
  }[];
  ingredients: { id: number; name: string; amount: number; unit: string }[];
  summary: string;
  cuisines: string[];
  dishTypes: string[];
  diets: string[];
  instructions: { number: number; step: string }[];
}
