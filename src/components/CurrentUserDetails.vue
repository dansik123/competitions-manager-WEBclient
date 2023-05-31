<script setup lang="ts">
import { useMutation, useQuery } from "@tanstack/vue-query";
import { genericGetHttpRequest, genericPutHttpRequestNoParams } from "@/apiHttp/RequestsApi";
import type { GenericErrorResponse, UserDetailsResponse } from "@/types/HttpResponseTypes";
import type { UserDetailsRequest } from "@/types/HttpRequestTypes";
import { inject, ref } from "vue";
import type { AxiosError } from "axios";
const props = defineProps({
    isSuccess: {
        type: Boolean,
        required: true
    }
})

const emits = defineEmits(['update:isSuccess'])

const userDetailsRef = ref<UserDetailsResponse>(
    {
        id: -1,
        firstname: '',
        lastname:  '',
        email: ''
    }
)

const popUpError: (msg: string, timeout: number) => void = inject("errorToastPopUp", ()=>{})
const popUpSuccess: (msg: string, timeout: number) => void = inject("okayToastPopUp", ()=>{})

const fetchUser = async () => 
    await genericGetHttpRequest<UserDetailsResponse>(`/users/current`, {})
const { isError, isLoading, error } = useQuery<UserDetailsResponse, GenericErrorResponse>(
    ['getSingleLogInUser'], 
    fetchUser,
    {
        onSuccess: (data) => {
            userDetailsRef.value = data
            emits("update:isSuccess", true)
        }, 
        retry: 0 
    }
)

const updateCurrentUserDetails = async (changedUser: UserDetailsRequest): Promise<UserDetailsResponse> =>
    await genericPutHttpRequestNoParams<UserDetailsRequest, any>(
        `/users/current`,
        changedUser
    )

const { mutate } = useMutation<UserDetailsResponse, AxiosError<any, GenericErrorResponse>, UserDetailsRequest>(
    ["updateLogInUser"],
    updateCurrentUserDetails,
    {
        onSuccess: (data) => {
            userDetailsRef.value = data
            popUpSuccess('User details has been updated', 5000)
        }, 
        onError: (error)=>{
			popUpError(error.response?.data.message || 'Unknown login error', 5000)
		},
        retry: 0
    }
)


const changeUserFn = ()=>{
    mutate(userDetailsRef.value)
}

const editMode = ref(false)
</script>
<template>
    <span v-if="isLoading">Loading...</span>
    <span v-else-if="isError">Error: {{ error?.message }}</span>
    <VCard v-else>
        <VBtn @click="editMode = (!editMode)"> Edit</VBtn>
        <VForm  @submit.prevent="changeUserFn">
            <VContainer> 
                <VRow>
                    <VCol cols="6">
                        <VTextField 
                        v-model="userDetailsRef.firstname"
                        :disabled="!editMode"
                        label="Firstname"
                        required />
                    </VCol>
                    <VCol cols="6">
                        <VTextField 
                        v-model="userDetailsRef.lastname"
                        :disabled="!editMode"
                        label="Lastname" 
                        required /> 
                    </VCol>
                </VRow>
                <VRow>
                    <VCol cols="6">
                        <VTextField 
                        v-model="userDetailsRef.email"
                        :disabled="!editMode"
                        label="Email" 
                        required />
                    </VCol>
                </VRow>
                <VBtn type="submit" class="mt-2" :disabled="!editMode">Save</VBtn>
            </VContainer>
        </VForm>
    </VCard>
</template>