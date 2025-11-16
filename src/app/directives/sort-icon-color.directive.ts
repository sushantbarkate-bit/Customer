import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
    selector: '[sortIconColor]',
})
export class SortIconColorDirective implements AfterViewInit {
    @Input() sortIconColor: any;

    constructor(private el: ElementRef) { }

    ngAfterViewInit() {
        const arrows: any = this.el.nativeElement.querySelectorAll(
            '.mat-sort-header-arrow'
        );
        arrows.forEach((arrow: any) => (arrow.style.color = this.sortIconColor));
    }
}
