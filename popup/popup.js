const addTask = document.getElementById("add-task");
const startTimerBtn = document.getElementById("startTimer");
const stopTimerBtn = document.getElementById("stopTimer");
const resetTimerBtn = document.getElementById("resetTimer");
const time = document.getElementById("time");

function updateTime() {
  chrome.storage.local.get(["timer", "timeInputValue"], (res) => {
    const minutes = `${
      res.timeInputValue - Math.ceil(res.timer / 60)
    }`.padStart(2, "0");
    let seconds = "00";
    if (res.timer % 60 != 0) {
      seconds = `${60 - (res.timer % 60)}`.padStart(2, "0");
    }
    time.textContent = `${minutes}:${seconds}`;
  });
}

updateTime();
setInterval(updateTime, 1000);

startTimerBtn.addEventListener("click", () => {
  chrome.storage.local.get(["isRunning"], () => {
    chrome.storage.local.set({
      isRunning: true,
    });
  });
});

stopTimerBtn.addEventListener("click", () => {
  chrome.storage.local.get(["isRunning"], () => {
    chrome.storage.local.set({
      isRunning: false,
    });
  });
});

resetTimerBtn.addEventListener("click", () => {
  chrome.storage.local.set({
    isRunning: false,
    timer: 0,
  });
});

let tasks = [];

addTask.addEventListener("click", addTaskFun);

chrome.storage.sync.get(["tasks"], (res) => {
  tasks = res.tasks ? res.tasks : [];
  renderUpdatedTasks();
});

function saveTasks() {
  chrome.storage.sync.set({
    tasks,
  });
}

function renderTask(taskNum) {
  const taskSection = document.createElement("div");

  const inputSection = document.createElement("input");
  inputSection.type = "text";
  inputSection.placeholder = "Enter the task";
  inputSection.value = tasks[taskNum];
  inputSection.addEventListener("change", () => {
    tasks[taskNum] = inputSection.value;
    saveTasks();
  });

  const deleteBtn = document.createElement("input");
  deleteBtn.type = "button";
  deleteBtn.value = "x";
  deleteBtn.addEventListener("click", () => {
    deleteTask(taskNum);
  });

  taskSection.appendChild(inputSection);
  taskSection.appendChild(deleteBtn);

  const taskContainer = document.getElementById("taskContainer");
  taskContainer.appendChild(taskSection);
}

function addTaskFun() {
  const taskNum = tasks.length;
  tasks.push("");
  renderTask(taskNum);
  saveTasks();
}

function deleteTask(taskNum) {
  tasks.splice(taskNum, 1);
  renderUpdatedTasks();
  saveTasks();
}

function renderUpdatedTasks() {
  const taskContainer = document.getElementById("taskContainer");
  taskContainer.textContent = "";
  tasks.forEach((taskText, taskNum) => {
    renderTask(taskNum);
  });
}
