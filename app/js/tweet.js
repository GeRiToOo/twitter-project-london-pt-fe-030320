import API from "./API.js";
const API_ENDPOINT = "http://localhost:3000";

// DOM elements
const button = document.querySelector(`.tweet_wrapper_comment button`);
const textarea = document.querySelector(`textarea`);
const successful = document.querySelector(`.comment_window_successfully`);
const unSuccessful = document.querySelector(`.comment_window_unsuccessfully`);

// Add new Tweet click listener
button.addEventListener("click", async (e) => {
  let id = localStorage.userId;
  const current_user = await fetch(
    `${API_ENDPOINT}/users/${id}?_embed=tweets`
  ).then((response) => response.json());

  let content = textarea.value;
  // covert date format
  let date = new Date();
  let formatted_date =
    date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
  // new tweet

  let newTweet = {
    content: content,
    date: formatted_date,
    likes: 0,
    retweets: 0,
    userId: id,
    comments: [],
  };
  postNewTweet(id, newTweet);
});

const postNewTweet = async (id, newTweet) => {
  let iD = id;
  await fetch(`${API_ENDPOINT}/user/${iD}/tweets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(newTweet),
  })
    .then((response) => {
      if (response.ok) {
        successful.style.display = "block";
        setTimeout(function () {
          successful.style.display = "none";
        }, 3000);
      } else {
        unSuccessful.style.display = "block";
        setTimeout(function () {
          unSuccessful.style.display = "none";
        }, 3000);
      }
    })
    .catch((error) => {
      console.log("Ooops", error);
    });
};
