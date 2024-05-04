import Interface from './interface';
import {
  getAllTickets, setTicket, getTicketFull, deleteTicket,
} from './requests';

const container = document.querySelector('.container');
const interface_ = new Interface(container);

document.addEventListener('DOMContentLoaded', async () => {
  interface_.loadingIconAdd();
  const base = await getAllTickets();
  if (base) {
    base.forEach((dt) => interface_.task(dt));
  }
  setTimeout(() => interface_.loadingIconRemove(), 300);
});

document.addEventListener('click', async (e) => {
  if (e.target.id === 'modal_Ok') {
    if (interface_.modalState === 'add') {
      const dt = JSON.stringify(interface_.getData());
      interface_.loadingIconAdd();
      const res = await setTicket(dt);
      interface_.task(res);
      interface_.loadingIconRemove();
      interface_.closeModal();
    } else if (interface_.modalState === 'edit') {
      const id = interface_.taskBoxId;
      const dt = JSON.stringify(interface_.getData(id));
      interface_.loadingIconAdd();
      const res = await setTicket(dt);
      interface_.refreshData(res);
      interface_.loadingIconRemove();
      interface_.closeModal();
    } else if (interface_.modalState === 'delete') {
      const id = interface_.taskBoxId;
      const res = await deleteTicket(id);
      interface_.closeModal();
      if (res === 'deleted') {
        interface_.removeTask();
      }
    }
  }
  if (e.target.classList.contains('task-box')) {
    const details = e.target.querySelector('.text_details');
    if (details != null && details.textContent.length > 0) {
      details.textContent = '';
      details.classList.remove('active');
    } else {
      const { id } = e.target.dataset;
      interface_.loadingIconAdd();
      const dt = await getTicketFull(id);
      interface_.refreshData(dt);
      interface_.loadingIconRemove();
    }
  }
  if (e.target.id.startsWith('edit')) {
    const { id } = e.target.dataset;
    const dt = await getTicketFull(id);
    interface_.fillModal(dt);
  }
  if (e.target.classList.contains('checkbox')) {
    const { id } = e.target.closest('.task-box').dataset;
    const dt = await getTicketFull(id);
    const checboxStatus = interface_.getData(id).checked;
    console.log(checboxStatus);
    dt.checked = checboxStatus;
    await setTicket(JSON.stringify(dt));
  }
});
