<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { genericGetHttpRequest } from "@/apiHttp/RequestsApi";
import type { ClubResponse, GenericErrorResponse } from "@/types/HttpResponseTypes";
import type { AxiosError } from "axios";
import { computed, inject, ref } from "vue";
import ClubSelect from '@/components/adminComponents/ClubsSelect.vue'

const props = defineProps({
    userId: {
        type: Number,
        required: true,
    },
    editable: {
        type: Boolean,
    }
})

const editMode = ref(false)
const isSelectUpdatedClub = ref(false)

const noClubDisplay = computed(() => {
    if(error != null && error.value != null){
        //previouse get request not found club and we are not changing club
        //and club value was not changed/saved by select component
        return error?.value.response?.status == 404 && 
            !editMode.value && !isSelectUpdatedClub.value
    }
    return false
})
const allowToEdit = computed(() => {
    return !editMode.value && props.editable
})
const insertMode = computed(() => {
    if(error != null && error.value != null){
        //previouse get request not found club and we are trying to add one
        return error.value.response?.status == 404 && 
        editMode.value
    }
    return false
})
const userClub = ref<ClubResponse>(
    {
        id: -1,
        clubName: ''
    }
)

const fetchClubFn = async (): Promise<ClubResponse> => 
    genericGetHttpRequest<ClubResponse>(`/users/${props.userId}/club`, {});

const { isLoading, error } = 
    useQuery<ClubResponse, AxiosError<GenericErrorResponse, any>>(
        ['getUserClub'], fetchClubFn, 
        {
            onSuccess: (data) => {
                userClub.value = data
            },  
            retry: 0 
        }
    )

const popUpSuccess: (msg: string, timeout: number) => void = inject("okayToastPopUp", ()=>{})
const updateUserClub = (newClub: ClubResponse) =>{
    userClub.value = newClub;
    editMode.value = false;
    isSelectUpdatedClub.value = true; //updated variable allows us to new club after saving changes
    popUpSuccess('User club details has been updated', 5000)
}
</script>
<template>
    <span v-if="isLoading">Loading...</span>
    <div v-else>
        <VCard>
            <VContainer class="">
                <VRow>
                    <VCol cols="11" class="pa-0 ma-0">
                        <VCardTitle v-if="allowToEdit">Shooting club:</VCardTitle>
                        <VCardTitle v-else>Edit Shooting club:</VCardTitle>
                    </VCol>
                    <VCol cols="1">
                        <VIcon v-if="allowToEdit" icon="mdi-pencil" @click="editMode = true"></VIcon>
                        <VIcon v-else icon="mdi-close" @click="editMode = false"></VIcon>
                    </VCol>
                </VRow>
            </VContainer>
            <VCardText v-if="noClubDisplay"
            >User is not related with any club</VCardText>
            <VCardText v-else-if="allowToEdit">{{ userClub.clubName }}</VCardText>
            <VCardText v-else class="py-0">
                <ClubSelect :isNewClubMember="insertMode" 
                    :selectedClub="userClub" 
                    :userId="userId" @changeClub="updateUserClub" />
            </VCardText>
        </VCard>
    </div>
</template>