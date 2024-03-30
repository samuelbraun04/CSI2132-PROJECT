<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    
    let items = [];

    onMount(async () => {
        try {
            const response = await fetch('http://localhost:3000/employees');
            if (!response.ok) {
                throw new Error('Failed to fetch items');
            }
            items = await response.json();
        } catch (error) {
            console.error(error);
        }
    });

    async function handleDelete(hotelId, roomNumber){
        try {
            const response = await fetch(`http://localhost:3000/employees/${SIN}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                try {
                    const response = await fetch('http://localhost:3000/employees');
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
        localStorage.setItem('itemSIN', item.SIN);
        localStorage.setItem('action', 'update');
        navigate('/update-add-employees');
    }

    function handleInsert(){
        localStorage.setItem('action', 'insert');
        navigate('/update-add-employees');
    }

    
</script>

<div>
    <h1>Manage Employees</h1>
    <button id=insertBtn on:click={() => handleInsert()}>Insert New Employee</button>
    <table>
        <thead>
            <tr>
                <th>SIN</th>
                <th>Person ID</th>
                <th>Positions</th>
                <th>Hotel ID</th>
            </tr>
        </thead>
        
        <tbody>
            {#each items as item}
                <tr>
                    <td>{item.SIN}</td>
                    <td>{item.personID}</td>
                    <td>{item.positions}</td>
                    <td>{item.hotelID}</td>
                    <td>
                        <button on:click={() => handleUpdate(item)}>Update</button>
                        <button on:click={() => handleDelete(item.hotelId, item.roomNumber)}>Delete</button>
                    </td>
                </tr>
            {/each}
        </tbody>
        
    </table>
</div>