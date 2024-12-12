
// Toggle tree structure
document.querySelectorAll('.tree-item').forEach(item => {
    item.addEventListener('click', event => {
        const nested = item.nextElementSibling;
        if (nested && nested.classList.contains('nested')) {
            nested.classList.toggle('active');
            item.classList.toggle('caret-down');
            nested.style.display = nested.style.display === 'block' ? 'none' : 'block';
        }
    });
});

// Handle checkbox selection
document.querySelectorAll('.searchtree input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', event => {
        event.stopPropagation();

        // Update descendants
        const updateDescendants = (checkbox, isChecked) => {
            const parentLi = checkbox.closest('li');
            if (parentLi) {
                const nested = parentLi.querySelector('.nested');
                if (nested) {
                    nested.querySelectorAll('input[type="checkbox"]').forEach(descendant => {
                        descendant.checked = isChecked;
                    });
                }
            }
        };

        // Update ancestors
        const updateAncestors = checkbox => {
            let parentUl = checkbox.closest('ul').parentNode.closest('ul');
            while (parentUl) {
                const parentCheckbox = parentUl.closest('li')?.querySelector('input[type="checkbox"]');
                if (parentCheckbox) {
                    const siblings = Array.from(parentUl.querySelectorAll('li > label > input[type="checkbox"]'));
                    parentCheckbox.checked = siblings.every(sibling => sibling.checked);
                }
                parentUl = parentUl.parentNode.closest('ul');
            }
        };

        updateDescendants(checkbox, checkbox.checked);
        updateAncestors(checkbox);
    });
});

// Collect checked values on button click
document.getElementById('searchButton').addEventListener('click', () => {
    const checkedValues = Array.from(
        document.querySelectorAll('.left-content input[type="checkbox"]:checked')
    ).map(checkbox => checkbox.value);

    alert(`Selected items: ${checkedValues.join(', ')}`);
});

