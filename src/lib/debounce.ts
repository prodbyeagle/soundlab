/**
 * Creates a debounced function that delays invoking the provided function until after
 * the specified wait time has elapsed since the last time the debounced function was invoked.
 *
 * @param func - The function to debounce.
 * @param wait - The number of milliseconds to delay.
 * @returns A new debounced function.
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
	func: T,
	wait: number
) {
	let timeout: ReturnType<typeof setTimeout>;
	return function (...args: Parameters<T>) {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			func(...args);
		}, wait);
	};
}
