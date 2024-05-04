const http = 'http://localhost:7100';

export async function getAllTickets() {
  try {
    const response = await fetch(
      `${http}?method=allTickets`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      },
    );
    if (response.status === 201) {
      const data = await response.json();
      return data;
    }
    console.log('Server response error');
  } catch (err) {
    console.log(err);
    return false;
  }
}

export async function setTicket(dt) {
  try {
    const response = await fetch(
      `${http}?method=createTicket`,
      {
        method: 'POST',
        body: dt,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    if (response.status === 201) {
      const data = await response.json();
      return data;
    }
    console.log('Server response error');
  } catch (err) {
    console.log(err);
  }
}

export async function getTicketFull(id) {
  try {
    const response = await fetch(
      `${http}?method=ticketById&id=${id}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      },
    );

    if (response.status === 201) {
      const data = await response.json();
      console.log(data);
      return data;
    }
    console.log('Server response error');
  } catch (err) {
    console.log(err);
  }
}

export async function deleteTicket(id) {
  try {
    const response = await fetch(
      `${http}?method=deleteById&id=${id}`,
      {
        method: 'DELETE',
      },
    );
    if (response.status === 201) {
      console.log('Delete request successfull');
      return await response.text();
    } console.log('Server response error');
  } catch (err) {
    console.log(err);
  }
}

// let button = document.querySelector('.button');
// button.addEventListener('click', (e) => {e.preventDefault(); getTicket()})
