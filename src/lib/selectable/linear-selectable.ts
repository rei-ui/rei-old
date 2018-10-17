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
    wrapStart: boolean;
    wrapEnd: boolean;
    canMoveBack: boolean;

    direction: Direction;

    __selectedElement: Element | null;

    constructor() {
      super();

      this.wrapStart = false;
      this.wrapEnd = false;
      this.canMoveBack = false;

      this.direction = Direction.Horizontal;

      this.__selectedElement = null;
    }

    get selectedElement(): Element | null {
      return this.__selectedElement;
    }

    // Selectable methods

    select(element?: Element): void {
      let selected = this._selectInternal(element);

      // If there was no preference from onSelect then just get the first
      // selectable element from the container
      if (selected === null) {
        selected = this.__getSelectedElement();

        if (selected === null) {
          return;
        }
      }

      this.__selectElement(selected);
    }

    left(): void {
      const selected = (this.direction === Direction.Horizontal) ? this.__previous() : false;

      if ((!selected) && (isSelectable(this.parentElement))) {
        this.parentElement.left();
      }
    }

    right(): void {
      const selected = (this.direction === Direction.Horizontal) ? this.__next() : false;

      if ((!selected) && (isSelectable(this.parentElement))) {
        this.parentElement.right();
      }
    }

    up(): void {
      const selected = (this.direction === Direction.Vertical) ? this.__previous() : false;

      if ((!selected) && (isSelectable(this.parentElement))) {
        this.parentElement.up();
      }
    }

    down(): void {
      const selected = (this.direction === Direction.Vertical) ? this.__next() : false;

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
      this.__selectedElement = null;
    }

    // LinearSelectable methods

    _selectInternal(_?: Element): Element | null {
      return null;
    }

    // Private methods

    __previous(): boolean {
      const current = this.__getSelectedElement();

      if (current == null) {
        return false;
      }

      let previous = current.previousElementSibling;

      while ((previous !== null) && (!canSelectElement(previous))) {
        previous = previous.previousElementSibling;
      }

      return previous !== null ? this.__selectElement(previous) : false;
    }

    __next(): boolean {
      const current = this.__getSelectedElement();

      if (current == null) {
        return false;
      }

      let next = current.nextElementSibling;

      while ((next !== null) && (!canSelectElement(next))) {
        next = next.nextElementSibling;
      }

      return next !== null ? this.__selectElement(next) : false;
    }

    __selectElement(element: Element): boolean {
      const previous = this.__selectedElement;
      this.__selectedElement = element;

      if (isSelectable(element)) {
        element.select((previous !== null) ? previous : undefined);
      } else {
        fireSelectionEvent(element);
      }

      return true;
    }

    __getSelectedElement(): Element | null {
      const current = this.__selectedElement;

      if (current !== null) {
        return current;
      }

      return this.children.item(0);
    }
  };
};

export const LinearSelectableMixin = dedupingMixin(linearSelectable);
