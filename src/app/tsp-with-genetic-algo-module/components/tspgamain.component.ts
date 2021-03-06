import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { TSPGAConfiguration } from '../configuration/tsp-ga.configuration';
import { RandomService } from '../../shared/services/random.service';
import { Population, City, Gene, Chromosome } from '../data-models/index';
import { UtilityService } from '../services/utility.service';
import { SelectionService } from '../services/selection.service';
import { DistanceService } from '../services/distance.service';
import { EnhancedCanvasComponent } from '../../shared/components/enhanced-canvas/enhanced-canvas.component';
import { NotImplementedError } from '../../shared/errors/index';
import { MutationService } from '../services/mutation.service';
import { FitnessService } from '../services/fitness.service';
import { CrossOverService } from '../services/crossover.service';

@Component({
    selector: 'tsp-ga',
    templateUrl: 'tspgamain.component.html',
    styles: [
        `
        input[type='number'] {
            max-width: 80px;
        }
        `
    ]
})
export class TSPGAMainComponent implements AfterViewInit {
    @ViewChild(EnhancedCanvasComponent) canvas: EnhancedCanvasComponent;

    cities: City[];
    population: Population;
    width: number = 575;
    height: number = 575;

    stopAfter: number = 200;
    bestGeneration: number = -1;

    populationSize: number;
    numberOfCities: number;
    mutationRate: number;

    bestGene: Chromosome;
    bestLocalGene: Chromosome;
    bestFitness: number = 0;
    bestLocalFitness: number;
    currentGeneration: number = 0;
    lastFitnessCount: number;
    isRunning: boolean = false;

    get mutationCount() {
        return this.mutation.count;
    }

    constructor(private title: Title,
        private crossOver: CrossOverService,
        private rnd: RandomService,
        private fitness: FitnessService,
        private mutation: MutationService,
        private distance: DistanceService,
        private selection: SelectionService,
        private util: UtilityService
    ) {
        title.setTitle("TSP with Genetic Algorithm");
        this.populationSize = TSPGAConfiguration.populationSize;
        this.numberOfCities = TSPGAConfiguration.numberOfCities;
        this.mutationRate = TSPGAConfiguration.mutationRate;
    }

    ngAfterViewInit() {
        this.canvas.clear();
        setTimeout(() => {
            this.start();
        }, 2);
    }

    start() {
        if (this.isRunning) {
            this.isRunning = false;
        } else {
            this.isRunning = true;
            this.initialize();

            let k = () => {
                this.run();
                setTimeout(() => {
                    if (this.isRunning) k();
                    else this.isRunning = false;
                }, 1);
            }
            k();
        }
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
        this.mutation.count = 0;
        this.bestGeneration = -1;

        this.mutation.setMutationRate(this.mutationRate);

        this.cities = [];
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

        let newPopulation = new Population();
        if (this.bestGene) {
            newPopulation.push(this.bestGene.clone());

            let x = this.bestGene.clone();
            this.mutation.forceMutate(x);
            newPopulation.push(x.clone());

            this.mutation.forceMutate(x);
            newPopulation.push(x.clone());
            newPopulation.push(x);
        }

        while (newPopulation.length < this.populationSize) {
            let first = this.selection.tournament(this.population);
            let second = this.selection.tournament(this.population);
            let child = this.crossOver.getChild(first, second);

            this.mutation.mutate(child);
            newPopulation.push(child);
        }

        this.population = newPopulation;
    }

    calculateFitness() {
        this.population.chromosomes.map(ch => {
            ch.fitness = this.fitness.calculateFitness(ch);
        });

        this.population.sort();
        this.population.takeTop(this.populationSize);

        this.bestLocalGene = this.population.top;
        this.bestLocalFitness = this.bestLocalGene.fitness;

        this.selection.normalizeFitness(this.population);

        this.checkGeneratinoResults();
    }

    checkGeneratinoResults() {
        if (this.bestFitness < this.bestLocalFitness) {
            this.bestFitness = this.bestLocalFitness;
            this.bestGene = this.bestLocalGene;
            this.bestGeneration = this.currentGeneration;
            this.canvas.draw(this.cities, this.bestGene.genes.map(x => x.value));
            this.lastFitnessCount = 1;
        } else {
            this.lastFitnessCount++;

            if (this.lastFitnessCount >= this.stopAfter) {
                this.isRunning = false;
            }
        }
    }
}
