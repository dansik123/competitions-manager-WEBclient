<script setup lang="ts">
import { inject, ref } from "vue";
import { genericGetHttpRequest } from "@/apiHttp/RequestsApi";
import type { GenericErrorResponse } from "@/types/HttpResponseTypes";
import type { AxiosResponse } from 'axios';
import { useQuery } from "@tanstack/vue-query";

const emits = defineEmits(['selectedGunType'])
const popUpError: (msg: string, timeout: number) => void = inject("errorToastPopUp", ()=>{})

const selectOptionsRef = ref<Array<string>>([""])
const selectedGunType = ref("")

const fetchListOfGunTypes = async () => 
    await genericGetHttpRequest<Array<string>>('/gun-types', {})
const { isError, isLoading, error } = useQuery<Array<string>, AxiosResponse<GenericErrorResponse>>(
['getGunTypesList'],
fetchListOfGunTypes,
{
    onError: (error)=>{
        popUpError(error.data.message || 'Unknown login error', 5000)
    },
    onSuccess: (responseData) => {
        selectOptionsRef.value = ['', ...responseData]
    },
})
</script>
<template>
    <div>
        <VContainer v-if="isError">
            <VRow>
                <p>Error: {{ error?.data.message }}</p>
            </VRow>
        </VContainer>
        <VContainer v-else>
            <VRow>
                <VSelect class="gun_type_select"
                v-model="selectedGunType"
                clearable
                label="GunType"
                :loading="isLoading"
                :items="selectOptionsRef"
                @update:modelValue="() => emits('selectedGunType', selectedGunType)"
                >
                </VSelect>  
            </VRow>
        </VContainer>
    </div>
</template>