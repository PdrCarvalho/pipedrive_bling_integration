import axios from 'axios'

var baseURL = 'https://bling.com.br/Api/v2/'
var token = process.env.TOKEN_BLING

const apiBling = axios.create({
  baseURL: baseURL,
  timeout: 1000,
  params:{apikey:token}
});

export default apiBling;
