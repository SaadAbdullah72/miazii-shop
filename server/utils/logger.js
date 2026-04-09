// Diagnostic Logger: Replaced Winston with standard console for Vercel troubleshooting.
const logger = {
    info: (...args) => console.log('INFO:', ...args),
    error: (...args) => console.error('ERROR:', ...args),
    warn: (...args) => console.warn('WARN:', ...args),
};

export default logger;
