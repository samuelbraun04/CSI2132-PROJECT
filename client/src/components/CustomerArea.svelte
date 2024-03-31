<script>
    import { onMount } from 'svelte';
    
    let searchCriteria = ({
      startDate: '',
      endDate: '',
      capacity: '',
      area: '',
      hotelChain: '',
      category: '',
      totalRooms: '',
      price: ''
    });

    async function bookRoom(room) {
        const bookingDetails = {
            customerID: 1, // Example value, should be dynamically set based on the logged-in user
            roomNumber: room.roomNumber,
            startDate: searchCriteria.startDate,
            endDate: searchCriteria.endDate,
            hotelId: room.hotelId,
            paymentID: 123, // Example value, this could be generated or retrieved in a real scenario
        };

        const response = await fetch('http://localhost:3000/books', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingDetails),
        });

        if (response.ok) {
            // Handle success - maybe show a confirmation message or update the UI accordingly
            alert('Room booked successfully!');
        } else {
            // Handle error - maybe show an error message
            alert('Failed to book the room.');
        }
    }
  
    let rooms = [];
  
    async function fetchRooms() {
      const query = Object.entries(searchCriteria)
                    .filter(([, value]) => value)
                    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
                    .join('&');
  
      const response = await fetch(`http://localhost:3000/search?${query}`);
      rooms = await response.json();
    }
  
    onMount(fetchRooms);
  
    // Refetch rooms whenever search criteria changes
    $: fetchRooms(), searchCriteria;
  </script>
  
  <form on:submit|preventDefault={fetchRooms}>
    <label>
      Start Date:
      <input type="date" bind:value={searchCriteria.startDate}>
    </label>
    <label>
      End Date:
      <input type="date" bind:value={searchCriteria.endDate}>
    </label>
    <label>
      Capacity:
      <input type="number" min="1" bind:value={searchCriteria.capacity}>
    </label>
    <label>
      Area:
      <input type="text" bind:value={searchCriteria.area}>
    </label>
    <label>
      Hotel Chain:
      <input type="text" bind:value={searchCriteria.hotelChain}>
    </label>
    <label>
      Category:
      <select bind:value={searchCriteria.category}>
        <option value="">Select a category</option>
        <option value="1">1 star</option>
        <option value="2">2 stars</option>
        <option value="3">3 stars</option>
        <option value="4">4 stars</option>
        <option value="5">5 stars</option>
      </select>
    </label>
    <label>
      Total Rooms:
      <input type="number" min="1" bind:value={searchCriteria.totalRooms}>
    </label>
    <label>
      Price (Max):
      <input type="number" min="0" bind:value={searchCriteria.price}>
    </label>
  </form>
  
  {#if rooms.length > 0}
    <div>
        {#each rooms as room}
        <div class="room-details">
          <h2>{room.roomNumber} (${room.price})</h2>
          <p>Hotel: {room.name}</p>
          <p>Capacity: {room.capacity}</p>
          <p>View: {room.view}</p>
          <p>Status: {room.status}</p>
          <p>Extendable: {room.extendable}</p>
          <p>Amenities: {room.amenities}</p>
          <p>Damage Notes: {room.damages || 'None'}</p>
          <button on:click={() => bookRoom(room)}>Book</button>
        </div>
      {/each}      
    </div>
  {:else}
    <p>No rooms found. Please adjust your search criteria.</p>
  {/if}
  

