import axios from "axios"
import { makeUseAxios } from "axios-hooks"

export default makeUseAxios({
  axios: axios.create({ baseURL: "http://zero.boing.net:5000" }),
})
