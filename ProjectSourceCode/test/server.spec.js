// ********************** Initialize server **********************************

const server = require('../src/index'); //TODO: Make sure the path to your index.js is correctly added

// ********************** Import Libraries ***********************************

const chai = require('chai'); // Chai HTTP provides an interface for live integration testing of the API's.
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const {assert, expect} = chai;

// ********************** DEFAULT WELCOME TESTCASE ****************************

describe('Server!', () => {
  // Sample test case given to test / endpoint.
  it('Returns the default welcome message', done => {
    chai
      .request(server)
      .get('/welcome')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals('success');
        assert.strictEqual(res.body.message, 'Welcome!');
        done();
      });
  });
});

// *********************** TODO: WRITE 2 UNIT TESTCASES **************************

// ********************************************************************************
/*
//positive test case
// API: /register
// Input: {username: 'testuser', password: 'password123'}
// Expect: res.status == 200 and res.body.message == 'success'
// Result: This test case should pass and return a status 200 along with a "success" message.
// Explanation: The testcase will call the /register API with the following valid inputs
// and expects the API to return a status of 200 with along with the "success" message.
describe('Testing Register API', () => {
  it('positive : /register', done => {
    chai
      .request(server)
      .post('/register')
      .send({ username: 'testuser', password: 'password123' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});


//negative testcase
// API: /register
// Input: {username: 'testuser2', password: ''}
// Expect: res.status == 400 and res.body.message == 'Password cannot be empty'
// Result: This test case should pass and return a status 400 along with a "Password cannot be empty" message.
// Explanation: The testcase will call the /register API with the following invalid inputs
// and expects the API to return a status of 400 with along with the "Password cannot be empty" message.
describe('Testing Register API', () => {
  it('Negative : /register. Checking invalid password', done => {
    chai
      .request(server)
      .post('/register')
      .send({ username: 'testuser2', password: '' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });
});

// Positive Test Case: Successful Login
// API: /login
// Input: {username: 'testuser', password: 'password123'}
// Expect: res.status == 200 and res.body should contain a token
// Result: This test case should pass and return a status 200 along with a token.
// Explanation: The testcase will call the /login API with valid login credentials
// and expects the API to return a status of 200 with a token.
describe('Authentication API', () => {
  it('should login user successfully', (done) => {
    chai.request(server)
      .post('/login')
      .send({ username: 'testuser', password: 'password123' }) 
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('token');
        done();
      });
  });
});

// Negative Test Case: Invalid Login Credentials
// API: /login
// Input: {username: 'invaliduser', password: 'invalidpassword'}
// Expect: res.status == 401 and res.body.message == 'Invalid username or password'
// Result: This test case should pass and return a status 401 along with an error message.
// Explanation: The testcase will call the /login API with invalid login credentials
// and expects the API to return a status of 401 with an error message.
describe('Authentication API', () => {
  it('should return error for invalid login credentials', (done) => {
    chai.request(server)
      .post('/login')
      .send({ username: 'invaliduser', password: 'invalidpassword' }) 
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error').equal('Invalid username or password');
        done();
      });
  });
});

// Positive Test Case: Successful Logout
// API: /logout
// Expect: res.status == 200 and res.body.message == 'Logout successful'
// Result: This test case should pass and return a status 200 along with a success message.
// Explanation: The testcase will call the /logout API and expects the API to return a status of 200 with a success message.
describe('Authentication API', () => {
  it('should logout user successfully', (done) => {
    chai.request(server)
      .get('/logout')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message').equal('Logout successful');
        done();
      });
  });
});

// Negative Test Case: Attempt to Logout Unauthenticated User
// API: /logout
// Expect: res.status == 401 and res.body.message == 'Unauthorized'
// Result: This test case should pass and return a status 401 along with an error message.
// Explanation: The testcase will call the /logout API without being authenticated
// and expects the API to return a status of 401 with an error message.
describe('Authentication API', () => {
  it('should return error for unauthenticated user', (done) => {
    chai.request(server)
      .get('/logout')
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error').equal('Unauthorized');
        done();
      });
  });
});
*/