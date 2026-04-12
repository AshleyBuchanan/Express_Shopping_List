document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
        e.stopPropagation();

        const confirmButton = document.querySelectorAll('.confirm-btn')[0];
        const form = document.querySelector('.new-item-form');
        const card = e.target.closest('.items-card');
        const rect = card.getBoundingClientRect();
        const id = card.dataset.id;
        const cardName = card.querySelectorAll('.item-block')[0].textContent.trim();
        const cardPrice = card.querySelectorAll('.item-block')[1].textContent.trim();

        if (!form.classList.contains('show')) {

            form.classList.add('show');
            confirmButton.classList.remove('off');
            form.style.width = `${rect.width}px`;
            form.style.top = `${rect.top - 8}px`;
            form.style.left = `${rect.left - 8}px`;
            form.dataset.id = id;

            const nameField = form.querySelector('[name="name"]');
            const priceField = form.querySelector('[name="price"]');

            nameField.value = cardName;
            priceField.value = cardPrice;
            nameField.focus();

        } else {
            form.classList.remove('show');
            confirmButton.classList.add('off');

            const name = form.querySelector('[name="name"]');
            const price = form.querySelector('[name="price"]');
            const item = { name: name.value, price: price.value, id:id };

            try {
                if (item.name === "" || item.price === "") throw new Error('must have values');

                const res = await fetch(`/items/${id}`, {
                    body: JSON.stringify(item),
                    method: 'PATCH',
                    headers: {'Content-Type': 'application/json'}
                });

                if (!res.ok) {
                    throw new Error(`Patch failed with status ${res.status}`);
                };

                await res.json();
                name.value = "";
                price.value = "";

                window.location.reload();
            } catch (err) {
                console.error('patch failed', err);
            };
        };
    });
});

document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
        e.stopPropagation();

        const card = e.target.closest('.items-card');
        const id = card.dataset.id;

        try {
            const res = await fetch(`/items/${id}`, {
                method: 'DELETE'
            });

            if (!res.ok) {
                throw new Error(`Delete failed with status ${res.status}`);
            };

            await res.json();
            card.remove();
        } catch (err) {
            console.error('delete failed', err);
        };
    });
});

document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
        e.stopPropagation();

        const confirmButton = document.querySelectorAll('.confirm-btn')[1];
        const form = document.querySelector('.new-item-form');
        const card = e.target.closest('.items-card');
        const rect = card.getBoundingClientRect();

        if (!form.classList.contains('show')) {

            form.classList.add('show');
            confirmButton.classList.remove('off');
                    console.log(confirmButton)

            form.style.width = `${rect.width}px`;
            form.style.top = `${rect.top - 8}px`;
            form.style.left = `${rect.left - 8}px`;

            const field = form.querySelector('[name="name"]');
            field.focus();
        } else {

            form.classList.remove('show');
            confirmButton.classList.add('off');
            const name = form.querySelector('[name="name"]');
            const price = form.querySelector('[name="price"]');
            const item = { name: name.value, price: price.value };

            try {
                if (item.name === "" || item.price === "") throw new Error('Both fields must have values');

                const res = await fetch(`/items/`, {
                    body: JSON.stringify(item),
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'}
                });

                if (!res.ok) {
                    throw new Error(`Post failed with status ${res.status}`);
                };

                await res.json();
                name.value=""
                price.value=""

                localStorage.setItem('scrollToLast', 'true');
                window.location.reload();
            } catch (err) {
                console.error('post failed', err);
            }; 
        };
    });
});

//this needs to be fixed.
window.addEventListener('load', () => {
    if (localStorage.getItem('scrollToLast')) {
        localStorage.removeItem('scrollToLast');

        const cards = document.querySelectorAll('.items-card');
        const lastCard = cards[cards.length - 0]; 

        if (lastCard) {
            lastCard.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        };
    };
});