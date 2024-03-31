<script>
    import { onMount } from 'svelte';
  
    let roomsByCity = [];
  
    onMount(async () => {
      try {
        const response = await fetch('http://localhost:3000/hotels/rooms-by-city');
        if (response.ok) {
          roomsByCity = await response.json();
        } else {
          throw new Error('Failed to fetch rooms by city');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
  </script>
  
  <style>
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 8px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
  </style>
  
  <h1>Total Number of Rooms by City</h1>
  {#if roomsByCity.length > 0}
    <table>
      <thead>
        <tr>
          <th>City</th>
          <th>Total Number of Rooms</th>
        </tr>
      </thead>
      <tbody>
        {#each roomsByCity as room}
          <tr>
            <td>{room.city}</td>
            <td>{room.totalNumberOfRooms}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {:else}
    <p>Loading...</p>
  {/if}
