//modelo do objeto lanche

import { Adicional } from "./Additionals.model";

export interface Food {
    ID: number;
    NOME: string;
    PRECO: number;
    INGREDIENTES: string;
    TIPO: string;
    QUANTITY?: number;
    sauces?: string[]; // Molhos selecionados
    additionals?: Adicional[];
    observations?: string; // Observações
}
