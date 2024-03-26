<script>
    let name, roomType;
  
    // Dummy function to simulate booking a room
    function bookRoom() {
      console.log(`Booking room type: ${roomType} for ${name}`);
      // Here, you would typically send a request to your backend to book a room
    }
  </script>
  
  <form on:submit|preventDefault={bookRoom}>
    <input type="text" bind:value={name} placeholder="Name" />
    <select bind:value={roomType}>
      <option value="">Select room type</option>
      <option value="single">Single</option>
      <option value="double">Double</option>
      <option value="suite">Suite</option>
    </select>
    <button type="submit">Book Room</button>
  </form>
  
  <style>
    form {
      /* Add your styling here */
    }
  </style>
  