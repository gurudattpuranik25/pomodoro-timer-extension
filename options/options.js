const timeInput = document.getElementById("timeInput");
timeInput.addEventListener("change", (e) => {
  if (e.target.value < 1 || e.target.value > 60) {
    timeInput.value = 25;
  }
});

const saveOptions = document.getElementById("saveOptions");

saveOptions.addEventListener("click", () => {
  chrome.storage.local.set({
    timer: 0,
    timeInputValue: timeInput.value,
    isRunning: false,
  });
});

chrome.storage.local.get(["timeInputValue"], (res) => {
  timeInput.value = res.timeInputValue;
});
