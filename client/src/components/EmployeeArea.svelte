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

      const manageHotelChains = () => {
	    navigate('/manage-hotel-chains');
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
    <div id=adminPage class='container'>
      <div class="first-div">
        <button id=employeeButtons on:click={manageBookings}>Manage Bookings</button>
        <button id=employeeButtons on:click={manageHotelChains}>Manage Hotel Chains</button>
        <button id=employeeButtons on:click={manageHotels}>Manage Hotels</button>
        <button id=employeeButtons on:click={manageRooms}>Manage Rooms</button>
      </div>
      <div class="second-div">
        <button id=employeeButtons on:click={manageEmployees}>Manage Employees</button>
        <button id=employeeButtons on:click={manageCustomers}>Manage Customers</button>
        <button id=employeeButtons on:click={views}>Views</button>
      </div>
    </div>
  </div>
  