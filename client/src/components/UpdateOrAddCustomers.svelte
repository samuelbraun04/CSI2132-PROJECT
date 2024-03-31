<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';

    let item;
    let itemID;
    let updatedPersonID;
    let updatedHotelID;
    let updatedDateOfRegistration;
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
            itemID = localStorage.getItem('itemID');

            try {
                const response = await fetch(`http://localhost:3000/customers/${itemID}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch item');
                }
                item = await response.json();

                updatedPersonID = item.personID;
                updatedHotelID = item.hotelID;
                updatedDateOfRegistration = item.dateOfRegistration;
            } catch (error) {
                console.error(error);
            }
        }
        else{
            updatedPersonID = "";
            updatedHotelID = "";
            updatedDateOfRegistration = "";
        }
    });
    
    async function handleUpdate() {
        const updatedItem = { hotelID: updatedHotelID, dateOfRegistration: updatedDateOfRegistration, personID: updatedPersonID };

        try {
            const response = await fetch(`http://localhost:3000/customers/${itemID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedItem)
            });

            if (!response.ok) { // If the HTTP status code is not in the 200-299 range
                const errorDetails = await response.json(); // or response.json() if your server sends JSON responses
                throw new Error(`Server responded with ${response.status}: ${errorDetails}`);
            }

            // Proceed if response is OK
            console.log('Item updated successfully');
        } catch (error) {
            console.error('Error updating item:', error.message);
    }

    localStorage.removeItem('itemPersonID');
    localStorage.removeItem('action');
    navigate('/manage-customers');
}

    async function handleCreate() {
        const newItem = { hotelID: updatedHotelID, dateOfRegistration: updatedDateOfRegistration, personID: updatedPersonID };
        
        //add item in database
        const response = await fetch('http://localhost:3000/customers', {
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
        navigate('/manage-customers');
    }
</script>

<div class="modal">
    <div class="modal-content">
            <h1 hidden={updateVisibility} >Update Customer</h1>
            <h1 hidden={createVisibility}>Create New Customer</h1>
            <div id=inputForm>
                <div class="form-group">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label>Person ID:</label>
                    <input type="text" bind:value={updatedPersonID}>
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
                <div class="form-group">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label>Date of Registration:</label>
                    <input type="date" bind:value={updatedDateOfRegistration}>
                </div>
            </div>
            
            
            <button id='centerBtn' hidden={updateVisibility} on:click={handleUpdate}>Update</button>
            <button id='centerBtn' hidden={createVisibility} on:click={handleCreate}>Create</button>
    </div>
</div>