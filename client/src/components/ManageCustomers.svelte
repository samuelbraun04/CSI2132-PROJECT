<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    
    let items = [];

    onMount(async () => {
        try {
            const response = await fetch('http://localhost:3000/customers');
            if (!response.ok) {
                throw new Error('Failed to fetch items');
            }
            items = await response.json();
        } catch (error) {
            console.error(error);
        }
    });

    async function handleDelete(id){
        try {
            const response = await fetch(`http://localhost:3000/customers/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                try {
                    const response = await fetch('http://localhost:3000/customers');
                    if (!response.ok) {
                        throw new Error('Failed to fetch items after deletion');
                    }
                    items = await response.json();
                } catch (error) {
                    console.error(error);
                }
                console.log('Item deleted successfully');
            } else {
                console.error('Failed to delete item');
            }
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    }

    function handleUpdate(item){
        localStorage.setItem('itemID', item.id);
        localStorage.setItem('action', 'update');
        navigate('/update-add-customers');
    }

    function handleInsert(){
        localStorage.setItem('action', 'insert');
        navigate('/update-add-customers');
    }

    function viewActiveCustomers(){
        navigate('/active-customers');
    }

    
</script>

<div>
    <h1>Manage Customers</h1>
    <button id=insertBtn on:click={() => handleInsert()}>Insert New Customer</button>
    <button id=insertBtn on:click={() => viewActiveCustomers()}>View Active Customers</button>
    <table>
        <thead>
            <tr>
                <th>Customer ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Hotel ID</th>
                <th>Date of Registration</th>
                <th>Actions</th>
            </tr>
        </thead>
        
        <tbody>
            {#each items as item}
                <tr>
                    <td>{item.id}</td>
                    <td>{item.firstName}</td>
                    <td>{item.lastName}</td>
                    <td>{item.hotelId}</td>
                    <td>{item.dateOfRegistration}</td>
                    <td>
                        <button on:click={() => handleUpdate(item)}>Update</button>
                        <button on:click={() => handleDelete(item.id)}>Delete</button>
                    </td>
                </tr>
            {/each}
        </tbody>
        
    </table>
</div>