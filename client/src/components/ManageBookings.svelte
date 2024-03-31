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
  <h1>Manage Bookings</h1>
  <button id=insertBtn on:click={() => handleInsert()}>Insert New Booking</button>
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
                <td>
                    <div display=block>
                        <button on:click={() => handleUpdate(item)}>Update</button>
                        <button on:click={() => handleDelete(item.id)}>Delete</button>
                    </div>
                    <div display=block>
                        <button hidden={item.paymentID != ""} on:click={() => handleAddPayment(item)}>Add Payment</button>
                        <button hidden={item.paymentID == ""} on:click={() => handleUpdatePayment(item)}>Update Payment</button>
                    </div>
                    
                </td>
              </tr>
          {/each}
      </tbody>
      
  </table>
</div>