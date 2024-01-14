import * as MealPlanner from "./index";

describe("MealPlanner", () => {
  let mealPlan: MealPlanner.MealPlan;
  beforeEach(() => {
    jest.resetModules();
    const meal1 = { week: "1/7/24", day: MealPlanner.dayOfWeek.Monday, id: 0 };
    const meal2 = { week: "1/7/24", day: MealPlanner.dayOfWeek.Monday, id: 1 };
    const meal3 = { week: "1/7/24", day: MealPlanner.dayOfWeek.Tuesday, id: 2 };
    const meal4 = {
      week: "1/7/24",
      day: MealPlanner.dayOfWeek.Wednesday,
      id: 3,
    };
    const meal5 = {
      week: "1/7/24",
      day: MealPlanner.dayOfWeek.Thursday,
      id: 4,
    };
    const meal6 = { week: "1/14/24", day: MealPlanner.dayOfWeek.Sunday, id: 5 };
    const meal7 = {
      week: "1/14/24",
      day: MealPlanner.dayOfWeek.Saturday,
      id: 6,
    };

    mealPlan = new MealPlanner.MealPlan(
      [meal1, meal2, meal3, meal4, meal5, meal6, meal7],
      []
    );
  });

  it("should export MealPlanner", () => {
    expect(MealPlanner).toBeDefined();
  });

  it("should have 7 meals", () => {
    expect(mealPlan.getAllPlannedMeals().length).toEqual(7);
  });

  it("should have 2 meals on Monday", () => {
    expect(
      mealPlan.getPlannedMealsByDay("1/7/24", MealPlanner.dayOfWeek.Monday)
        .length
    ).toEqual(2);
  });

  it("should have 5 meals for week 1/7/24", () => {
    expect(mealPlan.getPlannedMealsByWeek("1/7/24").length).toEqual(5);
  });

  it("should remove a meal", () => {
    mealPlan.removePlannedMeal("1/7/24", MealPlanner.dayOfWeek.Monday, 0);
    mealPlan.removePlannedMeal("1/7/24", MealPlanner.dayOfWeek.Monday, 10);
    expect(mealPlan.getAllPlannedMeals().length).toEqual(6);
    expect(
      mealPlan.getPlannedMealsByDay("1/7/24", MealPlanner.dayOfWeek.Monday)
        .length
    ).toEqual(1);
  });

  it("should add a meal", () => {
    mealPlan.addPlannedMeal({
      week: "1/7/24",
      day: MealPlanner.dayOfWeek.Monday,
      id: 7,
    });
    expect(mealPlan.getAllPlannedMeals().length).toEqual(8);
    expect(
      mealPlan.getPlannedMealsByDay("1/7/24", MealPlanner.dayOfWeek.Monday)
        .length
    ).toEqual(3);
  });

  it("should add a duplicate meal and keep an accurate count", () => {
    for (let i = 0; i < 5; i++) {
      mealPlan.addPlannedMeal({
        week: "1/21/24",
        day: MealPlanner.dayOfWeek.Monday,
        id: 0,
      });
    }
    const ids = mealPlan.getPlannedMealsByDay(
      "1/21/24",
      MealPlanner.dayOfWeek.Monday
    );
    expect(ids.length).toEqual(5);
  });

  it("should create a new week", () => {
    mealPlan.addPlannedMeal({
      week: "1/21/24",
      day: MealPlanner.dayOfWeek.Monday,
      id: 7,
    });
    expect(mealPlan.getAllPlannedMeals().length).toEqual(8);
    expect(
      mealPlan.getPlannedMealsByDay("1/21/24", MealPlanner.dayOfWeek.Monday)
        .length
    ).toEqual(1);
  });

  it("should apply a template to a day", () => {
    const template = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
    mealPlan.applyDailyTemplate(
      "1/7/24",
      MealPlanner.dayOfWeek.Monday,
      template
    );
    expect(mealPlan.getAllPlannedMeals().length).toEqual(15);
    expect(
      mealPlan.getPlannedMealsByDay("1/7/24", MealPlanner.dayOfWeek.Monday)
        .length
    ).toEqual(10);
  });

  it("should apply a template to a week", () => {
    const template: {
      meals: MealPlanner.plannedMeals;
      goals: MealPlanner.plannedGoals;
    } = {
      meals: {
        "0/0/00": {
          0: [0, 1, 2],
          1: [3, 4, 5],
          2: [6, 7, 8],
          3: [],
          4: [],
          5: [],
          6: [],
        },
      },
      goals: {
        "0/0/00": {
          0: {
            calories: { min: 100, max: 0 },
            carbs: { min: 100, max: 0 },
            fat: { min: 100, max: 0 },
            protein: { min: 500, max: 0 },
          },
          1: {
            calories: { min: 0, max: 0 },
            carbs: { min: 0, max: 0 },
            fat: { min: 0, max: 0 },
            protein: { min: 0, max: 0 },
          },
          2: {
            calories: { min: 0, max: 0 },
            carbs: { min: 0, max: 0 },
            fat: { min: 0, max: 0 },
            protein: { min: 0, max: 0 },
          },
          3: {
            calories: { min: 0, max: 0 },
            carbs: { min: 0, max: 0 },
            fat: { min: 0, max: 0 },
            protein: { min: 0, max: 0 },
          },
          4: {
            calories: { min: 0, max: 0 },
            carbs: { min: 0, max: 0 },
            fat: { min: 0, max: 0 },
            protein: { min: 0, max: 0 },
          },
          5: {
            calories: { min: 0, max: 0 },
            carbs: { min: 0, max: 0 },
            fat: { min: 0, max: 0 },
            protein: { min: 0, max: 0 },
          },
          6: {
            calories: { min: 0, max: 0 },
            carbs: { min: 0, max: 0 },
            fat: { min: 0, max: 0 },
            protein: { min: 0, max: 0 },
          },
        },
      },
    };

    mealPlan.applyWeeklyTemplate("1/7/24", template);
    expect(
      mealPlan.getPlannedMealsByDay("1/7/24", MealPlanner.dayOfWeek.Monday)
        .length
    ).toEqual(3);
    expect(mealPlan.getPlannedMealsByWeek("1/7/24").length).toEqual(9);
    expect(
      mealPlan.getPlannedGoalsByDay("1/7/24", MealPlanner.dayOfWeek.Sunday)
        .protein.min
    ).toEqual(500);
  });

  it("should return an empty array when getting meals from a week that doesn't exist", () => {
    expect(mealPlan.getPlannedMealsByWeek("1/21/24").length).toEqual(0);
  });

  it("should return an empty array when getting meals from a day that doesn't exist", () => {
    expect(mealPlan.getPlannedMealsByDay("1/21/24", 0).length).toEqual(0);
  });
});
