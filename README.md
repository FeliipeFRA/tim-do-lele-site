# Tim do Lele - Acompanhamento de Pedidos de Lanche

streamlit 
Este projeto visa oferecer um sistema de acompanhamento de pedidos de lanche, utilizando as tecnologias Node.js e Angular para o backend e frontend, respectivamente.
=======

## Tecnologias Utilizadas

### Backend (Node.js)
- **Express**: Framework minimalista para Node.js, utilizado para criar as rotas da aplicação.
- **SQLite**: Banco de dados leve utilizado para armazenar os dados dos pedidos.
- **CORS**: Middleware que permite que o backend aceite requisições de diferentes origens.
- **crypto-js**: Biblioteca para criptografia de dados sensíveis, como senhas.
- **passport.js**: Middleware de autenticação.
- **passport-local**: Estratégia de autenticação para login baseado em usuário e senha.

### Frontend (Angular)
- **sweetAlert2**: Biblioteca para exibição de alertas bonitos e personalizáveis.
- **PrimeNG**: Biblioteca de componentes ricos para Angular.
- **PrimeIcons**: Ícones personalizados para serem usados com os componentes do PrimeNG.

## Como Rodar o Projeto

### Backend

1. Navegue até a pasta do backend.
2. Instale as dependências do Node.js:
    ```bash
    npm install
    ```
3. Para rodar o servidor em modo de observação (para reiniciar automaticamente em alterações):
    ```bash
    node --watch api.js
    ```

### Frontend

1. Navegue até a pasta do frontend.
2. Instale as dependências do Angular:
    ```bash
    npm install
    ```
3. Para iniciar o servidor de desenvolvimento do Angular:
    ```bash
    ng serve
    ```

## Licença

Este projeto está sob a licença [MIT](LICENSE).
