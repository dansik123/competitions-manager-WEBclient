<script setup lang="ts">
import { useMutation, useQuery } from "vue-query";
import { genericGetHttpRequest, genericPostHttpRequestNoParams, genericPutHttpRequestNoParams } from "@/apiHttp/RequestsApi";
import type { ClubResponse, GenericErrorResponse, ClubMemberResponse } from "@/types/HttpResponseTypes";
import { inject, ref } from "vue";
import type { AxiosError } from "axios";
import type { IClubRequest, INewClubMemberIdRequest } from "@/types/HttpRequestTypes";

const props = defineProps({
    userId: {
        type: Number,
        required: true,
    },
    selectedClub:{
        type: Object as () => ClubResponse 
    },
    isNewClubMember:{
        type: Boolean,
        required: true,
    }
})
const emits = defineEmits(['changeClub'])
const popUpWarning: (msg: string, timeout: number) => void = inject("warningToastPopUp", ()=>{})
const popUpError: (msg: string, timeout: number) => void = inject("errorToastPopUp", ()=>{})

const fetchClubsFn = async () => 
    await genericGetHttpRequest<Array<ClubResponse>>('/clubs', {})
const { data, isError, isLoading, error } = 
    useQuery<Array<ClubResponse>, GenericErrorResponse>(
    'getClubList', 
    fetchClubsFn,
    {
        retry: 0
    })

const selectedClubRef = ref<ClubResponse>(
    props.selectedClub? props.selectedClub: {id: -1, clubName:''})
const updatedClubRef = ref<ClubResponse>({id: -1, clubName:''})

const addClubMemberFn = async (newUserMember: INewClubMemberIdRequest): Promise<ClubMemberResponse> =>
    await genericPostHttpRequestNoParams<INewClubMemberIdRequest, ClubMemberResponse>(
        `/clubs/${selectedClubRef.value.id}/members`,
        newUserMember)
const addMutation = useMutation<ClubMemberResponse, AxiosError<any, GenericErrorResponse>, INewClubMemberIdRequest>(
    "addClubMember",
    addClubMemberFn,
    {
        onSuccess: (responseData) =>{
            updatedClubRef.value = {
                id: responseData.clubId,
                clubName: responseData.clubName
            }
            emits('changeClub', updatedClubRef.value);
        },
        onError: (error)=>{
            popUpError(error.response?.data.message || 'Unknown login error', 5000)
        }
    }
)

const updateClubMemberFn = async (selectedClub: IClubRequest): Promise<ClubMemberResponse> =>
    await genericPutHttpRequestNoParams<IClubRequest, ClubMemberResponse>(
        `/clubs/${props.selectedClub?.id}/members/${props.userId}`,
        selectedClub)

const updateMutation = useMutation<ClubMemberResponse, AxiosError<any, GenericErrorResponse>, IClubRequest>(
    "updateClub",
    updateClubMemberFn,
    {
        onSuccess: (responseData) =>{
            updatedClubRef.value = {
                id: responseData.clubId,
                clubName: responseData.clubName
            }
            emits('changeClub', updatedClubRef.value);
        },
        onError: (error)=>{
            popUpError(error.response?.data.message || 'Unknown login error', 5000)
        }
    }
)
const saveSelection = async () =>{
    if(selectedClubRef.value != null &&
        selectedClubRef.value.id != props.selectedClub?.id){
        if(props.isNewClubMember){
            addMutation.mutate({ newMemberId: props.userId })
        }else{
            updateMutation.mutate(selectedClubRef.value);
        }
        return
    }
    popUpWarning('Club was not changed', 5000)
}
</script>
<template>
    <div>
        <VContainer v-if="!isError">
            <VRow>
                <VSelect class="clubs_select"
                v-model="selectedClubRef"
                clearable
                label="Club name"
                :loading="isLoading"
                :items="data"
                item-title="clubName"
                :item-value="(item) => item"
                >
                    <template v-slot:prepend>
                        <v-icon @click="saveSelection" icon = "mdi-content-save-edit-outline"/>
                    </template>
                </VSelect>  
            </VRow>
        </VContainer>
        <VContainer v-else>
            <VRow>
                <p>Error: {{ error?.message }}</p>
            </VRow>
        </VContainer>
    </div>
</template>

<style>
  .clubs_select .v-input__prepend {
    max-height: 48px;
    font-size: 30px;
  }
</style>