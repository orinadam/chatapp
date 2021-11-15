import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.headers.post["Content-Type"] = "application/json";

axios.defaults.withCredentials = true;

const bodyResp = (resp) => resp.data;

const requests = {
  get: (url) => axios.get(url).then(bodyResp),
  post: (url, body) => axios.post(url, body).then(bodyResp),
  delete: (url) => axios.delete(url).then(bodyResp),
};

const auth = {
  login: (url, body) => requests.post("/login", body),
  signup: (url, body) => requests.post("/signup", body),
};

const chats = {
  createChat: (url, body) => requests.post("/chat", body),
  getChats: (url) => requests.get("/chats"),
  getChat: (url, id) => requests.get(`/chats/${id}`),
  sendMessage: (url, body, id) => requests.post(`/chats/${id}/messages`, body),
  deleteMessage: (url, chatId, messageId) =>
    requests.delete(`/chats/${chatId}/messages/${messageId}`),
  searchChat: (url, parameter) => requests.get(`/chats/search?${parameter}`),
  deleteChats: (url, chatId) => requests.delete(`/chats/${chatId}`),
};

export default auth;
