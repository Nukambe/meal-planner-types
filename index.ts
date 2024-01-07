export type Nutrient = {
  name: string;
  amount: number;
  unit: string;
  percentOfDailyNeeds: number;
};

export class Nutrition {
  public calories?: Nutrient;
  public fat?: Nutrient;
  public saturatedFat?: Nutrient;
  public cholesterol?: Nutrient;
  public sodium?: Nutrient;
  public potassium?: Nutrient;
  public carbohydrates?: Nutrient;
  public fiber?: Nutrient;
  public sugar?: Nutrient;
  public protein?: Nutrient;
  public vitaminA?: Nutrient;
  public vitaminC?: Nutrient;
  public calcium?: Nutrient;
  public iron?: Nutrient;

  constructor(nutrients: Nutrient[]) {
    this.parseNutrients(nutrients);
  }

  private parseNutrients(nutrients: Nutrient[]) {
    nutrients.forEach((nutrient) => {
      if (nutrient.name === "Calories") this.calories = nutrient;
      if (nutrient.name === "Fat") this.fat = nutrient;
      if (nutrient.name === "Saturated Fat") this.saturatedFat = nutrient;
      if (nutrient.name === "Carbohydrates") this.carbohydrates = nutrient;
      if (nutrient.name === "Fiber") this.fiber = nutrient;
      if (nutrient.name === "Sugar") this.sugar = nutrient;
      if (nutrient.name === "Protein") this.protein = nutrient;
      if (nutrient.name === "Cholesterol") this.cholesterol = nutrient;
      if (nutrient.name === "Sodium") this.sodium = nutrient;
      if (nutrient.name === "Potassium") this.potassium = nutrient;
      if (nutrient.name === "Vitamin A") this.vitaminA = nutrient;
      if (nutrient.name === "Vitamin C") this.vitaminC = nutrient;
      if (nutrient.name === "Calcium") this.calcium = nutrient;
      if (nutrient.name === "Iron") this.iron = nutrient;
    });
  }

  getNutrients(): Nutrient[] {
    const nutrients: Nutrient[] = [];

    if (this.calories) nutrients.push(this.calories);
    if (this.fat) nutrients.push(this.fat);
    if (this.saturatedFat) nutrients.push(this.saturatedFat);
    if (this.carbohydrates) nutrients.push(this.carbohydrates);
    if (this.fiber) nutrients.push(this.fiber);
    if (this.sugar) nutrients.push(this.sugar);
    if (this.protein) nutrients.push(this.protein);
    if (this.cholesterol) nutrients.push(this.cholesterol);
    if (this.sodium) nutrients.push(this.sodium);
    if (this.potassium) nutrients.push(this.potassium);
    if (this.vitaminA) nutrients.push(this.vitaminA);
    if (this.vitaminC) nutrients.push(this.vitaminC);
    if (this.calcium) nutrients.push(this.calcium);
    if (this.iron) nutrients.push(this.iron);

    return nutrients;
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
  meals?: Meal[];
  limits?: Nutrition;

  constructor() {
    this.meals = [];
    this.limits = new Nutrition([]);
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
  limits?: Nutrition;

  constructor() {
    this.sunday = new Day();
    this.monday = new Day();
    this.tuesday = new Day();
    this.wednesday = new Day();
    this.thursday = new Day();
    this.friday = new Day();
    this.saturday = new Day();
    this.limits = new Nutrition([]);
  }
}

export class Year {
  weeks?: Week[];

  constructor() {
    this.weeks = [];
  }
}

export class MealPlan {
  constructor(public years?: Year[]) {}
}

export class Category {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public meals: number[]
  ) {}
}
