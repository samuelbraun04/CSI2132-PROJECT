<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    
    let items = [];

    onMount(async () => {
        try {
            const response = await fetch('http://localhost:3000/hotels');
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
            const response = await fetch(`http://localhost:3000/hotels/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                try {
                    const response = await fetch('http://localhost:3000/hotels');
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
        navigate('/update-add-hotels');
    }

    function handleInsert(){
        localStorage.setItem('action', 'insert');
        navigate('/update-add-hotels');
    }

</script>

<div>
    <h1>Manage Hotels</h1>
    <button id=insertBtn on:click={() => handleInsert()}>Insert New Hotel</button>
    <table>
        <thead>
            <tr>
                <th>Hotel ID</th>
                <th>Hotel Name</th>
                <th>Hotel Chain ID</th>
                <th>Stars</th>
                <th>Address</th>
                <th>Number of Rooms</th>
                <th>Email</th>
                <th>Phone Number</th>
            </tr>
        </thead>
        
        <tbody>
            {#each items as item}
                <tr>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.hotelChainId}</td>
                    <td>{item.stars}</td>
                    <td>{item.address}</td>
                    <td>{item.numberOfRooms}</td>
                    <td>{item.emailAddress}</td>
                    <td>{item.phoneNumber}</td>
                    <td>
                        <button on:click={() => handleUpdate(item)}>Update</button>
                        <button on:click={() => handleDelete(item.id)}>Delete</button>
                    </td>
                </tr>
            {/each}
        </tbody>
        
    </table>
</div>
