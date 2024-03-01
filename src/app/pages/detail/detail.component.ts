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
        label: 'medals per country',
        fill: true,
        tension: 0.5,
        borderColor: 'black',
        backgroundColor: 'rgba(255,0,0,0.3)'
      }
    ]
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: false
  };
  public lineChartLegend = true;
  public countryName: string = '';
  public countryId: number | undefined;


  constructor(private olympicService: OlympicService, private route: ActivatedRoute,) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.countryId = parseInt(params.get('id') || '', 10);
      console.log(this.countryId);
      this.olympicService.getOlympics().subscribe((data: Olympic[] | undefined) => {
        if (data) {
          console.log(data);
          const countryData = data.find(country => country.id === this.countryId);
          console.log(countryData);
          if (countryData) {
            countryData.participations.forEach((participation: Participation) => {
              console.log(participation.year.toString());
              this.lineChartData.labels!.push(participation.year.toString());
              console.log(this.lineChartData);
              this.lineChartData.datasets[0].data.push(participation.medalsCount);
              console.log(participation.medalsCount);

            });
          }
        }
      });
    });
  }
}