class UserDTO {
    constructor(firstName, middleName, lastName, email, password, signup_date = new Date().toISOString().split('T')[0]) {
        this.firstName = firstName;
        this.middleName = middleName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.signup_date = signup_date;
        this.last_login = null; 
    }
}

export default UserDTO;