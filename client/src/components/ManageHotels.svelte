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
    <button on:click={() => handleInsert()}>Insert New Hotel</button>
    <li>
        <div>
            <div><!-- svelte-ignore a11y-label-has-associated-control -->
                <label>Hotel Name:</label>
            </div>
            <div>
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label>Hotel Chain Id:</label>
            </div>
            <div>
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label>Stars:</label>
            </div>
            <div>
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label>Address:</label>
            </div>
            <div>
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label>Number of Rooms:</label>
            </div>
            <div>
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label>Email:</label>
            </div>
            <div>
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label>Phone Number:</label>
            </div>
        </div>
        

        {#each items as item}
            <div>
                <div>
                    <input type="text" value={item.name} readonly>
                </div>
                <div>
                    <input type="text" value={item.hotelChainId} readonly>
                </div>
                <div>
                    <input type="text" value={item.stars} readonly>
                </div>
                <div>
                    <input type="text" value={item.address} readonly>
                </div>
                <div>
                    <input type="text" value={item.numberOfRooms} readonly>
                </div>
                <div>
                    <input type="text" value={item.emailAddress} readonly>
                </div>
                <div>   
                    <input type="text" value={item.phoneNumber} readonly>
                </div>
                <div>
                    <button on:click={() => handleUpdate(item)}>Update</button>
                    <button on:click={() => handleDelete(item.id)}>Delete</button>
                </div>
            </div>
        {/each}
    </li>
</div>

<!-- Modal Component for Update Form -->
<!-- svelte-ignore missing-declaration -->
<!--{#if selectedItem != null}
    <Modal {selectedItem} {updateItem}/>
{/if}-->

