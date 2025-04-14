import { Conta } from './Conta.js';

export class ContaSalario extends Conta {
    constructor(cliente, agencia) {
        super(0, cliente, agencia);
    }

    sacar(valor) {
        const taxa = 1.01; // 1% de taxa
        return this._sacar(valor, taxa);
    }

    depositar(valor) {
        // Só aceita depósito de salário (valores positivos)
        if (valor > 0) {
            this._saldo += valor;
        }
    }
}
