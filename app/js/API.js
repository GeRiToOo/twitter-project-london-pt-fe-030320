const API_ENDPOINT = "http://localhost:3000";
const USERS_URL = `${API_ENDPOINT}/users?_embed=tweets`;
const TWEETS_URL = `${API_ENDPOINT}/tweets?_expand=user&_embed=comments`;

const getTweets = () => fetch(TWEETS_URL).then((response) => response.json());
const getUsers = () => fetch(USERS_URL).then((response) => response.json());

export default {
  getTweets,
  getUsers,
};
