<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';

    let employees = [];
    // let actionType = localStorage.getItem('action');

    onMount(async () => {
        try {
            const response = await fetch('http://localhost:3000/employees');
            if (!response.ok) {
                throw new Error('Failed to fetch employees');
            }
            employees = await response.json();
        } catch (error) {
            console.error(error);
        }
    });

    async function handleDelete(sin) {
        try {
            await fetch(`http://localhost:3000/employees/${sin}`, { method: 'DELETE' });
            // Refresh the list after deletion
            employees = employees.filter(employee => employee.SIN !== sin);
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    }

    function navigateToUpdate(employee) {
        // localStorage.setItem('employeeData', JSON.stringify(employee));
        localStorage.setItem('employeeData', employee.SIN);
        localStorage.setItem('action', 'update');
        navigate('/update-add-employees');
    }

    function navigateToAdd() {
        localStorage.setItem('action', 'insert');
        navigate('/update-add-employees');
    }
</script>

<div>
    <h1>Manage Employees</h1>
    <button id=insertBtn on:click={navigateToAdd}>Add New Employee</button>
    <table>
        <thead>
            <tr>
                <th>SIN</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Person ID</th>
                <th>Positions</th>
                <th>Hotel ID</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {#each employees as employee}
                <tr>
                    <td>{employee.SIN}</td>
                    <td>{employee.firstName}</td>
                    <td>{employee.lastName}</td>
                    <td>{employee.personID}</td>
                    <td>{employee.positions}</td>
                    <td>{employee.hotelId}</td>
                    <td>
                        <button on:click={() => navigateToUpdate(employee)}>Update</button>
                        <button on:click={() => handleDelete(employee.SIN)}>Delete</button>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>