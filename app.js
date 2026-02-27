// ============================
// RECIPE DATA
// ============================

const recipes = [
  {id:1,title:"Pancakes",time:20,difficulty:"easy"},
  {id:2,title:"Chicken Curry",time:60,difficulty:"medium"},
  {id:3,title:"Beef Wellington",time:120,difficulty:"hard"},
  {id:4,title:"Greek Salad",time:15,difficulty:"easy"},
  {id:5,title:"Ramen",time:90,difficulty:"hard"},
  {id:6,title:"Omelette",time:10,difficulty:"easy"},
  {id:7,title:"Butter Chicken",time:70,difficulty:"medium"}
];

// ============================
// STATE
// ============================

let currentFilter = "all";
let currentSort = "none";

// ============================
// DOM
// ============================

const recipeContainer =
  document.querySelector("#recipe-container");

const filterButtons =
  document.querySelectorAll(".filter-btn");

const sortButtons =
  document.querySelectorAll(".sort-btn");

// ============================
// RENDER
// ============================

const createRecipeCard = (recipe)=>`
<div class="recipe-card">
  <h3>${recipe.title}</h3>

  <div class="recipe-meta">
    <span>⏱ ${recipe.time} min</span>
    <span class="${recipe.difficulty}">
      ${recipe.difficulty}
    </span>
  </div>
</div>
`;

const renderRecipes = (recipesArray)=>{
  recipeContainer.innerHTML =
    recipesArray.map(createRecipeCard).join("");
};

// ============================
// PURE FILTER FUNCTIONS
// ============================

const filterByDifficulty =
(recipes,difficulty)=>
recipes.filter(r=>r.difficulty===difficulty);

const filterByTime =
(recipes,maxTime)=>
recipes.filter(r=>r.time<=maxTime);

const applyFilter=(recipes,type)=>{
  switch(type){
    case "easy":
    case "medium":
    case "hard":
      return filterByDifficulty(recipes,type);
    case "quick":
      return filterByTime(recipes,30);
    default:
      return recipes;
  }
};

// ============================
// PURE SORT FUNCTIONS
// ============================

const sortByName=(recipes)=>
[...recipes].sort((a,b)=>
a.title.localeCompare(b.title));

const sortByTime=(recipes)=>
[...recipes].sort((a,b)=>
a.time-b.time);

const applySort=(recipes,type)=>{
  switch(type){
    case "name": return sortByName(recipes);
    case "time": return sortByTime(recipes);
    default: return recipes;
  }
};

// ============================
// UPDATE DISPLAY
// ============================

const updateDisplay=()=>{
  let result = recipes;

  result = applyFilter(result,currentFilter);
  result = applySort(result,currentSort);

  renderRecipes(result);

  console.log(
    `Showing ${result.length}
     Filter:${currentFilter}
     Sort:${currentSort}`
  );
};

// ============================
// ACTIVE BUTTON UI
// ============================

const updateActiveButtons=()=>{

  filterButtons.forEach(btn=>{
    btn.classList.toggle(
      "active",
      btn.dataset.filter===currentFilter
    );
  });

  sortButtons.forEach(btn=>{
    btn.classList.toggle(
      "active",
      btn.dataset.sort===currentSort
    );
  });
};

// ============================
// EVENTS
// ============================

const handleFilterClick=(e)=>{
  currentFilter=e.target.dataset.filter;
  updateActiveButtons();
  updateDisplay();
};

const handleSortClick=(e)=>{
  currentSort=e.target.dataset.sort;
  updateActiveButtons();
  updateDisplay();
};

const setupEventListeners=()=>{

  filterButtons.forEach(btn=>
    btn.addEventListener("click",handleFilterClick)
  );

  sortButtons.forEach(btn=>
    btn.addEventListener("click",handleSortClick)
  );
};

// ============================
// INIT
// ============================

setupEventListeners();
updateDisplay();