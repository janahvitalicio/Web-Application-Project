const Sequelize = require('sequelize');

let sequelize = new Sequelize('d99lvop9p01efl', 'bhlfxcczmoqxbg', '82229f026cb07bb52dd3fbb0ad34b76344c9d241b610c1d01fef8380b58c8788', {
    host: 'ec2-54-221-198-156.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: true
    }
});

let Employee = sequelize.define('employee', {
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    hireDate: Sequelize.STRING
});

let Department = sequelize.define('department', {
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
});

Department.hasMany(Employee, { foreignKey: 'department' });

module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        sequelize.sync()
            .then((Employee) => {
                resolve("Employee synched successfully.");
            })
            .then((Department) => {
                resolve("Department synched successfully.");
            })
            .catch(() => {
                reject("Unable to sync the database.");
            });
    });
}

module.exports.getAllEmployees = function () {
    return new Promise((resolve, reject) => {
        Employee.findAll()
            .then((data) => {
                resolve(data);
            }).catch(() => {
                reject("No results returned.");
            });
    });
}

module.exports.getDepartments = function () {
    return new Promise((resolve, reject) => {
        Department.findAll()
            .then((data) => {
                resolve(data);
            })
            .catch(() => {
                reject("No results returned.");
            });
    });
}

module.exports.addEmployee = function (employeeData) {
    return new Promise((resolve, reject) => {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for (let i in employeeData) {
            if (employeeData[i] == "") {
                employeeData[i] = null;
            }
        }
        Employee.create({
            employeeNum: employeeData.employeeNum,
            firstName: employeeData.firstName,
            lastName: employeeData.lastName,
            email: employeeData.email,
            SSN: employeeData.SSN,
            addressStreet: employeeData.addressStreet,
            addressCity: employeeData.addressCity,
            addressState: employeeData.addressState,
            addressPostal: employeeData.addressPostal,
            isManager: employeeData.isManager,
            employeeManagerNum: employeeData.employeeManagerNum,
            status: employeeData.status,
            department: employeeData.department,
            hireDate: employeeData.hireDate
        })
            .then(() => {
                resolve("Employee created successfully.");
            })
            .catch(() => {
                reject("Unable to create employee.");
            })
    });
}

module.exports.getEmployeesByStatus = function (status) {
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: { status: status }
        })
            .then((data) => {
                resolve(data);
            })
            .catch(() => {
                reject("No results returned.");
            });
    });
}

module.exports.getEmployeesByDepartment = function (department) {
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: { department: department }
        })
            .then((data) => {
                resolve(data);
            })
            .catch(() => {
                reject("No results returned.");
            });
    });
}

module.exports.getEmployeesByManager = function (manager) {
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: { employeeManagerNum: manager }
        })
            .then((data) => {
                resolve(data);
            })
            .catch(() => {
                reject("No results returned.");
            });
    });
}

module.exports.getEmployeeByNum = function (num) {
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: { employeeNum: num }
        })
            .then((data) => {
                resolve(data[0]);
            })
            .catch(() => {
                reject("No results returned.");
            });
    });
}

module.exports.updateEmployee = function (employeeData) {
    return new Promise((resolve, reject) => {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for (let i in employeeData) {
            if (employeeData[i] == "") {
                employeeData[i] = null;
            }
        }
        Employee.update(employeeData, {
            where: { employeeNum: employeeData.employeeNum }
        })
            .then(() => {
                resolve("Update successful.");
            })
            .catch(() => {
                reject("Unable to update employee.");
            });
    });
}

module.exports.addDepartment = function (departmentData) {
    return new Promise((resolve, reject) => {
        for (let i in departmentData) {
            if (departmentData[i] == "") {
                departmentData[i] = null;
            }
        }
        Department.create({
            departmentId: departmentData.departmentId,
            departmentName: departmentData.departmentName
        })
        .then(() => {
            resolve("Department created successfully.");
        })
        .catch(() => {
            reject("Unable to create department.");
        })
    });
}

module.exports.updateDepartment = function (departmentData) {
    return new Promise((resolve, reject) => {
        for (let i in departmentData) {
            if (departmentData[i] == "") {
                departmentData[i] = null;
            }
        }
        Department.update({
            departmentName: departmentData.departmentName
        }, {
            where: {departmentId: departmentData.departmentId}
        })
        .then(() => {
            resolve("Department updated successfully.");
        })
        .catch(() => {
            reject("Unable to update department.");
        })
    });
}

module.exports.getDepartmentById = function (id) {
    return new Promise((resolve, reject) => {
        Department.findAll({
            where: { departmentId: id }
        })
            .then((data) => {
                resolve(data[0]);
            })
            .catch(() => {
                reject("No results returned.");
            });
    });
}

module.exports.deleteDepartmentById = function (id) {
    return new Promise((resolve, reject) => {
        Department.destroy({
            where: {departmentId: id}
        })
        .then(() => {
            resolve("Department deleted.");
        })
        .catch(() => {
            reject("Unable to delete department.");
        });
    });
}

module.exports.deleteEmployeeByNum = function (empNum) {
    return new Promise((resolve, reject) => {
        Employee.destroy({
            where: {employeeNum: empNum}
        })
        .then(() => {
            resolve("Employee deleted.");
        })
        .catch(() => {
            reject("Unable to delete employee.");
        });
    });
}