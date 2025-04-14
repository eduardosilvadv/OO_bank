// Classe abstrata
export class Conta {
    constructor(saldoInicial, cliente, agencia) {
        if (this.constructor === Conta) {
            throw new Error("Você não pode instanciar diretamente a classe Conta.");
        }

        this._saldo = saldoInicial;
        this._cliente = cliente;
        this._agencia = agencia;
    }

    set cliente(novoValor) {
        if (novoValor) {
            this._cliente = novoValor;
        }
    }

    get cliente() {
        return this._cliente;
    }

    get saldo() {
        return this._saldo;
    }

    sacar(valor) {
        throw new Error("O método 'sacar' deve ser implementado pela subclasse.");
    }

    _sacar(valor, taxa) {
        const valorSacado = valor * taxa;
        if (this._saldo >= valorSacado) {
            this._saldo -= valorSacado;
            return valor;
        }
        return 0;
    }

    depositar(valor) {
        if (valor > 0) {
            this._saldo += valor;
        }
    }

    tranferir(valor, contaDestino) {
        const valorSacado = this.sacar(valor);
        contaDestino.depositar(valorSacado);
    }
}
