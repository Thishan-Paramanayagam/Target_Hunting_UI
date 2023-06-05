import { Injectable } from '@angular/core';
import { Candidate } from '../models/candidate';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  constructor(private httpclient:HttpClient) { }
  baseurl = "http://localhost:5106/api/Candidate";

  GetCandidate() : Observable<Candidate[]>{
    return this.httpclient.get<Candidate[]>(this.baseurl)
  }

  CreateCandidate(cnd :Candidate) :Observable<Candidate>{
    cnd.id ="00000000-0000-0000-0000-000000000000";
    return this.httpclient.post<Candidate>(this.baseurl,cnd)
  }

  UpdateCandidate(cnd :Candidate):Observable<Candidate>{
    return this.httpclient.put<Candidate>(this.baseurl+'/'+cnd.id,cnd);
  }


  DeleteCandidate(id:string):Observable<Candidate>{
    return this.httpclient.delete<Candidate>(this.baseurl+'/'+id);
  }
}
