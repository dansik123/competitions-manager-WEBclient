<script setup lang="ts">
	import { inject } from "vue";
    import { useMutation } from "vue-query";
    import { genericPostHttpRequestNoParams } from "@/apiHttp/RequestsApi";
    import type { GenericErrorResponse, GenericResponse } from "@/types/HttpResponseTypes";
    import { useAuthStore } from "@/stores/AuthorizationStore";
    import router from '@/router'
    import type { AxiosError } from 'axios';

	const popUpError: (msg: string, timeout: number) => void = inject("errorToastPopUp", ()=>{})

    const authStore = useAuthStore()
    const logoutUserFn = async () => 
        await genericPostHttpRequestNoParams<any, GenericResponse>('/logout', {})
    const { mutate } = useMutation<GenericResponse, AxiosError<GenericErrorResponse, any>, any>(
    logoutUserFn,
    {
        onError: (error)=>{
            popUpError(error.response?.data.message || 'Unknown login error', 5000)
        },
        onSuccess: () => {
            authStore.logout();
            router.push({ name: 'home' });
        },
    })
    
    //methods
    function logoutUser(){
        mutate({});
    }
</script>
<template>
    <VBtn color="primary" @click="logoutUser()">
        Logout
    </VBtn>
</template>