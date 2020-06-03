const API_ENDPOINT = "http://localhost:3000";

let clickedTweet = localStorage.tweetPage;
const details = document.querySelector(`.wrapper_details`);

const renderTweetComments = async (clickedTweet) => {
  const tweet = await fetch(
    `${API_ENDPOINT}/tweets/${clickedTweet}?_embed=comments`
  ).then((response) => response.json());

  const tweetComments = await fetch(
    `${API_ENDPOINT}/tweets/${clickedTweet}/comments`
  ).then((response) => response.json());

  const current_user = await fetch(
    `${API_ENDPOINT}/users/${tweet.userId}?_embed=tweets`
  ).then((response) => response.json());

  const tweet_details = document.createElement("div");
  tweet_details.className = "tweet_details";
  tweet_details.innerHTML = `<div class="tweet_details">
      <div class="avatar"><img src=${current_user.avatar_url} alt="" /></div>
      <div class="user_details">
        <div class="titles">
          <h2>${current_user.name}</h2>
        </div>
        <div class="details">
          <p>@${current_user.name}</p>
        </div>
      </div>
    </div>`;
  details.appendChild(tweet_details);

  const commentBody = document.querySelector(".commentBody");
  const pCommentBody = document.createElement("p");
  pCommentBody.innerHTML = tweet.content;
  commentBody.appendChild(pCommentBody);

  const tweet_options = document.querySelector(".tweet_options");

  const heart = document.createElement("div");
  heart.className = "heart";
  tweet_options.appendChild(heart);
  const imgHeart = document.createElement("img");
  imgHeart.src = `./images/heart.png `;
  heart.appendChild(imgHeart);
  const pHeart = document.createElement("p");
  pHeart.innerHTML = tweet.likes;
  heart.appendChild(pHeart);

  const retweet = document.createElement("div");
  retweet.className = "retweet";
  tweet_options.appendChild(retweet);
  const imgRetweet = document.createElement("img");
  imgRetweet.src = `./images/retweet.png`;
  retweet.appendChild(imgRetweet);
  const pRetweet = document.createElement("p");
  pRetweet.innerHTML = tweet.retweets;
  retweet.appendChild(pRetweet);

  const group = document.createElement("div");
  group.className = "group";
  tweet_options.appendChild(group);
  const imgGroup = document.createElement("img");
  imgGroup.src = `./images/group.png`;
  group.appendChild(imgGroup);
  const pGroup = document.createElement("p");
  pGroup.innerHTML = tweetComments.length;
  let numberComments = tweetComments.length;
  group.appendChild(pGroup);

  addComment(group, tweet, pGroup, numberComments);
  const comments = document.querySelector(".comments");

  // RENDER TWEET COMMENTS
  tweetComments.forEach((comment) => {
    const commentDiv = document.createElement("div");
    commentDiv.className = "comment";
    commentDiv.innerHTML = ` <div class="wrapper_info">
          <div class="avatar"><img src="${current_user.avatar_url}" alt="" /></div>
          <div class="user_details">
            <div class="titles">
              <h2>${current_user.name}</h2>
            </div>
            <div class="details">
              <p>@${current_user.name}</p>
            </div>
          </div>
        </div>
        <div class="commentBody">
          <p>
          ${comment.content}
          </p>
        </div>
        <hr />`;
    comments.appendChild(commentDiv);
  });
};

renderTweetComments(clickedTweet);

// ADD COMMENT * * * * *
const addComment = (group, tweet, pGroup, numberComments) => {
  let current_tweet = tweet;
  const current_comment = document.querySelector(`.current_comment`);
  // covert date format
  let date = new Date();
  let formatted_date =
    date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

  const text_comment = document.createElement("div");
  text_comment.className = "text_comment";
  text_comment.style.display = "none";
  current_comment.appendChild(text_comment);

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

  group.onclick = async (e) => {
    if (text_comment.style.display === "none") {
      text_comment.style.display = "block";
      current_comment.style.height = "350px";
    } else if (text_comment.style.display === "block") {
      text_comment.style.display = "none";
      current_comment.style.height = "170px";
    }

    buttonBottom.addEventListener("click", async () => {
      let newComment = {
        userId: localStorage.userId,
        tweetId: current_tweet.id,
        content: textarea.value,
        date: formatted_date,
      };
      console.log(newComment);
      await addCommentToTweet(newComment, pGroup, numberComments, textarea);
    });
  };
};

// * * * * * * * * * * * * * * * * * * * * * * *
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
