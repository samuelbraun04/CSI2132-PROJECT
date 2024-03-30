<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';

    let item;
    let itemHotelID;
    let itemRoomNumber;
    let updatedRoomNumber;
    let updatedHotelId;
    let updatedPrice;
    let updatedCapacity;
    let updatedStatus;
    let updatedView;
    let updatedExtendable;
    let updatedAmenities;
    let updatedDamages;
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
            itemHotelID = localStorage.getItem('itemHotelID');
            itemRoomNumber = localStorage.getItem('itemRoomNumber');

            try {
                const response = await fetch(`http://localhost:3000/rooms/${itemHotelID}/${itemRoomNumber}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch item');
                }
                item = await response.json();

                updatedRoomNumber = item.roomNumber;
                updatedHotelId = item.hotelId;
                updatedPrice = item.price;
                updatedCapacity = item.capacity;
                updatedStatus = item.status;
                updatedView = item.view;
                updatedExtendable = item.extendable;
                updatedAmenities = item.amenities;
                updatedDamages = item.damages;
            } catch (error) {
                console.error(error);
            }
        }
        else{
            updatedRoomNumber = "";
            updatedHotelId = "";
            updatedPrice = "";
            updatedCapacity = "";
            updatedStatus = "";
            updatedView = "";
            updatedExtendable = "";
            updatedAmenities = "";
            updatedDamages = "";
        }
    });
    
    async function handleUpdate() {
        const updatedItem = { updatedPrice, updatedCapacity, updatedStatus, updatedView, updatedExtendable, updatedAmenities, updatedDamages };

        //update item in database
        try {
            const response = await fetch(`http://localhost:3000/rooms/${itemHotelID}/${itemRoomNumber}`, {
                method: 'PUT',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedItem)
            });
        } catch (error) {
        console.error('Error updating item:', error);
        }
        
        localStorage.removeItem('itemHotelID');
        localStorage.removeItem('itemRoomNumber');
        localStorage.removeItem('action');
        navigate('/manage-rooms');
    }

    async function handleCreate() {
        const newItem = { updatedRoomNumber, updatedHotelId, updatedPrice, updatedCapacity, updatedStatus, updatedView, updatedExtendable, updatedAmenities, updatedDamages };
        
        //add item in database
        const response = await fetch('http://localhost:3000/rooms', {
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
        navigate('/manage-rooms');
    }
</script>

<div class="modal">
    <div class="modal-content">
            <h1 hidden={updateVisibility} >Update Hotel Room</h1>
            <h1 hidden={createVisibility}>Create New Hotel Room</h1>
            <div id=inputForm>
                <div class="form-group">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label>Room Number:</label>
                    <input type="text" bind:value={updatedRoomNumber}>
                </div>
                <div class="form-group">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label>Hotel ID:</label>
                    <select class="form-select" bind:value={updatedHotelId}>
                        {#each hotels as hotel}
                            <option value={hotel.id}>{hotel.id}</option>
                        {/each}
                    </select>
                </div>
                <div class="form-group">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label>Price:</label>
                    <input type="text" bind:value={updatedPrice}>
                </div>
                <div class="form-group">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label>Capacity:</label>
                    <input type="text" bind:value={updatedCapacity}>
                </div>
                <div class="form-group">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label>Status:</label>
                    <select class="form-select" bind:value={updatedStatus}>
                        <option value="Available">Available</option>
                        <option value="Occupied">Occupied</option>
                        <option value="Maintenance">Maintenance</option>
                    </select>
                </div>
                <div class="form-group">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label>View:</label>
                    <select class="form-select" bind:value={updatedView}>
                        <option value="Mountain">Mountain</option>
                        <option value="Sea">Sea</option>
                        <option value="None">None</option>
                    </select>
                </div>
                <div class="form-group">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label>Extendable:</label>
                    <select class="form-select" bind:value={updatedExtendable}>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                </div>
                <div class="form-group">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label>Amenities:</label>
                    <input type="text" bind:value={updatedAmenities}>
                </div>
                <div class="form-group">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label>Damages:</label>
                    <input type="text" bind:value={updatedDamages}>
                </div>
            </div>
            
            
            <button id='centerBtn' hidden={updateVisibility} on:click={handleUpdate}>Update</button>
            <button id='centerBtn' hidden={createVisibility} on:click={handleCreate}>Create</button>
    </div>
</div>