<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    

    let items = []; // List of customers
    let hotels = []; // List of hotels for dropdown
    let item; // Individual item for update
    let itemID; // ID of the item being updated
    let type = localStorage.getItem('action'); // 'update' or 'insert'

    // Form fields
    let updatedPersonID = '';
    let updatedHotelID = '';
    let updatedDateOfRegistration = '';
    let updatedFirstName = '';
    let updatedLastName = '';

    let updateVisibility = type !== 'insert';
    let createVisibility = type !== 'update';

    onMount(async () => {
        // Fetch list of hotels for the dropdown
        try {
            const hotelResponse = await fetch('http://localhost:3000/hotels');
            hotels = await hotelResponse.json();
        } catch (error) {
            console.error('Failed to fetch hotels:', error);
        }

        // Fetch customers if managing or a specific customer if updating
        if (type === 'update') {
            itemID = localStorage.getItem('itemID');
            try {
                const itemResponse = await fetch(`http://localhost:3000/customers/${itemID}`);
                item = await itemResponse.json();
                updatedPersonID = item.personID;
                updatedHotelID = item.hotelId;
                updatedDateOfRegistration = item.dateOfRegistration;
                updatedFirstName = item.firstName; // Assuming item includes these fields
                updatedLastName = item.lastName;
            } catch (error) {
                console.error('Failed to fetch customer:', error);
            }
        } else {
            // Fetch all customers for listing
            try {
                const response = await fetch('http://localhost:3000/customers');
                items = await response.json();
            } catch (error) {
                console.error('Failed to fetch customers:', error);
            }
        }
    });

    async function handleUpdate() {
        const updatedItem = {
            hotelId: updatedHotelID,
            dateOfRegistration: updatedDateOfRegistration,
            personID: updatedPersonID,
            firstName: updatedFirstName,
            lastName: updatedLastName
        };

        try {
            const response = await fetch(`http://localhost:3000/customers/${itemID}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedItem)
            });

            if (!response.ok) throw new Error('Failed to update customer');
            console.log('Customer updated successfully');
            navigate('/manage-customers'); // Adjust as needed
        } catch (error) {
            console.error('Error updating customer:', error);
        }
    }

    async function handleCreate() {
        const newItem = {
            hotelId: updatedHotelID,
            dateOfRegistration: updatedDateOfRegistration,
            personID: updatedPersonID,
            firstName: updatedFirstName,
            lastName: updatedLastName
        };

        try {
            const response = await fetch('http://localhost:3000/customers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newItem)
            });

            if (!response.ok) throw new Error('Failed to create customer');
            console.log('Customer created successfully');
            navigate('/manage-customers'); // Adjust as needed
        } catch (error) {
            console.error('Error creating customer:', error);
        }
    }
</script>

<div class="modal">
    <div class="modal-content">
        <h1 hidden={updateVisibility}>Update Customer</h1>
        <h1 hidden={createVisibility}>Create New Customer</h1>
        <div id="inputForm">
            <div class="form-group">
                <label>First Name:</label>
                <input type="text" bind:value={updatedFirstName}>
            </div>
            <div class="form-group">
                <label>Last Name:</label>
                <input type="text" bind:value={updatedLastName}>
            </div>
            <div class="form-group">
                <label>Person ID:</label>
                <input type="text" bind:value={updatedPersonID}>
            </div>
            <div class="form-group">
                <label>Hotel ID:</label>
                <select class="form-select" bind:value={updatedHotelID}>
                    {#each hotels as hotel}
                        <option value={hotel.id}>{hotel.name}</option> <!-- Assuming you want to show the hotel name -->
                    {/each}
                </select>
            </div>
            <div class="form-group">
                <label>Date of Registration:</label>
                <input type="date" bind:value={updatedDateOfRegistration}>
            </div>
            <button id='centerBtn' hidden={!updateVisibility} on:click={handleUpdate}>Update</button>
            <button id='centerBtn' hidden={!createVisibility} on:click={handleCreate}>Create</button>
        </div>
    </div>
</div>