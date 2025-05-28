// Módulo responsável pela API do PIX

const axios = require("axios");
require("dotenv").config();

// URL base da API
const API_URL = "https://api.mercadopago.com" + "/v1/payments";
const NOTIFICATION_URL = 'http://localhost:4200';
const TOKEN = process.env.TOKEN; // você precisa colocar isso no seu .env

async function realizarPagamentoPix(email, nome, sobrenome, cpf, preco) {
  try {
    const response = await axios.post(
      API_URL,
      {
        transaction_amount: preco,
        payment_method_id: "pix",
        description: "Pedido novo - PIX",
        notification_url: NOTIFICATION_URL,
        external_reference: "pedido_" + Date.now(),
        payer: {
          email: email,
          first_name: nome,
          last_name: sobrenome,
          identification: {
            type: "CPF",
            number: cpf,
          },
        //endereço do cliente opcional
        //   address: {   
        //     zip_code: "06233-200",
        //     street_name: "Av. das Nações Unidas",
        //     street_number: "3003",
        //     neighborhood: "Bonfim",
        //     city: "Osasco",
        //     federal_unit: "SP",
        //   },
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
          "X-Idempotency-Key": `${Date.now()}`, // gera uma chave única por request
        },
      }
    );

    console.log(response.data)
    return response.data; // Aqui você vai receber os dados do pagamento, incluindo o QR Code.
  } catch (error) {
    console.error("Erro ao criar pagamento PIX:", error.response?.data || error.message);
    throw error;
  }
}


module.exports = { realizarPagamentoPix };
