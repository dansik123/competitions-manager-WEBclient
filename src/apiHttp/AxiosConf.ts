import axios from 'axios'
import type { ITokenResponse, User } from '@/types/HttpResponseTypes'
import { useAuthStore } from '@/stores/AuthorizationStore'
import type { AxiosResponse } from 'axios'
import navRouter from "@/router";

// Partly this code was inspired by https://www.youtube.com/watch?v=nI8PYZNFtac&t=916s
// There are two sections:
// Private Axios Instance
// (22:31) useAxiosPrivate with interceptors
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const exceptionRefreshUrls = ['/login','/refresh', '/logout', '/register']

const AUTH_ERROR_MSG_PREFIX = "Auth error:"
const isAuthForbiddenErrorFutherCheck = (
  responseMessage: string, url: string): boolean =>{
    return !exceptionRefreshUrls.includes(url)
      && responseMessage.startsWith(AUTH_ERROR_MSG_PREFIX)
}

const useCustomAxios =  axios.create({
    baseURL: API_BASE_URL || 'http://localhost:4040',
    withCredentials: true,
})

useCustomAxios.interceptors.request.use(config =>{
  const authStore = useAuthStore()
  config.headers.setAuthorization(authStore.getAuthToken.toString())
  return config
})

// link to the video is above
// Private Axios Instance
// (22:31) useAxiosPrivate with interceptors
useCustomAxios.interceptors.response.use(
    (response) => {
      return response
    },
    async (error) => {
      const authStore = useAuthStore()
      const originalRequest = error.config; //get request config
      const errorResponse = error.response; //ectract status code
      if(errorResponse.status === 403){
        if(isAuthForbiddenErrorFutherCheck(errorResponse.data.message, originalRequest.url)){
          //403 ERROR with Auth prefix
          const refreshResponse: AxiosResponse<ITokenResponse, any> = 
            await useCustomAxios.get<ITokenResponse>('/refresh');
          authStore.setHeaderAccessTokenKey(refreshResponse.data.accessToken);
          if(!authStore.hasAuthorizedDetails){
            const userdetails = await useCustomAxios.get<User>('/users/current');
            authStore.setUserDetails(userdetails.data.id, userdetails.data.role);
          }
          return useCustomAxios(originalRequest)
        }else if(exceptionRefreshUrls.includes(originalRequest.url)){
          //403 error caused by refresh URLs
          return Promise.reject(error);
        }

        //other types of 403 errors should imedialty cause log out because 
        //user try's to access area not belong to him
        //MAYBE JUST REJECT RESPONSE INSTEAD WITH 403 response
        //user will no see anything
        authStore.logout()
        navRouter.push({name:'home'})
        return Promise.reject(error);
      }

      return Promise.reject(error);
    }
);

export default useCustomAxios;

export const routeRefresh = async () => {
  const authStore = useAuthStore()
  try{
    const refreshResponse: AxiosResponse<ITokenResponse, any> = 
      await useCustomAxios.get<ITokenResponse>('/refresh');
    authStore.setHeaderAccessTokenKey(refreshResponse.data.accessToken);
    return true
  }
  catch(error){
    return false;
  }
}