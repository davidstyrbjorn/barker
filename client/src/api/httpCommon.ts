import axios from "axios";
import Session from "supertokens-auth-react/recipe/session";

Session.addAxiosInterceptors(axios);

export const client = axios.create({
  baseURL: "https://barker-347020.ey.r.appspot.com/api",
  headers: {
    "Content-type": "application/json"
  }
});