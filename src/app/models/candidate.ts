export interface Candidate{
    id: string,
    name: string,
    mobileNo: string,
    email: string,
    position: string,
    date : string,
    time : string,
    [key: string]: string;
}