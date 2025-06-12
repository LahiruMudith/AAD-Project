// On document ready
$(document).ready(function () {
    const email = localStorage.getItem('email');
    if (!email) {
        window.location.href = 'signin.html';
    } else {
        $('#welcome-message').text('Welcome, ' + email);
        fetchEmployees();
    }

    // Initially hide update button
    $('#update-employee').hide();
});

// Save employee with image upload
$('#save-employee').on('click', function () {
    const formData = new FormData();
    formData.append('ename', $('#ename').val());
    formData.append('enumber', $('#enumber').val());
    formData.append('eaddress', $('#eaddress').val());
    formData.append('edepartment', $('#edepartment').val());
    formData.append('estatus', $('#estatus').val());

    const fileInput = $('#eimage')[0];
    if (fileInput.files.length > 0) {
        formData.append('eimage', fileInput.files[0]);
    } else {
        alert('Please select an image to upload.');
        return;
    }

    $.ajax({
        method: 'POST',
        url: 'http://localhost:8080/EMS_Web_exploded/employee',
        processData: false,
        contentType: false,
        data: formData,
        success: function (response) {
            if (response.code === '200') {
                alert('Employee saved successfully!');
                window.location.reload();
            } else {
                alert('Error: ' + response.message);
            }
        },
        error: function () {
            alert('Failed to save employee.');
        }
    });
});

// Fetch and render employee data
function fetchEmployees() {
    $.ajax({
        method: 'GET',
        url: 'http://localhost:8080/EMS_Web_exploded/employee',
        success: function (response) {
            if (response.code === '200') {
                const employees = response.data;
                const employeeTable = $('#employee-table tbody');
                employeeTable.empty();

                employees.forEach(function (employee) {
                    employeeTable.append(`
                        <tr>
                            <td>
                                <button class="btn btn-primary" onclick="editEmployee('${employee.eid}')">Edit</button>
                                <button class="btn btn-danger" onclick="deleteEmployee('${employee.eid}')">Delete</button>
                            </td>
                            <td>${employee.ename}</td>
                            <td>${employee.enumber}</td>
                            <td>${employee.eaddress}</td>
                            <td>${employee.edepartment}</td>
                            <td>${employee.estatus}</td>
                            <td>
                                <img src="../assets/${employee.eimage}" alt="Employee Image" width="60" height="60" class="rounded-circle" />
                            </td>
                        </tr>
                    `);
                });
            } else {
                alert('Error fetching employees: ' + response.message);
            }
        },
        error: function () {
            alert('Failed to fetch employees.');
        }
    });
}

// Delete employee
function deleteEmployee(eid) {
    if (!confirm('Are you sure you want to delete this employee?')) return;

    $.ajax({
        method: 'DELETE',
        url: `http://localhost:8080/EMS_Web_exploded/employee?eid=${eid}`,
        success: function (response) {
            if (response.code === '200') {
                alert('Employee deleted successfully!');
                fetchEmployees();
            } else {
                alert('Error: ' + response.message);
            }
        },
        error: function () {
            alert('Failed to delete employee.');
        }
    });
}

// Edit employee (fill form)
function editEmployee(eid) {
    $.ajax({
        method: 'GET',
        url: 'http://localhost:8080/EMS_Web_exploded/employee',
        success: function (response) {
            const employee = response.data.find(emp => emp.eid === eid);
            if (employee) {
                $('#eid').val(employee.eid); // hidden input
                $('#ename').val(employee.ename);
                $('#enumber').val(employee.enumber);
                $('#eaddress').val(employee.eaddress);
                $('#edepartment').val(employee.edepartment);
                $('#estatus').val(employee.estatus);

                $('#save-employee').hide();
                $('#update-employee').show();
                $('#eimage').hide();
            } else {
                alert('Employee not found!');
            }
        },
        error: function () {
            alert('Error fetching employee for edit.');
        }
    });
}

// Update employee (without image)
$('#update-employee').on('click', function () {
    const eid = $('#eid').val();

    const formData = new FormData();
    formData.append('eid', $('#eid').val());
    formData.append('ename', $('#ename').val());
    formData.append('enumber', $('#enumber').val());
    formData.append('eaddress', $('#eaddress').val());
    formData.append('edepartment', $('#edepartment').val());
    formData.append('estatus', $('#estatus').val());

    $.ajax({
        method: 'PUT',
        url: 'http://localhost:8080/EMS_Web_exploded/employee',
        processData: false,
        contentType: false,
        data: formData,
        success: function (response) {
            if (response.code === '200') {
                alert('Employee Update successfully!');
                window.location.reload();
            } else {
                alert('Error: ' + response.message);
            }
        },
        error: function () {
            alert('Failed to Update employee.');
        }
    });
});
