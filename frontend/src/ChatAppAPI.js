import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.withCredentials = true;

const bodyResp = (resp) => resp.data;

const requests = {
  get: (url) => axios.get(url).then(Bodyresp),
  post: (url, body) => axios.post(url, body).then(bodyResp),
  delete: (url) => axios.delete(url).then(bodyResp),
};

const auth = {
  login: (url, body) => requests("/login"),
  signup: (url, body) => requests("/signup"),
};

export default auth;
