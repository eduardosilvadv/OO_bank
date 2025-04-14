import { Conta } from './Conta.js';

export class ContaPoupanca extends Conta {
    constructor(cliente, agencia) {
        super(0, cliente, agencia);
    }

    sacar(valor) {
        const taxa = 1.02; // 2% de taxa
        return this._sacar(valor, taxa);
    }
}
