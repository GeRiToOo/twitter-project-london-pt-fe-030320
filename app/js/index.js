import API from "./API.js";
// DOM elements
const input = document.querySelector(`.name`);
const form = document.querySelector(`form`);

// Login function
const fetchUsers = async () => {
  let username = input.value;
  const usersArray = await API.getUsers();
  usersArray.forEach((user) => {
    if (user.name === username) {
      localStorage.userId = JSON.stringify(user.id);
      form.submit();
    }
  });
};

// Form EventListener
form.addEventListener("submit", async (e) => {
  console.log("clicked");
  e.preventDefault();
  await fetchUsers();
});
