/* ============================================================
   BarberFacil - Dados Fictícios (Seed)
   ============================================================ */

const Seed = {
  seeds: null,

  init() {
    if (Storage.isSeeded()) return;
    this.seeds = this.gerarDados();
    this.inserirDados();
    Storage.marcarSeeded();
    console.log('[BarberFácil] Dados fictícios carregados com sucesso.');
  },

  gerarDados() {
    return {
      colaboradores: [
        { id: 'c1', nome: 'Carlos Eduardo Silva', cpf: '12345678901', senha: '123456', role: 'colaborador', dataCadastro: '2026-01-15T10:00:00.000Z' },
        { id: 'c2', nome: 'Maria Fernanda Costa', cpf: '23456789012', senha: '123456', role: 'colaborador', dataCadastro: '2026-02-01T09:30:00.000Z' },
        { id: 'c3', nome: 'João Pedro Almeida', cpf: '34567890123', senha: '123456', role: 'colaborador', dataCadastro: '2026-02-20T14:00:00.000Z' },
        { id: 'c4', nome: 'Ana Beatriz Souza', cpf: '45678901234', senha: '123456', role: 'colaborador', dataCadastro: '2026-03-10T11:00:00.000Z' },
        { id: 'c5', nome: 'Lucas Gabriel Oliveira', cpf: '56789012345', senha: '123456', role: 'colaborador', dataCadastro: '2026-04-05T08:00:00.000Z' }
      ],
      clientes: [
        { id: 'cl1', nome: 'Roberto Carlos Mendes', cpf: '11122233344', telefone: '62985432100', chavePix: 'roberto.mendes@email.com', dataCadastro: '2026-01-20T10:00:00.000Z' },
        { id: 'cl2', nome: 'Fernanda Aparecida Dias', cpf: '22233344455', telefone: '62987654321', chavePix: '62987654321', dataCadastro: '2026-01-25T15:00:00.000Z' },
        { id: 'cl3', nome: 'Marcos Antônio Pereira', cpf: '33344455566', telefone: '62998765432', chavePix: 'marcos.p@email.com', dataCadastro: '2026-02-05T09:00:00.000Z' },
        { id: 'cl4', nome: 'Juliana de Fátima Santos', cpf: '44455566677', telefone: '62912345678', chavePix: 'juliana.santos@email.com', dataCadastro: '2026-02-15T14:30:00.000Z' },
        { id: 'cl5', nome: 'Ricardo Souza Lima', cpf: '55566677788', telefone: '62983456789', chavePix: '62983456789', dataCadastro: '2026-03-01T11:00:00.000Z' },
        { id: 'cl6', nome: 'Patrícia Alves Ferreira', cpf: '66677788899', telefone: '62994567890', chavePix: 'patricia.f@email.com', dataCadastro: '2026-03-10T16:00:00.000Z' },
        { id: 'cl7', nome: 'Bruno Henrique Cardoso', cpf: '77788899900', telefone: '62985678901', chavePix: 'bruno.cardoso@email.com', dataCadastro: '2026-03-20T08:30:00.000Z' },
        { id: 'cl8', nome: 'Camila Rodrigues Nunes', cpf: '88899900011', telefone: '62996789012', chavePix: 'camila.nunes@email.com', dataCadastro: '2026-04-01T10:00:00.000Z' }
      ],
      produtos: [
        { id: 'p1', nome: 'Pomada Modeladora Classic', marca: 'Umberto', categoria: 'Pomada', preco: 45.00, quantidade: 30 },
        { id: 'p2', nome: 'Shampoo Anticaspa', marca: 'Dove Men', categoria: 'Shampoo', preco: 28.50, quantidade: 25 },
        { id: 'p3', nome: 'Óleo para Barba Premium', marca: 'The Balm', categoria: 'Óleo para Barba', preco: 55.00, quantidade: 15 },
        { id: 'p4', nome: 'Cera Matificante Strong', marca: 'Fudge', categoria: 'Cera', preco: 38.00, quantidade: 20 },
        { id: 'p5', nome: 'Condicionador Hidratante', marca: 'American Crew', categoria: 'Condicionador', preco: 42.00, quantidade: 18 },
        { id: 'p6', nome: 'Pós-barba Refresh', marca: 'Nivea Men', categoria: 'Pós-barba', preco: 32.00, quantidade: 22 },
        { id: 'p7', nome: 'Hidratante Facial Matte', marca: 'Neutrogena', categoria: 'Hidratante', preco: 49.90, quantidade: 12 },
        { id: 'p8', nome: 'Pomada Shine Flex', marca: 'Suavecito', categoria: 'Pomada', preco: 52.00, quantidade: 8 },
        { id: 'p9', nome: 'Lâmina Descartável 10un', marca: 'Gillette', categoria: 'Navalha/Lâmina', preco: 22.00, quantidade: 40 },
        { id: 'p10', nome: 'Tesoura Profissional 6"', marca: 'Kasho', categoria: 'Tesoura', preco: 189.00, quantidade: 5 }
      ],
      pedidos: [
        { id: 'pd1', clienteId: 'cl1', itens: [{ produtoId: 'p1', quantidade: 2, precoUnit: 45.00 }], valorTotal: 90.00, statusPagamento: 'Concluído', metodoPagamento: 'PIX', dataVenda: '2026-04-10T10:00:00.000Z', vendedorCpf: '12345678901' },
        { id: 'pd2', clienteId: 'cl2', itens: [{ produtoId: 'p3', quantidade: 1, precoUnit: 55.00 }, { produtoId: 'p6', quantidade: 2, precoUnit: 32.00 }], valorTotal: 119.00, statusPagamento: 'Concluído', metodoPagamento: 'Dinheiro', dataVenda: '2026-04-12T14:30:00.000Z', vendedorCpf: '12345678901' },
        { id: 'pd3', clienteId: 'cl3', itens: [{ produtoId: 'p2', quantidade: 3, precoUnit: 28.50 }], valorTotal: 85.50, statusPagamento: 'Concluído', metodoPagamento: 'Cartão Débito', dataVenda: '2026-04-15T09:00:00.000Z', vendedorCpf: '23456789012' },
        { id: 'pd4', clienteId: 'cl5', itens: [{ produtoId: 'p4', quantidade: 1, precoUnit: 38.00 }, { produtoId: 'p5', quantidade: 1, precoUnit: 42.00 }], valorTotal: 80.00, statusPagamento: 'Pendente', metodoPagamento: 'PIX', dataVenda: '2026-04-18T11:00:00.000Z', vendedorCpf: '23456789012' },
        { id: 'pd5', clienteId: 'cl4', itens: [{ produtoId: 'p7', quantidade: 1, precoUnit: 49.90 }, { produtoId: 'p8', quantidade: 1, precoUnit: 52.00 }, { produtoId: 'p3', quantidade: 1, precoUnit: 55.00 }], valorTotal: 156.90, statusPagamento: 'Concluído', metodoPagamento: 'PIX', dataVenda: '2026-04-20T16:00:00.000Z', vendedorCpf: '34567890123' },
        { id: 'pd6', clienteId: 'cl6', itens: [{ produtoId: 'p1', quantidade: 3, precoUnit: 45.00 }], valorTotal: 135.00, statusPagamento: 'Concluído', metodoPagamento: 'Cartão Crédito', dataVenda: '2026-04-22T10:30:00.000Z', vendedorCpf: '34567890123' },
        { id: 'pd7', clienteId: 'cl1', itens: [{ produtoId: 'p9', quantidade: 2, precoUnit: 22.00 }, { produtoId: 'p6', quantidade: 1, precoUnit: 32.00 }], valorTotal: 76.00, statusPagamento: 'Concluído', metodoPagamento: 'Dinheiro', dataVenda: '2026-04-25T08:00:00.000Z', vendedorCpf: '45678901234' },
        { id: 'pd8', clienteId: 'cl7', itens: [{ produtoId: 'p10', quantidade: 1, precoUnit: 189.00 }], valorTotal: 189.00, statusPagamento: 'Pendente', metodoPagamento: 'Transferência', dataVenda: '2026-04-28T13:00:00.000Z', vendedorCpf: '45678901234' },
        { id: 'pd9', clienteId: 'cl8', itens: [{ produtoId: 'p2', quantidade: 1, precoUnit: 28.50 }, { produtoId: 'p5', quantidade: 2, precoUnit: 42.00 }], valorTotal: 112.50, statusPagamento: 'Concluído', metodoPagamento: 'PIX', dataVenda: '2026-05-02T15:00:00.000Z', vendedorCpf: '56789012345' },
        { id: 'pd10', clienteId: 'cl3', itens: [{ produtoId: 'p3', quantidade: 2, precoUnit: 55.00 }, { produtoId: 'p1', quantidade: 1, precoUnit: 45.00 }], valorTotal: 155.00, statusPagamento: 'Concluído', metodoPagamento: 'PIX', dataVenda: '2026-05-05T09:00:00.000Z', vendedorCpf: '56789012345' }
      ],
      movimentacoes: [
        { id: 'm1', produtoId: 'p1', tipo: 'entrada', quantidade: 50, data: '2026-01-10T08:00:00.000Z', observacao: 'Compra inicial - Fornecedor A' },
        { id: 'm2', produtoId: 'p2', tipo: 'entrada', quantidade: 40, data: '2026-01-10T08:00:00.000Z', observacao: 'Compra inicial - Fornecedor B' },
        { id: 'm3', produtoId: 'p3', tipo: 'entrada', quantidade: 20, data: '2026-01-15T09:00:00.000Z', observacao: 'Reposição - Fornecedor C' },
        { id: 'm4', produtoId: 'p1', tipo: 'saida', quantidade: 20, data: '2026-04-10T10:00:00.000Z', observacao: 'Vendas do período' },
        { id: 'm5', produtoId: 'p3', tipo: 'entrada', quantidade: 10, data: '2026-04-12T14:00:00.000Z', observacao: 'Reposição urgente' },
        { id: 'm6', produtoId: 'p8', tipo: 'entrada', quantidade: 8, data: '2026-04-15T10:00:00.000Z', observacao: 'Novo produto - Fornecedor D' },
        { id: 'm7', produtoId: 'p4', tipo: 'saida', quantidade: 5, data: '2026-04-18T11:00:00.000Z', observacao: 'Vendas do período' },
        { id: 'm8', produtoId: 'p5', tipo: 'saida', quantidade: 10, data: '2026-04-20T16:00:00.000Z', observacao: 'Vendas do período' },
        { id: 'm9', produtoId: 'p10', tipo: 'entrada', quantidade: 5, data: '2026-04-22T09:00:00.000Z', observacao: 'Compra - Fornecedor E' },
        { id: 'm10', produtoId: 'p9', tipo: 'entrada', quantidade: 50, data: '2026-04-25T08:00:00.000Z', observacao: 'Reposição em massa' }
      ]
    };
  },

  inserirDados() {
    // Usuários (colaboradores)
    this.seeds.colaboradores.forEach(c => Storage.registrarUsuario(c));

    // Clientes
    Storage.salvarClientes(this.seeds.clientes);

    // Produtos
    Storage.salvarProdutos(this.seeds.produtos);

    // Pedidos
    Storage.salvarPedidos(this.seeds.pedidos);

    // Movimentações
    Storage.salvarMovimentacoes(this.seeds.movimentacoes);
  }
};
