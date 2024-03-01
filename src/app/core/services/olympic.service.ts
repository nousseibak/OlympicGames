import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map,tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';
import { Participation } from '../models/Participation';


@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<any>(undefined);

  constructor(private http: HttpClient) {}

  loadInitialData() {
    return this.http.get<any>(this.olympicUrl).pipe(
      map((data) => this.transformData(data)),
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        console.error(error);
        this.olympics$.next([]);
        return caught;
      })
    );
  }

  getOlympics() {
    return this.olympics$.asObservable();
  }

  private transformData(data: any): Olympic[] {
    return data.map((item: any) => {
      const olympic: Olympic = {
        id: item.id,
        country: item.country,
        participations: item.participations.map((participation: any) => ({
          id: participation.id,
          year: participation.year,
          city: participation.city,
          medalsCount: participation.medalsCount,
          athleteCount: participation.athleteCount,
        })),
      };
      return olympic;
    });
  }
}
