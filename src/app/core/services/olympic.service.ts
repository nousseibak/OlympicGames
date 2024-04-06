import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable} from 'rxjs';
import { catchError, map,tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';
import { Participation } from '../models/Participation';


@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[]>([]);

  constructor(private http: HttpClient) {}

  /**
   * Charger les données à partir du fichier olympic.json
   */
  loadInitialData() : Observable<Olympic[]> {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      map((data) => this.transformData(data)),
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        console.error(error);
        this.olympics$.next([]);
        return caught;
      })
    );
  }

  getOlympics() : Observable<Olympic[]> {
    return this.olympics$.asObservable();
  }

  /**
   * Transformer les données chargées à partir du fichier olympic.json en objets Olympic
   * @param data Données brutes chargées depuis olympic.json
   * @returns Tableau d'objets Olympic
   */
  private transformData(data: Olympic[]): Olympic[] {
    return data.map((item: Olympic) => {
      return  {
        id: item.id,
        country: item.country,
        participations: item.participations.map((participation: Participation) => ({
          id: participation.id,
          year: participation.year,
          city: participation.city,
          medalsCount: participation.medalsCount,
          athleteCount: participation.athleteCount,
        })),  
      }as Olympic;
    });
  }
}
