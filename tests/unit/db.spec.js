import { MongoClient } from "mongodb";
import { mongoConnectionString } from "../../config/config";

const clearDB = async (db) => {
  if (await db.collection("lead").countDocuments()) {
    await db.collection("lead").drop();
  }
  if (await db.collection("user").countDocuments()) {
    await db.collection("user").drop();
  }
  if (await db.collection("bank-accounts").countDocuments()) {
    await db.collection("bank-accounts").drop();
  }
};

const mockUser = {
  _id: "60f81f20338e9431e700fe7b",
  mobileNo: "9474005270",
  fullName: "Aman Gupta",
  emailId: "aman@thechefkart.com",
  profession: "CTO",
  profilePic:
    "https://res.cloudinary.com/chefkart/image/upload/v1626066807/chefkart/nthle0crb06u4tskr4cb.jpg",
  defaultAccountId: null,
  accountCreatedAt: 1625501822481.0,
  updatedAt: 1626066878620.0,
};

const mockLead = {
  _id: "60d846f27650ea1cf1fae551",
  fullName: "Nikhil",
  mobileNo: "7373737373",
  householdType: "Family",
  society: "Happy Home",
  sector: "Sector 7",
  shiftDate: "30-07-2021",
  requirementNeeded: "Within a week",
  createdBy: "60cf25e345835c800f2cb6e4",
  status: null,
  payment: {
    amount: "500",
    paidDate: 1626504990471.0,
    paidAccount: null,
  },
  createdAt: 1624786674725.0,
  updatedAt: 1626504990511.0,
};

describe("insert", () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(mongoConnectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db("test-db");
    clearDB(db);
  });

  afterAll(async () => {
    await connection.close();
  });

  it("Should Create a new User", async () => {
    const users = db.collection("user");
    await users.insertOne(mockUser);

    const insertedUser = await users.findOne({
      _id: "60f81f20338e9431e700fe7b",
    });
    expect(insertedUser).toEqual(mockUser);
  });

  it("Should Not Create a Duplicate User", async () => {
    const users = db.collection("user");
    await users.insertOne(mockUser).catch((e) => {});

    const insertedUser = await users.findOne({
      _id: "60f81f20338e9431e700fe7b",
    });
    expect(insertedUser).toEqual(null);
  });

  it("Should create a Lead", async () => {
    const leads = db.collection("lead");
    await leads.insertOne(mockLead);

    const insertedLead = await leads.findOne({
      _id: "60d846f27650ea1cf1fae551",
    });
    expect(insertedLead).toEqual(mockLead);
  });

  it("Should create a Duplicate Lead", async () => {
    const leads = db.collection("lead");
    await leads.insertOne(mockLead).catch((e) => {});

    const insertedLead = await leads.findOne({
      _id: "60d846f27650ea1cf1fae551",
    });
    expect(insertedLead).toEqual(mockLead);
  });
});
