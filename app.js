const RecipeApp = (() => {
  "use strict";

  // ==========================
  // DATA
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
  let searchQuery = "";
  let favorites =
    JSON.parse(localStorage.getItem("recipeFavorites")) || [];
  let debounceTimer;

  // ==========================
  // DOM
  // ==========================
  const recipeContainer = document.querySelector("#recipe-container");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const sortButtons = document.querySelectorAll(".sort-btn");
  const searchInput = document.querySelector("#search-input");
  const clearSearchBtn = document.querySelector("#clear-search");
  const recipeCountDisplay = document.querySelector("#recipe-count");

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
    const isFavorited = favorites.includes(recipe.id);
    const heart = isFavorited ? "❤️" : "🤍";

    return `
      <div class="recipe-card" data-id="${recipe.id}">
        <button class="favorite-btn" data-recipe-id="${recipe.id}">
          ${heart}
        </button>

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
  // FILTERS
  // ==========================
  const filterBySearch = (recipes, query) => {
    if (!query) return recipes;
    const q = query.toLowerCase();

    return recipes.filter(recipe =>
      recipe.title.toLowerCase().includes(q) ||
      recipe.description.toLowerCase().includes(q) ||
      recipe.ingredients.some(i =>
        i.toLowerCase().includes(q)
      )
    );
  };

  const filterFavorites = (recipes) =>
    recipes.filter(r => favorites.includes(r.id));

  const applyFilter = (recipes, filterType) => {
    if (filterType === "favorites") return filterFavorites(recipes);
    return recipes;
  };

  const applySort = (recipes) => recipes;

  // ==========================
  // COUNTER
  // ==========================
  const updateRecipeCounter = (showing, total) => {
    if (recipeCountDisplay) {
      recipeCountDisplay.textContent =
        `Showing ${showing} of ${total} recipes`;
    }
  };

  // ==========================
  // DISPLAY
  // ==========================
  const updateDisplay = () => {
    let result = recipes;

    result = filterBySearch(result, searchQuery);
    result = applyFilter(result, currentFilter);
    result = applySort(result, currentSort);

    renderRecipes(result);
    updateRecipeCounter(result.length, recipes.length);
  };

  // ==========================
  // FAVORITES
  // ==========================
  const saveFavorites = () => {
    localStorage.setItem(
      "recipeFavorites",
      JSON.stringify(favorites)
    );
  };

  const toggleFavorite = (recipeId) => {
    const id = parseInt(recipeId);

    if (favorites.includes(id)) {
      favorites = favorites.filter(f => f !== id);
    } else {
      favorites.push(id);
    }

    saveFavorites();
    updateDisplay();
  };

  // ==========================
  // EVENTS
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

  const handleFavoriteClick = (e) => {
    if (!e.target.classList.contains("favorite-btn")) return;
    toggleFavorite(e.target.dataset.recipeId);
  };

  const handleSearchInput = (e) => {
    const query = e.target.value;

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      searchQuery = query;
      updateDisplay();
    }, 300);
  };

  const handleClearSearch = () => {
    searchInput.value = "";
    searchQuery = "";
    updateDisplay();
  };

  const setupEventListeners = () => {
    recipeContainer.addEventListener("click", handleToggleClick);
    recipeContainer.addEventListener("click", handleFavoriteClick);

    if (searchInput) {
      searchInput.addEventListener("input", handleSearchInput);
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener("click", handleClearSearch);
    }
  };

  // ==========================
  // INIT
  // ==========================
  const init = () => {
    console.log("RecipeJS Ready");
    setupEventListeners();
    updateDisplay();
  };

  return { init };

})();

RecipeApp.init();
