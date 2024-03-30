<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';

    let item;
    let itemID;
    let updatedID;
    let updatedCustomerID;
    let updatedHotelID;
    let updatedRoomNumber;
    let updatedStartDate;
    let updatedEndDate;
    let hotels = [];

    let type = localStorage.getItem('action');
    let updateVisibility = (type != 'update');
    let createVisibility = (type != 'insert');

    onMount(async () => {

        //if updating a booking, get all the current data for that specific booking
        if (type == 'update'){
            itemID = localStorage.getItem('itemID');

            try {
                const response = await fetch(`http://localhost:3000/books/${itemID}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch item');
                }
                item = await response.json();

                updatedID = item.id
                updatedCustomerID = item.customerID;
                updatedHotelID = "";
                updatedRoomNumber = item.roomNumber;
                updatedStartDate = item.startDate;
                updatedEndDate = item.endDate;
            } catch (error) {
                console.error(error);
            }
        }
        else{
            updatedID="";
            updatedCustomerID = "";
            updatedHotelID = "";
            updatedRoomNumber = "";
            updatedStartDate = "";
            updatedEndDate = "";
        }
    });
    
    async function handleUpdate() {
        const updatedItem = { customerID: updatedCustomerID, roomNumber: updatedRoomNumber, startDate: updatedStartDate, endDate: updatedEndDate };

        //update item in database
        try {
            const response = await fetch(`http://localhost:3000/books/${itemID}`, {
                method: 'PUT',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedItem)
            });
        } catch (error) {
        console.error('Error updating item:', error);
        }
        
        localStorage.removeItem('itemCustomerID');
        localStorage.removeItem('action');
        navigate('/manage-bookings');
    }

    async function handleCreate() {
        const newItem = { customerID: updatedCustomerID, roomNumber: updatedRoomNumber, startDate: updatedStartDate, endDate: updatedEndDate };
        
        //add item in database
        const response = await fetch('http://localhost:3000/books', {
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
        navigate('/manage-bookings');
    }
</script>

<div class="modal">
    <div class="modal-content">
            <h1 hidden={updateVisibility} >Update Booking</h1>
            <h1 hidden={createVisibility}>Create New Booking</h1>
            <div id=inputForm>
                <div class="form-group">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label>Customer ID:</label>
                    <input type="text" bind:value={updatedCustomerID}>
                </div>
                <div class="form-group">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label>Hotel ID:</label>
                    <input type="text" bind:value={updatedHotelID}>
                </div>
                <div class="form-group">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label>Room Number:</label>
                    <input type="text" bind:value={updatedRoomNumber}>
                </div>
                <div class="form-group">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label>Start Date:</label>
                    <input type="date" bind:value={updatedStartDate}>
                </div>
                <div class="form-group">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label>End Date:</label>
                    <input type="date" bind:value={updatedEndDate}>
                </div>
            </div>
            
            
            <button id='centerBtn' hidden={updateVisibility} on:click={handleUpdate}>Update</button>
            <button id='centerBtn' hidden={createVisibility} on:click={handleCreate}>Create</button>
    </div>
</div>