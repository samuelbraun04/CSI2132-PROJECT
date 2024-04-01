<script>
    import { onMount } from 'svelte';
    let bookingDetails;

    onMount(() => {
        console.log('i made it');
        const storedDetails = localStorage.getItem('bookingDetails');
        if (storedDetails) {
            bookingDetails = JSON.parse(storedDetails);
            // Optionally clear the stored details after loading them
            localStorage.removeItem('bookingDetails');
        }
    });
</script>

{#if bookingDetails}
    <h2>Booked!</h2>
    <p>Room Number: {bookingDetails.roomNumber}</p>
    <p>Location: {bookingDetails.hotelCity}</p>
    <p>Hotel: {bookingDetails.hotelName}</p>
    <!-- More details -->
{:else}
    <p>Loading booking details...</p>
{/if}