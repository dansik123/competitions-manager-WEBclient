<script setup lang="ts">
import { useMutation, useQuery } from "@tanstack/vue-query";
import { genericGetHttpRequest, genericPutHttpRequestNoParams } from "@/apiHttp/RequestsApi";
import type { AdminUserResponse, GenericErrorResponse } from "@/types/HttpResponseTypes";
import type { AdminUserRequest } from "@/types/HttpRequestTypes";
import { inject, ref } from "vue";
import type { AxiosResponse } from "axios";
const props = defineProps({
    userId: {
        type: Number,
        required: true,
    },
    isSuccess: {
        type: Boolean,
        required: true
    }
})
const emits = defineEmits(['update:isSuccess'])
const rolesArray = ['USER', 'SPECTATOR', 'ADMIN']

const userDetailsRef = ref<AdminUserRequest>(
    {
        firstname: '',
        lastname:  '',
        email: '',
        role: '',
        enabled: false
    }
)

const popUpError: (msg: string, timeout: number) => void = inject("errorToastPopUp", ()=>{})

const fetchUser = async () => 
    await genericGetHttpRequest<AdminUserResponse>(`/users/${props.userId}`, {})
const { isError, isLoading, error } = useQuery<AdminUserResponse, GenericErrorResponse>(
    ['getSignleUser'], 
    fetchUser,
    {
        onSuccess: (data) => {
            userDetailsRef.value = data
            emits("update:isSuccess", true)
        }, 
        retry: 0 
    }
)

const updateUserFn = async (changedUser: AdminUserRequest): Promise<AdminUserResponse> =>
await genericPutHttpRequestNoParams<AdminUserRequest ,any>(
    `/users/${props.userId}`,
    changedUser
)
const popUpSuccess: (msg: string, timeout: number) => void = inject("okayToastPopUp", ()=>{})

const { mutate } = useMutation<AdminUserResponse, AxiosResponse<GenericErrorResponse>, AdminUserRequest>(
    ["updateClub"],
    updateUserFn,
    {
        onSuccess: (data) => {
            userDetailsRef.value = data
            popUpSuccess('User details has been updated', 5000)
        }, 
        onError: (error)=>{
            popUpError(error.data.message || 'Unknown login error', 5000)
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
    <div v-else>
        <VCard>
            <VBtn @click="editMode= (!editMode)"> Edit</VBtn>
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
                        <VCol cols="4">
                            <VSelect class="role_select"
                                v-model="userDetailsRef.role"
                                clearable
                                label="Role"
                                :disabled="!editMode"
                                :items="rolesArray"
                                item-title="role"
                                :item-value="(item) => item"
                                required
                                >
                            </VSelect>  
                        </VCol>
                        <VCol cols="2">
                            <VCheckbox
                            v-model="userDetailsRef.enabled"
                            :disabled="!editMode"
                            label="Enabled"
                            required 
                            />
                        </VCol>
                    </VRow>
                    <VBtn type="submit" class="mt-2" :disabled="!editMode">Submit</VBtn>
                </VContainer>
            </VForm>
        </VCard>
    </div>
</template>