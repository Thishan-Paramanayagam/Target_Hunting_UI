import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class TimeAvailabilityService {

  constructor(private http: HttpClient) { }
  
  getExistingData() {
    const baseurl = "http://localhost:5106/api/Candidate";
    return this.http.get(baseurl);
  }
}
