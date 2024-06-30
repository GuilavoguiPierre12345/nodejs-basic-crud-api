const {default : mongoose} = require("mongoose");

//define connection with database
// const getConnection = async () => {
//     try {
//          await mongoose.connect(process.env.MONGODB_URL, {
//             useNewurlParser: true, 
//             useUnifiedTopology: true, 
            
//           });
//           console.log(`Connected to database: ${process.env.MONGODB_URL}`);
//     } catch (error) {
//         console.log(`Connection error : ${error.message}`);
//     }
// };

const getConnection = async () => {
    
         await mongoose.connect(process.env.MONGODB_URL)
          .then(() => {
              console.log(`Connected to database: ${process.env.MONGODB_URL}`);
          })
          .catch(error => {
              console.log(`Connection error : ${error.message}`);
          })
};
module.exports = {getConnection}