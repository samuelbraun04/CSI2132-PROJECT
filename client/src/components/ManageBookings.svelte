<script>
  let items = [
    { id: 1, text: "Item 1" },
    { id: 2, text: "Item 2" },
    { id: 3, text: "Item 3" }
  ];

  function deleteItem(id) {
    
  }

  function changeStatus(id) {
    
  }
</script>

<style>
  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #ccc;
  }
</style>

<div>
  <h1>Manage Bookings</h1>
  
  {#each items as item}
    <div class="item">
      <div>{item.text}</div>
      <div>
        <button on:click={() => changeStatus(item.id)}>Change Status to Renting</button>
        <button on:click={() => deleteItem(item.id)}>Delete Booking</button>
      </div>
    </div>
  {/each}
</div>