<!-- src/App.svelte -->
<script>
	import { Router, Route, navigate } from 'svelte-routing';
	import CustomerArea from './components/CustomerArea.svelte';
	import EmployeeArea from './components/EmployeeArea.svelte';
    import Views from './components/Views.svelte';
	import ManageHotels from './components/ManageHotels.svelte';
    import ManageBookings from './components/ManageBookings.svelte';
    import ManageRooms from './components/ManageRooms.svelte';
    import ManageCustomers from './components/ManageCustomers.svelte';
    import ManageEmployees from './components/ManageEmployees.svelte';
  	import UpdateOrAddHotels from './components/UpdateOrAddHotels.svelte';
	import UpdateOrAddRooms from './components/UpdateOrAddRooms.svelte';
	import UpdateOrAddEmployees from './components/UpdateOrAddEmployees.svelte';
	import UpdateOrAddCustomers from './components/UpdateOrAddCustomers.svelte';
	import UpdateOrAddBooking from './components/UpdateOrAddBooking.svelte';
	import UpdateOrAddPayment from './components/UpdateOrAddPayment.svelte';
	import ManageHotelChains from './components/ManageHotelsChains.svelte'
	import RoomBooked from './components/RoomBooked.svelte';
    import Archive from './components/Archive.svelte';
	import ViewActiveCustomers from './components/ViewActiveCustomers.svelte';
	
	let email = '';
	let password = '';
	let role = 'customer'; // default role
	let loggedIn = false; // new reactive variable for login state
  
	const handleSubmit = () => {
	  // Validate login credentials here with backend...
	  // For demonstration, we'll assume login is successful
	  loggedIn = true;
	  
	  if (role === 'customer') {
		navigate('/customer-area', { replace: true });
	  } else {
		navigate('/employee-area', { replace: true });
	  }
	};
  </script>
  
  {#if !loggedIn}
  	<h1>Login</h1>
	<div class="login-form">
	  <input id="login" type="email" bind:value={email} placeholder="Email" />
	  <input id="login" type="password" bind:value={password} placeholder="Password" />
	  <label><input type="radio" bind:group={role} value="customer" />Customer</label>
	  <label><input type="radio" bind:group={role} value="employee" />Employee</label>
	</div>
	<button id='centerBtn' on:click={handleSubmit}>Log In</button>
  {:else}
	<Router>
	  <Route path="/customer-area" component={CustomerArea} />
	  <Route path="/employee-area" component={EmployeeArea} />
	  <Route path="/manage-bookings" component={ManageBookings} />
	  <Route path="/manage-hotels" component={ManageHotels} />
      <Route path="/manage-rooms" component={ManageRooms} />
   	  <Route path="/manage-customers" component={ManageCustomers} />
      <Route path="/manage-employees" component={ManageEmployees} />
      <Route path="/views" component={Views} />
	  <Route path="/update-add-hotels" component={UpdateOrAddHotels} />
	  <Route path="/update-add-rooms" component={UpdateOrAddRooms} />
	  <Route path="/update-add-employees" component={UpdateOrAddEmployees} />
	  <Route path="/update-add-customers" component={UpdateOrAddCustomers} />
	  <Route path="/update-add-booking" component={UpdateOrAddBooking} />
	  <Route path="/update-add-payment" component={UpdateOrAddPayment} />
	  <Route path="/manage-hotel-chains" component={ManageHotelChains} />
	  <Route path="/room-booked" component={RoomBooked} />
	  <Route path="/the-archive" component={Archive} />
	  <Route path='/active-customers' component={ViewActiveCustomers} />

	  <!-- ... other routes ... -->
	</Router>
  {/if}
  