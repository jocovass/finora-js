export const app = { name: 'finora' };

class Car {
	model: string;
	year: number;
	constructor() {
		this.model = 'Audi';
		this.year = 2025;
	}
}

export const car = new Car();
