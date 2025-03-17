const BASE_URL = "http://localhost:3000/api";
// const BASE_URL = "https://doggyduty.live/api";


export const AuthenticationUrls = {
  LOGIN : BASE_URL + "/auth/login",
  SIGN_OUT : BASE_URL + "/auth/signout",
  ADD_USER: BASE_URL + "/auth/adduser",
  GET_ALL_USER: BASE_URL + "/auth/getalluser",
  CHECK_EXISTING_USER: BASE_URL + "/auth/checkexistinguser",
  CHECK_IS_LOGGEDIN: BASE_URL + "/auth/islogedin"
}

export const ServiceUrls = {
  GETALL : BASE_URL + "/service/getall",
  CREATE_SERVICE : BASE_URL + "/service/create",
}

export const CommunityUrls = {
  GET_BY_ID : BASE_URL + "/community/getbyid",
  GETALL : BASE_URL + "/community/getall",
  GETALL_BY_DISTANCE_ORDER : BASE_URL + "/community/getallbydistance",
  GETALL_JOB_ORDER : BASE_URL + "/job-order/getallbydate",
  CREATE_COM_SCHED : BASE_URL + "/community/create",
  UPDATE_COM_SCHED : BASE_URL + "/community/update",
}

export const TaskUrls = {
  COMPLETE_TASK : BASE_URL + "/task/complete",
  GETALL : BASE_URL + "/task/getall",
}

export const BillingUrls = {
  GET_ALL : BASE_URL + "/billing/getall",
}

export const ConfigUrls = {
  GET_ALL : BASE_URL + "/config/getall",
  ADD : BASE_URL + "/config/create",
  UPDATE : BASE_URL + "/config/update",
}