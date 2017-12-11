import { Injectable } from '@angular/core';
import { RandomService } from '../../shared/services/random.service';
import { Population } from '../data-models/population';
import { Chromosome } from '../data-models/chromosome';

@Injectable()
export class RouletteService {

    private normalizedFitness: number[];

    constructor(private rnd: RandomService) {

    }

    normalizeFitness(population: Population) {
        this.normalizedFitness = [];

        let total = population.chromosomes.reduce((prev, cur) => prev + cur.fitness, 0);

        for (let i = 0, n = population.chromosomes.length; i < n; i++) {
            this.normalizedFitness.push(population.chromosomes[i].fitness / total);
        }
        
        //console.log(this.normalizedFitness);
    }

    select(population: Population): Chromosome {
        let value = this.rnd.next();

        let current = 0;
        for (let i = 0, n = population.length; i < n; i++) {
            current += this.normalizedFitness[i];
            if (current >= value) {
                return population.chromosomes[i];
            }
        }

        throw new TypeError("Couldn't select a parent from the population");
    }

}