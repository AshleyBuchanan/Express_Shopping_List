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
