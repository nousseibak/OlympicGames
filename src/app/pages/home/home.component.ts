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
        display: true,
        position: 'top',
      },
      datalabels: {
        formatter: (value: any, ctx: any) => {
          if (ctx.chart.data.labels) {
            return ctx.chart.data.labels[ctx.dataIndex];
          }
        },
      },
    },
  };
  public pieChartLabels :string[] = [];
  public pieChartDatasets :{ data: number[]; label: any}[] = [];
  public pieChartLegend = false;
  public pieChartPlugins = [DatalabelsPlugin];

  public totalCountries = 0;
  public totalOlympics = 0;
  public olympics: any; 
  public medalIcon: IconDefinition | null;


  constructor(private olympicService: OlympicService, private router: Router, library: FaIconLibrary) {    
    library.addIcons(faMedal);
    this.medalIcon= library.getIconDefinition('fas', 'medal');
 

  }

  ngOnInit(): void {
    this.olympicService.loadInitialData().subscribe((olympics) => {
      this.processDataForPieChart(olympics);
      this.olympics=olympics;
    });
  }

  private processDataForPieChart(olympics: any): void {

    this.pieChartLabels = olympics.map((olympic: any) => olympic.country);
    this.pieChartDatasets = [
      {
        data: olympics.map((olympic: any) => olympic.participations.reduce((acc: number, part: any) => acc + part.medalsCount, 0)),
        label: this.medalIcon,
        
      },
    ];


    this.totalCountries = olympics.length;
    this.totalOlympics = new Set(olympics.map((olympic: any) => olympic.participations.map((part: any) => part.year)).flat()).size;

  }


  onChartClick(event: { event: MouseEvent; active: { _index: number; _datasetIndex: number }[] }): void {
    const clickedCountryIndex = event.active[0]?._index;

    if (clickedCountryIndex !== undefined) {
      const clickedCountryId = this.olympics[clickedCountryIndex]?.id;
      
      if (clickedCountryId !== undefined) {
        this.router.navigate(['/details', clickedCountryId]);
      }
    }
  }
}
