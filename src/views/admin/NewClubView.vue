<script setup lang="ts">
import { inject, ref } from 'vue';
import { genericGetHttpRequest, genericPostHttpRequest } from '@/apiHttp/RequestsApi';
import { useMutation, useQuery } from '@tanstack/vue-query';
import type { ClubResponse, GenericErrorResponse } from '@/types/HttpResponseTypes';
import type { AxiosError } from 'axios';
import type { ICreateClubRequest } from '@/types/HttpRequestTypes';

const popUpError: (msg: string, timeout: number) => void = inject("errorToastPopUp", ()=>{})
const popUpSuccess: (msg: string, timeout: number) => void = inject("okayToastPopUp", ()=>{})

const listOfClubs = ref<Array<ClubResponse>>([])
const newClubRef = ref('')

const fetchListOfClubs = async () => 
    await genericGetHttpRequest<Array<ClubResponse>>('/clubs', {})
const { isError, isLoading, error, refetch } = useQuery<Array<ClubResponse>, AxiosError<GenericErrorResponse, any>>(
['getClubsList'],
fetchListOfClubs,
{
    onError: ()=>{
    },
    onSuccess: (responseData) => {
        listOfClubs.value = responseData
    },
})

const addNewClubFn = async (newClub: ICreateClubRequest): Promise<ClubResponse> =>
    await genericPostHttpRequest<ICreateClubRequest, ClubResponse>(`/clubs`, newClub, {})


const { mutate } = useMutation<ClubResponse, AxiosError<any, GenericErrorResponse>, ICreateClubRequest>(
    ["addNewClub"],
    addNewClubFn,
    {
        onSuccess: (clubResponse) => {
            refetch({})
            newClubRef.value = ''
            popUpSuccess(`New club ${clubResponse.clubName} has been added`, 5000)
        }, 
        onError: (error)=>{
			popUpError(error.response?.data.message || 'Unknown login error', 5000)
		},
        retry: 0
    }
)

const addClub = () =>{
    const findTheSame = listOfClubs.value.find(
        (searchElem) => searchElem.clubName == newClubRef.value)
    if(findTheSame == undefined){
        mutate({ newClubName: newClubRef.value })
        return
    }
    popUpError(`Club with name ${newClubRef.value} exists`, 3000)
}
</script>

<template>
    <VCard class="max-auto" >
        <VContainer flex>
            <VRow>
                <div class="title text-h3">List of clubs page</div>
            </VRow>
            <VRow v-if="isLoading">
                <VCol>
                    <div class="title text-h5">Loading</div>
                </VCol>
            </VRow>
            <VRow v-else-if="isError">
                <VCol>
                    <div class="title text-h5">{{ error?.response?.data.message }}</div>
                </VCol>
            </VRow>
            <VRow align="center" flex v-else>
                <VCol cols="12">
                    <VTextField v-model="newClubRef" label="Insert new club"></VTextField>
                    <VBtn @click="addClub" :disabled="newClubRef==''">Save</VBtn>
                </VCol>
                <VCol>
                    <VTable v-if="listOfClubs.length > 0">
                        <thead>
                            <tr>
                                <th class="text-left">Club name</th>
                                <th class="text-left">Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="club in listOfClubs"
                                :key="club.id"
                            >
                                <td>{{ club.clubName }}</td>
                                <td>
                                    <VContainer>
                                        <VRow>
                                            <VIcon icon="mdi-eye"></VIcon>
                                            <VIcon icon="mdi-delete"></VIcon>
                                        </VRow>
                                    </VContainer>
                                </td>
                            </tr>
                        </tbody>
                    </VTable>
                    <div v-else>
                        No Clubs
                    </div>
                </VCol>
            </VRow>
        </VContainer>
    </VCard>
</template>