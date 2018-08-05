/**
 * @license
 * Copyright (c) 2018 The Rei Project Authors. All rights reserved.
 * Please see the AUTHORS file for details. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be found in
 * the LICENSE file.
 */

import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin';

import { Selectable, isSelectable } from './selectable';
import { fireSelectionEvent } from './events';

export function canSelectElement(element: Element) {
  return element !== null;
}

export enum Direction {
  /** Moves horizontally either left or right. */
  Horizontal = 'horizontal',
  /** Moves vertically either up or down. */
  Vertical = 'vertical'
}

/**
 * A selectable area that moves in a single direction.
 */
export interface LinearSelectable {
  /** The direction that the selection moves in. */
  readonly direction: Direction;
}

export interface HTMLElementConstructor {
  new(): HTMLElement;
}

const linearSelectable = (base: HTMLElementConstructor) => {
  return class extends base implements HTMLElement, Selectable, LinearSelectable {
    selectedElement?: Element;
    wrapStart: boolean;
    wrapEnd: boolean;
    canMoveBack: boolean;

    direction: Direction;

    __selectedElement?: Element;

    constructor() {
      super();

      this.wrapStart = false;
      this.wrapEnd = false;
      this.canMoveBack = false;
      
      this.direction = Direction.Horizontal;
    }

    // Selectable methods

    select(element?: Element): void {
      var selected = this._selectInternal(element);

      // If there was no preference from onSelect then just get the first
      // selectable element from the container
      if (!selected) {
        selected = this.__getSelectedElement();
      }

      this.__selectElement(selected);
    }

    left(): void {
      var selected = (this.direction == Direction.Horizontal) ? this.__previous() : false;
    
      if ((!selected) && (isSelectable(this.parentElement))) {
        this.parentElement.left();
      }
    }
    
    right(): void {
      let selected = (this.direction == Direction.Horizontal) ? this.__next() : false;
    
      if ((!selected) && (isSelectable(this.parentElement))) {
        this.parentElement.right();
      }
    }
    
    up(): void {
      let selected = (this.direction == Direction.Vertical) ? this.__previous() : false;
    
      if ((!selected) && (isSelectable(this.parentElement))) {
        this.parentElement.up();
      }
    }
    
    down(): void {
      let selected = (this.direction == Direction.Vertical) ? this.__next() : false;
    
      if ((!selected) && (isSelectable(this.parentElement))) {
        this.parentElement.down();
      }    
    }

    back(): void {
      if (this.canMoveBack) {
        this.__previous();
      } else if (isSelectable(this.parentElement)) {
        this.parentElement.back();
      }
    }
    
    resetSelection(): void {
      this.__selectedElement = undefined;
    }    

    // LinearSelectable methods

    _selectInternal(element?: Element): Element | undefined {
      return element;
    }

    // Private methods

    __previous(): boolean {
      var previous = this.__getSelectedElement().previousElementSibling;

      while ((previous !== null) && (!canSelectElement(previous))) {
        previous = previous.previousElementSibling;
      }

      return previous !== null ? this.__selectElement(previous) : false;
    }

    __next(): boolean {
      var next = this.__getSelectedElement().nextElementSibling;

      while ((next !== null) && (!canSelectElement(next))) {
        next = next.nextElementSibling;
      }

      return next !== null ? this.__selectElement(next) : false;
    }

    __selectElement(element: Element): boolean {
      let previous = this.__selectedElement;
      this.__selectedElement = element;

      if (isSelectable(element)) {
        element.select(previous);
      } else {
        fireSelectionEvent(element);
      }

      return true;
    }

    __getSelectedElement(): Element {
      return this.__selectedElement !== undefined ? this.__selectedElement : this.children.item(0);
    }    
  }
}

export const LinearSelectableMixin = dedupingMixin(linearSelectable);
