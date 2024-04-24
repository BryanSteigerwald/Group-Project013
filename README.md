# FindMyClass: Simplify Your CU Boulder Course Search

## Application Overview
Our application, 'FindMyClass,' is diligently crafted to facilitate the exploration and validation of courses housed within the University of Colorado Boulder (CU Boulder) database. In today's educational landscape, where academic institutions offer an ever-expanding catalog of courses, navigating this breadth of offerings can present a daunting challenge. FindMyClass endeavors to mitigate this challenge by furnishing users with an intuitive interface for perusing the entirety of the CU Boulder course catalog.

Through the seamless functionality of FindMyClass, users can effortlessly sift through courses by employing various search parameters, such as keywords, course codes, or specific criteria. Upon submission, the application promptly retrieves and presents a comprehensive array of information pertaining to each course, encompassing details such as title, description, instructor, schedule, prerequisites, and any other pertinent data. This robust feature set not only simplifies the process of course discovery but also empowers users to make informed decisions regarding their academic pursuits.

FindMyClass stands ready to accommodate a diverse array of user needs, whether students are mapping out their semester schedules, delving into new subjects, or identifying prerequisites for advanced coursework. As such, it represents an invaluable asset in every student's academic journey, facilitating efficiency, clarity, and informed decision-making.

## Collaborators in the Group Project
Tiya Saini, Bryan Steigerwald, Eliot Pontarelli, Jonathan Tang, Nicole Nageli

## Comprehensive Technology Stack Utilized
In our innovative ecosystem, the frontend is meticulously crafted with a blend of Handlebars, JavaScript, Python, CSS, and HTML, ensuring a seamless and captivating user experience. Meanwhile, the backend architecture predominantly relies on Express, augmented with the robust capabilities of PostgreSQL and SQL databases. To streamline deployment and foster scalability, Docker serves as the cornerstone for containerization, empowering our system with efficiency and flexibility. Furthermore, our commitment to quality assurance shines through with the utilization of Mocha and Chai for comprehensive user testing, ensuring the reliability and performance of our platform exceed expectations.

## Prerequisites To Run The Application
Our application leverages Node.js, npm, and Git, but worry not about pre-installing these—they're already bundled. No prior downloads are necessary. We've streamlined the setup process, ensuring all required software is included. Simply fire up your preferred browser and terminal on any compatible operating system. That's all you need to get started.

## Running the Application Locally
1. Install Docker: Ensure Docker is installed on your system.
2. Clone the Repository: Clone the project repository by running git clone git@github.com:BryanSteigerwald/Group-Project013.git.
3. Navigate to Project Directory: Move into the cloned repository directory by executing cd Group-Project013/.
4. Enter Source Code Directory: Navigate to the source code directory by running cd ProjectSourceCode/.
5. Start Containers: Launch all containers defined in the Docker Compose file using the command docker compose up.
6. Access the Application: Open your preferred web browser and go to "http://localhost:3000/". This will direct you to our Register page.
7. Explore the Application: You should now be able to seamlessly view and interact with our application.

## Running the Tests
1. Locate Test Files: Find the test files in server.spec.js.
2. Configure Docker Compose: Open the docker-compose.yaml file.
3. Adjust Test Configuration: Look for the to-do comment at the bottom of the file. Modify it as indicated to execute the tests.

## Access the Deployed Application
http://recitation-13-team-04.eastus.cloudapp.azure.com:3000/