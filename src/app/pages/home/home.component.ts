import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { ChartOptions } from 'chart.js';
import { ActivatedRoute, Router } from '@angular/router';
import { Olympic } from 'src/app/core/models/Olympic';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { IconDefinition, faMedal } from '@fortawesome/free-solid-svg-icons';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { NgZone } from '@angular/core';





@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit{
  title = 'ng2-charts-demo';


  public faMedal = faMedal;


  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: false,
    plugins: {
      legend: {
        display: false,
        position: 'top',
        
      },
      datalabels: {
        formatter: (value: any, ctx: any) => {
          if (ctx.chart.data.labels) {
            return ctx.chart.data.labels[ctx.dataIndex];
          }
        },
        color: 'white',
        font: { size: 14, family: 'FontAwesome', },
        
      },

    },
    onClick : (evt, array) => {
      console.log('clicked on data index ',array[0].index);
      this.onClick(array[0].index);
  }
    
  };
  public pieChartLabels :string[] = [];
  public pieChartDatasets :{ data: number[]; label: any; backgroundColor: string[] }[] = [];
  public pieChartLegend = false;
  public pieChartPlugins = [DatalabelsPlugin];

  public totalCountries = 0;
  public totalOlympics = 0;
  public olympics: Olympic[] = []; 
  public medalIcon: IconDefinition | null;


  
  constructor(private olympicService: OlympicService, private router: Router, library: FaIconLibrary, private zone: NgZone, ) {    
    library.addIcons(faMedal);
    this.medalIcon= library.getIconDefinition('fas', 'medal');
 

  }

  ngOnInit(): void {
    this.olympicService.loadInitialData().subscribe((olympics) => {
      this.processDataForPieChart(olympics);
      this.olympics=olympics;
    }
  );
}

  private processDataForPieChart(olympics: any): void {
    const customColors: string[] = ['#956065', '#B8CBE7', '#89A1DB', '#793D52', '#9780A1'];

    this.pieChartLabels = olympics.map((olympic: any) => olympic.country);
    this.pieChartDatasets = [
      {
        data: olympics.map((olympic: any) => olympic.participations.reduce((acc: number, part: any) => acc + part.medalsCount, 0)),
        label: this.medalIcon,
        backgroundColor: customColors,
        
      },
    ];


    this.totalCountries = olympics.length;
    this.totalOlympics = new Set(olympics.map((olympic: any) => olympic.participations.map((part: any) => part.year)).flat()).size;

  }




public onClick(number: number ){
  let countryClicked = this.olympics[number].id;

  this.zone.run(() => {
    this.router.navigate(['/detail', countryClicked]);
  });}
}
