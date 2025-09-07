// api.ts
import { APP_ENV, API_URL } from '@env';
import { fetchAuthSession } from 'aws-amplify/auth';

type FetchInit = RequestInit & { requireAuth?: boolean };

// --- helpers ---
const handleResponse = async (response: Response) => {
    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const body = isJson ? await response.json().catch(() => ({})) : await response.text();

    if (!response.ok) {
        // Throw parsed JSON if available, else wrap text
        throw isJson ? body : { status: response.status, message: body || response.statusText };
    }
    return body;
};

const getIdToken = async (): Promise<string | undefined> => {
    const session = await fetchAuthSession(); // refreshes if needed
    return session.tokens?.idToken?.toString();
};

const authHeaders = async (requireAuth = true): Promise<Record<string, string>> => {
    if (!requireAuth) return {};
    const token = await getIdToken();
    //console.log("token = ", token);
    if (!token) {
        throw { status: 401, message: 'Not authenticated' };
    }
    return { Authorization: `Bearer ${token}` };
};

const doFetch = async (path: string, init: FetchInit = {}) => {
    const { requireAuth = true, headers, ...rest } = init;

    // build headers (no Content-Type for GET/DELETE unless provided)
    const auth = await authHeaders(requireAuth);
    const mergedHeaders = { ...auth, ...(headers || {}) };
    //console.log("mergedHeaders = ",mergedHeaders);
    const url = `${API_URL}${path}`;
    //console.log('APP_ENV=', APP_ENV, '→', url);

    // First attempt
    let res = await fetch(url, { ...rest, headers: mergedHeaders });

    // If unauthorized once, try to refresh session (fetchAuthSession already does it),
    // and retry exactly one time.
    if (res.status === 401 && requireAuth) {
        const auth2 = await authHeaders(true);
        const mergedHeaders2 = { ...auth2, ...(headers || {}) };
        res = await fetch(url, { ...rest, headers: mergedHeaders2 });
    }

    return handleResponse(res);
};

// --- public API ---
export const apiGet = async (path: string, requireAuth = true) => {
    return doFetch(path, { method: 'GET', requireAuth });
};

export const apiDelete = async (path: string, requireAuth = true) => {
    return doFetch(path, { method: 'DELETE', requireAuth });
};

export const apiPost = async (path: string, data: any = {}, requireAuth = true) => {
    return doFetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        requireAuth,
    });
};

export const apiPut = async (path: string, data: any = {}, requireAuth = true) => {
    return doFetch(path, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        requireAuth,
    });
};

