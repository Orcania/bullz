export const printLog = (message, type = 'error') => {
    if(type === 'error' || process.env.NODE_ENV === 'development'){
        console.log(...message);
    }
}