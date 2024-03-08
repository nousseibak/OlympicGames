import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions, ChartType } from "chart.js";
import { OlympicService } from 'src/app/core/services/olympic.service';
import { ActivatedRoute } from '@angular/router';
import { Participation } from 'src/app/core/models/Participation';
import { Olympic } from 'src/app/core/models/Olympic';




@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent  implements OnInit {
  title = 'ng2-charts-demo';

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Médailles par année',
        fill: false,
        tension: 0,
        borderColor: 'black',
        backgroundColor: 'rgba(255,0,0,0.3)'
      },

    ]
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: false,

    plugins: {
      legend: { display: false },

    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Dates', // Remplacez cela par le nom approprié
        },
      },
      y: {
        title: {
          display: true,
          text: 'Nombre de Médailles', // Remplacez cela par le nom approprié
        },
      },
    },
  };

  public lineChartLegend = true;
  public countryId: number | undefined;
  countryDetails: any;
  errorMessage: string = '';



  constructor(private olympicService: OlympicService, private route: ActivatedRoute  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.countryId = parseInt(params.get('id') || '', 10);
      console.log(this.countryId);
      this.olympicService.getOlympics().subscribe((data: Olympic[] | undefined) => {
        if (data) {
          console.log("country id"+data);
          const countryData = data.find(country => country.id === this.countryId);
          console.log(countryData);
          if (countryData) {
            countryData.participations.forEach((participation: Participation) => {
              console.log("participation year" +participation.year.toString());
              this.lineChartData.labels!.push(participation.year.toString());
              this.lineChartData.datasets[0].data.push(participation.medalsCount);
              console.log("participation.medalsCount"+participation.medalsCount);

              this.countryDetails = {
                country: countryData.country,
                totalParticipations: countryData.participations.length,
                totalMedals: countryData.participations.reduce((acc: any, participation: { medalsCount: any; }) => acc + participation.medalsCount, 0),
                totalAthletes: countryData.participations.reduce((acc: any, participation: { athleteCount: any; }) => acc + participation.athleteCount, 0),
              };
            }); 

          }
          else {
            this.errorMessage = 'Invalid country ID';
  
          }
        }

        console.log(this.lineChartData.labels);
        console.log(this.lineChartData);
        console.log(this.lineChartData.datasets[0].data);

      });
    });
  }


}