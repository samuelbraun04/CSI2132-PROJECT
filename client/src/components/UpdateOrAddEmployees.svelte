<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';

    let item;
    let updatedSIN;
    let updatedPersonID;
    let updatedPositions;
    let updatedHotelID;
    let hotels = [];

    let type = localStorage.getItem('action');
    let updateVisibility = (type != 'update');
    let createVisibility = (type != 'insert');

    onMount(async () => {

        //get list of all hotel chains for drop-down
        try {
            const response = await fetch('http://localhost:3000/hotels');
            if (!response.ok) {
                throw new Error('Failed to fetch items');
            }
            hotels = await response.json();
        } catch (error) {
            console.error(error);
        }

        //if updating a hotel, get all the current data for that specific hotel
        if (type == 'update'){
            itemSIN = localStorage.getItem('SIN');

            try {
                const response = await fetch(`http://localhost:3000/employees/${itemSIN}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch item');
                }
                item = await response.json();

                updatedSIN = item.SIN;
                updatedPersonID = item.personID;
                updatedPositions = item.positions;
                updatedHotelID = item.hotelID;
            } catch (error) {
                console.error(error);
            }
        }
        else{
            updatedSIN = "";
            updatedPersonID = "";
            updatedPositions = "";
            updatedHotelID = "";
        }
    });
    
    async function handleUpdate() {
        const updatedItem = { personID: updatedPersonID, positions: updatedPositions, hotelID: updatedHotelID };

        //update item in database
        try {
            const response = await fetch(`http://localhost:3000/employees/${itemSIN}`, {
                method: 'PUT',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedItem)
            });
        } catch (error) {
        console.error('Error updating item:', error);
        }
        
        localStorage.removeItem('itemSIN');
        localStorage.removeItem('action');
        navigate('/manage-employees');
    }

    async function handleCreate() {
        const newItem = { SIN: updatedSIN, personID: updatedPersonID, positions: updatedPositions, hotelID: updatedHotelID };
        
        //add item in database
        const response = await fetch('http://localhost:3000/employees', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newItem)
        });
        if (response.ok) {
            // Handle success
            console.log('Item created successfully');
        } else {
            // Handle error
            console.error('Failed to create item');
        }
        
        localStorage.removeItem('action');
        navigate('/manage-employees');
    }
</script>

<div class="modal">
    <div class="modal-content">
            <h1 hidden={updateVisibility} >Update Employee</h1>
            <h1 hidden={createVisibility}>Create New Employee</h1>
            <div id=inputForm>
                <div class="form-group">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label>SIN:</label>
                    <input hidden={updateVisibility} type="text" bind:value={updatedSIN} readonly>
                    <input hidden={createVisibility} type="text" bind:value={updatedSIN}>
                </div>
                <div class="form-group">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label>Person ID:</label>
                    <input type="text" bind:value={updatedPersonID}>
                </div>
                <div class="form-group">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label>Positions:</label>
                    <input type="text" bind:value={updatedPositions}>
                </div>
                <div class="form-group">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label>Hotel ID:</label>
                    <select class="form-select" bind:value={updatedHotelID}>
                        {#each hotels as hotel}
                            <option value={hotel.id}>{hotel.id}</option>
                        {/each}
                    </select>
                </div>
            </div>
            
            
            <button id='centerBtn' hidden={updateVisibility} on:click={handleUpdate}>Update</button>
            <button id='centerBtn' hidden={createVisibility} on:click={handleCreate}>Create</button>
    </div>
</div>