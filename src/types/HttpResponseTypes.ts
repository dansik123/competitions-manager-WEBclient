import type { AdminUserRequest, UserDetailsRequest } from "./HttpRequestTypes";

export interface ITokenResponse{
    accessToken: string
}

export interface GenericResponse {
    status: string;
    message: string;
}

export interface GenericErrorResponse{
    timestamp: string;
    message: string;
    statusCode: number;
}

export interface User {
    id: number,
    firstname: string,
    lastname: string,
    email: string,
    role: string
}

export interface LeagueSelectorPageQueryParam extends PageQueryParams{
    gunType: string
}
export interface PageQuerySortedParams{
    page: number,
    size: number,
    sort: string,
    direction: string
}
export interface PageQueryParams{
    page: number,
    size: number
}
export interface PaginationData{
    number: number,
    paginationNumber: number,
    first: boolean,
    last: boolean,
    totalElements: number,
    totalPages: number,
    size: number,
    empty: boolean
}
export interface PagedResponse<T> extends PaginationData {
    content: Array<T>
}

export interface AdminUserResponse extends AdminUserRequest{
    id: number
}

export interface UserDetailsResponse extends UserDetailsRequest{
    id: number
}

export interface ClubResponse{
    id: number,
    clubName: string
}

export interface UserAverageScores{
    gunType: string,
    avgScore: number
}

export interface ClubMemberResponse{
    clubId: number,
    clubName: string,
    member: MemberUserResponse
}

export interface MemberUserResponse{
    userId: number,
    firstname: string,
    lastname: string
}

export interface UserLeagueResponse{
    leagueId: number,
    leagueName: string,
    leagueMaxCompetitors: number,
    competitorsCount: number,
    totalRounds: number,
    currentRoundNo: number,
    leagueGunType: string
}

export interface UserLeagueMatchesBooleanResponse extends UserLeagueResponse{
    matchesGenerated: boolean
}

export interface LeagueCompetitorResponse extends MemberUserResponse{
    avgScore: number
}

export interface GeneratedLeagueGroup{
    leagueName: string,
    leagueCompetitors: Array<LeagueCompetitorResponse>
}

export interface SingleMatchResponse{
    matchId: number,
    matchDate: string | null,
    competitor1: MemberUserResponse,
    competitor2: MemberUserResponse,
    slotMatchResult: string,
    competitor1ScoreCardLink: string | null,
    competitor2ScoreCardLink: string | null
}

export interface SingleRoundMatchesResponse{
    roundNo: number,
    roundPauseUsers: Array<MemberUserResponse>,
    matches: Array<SingleMatchResponse>
}

export interface UserMatchResponse extends SingleMatchResponse{
    roundNo: number 
}

export interface LeagueSelect{
    leagueId: number,
    leagueName: string
}

export interface SummaryPointsRowResponse<T>{
    pointsOwner: MemberUserResponse,
    individualPoints: Array<T>,
    totalLeaguePoints: number
}
export interface LeagueRoundSlotPointsResponse extends SummaryCommonDataResponse{
    leagueRoundNumber: number
}

export interface SingleSlotUserPointsResponse extends SummaryCommonDataResponse{
    roundNumber: number
}

export interface SummaryCommonDataResponse{
    slotLeaguePoints: number,
    competitor1: MemberUserResponse,
    competitor2: MemberUserResponse,
    slotShootingResult: string
}

export interface LeagueGroupRelocationResponse{
    leagueGroupName: string,
    leagueGroupFinished: boolean,
    readyToRelocate: boolean,
    leaguesStatus: Array<LeagueStatusResponse>
}

export interface LeagueStatusResponse{
    leagueId: number,
    leagueName: string,
    leagueStatus: string
}
