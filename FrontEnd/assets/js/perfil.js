// JS separado para a página de perfil
const API_BASE = "https://cautious-waddle-6q4p4wjwxxwc5j4r-5071.app.github.dev/api";

function loadHTML(selector, url) { fetch(url).then(r=>r.text()).then(d=>document.querySelector(selector).innerHTML=d).catch(()=>{}); }

if (!localStorage.getItem("usuario_token")) {
    window.location.href = "login.html";
}

document.addEventListener('DOMContentLoaded', () => {
    if(!document.querySelector('.topo')) {
        loadHTML('div[data-include="components/header.html"]', 'components/header.html');
        loadHTML('div[data-include="components/footer.html"]', 'components/footer.html');
    }

    const token = localStorage.getItem('usuario_token');
    const perfilMsg = document.getElementById('perfilMsg');

    function showMsg(text, type='error'){
        if(!perfilMsg) return;
        perfilMsg.style.display='block';
        perfilMsg.innerText = text;
        perfilMsg.classList.remove('msg-error','msg-success');
        perfilMsg.classList.add(type==='success' ? 'msg-success' : 'msg-error');
    }

    async function loadProfile(){
        try{
            const res = await fetch(API_BASE + '/Auth/me', { headers: { 'Authorization': 'Bearer ' + token }});
            if(!res.ok){
                if(res.status === 401) {
                    localStorage.removeItem('usuario_token');
                    window.location.href = 'login.html';
                    return;
                }
                // Tenta ler o corpo do erro para exibir mensagem mais útil ao usuário
                let errBody = null;
                try{
                    errBody = await res.json();
                }catch(e){
                    // se não for JSON, tenta texto simples
                    try{ errBody = await res.text(); }catch(e){}
                }
                console.error('Erro ao carregar perfil:', res.status, errBody);
                if(errBody && (errBody.mensagem || typeof errBody === 'string')){
                    showMsg(errBody.mensagem || errBody);
                } else {
                    showMsg('Erro ao carregar perfil (Status: ' + res.status + ')');
                }
                return;
            }
            const data = await res.json();
            document.getElementById('nomeInput').value = data.nome || '';
            document.getElementById('emailInput').value = data.email || '';
            document.getElementById('cpfInput').value = data.cpf || '';
            document.getElementById('enderecoInput').value = data.endereco || '';
            document.getElementById('numeroInput').value = data.numero || '';
            document.getElementById('cepInput').value = data.cep || '';
            document.getElementById('referenciaInput').value = data.referencia || '';
        }catch(err){
            console.error(err);
            showMsg('Erro ao conectar com o servidor.');
        }
    }

    loadProfile();

    // Edit/Save/Cancel logic
    const btnEdit = document.getElementById('btnEdit');
    const btnSave = document.getElementById('btnSave');
    const btnCancel = document.getElementById('btnCancel');
    const btnLogout = document.getElementById('btnLogout');
    const form = document.getElementById('perfilForm');

    function setEditable(editable){
        ['nomeInput','cpfInput','enderecoInput','numeroInput','cepInput','referenciaInput','senhaNovaInput'].forEach(id=>{
            const el = document.getElementById(id);
            if(el) el.disabled = !editable;
        });
        btnEdit.style.display = editable ? 'none' : 'inline-block';
        btnSave.style.display = editable ? 'inline-block' : 'none';
        btnCancel.style.display = editable ? 'inline-block' : 'none';
    }

    btnEdit.addEventListener('click', ()=> setEditable(true));
    btnCancel.addEventListener('click', ()=> { setEditable(false); document.getElementById('senhaNovaInput').value=''; clearMsg(); loadProfile(); });

    function clearMsg(){ if(perfilMsg){ perfilMsg.style.display='none'; perfilMsg.innerText=''; }}

    btnLogout.addEventListener('click', ()=>{ localStorage.removeItem('usuario_token'); localStorage.removeItem('usuario_nome'); window.location.href='index.html'; });

    form.addEventListener('submit', async (e)=>{
        e.preventDefault();
        clearMsg();
        const payload = {
            Nome: document.getElementById('nomeInput').value,
            Cpf: document.getElementById('cpfInput').value,
            Endereco: document.getElementById('enderecoInput').value,
            Numero: document.getElementById('numeroInput').value,
            Cep: document.getElementById('cepInput').value,
            Referencia: document.getElementById('referenciaInput').value,
            Senha: document.getElementById('senhaNovaInput').value
        };

        try{
            const res = await fetch(API_BASE + '/Auth/me', { method:'PUT', headers: { 'Content-Type':'application/json', 'Authorization':'Bearer ' + token }, body: JSON.stringify(payload)});
            if(!res.ok){
                const err = await res.json().catch(()=>({mensagem:'Erro'}));
                showMsg(err.mensagem || ('Erro ao salvar (Status ' + res.status + ')'));
                return;
            }
            const data = await res.json();
            showMsg(data.mensagem || 'Perfil atualizado.', 'success');
            // atualizar nome no localStorage
            localStorage.setItem('usuario_nome', payload.Nome);
            setEditable(false);
            document.getElementById('senhaNovaInput').value='';
        }catch(err){
            console.error(err);
            showMsg('Erro de conexão ao salvar.');
        }
    });
});
