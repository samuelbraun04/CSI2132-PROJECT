<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';

    let item;
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
            itemPaymentID = localStorage.getItem('paymentID');

            try {
                const response = await fetch(`http://localhost:3000/payments/${itemPaymentID}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch item');
                }
                item = await response.json();

                updatedAmount = item.Amount;
                updatedPaymentDate = item.PaymentDate;
                updatedHotelID = item.hotelID;
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
            hotelID: updatedHotelID };

        //update item in database
        try {
            const response = await fetch(`http://localhost:3000/payments/${itemPaymentID}`, {
                method: 'PUT',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedItem)
            });
        } catch (error) {
        console.error('Error updating item:', error);
        }
        
        localStorage.removeItem('paymentID');
        localStorage.removeItem('bookingID');
        localStorage.removeItem('action');
        navigate('/manage-bookings');
    }

    async function handleCreate() {
        // Assuming updatedHotelID and updatedPaymentID are the new state variables that hold the selected hotel ID and payment ID
        const newItem = {
            bookingID: itemBookingID,
            amount: updatedAmount,
            paymentDate: updatedPaymentDate,
            hotelID: updatedHotelID
        };

        // Add item in database
        const response1 = await fetch('http://localhost:3000/payments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newItem)
        });


        //**********booking with id=bookingID needs to be updated so paymentID= id for the new payment in payment table


        localStorage.removeItem('bookingID');
        localStorage.removeItem('action');
        navigate('/manage-bookings');
    }
</script>

<div class="modal">
    <div class="modal-content">
            <h1 hidden={updateVisibility} >Update Payment</h1>
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