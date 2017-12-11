import { Component, OnInit, Input } from '@angular/core';
import { NotImplementedError } from '../../errors/NotImplementedError';

@Component({
    selector: 'enhanced-canvas',
    templateUrl: 'enhanced-canvas.component.html',
    styles : [
        `
        canvas {
            border : 1px solid #ccc;
        }
        `
    ]
})
export class EnhancedCanvasComponent implements OnInit {

    @Input() id: string;
    @Input() width: number;
    @Input() height: number;

    private canvas: any;
    private ctx: any;

    constructor() {

    }

    ngOnInit() {

        this.canvas = document.getElementsByTagName('canvas')[0];
        this.ctx = this.canvas.getContext("2d");
    }


    rect(i, j, colr) {
        throw new NotImplementedError();
        // this.ctx.fillStyle = color || "red";
        // this.ctx.fillRect(i * SIZE, j * SIZE, SIZE, SIZE);
    }

    circle(x, y, r) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, 2 * Math.PI);
        this.ctx.stroke();
    }

    line(x1, y1, x2, y2) {
        this.ctx.beginPath();
        this.ctx.moveTo(50, 50);
        this.ctx.lineTo(100, 100);
        this.ctx.stroke();
    }

    text(x, y, i, d) {
        this.ctx.strokeText(d, x + 5, y);

        this.ctx.strokeStyle = 'black';
    }

    draw(cities, order) {
        this.clear();
        this.ctx.font = '14px serif';

        for (let i = 0, n = cities.length; i < n; i++) {
            this.circle(cities[i].x, cities[i].y, 2);
            // this.text(cities[order[i]].x, cities[order[i]].y, i, order[i]);
        }

        this.ctx.beginPath();
        this.ctx.moveTo(cities[order[0]].x, cities[order[0]].y);

        for (let i = 0, n = cities.length; i < n; i++) {
            this.ctx.lineTo(cities[order[i]].x, cities[order[i]].y);
        }

        this.ctx.lineTo(cities[order[0]].x, cities[order[0]].y);
        this.ctx.stroke();

    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
