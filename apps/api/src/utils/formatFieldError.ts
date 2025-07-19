import type { FieldError } from '@repo/validation';
import { z } from 'zod';

export function formatFieldError(error: z.ZodError): FieldError[] {
	const fieldErrors: FieldError[] = [];
	const errorMap: Record<string, string[]> = {};
	error.issues.forEach(value => {
		if (value.code === 'unrecognized_keys') return;
		let path: string;
		let message = value.message;
		if (Array.isArray(value.path)) {
			const firstPath = value.path[0] ?? '';
			path = firstPath.toString();

			if (value.path.length >= 2) {
				message = `${message} (at index ${value.path[1]?.toString()})`;
			}
		} else {
			path = value.path;
		}
		errorMap[path] ??= [];
		errorMap[path]?.push(message);
	});

	Object.entries(errorMap).forEach(([key, value]) => {
		fieldErrors.push({ error: value, field: key });
	});
	return fieldErrors;
}
