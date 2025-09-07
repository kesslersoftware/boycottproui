// src/debug/xhrLogger.ts
export function installXHRLogger() {
    const XHR = global.XMLHttpRequest as any;
    if (!XHR || (XHR as any).__patched) {
        return;
    }

    const origOpen = XHR.prototype.open;
    const origSend = XHR.prototype.send;

    XHR.prototype.open = function (method: string, url: string, ...rest: any[]) {
        (this as any).__amplifyDbg = { method, url };
        return origOpen.apply(this, [method, url, ...rest]);
    };

    XHR.prototype.send = function (body?: any) {
        const meta = (this as any).__amplifyDbg || {};
        const url: string = meta.url || '';
        console.log("XHR url = " + url);
        console.log("XHR url type = " + typeof url);
        const method: string = meta.method || 'GET';
        const isCognito =
            typeof url === 'string' &&
            (url.includes('cognito-idp.') || url.includes('.amazoncognito.com'));

        if (isCognito) {
            console.log('[XHR →]', method, url);
            // optional: show a small slice of the payload (not the password)
            if (typeof body === 'string') {
                console.log('[XHR body ≤200]', body.slice(0, 200));
            }
            this.addEventListener('load', function () {
                try {
                    console.log('[XHR ←]', (this as any).status, (this as any).statusText);
                    const txt = (this as any).responseText;
                    if (typeof txt === 'string') {
                        console.log('[XHR body ≤300]', txt.slice(0, 300));
                    }
                } catch {}
            });
            this.addEventListener('error', function () {
                console.log('[XHR ERROR]');
            });
        }

        return origSend.apply(this, [body]);
    };

    (XHR as any).__patched = true;
    console.log('[xhrLogger] installed');
}
