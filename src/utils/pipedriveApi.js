import axios from 'axios'

var baseURL = 'https://api.pipedrive.com/v1'
var token = process.env.TOKEN_PIPEDRIVE

const apiPipeline = axios.create({
  baseURL: baseURL,
  timeout: 1000,
  params:{api_token:token}
});

export default apiPipeline;
