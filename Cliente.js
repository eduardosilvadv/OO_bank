export class Cliente {
    constructor(nome, cpf, senha) {
        this.nome = nome;
        this._cpf = cpf;
        this._senha = senha;
        this._tentativas = 0;  // Tentativas de login
        this._bloqueado = false;  // Controle de bloqueio
    }

    autenticar(senha) {
        if (this._bloqueado) {
            console.log("❌ Conta bloqueada! Procure um gerente.");
            return false;
        }
        
        if (senha === this._senha) {
            this._tentativas = 0; // Resetar tentativas
            return true;
        }

        this._tentativas += 1;

        if (this._tentativas >= 3) {
            this._bloqueado = true;
            console.log("❌ Você excedeu o número de tentativas. Conta bloqueada!");
        } else {
            console.log("❌ Senha incorreta. Tentativas restantes: " + (3 - this._tentativas));
        }

        return false;
    }
}
