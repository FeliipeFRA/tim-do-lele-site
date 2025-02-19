const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { ConfigBanco } = require('./query_banco/config_banco.js'); 
const bcrypt = require('bcrypt'); // Certifique-se de ter o bcrypt instalado

// Função para comparar a senha fornecida com a senha armazenada criptografada
async function CompararSenhas(senhaFornecida, senhaArmazenada) {
    return bcrypt.compare(senhaFornecida, senhaArmazenada);
}

passport.use(new LocalStrategy(
    async (email, password, done) => {
        const db = ConfigBanco(); // Conecta ao banco

        db.get('SELECT * FROM USERS WHERE EMAIL = ?', [email], async (err, user) => {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, { message: 'Usuário não encontrado.' });
            }

            // Comparar a senha fornecida com a senha criptografada armazenada
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return done(null, false, { message: 'Senha incorreta.' });
            }

            return done(null, user); // Usuário autenticado com sucesso
        });

        db.close(); // Fecha a conexão com o banco após a operação
    }
));


// Serialização e deserialização do usuário
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    const db = ConfigBanco();

    db.get('SELECT * FROM USERS WHERE ID = ?', [id], (err, user) => {
        if (err) {
            return done(err);
        }
        done(null, user);
    });

    db.close();
});

module.exports = passport;
