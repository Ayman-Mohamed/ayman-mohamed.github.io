import { Chromosome } from "./chromosome";

export class Population {

    public chromosomes: Chromosome[];

    constructor() {
        this.chromosomes = [];
    }

    get length() {
        return this.chromosomes.length;
    }

    public push(chromosome: Chromosome) {
        this.chromosomes.push(chromosome);
    }
}