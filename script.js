const QUESTION_BANK = {
  general: [
    ["What is the capital of Australia?", ["Sydney", "Canberra", "Melbourne", "Perth"], 1],
    ["How many continents are there?", ["Five", "Six", "Seven", "Eight"], 2],
    ["Which is Earth's largest ocean?", ["Atlantic", "Indian", "Arctic", "Pacific"], 3],
    ["What is Japan's currency?", ["Won", "Yuan", "Yen", "Ringgit"], 2],
    ["Which planet is known as the Red Planet?", ["Venus", "Mars", "Jupiter", "Saturn"], 1]
  ],
  science: [
    ["What gas do plants absorb from the atmosphere?", ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"], 2],
    ["What is the chemical symbol for gold?", ["Go", "Gd", "Au", "Ag"], 2],
    ["How many bones are in an adult human body?", ["186", "206", "226", "246"], 1],
    ["What force keeps us on the ground?", ["Magnetism", "Friction", "Gravity", "Tension"], 2],
    ["What is the powerhouse of the cell?", ["Nucleus", "Ribosome", "Mitochondria", "Golgi body"], 2]
  ],
  coding: [
    ["Which data structure uses LIFO order?", ["Queue", "Stack", "Array", "Linked list"], 1],
    ["What does HTML stand for?", ["Hyper Trainer Markup Language", "HyperText Markup Language", "Hyper Text Making Language", "Home Tool Markup Language"], 1],
    ["Which is not a JavaScript data type?", ["String", "Boolean", "Float", "Undefined"], 2],
    ["What is binary search's time complexity?", ["O(n)", "O(n²)", "O(log n)", "O(1)"], 2],
    ["Which symbol starts a single-line C++ comment?", ["#", "//", "<!--", "**"], 1]
  ],
  history: [
    ["In which year did World War II end?", ["1943", "1944", "1945", "1946"], 2],
    ["Who was India's first Prime Minister?", ["Mahatma Gandhi", "Jawaharlal Nehru", "Sardar Patel", "Rajendra Prasad"], 1],
    ["The Great Wall is in which country?", ["Japan", "China", "Mongolia", "Korea"], 1],
    ["Which empire built the Colosseum?", ["Greek", "Roman", "Ottoman", "Persian"], 1],
    ["Who wrote the Declaration of Independence?", ["Abraham Lincoln", "George Washington", "Thomas Jefferson", "Benjamin Franklin"], 2]
  ]
};

const TIME_PER_QUESTION = 10;
const LEADERBOARD_KEY = "popquiz-leaderboard-v1";
const $ = (selector) => document.querySelector(selector);
let selectedCategory = "general";
let questions = [];
let currentQuestion = 0;
let score = 0;
let secondsLeft = TIME_PER_QUESTION;
let timerId;
let playerName = "Anonymous";

const screens = [$("#setup-screen"), $("#quiz-screen"), $("#results-screen")];

$("#category-grid").addEventListener("click", (event) => {
  const button = event.target.closest(".category-button");
  if (!button) return;
  document.querySelectorAll(".category-button").forEach((item) => item.classList.remove("selected"));
  button.classList.add("selected");
  selectedCategory = button.dataset.category;
});

$("#start-button").addEventListener("click", () => {
  playerName = $("#player-name").value.trim() || "Anonymous";
  questions = QUESTION_BANK[selectedCategory];
  score = 0;
  currentQuestion = 0;
  showScreen("#quiz-screen");
  loadQuestion();
});

$("#play-again-button").addEventListener("click", () => showScreen("#setup-screen"));

function showScreen(selector) {
  clearInterval(timerId);
  screens.forEach((screen) => screen.classList.toggle("active", screen === $(selector)));
}

function loadQuestion() {
  clearInterval(timerId);
  secondsLeft = TIME_PER_QUESTION;
  const [text, options, correct] = questions[currentQuestion];
  $("#question-counter").textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
  $("#active-category").textContent = selectedCategory;
  $("#question-text").textContent = text;
  $("#progress-fill").style.width = `${(currentQuestion / questions.length) * 100}%`;
  const optionsBox = $("#options-box");
  optionsBox.replaceChildren();
  options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option";
    button.textContent = option;
    button.addEventListener("click", () => answer(index, correct));
    optionsBox.append(button);
  });
  updateTimer();
  timerId = window.setInterval(() => {
    secondsLeft -= 1;
    updateTimer();
    if (secondsLeft <= 0) answer(-1, correct);
  }, 1000);
}

function updateTimer() {
  $("#timer-text").textContent = secondsLeft;
  $("#timer-ring").style.setProperty("--progress", `${(secondsLeft / TIME_PER_QUESTION) * 100}%`);
  $("#timer-ring").setAttribute("aria-label", `${secondsLeft} seconds remaining`);
}

function answer(selected, correct) {
  clearInterval(timerId);
  const buttons = document.querySelectorAll(".option");
  buttons.forEach((button, index) => {
    button.disabled = true;
    if (index === correct) button.classList.add("correct");
    if (index === selected && index !== correct) button.classList.add("wrong");
  });
  if (selected === correct) score += 1;
  window.setTimeout(() => {
    currentQuestion += 1;
    currentQuestion < questions.length ? loadQuestion() : finishQuiz();
  }, 900);
}

function finishQuiz() {
  $("#progress-fill").style.width = "100%";
  $("#results-title").textContent = `${score} / ${questions.length}`;
  const percentage = score / questions.length;
  $("#result-message").textContent = percentage === 1 ? "Perfect score — spectacular!" : percentage >= 0.6 ? "Well played!" : "Nice try — go again.";
  saveScore();
  renderLeaderboard();
  showScreen("#results-screen");
}

function saveScore() {
  const scores = getScores();
  scores.push({ name: playerName, score, total: questions.length, category: selectedCategory, time: Date.now() });
  scores.sort((a, b) => b.score / b.total - a.score / a.total || b.time - a.time);
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(scores.slice(0, 5)));
}

function getScores() {
  try { return JSON.parse(localStorage.getItem(LEADERBOARD_KEY)) || []; }
  catch { return []; }
}

function renderLeaderboard() {
  const list = $("#leaderboard-list");
  list.replaceChildren();
  const scores = getScores();
  if (!scores.length) { list.innerHTML = '<li class="empty-score">No scores yet.</li>'; return; }
  scores.forEach((entry) => {
    const item = document.createElement("li");
    const name = document.createElement("span");
    name.textContent = entry.name;
    const category = document.createElement("small");
    category.textContent = ` · ${entry.category}`;
    name.append(category);
    const result = document.createElement("strong");
    result.textContent = `${entry.score}/${entry.total}`;
    item.append(name, result);
    list.append(item);
  });
}
