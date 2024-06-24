document.addEventListener('DOMContentLoaded', function () {
    const app = document.getElementById('app');
    const productList = document.getElementById('product-list');
    const productForm = document.getElementById('product-form');

    let products = [];

    productForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const price = document.getElementById('price').value;

        const product = {
            id: Date.now(),
            name,
            price
        };

        products.push(product);
        renderProducts();
        productForm.reset();
    });

    function renderProducts() {
        productList.innerHTML = '';
        products.forEach(product => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${product.name} - ${product.price} 
                <button data-id="${product.id}" class="edit-btn">Edit</button>
                <button data-id="${product.id}" class="delete-btn">Delete</button>
            `;
            productList.appendChild(li);
        });

        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                const product = products.find(p => p.id == id);
                document.getElementById('name').value = product.name;
                document.getElementById('price').value = product.price;
                products = products.filter(p => p.id != id);
                renderProducts();
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                products = products.filter(p => p.id != id);
                renderProducts();
            });
        });
    }
});
