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

//positive test case
// API: /register
// Input: {username: 'testuser', password: 'password123'}
// Expect: res.status == 200 and res.body.message == 'Success'
// Result: This test case should pass and return a status 200 along with a "Success" message.
// Explanation: The testcase will call the /register API with the following valid inputs
// and expects the API to return a status of 200 with along with the "Success" message.
describe('Testing Register API', () => {
  it('positive : /register', done => {
    chai
      .request(server)
      .post('/register')
      .send({ username: 'testuser', password: 'password123' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equals('Success');
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
        expect(res.body.message).to.equals('Password cannot be empty');
        done();
      });
  });
});