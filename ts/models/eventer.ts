/**
 * Eventer is a Pub/Sub class to handle events
 */
export default class Eventer {

  /**
   * hash of current events
   */
  private _eventHash: any = {
    length: 0
  };

  /**
   * Number of listeners attached to object
   */
  get listenerCount(): number {
    return this._eventHash.length;
  }

  /**
   * Subscribe to an event
   */
  public on(event: string, callback: Function, useCapture: boolean = false): void {
    let callbacks = this._eventHash[event];
    if ( typeof callbacks === 'undefined' ) {
      callbacks = this._eventHash[event] = [];
    }
    if ( useCapture ) {
      callbacks.unshift(callback);
    }
    else {
      callbacks.push(callback);
    }
    this._eventHash.length += 1;
  }

  /**
   * Unsubscribe to an event
   * specifying an event will remove callback listening for that event
   * specifying a callback will only remove the event with that callback
   */
  public off(event?: string, callback?: Function): void {
    if ( event ) {
      var callbacks: Function[] = this._eventHash[event];
      if ( callback && callbacks ) {
        var i: number = 0;
        var len: number = callbacks.length;
        for ( i; i < len; i++ ) {
          if ( callback === callbacks[i] ) {
            callbacks.splice(i,1);
            this._eventHash.length -= 1;
          }
        }
      }
      else {
        this._eventHash.length -= this._eventHash[event].length;
        delete this._eventHash[event];
      }
    }
    else {
      this._eventHash = { length: 0 };
    }
  }

  /**
   * invoke callbacks associated with the event
   * pass arbitrary lenght of parameters to callbacks
   */
  public trigger(event: string, ...args): void {
    var callbacks = this._eventHash[event];
    var propagate: boolean = true;
    if ( callbacks ) {
      var i: number = 0;
      var len: number = callbacks.length;
      for ( i; i < len; i++ ) {
        let callback = callbacks[i];
        if (callback && propagate) {
          var triggeredEvent = new Event(event);
          args.unshift(triggeredEvent);
          triggeredEvent.stopPropagation = function() {
            propagate = false;
          };
          callback.apply(this, args);
        }
      }
    }
  }
}
