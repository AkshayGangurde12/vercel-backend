import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import doctorModel from '../models/doctorModel.js';

export const googleAuth = async (req, res) => {
  try {
    const { email, name, photoURL, uid, role } = req.body;
    console.log('Received Google auth request:', { email, name, role });

    // Validate required fields
    if (!email || !name || !uid || !role) {
      console.log('Missing required fields:', { email, name, uid, role });
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    let user;
    let token;

    if (role === 'doctor') {
      try {
        // Handle doctor authentication
        user = await doctorModel.findOne({ email });
        console.log('Existing doctor found:', user ? 'Yes' : 'No');
        
        if (!user) {
          console.log('Creating new doctor account');
          // Create new doctor if doesn't exist
          const doctorData = {
            name,
            email,
            password: uid, // Use Firebase UID as password for Google auth
            speciality: 'General',
            degree: 'N/A',
            experience: 'N/A',
            about: 'N/A',
            fees: 0,
            address: 'N/A',
            available: true,
            image: {
              base64: photoURL || '',
              mimeType: 'image/jpeg'
            },
            patients: [], // Initialize empty patients array
            date: new Date()
          };
          console.log('Creating doctor with data:', doctorData);
          user = await doctorModel.create(doctorData);
          console.log('New doctor created successfully');
        } else {
          // Update last login time
          user.lastLogin = new Date();
          await user.save();
          console.log('Existing doctor updated');
        }

        // Generate JWT token for doctor
        token = jwt.sign(
          { 
            id: user._id,
            email: user.email,
            role: 'doctor',
            authProvider: 'google'
          },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '7d' }
        );
        console.log('JWT token generated for doctor');
      } catch (doctorError) {
        console.error('Doctor authentication error:', doctorError);
        throw doctorError;
      }
    } else {
      try {
        // Handle regular user authentication
        user = await userModel.findOne({ email });
        
        if (!user) {
          // Create new user if doesn't exist
          const userData = {
            name,
            email,
            password: uid, // Use Firebase UID as password for Google auth
            image: {
              base64: photoURL || '',
              mimeType: 'image/jpeg'
            },
            phone: '00000000000',
            gender: 'Not Selected',
            dob: 'Not Selected',
            bloodGroup: 'Not Provided',
            age: 0,
            authorizedDoctors: [],
            emergencyContact: 'Not Provided',
            allergies: 'None',
            vaccinationHistory: 'None',
            healthInsurancePolicy: 'None',
            doctorAssigned: {
              name: null,
              email: null
            },
            permanentAddress: 'Not Provided',
            correspondenceAddress: 'Not Provided',
            lane: 'Not Provided',
            city: 'Not Provided',
            state: 'Not Provided',
            country: 'Not Provided',
            postalCode: 'Not Provided',
            landmark: 'Not Provided',
            alternativeContact: 'Not Provided',
            addressType: 'Not Selected',
            additionalNotes: 'No additional notes'
          };
          
          user = await userModel.create(userData);
          console.log('New user created successfully');
        } else {
          // Update last login time
          user.lastLogin = new Date();
          await user.save();
          console.log('Existing user updated');
        }

        // Generate JWT token for user
        token = jwt.sign(
          { 
            id: user._id,
            email: user.email,
            role: 'user',
            authProvider: 'google'
          },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '7d' }
        );
        console.log('JWT token generated for user');
      } catch (userError) {
        console.error('User authentication error:', userError);
        throw userError;
      }
    }

    // Return success response
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        photoURL: user.image?.base64 || photoURL,
        role: role,
        authProvider: 'google'
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Error authenticating with Google',
      error: error.message
    });
  }
}; 