<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
  
    let updatedSIN = '';
    let updatedFirstName = '';
    let updatedLastName = '';
    let updatedPersonID = '';
    let updatedPositions = '';
    let updatedHotelID = '';
    let hotels = [];
  
    let actionType = localStorage.getItem('action');
    // Correct visibility toggles based on the action type
    let updateVisibility = actionType === 'update';
    let createVisibility = actionType === 'insert';
  
    onMount(async () => {
        try {
            const response = await fetch('http://localhost:3000/hotels');
            hotels = await response.json();
        } catch (error) {
            console.error('Failed to fetch hotels:', error);
        }
  
        if (actionType === 'update') {
            const SIN = localStorage.getItem('employeeData');
            try {
                const response = await fetch(`http://localhost:3000/employees/${SIN}`);
                if (!response.ok) throw new Error('Failed to fetch employee details');
                
                const employee = await response.json();
                updatedSIN = employee.SIN;
                updatedFirstName = employee.firstName;
                updatedLastName = employee.lastName;
                updatedPersonID = employee.personID;
                updatedPositions = employee.positions;
                updatedHotelID = employee.hotelId;
            } catch (error) {
                console.error('Failed to fetch employee:', error);
            } } else {
                // Fetch all customers for listing
                updatedSIN = '';
                updatedFirstName = '';
                updatedLastName = '';
                updatedPersonID = '';
                updatedPositions = '';
                updatedHotelID = '';
            }
        });
  
    async function handleUpdate() {
        const updatedItem = { SIN: updatedSIN, firstName: updatedFirstName, lastName: updatedLastName, personID: updatedPersonID, positions: updatedPositions, hotelId: updatedHotelID };
        try {
            await fetch(`http://localhost:3000/employees/${updatedSIN}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedItem)
            });
            console.log('Employee updated successfully');
            navigate('/manage-employees');
        } catch (error) {
            console.error('Error updating employee:', error);
        }
    }
  
    async function handleCreate() {
        const newItem = { SIN: updatedSIN, firstName: updatedFirstName, lastName: updatedLastName, personID: updatedPersonID, positions: updatedPositions, hotelId: updatedHotelID };
        try {
            await fetch('http://localhost:3000/employees', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newItem)
            });
            console.log('Employee created successfully');
            navigate('/manage-employees');
        } catch (error) {
            console.error('Error creating employee:', error);
        }
    }
  </script>


<div class="modal">
    <div class="modal-content">
        <h1 hidden={!updateVisibility}>Update Employee</h1>
        <h1 hidden={!createVisibility}>Create New Employee</h1>
        <div id="inputForm">
            <div class="form-group">
                <label>SIN:</label>
                <input type="text" bind:value={updatedSIN} disabled={updateVisibility}>
            </div>
            <div class="form-group">
                <label>First Name:</label>
                <input type="text" bind:value={updatedFirstName}>
            </div>
            <div class="form-group">
                <label>Last Name:</label>
                <input type="text" bind:value={updatedLastName}>
            </div>
            <div class="form-group">
                <label>Person ID:</label>
                <input type="text" bind:value={updatedPersonID}>
            </div>
            <div class="form-group">
                <label>Positions:</label>
                <input type="text" bind:value={updatedPositions}>
            </div>
            <div class="form-group">
                <label>Hotel ID:</label>
                <select class="form-select" bind:value={updatedHotelID}>
                    {#each hotels as hotel}
                        <option value={hotel.id}>{hotel.name}</option>
                    {/each}
                </select>
            </div>
            <button id='centerBtn' hidden={!updateVisibility} on:click={handleUpdate}>Update</button>
            <button id='centerBtn' hidden={!createVisibility} on:click={handleCreate}>Create</button>
        
        </div>
    </div>
  </div>