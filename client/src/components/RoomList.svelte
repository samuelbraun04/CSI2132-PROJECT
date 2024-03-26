<script>

    import { onMount } from 'svelte';
    // Dummy data for the list of rooms
    let rooms = [
      { id: 1, type: 'Single', isAvailable: true },
      { id: 2, type: 'Double', isAvailable: false },
      { id: 3, type: 'Suite', isAvailable: true },
    ];
  
    // Function to simulate fetching room data
    // In a real app, you'd fetch this data from your backend
    function fetchRooms() {
      // fetch('/api/rooms').then(/* ... */);
    }
  
    // Simulate fetching rooms on component mount
    onMount(() => {
      fetchRooms();
    });
  </script>
  
  <h2>Room List</h2>
  <ul>
    {#each rooms as { id, type, isAvailable }}
      <li>
        Room {id} ({type}) - {isAvailable ? 'Available' : 'Booked'}
      </li>
    {/each}
  </ul>
  
  <style>
    /* Add your styling here */
  </style>
  