///<reference path="../../definitions/jasmine.d.ts"/>

import Eventer from 'models/eventer';
var eventer;
describe("Eventer", function() {
  beforeEach(function(){
    eventer = new Eventer();
  });

  it('should save event listeners', function(){
    var event: string = 'blah';
    var callback = function(){};
    eventer.on(event, callback);
    expect( (<any>eventer)._eventHash[event] ).toBeDefined();
    expect( (<any>eventer)._eventHash[event].length ).toEqual(1);
  });

  it('should save multiple listeners to the same event', function(){
    var event: string = 'blah';
    var callback = function(){};
    var callback2 = function(){};
    eventer.on(event, callback);
    eventer.on(event, callback2);
    expect( (<any>eventer)._eventHash[event] ).toBeDefined();
    expect( (<any>eventer)._eventHash[event].length ).toEqual(2);
  });

  it('should respect useCapture parameter', function(){
    var event: string = 'blah';
    var callback = function(){ return 0; };
    var callback2 = function(){ return 1;};
    eventer.on(event, callback);
    eventer.on(event, callback2, true);
    expect( (<any>eventer)._eventHash[event] ).toBeDefined();
    expect( (<any>eventer)._eventHash[event].length ).toEqual(2);
    expect( (<any>eventer)._eventHash[event][0] ).toEqual(callback2);
  });

  it('should remove a specific event listener', function(){
    var event: string = 'blah';
    var callback = function(){ return 0; };
    var callback2 = function(){ return 1;};
    eventer.on(event, callback);
    eventer.on(event, callback2, true);
    eventer.off(event, callback);
    expect( (<any>eventer)._eventHash[event] ).toBeDefined();
    expect( (<any>eventer)._eventHash[event].length ).toEqual(1);
    expect( (<any>eventer)._eventHash[event][0] ).toEqual(callback2);
  });

  it('should remove all listeners for a specific event', function(){
    var event: string = 'blah';
    var callback = function(){ return 0; };
    var callback2 = function(){ return 1;};
    eventer.on(event, callback);
    eventer.on(event, callback2, true);
    eventer.off(event);
    expect( (<any>eventer)._eventHash[event] ).toBeUndefined();
  });

  it('should remove all listeners for object', function(){
    var event: string = 'blah';
    var callback = function(){ return 0; };
    var callback2 = function(){ return 1;};
    eventer.on(event, callback);
    eventer.on(event + '2', callback2, true);
    eventer.off();
    expect( (<any>eventer)._eventHash ).toEqual({ length: 0 });
  });

  it('should trigger an event', function(){
    var event: string = 'blah';
    var callback = function(e){
      expect(e).toBeDefined();
    };

    eventer.on(event, callback);
    eventer.trigger(event);
  });

  it('should pass arguments with triggered event', function(){
    var event: string = 'blah';
    var callback = function(e){
      expect(e).toBeDefined();
      expect(arguments.length).toEqual(4);
      expect(arguments[3]).toEqual('awesome');
    };

    eventer.on(event, callback);
    eventer.trigger(event, 'ryan', 'is', 'awesome');
  });

  it('should stop propagation', function(){
    var event: string = 'blah';
    var callbackValue: number;
    var callback2Value: number;
    var callback = function(){
      callbackValue = Date.now();
    };
    var callback2 = function(e){
      e.stopPropagation();
      callback2Value = Date.now();
    };
    eventer.on(event, callback);
    eventer.on(event, callback2, true);

    eventer.trigger(event);
    expect(callbackValue).toBeUndefined();
  });

  it('should give a count of all listeners', function() {
    var event: string = 'blah';
    var callbackValue: number;
    var callback2Value: number;
    var callback = function(){
      callbackValue = Date.now();
    };
    var callback2 = function(e){
      e.stopPropagation();
      callback2Value = Date.now();
    };
    eventer.on(event, callback);
    eventer.on(event, callback2, true);

    expect(eventer.listenerCount).toEqual(2);
  });

});