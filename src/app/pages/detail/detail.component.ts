import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions } from "chart.js";
import { OlympicService } from 'src/app/core/services/olympic.service';
import { ActivatedRoute } from '@angular/router';
import { Participation } from 'src/app/core/models/Participation';
import { Olympic } from 'src/app/core/models/Olympic';
import { Subscription } from 'rxjs';

interface CountryDetails {
  country: string;
  totalParticipations: number;
  totalMedals: number;
  totalAthletes: number;
}

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, OnDestroy {
  title = 'ng2-charts-demo';

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Medals by year',
        fill: false,
        tension: 0,
        borderColor: 'black',
        backgroundColor: 'rgba(255,0,0,0.3)'
      },
    ]
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Number medals by year',
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Year',
        },
      },
      y: {
        title: {
          display: true,
          text: 'number medals',
        },
      },
    },
  };

  public lineChartLegend = false;
  public countryId: number | undefined;
  countryDetails: CountryDetails | undefined;
  errorMessage = '';

  private subscriptions: Subscription[] = [];

  constructor(private olympicService: OlympicService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.processDataCountry();
  }

  ngOnDestroy(): void {
    // Désabonnement de toutes les souscriptions
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
 * 
 * countryData Charger les informations concernant le pays à partir de l'id récupéré
 * récupération pour le pays des participations (années) et médailles gagnées par participation
 * Si l'id est incorrect, un message d'erreur s'affiche
 */
  private processDataCountry(): void {
    this.subscriptions.push(
      this.route.paramMap.subscribe(params => {
        this.countryId = parseInt(params.get('id') || '', 10);
        this.olympicService.getOlympics().subscribe((data: Olympic[] | undefined) => {
          if (data) {
            const countryData = data.find(country => country.id === this.countryId);
            if (countryData) {
              countryData.participations.forEach((participation: Participation) => {
                this.lineChartData.labels!.push(participation.year.toString());
                this.lineChartData.datasets[0].data.push(participation.medalsCount);
              });

              this.processCountryDetails(countryData);
            } else {
              this.errorMessage = 'Invalid country ID';
            }
          }
        });
      })
    );
  }

  /**
 * Charger les informations concernant le pays:
 * nom du pays, nombre total de participations, nombre total de medailles, nombre total d'athletes
 * @param countryData 
 */
  private processCountryDetails(countryData: Olympic): void {
    this.countryDetails = {
      country: countryData.country,
      totalParticipations: countryData.participations.length,
      totalMedals: countryData.participations.reduce((acc, participation) => acc + participation.medalsCount, 0),
      totalAthletes: countryData.participations.reduce((acc, participation) => acc + participation.athleteCount, 0),
    };
  }
}