/* ============================================================
   BarberFacil - Autenticação
   ============================================================ */

const Auth = {
  // Fazer login
  fazerLogin(cpf, senha) {
    const cpfLimpo = Utils.somenteNumeros(cpf);

    // Verificar admin fixo
    if (cpfLimpo === APP_CONFIG.admin.cpf && senha === APP_CONFIG.admin.senha) {
      Storage.setSessao({
        cpf: APP_CONFIG.admin.cpf,
        nome: APP_CONFIG.admin.nome,
        role: APP_CONFIG.admin.role
      });
      return { ok: true, role: 'admin' };
    }

    // Verificar usuários no localStorage
    const usuario = Storage.buscarUsuarioPorCpf(cpfLimpo);
    if (usuario && usuario.senha === senha) {
      Storage.setSessao({
        cpf: usuario.cpf,
        nome: usuario.nome,
        role: usuario.role
      });
      return { ok: true, role: usuario.role };
    }

    return { ok: false, erro: 'CPF ou senha inválidos.' };
  },

  // Cadastrar colaborador
  cadastrarColaborador(nome, cpf, senha, confirmSenha) {
    // Validações
    if (!nome || nome.trim().length < 3) {
      return { ok: false, erro: 'Nome deve ter pelo menos 3 caracteres.' };
    }
    if (!Utils.validarCpf(cpf)) {
      return { ok: false, erro: 'CPF deve conter 11 dígitos numéricos.' };
    }
    if (!senha || senha.length < 4) {
      return { ok: false, erro: 'Senha deve ter pelo menos 4 caracteres.' };
    }
    if (senha !== confirmSenha) {
      return { ok: false, erro: 'As senhas não coincidem.' };
    }
    if (Storage.cpfJaCadastrado(cpf)) {
      return { ok: false, erro: 'Este CPF já está cadastrado.' };
    }
    if (Utils.somenteNumeros(cpf) === APP_CONFIG.admin.cpf) {
      return { ok: false, erro: 'Este CPF não pode ser utilizado.' };
    }

    Storage.registrarUsuario({
      id: Utils.gerarId(),
      nome: nome.trim(),
      cpf: Utils.somenteNumeros(cpf),
      senha: senha,
      role: 'colaborador',
      dataCadastro: Utils.dataAtual()
    });

    return { ok: true };
  },

  // Fazer logout
  fazerLogout() {
    Storage.limparSessao();
    window.location.href = 'index.html';
  },

  // Verificar se está logado
  estaLogado() {
    return !!Storage.getSessao();
  },

  // Obter sessão atual
  getSessao() {
    return Storage.getSessao();
  },

  // Redirecionar baseado no role
  redirecionarPorRole() {
    const sessao = this.getSessao();
    if (!sessao) return;
    if (sessao.role === 'admin') {
      window.location.href = 'painel-admin.html';
    } else {
      window.location.href = 'painel-colaborador.html';
    }
  }
};
