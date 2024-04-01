<script>
  import { onMount } from 'svelte';
  import { navigate } from 'svelte-routing';
  
  let items = [];
  let isPayment;

  onMount(async () => {
      try {
          const response = await fetch('http://localhost:3000/books');
          if (!response.ok) {
              throw new Error('Failed to fetch items');
          }
          items = await response.json();
      } catch (error) {
          console.error(error);
      }
  });

  function archiveBooking(bookingID) {
    const bookingDetails = getBookingDetails(bookingID);
    const customerDetails = getCustomerDetails(bookingDetails.customerID);
    
    const archiveEntry = {
        OriginalBookingID: bookingID,
        RoomNumber: bookingDetails.roomNumber,
        HotelID: bookingDetails.hotelID,
        CustomerID: customerDetails.customerID,
        CustomerName: customerDetails.name,
        StartDate: bookingDetails.startDate,
        EndDate: bookingDetails.endDate,
        Status: bookingDetails.status,
    };
    
    insertIntoBookingArchive(archiveEntry);
    deleteBooking(bookingID);
}

  async function toggleCheckIn(item) {
    const updatedCheckInStatus = !item.checkIn; // Determine the new check-in status

    try {
        const response = await fetch(`http://localhost:3000/books/${item.id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ ...item, checkIn: updatedCheckInStatus }),
        });

        if (!response.ok) {
            throw new Error('Failed to update check-in status.');
        }

        // Directly update the item in the items array
        const updatedItems = items.map(i => {
            if (i.id === item.id) {
                return { ...i, checkIn: updatedCheckInStatus }; // Update the checkIn status of the toggled item
            }
            return i; // Return other items unchanged
        });

        items = updatedItems; // Update the state to trigger reactivity
    } catch (error) {
        console.error('Error toggling check-in status:', error);
        alert(error.message);
    }
}

  async function handleDelete(id){
      try {
          const response = await fetch(`http://localhost:3000/books/${id}`, {
              method: 'DELETE'
          });
          if (response.ok) {
              try {
                  const response = await fetch('http://localhost:3000/books');
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
      navigate('/update-add-booking');
  }

  function handleInsert(){
      localStorage.setItem('action', 'insert');
      navigate('/update-add-booking');
  }

  function handleAddPayment(item){
      localStorage.setItem('bookingID', item.id);
      localStorage.setItem('action', 'addPayment');
      navigate('/update-add-payment');
  }

  function handleUpdatePayment(item){
      localStorage.setItem('bookingID', item.id);
      localStorage.setItem('paymentID', item.paymentID);
      localStorage.setItem('action', 'updatePayment');
      navigate('/update-add-payment');
  }
  
</script>

<div>
  <h1>Manage Bookings/Rentings</h1>
  <button id=insertBtn on:click={() => handleInsert()}>Insert New Booking/Renting</button>
  <table>
    <thead>
        <tr>
            <th>Booking ID</th>
            <th>Customer ID</th>
            <th>Hotel ID</th>
            <th>Room Number</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Payment ID</th>
            <th>Check-In Status</th>
            <th>Actions</th> <!-- Column for actions like Update, Delete, etc. -->
        </tr>
    </thead>
    <tbody>
        {#each items as item}
            <tr>
                <td>{item.id}</td>
                <td>{item.customerID}</td>
                <td>{item.hotelId}</td>
                <td>{item.roomNumber}</td>
                <td>{item.startDate}</td>
                <td>{item.endDate}</td>
                <td>{item.paymentID}</td>
                <td>{item.checkIn ? 'Renting' : 'Booked'}</td>
                <td>
                    <!-- Action Buttons -->
                    <button on:click={() => handleUpdate(item)}>Update</button>
                    <button on:click={() => handleDelete(item.id)}>Delete</button>
                    {#if item.paymentID}
                        <button on:click={() => handleUpdatePayment(item)}>Update Payment</button>
                    {:else}
                        <button on:click={() => handleAddPayment(item)}>Add Payment</button>
                    {/if}
                    <button on:click={() => toggleCheckIn(item)}>Toggle Check-In</button> <!-- New Button for Check-In -->
                </td>
            </tr>
        {/each}
    </tbody>
      
  </table>
</div>