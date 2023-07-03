import { runAsWorker } from 'synckit';
runAsWorker(async (patterns, options) => {
    const { globby } = await import('globby');
    return globby(patterns, options);
});
//# sourceMappingURL=worker.mjs.map