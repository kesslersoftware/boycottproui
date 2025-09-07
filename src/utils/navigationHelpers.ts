export const sleep = (ms: number) =>
    new Promise(resolve => setTimeout(resolve, ms));

export const navigateWithSpinner = async (
    navigateFn: (screen: string, params?: any) => void,
    targetScreen: string,
    setLoading: (loading: boolean) => void,
    delay = 1000,
    params?: object
) => {
    try {
        setLoading(true);
        await sleep(delay); // simulate load
        navigateFn(targetScreen, params);
    } finally {
        setLoading(false);
    }
};
