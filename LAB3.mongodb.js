// LAB3 MongoDB (.js) – run with: mongosh LAB3.mongodb.js
db = db.getSiblingDB("lab3_db");

// Q1 activity
db.students.drop();
db.students.insertMany([
  { name: "Aarav", enrolled_courses: ["DBMS","Python"], attendance: 82, skills: ["Python","MongoDB"], recent_activities: [{ type: "quiz", title: "NoSQL Quiz" }] },
  { name: "Diya", enrolled_courses: ["OS"], attendance: 68, skills: ["Java","Python"], recent_activities: [{ type: "workshop", title: "Git" }] },
  { name: "Kabir", enrolled_courses: ["CN"], attendance: 74, skills: ["C++"], recent_activities: [{ type: "quiz", title: "CN Quiz" }] }
]);
printjson(db.students.find({ attendance: { $lt: 75 } }).toArray());
printjson(db.students.find({ skills: "Python" }).toArray());

// Q2 events
db.events.drop();
db.events.insertMany([{ userId: "u101", eventType: "login", timestamp: new Date() }, { userId: "u101", eventType: "failed-login", timestamp: new Date() }, { userId: "u101", eventType: "failed-login", timestamp: new Date() }, { userId: "u101", eventType: "failed-login", timestamp: new Date() }, { userId: "u101", eventType: "failed-login", timestamp: new Date() }, { userId: "u102", eventType: "file-upload", timestamp: new Date() }]);
printjson(db.events.aggregate([{ $match: { eventType: "failed-login" } }, { $group: { _id: "$userId", c: { $sum: 1 } } }, { $match: { c: { $gt: 3 } } }]).toArray());

// Q3 blogs
db.blogs.drop();
db.blogs.insertMany([{ title: "Intro MongoDB", author: "Asha", category: "Database", tags: ["mongodb","nosql"], comments: [] }, { title: "Python Tips", author: "Ravi", category: "Programming", tags: ["python"], comments: [] }]);
printjson(db.blogs.find({ tags: { $all: ["mongodb","nosql"] } }).toArray());

// Q4 catalog
db.products.drop();
db.products.insertMany([{ name: "ThinkPad E14", category: "laptop", price: 65000, ram: "16GB", processor: "i7" }, { name: "Pixel 8", category: "mobile", price: 75000, batteryMah: 4575 }, { name: "EOS 1500D", category: "camera", price: 42000, lens: "18-55mm" }]);
printjson(db.products.find({ category: "mobile", batteryMah: { $gte: 4500 } }).toArray());

// Q5 orders
db.customers.drop(); db.orders.drop();
db.customers.insertMany([{ _id: "c1", name: "Amit" }, { _id: "c2", name: "Sara" }]);
db.orders.insertMany([{ customerId: "c1", items: [{ productId: "p1", qty: 2, price: 800 }] }, { customerId: "c2", items: [{ productId: "p1", qty: 1, price: 800 }] }]);
printjson(db.orders.aggregate([{ $unwind: "$items" }, { $group: { _id: "$_id", total: { $sum: { $multiply: ["$items.qty","$items.price"] } } } }]).toArray());

// Q6 visits
db.visits.drop();
db.visits.insertMany([{ page: "/home", userId: "u1", device: "mobile", browser: "Chrome", timestamp: new Date() }, { page: "/pricing", userId: "u2", device: "desktop", browser: "Firefox", timestamp: new Date() }]);
printjson(db.visits.aggregate([{ $group: { _id: "$page", views: { $sum: 1 } } }]).toArray());

// Q7 CMS
db.articles.drop();
db.articles.insertMany([{ title: "NoSQL Basics", author: "Asha", category: "DB", status: "published" }, { title: "Draft", author: "Asha", category: "DB", status: "draft" }]);
printjson(db.articles.find({ status: "published" }).toArray());

// Q8 cart
db.carts.drop();
db.carts.insertOne({ userId: "u101", items: [{ productId: "p1", qty: 2, price: 800 }] });
db.carts.updateOne({ userId: "u101" }, { $push: { items: { productId: "p2", qty: 1, price: 1500 } } });
db.carts.updateOne({ userId: "u101" }, { $set: { "items.$[e].qty": 5 } }, { arrayFilters: [{ "e.productId": "p1" }] });
printjson(db.carts.aggregate([{ $match: { userId: "u101" } }, { $unwind: "$items" }, { $group: { _id: "$userId", total: { $sum: { $multiply: ["$items.qty","$items.price"] } } } }]).toArray());

// Q9 reviews
db.reviews.drop();
db.reviews.insertMany([{ productId: "p1", rating: 5 }, { productId: "p1", rating: 4 }, { productId: "p2", rating: 2 }]);
printjson(db.reviews.aggregate([{ $group: { _id: "$productId", avg: { $avg: "$rating" }, count: { $sum: 1 } } }]).toArray());

// Q10 inventory
db.inventory.drop();
db.inventory.insertMany([{ name: "Mouse", stock: 5, minStock: 10 }, { name: "Keyboard", stock: 25, minStock: 10 }]);
printjson(db.inventory.find({ $expr: { $lt: ["$stock","$minStock"] } }).toArray());

// Q11 wallet txn (needs replica-set)
db.wallets.drop();
db.wallets.insertMany([{ userId: "alice", balance: 5000 }, { userId: "bob", balance: 2000 }]);
try {
  const sess = db.getMongo().startSession(); sess.startTransaction();
  const w = sess.getDatabase("lab3_db");
  w.wallets.updateOne({ userId: "alice", balance: { $gte: 1000 } }, { $inc: { balance: -1000 } }, { session: sess });
  w.wallets.updateOne({ userId: "bob" }, { $inc: { balance: 1000 } }, { session: sess });
  sess.commitTransaction(); sess.endSession(); print("wallet txn committed");
} catch(e) { print("wallet txn needs replica-set: " + e); }

// Q12 notifications
db.notifications.drop();
db.notifications.insertMany([{ userId: "u101", message: "Shipped", isRead: false, createdAt: new Date() }]);
printjson(db.notifications.find({ userId: "u101", isRead: false }).toArray());
db.notifications.updateMany({ userId: "u101" }, { $set: { isRead: true } });

// Q13 enrollments
db.enrollments.drop();
db.enrollments.insertMany([{ studentId: "s1", progress: 100, status: "completed" }, { studentId: "s2", progress: 45, status: "in-progress" }]);
printjson(db.enrollments.find({ progress: { $gte: 30, $lte: 80 } }).toArray());

// Q14 tracking
db.tracked_orders.drop();
db.tracked_orders.insertOne({ orderId: "O1001", statusHistory: [{ status: "Placed", timestamp: new Date() }] });
db.tracked_orders.updateOne({ orderId: "O1001" }, { $push: { statusHistory: { status: "Shipped", timestamp: new Date() } } });
printjson(db.tracked_orders.aggregate([{ $project: { orderId: 1, current: { $arrayElemAt: ["$statusHistory.status", -1] } } }]).toArray());

// Q15 news
db.news.drop();
db.news.insertMany([{ headline: "Metro Opens", category: "City", location: "Pune" }, { headline: "Opinion", author: "Asha" }]);
db.news.createIndex({ "$**": 1 });
printjson(db.news.find({ author: { $exists: true } }).toArray());
print("LAB3 done");
