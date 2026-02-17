const RecipeApp = (() => {

  // ==========================
  // Recipe Data
  // ==========================
  const recipes = [
    {
      id: 1,
      title: "Spaghetti Carbonara",
      time: 25,
      difficulty: "easy",
      description: "Classic Italian pasta with eggs and cheese.",
      category: "pasta",
      ingredients: ["Spaghetti", "Eggs", "Cheese", "Pepper"],
      steps: [
        "Boil water",
        {
          text: "Make sauce",
          substeps: ["Beat eggs", "Add cheese", "Mix"]
        },
        "Combine pasta and sauce"
      ]
    },
    {
      id: 2,
      title: "Pancakes",
      time: 20,
      difficulty: "easy",
      description: "Fluffy breakfast pancakes.",
      category: "breakfast",
      ingredients: ["Flour", "Milk", "Eggs", "Sugar"],
      steps: ["Mix ingredients", "Heat pan", "Cook pancakes"]
    }
  ];

  // ==========================
  // STATE
  // ==========================
  let currentFilter = "all";
  let currentSort = "none";

  // ==========================
  // DOM
  // ==========================
  const recipeContainer = document.querySelector("#recipe-container");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const sortButtons = document.querySelectorAll(".sort-btn");

  // ==========================
  // RECURSION
  // ==========================
  const renderSteps = (steps, level = 0) => {
    const listClass = level === 0 ? "steps-list" : "substeps-list";
    let html = `<ol class="${listClass}">`;

    steps.forEach(step => {
      if (typeof step === "string") {
        html += `<li>${step}</li>`;
      } else {
        html += `<li>${step.text}`;
        html += renderSteps(step.substeps, level + 1);
        html += `</li>`;
      }
    });

    html += "</ol>";
    return html;
  };

  // ==========================
  // CARD
  // ==========================
  const createRecipeCard = (recipe) => {
    return `
      <div class="recipe-card" data-id="${recipe.id}">
        <h3>${recipe.title}</h3>
        <p>${recipe.description}</p>

        <div class="card-actions">
          <button class="toggle-btn" data-id="${recipe.id}" data-type="steps">
            Show Steps
          </button>
          <button class="toggle-btn" data-id="${recipe.id}" data-type="ingredients">
            Show Ingredients
          </button>
        </div>

        <div class="steps-container" data-id="${recipe.id}">
          ${renderSteps(recipe.steps)}
        </div>

        <div class="ingredients-container" data-id="${recipe.id}">
          <ul>
            ${recipe.ingredients.map(i => `<li>${i}</li>`).join("")}
          </ul>
        </div>
      </div>
    `;
  };

  const renderRecipes = (recipesArray) => {
    recipeContainer.innerHTML = recipesArray
      .map(createRecipeCard)
      .join("");
  };

  // ==========================
  // FILTER + SORT (Part-2)
  // ==========================
  const filterByDifficulty = (recipes, difficulty) =>
    recipes.filter(r => r.difficulty === difficulty);

  const applyFilter = (recipes, filterType) => {
    if (filterType === "easy") return filterByDifficulty(recipes, "easy");
    return recipes;
  };

  const applySort = (recipes) => recipes;

  const updateDisplay = () => {
    let result = recipes;
    result = applyFilter(result, currentFilter);
    result = applySort(result, currentSort);
    renderRecipes(result);
  };

  // ==========================
  // EVENT HANDLERS
  // ==========================
  const handleToggleClick = (e) => {
    if (!e.target.classList.contains("toggle-btn")) return;

    const id = e.target.dataset.id;
    const type = e.target.dataset.type;

    const container = document.querySelector(
      `.${type}-container[data-id="${id}"]`
    );

    container.classList.toggle("visible");
  };

  const setupEventListeners = () => {
    recipeContainer.addEventListener("click", handleToggleClick);
  };

  // ==========================
  // INIT
  // ==========================
  const init = () => {
    setupEventListeners();
    updateDisplay();
  };

  return { init };

})();

RecipeApp.init();
