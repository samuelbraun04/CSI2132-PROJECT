<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';

    let item;
    let itemID;
    let itemPaymentID;
    let itemBookingID;
    let updatedAmount;
    let updatedHotelID;
    let updatedPaymentDate;
    let hotels = [];

    let type = localStorage.getItem('action');
    let updateVisibility = (type != 'updatePayment');
    let createVisibility = (type != 'addPayment');

    onMount(async () => {

        try {
            const [hotelsRes] = await Promise.all([
                fetch('http://localhost:3000/hotels'),
            ]);

            // if (!customersRes.ok || !hotelsRes.ok || !roomsRes.ok) {
            //     throw new Error('One or more requests failed');
            // }

            hotels = await hotelsRes.json();
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }

        itemBookingID = localStorage.getItem("bookingID");

        //if updating a booking, get all the current data for that specific booking
        if (type == 'updatePayment'){
            itemID = localStorage.getItem('itemID');
            console.log(itemID);

            try {
                const response = await fetch(`http://localhost:3000/payments/${itemID}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch item');
                }
                item = await response.json();

                updatedAmount = item.amount;
                updatedPaymentDate = item.paymentDate;
                updatedHotelID = item.hotelId;
            } catch (error) {
                console.error(error);
            }
        }
        else{

            updatedAmount = "";
            updatedPaymentDate = "";
            updatedHotelID = "";

        }
    });
    
    async function handleUpdate() {
        const updatedItem = { 
            bookingID: itemBookingID,
            amount: updatedAmount,
            paymentDate: updatedPaymentDate,
            hotelId: updatedHotelID };

        //update item in database
        try {
            const response = await fetch(`http://localhost:3000/payments/${itemID}`, {
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
        navigate('/manage-bookings');
    }

    async function handleCreate() {
    const newItem = {
        bookingID: itemBookingID,
        amount: updatedAmount,
        paymentDate: updatedPaymentDate,
        hotelId: updatedHotelID
    };

    // Add item in database
    try {
        const response = await fetch('http://localhost:3000/payments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newItem)
        });
        
        if (!response.ok) {
            // Handle error
            throw new Error('Failed to create payment');
        }
        
        // Get the ID of the newly created payment
        const payment = await response.json();
        const newPaymentID = payment.id; // Make sure the server responds with the ID of the newly created payment

        // Now update the booking with the new payment ID
        const bookingUpdateResponse = await fetch(`http://localhost:3000/books/${itemBookingID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ paymentID: newPaymentID })
        });

        if (!bookingUpdateResponse.ok) {
            // If the update fails, handle it accordingly
            throw new Error('Failed to update booking with new payment ID');
        }

        console.log('Payment created and booking updated successfully');
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        // Clean up and navigate regardless of success or error
        localStorage.removeItem('itemID');
        localStorage.removeItem('bookingID');
        localStorage.removeItem('action');
        navigate('/manage-bookings');
    }
}

</script>

<div class="modal">
    <div class="modal-content">
            <h1 hidden={updateVisibility}>Update Payment</h1>
            <h1 hidden={createVisibility}>Create New Payment</h1>
            <div id=inputForm>
                <div class="form-group">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label>Amount:</label>
                    <input type="text" bind:value={updatedAmount}>
                </div>
                <div class="form-group">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label>Payment Date:</label>
                    <input type="date" bind:value={updatedPaymentDate}>
                </div>
                <div class="form-group">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label>Hotel ID:</label>
                    <select bind:value={updatedHotelID}>
                        {#each hotels as { id, name }}
                            <option value={id}>{name} ({id})</option>
                        {/each}
                    </select>
                </div>
            </div>
            
            <button id='centerBtn' hidden={updateVisibility} on:click={handleUpdate}>Update</button>
            <button id='centerBtn' hidden={createVisibility} on:click={handleCreate}>Create</button>
    </div>
</div>