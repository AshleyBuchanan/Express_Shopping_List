document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = e.target.closest('.items-card');
        const id = card.dataset.id;
        console.log('update', id);
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
            }

            await res.json();
            card.remove();
        } catch (err) {
            console.error('delete failed', err);
        }    
    });
});

document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const form = document.querySelector('.new-item-form');
        const card = e.target.closest('.items-card');
        const width = card.getBoundingClientRect().width;

        if (!form.classList.contains('show')) {

            form.classList.add('show');
            form.style.width = `${width}px`;
            const field = form.querySelector('[name="name"]');
            field.focus();
        } else {
            form.classList.remove('show');

            const name = form.querySelector('[name="name"]');
            const price = form.querySelector('[name="price"]');
            const item = { name:name.value, price:price.value };

            try {
                if (item.name === "" || item.price === "") throw new Error('must have values');

                const res = await fetch(`/items/`, {
                    body: JSON.stringify(item),
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'}
                });

                if (!res.ok) {
                    throw new Error(`Post failed with status ${res.status}`);
                }

                await res.json();
                name.value=""
                price.value=""

                window.location.reload();
            } catch (err) {
                console.error('post failed', err);
            }    
        };
    });
});
