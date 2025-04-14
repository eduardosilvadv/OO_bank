import readline from 'readline';
import { Cliente } from './Cliente.js';
import { Gerente } from './Funcionario/Gerente.js';
import { Diretor } from './Funcionario/Diretor.js';
import { SistemaAutenticacao } from './SistemaAutenticacao.js';

import { Conta } from "./Conta/Conta.js";
import { ContaCorrente } from "./Conta/ContaCorrente.js";
import { ContaPoupanca } from './Conta/ContaPoupanca.js';
import { ContaSalario } from './Conta/ContaSalario.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const usuarios = [];
const contas = [];

function perguntar(pergunta) {
  return new Promise(resolve => rl.question(pergunta, resposta => resolve(resposta)));
}

async function criarUsuario() {
  const tipo = await perguntar("Tipo de usuário (cliente/gerente/diretor): ");
  const nome = await perguntar("Nome: ");
  const salario = tipo !== 'cliente' ? await perguntar("Salário: ") : null;
  const cpf = await perguntar("CPF: ");
  const senha = await perguntar("Senha: ");

  let usuario;
  switch (tipo.toLowerCase()) {
    case 'cliente':
      usuario = new Cliente(nome, cpf, senha);
      break;
    case 'gerente':
      usuario = new Gerente(nome, parseFloat(salario), cpf);
      usuario.cadastrarSenha(senha);
      break;
    case 'diretor':
      usuario = new Diretor(nome, parseFloat(salario), cpf);
      usuario.cadastrarSenha(senha);
      break;
    default:
      console.log("Tipo inválido.\n");
      return;
  }

  usuarios.push(usuario);
  console.log(`${tipo} ${nome} criado com sucesso!\n`);
}

async function criarContaParaCliente() {
  const cpf = await perguntar("CPF do cliente: ");
  const cliente = usuarios.find(u => u._cpf === cpf && u.constructor.name === 'Cliente');

  if (!cliente) {
    console.log("Cliente não encontrado.\n");
    return;
  }

  const agencia = await perguntar("Agência: ");
  const tipo = await perguntar("Tipo da conta (corrente/poupanca/salario): ").toLowerCase();

  let conta;
  switch (tipo) {
    case 'corrente':
      conta = new ContaCorrente(cliente, agencia);
      break;
    case 'poupanca':
      conta = new ContaPoupanca(cliente, agencia);
      break;
    case 'salario':
      conta = new ContaSalario(cliente, agencia);
      break;
    default:
      console.log("Tipo de conta inválido.\n");
      return;
  }

  contas.push(conta);
  console.log(`Conta ${tipo} criada com sucesso!\n`);
}

async function fazerLogin() {
  const cpf = await perguntar("CPF: ");
  const senha = await perguntar("Senha: ");

  const usuario = usuarios.find(u => u._cpf === cpf);
  if (!usuario) {
    console.log("Usuário não encontrado.\n");
    return;
  }

  const autenticado = SistemaAutenticacao.login(usuario, senha);
  console.log(autenticado ? "Login bem-sucedido.\n" : "Falha na autenticação.\n");
}

async function sacarDeConta() {
  const cpf = await perguntar("CPF: ");
  const conta = contas.find(c => c.cliente._cpf === cpf);

  if (!conta) {
    console.log("Conta não encontrada.\n");
    return;
  }

  const valor = parseFloat(await perguntar("Valor a sacar: "));
  const resultado = conta.sacar(valor);
  console.log(resultado > 0 ? `Saque de R$${resultado} realizado.` : "Saldo insuficiente.");
}

async function depositarEmConta() {
  const cpf = await perguntar("CPF: ");
  const conta = contas.find(c => c.cliente._cpf === cpf);

  if (!conta) {
    console.log("Conta não encontrada.\n");
    return;
  }

  const valor = parseFloat(await perguntar("Valor a depositar: "));
  conta.depositar(valor);
  console.log("Depósito realizado.");
}

async function transferirEntreContas() {
  const cpfOrigem = await perguntar("CPF da conta origem: ");
  const contaOrigem = contas.find(c => c.cliente._cpf === cpfOrigem);

  if (!contaOrigem) {
    console.log("Conta origem não encontrada.\n");
    return;
  }

  const cpfDestino = await perguntar("CPF da conta destino: ");
  const contaDestino = contas.find(c => c.cliente._cpf === cpfDestino);

  if (!contaDestino) {
    console.log("Conta destino não encontrada.\n");
    return;
  }

  const valor = parseFloat(await perguntar("Valor da transferência: "));
  contaOrigem.tranferir(valor, contaDestino);
  console.log("Transferência realizada.");
}

async function consultarSaldo() {
  const cpf = await perguntar("CPF: ");
  const conta = contas.find(c => c.cliente._cpf === cpf);

  if (!conta) {
    console.log("Conta não encontrada.\n");
    return;
  }

  console.log(`Saldo atual: R$${conta.saldo.toFixed(2)}\n`);
}

function listarContas() {
  contas.forEach((c, i) => {
    console.log(`${i + 1}. Cliente: ${c.cliente.nome} | Agência: ${c._agencia} | Saldo: R$${c.saldo}`);
  });
  console.log();
}

async function exibirMenu() {
  let sair = false;

  while (!sair) {
    console.log("=== MENU BANCO ===");
    console.log("1. Criar usuário");
    console.log("2. Criar conta");
    console.log("3. Fazer login");
    console.log("4. Sacar");
    console.log("5. Depositar");
    console.log("6. Transferir");
    console.log("7. Consultar saldo");
    console.log("8. Listar contas");
    console.log("9. Sair");

    const opcao = await perguntar("Escolha uma opção: ");

    switch (opcao) {
      case '1': await criarUsuario(); break;
      case '2': await criarContaParaCliente(); break;
      case '3': await fazerLogin(); break;
      case '4': await sacarDeConta(); break;
      case '5': await depositarEmConta(); break;
      case '6': await transferirEntreContas(); break;
      case '7': await consultarSaldo(); break;
      case '8': listarContas(); break;
      case '9': sair = true; rl.close(); break;
      default: console.log("Opção inválida.\n");
    }
  }
}

exibirMenu();
