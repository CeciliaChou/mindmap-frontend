import {Directive, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import {Router} from "@angular/router";
import {MindmapService} from "./mindmap.service";

@Directive({
  selector: '[appParseLinks]'
})
export class ParseLinksDirective {

  @Input('appParseLinks') set text(v: string) {
    this.el.nativeElement.innerHTML = v.replace(/\[(.*?)]\((.*?)\)/g,
      '<a bind-target="$2">$1</a>');
    const elements = this.el.nativeElement.getElementsByTagName('a');
    for (let i = 0; i < elements.length; i++) {
      const elem = elements[i];
      const bindTarget = elem.getAttribute('bind-target');
      elem.addEventListener('click', (target) => this.clickTarget(target, bindTarget))
    }
  }

  @Output() anchorClick = new EventEmitter();

  constructor(
    private el: ElementRef<HTMLElement>,
  ) {
  }

  clickTarget(target, bindTarget) {
    this.anchorClick.emit(bindTarget)
  }

}
