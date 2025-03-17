export const fetchWithTimeout = async (
    resource: string, 
    options: RequestInit & { timeout?: number } = {}
): Promise<Response> => {
    const { timeout = 120000, signal, ...fetchOptions } = options; // default timeout of 120 seconds
    
    const timeoutId = setTimeout(() => {
        if (signal && !signal.aborted) {
            (signal as any).aborted = true;
            (signal as any).abort = () => {};
        }
    }, timeout);

    try {
        const response = await fetch(resource, {
            ...fetchOptions,
            signal,
        });
        return response;
    } finally {
        clearTimeout(timeoutId);
    };
};