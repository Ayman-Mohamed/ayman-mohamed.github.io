import { Injectable } from '@angular/core';
import { LinkedListService } from './linkedlist.data-structure';
import { MutationService } from './mutation.service';
import { Chromosome } from '../data-models/chromosome';
import { RandomService } from '../../shared/services/random.service';
import { Gene } from '../data-models/gene';
import { DistanceService } from './distance.service';

@Injectable()
export class CrossOverService {

    constructor(
        private mutation: MutationService,
        private distance: DistanceService,
        private rnd: RandomService) {
    }

    public getChild(first: Chromosome, second: Chromosome): Chromosome {
        return this.getChildByLookingForward(first, second);
    }

    private getChildByLookingForward(x: Chromosome, y: Chromosome): Chromosome {
        let count = x.length;
        let xlist = new LinkedListService();
        let ylist = new LinkedListService();
        let prevx = -1, prevy = -1, tmp;

        for (let i = 0; i < count; i++) {
            tmp = x.genes[i].value;
            xlist.addAfter(tmp, prevx);
            prevx = tmp;

            tmp = y.genes[i].value;
            ylist.addAfter(tmp, prevy);
            prevy = tmp;
        }

        var chr = new Chromosome();

        let c = this.rnd.next(count);
        chr.add(new Gene(c));
        var n = count;
        while (n > 1) {
            let fx = xlist.next(c);
            let fy = ylist.next(c);

            xlist.remove(c);
            ylist.remove(c);

            n--;

            var dfx = this.distance.distanceByIndex(c, fx);
            var dfy = this.distance.distanceByIndex(c, fy);

            c = dfx < dfy ? fx : fy;
            chr.add(new Gene(c));
        }

        return chr;
    }

}