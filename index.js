import { Cliente } from "./Cliente.js";
import { Gerente } from "./Funcionario/Gerente.js";
import{ContaCorrente} from "./Conta/ContaCorrente.js"
import { SistemaAutenticacao } from "./SistemaAutenticacao.js";
import readlineSync from "readline-sync";
// Forçar a codificação de saída para UTF-8
process.stdout.setEncoding('utf8');
// Lista de usuários (inicializada com um gerente e um cliente para exemplo)
let usuarios = [];

// Função para perguntar ao usuário
async function perguntar(pergunta) {
    return readlineSync.question(pergunta);
}

// Variável para armazenar o usuário logado
let usuarioLogado = null;

// Criando um Gerente e um Cliente iniciais
const gerente = new Gerente("Ricardo", 5000, "12378945601");
gerente.cadastrarSenha("123");
usuarios.push(gerente);

const cliente = new Cliente("Lais", "78945612379", "456");
const contaCliente = new ContaCorrente(cliente, "456", 0);
usuarios.push(cliente);
usuarios.push(contaCliente);

// Função para fazer o login
async function fazerLogin() {
    const cpf = await perguntar("CPF: ");
    const senha = await perguntar("Senha: ");

    const cliente = usuarios.find(u => u._cpf === cpf && u instanceof Cliente);
    if (cliente) {
        const autenticado = SistemaAutenticacao.login(cliente, senha);

        if (autenticado) {
            usuarioLogado = cliente;
            console.log(`✅ Login bem-sucedido como ${cliente.nome} (Cliente).\n`);
        } else {
            console.log("❌ Falha na autenticação.");
            if (cliente._bloqueado) {
                console.log("Você deve procurar um gerente para desbloquear sua conta.");
            }
        }
    } else {
        const funcionario = usuarios.find(u => u._cpf === cpf && (u instanceof Gerente || u instanceof Diretor));
        if (funcionario) {
            const autenticado = SistemaAutenticacao.login(funcionario, senha);
            if (autenticado) {
                usuarioLogado = funcionario;
                console.log(`✅ Login bem-sucedido como ${funcionario.nome} (${funcionario.constructor.name}).\n`);
                if (funcionario instanceof Gerente) {
                    console.log(`Bonificação: R$ ${funcionario.bonificacao.toFixed(2)}\n`);
                }
            } else {
                console.log("❌ Falha na autenticação.");
            }
        } else {
            console.log("❌ Usuário não encontrado.");
        }
    }
}

// Função para fazer logout
async function fazerLogout() {
    usuarioLogado = null;
    console.log("🔓 Você foi desconectado.");
}

// Função para consultar o saldo do cliente
async function consultarSaldo() {
    if (usuarioLogado instanceof Cliente) {
        console.log(`Saldo: R$ ${usuarioLogado.saldo}`);
    }
}

// Função para desbloquear cliente pelo gerente
async function desbloquearConta() {
    if (!(usuarioLogado instanceof Gerente)) {
        console.log("❌ Apenas gerentes podem desbloquear contas.");
        return;
    }

    const cpfCliente = await perguntar("Digite o CPF do cliente a ser desbloqueado: ");
    const cliente = usuarios.find(u => u._cpf === cpfCliente && u instanceof Cliente);

    if (cliente) {
        if (cliente._bloqueado) {
            usuarioLogado.desbloquear(cliente);
            console.log(`✅ Conta do cliente ${cliente.nome} desbloqueada.`);
        } else {
            console.log("❌ Conta já está desbloqueada.");
        }
    } else {
        console.log("❌ Cliente não encontrado.");
    }
}

// Função principal do menu
async function main() {
    let opcao = '';
    while (opcao !== '0') {
        console.log("\n=== MENU BANCO ===");

        if (!usuarioLogado) {
            console.log("1. Login");
            console.log("0. Sair");
            opcao = await perguntar("Escolha uma opção: ");

            switch (opcao) {
                case '1': await fazerLogin(); break;
                case '0': console.log("👋 Saindo..."); break;
                default: console.log("❌ Opção inválida.");
            }
        } else {
            console.log(`🔒 Logado como: ${usuarioLogado.nome} (${usuarioLogado.constructor.name})`);

            if (usuarioLogado instanceof Cliente) {
                console.log("1. Consultar saldo");
                console.log("2. Logout");
                console.log("0. Sair");
                opcao = await perguntar("Escolha uma opção: ");
                
                switch (opcao) {
                    case '1': await consultarSaldo(); break;
                    case '2': await fazerLogout(); break;
                    case '0': console.log("👋 Saindo..."); break;
                    default: console.log("❌ Opção inválida.");
                }
            } else if (usuarioLogado instanceof Gerente) {
                console.log("1. Desbloquear cliente");
                console.log("2. Logout");
                console.log("0. Sair");
                opcao = await perguntar("Escolha uma opção: ");
                
                switch (opcao) {
                    case '1': await desbloquearConta(); break;
                    case '2': await fazerLogout(); break;
                    case '0': console.log("👋 Saindo..."); break;
                    default: console.log("❌ Opção inválida.");
                }
            }
        }
    }
}

main();
