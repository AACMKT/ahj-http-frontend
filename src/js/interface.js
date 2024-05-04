import autosize from 'autosize';

export default class Interface {
  constructor(element) {
    this.element = element;
    this.newTicketBtn = this.newTicketBtn.bind(this);
    this.modalState = '';
    this.taskBoxId = null;
    this.Init();
  }

  static formatDate(date) {
    return new Intl.DateTimeFormat('ru', {
      dateStyle: 'short',
      timeStyle: 'short',
      timeZone: 'Europe/Moscow',
    }).format(new Date(date));
  }

  Init() {
    this.newTicketBtn();
    document.body.addEventListener('click', (e) => {
      if (e.target.id === 'add_ticket') {
        this.closeModal();
        this.modalState = 'add';
        this.modal('add');
      } else if (e.target.id === 'modal_esc') {
        this.closeModal();
        const toolTips = document.body.querySelectorAll('.tooltip');
        if (toolTips.length > 0) {
          Array.from(toolTips).forEach((el) => el.remove());
        }
      }
    });
    this.element.addEventListener('click', (e) => {
      if (e.target.id.startsWith('edit')) {
        this.modalState = 'edit';
        this.taskBoxId = e.target.dataset.id;
        this.modal('edit');
      }
      if (e.target.id.startsWith('delete')) {
        this.modalState = 'delete';
        this.taskBoxId = e.target.dataset.id;
        this.modal('delete');
      }
    });
  }

  task(dt) {
    const taskBox = document.createElement('li');
    taskBox.classList.add('task-box');
    if (dt.id) {
      taskBox.dataset.id = dt.id;
    } else if (this.element.querySelector('.tasks') != null) {
      const tasksArray = this.element.querySelectorAll('.task-box');
      if (tasksArray.length > 0) {
        const newId = Math.max(...Array.from(tasksArray).map((el) => el.id)) + 1;
        taskBox.id = String(newId);
      }
    }

    const checkboxHolder = document.createElement('div');
    checkboxHolder.classList.add('checkbox-holder');

    const checkboxLabel = document.createElement('div');
    checkboxLabel.classList.add('round', 'checkbox-label');

    const checkbox = document.createElement('input');
    checkbox.classList.add('checkbox');
    checkbox.type = 'checkbox';
    if (dt.checked) {
      checkbox.checked = dt.checked;
    } else {
      checkbox.checked = false;
    }
    checkbox.id = `checkbox-${dt.id}`;

    const label = document.createElement('label');
    label.setAttribute('for', `checkbox-${dt.id}`);

    checkboxLabel.appendChild(checkbox);
    checkboxLabel.appendChild(label);

    checkboxHolder.appendChild(checkboxLabel);

    const taskBoxText = document.createElement('div');
    taskBoxText.classList.add('task-box__text');

    const draft = document.createElement('span');
    draft.classList.add('text_draft', 'active');
    if (dt.draft) {
      draft.textContent = dt.draft;
    }

    const description = document.createElement('span');
    description.classList.add('text_details');

    taskBoxText.appendChild(draft);
    taskBoxText.appendChild(description);

    const date = document.createElement('div');
    date.classList.add('task-box__date');
    if (dt.date) {
      date.textContent = dt.date;
    }

    const controls = document.createElement('div');
    controls.classList.add('task-box__controls');

    const wrapper1 = document.createElement('div');
    wrapper1.classList.add('round');

    const edit = document.createElement('input');
    edit.classList.add('button');
    edit.type = 'button';
    edit.id = `edit-${dt.id}`;
    edit.dataset.id = `${dt.id}`;
    edit.value = '\u{270E}';

    wrapper1.appendChild(edit);

    const wrapper2 = document.createElement('div');
    wrapper2.classList.add('round');

    const del = document.createElement('input');
    del.classList.add('button');
    del.type = 'button';
    del.id = `delete-${dt.id}`;
    del.dataset.id = `${dt.id}`;
    del.value = '\u{2716}';

    wrapper2.appendChild(del);

    controls.appendChild(wrapper1);
    controls.appendChild(wrapper2);

    taskBox.appendChild(checkboxHolder);
    taskBox.appendChild(taskBoxText);
    taskBox.appendChild(date);
    taskBox.appendChild(controls);
    if (document.querySelector('.tasks') == null) {
      const tasksContainer = document.createElement('ul');
      tasksContainer.classList.add('tasks');
      this.element.appendChild(tasksContainer);
    }

    document.querySelector('.tasks').appendChild(taskBox);
  }

  modal(type) {
    const modalContainer = document.createElement('div');
    modalContainer.classList.add('modal');
    const modal = document.createElement('div');
    modal.classList.add('modal__box');
    const title = document.createElement('p');
    title.classList.add('modal_title');

    switch (type) {
      case 'add':
        title.textContent = 'Add ticket';
        modal.appendChild(title);
        break;
      case 'edit':
        title.textContent = 'Edit ticket';
        modal.appendChild(title);
        break;
      case 'delete':
        title.textContent = 'Delete ticket';
        modal.appendChild(title);
        const notification = document.createElement('p');
        notification.textContent = 'Are you sure you want to delete this ticket? This action is irreversible.';
        modal.appendChild(notification);
        break;
    }

    const btnOk = document.createElement('button');
    const btnEsc = document.createElement('button');
    btnOk.classList.add('modal_button');
    btnEsc.classList.add('modal_button');
    btnOk.textContent = 'Ok';
    btnOk.id = 'modal_Ok';
    if (type === 'add' || type === 'edit') {
      btnOk.disabled = true;
    } else {
      btnOk.disabled = false;
    }

    btnEsc.textContent = 'Escape';
    btnEsc.id = 'modal_esc';
    const btnHolder = document.createElement('div');
    btnHolder.classList.add('modal_button__holder');

    if (type === 'add' || type === 'edit') {
      const draftTitle = document.createElement('p');
      draftTitle.textContent = 'Short description';
      const draftBox = document.createElement('textarea');
      draftBox.classList.add('modal_inpt-draft');
      draftBox.dataset.id = 'draft';
      autosize(draftBox);

      const descriptionTitle = document.createElement('p');
      descriptionTitle.textContent = 'Detailed description';
      const descriptionBox = document.createElement('textarea');
      descriptionBox.classList.add('modal_inpt-details');
      descriptionBox.dataset.id = 'descr';
      autosize(descriptionBox);
      modal.appendChild(title);

      modal.appendChild(draftTitle);
      modal.appendChild(draftBox);

      modal.appendChild(descriptionTitle);
      modal.appendChild(descriptionBox);
      modal.addEventListener('change', (e) => {
        if (e.target.value.length <= 3) {
          this.toolTip(e.target);
        }
      });
      window.addEventListener('resize', () => {
        if (document.body.querySelector('.tooltip') != null) {
          Array.from(document.body.querySelectorAll('.tooltip')).forEach((el) => {
            const parent = modal.querySelector(`[data-id=${el.dataset.id}]`);
            const { right, top } = parent.getBoundingClientRect();
            el.style.left = `${right + 5}px`;
            el.style.top = `${top + parent.offsetHeight / 2 - el.offsetHeight / 2}px`;
          });
        }
      });
      modal.addEventListener('input', (e) => {
        const toolTip = document.body.querySelector(`[data-id=${e.target.dataset.id}].tooltip`);
        if (toolTip != null) {
          toolTip.remove();
        }
        if (draftBox.value.length > 3 && descriptionBox.value.length > 3) {
          console.log(draftBox.value, descriptionBox.value);
          btnOk.disabled = false;
        }
      });
    } else {
      console.log('request error');
    }
    btnHolder.appendChild(btnEsc);
    btnHolder.appendChild(btnOk);
    modal.appendChild(btnHolder);
    modalContainer.appendChild(modal);
    document.body.appendChild(modalContainer);
  }

  fillModal(dt) {
    const modal = document.querySelector('.modal');
    if (modal != null && this.modalState === 'edit') {
      const modalDraftBox = modal.querySelector('.modal_inpt-draft');
      const modalDetailstBox = modal.querySelector('.modal_inpt-details');
      modalDraftBox.textContent = dt.draft;
      modalDetailstBox.textContent = dt.details;
    }
  }

  closeModal() {
    const modal = document.querySelector('.modal');
    if (modal != null) {
      document.querySelector('.modal').remove();
    }
  }

  newTicketBtn() {
    if (this.element.querySelector('.add_button__holder') == null) {
      const newTicketBtn = document.createElement('button');
      newTicketBtn.classList.add('modal_button');
      newTicketBtn.id = 'add_ticket';
      newTicketBtn.textContent = 'Add new ticket';
      const btnHolder = document.createElement('div');
      btnHolder.classList.add('add_button__holder');
      btnHolder.appendChild(newTicketBtn);
      this.element.prepend(btnHolder);
    }
  }

  toolTip(el) {
    const { right, top } = el.getBoundingClientRect();

    const toolTip = document.createElement('div');
    toolTip.style.zIndex = 1010;
    toolTip.classList.add('tooltip');
    if (el.dataset.id) {
      toolTip.dataset.id = el.dataset.id;
    }
    document.body.appendChild(toolTip);

    toolTip.innerText = 'Input at least 4 chars!';

    toolTip.style.position = 'absolute';
    toolTip.style.zIndex = 1010;
    toolTip.style.left = `${right + 5}px`;
    toolTip.style.top = `${top + el.offsetHeight / 2 - toolTip.offsetHeight / 2}px`;
  }

  getData(id = null) {
    const modal = document.querySelector('.modal');
    const js = {};
    if (modal != null) {
      const draft = modal.querySelector('.modal_inpt-draft');
      const details = modal.querySelector('.modal_inpt-details');
      const date = Interface.formatDate(Date.now());
      js.id = id;
      js.draft = draft.value;
      js.date = date;
      js.checked = false;
      js.details = details.value;
      return js;
    }
    if (id != null && modal == null) {
      const taskBox = this.element.querySelector(`[data-id="${id}"].task-box`);
      if (taskBox != null) {
        js.id = id;
        js.draft = taskBox.querySelector('.text_draft').textContent;
        js.date = taskBox.querySelector('.task-box__date').textContent;
        js.checked = taskBox.querySelector('.checkbox').checked;
        js.details = taskBox.querySelector('.text_details').textContent;
        return js;
      }
    } else {
      console.log('Something went wrong');
    }
  }

  refreshData(dt) {
    if (dt) {
      if (dt.id) {
        let taskBox = this.element.querySelector(`[data-id="${dt.id}"].task-box`);
        if (taskBox === null) {
          taskBox = this.element.querySelector(`#"${dt.id}"`);
        }
        if (taskBox != null) {
          if (dt.draft) {
            taskBox.querySelector('.text_draft').textContent = dt.draft;
          }
          if (dt.date) {
            taskBox.querySelector('.task-box__date').textContent = dt.date;
          }
          if (dt.checked) {
            taskBox.querySelector('.checkbox').checked = dt.checked;
          }
          if (dt.details) {
            const details = taskBox.querySelector('.text_details');
            details.textContent = dt.details;
            details.classList.add('active');
          }
        }
      }
    }
  }

  removeTask() {
    this.element.querySelector(`[data-id="${this.taskBoxId}"].task-box`).remove();
  }

  loadingIconAdd() {
    const loaderContainer = document.createElement('div');
    loaderContainer.classList.add('modal');
    loaderContainer.id = 'loader';
    const loader = document.createElement('img');
    loader.src = './assets/images/loading.svg';
    loader.classList.add('loader');
    loaderContainer.appendChild(loader);
    document.body.appendChild(loaderContainer);
  }

  loadingIconRemove() {
    const loader = document.body.querySelector('#loader');
    if (loader != null) {
      loader.remove();
    }
  }
}
