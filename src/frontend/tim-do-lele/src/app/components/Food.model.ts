//modelo do objeto lanche

export interface Food {
    ID: number;
    NOME: string;
    PRECO: number;
    INGREDIENTES: string;
    TIPO: string;
    QUANTITY?: number;
    sauces?: string[]; // Molhos selecionados
    observations?: string; // Observações
}
