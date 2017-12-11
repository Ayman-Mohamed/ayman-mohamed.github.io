import { Injectable } from '@angular/core';
import { City } from '../data-models/city';
import { IndexOutOfBoundsError } from '../../shared/errors/index-out-of-bounds';

@Injectable()
export class DistanceService {

    private distanceTable: number[][];
    private numberOfCities: number;

    constructor() {
        this.distanceTable = [];
    }

    public registerCities(cities: City[]) {
        let n = cities.length;

        this.numberOfCities = n;
        this.distanceTable = [];
        
        for (let i = 0; i < n; i++) {
            this.distanceTable.push([]);
            for (let j = 0; j < n; j++) {
                this.distanceTable[i].push(this.cityDistance(cities[i], cities[j]));
            }
        }

    }

    public distanceByIndex(indexA: number, indexB: number): number {
        if (indexA < 0 || indexA >= this.numberOfCities) {
            throw new IndexOutOfBoundsError(`Index ${indexA} is out of bounds. Number of Cities = ${this.numberOfCities}`);
        }

        if (indexB < 0 || indexB >= this.numberOfCities) {
            throw new IndexOutOfBoundsError(`Index ${indexB} is out of bounds. Number of Cities = ${this.numberOfCities}`);
        }

        return this.distanceTable[indexA][indexB];
    }

    public cityDistance(first: City, second: City) {
        return this.distance(first.x, first.y, second.x, second.y);
    }

    public distance(x1: number, y1: number, x2: number, y2: number) {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    }
}