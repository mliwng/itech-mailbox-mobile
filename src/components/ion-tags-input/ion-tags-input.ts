import {
  Component,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
  HostListener,
  OnInit,
  ViewChild,
  forwardRef
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from "@angular/forms";

import {Platform} from 'ionic-angular';
/**
 * Generated class for the IonTagsInput directive.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/DirectiveMetadata-class.html
 * for more info on Angular Directives.
 */

export const CITY_PICKER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => IonTagsInput),
  multi: true
};

@Component({
  selector: 'ion-tags-input',
  providers: [CITY_PICKER_VALUE_ACCESSOR],
  template: `
    <div [class]="'ion-tags-input tit-border-color '  + (readonly ? 'readonly' : color)" [class.active]="_isFocus">
      <div class="iti-tags-wrap" #tags>
        <span *ngFor="let tag of _tags; let $index = index;"
              [class]="'iti-tag iti-tag-color ' + color + ' iti-tag-' + mode">
          <table style="width:100%">
            <tbody>
            <tr>
              <td [class]="'tag_nowrap'">{{tag.display}}</td>
              <td style="text-align: right;padding-left: 5px">
                <a [hidden]="hideRemove || readonly"
                   class="iti-tag-rm"
                   (click)="btnRemoveTag($index)"></a></td>
            </tr>
            </tbody>
          </table>
       </span>
      </div>
      <input #tagsInput
             [hidden]="readonly"
             [disabled]="readonly"
             class="iti-input" [type]="type"
             [placeholder]="placeholder"
             [(ngModel)]="_editTag"
             (blur)="_blur()"
             (focus)="_focus()"
             (keyup.backspace)="keyRemoveTag($event); false"
             (keyup)="separatorStrAddTag()"
             (keyup.enter)="keyAddTag()">
    </div>
  `
})
export class IonTagsInput implements ControlValueAccessor, OnInit {

  _editTag: string = '';
  _tags: Array<{ id: string, display: string, type: number }> = [];
  _isFocus: boolean = false;
  _onChanged: Function;
  _onTouched: Function;
  _colors = ['#4a8bfc', '#32db64', '#f53d3d', '#ffc125', '#767676', '#7e60ff', '#222', '#bcbcbc'];

  @ViewChild('tagsInput') input: any;
  @ViewChild('tags') tags: any;

  @Input() mode: string = '';
  @Input() readonly: boolean = false;
  @Input() color: string = '';
  @Input() hideRemove: boolean = false;
  @Input() maxTags: number = -1;

  @Input() placeholder: string = '+Tag';
  @Input() type: string = 'text';
  @Input() separatorStr: string = ',';
  @Input() once: boolean = true;
  @Input() canEnterAdd: boolean = true;
  @Input() canBackspaceRemove: boolean = true;
  @Input() verifyMethod: (tag: object) => boolean;

  @Output() onChange: EventEmitter<any> = new EventEmitter();

  constructor(public plt: Platform, public ref: ChangeDetectorRef,) {
  }

  ngOnInit(): void {
    if (this.mode === '') {
      this.plt.ready().then(() => {
        this.initMode();
        this.initRandomColor();
      })
    }
  }

  initRandomColor() {
    if (this.color !== 'random') return;
    let tagsEve = this.tags.nativeElement.children;

    for (let eve of tagsEve) {
      if (eve.style['backgroundColor'] === '') {
        eve.style['backgroundColor'] = this.getRandomColor()
      }
    }
  }

  addRandomColor() {
    if (this.color !== 'random') return;
    let tagsEve = this.tags.nativeElement.children;
    tagsEve[tagsEve.length - 1].style['backgroundColor'] = this.getRandomColor()
  }

  keyAddTag(): any {

    let tagStr = this._editTag.trim();
    let tag = {id: tagStr, display: tagStr, type: 0};
    if (!this.canEnterAdd) return;
    if (!this.verifyTag(tag)) return;
    if (!this.isOnce(tag)) {
      this._editTag = '';
      return;
    }
    this.pushTag(tag);
  }

  separatorStrAddTag(): any {
    const lastIndex: number = this._editTag.length - 1;
    let tagStr: string = '';
    if (!this.separatorStr) return;

    if (this._editTag[lastIndex] === this.separatorStr) {
      tagStr = this._editTag.split(this.separatorStr)[0].trim();
      let tag = {id: tagStr, display: tagStr, type: 0};
      if (this.verifyTag(tag) && this.isOnce(tag)) {
        this.pushTag(tag);
      } else {
        this._editTag = '';
      }
    }
  }

  keyRemoveTag(): any {
    if (!this.canBackspaceRemove) return;
    if (this._editTag === '') {
      this.removeTag(-1);
      this._editTag = '';
    }
  }

  btnRemoveTag($index: number): any {
    this.removeTag($index);
  }

  verifyTag(tag: object): boolean {
    if (typeof this.verifyMethod === 'function') {
      if (!this.verifyMethod(tag)) {
        this._editTag = '';
        return false;
      } else {
        return true;
      }
    }

    if (!tag) {
      this._editTag = '';
      return false;
    } else {
      return true;
    }
  }

  pushTag(tag: { id: string, display: string, type: number }): any {
    if (this.maxTags !== -1 && this._tags.length >= this.maxTags) {
      this._editTag = '';
      return;
    }
    this._tags.push(tag);
    this.ref.detectChanges();
    this.addRandomColor();
    this.onChange.emit(this._tags);

    this._editTag = '';
  }

  removeTag($index: number): any {
    if (this._tags.length > 0) {
      if ($index === -1) {
        this._tags.pop();
        this.onChange.emit(this._tags);
      } else if ($index > -1) {
        this._tags.splice($index, 1);
        this.onChange.emit(this._tags);
      }
    }
  }

  isOnce(tag: object): boolean {
    if (!this.once) return true;
    const tags: Array<{ id: string, display: string, type: number }> = this._tags;
    return tags.every((e: object): boolean => {
      return e['id'] !== tag['id']
    })
  }

  @HostListener('click', ['$event'])
  private _click(ev: UIEvent): any {
    this.input.nativeElement.focus();
    this._isFocus = true;
    ev.preventDefault();
    ev.stopPropagation();
  }

  private _blur(): any {
    this.input.nativeElement.blur();
    this._isFocus = false;
  }

  private _focus(): any {
    if (!this._isFocus) {
      this._isFocus = true;
    }
  }

  writeValue(val: any): void {
    this._tags = val;
  }

  registerOnChange(fn: any): void {
    this._onChanged = fn;
    this.setValue(this._tags);
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  private setValue(val: any): any {
    this._tags = val;
    if (this._tags) {
      this._onChanged(this._tags);
    }
  }

  private initMode(): any {
    this.mode = this.plt.is('ios') ? 'ios' : this.plt.is('android') ? 'md' : this.plt.is('windows') ? 'mp' : '';
  }

  private getRandomColor() {
    const max = this._colors.length + 1;
    let index = Math.floor(Math.random() * max);
    return this._colors[index]
  }

}
