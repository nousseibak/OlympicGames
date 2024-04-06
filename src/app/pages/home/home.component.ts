import { Component, OnInit } from '@angular/core';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Router } from '@angular/router';
import { Olympic } from 'src/app/core/models/Olympic';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { ChartConfiguration } from 'chart.js';
import { NgZone } from '@angular/core';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  title = 'Olympics';

  public pieChartLabels: string[] = [];
  public pieChartDatasets: { data: number[]; label: string; backgroundColor: string[] }[] = [];
  public pieChartLegend = false;
  public pieChartPlugins = [DatalabelsPlugin];

  public totalCountries = 0;
  public totalOlympics = 0;
  public olympics: Olympic[] = [];

  private subscriptions: Subscription[] = [];


  /**
   * Configuration des options du diagramme
   * datalabels: correspond aux labels des secteurs du diagramme (on change la couleur du texte, sa taille, sa police)
   * tooltip: quand on survole un secteur du diagramme, une fenêtre avec des informations sur ce secteur s'affiche: 
   * Nous ajoutons une icone médaille dans la fenêtre qui s'affiche grâce à la méthode externalTooltipHandler;
   * onClick: grâce à la méthode onClickSecteurChart, quand on clique sur un secteur du diagramme, on sera redirigé vers  la page détail avec l'id du pays concerné
   */
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'top',
      },
      datalabels: {
        formatter: (value, ctx) => {
          if (ctx.chart.data.labels) {
            return ctx.chart.data.labels[ctx.dataIndex];
          }
        },
        color: 'white',
        font: { size: 14, family: 'FontAwesome', },
      },
      tooltip: {
        enabled: false,
        position: 'nearest',
        external: this.externalTooltipHandler
      }
    },
    onClick: (evt, array) => {
      this.onClickSecteurChart(array[0].index);
    },
  };


  constructor(private olympicService: OlympicService, private router: Router, private zone: NgZone) {
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.olympicService.loadInitialData().subscribe((olympics) => {
        this.processDataForPieChart(olympics);
        this.olympics = olympics;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }


  /**
   * Chargement des données des pays et du nombre de médailles par pays
   * customColors : définition de la couleur de fond de chaque secteur du diagramme
   * Calcul de nombre total de pays et du nombre total de Jos (participations)
   * @param olympics
   */
  private processDataForPieChart(olympics: Olympic[]): void {
    let customColors: string[] = ['#956065', '#B8CBE7', '#89A1DB', '#793D52', '#9780A1'];

    this.pieChartLabels = olympics.map((olympic) => olympic.country);
    this.pieChartDatasets = [
      {
        data: olympics.map((olympic) => olympic.participations.reduce((acc, part) => acc + part.medalsCount, 0)),
        label: "",
        backgroundColor: customColors,
      },
    ];

    this.totalCountries = olympics.length;
    this.totalOlympics = new Set(olympics.map((olympic) => olympic.participations.map((part) => part.year)).flat()).size;
  }



  /**  
   * methode pour accéder à la page détail du pays séléctionné en envoyant son id au component detail
   * 
   * */
  public onClickSecteurChart(indexSecteur: number): void {
    let countryClicked = this.olympics[indexSecteur].id;

    this.zone.run(() => {
      this.router.navigate(['/detail', countryClicked]);
    });
  }


  /**
   * methode pour afficher les infos  d'un pays quand on survole un pays dans le diagramme
   * ajout d'une icone médaille
   * tooltipEl.style.background : modification de la couleur de fond de la fenêtre
   * @param context 
   * @returns 
   */
  private externalTooltipHandler(context: any): void {
    const { chart, tooltip } = context;
    let tooltipEl = chart.canvas.parentNode.querySelector('div');

    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.style.background = '#04838F';
      tooltipEl.style.borderRadius = '3px';
      tooltipEl.style.color = 'white';
      tooltipEl.style.opacity = 0;
      tooltipEl.style.pointerEvents = 'none';
      tooltipEl.style.position = 'absolute';
      tooltipEl.style.transform = 'translate(-50%, 0)';
      tooltipEl.style.transition = 'all .1s ease';
      chart.canvas.parentNode.appendChild(tooltipEl);
    }

    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = 0;
      return;
    }


    if (tooltip.body) {
      let titleLines = tooltip.title || [];
      let bodyLines = tooltip.body.map((b: { lines: string[] }) => b.lines);

      let content = document.createElement('div');
      content.style.padding = `${tooltip.options.padding}px`;

      // Ajout titre
      titleLines.forEach((title: string) => {
        let titleElement = document.createElement('div');
        titleElement.appendChild(document.createTextNode(title));
        titleElement.style.textAlign = 'center';
        content.appendChild(titleElement);
      });

      // Ajout du Body
      bodyLines.forEach((body: string[], i: number) => {
        let line = document.createElement('div');
        line.style.display = 'flex';
        line.style.alignItems = 'center';
        line.style.justifyContent = 'center';

        let img = document.createElement('img');
        img.src = 'assets/img/medal.png';
        img.style.width = '20px';
        img.style.height = '20px';
        img.style.marginRight = '5px';

        let text = document.createTextNode(body.join(' '));
        line.appendChild(img);
        line.appendChild(text);

        content.appendChild(line);
      });

      tooltipEl.innerHTML = '';
      tooltipEl.appendChild(content);
    }

    let { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;
    tooltipEl.style.opacity = 1;
    tooltipEl.style.left = `${positionX + tooltip.caretX}px`;
    tooltipEl.style.top = `${positionY + tooltip.caretY}px`;
    tooltipEl.style.font = tooltip.options.bodyFont.string;
  }


}
