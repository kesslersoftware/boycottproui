// src/debug/fetchLogger.ts
export function installFetchLogger() {
    // Keep the original fetch with full typing
    const origFetch: typeof fetch = (global as any).fetch;

    // Reassign fetch with a wrapper that preserves the original signature (via Parameters/ReturnType)
    (global as any).fetch = async (
        ...args: Parameters<typeof fetch>
    ): Promise<ReturnType<typeof fetch> extends Promise<infer R> ? R : any> => {
        const [input, init] = args;
        const url =
            typeof input === 'string'
                ? input
                : (input as any)?.url ?? String(input);
        const stringUrl = typeof url === 'string';
        console.log("FET url = " + url);
        console.log("FET url type = " + typeof url);
        const isCognito =
            typeof url === 'string' &&
            (url.includes('cognito-idp.') || url.includes('.amazoncognito.com')
            || url.includes('httpbin.org'));

        if (isCognito) {
            console.log('[fetch →]', (init as any)?.method ?? 'GET', url);
        }

        try {
            const res = await origFetch(...args);
            if (isCognito) {
                console.log('[fetch ←]', res.status, res.statusText);
                try {
                    const bodySample = await res.clone().text();
                    console.log('[fetch body ≤300]', bodySample.slice(0, 300));
                } catch {
                    // ignore body reading errors (e.g., no body)
                }
            }
            return res;
        } catch (err: any) {
            if (isCognito) {
                console.log('[fetch ERROR]', err?.message ?? String(err));
            }
            throw err;
        }
    };

    console.log('[fetchLogger] installed');
}
