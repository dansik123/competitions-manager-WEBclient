<script setup lang="ts">
	import { inject } from "vue";
    import { useQuery } from "vue-query";
    import { genericGetHttpRequest } from "@/apiHttp/RequestsApi";
    import type { User, GenericErrorResponse } from "@/types/HttpResponseTypes";
    import { useAuthStore } from '@/stores/AuthorizationStore';
    import type { AxiosError } from 'axios';
    
    const authStore = useAuthStore();

	const popUpError: (msg: string, timeout: number) => void = inject("errorToastPopUp", ()=>{})

    const fetchUserFn = async () => 
        await genericGetHttpRequest<User>('/users/current', {})
    const { data, isError, isLoading, error } = 
        useQuery<User, AxiosError<GenericErrorResponse, any>>(
        'getUser', 
        fetchUserFn,
        {
            onSuccess: (data) => {
				authStore.setUserDetails(data.id, data.role)
			},
            onError: (error) => {
				popUpError(error.response?.data.message || 'Unknown error message', 5000)
            },
            retry: 0
        })
</script>
<template>
    <span v-if="isLoading">Loading...</span>
    <span v-else-if="isError">Error: {{ error?.message }}</span>
    <div v-else>
        <h1>Hello 
            <span id="user_firstname">{{ data?.firstname }}</span>
            &nbsp;
            <span id="user_lastname">{{ data?.lastname }}</span>
        </h1>
        <h2>This is you shooting account</h2>
        <p id="user_id">{{ data?.id }}</p>
        <p id="user_email">{{ data?.email }}</p>
        <p id="user_role">{{ data?.role }}</p>
    </div>
</template>