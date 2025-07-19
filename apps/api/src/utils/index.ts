export const simulateProcessing = (ms = 100) =>
	new Promise(resolve => setTimeout(() => resolve(null), ms));
