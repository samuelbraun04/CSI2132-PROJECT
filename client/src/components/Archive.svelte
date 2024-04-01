<script>
    import { onMount } from 'svelte';
  
    let archives = [];
  
    onMount(async () => {
      const response = await fetch('http://localhost:3000/archive');
      if (response.ok) {
        archives = await response.json();
      } else {
        console.error('Failed to fetch archive data');
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
  
  <div>
    <h1>Booking Archive</h1>
    <table>
      <thead>
        <tr>
          <th>Archive ID</th>
          <th>Original Booking ID</th>
          <th>Customer ID</th>
          <th>Hotel ID</th>
          <th>Room Number</th>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Payment ID</th>
          <th>Check-In</th>
          <th>Archived At</th>
        </tr>
      </thead>
      <tbody>
        {#each archives as archive}
          <tr>
            <td>{archive.ArchiveID}</td>
            <td>{archive.OriginalBookingID}</td>
            <td>{archive.CustomerID}</td>
            <td>{archive.HotelID}</td>
            <td>{archive.RoomNumber}</td>
            <td>{archive.StartDate}</td>
            <td>{archive.EndDate}</td>
            <td>{archive.PaymentID}</td>
            <td>{archive.CheckIn ? 'Yes' : 'No'}</td>
            <td>{archive.ArchivedAt}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  