// =======================================================
// ⚠️ SIMULAÇÃO DE BACK-END COM LOCALSTORAGE
// No futuro isso será substituído por FETCH para API
// =======================================================

// ✅ SIMULA USUÁRIO LOGADO
function obterUsuarioLogado() {

  // 🔴 FUTURO (BACK-END):
  // return fetch("/api/usuario-logado")

  // ✅ ATUAL (FRONT)
  return JSON.parse(localStorage.getItem("usuarioLogadoMock"));
}

// ✅ CARREGA DADOS NA TELA
function carregarMinhaConta() {
  const user = obterUsuarioLogado();

  if (!user) {
    // 🔴 FUTURO: redirecionar se token inválido
    window.location.href = "login.html";
    return;
  }

  document.getElementById("user-nome").innerText = user.nome;
  document.getElementById("user-email").innerText = user.email;
  document.getElementById("user-cpf").innerText = user.cpf;

  renderizarEnderecos(user.enderecos);
}

// ✅ MOSTRA ENDEREÇOS
function renderizarEnderecos(enderecos) {
  const container = document.getElementById("lista-enderecos");
  container.innerHTML = "";

  enderecos.forEach((end) => {
    const div = document.createElement("div");
    div.classList.add("endereco");

    div.innerHTML = `
      <p><strong>CEP:</strong> ${end.cep}</p>
      <p><strong>Rua:</strong> ${end.rua}</p>
      <p><strong>Número:</strong> ${end.numero}</p>
      <p><strong>Referência:</strong> ${end.referencia}</p>

      <button onclick="editarEndereco(${end.id})">Editar</button>
      <button onclick="removerEndereco(${end.id})">Remover</button>
    `;

    container.appendChild(div);
  });
}

// =======================================================
// ⚠️ FUNÇÕES DEPENDENTES DO BACK-END (POR ENQUANTO MOCK)
// =======================================================

function editarEndereco(idEndereco) {
  alert("Editar endereço (endpoint futuro)");
  // 🔴 FUTURO:
  // fetch(`/api/enderecos/${idEndereco}`, { method: "PUT" })
}

function removerEndereco(idEndereco) {
  alert("Remover endereço (endpoint futuro)");
  // 🔴 FUTURO:
  // fetch(`/api/enderecos/${idEndereco}`, { method: "DELETE" })
}

// =======================================================
// ✅ BOTÕES
// =======================================================

document.getElementById("btn-add-endereco")?.addEventListener("click", () => {
  alert("Abrir modal de novo endereço (fase 2)");
});

document.getElementById("btn-logout")?.addEventListener("click", () => {
  // 🔴 FUTURO: invalidar token no back
  localStorage.removeItem("usuarioLogadoMock");
  window.location.href = "index.html";
});

// =======================================================
// ✅ MOCK TEMPORÁRIO DE USUÁRIO (APENAS PARA TESTE)
// =======================================================

if (!localStorage.getItem("usuarioLogadoMock")) {
  localStorage.setItem("usuarioLogadoMock", JSON.stringify({
    id: 1,
    nome: "João da Silva",
    email: "joao@email.com",
    cpf: "123.456.***-**",
    enderecos: [
      {
        id: 1,
        cep: "12345-000",
        rua: "Av Brasil",
        numero: "100",
        referencia: "Perto da padaria"
      }
    ]
  }));
}

document.getElementById("btnExcluirConta").addEventListener("click", () => {
  const confirmacao1 = confirm("⚠️ Tem certeza que deseja excluir sua conta?");

  if (!confirmacao1) return;

  const confirmacao2 = confirm("❗ Esta ação é IRREVERSÍVEL. Deseja continuar?");

  if (!confirmacao2) return;

  // ✅ AQUI ENTRA O BACK-END NO FUTURO
  /*
  fetch('/api/usuario/excluir', {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(res => res.json())
  .then(data => {
    alert("Conta excluída com sucesso.");
    localStorage.clear();
    window.location.href = "index.html";
  })
  .catch(err => {
    alert("Erro ao excluir conta.");
  });
  */

  // ✅ SIMULAÇÃO POR ENQUANTO:
  alert("✅ Conta excluída (simulação front-end)");
  localStorage.clear();
  window.location.href = "index.html";
});

// ✅ Inicia
carregarMinhaConta();