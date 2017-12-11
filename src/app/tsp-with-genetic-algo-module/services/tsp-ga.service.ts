import { Injectable } from '@angular/core';
import { Chromosome } from '../data-models/chromosome';
import { DistanceService } from './distance.service';
import { MutationService } from './mutation.service';
import { CrossOverService } from './crossover.service';
import { FitnessService } from './fitness.service';

@Injectable()
export class TSPGAService {

    constructor(
        private fitness: FitnessService,
        private crossOver: CrossOverService,
        private mutation: MutationService) {

            this.mutation.setMutationRate(0.2);
    }

    public calculateFitness(chromosome: Chromosome) {
        let fitness = this.fitness.calculateFitness(chromosome);
        return (chromosome.fitness = fitness);
    };

    public crossover(first: Chromosome, second: Chromosome): Chromosome {
        return this.crossOver.getChild(first, second);
    }

    public mutate(chromosome: Chromosome) {
        return this.mutation.mutate(chromosome);
    }

    public forceMutate(chromosome: Chromosome) {
        return this.mutation.forceMutate(chromosome);
    }
}