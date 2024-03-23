exports.CryptoBytes = () => {
    const bytes = [];
    for (let i = 0; i < 20; i++) {
        bytes.push(Math.floor(Math.random() * 256));
    }
    const randomHexString = Buffer.from(bytes).toString('hex');
    return randomHexString.slice(4, 16);
};