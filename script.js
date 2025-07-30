
let carrinho = [];

function adicionarCarrinho(nome, preco) {
  carrinho.push({ nome, preco });
  atualizarCarrinho();
}

function atualizarCarrinho() {
  document.getElementById("contador-carrinho").textContent = carrinho.length;
}

document.getElementById("finalizar").addEventListener("click", function () {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio.");
    return;
  }

  const cep = document.getElementById("cep").value;
  const endereco = document.getElementById("endereco-cep").textContent;

  let mensagem = "Pedido:%0A";
  let total = 0;

  carrinho.forEach((item, index) => {
    mensagem += `${index + 1}. ${item.nome} - R$ ${item.preco},00%0A`;
    total += item.preco;
  });

  mensagem += `%0ATotal: R$ ${total},00`;
  if (cep) mensagem += `%0ACEP: ${cep}`;
  if (endereco) mensagem += `%0A${endereco}`;

  const url = `https://wa.me/5581999999999?text=${mensagem}`;
  window.open(url, "_blank");
});

// CEP com ViaCEP + frete estimado
document.addEventListener('input', async function (e) {
  if (e.target.id === 'cep') {
    const cep = e.target.value.replace(/\D/g, '');

    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
          document.getElementById('endereco-cep').textContent = 'CEP não encontrado.';
          document.getElementById('frete-estimado').textContent = '';
          return;
        }

        const enderecoFormatado = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
        document.getElementById('endereco-cep').textContent = `Endereço: ${enderecoFormatado}`;

        // Estimar frete
        const inicio = parseInt(cep.substring(0, 2));
        let estimativa = 'R$ 30,00 (estimado)';
        if (inicio >= 10 && inicio <= 29) estimativa = 'R$ 15,00 (SP, RJ)';
        if (inicio >= 30 && inicio <= 59) estimativa = 'R$ 20,00 (Centro-Oeste/Sul)';
        if (inicio >= 60 && inicio <= 79) estimativa = 'R$ 25,00 (Nordeste)';
        if (inicio >= 80) estimativa = 'R$ 30,00 (Norte)';

        document.getElementById('frete-estimado').textContent = `Frete estimado: ${estimativa}`;
      } catch (err) {
        document.getElementById('endereco-cep').textContent = 'Erro ao consultar o CEP.';
      }
    }
  }
});
