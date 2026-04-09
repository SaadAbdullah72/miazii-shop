// Boilerplate-free, dependency-free logger for maximum Vercel compatibility.
const logger = {
    info: (...args) => console.log('INFO:', ...args),
    error: (...args) => console.error('ERROR:', ...args),
    warn: (...args) => console.warn('WARN:', ...args),
};

export default logger;
