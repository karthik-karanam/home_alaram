// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const nodemailer = require('nodemailer');
const path = require('path');
const swagger = require('./swagger');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


// Create an instance of Express.js
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Configure Sequelize with MySQL database connection details
const sequelize = new Sequelize('alarm', 'root', '123456', {
  host: 'localhost',
  dialect: 'mysql',
});
// Sync the model with the database

// Define the Visitor model
const Visitor = sequelize.define('Visitor', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  purpose: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
sequelize.sync()
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch((error) => {
    console.error('Error creating database tables:', error);
  });






// Handle QR code scan and visitor details submission
app.post('/scan-qr-code', async (req, res) => {
  try {
    const { name, purpose } = req.body;

    // Create a new visitor entry
    const visitor = await Visitor.create({ name, purpose });

    // Send an email to the owner
    sendEmailToOwner(visitor);

    res.json({ message: 'Visitor details submitted successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while submitting visitor details.' });
  }
});

// Send email to the owner with visitor details
function sendEmailToOwner(visitor) {
  // Configure nodemailer with email credentials
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
       // type: 'OAuth2',
        user: 'vicky7989vick@gmail.com',
        pass:"cgpfjsfdiclhxhby"
       
      
    },
  });

  // Compose the email message
  const mailOptions = {
    from: 'vicky7989vick@gmail.com',
    to: 'karthik9959karanam@gmail.com',
    subject: 'New Visitor Details',
    text: `A new visitor is waiting at your house. Details:\n\nName: ${visitor.name}\nPurpose: ${visitor.purpose}`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}



// Serve the Swagger documentation
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Visitor API',
      version: '1.0.0',
      description: 'API documentation for the Visitor API',
    },
  },
  apis: [path.join(__dirname, 'server.js')],
};
const swaggerSpec = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /scan-qr-code:
 *   post:
 *     summary: Submit visitor details
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               purpose:
 *                 type: string
 *             required:
 *               - name
 *               - purpose
 *     responses:
 *       200:
 *         description: Visitor details received
 *       500:
 *         description: An error occurred
 */







// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
// Start the server
app.listen(3001, () => {
  console.log('Server is running on port 3000');
});
