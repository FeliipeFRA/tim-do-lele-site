const crypto = require('crypto');

const CRIPTOGRAFAR = {
    algoritmo: 'aes-256-cbc', // Exemplo de algoritmo de criptografia
    segredo: Buffer.from('0123456789abcdef0123456789abcdef'), // Chave de 32 bytes
    iv: Buffer.from('0123456789abcdef') // IV de 16 bytes
};

async function CriptografarSenha(senha) {
    if (!senha) {
        throw new Error('Senha não pode ser nula ou indefinida');
    }
    const cipher = crypto.createCipheriv(CRIPTOGRAFAR.algoritmo, CRIPTOGRAFAR.segredo, CRIPTOGRAFAR.iv);
    let encrypted = cipher.update(senha, 'utf8', CRIPTOGRAFAR.tipo);
    encrypted += cipher.final(CRIPTOGRAFAR.tipo);
    return encrypted;
}

module.exports = { CriptografarSenha }; 