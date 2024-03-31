<script>
  import { onMount } from 'svelte';
  import { navigate } from 'svelte-routing';
  
  let itemsRoomsByCity = [];
  let itemsTotalCapacity = [];

  onMount(async () => {
      try {
          const response = await fetch('http://localhost:3000/hotels/rooms-by-city');
          if (!response.ok) {
              throw new Error('Failed to fetch items');
          }
          itemsRoomsByCity = await response.json();
      } catch (error) {
          console.error(error);
      }

      try {
          const response = await fetch('http://localhost:3000/hotels/total-capacity');
          if (!response.ok) {
              throw new Error('Failed to fetch items');
          }
          itemsTotalCapacity = await response.json();
      } catch (error) {
          console.error(error);
      }
  });
</script>

<div>
  <h1>Views</h1>
  <h2>View 1: Number of Rooms per Area</h2>
  <table>
      <thead>
          <tr>
            <th>City</th>
              <th>Total Number of Rooms</th>
          </tr>
      </thead>
      
      <tbody>
          {#each itemsRoomsByCity as item}
              <tr>
                <td>{item.city}</td>
                <td>{item.totalNumberOfRooms}</td>
              </tr>
          {/each}
      </tbody>
      
  </table>

  <h2>View 2: Total Capacity of Each Hotel</h2>
  <table>
      <thead>
          <tr>
            <th>Hotel Name</th>
              <th>Total Capacity</th>
          </tr>
      </thead>
      
      <tbody>
          {#each itemsTotalCapacity as item}
              <tr>
                <td>{item.hotelName}</td>
                <td>{item.totalCapacity}</td>
              </tr>
          {/each}
      </tbody>
      
  </table>
</div>