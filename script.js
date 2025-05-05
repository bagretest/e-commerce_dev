// --- Variáveis Globais ---
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelectorAll('.nav-link'); // Seleciona todos os elementos com a classe 'nav-link'
const pageSections = document.querySelectorAll('.page-section'); // Seleciona todos os elementos com a classe 'page-section'
const searchButton = document.getElementById('search-button');
const accountButton = document.getElementById('account-button');
const cartButton = document.getElementById('cart-button'); // Ícone/botão do carrinho no cabeçalho
const searchModal = document.getElementById('search-modal');
const accountModal = document.getElementById('account-modal');
const closeButtons = document.querySelectorAll('.close-button'); // Seleciona todos os elementos com a classe 'close-button'
const yearSpan = document.getElementById('current-year'); // Span para exibir o ano atual no rodapé
const productImage = document.getElementById('product-image'); // Elemento de imagem na página do produto
const productName = document.getElementById('product-name'); // Elemento H1 para o nome do produto na página do produto
const productPrice = document.getElementById('product-price'); // Parágrafo para o preço do produto
const addToCartButton = document.getElementById('add-to-cart-button'); // Botão para adicionar o produto ao carrinho
const cartItemsContainer = document.getElementById('cart-items-container'); // Div onde os itens do carrinho são exibidos
const emptyCartMessage = document.getElementById('empty-cart-message'); // Mensagem exibida quando o carrinho está vazio
const cartSummary = document.getElementById('cart-summary'); // Div contendo o resumo do carrinho (subtotal, total)
const cartSubtotalEl = document.getElementById('cart-subtotal'); // Span para o subtotal do carrinho
const cartTotalEl = document.getElementById('cart-total'); // Span para o total do carrinho
const cartCountEl = document.getElementById('cart-count'); // Span exibindo o número de itens no ícone do carrinho

let currentProductData = null; // Variável para armazenar os dados do produto atualmente visualizado
let cart = []; // Array para armazenar os itens adicionados ao carrinho

// --- Funções ---

/**
 * Abre um modal adicionando a classe 'show'.
 * @param {string} modalId - O ID do elemento modal a ser aberto.
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show'); // Adiciona a classe 'show' para exibir e animar
    }
}

/**
 * Fecha um modal removendo a classe 'show'.
 * @param {string} modalId - O ID do elemento modal a ser fechado.
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show'); // Remove a classe 'show' para ocultar o modal
    }
}

/**
 * Atualiza a exibição do carrinho de compras na interface.
 * Limpa os itens existentes e redesenha com base no array `cart`.
 * Calcula e exibe o subtotal e o total.
 * Atualiza o contador de itens no cabeçalho.
 */
function updateCartDisplay() {
    // Limpa os itens anteriores do carrinho
    cartItemsContainer.innerHTML = '';
    let subtotal = 0;

    if (cart.length === 0) {
        // Exibe a mensagem de carrinho vazio e oculta o resumo se o carrinho estiver vazio
        emptyCartMessage.style.display = 'block';
        cartSummary.classList.add('hidden');
    } else {
        // Oculta a mensagem de carrinho vazio e exibe o resumo
        emptyCartMessage.style.display = 'none';
        cartSummary.classList.remove('hidden');

        // Itera pelos itens do carrinho e cria o HTML para cada um
        cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('flex', 'items-center', 'justify-between', 'bg-white', 'p-4', 'rounded-lg', 'shadow');
            // Formata o preço corretamente (BRL)
            const itemPriceFormatted = parseFloat(item.preco.replace(',', '.')).toFixed(2).replace('.', ',');
            const itemTotalFormatted = (parseFloat(item.preco.replace(',', '.')) * item.quantity).toFixed(2).replace('.', ',');

            itemElement.innerHTML = `
                <div class="flex items-center space-x-4">
                    <img src="${item.img}" alt="${item.nome}" class="w-16 h-20 object-cover rounded">
                    <div>
                        <h3 class="font-semibold">${item.nome}</h3>
                        <p class="text-sm text-gray-500">Quantidade: ${item.quantity}</p>
                        <p class="text-sm text-gray-600">R$ ${itemPriceFormatted}</p>
                    </div>
                </div>
                <div class="flex items-center space-x-2">
                     <span class="font-semibold">R$ ${itemTotalFormatted}</span>
                     <button class="text-red-500 hover:text-red-700" onclick="removeFromCart(${index})">
                        <!-- Ícone de lixeira -->
                        <i class="lucide" style="font-size: 1.2rem;">&#xea9b;</i>
                     </button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
            // Adiciona o preço do item * quantidade ao subtotal
            subtotal += parseFloat(item.preco.replace(',', '.')) * item.quantity;
        });
    }

    // Atualiza a exibição do subtotal e total (formatado como BRL)
    cartSubtotalEl.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    cartTotalEl.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`; // Supondo frete grátis por enquanto
    // Atualiza o contador de itens no cabeçalho
    cartCountEl.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Adiciona um produto ao array de carrinho (`cart`).
 * Se o produto já existir, incrementa sua quantidade.
 * Atualiza a exibição do carrinho em seguida.
 * @param {object} productData - Os dados do produto a ser adicionado (deve incluir id, nome, preco, img).
 */
function addToCart(productData) {
    if (!productData) {
        console.error("addToCart chamado com dados de produto inválidos");
        return;
    }

    // Verifica se o item já existe no carrinho
    const existingItemIndex = cart.findIndex(item => item.id === productData.id);

    if (existingItemIndex > -1) {
        // Se o item já existe, incrementa a quantidade
        cart[existingItemIndex].quantity += 1;
    } else {
        // Se o item é novo, adiciona ao carrinho com quantidade 1
        cart.push({ ...productData, quantity: 1 });
    }
    // Atualiza a exibição do carrinho
    updateCartDisplay();
    // Opcional: Exibe uma notificação de confirmação
    showNotification(`${productData.nome} adicionado ao carrinho!`);
    // Opcional: Navega automaticamente para a página do carrinho após adicionar
    // navigateTo('cart');
}

/**
 * Remove um item do array de carrinho pelo índice.
 * Atualiza a exibição do carrinho em seguida.
 * @param {number} index - O índice do item a ser removido no array `cart`.
 */
function removeFromCart(index) {
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1); // Remove o item no índice especificado
        updateCartDisplay(); // Atualiza a exibição do carrinho
    } else {
        console.error("removeFromCart chamado com índice inválido:", index);
    }
}

/**
 * Exibe uma notificação simples no canto inferior direito da tela.
 * A notificação aparece gradualmente e desaparece após alguns segundos.
 * @param {string} message - A mensagem de texto a ser exibida.
 */
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    // Aplica estilos básicos (também pode usar uma classe CSS como 'simple-notification')
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = 'rgba(0,0,0,0.8)';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '1000';
    notification.style.opacity = '0'; // Começa transparente
    notification.style.transition = 'opacity 0.5s ease'; // Transição de fade
    document.body.appendChild(notification);

    // Aparece gradualmente
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10); // Pequeno atraso para garantir que a transição seja acionada

    // Desaparece e remove após 3 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        // Aguarda a transição de desaparecimento antes de remover
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 500); // Duração da transição
    }, 3000); // Duração visível da notificação
}

/**
 * Lida com a navegação entre diferentes seções da página.
 * Oculta todas as seções, depois exibe a seção alvo.
 * Atualiza o estado ativo dos links de navegação.
 * Atualiza os detalhes do produto se estiver navegando para a página do produto.
 * Atualiza a exibição do carrinho se estiver navegando para a página do carrinho.
 * Rola a janela para o topo.
 * @param {string} pageId - O sufixo do ID da seção da página a ser exibida (ex.: 'home', 'masculino').
 * @param {object|null} [data=null] - Dados opcionais, usados para detalhes da página do produto.
 */
function navigateTo(pageId, data = null) {
    // Oculta todas as seções da página
    pageSections.forEach(section => {
        section.classList.remove('active');
    });

    // Exibe a seção alvo da página
    const targetPage = document.getElementById(`page-${pageId}`);
    if (targetPage) {
        targetPage.classList.add('active');
    } else {
        console.warn(`Seção da página com ID 'page-${pageId}' não encontrada.`);
        // Opcionalmente, navega para uma página padrão como home
        // document.getElementById('page-home').classList.add('active');
        // pageId = 'home'; // Ajusta pageId se redirecionando
    }

    // Atualiza o estilo do link ativo nos menus de navegação
    navLinks.forEach(link => {
        link.classList.remove('active');
        // Verifica ambos os menus desktop/mobile e links do rodapé
        if (link.dataset.page === pageId) {
            link.classList.add('active');
        }
    });

    // Se estiver navegando para a página do produto, atualiza seu conteúdo
    if (pageId === 'produto' && data) {
        currentProductData = data; // Armazena os dados para o botão 'Adicionar ao Carrinho'
        productImage.src = data.img || 'https://placehold.co/600x800/cccccc/ffffff?text=Produto';
        productImage.alt = data.nome || 'Imagem do Produto';
        productName.textContent = data.nome || 'Nome do Produto';
        productPrice.textContent = `R$ ${data.preco || '0,00'}`;
        // Atualiza as miniaturas se existirem e os dados fornecerem informações relevantes
        const thumbnailsContainer = targetPage.querySelector('.flex.space-x-2.mt-4'); // Seletor mais específico
        if (thumbnailsContainer) {
            const thumbnails = thumbnailsContainer.querySelectorAll('img');
            if (thumbnails.length > 0 && data.img) {
                // Exemplo: Atualiza a primeira miniatura com base na estrutura da URL da imagem principal
                try {
                    thumbnails[0].src = data.img.replace('600x800', '100x120');
                } catch (e) {
                    thumbnails[0].src = 'https://placehold.co/100x120/cccccc/ffffff?text=Thumb+1'; // Alternativa
                }
                // Adiciona lógica aqui para atualizar outras miniaturas, se necessário
            }
        }
    }

    // Se estiver navegando para a página do carrinho, garante que esteja atualizada
    if (pageId === 'cart') {
        updateCartDisplay();
    }

    // Fecha o menu móvel se estiver aberto
    mobileMenu.classList.add('hidden');

    // Rola para o topo da página para melhor UX
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Rolagem suave
}

// --- Event Listeners ---

// Alterna a visibilidade do menu móvel
if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
} else {
    console.warn("Botão do menu móvel ou elemento do menu não encontrado.");
}

// Cliques nos links de navegação (Desktop, Mobile, Rodapé)
navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault(); // Previne o comportamento padrão do link (recarregar a página)
        const pageId = link.dataset.page;
        if (pageId) {
            navigateTo(pageId);
        } else if (link.id === 'cart-button') {
            // Tratamento especial para o botão do ícone do carrinho se não tiver data-page='cart'
            navigateTo('cart');
        } else {
            console.warn("Link de navegação clicado sem atributo 'data-page':", link);
        }
    });
});

// Botões de disparo de modal
if (searchButton) {
    searchButton.addEventListener('click', () => openModal('search-modal'));
}
if (accountButton) {
    accountButton.addEventListener('click', () => openModal('account-modal'));
}

// Botões de fechar modal (o 'x' dentro dos modais)
closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Encontra o elemento modal pai mais próximo e o fecha
        const modal = button.closest('.modal');
        if (modal) {
            closeModal(modal.id);
        }
    });
});

// Fecha o modal ao clicar no fundo de sobreposição
window.addEventListener('click', (event) => {
    // Se o elemento clicado for a própria sobreposição do modal
    if (event.target.classList.contains('modal')) {
        closeModal(event.target.id);
    }
});

// Botão de adicionar ao carrinho na página do produto
if (addToCartButton) {
    addToCartButton.addEventListener('click', () => {
        // Passa os dados do produto atualmente armazenados para a função addToCart
        addToCart(currentProductData);
    });
} else {
    console.warn("Botão de adicionar ao carrinho não encontrado.");
}

// --- Inicialização ---

// Define o ano atual no rodapé
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// Garante que a página inicial seja exibida por padrão quando o script carregar
// Usa DOMContentLoaded para garantir que o HTML esteja pronto antes de navegar
document.addEventListener('DOMContentLoaded', () => {
    navigateTo('home');
    // Atualiza a exibição do carrinho inicialmente (ex.: se os dados do carrinho foram carregados do armazenamento)
    updateCartDisplay();
});
