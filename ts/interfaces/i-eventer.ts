/**
 * IEventer describes publication / subscribe pattern for classes
 */
export interface IEventer {

  /**
   * Subscribe to an event
   */
  on: (event: string, callback: () => void) => void;

  /**
   * Unsubscribe to an event
   */
  off: (event: string, callback?: () => void) => void;

  /**
   * Trigger specific event
   */
  trigger: (event: string, ...args) => void;
}