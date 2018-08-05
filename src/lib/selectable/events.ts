/**
 * @license
 * Copyright (c) 2018 The Rei Project Authors. All rights reserved.
 * Please see the AUTHORS file for details. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be found in
 * the LICENSE file.
 */

/** The name for the selection event. */
export const selectionEvent = 'selection-changed';

/**
 * Fires a selection changed event on the element.
 *
 * @param element The element that was selected.
 */
export function fireSelectionEvent(element: Element): void {
  element.dispatchEvent(new CustomEvent(selectionEvent, {
    bubbles: true,
    cancelable: true,
    detail: element
  }));
}
