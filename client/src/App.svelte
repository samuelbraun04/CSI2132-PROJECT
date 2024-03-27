<!-- src/App.svelte -->
<script>
	import { Router, Route, navigate } from 'svelte-routing';
	import CustomerArea from './components/CustomerArea.svelte';
	import EmployeeArea from './components/EmployeeArea.svelte';
	
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
	<div class="login-form">
	  <h2>Login</h2>
	  <input type="email" bind:value={email} placeholder="Email" />
	  <input type="password" bind:value={password} placeholder="Password" />
	  <label>
		<input type="radio" bind:group={role} value="customer" />
		Customer
	  </label>
	  <label>
		<input type="radio" bind:group={role} value="employee" />
		Employee
	  </label>
	  <button on:click={handleSubmit}>Log In</button>
	</div>
  {:else}
	<Router>
	  <Route path="/customer-area" component={CustomerArea} />
	  <Route path="/employee-area" component={EmployeeArea} />
	  <!-- ... other routes ... -->
	</Router>
  {/if}
  