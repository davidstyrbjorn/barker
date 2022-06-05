import axios from "axios";
import Session from "supertokens-auth-react/recipe/session";

Session.addAxiosInterceptors(axios);

export const client = axios.create({
  baseURL: "http://localhost:3001/api",
  headers: {
    "Content-type": "application/json"
  }
});