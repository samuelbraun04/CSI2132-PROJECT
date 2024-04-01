<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';

    let item;
    let itemID;
    let updatedID;
    let updatedCustomerID;
    let updatedhotelId;
    let updatedRoomNumber;
    let updatedStartDate;
    let updatedEndDate;
    let updatedPaymentID;
    let checkInStatus = false;
    let customers = [];
    let hotels = [];
    let rooms = [];
    let payments = [];

    let type = localStorage.getItem('action');
    let updateVisibility = (type != 'update');
    let createVisibility = (type != 'insert');

    onMount(async () => {

        try {
            const [customersRes, hotelsRes, roomsRes, paymentsRes] = await Promise.all([
                fetch('http://localhost:3000/customers-with-names'),
                fetch('http://localhost:3000/hotels'),
                fetch('http://localhost:3000/rooms'),
                fetch('http://localhost:3000/payments')
            ]);

            // if (!customersRes.ok || !hotelsRes.ok || !roomsRes.ok) {
            //     throw new Error('One or more requests failed');
            // }

            customers = await customersRes.json();
            hotels = await hotelsRes.json();
            rooms = await roomsRes.json();
            payments = await paymentsRes.json();

        } catch (error) {
            console.error("Failed to fetch data:", error);
        }

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
                updatedhotelId = item.hotelId;
                updatedPaymentID = item.paymentID;
                checkInStatus = item.checkIn;
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
            updatedhotelId = "";
            updatedRoomNumber = "";
            updatedStartDate = "";
            updatedEndDate = "";
            updatedPaymentID = "";
            checkInStatus = false;

        }
    });
    
    async function handleUpdate() {
        const updatedItem = { customerID: updatedCustomerID, roomNumber: updatedRoomNumber, startDate: updatedStartDate, endDate: updatedEndDate, hotelId: updatedhotelId, paymentID: updatedPaymentID, checkIn: checkInStatus};

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
        // Assuming updatedhotelId and updatedPaymentID are the new state variables that hold the selected hotel ID and payment ID
        const newItem = {
            customerID: updatedCustomerID,
            roomNumber: updatedRoomNumber,
            startDate: updatedStartDate,
            endDate: updatedEndDate,
            hotelId: updatedhotelId, // Include this in your newItem object
            paymentID: updatedPaymentID, // Include this in your newItem object
            checkIn: checkInStatus
        };
        console.log('testing');
        // Add item in database
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
            <h1 hidden={createVisibility}>Create New Booking/Renting</h1>
            <div id=inputForm>
                <div class="form-group">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label>Customer ID:</label>
                    <select bind:value={updatedCustomerID}>
                        {#each customers as customer}
                            <option value={customer.id}>{customer.firstName} {customer.lastName}</option>
                        {/each}
                    </select>
                </div>
                <div class="form-group">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label>Hotel ID:</label>
                    <select bind:value={updatedhotelId}>
                        {#each hotels as { id, name }}
                            <option value={id}>{name} ({id})</option>
                        {/each}
                    </select>
                </div>
                <div class="form-group">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label>Room Number:</label>
                    <select bind:value={updatedRoomNumber}>
                        {#each rooms as { roomNumber }}
                            <option value={roomNumber}>{roomNumber}</option>
                        {/each}
                    </select>
                </div>
                <div class="form-group">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label>Payment ID:</label>
                    <select bind:value={updatedPaymentID}>
                      {#each payments as payment}
                        <option value={payment.id}>{payment.id} - ${payment.amount} on {payment.paymentDate}</option>
                      {/each}
                    </select>
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
                <div class="form-group">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label>Check In Status:</label>
                <select bind:value={checkInStatus}>
                    <option value="true">Renting</option>
                    <option value="false">Booked</option>
                </select>
                </div>
                <!-- svelte-ignore a11y-label-has-associated-control -->
                
            </div>
            
            <button id='centerBtn' hidden={updateVisibility} on:click={handleUpdate}>Update</button>
            <button id='centerBtn' hidden={createVisibility} on:click={handleCreate}>Create</button>
    </div>
</div>