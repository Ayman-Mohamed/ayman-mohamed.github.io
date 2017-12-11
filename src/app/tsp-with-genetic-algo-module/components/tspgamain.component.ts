import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { TSPGAService } from '../services/tsp-ga.service';
import { RandomService } from '../../shared/services/random.service';
import { Title } from '@angular/platform-browser';
import { City } from '../data-models/city';
import { TSPGAConfiguration } from '../configuration/tsp-ga.configuration';
import { Chromosome } from '../data-models/chromosome';
import { Gene } from '../data-models/gene';
import { UtilityService } from '../services/utility.service';
import { Population } from '../data-models/population';
import { RouletteService } from '../services/roulette.service';
import { DistanceService } from '../services/distance.service';
import { EnhancedCanvasComponent } from '../../shared/components/enhanced-canvas/enhanced-canvas.component';
import { NotImplementedError } from '../../shared/errors/NotImplementedError';

@Component({
    selector: 'tsp-ga',
    templateUrl: 'tspgamain.component.html',
    providers: [TSPGAService]
})
export class TSPGAMainComponent implements AfterViewInit {
    @ViewChild(EnhancedCanvasComponent) canvas: EnhancedCanvasComponent;

    cities: City[];
    population: Population;
    width: number = 700;
    height: number = 500;

    populationSize: number;
    numberOfCities: number;

    bestGene: Chromosome;
    bestLocalGene: Chromosome;
    bestFitness: number = 0;
    bestLocalFitness: number;
    currentGeneration: number = 0;
    lastFitnessCount: number;


    constructor(private title: Title,
        private tspSrv: TSPGAService,
        private rnd: RandomService,
        private distance: DistanceService,
        private roulette: RouletteService,
        private util: UtilityService
    ) {

        title.setTitle("TSP With Genetic Algorithm");

    }

    ngAfterViewInit() {
        this.canvas.clear();

        this.start();
    }

    start() {
        this.initialize();

        let n = 500;

        let k = () => {
            this.run();
            setTimeout(() => {
                if (n--) k();
            }, 1);
        }

        k();
    }

    run() {
        this.calculateFitness();
        this.runGeneration();
    }

    initialize() {
        this.bestGene = undefined;
        this.bestLocalGene = undefined;
        this.bestFitness = 0;
        this.bestLocalFitness = 0;
        this.currentGeneration = 0;
        this.lastFitnessCount = 0;

        this.cities = [];
        this.populationSize = TSPGAConfiguration.populationSize;
        this.numberOfCities = TSPGAConfiguration.numberOfCities;

        let order = [];

        for (let i = 0; i < this.numberOfCities; i++) {
            this.cities[i] = new City(this.rnd.next(10, this.width - 10), this.rnd.next(10, this.height - 10));
            order[i] = i;
        }

        this.distance.registerCities(this.cities);

        this.population = new Population();
        for (let i = 0; i < this.populationSize; i++) {
            let chromosome = new Chromosome();
            chromosome.genes = this.util.shuffleArray(order.map(x => new Gene(x)));
            this.population.push(chromosome);
        }

    }

    runGeneration() {
        this.currentGeneration++;

        let newPop = new Population();
        if (this.bestGene) {
            newPop.push(this.bestGene.clone());

            let x = this.bestGene.clone();
            this.tspSrv.forceMutate(x);
            newPop.push(x.clone());

            this.tspSrv.forceMutate(x);
            newPop.push(x.clone());
            newPop.push(x);
        }

        while (newPop.length < this.populationSize) {
            let first = this.roulette.select(this.population);
            let second = this.roulette.select(this.population);
            let child = this.tspSrv.crossover(first, second);

            this.tspSrv.mutate(child);

            newPop.push(child);
        }

        this.population = newPop;
    }

    calculateFitness() {

        for (let i = 0; i < this.populationSize; i++) {
            this.tspSrv.calculateFitness(this.population.chromosomes[i])
        }

        this.population.chromosomes.sort((a, b) => {
            return b.fitness - a.fitness;
        });

        this.bestLocalGene = this.population.chromosomes[0].clone();
        this.bestLocalFitness = this.bestLocalGene.fitness;

        this.roulette.normalizeFitness(this.population);

        this.checkGeneratinoResults();
    }

    checkGeneratinoResults() {
        if (this.bestFitness < this.bestLocalFitness) {
            this.bestFitness = this.bestLocalFitness;
            this.bestGene = this.bestLocalGene;
            console.log('new best at gen ' + this.currentGeneration + '. f = ' + this.bestFitness);
            // write('log', 'Best at generation ' + currentGen);
            this.canvas.draw(this.cities, this.bestGene.genes.map(x => x.value));
            this.lastFitnessCount = 1;
        } else {
            this.lastFitnessCount++;
        }
    }
}
