<script>
    import { navigate } from 'svelte-routing';

    // Example script block for EmployeeArea
    // Implement functionality for managing bookings, check-ins, and processing payments

    const manageBookings = () => {
	    navigate('/manage-bookings');
	  };

    const manageHotels = () => {
	    navigate('/manage-hotels');
	  };

    const manageRooms = () => {
	    navigate('/manage-rooms');
	  };

    const manageEmployees = () => {
	    navigate('/manage-employees');
	  };

    const manageCustomers = () => {
	    navigate('/manage-customers');
	  };

    const views = () => {
	    navigate('/views');
	  };
  </script>

  
  
  <div>
    <h1>Admin</h1>
    <!-- Add your employee-specific UI here -->
    <button on:click={manageBookings}>Manage Bookings</button>
    <button on:click={manageHotels}>Manage Hotels</button>
    <button on:click={manageRooms}>Manage Rooms</button>
    <button on:click={manageEmployees}>Manage Employees</button>
    <button on:click={manageCustomers}>Manage Customers</button>
    <button on:click={views}>Views</button>
  </div>
  