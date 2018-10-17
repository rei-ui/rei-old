/**
 * @license
 * Copyright (c) 2018 The Rei Project Authors. All rights reserved.
 * Please see the AUTHORS file for details. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be found in
 * the LICENSE file.
 */

/**
 * An interface for implementing selection on a 10 foot UI.
 *
 * Movement can happen in three directions, horizontally, vertically, and
 * through an explicit back command. These correspond to the input of a
 * gamepad or TV remote control.
 */
export interface Selectable {
  /**
   * The currently selected element.
   */
  readonly selectedElement: Element | null;

  /**
   * Whether the selectable area allows wrapping from the first element.
   *
   * If wrapStart is `true` then it is possible to move from the first
   * element within the container to the last element within it.
   */
  readonly wrapStart: boolean;

  /**
   * Whether the selectable area allows wrapping from the last element.
   *
   * If wrapEnd is `true` then it is possible to move from the last element
   * within the container to the first element within it.
   */
  readonly wrapEnd: boolean;

  /** Whether the selectable area responds to the back command. */
  readonly canMoveBack: boolean;

  /**
   * Enters the selectable area.
   */
  select(element?: Element): void;

  /**
   * Exits the selectable area.
   *
   * The back method is used for when the user needs to exit a selectable
   * area. This is useful for when the selection area needs to be constrained
   * within a component.
   */
  back(): void;

  /** Moves the selection up. */
  up(): void;

  /** Moves the selection down. */
  down(): void;

  /** Moves the selection to the left. */
  left(): void;

  /** Moves the selection to the right. */
  right(): void;

  /**  Resets the selection. */
  resetSelection(): void;
}

/**
 * Determines if the object is an instance of Selectable.
 *
 * @param object The object to check.
 */
export function isSelectable(object: any): object is Selectable {
  return 'select' in object;
}
