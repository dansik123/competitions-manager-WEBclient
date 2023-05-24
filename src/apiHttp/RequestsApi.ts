import useCustomAxios from '@/apiHttp/AxiosConf'

export const genericGetHttpRequest = async <T>(followedPath: string, urlParams: any): Promise<T> => {
  const response = await useCustomAxios.get<T>(followedPath, { params:urlParams });
  return response.data;
}

export const genericPostHttpRequest = async <T1, T2>(
    followedPath: string, requestBody: T1, urlParams: any): Promise<T2> => {
  const response = await useCustomAxios.post<T2>(followedPath, requestBody, { params:urlParams });
  return response.data;
}

export const genericPostHttpRequestNoParams = async <T1, T2>(
  followedPath: string, requestBody: T1): Promise<T2> => {
const response = await useCustomAxios.post<T2>(followedPath, requestBody);
return response.data;
}

export const genericPutHttpRequest = async <T1, T2>(
  followedPath: string, requestBody: T1, urlParams: any): Promise<T2> => {
const response = await useCustomAxios.put<T2>(followedPath, requestBody, { params:urlParams });
return response.data;
}

export const genericPutHttpRequestNoParams = async <T1, T2>(
  followedPath: string, requestBody: T1): Promise<T2> => {
const response = await useCustomAxios.put<T2>(followedPath, requestBody);
return response.data;
}

export const genericDeleteHttpRequestNoParamsNoBody = async (
  followedPath: string): Promise<any> => {
const response = await useCustomAxios.delete<any>(followedPath);
return response.data;
}

export const genericPatchHttpRequestNoParams = async <T1, T2>(
  followedPath: string, requestBody: T1): Promise<T2> => {
const response = await useCustomAxios.patch<T2>(followedPath, requestBody);
return response.data;
}

export const genericPostHttpRequestFormBodyNoParams = async <T1>(
  followedPath: string, imageFile: File): Promise<T1> =>{
    const response = await useCustomAxios.postForm<T1>(followedPath, {
      file: imageFile
    })
    return response.data
}