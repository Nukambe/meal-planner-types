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

export interface hashTable {
  [key: string]: { [key in dayOfWeek]: { id: number; index: number }[] };
}

export class MealPlan {
  private plannedMeals: plannedMeal[];
  private hashTable: hashTable;

  constructor(meals: plannedMeal[] | hashTable) {
    if (Array.isArray(meals)) {
      this.plannedMeals = meals;
      this.hashTable = this.constructFromArray();
    } else {
      this.hashTable = meals;
      this.plannedMeals = this.constructFromHash();
    }
  }

  constructFromArray(): hashTable {
    return this.plannedMeals.reduce((acc, meal, index) => {
      if (meal.week in acc) {
        acc[meal.week][meal.day].push({ id: meal.id, index });
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
        acc[meal.week][meal.day] = [{ id: meal.id, index }];
      }
      return acc;
    }, {} as hashTable);
  }

  constructFromHash(): plannedMeal[] {
    return Object.entries(this.hashTable).reduce((acc, [week, days]) => {
      Object.entries(days).forEach(([day, ids]) => {
        ids.forEach(({ id }) => {
          acc.push({ week, day: parseInt(day), id });
        });
      });
      return acc;
    }, [] as plannedMeal[]);
  }

  getAllPlannedMeals(): plannedMeal[] {
    return this.plannedMeals;
  }

  getPlannedMealsByWeek(week: string) {
    if (!(week in this.hashTable)) return [];

    const meals: number[] = [];
    Object.values(this.hashTable[week]).forEach((mls) => {
      mls.forEach(({ id }) => meals.push(id));
    });
    return meals;
  }

  getPlannedMealsByDay(week: string, day: dayOfWeek) {
    if (!(week in this.hashTable)) return [];

    return this.hashTable[week][day].map(({ id }) => id);
  }

  addPlannedMeal(meal: plannedMeal): void {
    this.plannedMeals.push(meal);
    if (meal.week in this.hashTable) {
      this.hashTable[meal.week][meal.day].push({
        id: meal.id,
        index: this.plannedMeals.length - 1,
      });
    } else {
      this.hashTable[meal.week] = {
        [dayOfWeek.Sunday]: [],
        [dayOfWeek.Monday]: [],
        [dayOfWeek.Tuesday]: [],
        [dayOfWeek.Wednesday]: [],
        [dayOfWeek.Thursday]: [],
        [dayOfWeek.Friday]: [],
        [dayOfWeek.Saturday]: [],
      };
      this.hashTable[meal.week][meal.day] = [
        { id: meal.id, index: this.plannedMeals.length - 1 },
      ];
    }
  }

  removePlannedMeal(week: string, day: dayOfWeek, index: number) {
    const meal = this.hashTable[week][day].find((_, idx) => idx === index);
    if (!meal) return;
    this.hashTable[week][day].splice(index, 1);
    this.plannedMeals = this.constructFromHash();
    return meal;
  }

  reorderPlannedMeal(
    week: string,
    day: dayOfWeek,
    oldIndex: number,
    newIndex: number
  ) {
    const meal = this.hashTable[week][day].find((_, idx) => idx === oldIndex);
    if (!meal) return;
    this.hashTable[week][day].splice(oldIndex, 1);
    this.hashTable[week][day].splice(newIndex, 0, meal);
  }

  applyWeeklyTemplate(template: hashTable) {
    const week = Object.keys(template)[0];
    this.clearWeek(week);
    this.plannedMeals = this.constructFromHash();

    Object.entries(template[week]).forEach(([day, meals]) => {
      meals.forEach(({ id }) => {
        this.addPlannedMeal({ week, day: parseInt(day), id });
      });
    });
  }

  applyDailyTemplate(week: string, day: dayOfWeek, template: number[]) {
    this.clearDay(week, day);
    this.plannedMeals = this.constructFromHash();
    template.forEach((id) => {
      this.addPlannedMeal({ week, day, id });
    });
  }

  clearWeek(week: string) {
    this.hashTable[week] = {
      [dayOfWeek.Sunday]: [],
      [dayOfWeek.Monday]: [],
      [dayOfWeek.Tuesday]: [],
      [dayOfWeek.Wednesday]: [],
      [dayOfWeek.Thursday]: [],
      [dayOfWeek.Friday]: [],
      [dayOfWeek.Saturday]: [],
    };
    this.plannedMeals = this.constructFromHash();
  }

  clearDay(week: string, day: dayOfWeek) {
    this.hashTable[week][day] = [];
    this.plannedMeals = this.constructFromHash();
  }

  clearPlan() {
    this.hashTable = {};
    this.plannedMeals = [];
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
