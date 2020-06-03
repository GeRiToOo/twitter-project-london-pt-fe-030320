import API from "./API.js";
const API_ENDPOINT = "http://localhost:3000";

// DOM elements
const tittle = document.querySelector(`.titles h2`);
const name = document.querySelector(`.details .name`);
const comment_wrapper = document.querySelector(`.comment_wrapper`);
const avatar = document.querySelector(`.avatar`);
const imageA = document.getElementById("output");

const renderUserInfo = async () => {
  let id = localStorage.userId;

  const current_user = await fetch(
    `${API_ENDPOINT}/users/${id}?_embed=tweets`
  ).then((response) => response.json());
  imageA.src = `${current_user.avatar_url}`;

  tittle.innerHTML = current_user.name;
  name.innerHTML = `@${current_user.name}`;

  renderTweets(id, current_user);
};

renderUserInfo();

// LIKE TWEET
const likeTweet = (heart, tweet, imgHeart, pHeart, likes) => {
  let current_tweet = tweet;

  heart.onclick = async (e) => {
    await addTweetLike(current_tweet);
    imgHeart.src = `./images/pinkheart.png`;
    pHeart.innerHTML = likes + 1;
    pHeart.style.color = " #DD00F0";
  };
};

const addTweetLike = async (current_tweet) => {
  await fetch(`${API_ENDPOINT}/tweets/${current_tweet.id}?_embed=comments`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ likes: current_tweet.likes + 1 }),
  })
    .then((response) => {
      if (response.ok) {
        return console.log("OK");
      } else {
        throw console.log("NOT OK");
      }
    })
    .catch((error) => {
      console.log("Ooops", error);
    });
};
// * * * * * * * * * * * * * *

// RETWEET TWEET
const retweetTweet = (retweet, tweet, imgRetweet, pRetweet, retweets) => {
  let current_tweet = tweet;

  retweet.onclick = async (e) => {
    await addRetweet(current_tweet);
    imgRetweet.src = `./images/pinkretweet.png`;
    pRetweet.innerHTML = retweets + 1;
    pRetweet.style.color = " #DD00F0";
  };
};

const addRetweet = async (current_tweet) => {
  await fetch(`${API_ENDPOINT}/tweets/${current_tweet.id}?_embed=comments`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ retweets: current_tweet.retweets + 1 }),
  })
    .then((response) => {
      if (response.ok) {
        console.log("OK");
      } else {
        console.log("NOT OK");
      }
    })
    .catch((error) => {
      console.log("Ooops", error);
    });
};
// * * * * * * * * * * * * * *
// COMMENT START * * * * * *
const addComment = (comment, group, tweetId, pGroup, numberComments) => {
  let current_tweet = tweetId;

  // covert date format
  let date = new Date();
  let formatted_date =
    date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

  const text_comment = document.createElement("div");
  text_comment.className = "text_comment";
  text_comment.style.display = "none";
  comment.appendChild(text_comment);

  const textarea = document.createElement("textarea");
  text_comment.appendChild(textarea);

  const bottom = document.createElement("div");
  bottom.className = "bottom";
  text_comment.appendChild(bottom);

  const imgArrow = document.createElement("img");
  imgArrow.src = "./images/arrow.png";
  bottom.appendChild(imgArrow);

  const buttonBottom = document.createElement("button");
  buttonBottom.innerText = "Reply";
  bottom.appendChild(buttonBottom);

  // Comment onClick
  group.onclick = async (e) => {
    console.log(current_tweet);
    if (text_comment.style.display === "none") {
      text_comment.style.display = "block";
      comment.style.height = "390px";
    } else if (text_comment.style.display === "block") {
      text_comment.style.display = "none";
      comment.style.height = "200px";
    }

    buttonBottom.addEventListener("click", async () => {
      let newComment = {
        userId: localStorage.userId,
        tweetId: current_tweet,
        content: textarea.value,
        date: formatted_date,
      };

      await addCommentToTweet(newComment, pGroup, numberComments, textarea);
    });
  };
};

const addCommentToTweet = async (
  newComment,
  pGroup,
  numberComments,
  textarea
) => {
  await fetch(`${API_ENDPOINT}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(newComment),
  })
    .then((response) => {
      if (response.ok) {
        console.log("OK");
        pGroup.innerHTML = numberComments + 1;
        textarea.value = "";
      } else {
        console.log("NOT OK");
      }
    })
    .catch((error) => {
      console.log("Ooops", error);
    });
};
// Comment END * * * * * *

// RENDER TWEETS * * * * *
const renderTweets = async (id, current_user) => {
  let userTweet = id;
  let userTweetInfo = current_user;

  const tweets = await fetch(
    `${API_ENDPOINT}/user/${userTweet}/tweets`
  ).then((response) => response.json());

  tweets.forEach(async (tweet) => {
    const tweetComment = await fetch(
      `${API_ENDPOINT}/tweets/${tweet.id}/comments`
    ).then((response) => response.json());

    const comment = document.createElement(`div`);
    comment.className = "comment";
    comment_wrapper.appendChild(comment);

    const header = document.createElement("header");
    comment.appendChild(header);

    const pName = document.createElement("p");
    pName.innerHTML = userTweetInfo.name;
    header.appendChild(pName);

    const heapDate = document.createElement("p");
    heapDate.className = "date";
    heapDate.innerHTML = tweet.date;
    header.appendChild(heapDate);

    const commentBody = document.createElement("div");
    commentBody.className = "commentBody";
    comment.appendChild(commentBody);
    commentBody.onclick = () => {
      location.href = "pagetweet.html";
      localStorage.tweetPage = tweet.id;
    };

    const pBody = document.createElement("p");
    pBody.innerHTML = tweet.content;
    commentBody.appendChild(pBody);

    const footerBody = document.createElement("footer");
    comment.appendChild(footerBody);

    // LIKE TWEET
    const heart = document.createElement("div");
    heart.className = "heart";
    footerBody.appendChild(heart);
    const imgHeart = document.createElement("img");
    imgHeart.src = `./images/heart.png `;
    heart.appendChild(imgHeart);
    const pHeart = document.createElement("p");
    pHeart.innerHTML = tweet.likes;
    heart.appendChild(pHeart);
    let likes = tweet.likes;
    likeTweet(heart, tweet, imgHeart, pHeart, likes);

    // RETWEET TWEET
    const retweet = document.createElement("div");
    retweet.className = "retweet";
    footerBody.appendChild(retweet);
    const imgRetweet = document.createElement("img");
    imgRetweet.src = `./images/retweet.png`;
    retweet.appendChild(imgRetweet);
    const pRetweet = document.createElement("p");
    pRetweet.innerHTML = tweet.retweets;
    retweet.appendChild(pRetweet);
    let retweets = tweet.retweets;
    retweetTweet(retweet, tweet, imgRetweet, pRetweet, retweets);

    // COMMENT TWEET
    const group = document.createElement("div");
    group.className = "group";

    footerBody.appendChild(group);
    const imgGroup = document.createElement("img");
    imgGroup.src = `./images/group.png`;
    group.appendChild(imgGroup);
    const pGroup = document.createElement("p");
    pGroup.innerHTML = tweetComment.length;
    let numberComments = tweetComment.length;
    let tweetId = tweet.id;
    // console.log(tweetId);
    group.appendChild(pGroup);
    addComment(comment, group, tweetId, pGroup, numberComments);
  });
};

// * * * * * * * * * * * * * * *
// ADD NEW PICTURE

const fileSelector = document.getElementById("file-selector");
fileSelector.addEventListener("change", (event) => {
  const fileList = event.target.files;
  console.log(fileList[0].name);
  console.log(imageA);

  imageA.src = `./images/${fileList[0].name}`;
});
