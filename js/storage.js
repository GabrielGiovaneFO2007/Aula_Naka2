/* ============================================================
   BarberFacil - Camada de Armazenamento (localStorage)
   ============================================================ */

const Storage = {
  keys: APP_CONFIG.storageKeys,

  // --- Sessão (sessionStorage) ---
  getSessao() {
    const data = sessionStorage.getItem(this.keys.sessao);
    return data ? JSON.parse(data) : null;
  },

  setSessao(sessao) {
    sessionStorage.setItem(this.keys.sessao, JSON.stringify(sessao));
  },

  limparSessao() {
    sessionStorage.removeItem(this.keys.sessao);
  },

  // --- Usuários ---
  getUsuarios() {
    const data = localStorage.getItem(this.keys.usuarios);
    return data ? JSON.parse(data) : [];
  },

  registrarUsuario(usuario) {
    const usuarios = this.getUsuarios();
    usuarios.push(usuario);
    localStorage.setItem(this.keys.usuarios, JSON.stringify(usuarios));
  },

  buscarUsuarioPorCpf(cpf) {
    const usuarios = this.getUsuarios();
    return usuarios.find(u => u.cpf === Utils.somenteNumeros(cpf));
  },

  cpfJaCadastrado(cpf) {
    return !!this.buscarUsuarioPorCpf(cpf);
  },

  // --- Clientes ---
  getClientes() {
    const data = localStorage.getItem(this.keys.clientes);
    return data ? JSON.parse(data) : [];
  },

  salvarClientes(clientes) {
    localStorage.setItem(this.keys.clientes, JSON.stringify(clientes));
  },

  adicionarCliente(cliente) {
    const clientes = this.getClientes();
    clientes.push(cliente);
    this.salvarClientes(clientes);
  },

  buscarClientePorId(id) {
    return this.getClientes().find(c => c.id === id);
  },

  buscarClientePorCpf(cpf) {
    return this.getClientes().find(c => c.cpf === Utils.somenteNumeros(cpf));
  },

  cpfClienteJaCadastrado(cpf, excluirId) {
    return this.getClientes().some(c => c.cpf === Utils.somenteNumeros(cpf) && c.id !== excluirId);
  },

  atualizarCliente(id, dados) {
    const clientes = this.getClientes();
    const idx = clientes.findIndex(c => c.id === id);
    if (idx !== -1) {
      clientes[idx] = { ...clientes[idx], ...dados };
      this.salvarClientes(clientes);
    }
  },

  // --- Produtos ---
  getProdutos() {
    const data = localStorage.getItem(this.keys.produtos);
    return data ? JSON.parse(data) : [];
  },

  salvarProdutos(produtos) {
    localStorage.setItem(this.keys.produtos, JSON.stringify(produtos));
  },

  adicionarProduto(produto) {
    const produtos = this.getProdutos();
    produtos.push(produto);
    this.salvarProdutos(produtos);
  },

  buscarProdutoPorId(id) {
    return this.getProdutos().find(p => p.id === id);
  },

  atualizarProduto(id, dados) {
    const produtos = this.getProdutos();
    const idx = produtos.findIndex(p => p.id === id);
    if (idx !== -1) {
      produtos[idx] = { ...produtos[idx], ...dados };
      this.salvarProdutos(produtos);
    }
  },

  // --- Pedidos (Vendas) ---
  getPedidos() {
    const data = localStorage.getItem(this.keys.pedidos);
    return data ? JSON.parse(data) : [];
  },

  salvarPedidos(pedidos) {
    localStorage.setItem(this.keys.pedidos, JSON.stringify(pedidos));
  },

  adicionarPedido(pedido) {
    const pedidos = this.getPedidos();
    pedidos.push(pedido);
    this.salvarPedidos(pedidos);
  },

  // --- Movimentações de Estoque ---
  getMovimentacoes() {
    const data = localStorage.getItem(this.keys.movimentacoes);
    return data ? JSON.parse(data) : [];
  },

  salvarMovimentacoes(movs) {
    localStorage.setItem(this.keys.movimentacoes, JSON.stringify(movs));
  },

  adicionarMovimentacao(mov) {
    const movs = this.getMovimentacoes();
    movs.push(mov);
    this.salvarMovimentacoes(movs);
  },

  // --- Verificar se dados já foram seedados ---
  isSeeded() {
    return localStorage.getItem(this.keys.seeded) === 'true';
  },

  marcarSeeded() {
    localStorage.setItem(this.keys.seeded, 'true');
  },

  // --- Proteção de rota: exigir login ---
  exigirLogin(rolePermitida) {
    const sessao = this.getSessao();
    if (!sessao) {
      window.location.href = 'index.html';
      return false;
    }
    if (rolePermitida && sessao.role !== rolePermitida) {
      if (rolePermitida === 'admin') {
        window.location.href = 'painel-colaborador.html';
      } else {
        window.location.href = 'painel-admin.html';
      }
      return false;
    }
    return true;
  }
};
