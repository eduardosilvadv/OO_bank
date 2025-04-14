import { Funcionario } from "./Funcionario.js";

export class Gerente extends Funcionario {
    constructor(nome, salario, cpf) {
        super(nome, salario, cpf);
        this._bonificacao = 1.1; // Bonificação de 10% sobre o salário
    }
    
    // Método que retorna a bonificação do gerente
    get bonificacao() {
        return this._salario * this._bonificacao; // Bonificação de 10% sobre o salário
    }
}
