<script>
    import { onMount } from 'svelte';
    
    let items = [];

    onMount(async () => {
        try {
            const response = await fetch('http://localhost:3000/hotel-chains');
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
            const response = await fetch(`http://localhost:3000/hotel-chains/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                try {
                    const response = await fetch('http://localhost:3000/hotel-chains');
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

</script>

<div>
    <h1>View Hotel Chains</h1>
    <table>
        <thead>
            <tr>
                <th>Hotel Chain ID</th>
                <th>Address</th>
                <th>Number of Hotels</th>
                <th>Email Address</th>
                <th>Phone Number</th>
            </tr>
        </thead>
        
        <tbody>
            {#each items as item}
                <tr>
                    <td>{item.id}</td>
                    <td>{item.address}</td>
                    <td>{item.numberOfHotels}</td>
                    <td>{item.emailAddress}</td>
                    <td>{item.phoneNumber}</td>
                    <td>
                        <button on:click={() => handleDelete(item.id)}>Delete</button>
                    </td>
                </tr>
            {/each}
        </tbody>
        
    </table>
</div>
