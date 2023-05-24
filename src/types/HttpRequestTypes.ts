import type { ClubResponse } from '@/types/HttpResponseTypes'
export interface ILoginRequest{
    email: string,
    password: string
}

export interface IRegisterRequest{
    firstname: string,
    lastname: string
    email: string,
    password: string
}

export interface IClubRequest extends ClubResponse{
}

export interface ICreateClubRequest{
    newClubName: string
}

export interface INewClubMemberIdRequest {
    newMemberId: number
}
export interface AdminUserRequest {
    firstname: string,
    lastname: string,
    email: string,
    role: string,
    enabled: boolean
}

export interface UserDetailsRequest {
    firstname: string,
    lastname: string,
    email: string
}

export interface SaveLeaguesRequest{
    leagueMaxCompetitors: number,
    leagueGunType: string,
    roundsToPlay: number,
    leaguesGroups: any 
    // { 'leagueName': [Array with league competitors id's],
    // 'leagueName': [Array with league competitors id's]
    // }
}

export interface UpdateMatchScoreResult{
    competitor1Result: string,
    competitor2Result: string,
}

export interface LeaguesRelocateDto{
    leaguesGroupPrefix: string,
    groupAllLeaguesIds: Array<number>
}