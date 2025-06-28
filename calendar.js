class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = null;
        this.monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        this.dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.render();
        this.updateTodayInfo();
    }
    
    bindEvents() {
        document.getElementById('prevBtn').addEventListener('click', () => {
            this.previousMonth();
        });
        
        document.getElementById('nextBtn').addEventListener('click', () => {
            this.nextMonth();
        });
    }
    
    previousMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.render();
    }
    
    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.render();
    }
    
    render() {
        this.renderHeader();
        this.renderCalendar();
    }
    
    renderHeader() {
        const monthYear = document.getElementById('monthYear');
        monthYear.textContent = `${this.monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
    }
    
    renderCalendar() {
        const calendar = document.getElementById('calendar');
        calendar.innerHTML = '';
        
        // Add day headers
        this.dayNames.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'day-header';
            dayHeader.textContent = day;
            calendar.appendChild(dayHeader);
        });
        
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // First day of the month and how many days in month
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        
        // Previous month's trailing days
        const prevMonth = new Date(year, month - 1, 0);
        const prevMonthDays = prevMonth.getDate();
        
        // Add previous month's trailing days
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            const dayCell = this.createDayCell(prevMonthDays - i, true);
            calendar.appendChild(dayCell);
        }
        
        // Add current month's days
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = this.createDayCell(day, false);
            calendar.appendChild(dayCell);
        }
        
        // Add next month's leading days to fill the grid
        const totalCells = calendar.children.length - 7; // Subtract day headers
        const remainingCells = 42 - totalCells; // 6 rows × 7 days
        
        for (let day = 1; day <= remainingCells; day++) {
            const dayCell = this.createDayCell(day, true);
            calendar.appendChild(dayCell);
        }
    }
    
    createDayCell(day, isOtherMonth) {
        const dayCell = document.createElement('div');
        dayCell.className = 'day-cell';
        dayCell.textContent = day;
        
        if (isOtherMonth) {
            dayCell.classList.add('other-month');
        }
        
        // Check if it's today
        const today = new Date();
        const cellDate = new Date(
            this.currentDate.getFullYear(),
            this.currentDate.getMonth(),
            day
        );
        
        if (!isOtherMonth && 
            cellDate.toDateString() === today.toDateString()) {
            dayCell.classList.add('today');
        }
        
        // Add click event
        dayCell.addEventListener('click', () => {
            if (!isOtherMonth) {
                this.selectDate(day);
            }
        });
        
        return dayCell;
    }
    
    selectDate(day) {
        // Remove previous selection
        const prevSelected = document.querySelector('.day-cell.selected');
        if (prevSelected) {
            prevSelected.classList.remove('selected');
        }
        
        // Add selection to clicked day
        event.target.classList.add('selected');
        
        this.selectedDate = new Date(
            this.currentDate.getFullYear(),
            this.currentDate.getMonth(),
            day
        );
        
        this.updateTodayInfo();
    }
    
    updateTodayInfo() {
        const todayInfo = document.getElementById('todayInfo');
        const today = new Date();
        const todayStr = today.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        let infoText = `Today: ${todayStr}`;
        
        if (this.selectedDate) {
            const selectedStr = this.selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            infoText += `<br>Selected: ${selectedStr}`;
        }
        
        todayInfo.innerHTML = infoText;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Calendar();
});