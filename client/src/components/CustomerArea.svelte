<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    
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
    // Fetch hotel details including its city and hotel chain
    const hotelResponse = await fetch(`http://localhost:3000/hotels/${room.hotelId}`);
    if (!hotelResponse.ok) {
        alert('Failed to fetch hotel details.');
        return; // Stop execution if the hotel details couldn't be fetched
    }
    const hotel = await hotelResponse.json();

    // Construct the booking details with the additional hotel information
    const bookingDetails = {
        customerID: 1, // Dynamically set based on logged-in user
        roomNumber: room.roomNumber,
        startDate: searchCriteria.startDate,
        endDate: searchCriteria.endDate,
        hotelId: room.hotelId,
        paymentID: 123, // This could be generated or retrieved in real scenarios
        hotelCity: hotel.city,
        hotelChainName: hotel.hotelChainId, // Use the appropriate property for the hotel chain name
        hotelName: hotel.name
    };

    // Proceed to book the room
    const response = await fetch('http://localhost:3000/books', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingDetails),
    });

    if (response.ok) {
        // Store booking details in localStorage for use in the confirmation page
        localStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));
        navigate('/room-booked'); // Navigate to the booking confirmation page
    } else {
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
  
  <div>
    <h1>Search for a Hotel Room</h1>
    <form id="search" on:submit|preventDefault={fetchRooms}>
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
        City:
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
      <div class="container"> 
        {#each rooms as room}
          <div class="card">
            <div class="room-details">
              <h3>Room Number: {room.roomNumber} (${room.price})</h3>
              <p>Hotel: {room.name} ({room.hotelChainId})</p>
              <p>Location: {room.city}</p>
              <p>Capacity: {room.capacity}</p>
              <p>View: {room.view}</p>
              <p>Status: {room.status}</p>
              <p>Extendable: {room.extendable}</p>
              <p>Amenities: {room.amenities}</p>
              <p>Damage Notes: {room.damages || 'None'}</p>
              <button on:click={() => bookRoom(room)}>Book</button>
            </div>
          </div>
        {/each}
      </div>
  {:else}
    <p>No rooms found. Please adjust your search criteria.</p>
  {/if}

</div>
  

