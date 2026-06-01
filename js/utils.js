/* ============================================================
   BarberFacil - Utilitários
   ============================================================ */

const Utils = {
  // Sanitizar HTML para prevenir XSS
  escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  // Formatar CPF: 000.000.000-00
  formatarCpf(cpf) {
    const digits = this.somenteNumeros(cpf);
    if (digits.length !== 11) return cpf || '';
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  },

  // Extrair apenas números
  somenteNumeros(str) {
    if (!str) return '';
    return String(str).replace(/\D/g, '');
  },

  // Validar CPF (11 dígitos numéricos)
  validarCpf(cpf) {
    const digits = this.somenteNumeros(cpf);
    return digits.length === 11;
  },

  // Formatar moeda BRL: R$ 1.234,56
  formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  },

  // Formatar data: 01/06/2026
  formatarData(dataISO) {
    if (!dataISO) return '';
    const d = new Date(dataISO);
    return d.toLocaleDateString('pt-BR');
  },

  // Formatar data e hora: 01/06/2026 14:30
  formatarDataHora(dataISO) {
    if (!dataISO) return '';
    const d = new Date(dataISO);
    return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  },

  // Gerar data ISO atual
  dataAtual() {
    return new Date().toISOString();
  },

  // Gerar ID único simples
  gerarId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  },

  // Formatar telefone: (62) 99999-9999
  formatarTelefone(tel) {
    const digits = this.somenteNumeros(tel);
    if (digits.length === 11) {
      return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return tel || '';
  },

  // Mostrar notificação toast
  toast(mensagem, tipo = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;
    toast.innerHTML = this.escapeHtml(mensagem);
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 300);
    }, APP_CONFIG.toastDuration);
  },

  // Limpar formulário
  limparFormulario(formId) {
    const form = document.getElementById(formId);
    if (form) form.reset();
    // Remover classes de erro
    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    document.querySelectorAll('.error-text').forEach(el => el.classList.remove('show'));
  }
};
