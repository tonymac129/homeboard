const quote = document.getElementById("quote");
const addShortcut = document.getElementById("add-shortcut");
const shortcutContainer = document.getElementById("shortcuts");
const search = document.querySelector(".search");
const time = document.getElementById("time");
const greeting = document.getElementById("greeting");
const greetingIcon = document.getElementById("greeting-icon");
const newsLink = document.getElementById("news-link");
const temp = document.getElementById("temp");
const humidity = document.getElementById("humidity");
const weatherDescription = document.getElementById("weather-desc");
const weatherIcon = document.getElementById("weather-icon");
const weatherLocation = document.getElementById("weather-location");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const tabTitle = document.getElementById("tab-title");
const settings = document.getElementById("settings");
const modal = document.getElementById("modal");
const greetingBox = document.getElementById("greeting-box");
const tasksBox = document.getElementById("tasks-box");
const weatherBox = document.getElementById("weather-box");
const newsBox = document.getElementById("news-box");
const quoteBox = document.getElementById("quote-box");
let username = "User";

if (localStorage.getItem("username")) {
  username = localStorage.getItem("username");
} else {
  username = prompt("Please enter your name to personalize your homeboard!");
  localStorage.setItem("username", username);
}
tabTitle.innerHTML = username + "'s Homeboard";

setInterval(greetingUpdate, 1000);
greetingUpdate();
search.focus();
navigator.geolocation.getCurrentPosition(success, error);
//Above is code for initialization

function greetingUpdate() {
  let newTime = new Date();
  let hour = newTime.getHours();
  let minute = newTime.getMinutes();
  let ampm = hour >= 12 ? "PM" : "AM";
  if (hour < 12) {
    greeting.innerHTML = "Good morning, " + username;
  } else if (hour < 18) {
    greeting.innerHTML = "Good afternoon, " + username;
  } else {
    greeting.innerHTML = "Good evening, " + username;
    greetingIcon.src = "media/night.svg";
  }
  hour = hour >= 12 ? hour - 12 : hour;
  time.innerHTML =
    "It's currently " +
    hour +
    ":" +
    minute.toString().padStart(2, "0") +
    " " +
    ampm;
}
//Above is code for greeting widget

if (localStorage.getItem("shortcuts")) {
  let shortcuts = JSON.parse(localStorage.getItem("shortcuts")) || [];
  shortcuts.forEach((shortcut) =>
    appendShortcut(
      shortcut.shortcutURL,
      shortcut.shortcutName,
      addShortcut.parentElement
    )
  );
  if (shortcutContainer.children.length === 8) {
    addShortcut.parentElement.style.display = "none";
  }
}

addShortcut.addEventListener("click", () => {
  editShortcut(addShortcut.parentElement);
});

function editShortcut(before, index) {
  let shortcutURL = prompt("Enter new shortcut URL").trim().toLowerCase();
  if (
    !shortcutURL.includes("https://") &&
    !shortcutURL.includes("http://") &&
    shortcutURL.length > 0
  ) {
    shortcutURL = "https://" + shortcutURL;
  }
  let shortcutName = prompt("Enter new shortcut name");
  if (shortcutURL.trim().length > 0 && shortcutName.trim().length > 0) {
    appendShortcut(shortcutURL, shortcutName, before);
    if (!index && index !== 0) {
      let shortcuts = JSON.parse(localStorage.getItem("shortcuts")) || [];
      shortcuts.push({ shortcutURL, shortcutName });
      localStorage.setItem("shortcuts", JSON.stringify(shortcuts));
      if (shortcutContainer.children.length === 8) {
        addShortcut.parentElement.style.display = "none";
      }
    } else {
      let shortcuts = JSON.parse(localStorage.getItem("shortcuts")) || [];
      shortcuts[index] = { shortcutURL, shortcutName };
      localStorage.setItem("shortcuts", JSON.stringify(shortcuts));
      if (shortcutContainer.children.length === 8) {
        addShortcut.parentElement.style.display = "none";
      }
    }
  } else {
    alert("Please enter valid shortcut URL and name.");
    editShortcut();
  }
}

function appendShortcut(url, name, before) {
  let newShortcut = document.createElement("div");
  newShortcut.classList.add("box");
  newShortcut.innerHTML = `
          <div class="shortcut">
            <img
              src="https://www.google.com/s2/favicons?domain=${url}&sz=256"
              class="shortcut-img"
            />
            <p class="shortcut-name">${name}</p>
            <img class="edit-shortcut" src="media/edit.svg">
            <img class="remove-shortcut" src="media/remove.svg">
          </div>`;
  shortcutContainer.appendChild(newShortcut);
  shortcutContainer.insertBefore(newShortcut, before);
  newShortcut.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-shortcut")) {
      let index = Array.from(shortcutContainer.children).indexOf(
        e.target.parentElement.parentElement
      );
      editShortcut(shortcutContainer.children[index + 1], index);
      shortcutContainer.removeChild(e.target.parentElement.parentElement);
    } else if (e.target.classList.contains("remove-shortcut")) {
      let index = Array.from(shortcutContainer.children).indexOf(
        e.target.parentElement.parentElement
      );
      let shortcuts = JSON.parse(localStorage.getItem("shortcuts")) || [];
      shortcuts.splice(index, 1);
      localStorage.setItem("shortcuts", JSON.stringify(shortcuts));
      shortcutContainer.removeChild(e.target.parentElement.parentElement);
      addShortcut.parentElement.style.display = "flex";
    } else if (!e.target.classList.contains("box")) {
      window.location.href = url;
    }
  });
}
//Above is code for managing shortcuts

fetch(
  "https://newsapi.org/v2/top-headlines?country=us&apiKey=033f21566f314e1cad0bcb98aaf82a5d"
)
  .then((response) => response.json())
  .then((data) => {
    let dataArticles = data.articles;
    let randomIndex = Math.floor(Math.random() * dataArticles.length);
    if (dataArticles[randomIndex].title == "[Removed]") {
      randomIndex++;
    }
    newsLink.innerHTML = dataArticles[randomIndex].title;
    newsLink.href = dataArticles[randomIndex].url;
    let articleImg = dataArticles[randomIndex].urlToImage;
    if (articleImg) {
      let newImg = document.createElement("img");
      newImg.src = articleImg;
      newImg.classList.add("news-img");
      newsLink.parentElement.appendChild(newImg);
      newsLink.parentElement.insertBefore(newImg, newsLink);
    }
  })
  .catch((error) => {
    console.error("Error: ", error);
  });
//Above is code for news widget

function success(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  getCity(latitude, longitude);
}

function error(err) {
  console.error(`Error: ${err.code} - ${err.message}`);
  alert("Please allow location access in your browser to see weather data!");
}

async function getCity(latitude, longitude) {
  const apiKey = "18ac864434e1425faf729b1ed7fe9d70";
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    const city =
      data.results[0].components.city ||
      data.results[0].components.town ||
      data.results[0].components.village;
    const weather = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=4b2ce9723ac4533c3a59d69c47503bb1`
    );
    weatherLocation.innerHTML = city;
    const weatherData = await weather.json();
    let celsius = Math.round(weatherData.main.temp - 273.15);
    let ferenheight = Math.floor((celsius * 9) / 5 + 32);
    temp.innerHTML = ferenheight + "°F";
    humidity.innerHTML = weatherData.main.humidity + "%";
    let description = weatherData.weather[0].description.split(" ");
    weatherDescription.innerHTML = description
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
    switch (weatherData.weather[0].main) {
      case "Clouds":
        weatherIcon.src = "media/cloud.svg";
        break;
      case "Clear":
        weatherIcon.src = "media/noon.svg";
        break;
      case "Atmosphere":
        weatherIcon.src = "media/mist.svg";
        break;
      case "Snow":
        weatherIcon.src = "media/snow.svg";
        break;
      case "Rain":
        weatherIcon.src = "media/shower.svg";
        break;
      case "Drizzle":
        weatherIcon.src = "media/shower.svg";
        break;
      case "Thunderstorm":
        weatherIcon.src = "media/storm.svg";
        break;
      default:
        weatherIcon.src = "media/cloud.svg";
    }
  } catch (err) {
    console.error("Error fetching city:", err);
  }
}
//Above is code for weather widget

fetch("https://api.api-ninjas.com/v1/quotes?category=happiness", {
  method: "GET",
  headers: {
    "X-Api-Key": "YIfECCgCw/ORNQmgqh8ang==QmaeRan0qUnwoOZW",
    "Content-Type": "application/json",
  },
})
  .then((response) => response.json())
  .then((data) => {
    quote.innerHTML = '"' + data[0].quote + '" - ' + data[0].author;
  })
  .catch((error) => {
    console.error("Error: ", error);
  });
//Above is code for quote widget

let savedTasks = localStorage.getItem("tasks");
if (savedTasks) {
  savedTasks = JSON.parse(savedTasks);
  if (savedTasks.length > 0) {
    taskList.innerHTML = "";
    savedTasks.forEach((task) => {
      let newTask = document.createElement("div");
      newTask.classList.add("task-item");
      newTask.innerHTML = `
        <input type="checkbox" class="task-checkbox">
        ${task}
      `;
      newTask.children[0].addEventListener("click", () => {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.splice(tasks.indexOf(task), 1);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        newTask.remove();
        if (taskList.children.length === 0) {
          taskList.innerHTML = "<br><br><br><br>No tasks right now ✅!";
          taskList.style.textAlign = "center";
        }
      });
      taskList.appendChild(newTask);
    });
  }
}

taskInput.addEventListener("keydown", (e) => {
  if (e.key == "Enter" && taskInput.value.trim().length > 0) {
    console.log(taskList.children[0]);
    if (taskList.children[0].outerHTML == "<br>") {
      taskList.innerHTML = "";
    }
    let newTask = document.createElement("div");
    let taskText = taskInput.value.trim();
    newTask.classList.add("task-item");
    newTask.innerHTML = `
        <input type="checkbox" class="task-checkbox">
        ${taskText}
      `;
    newTask.children[0].addEventListener("click", () => {
      let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      tasks.splice(tasks.indexOf(taskText), 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      newTask.remove();
      if (taskList.children.length === 0) {
        taskList.innerHTML = "<br><br><br><br>No tasks right now ✅!";
        taskList.style.textAlign = "center";
      }
    });
    taskList.appendChild(newTask);
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(taskText);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    taskInput.value = "";
  }
});
//Above is code for tasks widget

settings.addEventListener("click", () => {
  modal.style.display = "flex";
});

modal.addEventListener("click", (e) => {
  if (e.target == modal) {
    modal.style.display = "none";
  }
  if (e.target.parentElement.classList.contains("option")) {
    let checkbox = e.target.parentElement.children[0];
    let name = checkbox.id.replace("-widget", "");
    let settingStorage = localStorage.getItem("setting")
      ? JSON.parse(localStorage.getItem("setting"))
      : [];
    switch (name) {
      case "greeting":
        greetingBox.style.display = checkbox.checked ? "flex" : "none";
        settingStorage[0] = checkbox.checked;
        break;
      case "tasks":
        tasksBox.style.display = checkbox.checked ? "flex" : "none";
        settingStorage[1] = checkbox.checked;
        break;
      case "weather":
        weatherBox.style.display = checkbox.checked ? "flex" : "none";
        settingStorage[2] = checkbox.checked;
        break;
      case "news":
        newsBox.style.display = checkbox.checked ? "flex" : "none";
        settingStorage[3] = checkbox.checked;
        break;
      case "quote":
        quoteBox.style.display = checkbox.checked ? "flex" : "none";
        settingStorage[4] = checkbox.checked;
        break;
    }
    console.log(settingStorage);
    localStorage.setItem("setting", JSON.stringify(settingStorage));
  }
});

let settingArr = localStorage.getItem("setting")
  ? JSON.parse(localStorage.getItem("setting"))
  : [];
const settingOptions = document.querySelectorAll(".option");
settingArr.forEach((setting, index) => {
  if (setting !== null && !setting) {
    settingOptions[index].children[0].checked = false;
    switch (index) {
      case 0:
        greetingBox.style.display = "none";
        break;
      case 1:
        tasksBox.style.display = "none";
        break;
      case 2:
        weatherBox.style.display = "none";
        break;
      case 3:
        newsBox.style.display = "none";
        break;
      case 4:
        quoteBox.style.display = "none";
        break;
    }
  }
});
//Above is code for settings
