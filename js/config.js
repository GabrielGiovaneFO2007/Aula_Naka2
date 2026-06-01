/* ============================================================
   BarberFacil - Configuração
   ============================================================ */

const APP_CONFIG = {
  name: 'BarberFácil',
  version: '2.0.0',

  // Conta administrador fixa
  admin: {
    cpf: '00000000000',
    nome: 'Administrador',
    senha: 'admin123',
    role: 'admin'
  },

  // Chaves do localStorage
  storageKeys: {
    usuarios: 'bf_usuarios',
    clientes: 'bf_clientes',
    produtos: 'bf_produtos',
    pedidos: 'bf_pedidos',
    movimentacoes: 'bf_movimentacoes',
    sessao: 'bf_sessao',
    seeded: 'bf_seeded'
  },

  // Categorias de produtos
  categorias: [
    'Pomada',
    'Shampoo',
    'Condicionador',
    'Óleo para Barba',
    'Cera',
    'Hidratante',
    'Pós-barba',
    'Navalha/Lâmina',
    'Tesoura',
    'Acessório',
    'Outro'
  ],

  // Métodos de pagamento
  metodosPagamento: ['PIX', 'Dinheiro', 'Cartão Crédito', 'Cartão Débito', 'Transferência'],

  // Status de pagamento
  statusPagamento: ['Concluído', 'Pendente'],

  // Tempo de alerta toast (ms)
  toastDuration: 3000
};
