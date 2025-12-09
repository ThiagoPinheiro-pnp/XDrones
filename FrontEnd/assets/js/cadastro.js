// IMPORTANTE: Ajustei para a porta 7155 (padrão HTTPS do Backend)
// Se der erro de conexão, verifique se seu backend está rodando e qual a porta exata.
const API_URL = "https://cautious-waddle-6q4p4wjwxxwc5j4r-5071.app.github.dev/api/Auth/register"; 

// Função de abas
function trocarEtapa(numero) {
    const etapas = document.querySelectorAll(".cadastro-etapa");
    const tabs = document.querySelectorAll(".tab");

    etapas.forEach(etapa => etapa.classList.remove("active"));
    tabs.forEach(tab => tab.classList.remove("active"));

    document.getElementById(`etapa${numero}`).classList.add("active");
    tabs[numero - 1].classList.add("active");
}

// Validação cliente: email e força de senha
function isValidEmail(email) {
    if (!email) return false;
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

// Validação de CPF (dígito verificador)
function isValidCPF(cpf) {
    if (!cpf) return false;
    // Remove caracteres especiais
    cpf = cpf.replace(/[^\d]/g, '');
    
    // Verifica se tem 11 dígitos
    if (cpf.length !== 11) return false;
    
    // Rejeita sequências repetidas
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    // Calcula o primeiro dígito verificador
    let sum = 0;
    let remainder;
    for (let i = 1; i <= 9; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;
    
    // Calcula o segundo dígito verificador
    sum = 0;
    for (let i = 1; i <= 10; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;
    
    return true;
}

function validatePassword(password) {
    if (!password) return { success: false, message: 'Senha é obrigatória.' };
    if (password.length < 8) return { success: false, message: 'Senha deve ter ao menos 8 caracteres.' };
    if (!/[A-Z]/.test(password)) return { success: false, message: 'Senha deve conter ao menos uma letra maiúscula.' };
    if (!/[a-z]/.test(password)) return { success: false, message: 'Senha deve conter ao menos uma letra minúscula.' };
    if (!/[0-9]/.test(password)) return { success: false, message: 'Senha deve conter ao menos um dígito.' };
    if (!/[!@#$%^&*(),.?":{}|<>\[\]\/;'`~_\-]/.test(password)) return { success: false, message: 'Senha deve conter ao menos um caractere especial.' };
    return { success: true };
}

// Checagem detalhada para feedback em tempo real
function checkPasswordRules(password) {
    return {
        length: password && password.length >= 8,
        uppercase: /[A-Z]/.test(password || ''),
        lowercase: /[a-z]/.test(password || ''),
        number: /[0-9]/.test(password || ''),
        special: /[!@#$%^&*(),.?":{}|<>\[\]\/;'`~_\-]/.test(password || '')
    };
}

// Atualiza a lista de regras no DOM (ativa/desativa classes)
function updatePasswordRulesUI(password) {
    const rules = checkPasswordRules(password);
    const mapping = {
        length: 'rule-length',
        uppercase: 'rule-uppercase',
        lowercase: 'rule-lowercase',
        number: 'rule-number',
        special: 'rule-special'
    };

    let allValid = true;
    for (const key in mapping) {
        const el = document.getElementById(mapping[key]);
        if (!el) continue;
        if (rules[key]) {
            el.classList.remove('invalid');
            el.classList.add('valid');
        } else {
            el.classList.remove('valid');
            el.classList.add('invalid');
            allValid = false;
        }
    }

    // Habilita o botão Próxima etapa apenas quando todas as regras estiverem OK
    const btnNext = document.getElementById('btnNext');
    if (btnNext) {
        btnNext.disabled = !allValid;
    }
}

// Vincula evento para feedback em tempo real e ENVIO
document.addEventListener('DOMContentLoaded', () => {
    const senhaInput = document.getElementById('senha');
    const confirmarSenhaInput = document.getElementById('confirmarSenha');

    if (senhaInput) {
        senhaInput.addEventListener('input', (e) => {
            updatePasswordRulesUI(e.target.value);
        });
    }

    if (confirmarSenhaInput && senhaInput) {
        confirmarSenhaInput.addEventListener('input', () => {
            updatePasswordRulesUI(senhaInput.value);
        });
    }

    // --- LÓGICA DE ENVIO DO FORMULÁRIO ---
    document.getElementById("cadastroForm").addEventListener("submit", async function(e) {
        e.preventDefault(); // Impede a página de recarregar

        // 1. Capturar dados do HTML (Etapa 1)
        const nome = document.getElementById("nome").value;
        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;
        const confirmarSenha = document.getElementById("confirmarSenha").value;
        const cpf = document.getElementById("cpf").value;

        // --- FUNÇÕES DE MENSAGEM ---
        const cadMsg = document.getElementById('cadMsg');
        function showCadMessage(text, type = 'error') {
            if (!cadMsg) return;
            cadMsg.style.display = 'block';
            cadMsg.innerText = text;
            cadMsg.classList.remove('msg-error', 'msg-success');
            cadMsg.classList.add(type === 'success' ? 'msg-success' : 'msg-error');
            
            // Rola a página para cima para ver a mensagem
            cadMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // --- VALIDAÇÃO MANUAL (Crítica por causa do novalidate) ---
        // Verifica se os campos da aba oculta estão preenchidos
        if (!nome || !email || !senha || !confirmarSenha) {
            showCadMessage('Por favor, preencha todos os campos obrigatórios na etapa "Conta".');
            trocarEtapa(1); // Volta para a aba 1 para o usuário ver
            return;
        }

        // Email
        if (!isValidEmail(email)) {
            showCadMessage('Formato de email inválido.');
            trocarEtapa(1);
            return;
        }

        // CPF (Se preenchido)
        if (cpf && !isValidCPF(cpf)) {
            showCadMessage('CPF inválido. Verifique o número digitado.');
            return;
        }

        // Senha e confirmação
        if (senha !== confirmarSenha) {
            showCadMessage('As senhas não coincidem!');
            trocarEtapa(1);
            return;
        }

        // Força da senha
        const pwdCheck = validatePassword(senha);
        if (!pwdCheck.success) {
            showCadMessage('Senha inválida: ' + pwdCheck.message);
            trocarEtapa(1);
            return;
        }

        // 2. Montar objeto para o Backend
        const usuarioDTO = {
            nome: nome,
            email: email,
            senha: senha,
            role: "Cliente",
            // Campos de endereço (opcionais no backend atual, mas enviamos)
            endereco: document.getElementById('endereco') ? document.getElementById('endereco').value : '',
            numero: document.getElementById('numero') ? document.getElementById('numero').value : '',
            cep: document.getElementById('cep') ? document.getElementById('cep').value : '',
            referencia: document.getElementById('referencia') ? document.getElementById('referencia').value : '',
            cpf: cpf
        };

        // Feedback visual no botão
        const btnSubmit = document.querySelector('button[type="submit"]');
        const txtOriginal = btnSubmit.innerText;
        btnSubmit.innerText = "Enviando...";
        btnSubmit.disabled = true;

        try {
            // 3. Enviar requisição POST
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(usuarioDTO)
            });

            // 4. Tratar resposta
            if (response.ok) {
                // Sucesso
                showCadMessage('Cadastro realizado com sucesso! Redirecionando...', 'success');
                setTimeout(() => window.location.href = "login.html", 2000);
            } else {
                // Erro
                let erroText = 'Verifique os dados.';
                try {
                    const erroData = await response.json(); 
                    // Tenta pegar mensagem de erro do backend (ex: "Email já cadastrado")
                    erroText = erroData.mensagem || erroData.message || erroText;
                } catch (e) {}
                
                showCadMessage('Erro ao cadastrar: ' + erroText);
                btnSubmit.innerText = txtOriginal;
                btnSubmit.disabled = false;
            }
        } catch (error) {
            console.error("Erro na comunicação:", error);
            showCadMessage('Não foi possível conectar ao servidor. Verifique se o Backend está rodando.');
            btnSubmit.innerText = txtOriginal;
            btnSubmit.disabled = false;
        }
    });
});