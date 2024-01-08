export type Nutrient = {
  name: string;
  amount: number;
  unit: string;
  percentOfDailyNeeds: number;
};

export class Nutrition {
  nutrients: Nutrient[];

  constructor(nutrients: Nutrient[]) {
    this.nutrients = nutrients.filter(
      (nutrient) =>
        nutrient.name === "Calories" ||
        nutrient.name === "Fat" ||
        nutrient.name === "Saturated Fat" ||
        nutrient.name === "Carbohydrates" ||
        nutrient.name === "Fiber" ||
        nutrient.name === "Sugar" ||
        nutrient.name === "Protein" ||
        nutrient.name === "Cholesterol" ||
        nutrient.name === "Sodium" ||
        nutrient.name === "Potassium" ||
        nutrient.name === "Vitamin A" ||
        nutrient.name === "Vitamin C" ||
        nutrient.name === "Calcium" ||
        nutrient.name === "Iron"
    );
  }

  addMacro(nutrient: Nutrient): void {
    const macro = this.nutrients.find((macro) => macro.name === nutrient.name);
    if (macro) {
      macro.amount += nutrient.amount;
    } else {
      this.nutrients.push(nutrient);
    }
  }
}

export class Ingredient {
  constructor(
    public id: number,
    public name: string,
    public amount: number,
    public unit: string,
    public nutrition: Nutrition
  ) {}
}

export class Recipe {
  constructor(
    public tools: string[],
    public ingredients: Ingredient[],
    public instructions: string[]
  ) {}
}

export class Meal {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public recipe: Recipe,
    public nutrition: Nutrition,
    public cookTime: number,
    public category: string,
    public cuisine: string,
    public tags: string[],
    public image: string
  ) {}
}

export class Day {
  meals: Meal[];
  macroMin: Nutrition;
  macroMax: Nutrition;

  constructor() {
    this.meals = [];
    this.macroMin = new Nutrition([]);
    this.macroMax = new Nutrition([]);
  }

  getMeals(): Meal[] {
    return this.meals;
  }

  getMacros(): { min: Nutrition; max: Nutrition } {
    return { min: this.macroMin, max: this.macroMax };
  }

  addMeal(meal: Meal): void {
    this.meals.push(meal);
  }

  removeMeal(index: number): void {
    this.meals = this.meals.filter((_, idx) => idx !== index);
  }

  getMeal(index: number): Meal {
    return this.meals[index];
  }

  getMealIndex(meal: Meal): number {
    return this.meals.indexOf(meal);
  }

  getMealCount(): number {
    return this.meals.length;
  }

  reorderMeal(oldIndex: number, newIndex: number): void {
    const meal = this.meals[oldIndex];
    this.meals.splice(oldIndex, 1);
    this.meals.splice(newIndex, 0, meal);
  }

  removeAllMeals(): void {
    this.meals = [];
  }

  getDailyMacros(): Nutrition {
    const macros = new Nutrition([]);
    this.meals.forEach((meal) => {
      meal.nutrition.nutrients.forEach((nutrient) => {
        macros.addMacro(nutrient);
      });
    });
    return macros;
  }

  getDailyIngredientList(): Ingredient[] {
    const ingredients: Ingredient[] = [];
    this.meals.forEach((meal) => {
      meal.recipe.ingredients.forEach((ingredient) => {
        const existingIngredient = ingredients.find(
          (i) => i.id === ingredient.id
        );
        if (existingIngredient) {
          existingIngredient.amount += ingredient.amount;
        } else {
          ingredients.push(ingredient);
        }
      });
    });
    return ingredients;
  }
}

export class Week {
  sunday: Day;
  monday: Day;
  tuesday: Day;
  wednesday: Day;
  thursday: Day;
  friday: Day;
  saturday: Day;
  macroMin: Nutrition;
  macroMax: Nutrition;

  constructor() {
    this.sunday = new Day();
    this.monday = new Day();
    this.tuesday = new Day();
    this.wednesday = new Day();
    this.thursday = new Day();
    this.friday = new Day();
    this.saturday = new Day();
    this.macroMin = new Nutrition([]);
    this.macroMax = new Nutrition([]);
  }

  getDay(day: string): Day {
    switch (day) {
      case "Sunday":
        return this.sunday;
      case "Monday":
        return this.monday;
      case "Tuesday":
        return this.tuesday;
      case "Wednesday":
        return this.wednesday;
      case "Thursday":
        return this.thursday;
      case "Friday":
        return this.friday;
      case "Saturday":
        return this.saturday;
      default:
        throw new Error("Invalid day");
    }
  }

  getDayIndex(day: string): number {
    switch (day) {
      case "Sunday":
        return 0;
      case "Monday":
        return 1;
      case "Tuesday":
        return 2;
      case "Wednesday":
        return 3;
      case "Thursday":
        return 4;
      case "Friday":
        return 5;
      case "Saturday":
        return 6;
      default:
        throw new Error("Invalid day");
    }
  }

  getDays(): Day[] {
    return [
      this.sunday,
      this.monday,
      this.tuesday,
      this.wednesday,
      this.thursday,
      this.friday,
      this.saturday,
    ];
  }

  getMacros(): { min: Nutrition; max: Nutrition } {
    return { min: this.macroMin, max: this.macroMax };
  }

  getWeeklyMacros(): Nutrition {
    const macros = new Nutrition([]);
    this.getDays().forEach((day) => {
      day.getDailyMacros().nutrients.forEach((nutrient) => {
        macros.addMacro(nutrient);
      });
    });
    return macros;
  }

  getWeeklyIngredientList(): Ingredient[] {
    const ingredients: Ingredient[] = [];
    this.getDays().forEach((day) => {
      day.getDailyIngredientList().forEach((ingredient) => {
        const existingIngredient = ingredients.find(
          (i) => i.id === ingredient.id
        );
        if (existingIngredient) {
          existingIngredient.amount += ingredient.amount;
        } else {
          ingredients.push(ingredient);
        }
      });
    });
    return ingredients;
  }
}

export class Year {
  weeks: { [key: string]: Week };

  constructor() {
    this.weeks = {};
  }

  getWeek(week: string): Week {
    if (!(week in this.weeks)) {
      this.weeks[week] = new Week();
    }
    return this.weeks[week];
  }
}

export class MealPlan {
  plan: { [key: string]: Year };

  constructor() {
    this.plan = {};
  }

  getYear(year: string): Year {
    if (!(year in this.plan)) {
      this.plan[year] = new Year();
    }
    return this.plan[year];
  }
}

export class Category {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public meals: number[]
  ) {}
}
