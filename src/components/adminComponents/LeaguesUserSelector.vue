<script setup lang="ts">
import { ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { genericGetHttpRequest } from "@/apiHttp/RequestsApi";
import type { PagedResponse, PaginationData, GenericErrorResponse, LeagueSelectorPageQueryParam, MemberUserResponse } from "@/types/HttpResponseTypes";
import type { AxiosResponse } from 'axios';
import { leagueQueryRequestDefaults, paginationResponseDefault } from "@/components/PaginationDefaults";
import { userTableCellFormater } from "@/components/Formaters";
import { watch } from "vue";

const props = defineProps({
    selectedLeagueGunType:{
        type: String,
        required: true
    }
})

const paginationData = ref<PaginationData>(paginationResponseDefault)

const paginationQueryData = ref<LeagueSelectorPageQueryParam>(leagueQueryRequestDefaults)

const responseContentRef = ref<Array<MemberUserResponse>>([])

watch(() => props.selectedLeagueGunType, async (newGunType, oldGunType)=>{
    //any default value should result to display empty array of data
    if(newGunType=='' || newGunType == undefined){ 
        responseContentRef.value = []
        return;
    }
    //for selecting the same value nothing is changed
    if(newGunType == oldGunType){
        return;
    }
    //otherwise we reset query params to default ones and we set new gunType there too.
    //finally we repeate fetch to get table updated
    paginationQueryData.value = leagueQueryRequestDefaults;
    paginationQueryData.value.gunType = newGunType;
    resetSelectedUsers()
    refetch({});
})

const updateContent = (newPageNumber: number) => {
    //the request page value starts from 0 therefore I have to substart 1
    //from pagination numbers value which starts from 1.
    paginationQueryData.value.page = newPageNumber - 1;
    refetch({}) //refetch must have at least empty object to execute
}

const fetchUsersForLeagueFn = async (paginationParams: LeagueSelectorPageQueryParam) => 
    await genericGetHttpRequest<PagedResponse<MemberUserResponse>>('/users/league-select', paginationParams)
const { isError, isLoading, error, refetch } = 
    useQuery<PagedResponse<MemberUserResponse>, AxiosResponse<GenericErrorResponse>>(
    ['getUsersPagedList'], 
    () => fetchUsersForLeagueFn(paginationQueryData.value),
    {
        onSuccess: (data) =>{
            paginationData.value = data
            paginationData.value.paginationNumber = data.number + 1
            responseContentRef.value = data.content
        },
        enabled: false, //You should use this for next component to fetch new created leagues
        retry: 0
    })

/////////////////////////////////////////////////////////////
//Second table data to hold selected users
const secondTableUsersRef = ref<Array<MemberUserResponse>>([])
const selectedUsersIdsRef = ref<Array<number>>([])

const addNewUser = (user: MemberUserResponse)=>{
    secondTableUsersRef.value.push(user)
    selectedUsersIdsRef.value.push(user.userId)
}

const removeSelectedUser = (userId: number) =>{
    const index = selectedUsersIdsRef.value.indexOf(userId);

    selectedUsersIdsRef.value.splice(index, 1);
    secondTableUsersRef.value.splice(index, 1);
}

const alredySelected = (userId: number): boolean => {
    return selectedUsersIdsRef.value.includes(userId);
}

const resetSelectedUsers = () =>{
    secondTableUsersRef.value = []
    selectedUsersIdsRef.value = []
}

const emits = defineEmits(['updateSelectedUsers'])
const btnClickGenerate = () =>{
    let toGenerate: any = {}
    toGenerate[props.selectedLeagueGunType] = selectedUsersIdsRef.value
    emits('updateSelectedUsers', toGenerate);
}


</script>
<template>
    <h1>List of users to choose for leagues</h1>
    <span v-if="isLoading">Loading...</span>
    <span v-else-if="isError">Error: {{ error?.data.message }}</span>
    <VRow v-else>
        <VCol cols="6">
            <VTable>
                <thead>
                    <tr>
                        <th class="text-left">Firstname</th>
                        <th class="text-left">Lastname</th>
                        <th class="text-left"> Add </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="user in responseContentRef"
                        :key="user.userId"
                    >
                        <td>{{ user.firstname }}</td>
                        <td>{{ user.lastname }}</td>
                        <td> 
                            <VBtn :disabled="alredySelected(user.userId)"
                                :active="alredySelected(user.userId)"
                                @click="addNewUser(user)"
                                >Add
                            </VBtn>
                        </td>
                    </tr>
                </tbody>
            </VTable>
            <VPagination 
                v-model="paginationData.paginationNumber"
                @update:modelValue="updateContent"
                :length="paginationData.totalPages"></VPagination>
        </VCol>
        <VCol cols="6">
            <VCard>
                <VCardTitle>Selected users</VCardTitle>
                <VCardText>
                    <VItemGroup>
                        <VItem v-for="selectedUser in secondTableUsersRef" :key="selectedUser.userId">
                            <VChip closable @click:close="removeSelectedUser(selectedUser.userId)">
                                {{ userTableCellFormater(selectedUser) }}
                            </VChip>
                        </VItem>
                    </VItemGroup>
                </VCardText>
            </VCard>
        </VCol>
    </VRow>
    <VRow>
        <VCol class="d-flex justify-end">
            <VBtn end @click="btnClickGenerate">
                Generate
            </VBtn>
        </VCol>
    </VRow>
</template>