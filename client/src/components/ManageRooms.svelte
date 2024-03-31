<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    
    let items = [];

    onMount(async () => {
        try {
            const response = await fetch('http://localhost:3000/rooms');
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
            const response = await fetch(`http://localhost:3000/rooms/${hotelId}/${roomNumber}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                try {
                    const response = await fetch('http://localhost:3000/rooms');
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
        localStorage.setItem('itemHotelID', item.hotelId);
        localStorage.setItem('itemRoomNumber', item.roomNumber);
        localStorage.setItem('action', 'update');
        navigate('/update-add-rooms');
    }

    function handleInsert(){
        localStorage.setItem('action', 'insert');
        navigate('/update-add-rooms');
    }

    
</script>

<div>
    <h1>Manage Hotel Rooms</h1>
    <button id=insertBtn on:click={() => handleInsert()}>Insert New Hotel Room</button>
    <table>
        <thead>
            <tr>
                <th>Room Number</th>
                <th>Hotel ID</th>
                <th>Price</th>
                <th>Capacity</th>
                <th>Status</th>
                <th>View</th>
                <th>Extendable</th>
                <th>Amenities</th>
                <th>Damages</th>
            </tr>
        </thead>
        
        <tbody>
            {#each items as item}
                <tr>
                    <td>{item.roomNumber}</td>
                    <td>{item.hotelId}</td>
                    <td>{item.price}</td>
                    <td>{item.capacity}</td>
                    <td>{item.status}</td>
                    <td>{item.view}</td>
                    <td>{item.extendable}</td>
                    <td>{item.amenities}</td>
                    <td>{item.damages}</td>
                    <td>
                        <button on:click={() => handleUpdate(item)}>Update</button>
                        <button on:click={() => handleDelete(item.hotelId, item.roomNumber)}>Delete</button>
                    </td>
                </tr>
            {/each}
        </tbody>
        
    </table>
</div>