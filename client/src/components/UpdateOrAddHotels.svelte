<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';

    let item;
    let itemID;
    let updatedName;
    let updatedHotelChainId;
    let updatedStars;
    let updatedAddress;
    let updatedCity; // Added the city field

    let updatedNumberOfRooms;
    let updatedEmailAddress;
    let updatedPhoneNumber;
    let hotelChains = [];
    let type = localStorage.getItem('action');
    let updateVisibility = (type != 'update');
    let createVisibility = (type != 'insert');

    onMount(async () => {
    // Get list of all hotel chains for drop-down
    try {
        const response = await fetch('http://localhost:3000/hotel-chains');
        if (!response.ok) {
            throw new Error('Failed to fetch items');
        }
        hotelChains = await response.json();
    } catch (error) {
        console.error("Failed to fetch hotel chains:", error);
    }

    // If updating a hotel, get all the current data for that specific hotel
    if (type == 'update') {
        itemID = localStorage.getItem('itemID'); // Ensure this is dynamic

        try {
            const response = await fetch(`http://localhost:3000/hotels/${itemID}`);
            if (!response.ok) {
                throw new Error('Failed to fetch hotel details');
            }
            item = await response.json();

            // Update state variables with the fetched hotel details
            updatedName = item.name;
            updatedHotelChainId = item.hotelChainId;
            updatedStars = String(item.stars);
            updatedAddress = item.address;
            updatedCity = item.city; // Added city field
            updatedNumberOfRooms = item.numberOfRooms;
            updatedEmailAddress = item.emailAddress;
            updatedPhoneNumber = item.phoneNumber;
        } catch (error) {
            console.error("Failed to fetch hotel details:", error);
        }
    } else {
        // Initialize state variables for creating a new hotel
        updatedName = "";
        updatedHotelChainId = null;
        updatedStars = null;
        updatedAddress = "";
        updatedCity = ""; // Added city field
        updatedNumberOfRooms = "";
        updatedEmailAddress = "";
        updatedPhoneNumber = "";
    }
});
    
    async function handleUpdate() {
        const updatedItem = { hotelChainId: updatedHotelChainId, name: updatedName, stars: updatedStars, address: updatedAddress, city: updatedCity, // Added city field
            numberOfRooms: updatedNumberOfRooms, emailAddress: updatedEmailAddress, phoneNumber: updatedPhoneNumber};
        
        //update item in database
        try {
            const response = await fetch(`http://localhost:3000/hotels/${itemID}`, {
                method: 'PUT',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedItem)
            });
        } catch (error) {
        console.error('Error updating item:', error);
        }
        
        localStorage.removeItem('item');
        localStorage.removeItem('action');
        navigate('/manage-hotels');
    }

    async function handleCreate() {
        const newItem = { hotelChainId: updatedHotelChainId, name: updatedName, stars: updatedStars, address: updatedAddress, city: updatedCity, // Added city field
            numberOfRooms: updatedNumberOfRooms, emailAddress: updatedEmailAddress, phoneNumber: updatedPhoneNumber};
        
        //add item in database
        const response = await fetch('http://localhost:3000/hotels', {
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
        navigate('/manage-hotels');
    }
</script>

<div class="modal">
    <div class="modal-content">
            <h1 hidden={updateVisibility} >Update Hotel</h1>
            <h1 hidden={createVisibility}>Create New Hotel</h1>
            <div id=inputForm>
                <div class="form-group">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label>Hotel Name:</label>
                    <input type="text" bind:value={updatedName}>
                </div>
                <div class="form-group">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label>Hotel Chain Id:</label>
                    <!--<input type="text" bind:value={updatedHotelChainId}>-->
                    <select class="form-select" bind:value={updatedHotelChainId}>
                        {#each hotelChains as hotelChain}
                            <option value={hotelChain.id}>{hotelChain.id}</option>
                        {/each}
                    </select>
                </div>
                <div class="form-group">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label>Stars:</label>
                    <select class="form-select" bind:value={updatedStars}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                </div>
                <div class="form-group">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label>Address:</label>
                    <input type="text" bind:value={updatedAddress}>
                </div>
                <div class="form-group">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label>City:</label> <!-- Added city field -->
                    <input type="text" bind:value={updatedCity}>
                </div>
                <div class="form-group">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label>Number of Rooms:</label>
                    <input type="text" bind:value={updatedNumberOfRooms}>
                </div>
                <div class="form-group">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label>Email Address:</label>
                    <input type="text" bind:value={updatedEmailAddress}>
                </div>
                <div class="form-group">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label>Phone Number:</label>
                    <input type="text" bind:value={updatedPhoneNumber}>
                </div>
            </div>
 
            <button id='centerBtn' hidden={updateVisibility} on:click={handleUpdate}>Update</button>
            <button id='centerBtn' hidden={createVisibility} on:click={handleCreate}>Create</button>
    </div>
</div>
