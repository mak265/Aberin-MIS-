const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Import Models
const User = require('./models/User');
const Category = require('./models/Category');
const Project = require('./models/Project');
const Item = require('./models/Item');
const Transaction = require('./models/Transaction');
const Order = require('./models/Order');
const ActivityLog = require('./models/ActivityLog');

// Connect to DB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/inventory-db', {
        serverSelectionTimeoutMS: 30000, // Increase timeout
        socketTimeoutMS: 45000,
    });
    console.log('MongoDB Connected for Seeding');
    await seed();
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  }
};

const seed = async () => {
  try {
    console.log('Clearing existing data...');
    
    // Drop collections (faster than deleteMany) if they exist
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        try {
            await collection.drop();
            console.log(`Dropped collection: ${collection.collectionName}`);
        } catch (error) {
            if (error.code === 26) {
                console.log(`Collection ${collection.collectionName} not found (skipped)`);
            } else {
                 console.log(`Error dropping ${collection.collectionName}:`, error.message);
            }
        }
    }

    console.log('Generating Users...');
    const roles = ['admin', 'warehouse_staff', 'site_engineer', 'client'];
    const users = [];
    const passwordHash = await bcrypt.hash('password123', 10);

    // Create a specific admin user for testing
    users.push({
      email: 'admin@test.com',
      password: passwordHash,
      role: 'admin',
      isVerified: true
    });

    // Create a specific client user for testing
    users.push({
      email: 'client@test.com',
      password: passwordHash,
      role: 'client',
      isVerified: true
    });

    for (let i = 0; i < 50; i++) {
      users.push({
        email: faker.internet.email(),
        password: passwordHash,
        role: roles[Math.floor(Math.random() * roles.length)],
        isVerified: true
      });
    }
    const createdUsers = await User.insertMany(users);
    console.log(`Created ${createdUsers.length} Users`);

    console.log('Generating Categories...');
    const constructionCategories = [
      'Cement & Aggregates',
      'Steel & Rebar',
      'Lumber & Plywood',
      'Plumbing',
      'Electrical',
      'Paints & Finishes',
      'Tools & Equipment',
      'Roofing',
      'Flooring',
      'Safety Gear'
    ];
    
    const categoryData = constructionCategories.map(name => ({
      name: name,
      description: `All kinds of ${name.toLowerCase()} for construction projects.`
    }));
    
    const createdCategories = await Category.insertMany(categoryData);
    console.log(`Created ${createdCategories.length} Categories`);

    console.log('Generating Projects...');
    const projectTypes = ['Residential', 'Commercial', 'Industrial', 'Renovation', 'Infrastructure'];
    const projectData = [];
    for (let i = 0; i < 20; i++) {
      const type = faker.helpers.arrayElement(projectTypes);
      projectData.push({
        name: `${type} - ${faker.location.street()}`,
        location: faker.location.city(),
        status: faker.helpers.arrayElement(['active', 'completed', 'on-hold']),
        description: `A ${type.toLowerCase()} construction project at ${faker.location.streetAddress()}.`
      });
    }
    const createdProjects = await Project.insertMany(projectData);
    console.log(`Created ${createdProjects.length} Projects`);

    console.log('Generating Items...');
    const constructionItems = {
      'Cement & Aggregates': ['Portland Cement', 'Sand', 'Gravel', 'Concrete Block', 'Ready Mix'],
      'Steel & Rebar': ['10mm Rebar', '12mm Rebar', '16mm Rebar', 'Steel Beam', 'Tie Wire'],
      'Lumber & Plywood': ['2x4 Coco Lumber', '2x2 Coco Lumber', '3/4 Marine Plywood', '1/2 Plywood', 'Good Lumber'],
      'Plumbing': ['PVC Pipe 1/2"', 'PVC Elbow', 'Faucet', 'Gate Valve', 'Teflon Tape'],
      'Electrical': ['THHN Wire #12', 'THHN Wire #14', 'Circuit Breaker', 'Junction Box', 'PVC Conduit'],
      'Paints & Finishes': ['Latex Paint White', 'Enamel Paint', 'Paint Roller', 'Paint Brush', 'Thinner'],
      'Tools & Equipment': ['Hammer', 'Drill', 'Shovel', 'Wheelbarrow', 'Measuring Tape'],
      'Roofing': ['GI Sheet', 'Roof Nail', 'Sealant', 'Gutter', 'Insulation'],
      'Flooring': ['Ceramic Tile 60x60', 'Grout', 'Tile Adhesive', 'Vinyl Tiles', 'Carpet'],
      'Safety Gear': ['Hard Hat', 'Safety Vest', 'Gloves', 'Safety Shoes', 'Goggles']
    };

    const itemData = [];
    for (let i = 0; i < 1000; i++) {
      const category = createdCategories[Math.floor(Math.random() * createdCategories.length)];
      const specificItems = constructionItems[category.name] || ['Generic Material'];
      const baseName = faker.helpers.arrayElement(specificItems);
      
      itemData.push({
        name: `${baseName} - ${faker.commerce.productAdjective()}`,
        itemCode: faker.string.alphanumeric(8).toUpperCase(),
        category: category._id,
        quantity: faker.number.int({ min: 0, max: 1000 }),
        unit: faker.helpers.arrayElement(['piece', 'kg', 'g', 'l', 'ml', 'box', 'pack']),
        minStock: faker.number.int({ min: 5, max: 50 }),
        price: parseFloat(faker.commerce.price({ min: 50, max: 5000 })),
        supplier: faker.company.name(),
        location: `Rack ${faker.string.alpha(1).toUpperCase()}-${faker.number.int({ min: 1, max: 50 })}`
      });
    }
    const createdItems = await Item.insertMany(itemData);
    console.log(`Created ${createdItems.length} Items`);

    console.log('Generating Transactions...');
    const transactionData = [];
    for (let i = 0; i < 3000; i++) {
      const type = faker.helpers.arrayElement(['in', 'out']);
      const item = createdItems[Math.floor(Math.random() * createdItems.length)];
      const user = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      
      let project = null;
      if (type === 'out') {
        project = createdProjects[Math.floor(Math.random() * createdProjects.length)]._id;
      }

      transactionData.push({
        item: item._id,
        user: user._id,
        type: type,
        quantity: faker.number.int({ min: 1, max: 50 }),
        project: project,
        reason: type === 'in' ? 'Restock' : 'Project Usage',
        date: faker.date.past(),
        paymentStatus: type === 'out' ? faker.helpers.arrayElement(['paid', 'unpaid']) : undefined,
        referenceNumber: type === 'out' ? faker.finance.accountNumber() : undefined
      });
    }
    await Transaction.insertMany(transactionData);
    console.log(`Created ${transactionData.length} Transactions`);

    console.log('Generating Orders...');
    const orderData = [];
    const clientUsers = createdUsers.filter(u => u.role === 'client');
    
    if (clientUsers.length > 0) {
      for (let i = 0; i < 500; i++) {
        const client = clientUsers[Math.floor(Math.random() * clientUsers.length)];
        const orderItemsCount = faker.number.int({ min: 1, max: 5 });
        const items = [];
        let totalAmount = 0;

        for (let j = 0; j < orderItemsCount; j++) {
          const item = createdItems[Math.floor(Math.random() * createdItems.length)];
          const qty = faker.number.int({ min: 1, max: 10 });
          items.push({
            item: item._id,
            quantity: qty,
            priceAtOrder: item.price
          });
          totalAmount += item.price * qty;
        }

        const type = faker.helpers.arrayElement(['pickup', 'delivery']);
        
        orderData.push({
          user: client._id,
          items: items,
          status: faker.helpers.arrayElement(['pending', 'confirmed', 'ready_for_pickup', 'out_for_delivery', 'completed', 'cancelled']),
          totalAmount: totalAmount,
          type: type,
          deliveryAddress: type === 'delivery' ? faker.location.streetAddress(true) : undefined,
          notes: faker.lorem.sentence(),
          createdAt: faker.date.past()
        });
      }
      await Order.insertMany(orderData);
      console.log(`Created ${orderData.length} Orders`);
    } else {
        console.log("No client users found to create orders");
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

connectDB();
