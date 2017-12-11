import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TSPGAMainComponent } from './components/tspgamain.component';
import { TSPGARouting } from './tsp-with-genetic-algo.routes';
import { RouterModule } from '@angular/router';
import { TSPGAService } from './services/tsp-ga.service';
import { SharedModule } from '../shared/shared.module';
import { LinkedListService } from './services/linkedlist.data-structure';
import { MutationService } from './services/mutation.service';
import { CrossOverService } from './services/crossover.service';
import { FitnessService } from './services/fitness.service';
import { DistanceService } from './services/distance.service';
import { RandomService } from '../shared/services/random.service';
import { RouletteService } from './services/roulette.service';
import { UtilityService } from './services/utility.service';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        SharedModule,

        TSPGARouting
    ],
    declarations: [
        TSPGAMainComponent
    ],
    providers: [
        TSPGAService,
        LinkedListService,
        MutationService,
        CrossOverService,
        FitnessService,
        RouletteService,
        DistanceService,
        UtilityService,
        {
            provide: RandomService, useFactory: () => {
                let rnd = new RandomService();
                // rnd.seed(0);
                return rnd;
            }
        }
    ]
})
export class TSPGAModule { }
