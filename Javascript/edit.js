document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = parseInt(urlParams.get("id"));
    const form = document.querySelector("form");

    if (!form) {
        console.error("Form element not found!");
        return;
    }

    function loadUserData() {
        try {
            const studentsData = JSON.parse(localStorage.getItem("studentsData")) || {
                students: [],
                metadata: {
                    totalStudents: 0,
                    lastUpdated: new Date().toISOString()
                }
            };
            
            const student = studentsData.students.find(s => s.id === userId);

            if (!student) {
                alert("Record not found!");
                window.location.href = "index.html";
                return;
            }

            // Get all form fields
            const fields = ['usn', 'name', 'email', 'dept', 'mobile', 'gender', 'address', 'hobbies'];
            
            // Set values for each field if it exists
            fields.forEach(field => {
                const element = document.getElementById(field);
                if (element) {
                    element.value = student[field] || '';
                } else {
                    console.warn(`Field ${field} not found in the form`);
                }
            });
        } catch (error) {
            console.error("Error loading user data:", error);
            alert("Error loading student data. Please try again.");
        }
    }

    function submitHandler(event) {
        event.preventDefault();

        try {
            const dept = document.getElementById("dept")?.value;
            const gender = document.getElementById("gender")?.value;

            if (!dept || !gender || dept === "null" || gender === "null") {
                alert("Please select a valid Department and Gender");
                return;
            }

            const mobile = document.getElementById("mobile")?.value;
            if (!mobile || !/^\d{10}$/.test(mobile)) {
                alert("Mobile number must be 10 digits.");
                return;
            }

            const updatedStudent = {
                id: userId,
                usn: document.getElementById("usn")?.value || '',
                name: document.getElementById("name")?.value || '',
                email: document.getElementById("email")?.value || '',
                dept: dept,
                mobile: mobile,
                gender: gender,
                address: document.getElementById("address")?.value || '',
                hobbies: document.getElementById("hobbies")?.value || ''
            };

            let studentsData = JSON.parse(localStorage.getItem("studentsData")) || {
                students: [],
                metadata: {
                    totalStudents: 0,
                    lastUpdated: new Date().toISOString()
                }
            };

            // Update the student in the array
            studentsData.students = studentsData.students.map(s => 
                s.id === userId ? updatedStudent : s
            );

            // Update metadata
            studentsData.metadata.lastUpdated = new Date().toISOString();
            
            localStorage.setItem("studentsData", JSON.stringify(studentsData));
            alert("Details updated successfully!");
            window.location.href = "index.html";
        } catch (error) {
            console.error("Error updating student data:", error);
            alert("Error updating student data. Please try again.");
        }
    }

    // Load the data and set up event listener
    loadUserData();
    form.addEventListener("submit", submitHandler);
});
