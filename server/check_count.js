const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
    const count = await User.countDocuments();
    console.log('User count:', count);
    process.exit(0);
})
.catch(err => {
    console.error(err);
    process.exit(1);
});
