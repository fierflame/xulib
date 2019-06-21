export type EventListener = (...args: any[]) => void;
let event: Event;
class Event{

	static emit(eventName: string, ...args: any[]): void { return event.emit(eventName, ...args); }
	static names(): string[] {return event.names(); }
	static listenerCount(eventName: string): number { return event.listenerCount(eventName); }
	static listeners(eventName: string): Array<EventListener> { return event.listeners(eventName);}
	static addListener(eventName: string, listener: EventListener): void { return event.addListener(eventName, listener); }
	static prependListener(eventName: string, listener: EventListener): void { return event.prependListener(eventName, listener);}
	static once(eventName: string, listener: EventListener): void { return event.once(eventName, listener);}
	static prependOnceListener(eventName: string, listener: EventListener): void { return event.prependOnceListener(eventName, listener);}
	static removeListener(eventName: string, listener: EventListener): void { return event.removeListener(eventName, listener);}
	static removeAllListeners(eventName?: string): void { return event.removeAllListeners(eventName);}
	static on(eventName: string, listener: EventListener): void { return event.on(eventName, listener);}
	static off(eventName: string, listener: EventListener): void { return event.off(eventName, listener);}

	_linsters: { [key: string]: [EventListener, boolean?][]} = {};
	constructor() {
		this._linsters = {};
	}

	emit(eventName: string, ...args: any[]): void {
		let list = this._linsters[eventName];
		if (!list) {return ;}
		for (let i = 0, l = list.length; i < l;) {
			let [listener, once] = list[i];
			try {listener(...args);}catch(e){}
			if (once) { list.splice(i, 1); l--; }
			else { i++; }
		}
		if (!list.length) {delete this._linsters[eventName];}
	}

	names(): string[] {
		return Object.keys(this._linsters);
	}
	listenerCount(eventName: string): number {
		let list = this._linsters[eventName];
		return list ? list.length : 0;
	}
	listeners(eventName: string): Array<EventListener> {
		let list = this._linsters[eventName];
		if (!list) {return [];}
		return list.map(([listener]) => listener);
	}
	addListener(eventName: string, listener: EventListener): void {
		if (typeof listener !== 'function') { return; }
		let list = this._linsters[eventName];
		if (!list) {list = this._linsters[eventName] = [];}
		list.push([listener]);
	}
	prependListener(eventName: string, listener: EventListener): void {
		if (typeof listener !== 'function') { return; }
		let list = this._linsters[eventName];
		if (!list) {list = this._linsters[eventName] = [];}
		list.unshift([listener]);
	}
	once(eventName: string, listener: EventListener): void {
		if (typeof listener !== 'function') { return; }
		let list = this._linsters[eventName];
		if (!list) {list = this._linsters[eventName] = [];}
		list.push([listener, true]);
	}
	prependOnceListener(eventName: string, listener: EventListener): void {
		if (typeof listener !== 'function') { return; }
		let list = this._linsters[eventName];
		if (!list) {list = this._linsters[eventName] = [];}
		list.unshift([listener, true]);
	}
	removeListener(eventName: string, listener: EventListener): void {
		if (typeof listener !== 'function') { return; }
		let list = this._linsters[eventName];
		if (!list) {return ;}
		for (let i = 0, l = list.length; i < l; i++) {
			if (list[i][0] === listener) {
				list.splice(i, 1);
				break;
			}
		}
		if (!list.length) {delete this._linsters[eventName];}
	}
	removeAllListeners(eventName?: string): void {
		if (!eventName) { this._linsters = {}; }
		else { delete this._linsters[eventName]; }
	}
	on(eventName: string, listener: EventListener): void {
		return this.addListener(eventName, listener);
	}
	off(eventName: string, listener: EventListener): void {
		return this.removeListener(eventName, listener);
	}
}

event = new Event;
export default Event;
