document.addEventListener('DOMContentLoaded', () => {
    const calendarTitle = document.getElementById('calendar-title');
    const calendarBody = document.getElementById('calendar-body');
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');
    const reminderModal = document.getElementById('reminder-modal');
    const closeBtn = document.querySelector('.close-btn');
    const saveReminderBtn = document.getElementById('save-reminder');
    const reminderText = document.getElementById('reminder-text');
    const selectedDateInput = document.getElementById('selected-date');
    
    let currentYear = 2024;
    let currentMonth = new Date().getMonth();
    const reminders = {};

    const holidays = {
        '2024': {
            '01-01': 'Confraternização Universal',
            '12-02': 'Carnaval',
            '13-02': 'Carnaval',
            '29-03': 'Sexta-feira Santa',
            '21-04': 'Tiradentes',
            '01-05': 'Dia do Trabalho',
            '08-06': 'Corpus Christi',
            '07-09': 'Independência do Brasil',
            '12-10': 'Nossa Senhora Aparecida',
            '02-11': 'Finados',
            '15-11': 'Proclamação da República',
            '25-12': 'Natal'
        }
    };

    function renderCalendar(year, month) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const startDay = new Date(year, month, 1).getDay();
        
        calendarBody.innerHTML = '';

        const dayHeaders = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        dayHeaders.forEach(day => {
            const header = document.createElement('div');
            header.className = 'day day-header';
            header.textContent = day;
            calendarBody.appendChild(header);
        });

        for (let i = 0; i < startDay; i++) {
            const emptyDay = document.createElement('div');
            calendarBody.appendChild(emptyDay);
        }


        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'day';
            const dateStr = `${String(day).padStart(2, '0')}-${String(month + 1).padStart(2, '0')}`;
            dayElement.textContent = day;

            const holidayName = holidays[year]?.[dateStr];
            if (holidayName) {
                dayElement.classList.add('holiday');
                dayElement.title = holidayName;
                dayElement.innerHTML += `<div class="holiday-name">${holidayName}</div>`;
            }

            const reminderKey = `${String(day).padStart(2, '0')}-${String(month + 1).padStart(2, '0')}`;
            if (reminders[year]?.[reminderKey]) {
                const reminderElement = document.createElement('div');
                reminderElement.className = 'reminder';
                reminderElement.textContent = reminders[year][reminderKey];
                dayElement.appendChild(reminderElement);
            }

            dayElement.addEventListener('click', () => {
                selectedDateInput.value = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                reminderText.value = reminders[year]?.[reminderKey] || '';
                reminderModal.style.display = 'flex';
            });

            calendarBody.appendChild(dayElement);
        }

        calendarTitle.textContent = `${new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date(year, month))} ${year}`;
        
        
        prevMonthButton.disabled = (year === 2024 && month === 0);
        nextMonthButton.disabled = (year === 2024 && month === 11);
    }

    function changeMonth(offset) {
        currentMonth += offset;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        } else if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentYear, currentMonth);
    }

    prevMonthButton.addEventListener('click', () => changeMonth(-1));
    nextMonthButton.addEventListener('click', () => changeMonth(1));

    closeBtn.addEventListener('click', () => {
        reminderModal.style.display = 'none';
    });

    saveReminderBtn.addEventListener('click', () => {
        const date = selectedDateInput.value;
        if (date && reminderText.value) {
            if (!reminders[currentYear]) reminders[currentYear] = {};
            reminders[currentYear][date.substring(5)] = reminderText.value;
            reminderModal.style.display = 'none';
            renderCalendar(currentYear, currentMonth);
        }
    });

    renderCalendar(currentYear, currentMonth);
});
