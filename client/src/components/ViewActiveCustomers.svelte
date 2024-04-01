<!-- src/routes/MultipleBookings.svelte -->
<script>
    import { onMount } from 'svelte';
  
    let customersWithMultipleBookings = [];
  
    onMount(async () => {
      try {
        const response = await fetch('http://localhost:3000/customers/multiple-bookings');
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        customersWithMultipleBookings = await response.json();
      } catch (error) {
        console.error('Failed to load customers with multiple bookings:', error);
      }
    });
  </script>
  
  <style>
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    th {
      background-color: #f2f2f2;
    }
  </style>
  
  <h1>Customers with Multiple Bookings</h1>
  
  {#if customersWithMultipleBookings.length > 0}
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Number Of Bookings</th>
        </tr>
      </thead>
      <tbody>
        {#each customersWithMultipleBookings as { id, firstName, lastName, NumberOfBookings }}
          <tr>
            <td>{id}</td>
            <td>{firstName}</td>
            <td>{lastName}</td>
            <td>{NumberOfBookings}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {:else}
    <p>No customers with 3 or more bookings found.</p>
  {/if}
  