document.addEventListener('DOMContentLoaded', function() {
    const userList = document.getElementById("userList");

    // Initialize default data structure
    const defaultData = {
        students: [],
        metadata: {
            totalStudents: 0,
            lastUpdated: new Date().toISOString()
        }
    };

    // Load data from localStorage
    function loadStudentsData() {
        const storedData = localStorage.getItem("studentsData");
        if (storedData) {
            return JSON.parse(storedData);
        }
        // If no data exists, initialize with default structure
        localStorage.setItem("studentsData", JSON.stringify(defaultData));
        return defaultData;
    }

    let studentsData = loadStudentsData();

    // Render students table
    function renderStudents() {
        if (!userList) {
            console.error('userList element not found!');
            return;
        }
        const students = studentsData.students;

        if (students.length === 0) {
            userList.innerHTML = `<tr><td colspan="10" style="text-align:center;">No students found</td></tr>`;
            return;
        }

        userList.innerHTML = "";

        students.forEach((student) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${student.id}</td>
                <td>${student.usn}</td>
                <td>${student.name}</td>
                <td>${student.email}</td>
                <td>${student.dept}</td>
                <td>${student.mobile}</td>
                <td>${student.gender}</td>
                <td>${student.address}</td>
                <td>${student.hobbies}</td>
                <td class="actions">
                    <button class="edit-btn" onclick="editStudent(${student.id})">Edit</button>
                    <button class="delete-btn" onclick="deleteStudent(${student.id})">Delete</button>
                </td>
            `;
            userList.appendChild(row);
        });

        // Update metadata
        studentsData.metadata.totalStudents = students.length;
        studentsData.metadata.lastUpdated = new Date().toISOString();
        localStorage.setItem("studentsData", JSON.stringify(studentsData));
    }

    // Edit student
    window.editStudent = function(id) {
        window.location.href = `update.html?id=${id}`;
    }

    // Delete student
    window.deleteStudent = function(id) {
        if (confirm('Are you sure you want to delete this student?')) {
            studentsData.students = studentsData.students.filter(student => student.id !== id);
            localStorage.setItem("studentsData", JSON.stringify(studentsData));
            renderStudents();
        }
    }

    // Export data to CSV
    window.exportToCSV = function() {
        const students = studentsData.students;
        if (students.length === 0) {
            alert('No data to export');
            return;
        }

        const headers = ['ID', 'USN', 'Name', 'Email', 'Department', 'Mobile', 'Gender', 'Address', 'Hobbies'];
        const csvContent = [
            headers.join(','),
            ...students.map(student => [
                student.id,
                student.usn,
                student.name,
                student.email,
                student.dept,
                student.mobile,
                student.gender,
                `"${student.address}"`,
                `"${student.hobbies}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'student_records.csv';
        link.click();
    }

    // Initialize the application
    renderStudents();
});
