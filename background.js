chrome.alarms.create("pomodoroTimer", {
  periodInMinutes: 1 / 60,
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "pomodoroTimer") {
    chrome.storage.local.get(
      ["timer", "isRunning", "timeInputValue"],
      (res) => {
        if (res.isRunning) {
          let timer = res.timer + 1;
          let isRunning = true;
          if (timer === res.timeInputValue * 60) {
            this.registration.showNotification("Pomodoro Timer", {
              body: `${res.timeInputValue} minutes has passed!`,
              icon: "wall-clock.png",
            });
            timer = 0;
            isRunning = false;
          }
          chrome.storage.local.set({ timer, isRunning });
        }
      }
    );
  }
});

chrome.storage.local.get(["timer", "isRunning", "timeInputValue"], (res) => {
  chrome.storage.local.set({
    timer: "timer" in res ? res.timer : 0,
    timeInputValue: "timeInputValue" in res ? res.timeInputValue : 25,
    isRunning: "isRunning" in res ? res.isRunning : false,
  });
});
