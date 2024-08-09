const menu = document.getElementById('menu')
const carBtn = document.getElementById('cart-btn')
const cartModal = document.getElementById('cart-modal')
const cartItemsContainer = document.getElementById('cart-items')
const cartTotal = document.getElementById('cart-total')
const checkoutBtn = document.getElementById('checkout-btn')
const closeModalBtn = document.getElementById('close-modal-btn')
const cartCounter = document.getElementById('cart-count')
const addressInput = document.getElementById('address')
const addressWarn = document.getElementById('address-warn')

let cart = [];

//abri o modal do carrinho
carBtn.addEventListener('click', function () {
    cartModal.style.display = "flex"
})

// fechar o modal quando clicar fora
cartModal.addEventListener('click', function (e) {
    if (e.target === cartModal) {
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener('click', function () {
    cartModal.style.display = "none"
})

menu.addEventListener('click', function (e) {
    //console.log(e.target)
    let parentButton = e.target.closest('.add-to-cart-btn')
    if (parentButton) {
        const name = parentButton.getAttribute('data-name')
        const price = parseFloat(parentButton.getAttribute('data-price'))
        addToCart(name, price)
    }

})

// função para adicionar no carrinho
function addToCart(name, price) {
    //fazendo uma verificação
    const existingItem = cart.find(item => item.name === name)
    if (existingItem) {
        existingItem.quantity += 1

    } else {
        cart.push({
            name,
            price,
            quantity: 1,


        })
    }

    updateCartModal()
}

//atualiza o carrinho
function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement('div')
        cartItemElement.classList.add('flex', 'justify-between', 'mb-4', 'flex-col')
        cartItemElement.innerHTML = `
        <div class='flex items-center justify-between'>
            <div>
                <p class='font-medium'>${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class='font-medium mt-2'>R$${item.price.toFixed(2)}</p>
                
            </div>
            
                <button class="remove-from-cart-btn" data-name="${item.name}">
                    Remover
                </button>
            
        </div>
        `
        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    cartCounter.innerHTML = cart.length;

}

// funcao para remover items do carrinho
cartItemsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('remove-from-cart-btn')) {
        const name = e.target.getAttribute('data-name')
        console.log(name);

        remoItemCart(name)
    }
})

function remoItemCart(name) {
    const index = cart.findIndex(item => item.name === name)
    if (index !== -1) {
        const item = cart[index]
        if (item.quantity > 1) {
            item.quantity -= 1
            updateCartModal()
            return
        }
        cart.splice(index, 1)
        updateCartModal()
    }
}

addressInput.addEventListener('input', function (e) {
    let inputValue = e.target.value

    if (inputValue !== '') {
        addressInput.classList.remove('border-red-500')
        addressWarn.classList.add('hidden')
    }
})
//finalizar pedido
checkoutBtn.addEventListener('click', function () {
    const aberto = checkestabelecimentoAberto()
    if (!aberto) {

        Toastify({
            text: "A loja está Fechada!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
            },
        }).showToast()
        return
    }
    if (cart.length == 0) return
    if (addressInput.value === '') {
        addressWarn.classList.remove('hidden')
        addressInput.classList.add("border-red-500")
        return
    }
    //enviar o pedido para api Whatsap
    const cartItems = cart.map((item) => {
        return (
            `${item.name} Quantidade: (${item.quantity}) Preço: R${item.price} |`
        )
    }).join('')
    console.log(cartItems)
    const menssage1 = encodeURIComponent(cartTotal.textContent)
    const message = encodeURIComponent(cartItems)
    const phone = "5521975966330"

    window.open(`https://wa.me/${phone}?text=${message}  ${menssage1}  Endereço: ${addressInput.value}`, "_blank")
    cart = []
    updateCartModal()
})
//verificar a hora e manipular o card horario
function checkestabelecimentoAberto() {
    const data = new Date()
    const hora = data.getHours()
    return hora >= 11 && hora < 23
    //true estabelecimento aberto
}

const spanItem = document.getElementById("date-span")
const aberto = checkestabelecimentoAberto()

if (aberto) {
    spanItem.classList.remove('bg-red-500')
    spanItem.classList.add('bg-green-600')
} else {
    spanItem.classList.remove('bg-green-600')
    spanItem.classList.add('bg-red-500')
}