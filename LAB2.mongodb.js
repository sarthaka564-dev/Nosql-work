// LAB2 MongoDB (.js) – run with: mongosh LAB2.mongodb.js
// Covers Q1(part), Q2, Q3, Q9, Q10, Q11, Q13, Q14

// ---------- Q1 + Q2: CollegeDB.Students ----------
db = db.getSiblingDB("CollegeDB");
db.Students.drop();
db.Students.insertMany([
  { Student_ID: 1, Name: "Aarav Sharma", Course: "BCA", Semester: 3, Marks: 85 },
  { Student_ID: 2, Name: "Diya Patel", Course: "BSc CS", Semester: 2, Marks: 90 },
  { Student_ID: 3, Name: "Rohan Verma", Course: "BCA", Semester: 3, Marks: 78 },
  { Student_ID: 4, Name: "Sneha Iyer", Course: "MCA", Semester: 1, Marks: 88 },
  { Student_ID: 5, Name: "Arjun Mehta", Course: "BSc CS", Semester: 4, Marks: 92 }
]);
print("Q2-all:"); printjson(db.Students.find().toArray());
print("Q2-BCA:"); printjson(db.Students.find({ Course: "BCA" }).toArray());
db.Students.updateOne({ Student_ID: 3 }, { $set: { Marks: 82 } });
db.Students.deleteOne({ Student_ID: 5 });
print("Q2-count: " + db.Students.countDocuments());

// ---------- Q3: Orders embedded ----------
db = db.getSiblingDB("ShopDB");
db.Orders.drop();
db.Orders.insertMany([
  { order_id: 1, customer: { name: "Aarav Sharma", email: "aarav@mail.com" }, products: [{ product: "Laptop", qty: 1, price: 55000 }, { product: "Mouse", qty: 2, price: 500 }], total: 56000 },
  { order_id: 2, customer: { name: "Diya Patel", email: "diya@mail.com" }, products: [{ product: "Keyboard", qty: 1, price: 2000 }], total: 2000 },
  { order_id: 3, customer: { name: "Aarav Sharma", email: "aarav@mail.com" }, products: [{ product: "SSD 1TB", qty: 2, price: 6000 }], total: 12000 },
  { order_id: 4, customer: { name: "Rohan Verma", email: "rohan@mail.com" }, products: [{ product: "Mobile", qty: 1, price: 25000 }], total: 25000 },
  { order_id: 5, customer: { name: "Sneha Iyer", email: "sneha@mail.com" }, products: [{ product: "Tablet", qty: 1, price: 18000 }], total: 18000 }
]);
print("Q3-Aarav:"); printjson(db.Orders.find({ "customer.name": "Aarav Sharma" }).toArray());
db.Orders.updateOne({ order_id: 1, "products.product": "Mouse" }, { $set: { "products.$[p].qty": 3 } }, { arrayFilters: [{ "p.product": "Mouse" }] });
print("Q3-totals:"); printjson(db.Orders.aggregate([{ $unwind: "$products" }, { $group: { _id: "$order_id", total: { $sum: { $multiply: ["$products.qty", "$products.price"] } } } }, { $sort: { _id: 1 } }]).toArray());
print("Q3-above15000:"); printjson(db.Orders.find({ total: { $gt: 15000 } }).toArray());

// ---------- Q9: single-server verify ----------
db = db.getSiblingDB("CollegeDB");
db.Students.insertOne({ Student_ID: 201, Name: "Test User", Course: "BCA", Semester: 1, Marks: 75 });
printjson(db.Students.findOne({ Student_ID: 201 }));
db.Students.updateOne({ Student_ID: 201 }, { $set: { Marks: 80 } });
db.Students.deleteOne({ Student_ID: 201 });
printjson(db.runCommand({ ping: 1 }));

// ---------- Q10: sharding demo (run on mongos) ----------
// sh.enableSharding("CollegeDB");
// sh.shardCollection("CollegeDB.Students", { Student_ID: "hashed" });
// for (let i = 1; i <= 20; i++) db.getSiblingDB("CollegeDB").Students.insertOne({ Student_ID: 100+i, Name: "Student_"+i, Course: ["BCA","BSc CS","MCA"][i%3], Semester: (i%8)+1, Marks: 60+(i*2%40) });
// sh.status();

// ---------- Q11: replica-set (run once per deployment) ----------
// rs.initiate({ _id:"rs0", members:[{ _id:0, host:"localhost:27017" },{ _id:1, host:"localhost:27018" },{ _id:2, host:"localhost:27019" }] });

// ---------- Q14: MapReduce + aggregation ----------
db = db.getSiblingDB("CollegeDB");
db.Students.mapReduce(function(){ emit(this.Course, 1); }, function(k,v){ return Array.sum(v); }, { out: "CourseCounts" });
print("MapReduce counts:"); printjson(db.CourseCounts.find().toArray());
print("Aggregation avg:"); printjson(db.Students.aggregate([{ $group: { _id: "$Course", count: { $sum: 1 }, avgMarks: { $avg: "$Marks" } } }]).toArray());
print("LAB2 done");
